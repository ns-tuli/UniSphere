// src/components/BusSchedule.jsx
import React, { useState, useEffect } from "react";
import { MapPin, Clock, Bus, AlertTriangle, Calendar, Search, Filter } from "lucide-react";
import { getBusSchedules, getBusScheduleById } from "../api/bus"; // Adjust the path to busAPI.js

// Sample data - in a real app, this would come from an API

export default function BusSchedule() {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [showMap, setShowMap] = useState(false);

  // Fetch bus schedules on component mount
  useEffect(() => {
    const fetchBusSchedules = async () => {
      try {
        const schedules = await getBusSchedules(); // Fetch schedules from the API
        setFilteredRoutes(schedules); // Set the fetched data as the filtered routes
      } catch (error) {
        console.error("Error fetching bus schedules:", error.message);
      }
    };
    fetchBusSchedules();
  }, []);

  // Filter routes based on search query
  useEffect(() => {
    const filtered = filteredRoutes.filter(
      (route) =>
        route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.stops.some((stop) => stop.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredRoutes(filtered);
  }, [searchQuery, filteredRoutes]);

  // Filter routes based on active tab
  useEffect(() => {
    if (activeTab === "all") {
      setFilteredRoutes(filteredRoutes);
    } else if (activeTab === "delayed") {
      setFilteredRoutes(
        filteredRoutes.filter((route) =>
          route.schedule.some((time) => time.status.includes("Delayed"))
        )
      );
    } else if (activeTab === "ontime") {
      setFilteredRoutes(
        filteredRoutes.filter((route) =>
          route.schedule.every((time) => time.status === "On Time" || time.status === "Cancelled")
        )
      );
    }
  }, [activeTab]);

  const getStatusColor = (status) => {
    if (status === "On Time") return "text-green-500";
    if (status.includes("Delayed")) return "text-amber-500";
    if (status === "Cancelled") return "text-red-500";
    return "text-gray-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white dark:from-gray-900 dark:to-gray-800 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-yellow-700 dark:text-yellow-300">
            Campus Transit
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Real-time updates and schedules for university bus routes
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <button
            className="bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-400 text-white dark:text-gray-800 font-semibold px-4 py-2 rounded-lg transition-colors duration-300 flex items-center"
            onClick={() => setShowMap(!showMap)}
          >
            <MapPin className="w-4 h-4 mr-2" />
            {showMap ? "Hide Map" : "Show Map"}
          </button>
          <button className="bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-yellow-700 dark:text-yellow-300 font-semibold px-4 py-2 rounded-lg transition-colors duration-300 shadow-md flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg mb-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search routes or stops..."
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
                activeTab === "all"
                  ? "bg-yellow-600 dark:bg-yellow-500 text-white dark:text-gray-800"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
              onClick={() => setActiveTab("all")}
            >
              All Routes
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
                activeTab === "ontime"
                  ? "bg-yellow-600 dark:bg-yellow-500 text-white dark:text-gray-800"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
              onClick={() => setActiveTab("ontime")}
            >
              On Time
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
                activeTab === "delayed"
                  ? "bg-yellow-600 dark:bg-yellow-500 text-white dark:text-gray-800"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
              onClick={() => setActiveTab("delayed")}
            >
              Delayed
            </button>
          </div>
        </div>
      </div>

      {/* Alerts/Notifications */}
      {notifications.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 shadow-md mb-6">
          <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-300 flex items-center mb-3">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Service Alerts
          </h3>
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-start border-l-4 pl-3 py-1"
                style={{
                  borderColor:
                    notification.type === "alert"
                      ? "#ef4444"
                      : notification.type === "warning"
                      ? "#f59e0b"
                      : "#3b82f6",
                }}
              >
                <div className="flex-1">
                  <p className="text-gray-800 dark:text-gray-200">{notification.message}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mock Map (would be replaced with an actual map component) */}
      {showMap && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg mb-6 h-64 flex items-center justify-center">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <MapPin className="w-8 h-8 mx-auto mb-2" />
            <p>Interactive campus map with real-time bus locations would be displayed here</p>
            <p className="text-sm mt-2">
              (In a production app, this would use Google Maps or Mapbox API)
            </p>
          </div>
        </div>
      )}

      {/* Bus Routes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRoutes.map((route) => (
          <div
            key={route.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
          >
            {/* Route Header */}
            <div
              className="p-6 cursor-pointer"
              onClick={() => setSelectedRoute(selectedRoute === route.id ? null : route.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <Bus className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    Bus {route.busNumber} • {route.capacity} • {route.estimatedTime} trip
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {route.name}
                  </p>
                </div>
                <div 
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    route.currentLocation.includes("At") 
                      ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300" 
                      : "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                  }`}
                >
                  {route.currentLocation}
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <p>Stops: </p>
                  <div className="flex ml-2">
                    {route.stops.map((stop, idx) => (
                      <React.Fragment key={idx}>
                        <span className="text-gray-700 dark:text-gray-300">{stop}</span>
                        {idx < route.stops.length - 1 && (
                          <span className="mx-2">→</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Next Departures */}
              <div className="mt-4 flex flex-wrap">
                {route.schedule.slice(0, 3).map((time, idx) => (
                  <div 
                    key={idx} 
                    className="mr-3 mb-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center"
                  >
                    <Clock className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{time.time}</span>
                    <span className={`ml-2 text-sm ${getStatusColor(time.status)}`}>
                      {time.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Expanded Route Details */}
            {selectedRoute === route.id && (
              <div className="bg-gray-50 dark:bg-gray-700/50 p-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Complete Schedule
                </h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-600">
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Time
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {route.schedule.map((time, idx) => (
                        <tr key={idx} className="hover:bg-gray-100 dark:hover:bg-gray-600/30">
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{time.time}</td>
                          <td className={`px-4 py-3 ${getStatusColor(time.status)}`}>
                            {time.status}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Driver Information
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">{route.driver}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Accessibility
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {route.accessibility ? "Wheelchair Accessible" : "Limited Accessibility"}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button className="bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-400 text-white dark:text-gray-800 px-4 py-2 rounded-lg transition-colors duration-300">
                    Set Alerts for This Route
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* No Results */}
      {filteredRoutes.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No routes found matching your search criteria.
          </p>
        </div>
      )}
      
      {/* Footer */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Transit Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
              Hours of Operation
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              Monday - Friday: 6:30 AM - 11:00 PM<br />
              Saturday: 8:00 AM - 10:00 PM<br />
              Sunday: 9:00 AM - 8:00 PM
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contact Information
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              Email: transit@university.edu<br />
              Phone: (555) 123-4567<br />
              Emergency: (555) 987-6543
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fare Information
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              Free for students with valid ID<br />
              Faculty/Staff: $1.00 per ride<br />
              Visitors: $2.00 per ride
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}