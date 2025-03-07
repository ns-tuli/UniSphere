import React, { useState, useEffect } from "react";
import {
  MapPin,
  Clock,
  Bus,
  AlertTriangle,
  Search,
  Bell,
  Menu,
  X,
  Info,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getBusSchedules, getBusNotifications } from "../api/bus";
import BusNotification from "./BusNotification";
import { initializeSocket, onBusNotification } from "../services/socketService";

export default function BusSchedule() {
  const [searchQuery, setSearchQuery] = useState("");
  const [routes, setRoutes] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // Initialize socket connection
  useEffect(() => {
    initializeSocket();
  }, []);

  // Fetch bus schedules on component mount
  useEffect(() => {
    const fetchBusSchedules = async () => {
      try {
        const schedules = await getBusSchedules();
        setRoutes(schedules);
        setFilteredRoutes(schedules);

        // Fetch initial notifications for all buses
        const fetchNotifications = async () => {
          try {
            const allNotifications = [];
            for (const bus of schedules) {
              const busNotifications = await getBusNotifications(bus.busId);
              if (busNotifications.length > 0) {
                // Add bus name to each notification
                const notificationsWithBusName = busNotifications.map(
                  (notification) => ({
                    ...notification,
                    busName: bus.name,
                  })
                );
                allNotifications.push(...notificationsWithBusName);
              }
            }

            // Sort by timestamp (newest first)
            allNotifications.sort(
              (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
            );
            setNotifications(allNotifications);
          } catch (error) {
            console.error("Error fetching notifications:", error);
          }
        };

        fetchNotifications();
      } catch (error) {
        console.error("Error fetching bus schedules:", error);
      }
    };
    fetchBusSchedules();
  }, []);

  // Listen for bus notifications
  useEffect(() => {
    const unsubscribeNotifications = onBusNotification((data) => {
      // Find the bus name
      const bus = routes.find((route) => route.busId === data.busId);
      const busName = bus ? bus.name : "Unknown Bus";

      // Add the notification with the bus name
      setNotifications((prev) => [
        {
          ...data.notification,
          busName,
        },
        ...prev,
      ]);
    });

    return () => {
      unsubscribeNotifications();
    };
  }, [routes]);

  // Filter routes based on search query and active tab
  useEffect(() => {
    let filtered = routes;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (route) =>
          route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          route.stops.some((stop) =>
            stop.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Apply tab filter
    if (activeTab === "delayed") {
      filtered = filtered.filter((route) =>
        route.schedule.some((time) => time.status.includes("Delayed"))
      );
    } else if (activeTab === "ontime") {
      filtered = filtered.filter((route) =>
        route.schedule.every(
          (time) => time.status === "On Time" || time.status === "Cancelled"
        )
      );
    }

    setFilteredRoutes(filtered);
  }, [searchQuery, activeTab, routes]);

  const getStatusBgColor = (status) => {
    if (status === "On Time")
      return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
    if (status.includes("Delayed"))
      return "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300";
    if (status === "Cancelled")
      return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300";
    return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
  };

  const handleRemoveNotification = (notificationToRemove) => {
    setNotifications((prev) =>
      prev.filter(
        (notification) =>
          notification.timestamp !== notificationToRemove.timestamp ||
          notification.message !== notificationToRemove.message
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation Bar */}
      <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:outline-none"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
              <div className="flex-shrink-0 flex items-center">
                <Bus className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <span className="ml-2 text-xl font-bold text-blue-700 dark:text-blue-300">
                  Campus Transit
                </span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search routes or stops..."
                  className="block w-64 pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                className="relative p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                    {notifications.length}
                  </span>
                )}
              </button>
              <button
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                onClick={() => setShowInfo(!showInfo)}
              >
                <Info className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            <div className="flex items-center space-x-2 md:hidden">
              <button
                className="relative p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                    {notifications.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-800 shadow-lg pb-3 px-4">
            <div className="pt-2 pb-3 space-y-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search routes or stops..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex space-x-2 mt-3">
                <button
                  className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm transition-colors duration-300 ${
                    activeTab === "all"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                  onClick={() => setActiveTab("all")}
                >
                  All Routes
                </button>
                <button
                  className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm transition-colors duration-300 ${
                    activeTab === "ontime"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                  onClick={() => setActiveTab("ontime")}
                >
                  On Time
                </button>
                <button
                  className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm transition-colors duration-300 ${
                    activeTab === "delayed"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                  onClick={() => setActiveTab("delayed")}
                >
                  Delayed
                </button>
              </div>
              <button
                className="w-full mt-3 px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center"
                onClick={() => setShowInfo(!showInfo)}
              >
                <Info className="h-5 w-5 mr-2" />
                Transit Information
              </button>
            </div>
          </div>
        )}

        {/* Route filter tabs for desktop */}
        <div className="hidden md:block border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-4">
              <button
                className={`px-4 py-3 font-medium text-sm transition-colors duration-300 ${
                  activeTab === "all"
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
                onClick={() => setActiveTab("all")}
              >
                All Routes
              </button>
              <button
                className={`px-4 py-3 font-medium text-sm transition-colors duration-300 ${
                  activeTab === "ontime"
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
                onClick={() => setActiveTab("ontime")}
              >
                On Time
              </button>
              <button
                className={`px-4 py-3 font-medium text-sm transition-colors duration-300 ${
                  activeTab === "delayed"
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
                onClick={() => setActiveTab("delayed")}
              >
                Delayed
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute right-4 md:right-8 top-16 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-800 dark:text-white">
              Notifications
            </h3>
          </div>
          <div className="p-3">
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <BusNotification
                  key={index}
                  notification={notification}
                  onClose={handleRemoveNotification}
                />
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No notifications
              </p>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* No Results Message */}
        {filteredRoutes.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md text-center mb-6">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-amber-500" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No routes found matching your search criteria.
            </p>
          </div>
        )}

        {/* Bus Routes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRoutes.map((route) => (
            <Link
              to={`/BusDetails/${route.id}`}
              key={route.id}
              className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
            >
              {/* Status Indicator */}
              <div
                className={`h-2 ${
                  route.schedule[0]?.status === "On Time"
                    ? "bg-green-500"
                    : route.schedule[0]?.status.includes("Delayed")
                    ? "bg-amber-500"
                    : route.schedule[0]?.status === "Cancelled"
                    ? "bg-red-500"
                    : "bg-blue-500"
                }`}
              ></div>

              {/* Card Content */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Bus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                        Bus {route.busNumber}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {route.name}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Route Endpoints */}
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                      {route.stops[0]}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                      {route.stops[route.stops.length - 1]}
                    </p>
                  </div>
                </div>

                {/* Next Departure */}
                {route.schedule && route.schedule.length > 0 && (
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${getStatusBgColor(
                      route.schedule[0].status
                    )}`}
                  >
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{route.schedule[0].time}</span>
                  </div>
                )}

                {/* View Details Button */}
                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {route.currentLocation}
                    </span>
                    <span className="text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:underline">
                      View Details
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Transit Information */}
      {showInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-full overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  Transit Information
                </h3>
                <button
                  onClick={() => setShowInfo(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Campus Transit Overview
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Campus Transit is a free shuttle service that runs between
                    different campuses of our university. The service is
                    available to all students, faculty, and staff.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                    How to Use the Service
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    To use the service, simply wait at one of the designated bus
                    stops. Buses arrive every 15-20 minutes during peak hours
                    and every 30 minutes during off-peak hours.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Accessibility
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    All buses are wheelchair accessible. If you require
                    additional assistance, please contact the driver.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Contact Information
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    For any questions or concerns, please contact the Campus
                    Transit office at
                    <a
                      href="tel:+1234567890"
                      className="text-blue-500 hover:underline"
                    >
                      {" "}
                      +1 (234) 567-890
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
