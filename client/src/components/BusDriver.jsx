import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Clock,
  Bus,
  User,
  ArrowLeft,
  RefreshCw,
  AlertTriangle,
  Send,
  CheckCircle,
  XCircle,
  Shield,
  Users,
  Navigation,
  Play,
  Pause,
  Bell,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import {
  getBusScheduleById,
  updateBusLocation,
  addBusNotification,
} from "../api/bus";
import BusMap from "./BusMap";
import { toast, Toaster } from "react-hot-toast";
import {
  initializeSocket,
  subscribeToBus,
  unsubscribeFromBus,
  emitBusLocationUpdate,
  emitBusNotification,
} from "../services/socketService";

// Sample bus data for fallback if API fails
const SAMPLE_BUS_DATA = {
  id: "sample-bus",
  busId: "sample-bus",
  name: "Campus Express",
  busNumber: "CE-101",
  driver: "John Doe",
  capacity: "45",
  accessibility: true,
  estimatedTime: "30 min",
  currentLocation: "En Route to Main Campus",
  stops: [
    "North Gate",
    "Student Center",
    "Library",
    "Science Building",
    "Engineering Block",
    "Sports Complex",
    "South Gate",
  ],
  schedule: [
    { time: "08:00 AM", status: "On Time", notes: "Regular service" },
    { time: "09:30 AM", status: "On Time", notes: "Regular service" },
    {
      time: "11:00 AM",
      status: "Delayed (5-10 min)",
      notes: "Traffic congestion",
    },
    { time: "12:30 PM", status: "On Time", notes: "Regular service" },
    { time: "02:00 PM", status: "On Time", notes: "Regular service" },
    { time: "03:30 PM", status: "On Time", notes: "Regular service" },
    {
      time: "05:00 PM",
      status: "Delayed (5-10 min)",
      notes: "Heavy passenger load",
    },
    { time: "06:30 PM", status: "On Time", notes: "Regular service" },
  ],
  location: {
    lat: 23.8103,
    lng: 90.4125,
  },
};

