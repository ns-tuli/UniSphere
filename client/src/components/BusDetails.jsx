import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  MapPin,
  Clock,
  Bus,
  User,
  Calendar,
  AlertTriangle,
  ArrowLeft,
  Bell,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Shield,
  Users,
} from "lucide-react";
import { getBusScheduleById, updateBusLocation } from "../api/bus";
import BusMap from "./BusMap";
import { toast, Toaster } from "react-hot-toast";
import {
  initializeSocket,
  subscribeToBus,
  unsubscribeFromBus,
  onBusLocationUpdate,
  onBusNotification,
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

const BusDetails = () => {
  const { busId } = useParams();
  const navigate = useNavigate();
  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [busLocation, setBusLocation] = useState({
    lat: 23.8103,
    lng: 90.4125,
  }); // Default to Dhaka
  const [activeTab, setActiveTab] = useState("schedule");
  const [updateStatus, setUpdateStatus] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const [usedFallbackData, setUsedFallbackData] = useState(false);

  // Initialize socket and fetch bus details
  useEffect(() => {
    initializeSocket();
    fetchBusDetails();

    // Subscribe to bus updates
    subscribeToBus(busId);

    // Set up listener for location updates
    const unsubscribeLocationUpdates = onBusLocationUpdate((data) => {
      if (data.busId === busId) {
        setBusLocation({
          lat: data.location.lat,
          lng: data.location.lng,
        });

        // Show toast notification for location update
        toast.success(
          `Bus location updated: ${
            data.location.description || "New location"
          }`,
          {
            icon: <MapPin className="h-5 w-5 text-blue-500" />,
            duration: 3000,
          }
        );
      }
    });

    // Set up listener for bus notifications
    const unsubscribeNotifications = onBusNotification((data) => {
      if (data.busId === busId) {
        // Show toast notification
        const notification = data.notification;

        if (notification.type === "delay") {
          toast.error(notification.message, {
            icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
            duration: 5000,
          });
        } else if (notification.type === "cancellation") {
          toast.error(notification.message, {
            icon: <XCircle className="h-5 w-5 text-red-500" />,
            duration: 5000,
          });
        } else if (notification.type === "update") {
          toast.success(notification.message, {
            icon: <Bell className="h-5 w-5 text-blue-500" />,
            duration: 4000,
          });
        }
      }
    });

    // Clean up on unmount
    return () => {
      unsubscribeFromBus(busId);
      unsubscribeLocationUpdates();
      unsubscribeNotifications();
    };
  }, [busId]);

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

        // Initialize location if available
        if (data.location && data.location.lat && data.location.lng) {
          setBusLocation({
            lat: data.location.lat,
            lng: data.location.lng,
          });
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

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();

    if (!updateStatus && !updateMessage) {
      toast.error("Please provide a status or message for the update");
      return;
    }

    try {
      // Create update data
      const updateData = {
        status: updateStatus || undefined,
        message: updateMessage || undefined,
        timestamp: new Date().toISOString(),
      };

      // Send update
      await updateBusLocation(busId, updateData);

      // Show success message
      toast.success("Update submitted successfully!");

      // Clear form
      setUpdateStatus("");
      setUpdateMessage("");

      // Refresh bus details
      fetchBusDetails();
    } catch (error) {
      toast.error("Failed to submit update. Please try again.");
      console.error(error);
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
                Bus Details
              </h1>
            </div>
            <div className="flex items-center space-x-2">
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

        {/* Bus Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
          <div
            className={`h-2 ${
              bus.schedule[0]?.status === "On Time"
                ? "bg-green-500"
                : bus.schedule[0]?.status.includes("Delayed")
                ? "bg-amber-500"
                : bus.schedule[0]?.status === "Cancelled"
                ? "bg-red-500"
                : "bg-blue-500"
            }`}
          ></div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Bus className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Bus {bus.busNumber}
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    {bus.name}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <div
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    bus.currentLocation.includes("At")
                      ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                      : "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                  }`}
                >
                  {bus.currentLocation}
                </div>

                {bus.accessibility && (
                  <div className="px-4 py-2 rounded-full text-sm font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                    Wheelchair Accessible
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center mb-4">
                  <User className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Driver
                    </div>
                    <div className="font-medium text-gray-800 dark:text-white">
                      {bus.driver}
                    </div>
                  </div>
                </div>

                <div className="flex items-center mb-4">
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

                <div className="flex items-center mb-4">
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

                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Status
                    </div>
                    <div
                      className={`font-medium ${
                        bus.schedule[0]?.status === "On Time"
                          ? "text-green-600 dark:text-green-400"
                          : bus.schedule[0]?.status.includes("Delayed")
                          ? "text-amber-600 dark:text-amber-400"
                          : bus.schedule[0]?.status === "Cancelled"
                          ? "text-red-600 dark:text-red-400"
                          : "text-gray-800 dark:text-white"
                      }`}
                    >
                      {bus.schedule[0]?.status || "Unknown"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 dark:text-white mb-3">
                  Route
                </h3>
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

            <div className="mt-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => setShowMap(!showMap)}
                className={`px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center ${
                  showMap
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200"
                }`}
              >
                <MapPin className="h-5 w-5 mr-2" />
                {showMap ? "Hide Map" : "Track Bus"}
              </button>

              <button
                onClick={() =>
                  setActiveTab(activeTab === "update" ? "schedule" : "update")
                }
                className={`px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center ${
                  activeTab === "update"
                    ? "bg-purple-600 text-white hover:bg-purple-700"
                    : "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200"
                }`}
              >
                <Bell className="h-5 w-5 mr-2" />
                {activeTab === "update" ? "View Schedule" : "Update Status"}
              </button>

              <Link
                to={`/BusDriver/${busId}`}
                className="px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800/30"
              >
                <User className="h-5 w-5 mr-2" />
                Driver Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Bus Map */}
        {showMap && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-800 dark:text-white">
                Live Bus Tracking
              </h3>
            </div>
            <div className="h-96">
              <BusMap
                busLocation={busLocation}
                busInfo={{
                  name: bus.name,
                  busNumber: bus.busNumber,
                  driver: bus.driver,
                }}
              />
            </div>
          </div>
        )}

        {/* Schedule or Update Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          {activeTab === "schedule" ? (
            <>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-800 dark:text-white">
                  Bus Schedule
                </h3>
              </div>
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
            </>
          ) : (
            <>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-800 dark:text-white">
                  Update Bus Status
                </h3>
              </div>
              <div className="p-6">
                <form onSubmit={handleSubmitUpdate}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status Update
                    </label>
                    <select
                      value={updateStatus}
                      onChange={(e) => setUpdateStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select status (optional)</option>
                      <option value="On Time">On Time</option>
                      <option value="Delayed (5-10 min)">
                        Delayed (5-10 min)
                      </option>
                      <option value="Delayed (10-20 min)">
                        Delayed (10-20 min)
                      </option>
                      <option value="Delayed (20+ min)">
                        Delayed (20+ min)
                      </option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Message (optional)
                    </label>
                    <textarea
                      value={updateMessage}
                      onChange={(e) => setUpdateMessage(e.target.value)}
                      placeholder="Enter additional information about the bus status..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    ></textarea>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Submit Update
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default BusDetails;