const BusDriver = () => {
  const { busId } = useParams();
  const navigate = useNavigate();
  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationDescription, setLocationDescription] = useState("");
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);
  const [usedFallbackData, setUsedFallbackData] = useState(false);
  const [nextStop, setNextStop] = useState("");
  const [locationUpdateHistory, setLocationUpdateHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("route");
  const [isTracking, setIsTracking] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const [showNotificationForm, setShowNotificationForm] = useState(false);
  const [notificationType, setNotificationType] = useState("delay");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isSendingNotification, setIsSendingNotification] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Refs for tracking intervals
  const locationWatchId = useRef(null);
  const autoUpdateIntervalId = useRef(null);
  const updateCountRef = useRef(0);

  // Initialize socket and fetch bus details
  useEffect(() => {
    initializeSocket();
    fetchBusDetails();

    // Subscribe to bus updates
    subscribeToBus(busId);

    // Clean up on unmount
    return () => {
      unsubscribeFromBus(busId);
      stopLocationTracking();
    };
  }, [busId]);

  // Start or stop location tracking based on isTracking state
  useEffect(() => {
    if (isTracking) {
      startLocationTracking();
    } else {
      stopLocationTracking();
    }

    return () => {
      stopLocationTracking();
    };
  }, [isTracking]);

  // Start location tracking
  const startLocationTracking = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser.");
      return;
    }

    // Clear any existing tracking
    stopLocationTracking();

    // Start watching position with high accuracy
    locationWatchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setCurrentLocation(newLocation);

        // Auto-send location updates every 10 seconds while tracking is active
        if (!autoUpdateIntervalId.current) {
          autoUpdateIntervalId.current = setInterval(() => {
            sendLocationUpdate(newLocation);
          }, 10000); // Every 10 seconds
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        toast.error(
          "Unable to get your current location. Please check your device settings."
        );
        setIsTracking(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000, // Use a cached position if it's less than 5 seconds old
        timeout: 10000, // Wait up to 10 seconds for a position
      }
    );

    toast.success("Real-time location tracking started!");
  };

  // Stop location tracking
  const stopLocationTracking = () => {
    if (locationWatchId.current) {
      navigator.geolocation.clearWatch(locationWatchId.current);
      locationWatchId.current = null;
    }

    if (autoUpdateIntervalId.current) {
      clearInterval(autoUpdateIntervalId.current);
      autoUpdateIntervalId.current = null;
    }
  };

  // Send location update with current position
  const sendLocationUpdate = async (location) => {
    if (!location) {
      location = currentLocation;
    }

    if (!location) {
      return;
    }

    try {
      updateCountRef.current += 1;

      // Create location update data
      const locationData = {
        location: {
          lat: location.lat,
          lng: location.lng,
          description: nextStop
            ? `Near ${nextStop}`
            : `En route (update #${updateCountRef.current})`,
        },
        timestamp: new Date().toISOString(),
      };

      // Send update via API
      await updateBusLocation(busId, locationData);

      // Also emit via socket for real-time updates
      emitBusLocationUpdate(busId, locationData.location);

      // Add to history (but only if it's a manual update or every 5th automatic update)
      if (!isTracking || updateCountRef.current % 5 === 0) {
        setLocationUpdateHistory((prev) => [
          {
            location: locationData.location,
            timestamp: locationData.timestamp,
          },
          ...prev.slice(0, 19), // Keep only the 20 most recent updates
        ]);
      }

      // Update last update time
      setLastUpdateTime(new Date());

      // Only show toast for manual updates
      if (!isTracking) {
        toast.success("Location updated successfully!");
      }
    } catch (error) {
      console.error("Failed to update location:", error);
      if (!isTracking) {
        toast.error("Failed to update location. Please try again.");
      }
    }
  };

  const fetchBusDetails = async () => {
    setLoading(true);
    try {
      const data = await getBusScheduleById(busId);

      if (!data || Object.keys(data).length === 0) {
        // If no data or empty object, use fallback data
        console.warn("No bus data received, using fallback data");
        setBus({ ...SAMPLE_BUS_DATA, id: busId, busId: busId });
        setUsedFallbackData(true);
      } else {
        setBus(data);
        setUsedFallbackData(false);

        // Initialize next stop if available
        if (data.stops && data.stops.length > 0) {
          setNextStop(data.stops[0]);
        }

        // Initialize location update history if available
        if (data.locationHistory) {
          setLocationUpdateHistory(data.locationHistory);
        }

        // Initialize notifications if available
        if (data.notifications) {
          setNotifications(data.notifications);
        }
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching bus details:", err);

      // Use fallback data in case of error
      setBus({ ...SAMPLE_BUS_DATA, id: busId, busId: busId });
      setUsedFallbackData(true);
      setError(
        "Could not fetch the latest bus data. Showing sample information."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const getStatusBgColor = (status) => {
    if (status === "On Time")
      return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
    if (status.includes("Delayed"))
      return "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300";
    if (status === "Cancelled")
      return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300";
    return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
  };

  const handleSendLocation = async () => {
    if (!currentLocation) {
      toast.error("Unable to get your current location. Please try again.");
      return;
    }

    setIsUpdatingLocation(true);

    try {
      await sendLocationUpdate(currentLocation);

      // Clear form
      setLocationDescription("");
    } catch (error) {
      toast.error("Failed to update location. Please try again.");
      console.error(error);
    } finally {
      setIsUpdatingLocation(false);
    }
  };

  const toggleTracking = () => {
    setIsTracking((prev) => !prev);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getTimeSinceLastUpdate = () => {
    if (!lastUpdateTime) return "Never";

    const now = new Date();
    const diff = now - lastUpdateTime;

    if (diff < 60000) {
      return `${Math.floor(diff / 1000)} seconds ago`;
    } else if (diff < 3600000) {
      return `${Math.floor(diff / 60000)} minutes ago`;
    } else {
      return `${Math.floor(diff / 3600000)} hours ago`;
    }
  };

  // Send notification
  const handleSendNotification = async (e) => {
    e.preventDefault();

    if (!notificationMessage) {
      toast.error("Please enter a notification message");
      return;
    }

    setIsSendingNotification(true);

    try {
      // Create notification data
      const notificationData = {
        type: notificationType,
        message: notificationMessage,
        timestamp: new Date().toISOString(),
      };

      // Send notification via API
      await addBusNotification(busId, notificationData);

      // Also emit via socket for real-time updates
      emitBusNotification(busId, notificationData);

      // Add to notifications list
      setNotifications((prev) => [
        {
          ...notificationData,
          id: Date.now().toString(),
        },
        ...prev,
      ]);

      // Show success message
      toast.success("Notification sent successfully!");

      // Clear form
      setNotificationMessage("");
      setShowNotificationForm(false);
    } catch (error) {
      toast.error("Failed to send notification. Please try again.");
      console.error(error);
    } finally {
      setIsSendingNotification(false);
    }
  };

  // Get notification type details
  const getNotificationTypeDetails = (type) => {
    switch (type) {
      case "delay":
        return {
          icon: <Clock className="h-5 w-5 text-amber-500" />,
          label: "Delay",
          description: "Notify passengers about a delay in the schedule",
          bgColor: "bg-amber-50 dark:bg-amber-900/20",
          borderColor: "border-amber-200 dark:border-amber-800",
          textColor: "text-amber-800 dark:text-amber-300",
        };
      case "detour":
        return {
          icon: <RotateCcw className="h-5 w-5 text-blue-500" />,
          label: "Detour",
          description: "Notify passengers about a route change or detour",
          bgColor: "bg-blue-50 dark:bg-blue-900/20",
          borderColor: "border-blue-200 dark:border-blue-800",
          textColor: "text-blue-800 dark:text-blue-300",
        };
      case "cancellation":
        return {
          icon: <XCircle className="h-5 w-5 text-red-500" />,
          label: "Cancellation",
          description: "Notify passengers about a cancelled trip",
          bgColor: "bg-red-50 dark:bg-red-900/20",
          borderColor: "border-red-200 dark:border-red-800",
          textColor: "text-red-800 dark:text-red-300",
        };
      case "schedule_change":
        return {
          icon: <AlertCircle className="h-5 w-5 text-purple-500" />,
          label: "Schedule Change",
          description:
            "Notify passengers about a change in the regular schedule",
          bgColor: "bg-purple-50 dark:bg-purple-900/20",
          borderColor: "border-purple-200 dark:border-purple-800",
          textColor: "text-purple-800 dark:text-purple-300",
        };
      default:
        return {
          icon: <Bell className="h-5 w-5 text-gray-500" />,
          label: "Update",
          description: "Send a general update to passengers",
          bgColor: "bg-gray-50 dark:bg-gray-900/20",
          borderColor: "border-gray-200 dark:border-gray-800",
          textColor: "text-gray-800 dark:text-gray-300",
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading bus information...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={handleGoBack}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:outline-none"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="ml-4 text-xl font-bold text-gray-800 dark:text-white">
                Bus Driver Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowNotificationForm(!showNotificationForm)}
                className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-800/30"
                title="Send Notification"
              >
                <Bell className="h-5 w-5" />
              </button>
              <button
                onClick={fetchBusDetails}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title="Refresh"
              >
                <RefreshCw className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Notification Form */}
        {showNotificationForm && (
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="font-medium text-gray-800 dark:text-white">
                Send Notification
              </h3>
              <button
                onClick={() => setShowNotificationForm(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleSendNotification}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notification Type
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {["delay", "detour", "cancellation", "schedule_change"].map(
                      (type) => {
                        const typeDetails = getNotificationTypeDetails(type);
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setNotificationType(type)}
                            className={`p-3 rounded-lg border ${
                              notificationType === type
                                ? `${typeDetails.bgColor} ${typeDetails.borderColor} ring-2 ring-offset-2 ring-offset-gray-50 dark:ring-offset-gray-900 ring-blue-500`
                                : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                            } flex flex-col items-center text-center`}
                          >
                            {typeDetails.icon}
                            <span className="mt-1 font-medium text-sm text-gray-800 dark:text-white">
                              {typeDetails.label}
                            </span>
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    value={notificationMessage}
                    onChange={(e) => setNotificationMessage(e.target.value)}
                    placeholder="Enter notification message..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  ></textarea>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {getNotificationTypeDetails(notificationType).description}
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowNotificationForm(false)}
                    className="mr-3 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSendingNotification || !notificationMessage}
                    className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white ${
                      isSendingNotification || !notificationMessage
                        ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {isSendingNotification ? (
                      <>
                        <RefreshCw className="inline-block h-4 w-4 mr-1 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Notification"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Fallback Data Warning */}
        {usedFallbackData && (
          <div className="mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex items-start">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">
                Using Sample Data
              </h3>
              <p className="mt-1 text-sm text-amber-700 dark:text-amber-400">
                {error ||
                  "We couldn't fetch the latest bus information. Showing sample data instead."}
              </p>
            </div>
          </div>
        )}

        {/* Real-time Tracking Status */}
        <div
          className={`mb-6 ${
            isTracking
              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
              : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          } border rounded-lg p-4`}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {isTracking ? (
                <div className="relative">
                  <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                  <div className="absolute top-0 left-0 h-3 w-3 bg-green-500 rounded-full animate-ping"></div>
                </div>
              ) : (
                <div className="h-3 w-3 bg-gray-400 rounded-full"></div>
              )}
              <span className="ml-2 font-medium text-gray-800 dark:text-white">
                {isTracking ? "Real-time tracking active" : "Tracking inactive"}
              </span>
            </div>

            <button
              onClick={toggleTracking}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center ${
                isTracking
                  ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200"
                  : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200"
              }`}
            >
              {isTracking ? (
                <>
                  <Pause className="h-4 w-4 mr-1" />
                  Stop Tracking
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1" />
                  Start Tracking
                </>
              )}
            </button>
          </div>

          {lastUpdateTime && (
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Last update: {getTimeSinceLastUpdate()}
            </div>
          )}
        </div>

        {/* Driver Status Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {bus.driver}
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    Driver
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="px-4 py-2 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                  Bus {bus.busNumber}
                </div>

                <div
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    bus.schedule[0]?.status === "On Time"
                      ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                      : bus.schedule[0]?.status.includes("Delayed")
                      ? "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300"
                      : bus.schedule[0]?.status === "Cancelled"
                      ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                  }`}
                >
                  {bus.schedule[0]?.status || "Status Unknown"}
                </div>
              </div>
            </div>

            {/* Current Location Section */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-gray-800 dark:text-white mb-3 flex items-center">
                <Navigation className="h-5 w-5 mr-2 text-blue-500" />
                Current Location
              </h3>

              {currentLocation ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Coordinates
                    </div>
                    <div className="font-mono text-sm bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700">
                      Lat: {currentLocation.lat.toFixed(6)}, Lng:{" "}
                      {currentLocation.lng.toFixed(6)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Last Updated
                    </div>
                    <div className="font-medium text-gray-800 dark:text-white">
                      {bus.currentLocation || "Not available"}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-amber-600 dark:text-amber-400 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Waiting for location data...
                </div>
              )}
            </div>

            {/* Location Update Form */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-gray-800 dark:text-white mb-3">
                Update Your Location
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Next Stop
                  </label>
                  <select
                    value={nextStop}
                    onChange={(e) => setNextStop(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select next stop</option>
                    {bus.stops.map((stop, index) => (
                      <option key={index} value={stop}>
                        {stop}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Location Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={locationDescription}
                    onChange={(e) => setLocationDescription(e.target.value)}
                    placeholder="E.g., 'Approaching Science Building', 'Stuck in traffic'"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <button
                  onClick={handleSendLocation}
                  disabled={isUpdatingLocation || !currentLocation}
                  className={`w-full px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center ${
                    isUpdatingLocation || !currentLocation
                      ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isUpdatingLocation ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Send Manual Update
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab("route")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "route"
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                >
                  Route Information
                </button>
                <button
                  onClick={() => setActiveTab("schedule")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "schedule"
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                >
                  Schedule
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "history"
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                >
                  Update History
                </button>
                <button
                  onClick={() => setActiveTab("notifications")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "notifications"
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                >
                  Notifications
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === "route" && (
              <div className="bg-white dark:bg-gray-800 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white mb-3">
                      Bus Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Bus className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Bus Name
                          </div>
                          <div className="font-medium text-gray-800 dark:text-white">
                            {bus.name}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Estimated Trip Time
                          </div>
                          <div className="font-medium text-gray-800 dark:text-white">
                            {bus.estimatedTime}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Capacity
                          </div>
                          <div className="font-medium text-gray-800 dark:text-white">
                            {bus.capacity} passengers
                          </div>
                        </div>
                      </div>

                      {bus.accessibility && (
                        <div className="flex items-center">
                          <Shield className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Accessibility
                            </div>
                            <div className="font-medium text-gray-800 dark:text-white">
                              Wheelchair Accessible
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white mb-3">
                      Route
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="mt-1">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <div className="w-0.5 h-full bg-gray-300 dark:bg-gray-600 mx-auto my-1"></div>
                        </div>
                        <div className="ml-3">
                          <div className="font-medium text-gray-800 dark:text-white">
                            {bus.stops[0]}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Starting Point
                          </div>
                        </div>
                      </div>

                      {bus.stops.slice(1, -1).map((stop, idx) => (
                        <div key={idx} className="flex items-start">
                          <div className="mt-1">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <div className="w-0.5 h-full bg-gray-300 dark:bg-gray-600 mx-auto my-1"></div>
                          </div>
                          <div className="ml-3">
                            <div className="font-medium text-gray-800 dark:text-white">
                              {stop}
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="flex items-start">
                        <div className="mt-1">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        </div>
                        <div className="ml-3">
                          <div className="font-medium text-gray-800 dark:text-white">
                            {bus.stops[bus.stops.length - 1]}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Final Destination
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "schedule" && (
              <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {bus.schedule.map((time, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            {time.time}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBgColor(
                                time.status
                              )}`}
                            >
                              {time.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {time.notes || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "history" && (
              <div className="bg-white dark:bg-gray-800 rounded-lg">
                <div className="space-y-4">
                  {locationUpdateHistory.length > 0 ? (
                    locationUpdateHistory.map((update, idx) => (
                      <div
                        key={idx}
                        className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-gray-800 dark:text-white">
                              {update.location?.description ||
                                "Location Update"}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              Lat: {update.location?.lat.toFixed(6)}, Lng:{" "}
                              {update.location?.lng.toFixed(6)}
                            </div>
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {formatTime(update.timestamp)}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No location updates yet
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="bg-white dark:bg-gray-800 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-gray-800 dark:text-white">
                    Recent Notifications
                  </h4>
                  <button
                    onClick={() => setShowNotificationForm(true)}
                    className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md flex items-center"
                  >
                    <Bell className="h-4 w-4 mr-1" />
                    New Notification
                  </button>
                </div>

                <div className="space-y-4">
                  {notifications.length > 0 ? (
                    notifications.map((notification, idx) => {
                      const typeDetails = getNotificationTypeDetails(
                        notification.type
                      );
                      return (
                        <div
                          key={notification.id || idx}
                          className={`border rounded-lg p-4 ${typeDetails.bgColor} ${typeDetails.borderColor}`}
                        >
                          <div className="flex items-start">
                            <div className="mr-3 mt-0.5">
                              {typeDetails.icon}
                            </div>
                            <div>
                              <div className="font-medium text-gray-800 dark:text-white">
                                {typeDetails.label}
                              </div>
                              <p className={`mt-1 ${typeDetails.textColor}`}>
                                {notification.message}
                              </p>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {formatTime(notification.timestamp)}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No notifications sent yet
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* View Map Button */}
            <div className="mt-6">
              <button
                onClick={() => setShowMap(!showMap)}
                className={`w-full px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center ${
                  showMap
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200"
                }`}
              >
                <MapPin className="h-5 w-5 mr-2" />
                {showMap ? "Hide Map" : "View Map"}
              </button>
            </div>
          </div>
        </div>

        {/* Bus Map */}
        {showMap && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-800 dark:text-white">
                Current Location
              </h3>
            </div>
            <div className="h-96">
              <BusMap
                busLocation={currentLocation || { lat: 23.8103, lng: 90.4125 }}
                busInfo={{
                  name: bus.name,
                  busNumber: bus.busNumber,
                  driver: bus.driver,
                }}
                isRealTime={isTracking}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BusDriver;
