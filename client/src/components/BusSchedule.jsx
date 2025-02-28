import React, { useState } from "react";

// Sample bus route data with enhanced details
const routesData = [
  {
    id: 1,
    name: "Route A - Main Campus Loop",
    schedule: [
      { time: "7:00 AM", status: "On Time" },
      { time: "8:00 AM", status: "On Time" },
      { time: "9:00 AM", status: "On Time" },
      { time: "10:00 AM", status: "On Time" },
      { time: "11:00 AM", status: "On Time" },
      { time: "12:00 PM", status: "On Time" }
    ],
    stops: ["Student Center", "Engineering Building", "Library", "Science Complex", "Dormitories"],
    status: "On Time",
    driver: "John Davis",
    busNumber: "A-101",
    capacity: "Low"
  },
  {
    id: 2,
    name: "Route B - North Campus Express",
    schedule: [
      { time: "7:15 AM", status: "On Time" },
      { time: "8:15 AM", status: "Delayed (5 min)" },
      { time: "9:15 AM", status: "On Time" },
      { time: "10:15 AM", status: "On Time" },
      { time: "11:15 AM", status: "On Time" },
      { time: "12:15 PM", status: "On Time" }
    ],
    stops: ["North Residence Hall", "Business School", "Research Park", "Medical Center", "Student Center"],
    status: "Delayed",
    driver: "Sarah Johnson",
    busNumber: "B-202",
    capacity: "Medium"
  },
  {
    id: 3,
    name: "Route C - South Campus Connector",
    schedule: [
      { time: "7:30 AM", status: "On Time" },
      { time: "8:30 AM", status: "On Time" },
      { time: "9:30 AM", status: "On Time" },
      { time: "10:30 AM", status: "On Time" },
      { time: "11:30 AM", status: "On Time" },
      { time: "12:30 PM", status: "On Time" }
    ],
    stops: ["South Parking Lot", "Athletic Complex", "Arts Center", "Student Center"],
    status: "On Time",
    driver: "Michael Brown",
    busNumber: "C-303",
    capacity: "High"
  },
  {
    id: 4,
    name: "Route D - East Village Express",
    schedule: [
      { time: "7:10 AM", status: "On Time" },
      { time: "8:10 AM", status: "On Time" },
      { time: "9:10 AM", status: "On Time" },
      { time: "10:10 AM", status: "Cancelled" },
      { time: "11:10 AM", status: "On Time" },
      { time: "12:10 PM", status: "On Time" }
    ],
    stops: ["East Village Apartments", "International Center", "Technology Hub", "Student Center"],
    status: "Service Alert",
    driver: "Emily Wilson",
    busNumber: "D-404",
    capacity: "Medium"
  }
];

const ServiceAlert = ({ alerts, onClose }) => {
  if (!alerts || alerts.length === 0) return null;
  
  return (
    <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">Service Alerts ({alerts.length})</h3>
          <div className="mt-2 text-sm text-yellow-700">
            <ul className="list-disc pl-5 space-y-1">
              {alerts.map((alert, index) => (
                <li key={index}>{alert}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              onClick={onClose}
              className="inline-flex rounded-md p-1.5 text-yellow-500 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-600"
            >
              <span className="sr-only">Dismiss</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const RouteDetailsModal = ({ route, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4" 
              style={{ backgroundColor: route.id === 1 ? "#FF5733" : route.id === 2 ? "#3498DB" : route.id === 3 ? "#27AE60" : "#9B59B6" }}
            >
              {route.name.charAt(6)}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{route.name}</h3>
              <p className="text-gray-500 dark:text-gray-400">Bus #{route.busNumber}</p>
            </div>
          </div>
          <button 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <div className="text-sm text-gray-500 dark:text-gray-400">Driver</div>
            <div className="flex items-center mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <div className="text-lg font-medium text-gray-800 dark:text-gray-200">{route.driver}</div>
            </div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <div className="text-sm text-gray-500 dark:text-gray-400">Capacity</div>
            <div className="flex items-center mt-1">
              <div 
                className={`w-3 h-3 rounded-full mr-2 ${
                  route.capacity === "Low" ? "bg-green-500" : 
                  route.capacity === "Medium" ? "bg-yellow-500" : "bg-red-500"
                }`} 
              />
              <div className="text-lg font-medium text-gray-800 dark:text-gray-200">{route.capacity}</div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Current Route Status</h4>
          <div className={`p-3 rounded-lg ${
            route.status === "On Time" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : 
            route.status === "Delayed" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" : 
            "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          }`}>
            <div className="flex items-center">
              {route.status === "On Time" ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : route.status === "Delayed" ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <span>{route.status === "On Time" ? "Operating Normally" : route.status === "Delayed" ? "Minor Delays" : "Service Disruption"}</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Stops</h4>
          <div className="space-y-4">
            {route.stops.map((stop, index) => (
              <div key={index} className="flex items-start">
                <div className="flex flex-col items-center mr-4">
                  <div 
                    className={`w-6 h-6 rounded-full ${index === 0 ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"} flex items-center justify-center text-white text-xs`}
                  >
                    {index + 1}
                  </div>
                  {index < route.stops.length - 1 && (
                    <div className="w-0.5 h-10 bg-gray-300 dark:bg-gray-600 mt-1"></div>
                  )}
                </div>
                <div className="flex-grow pt-1">
                  <div className="font-medium text-gray-800 dark:text-gray-200">{stop}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Today's Schedule</h4>
          <div className="grid grid-cols-2 gap-3">
            {route.schedule.map((slot, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-lg border ${
                  slot.status.includes("Delayed") 
                    ? "border-yellow-300 bg-yellow-50 dark:bg-yellow-900 dark:border-yellow-700"
                    : slot.status.includes("Cancelled")
                    ? "border-red-300 bg-red-50 dark:bg-red-900 dark:border-red-700"
                    : "border-green-300 bg-green-50 dark:bg-green-900 dark:border-green-700"
                }`}
              >
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{slot.time}</div>
                <div className={`text-xs ${
                  slot.status.includes("Delayed")
                    ? "text-yellow-800 dark:text-yellow-200"
                    : slot.status.includes("Cancelled")
                    ? "text-red-800 dark:text-red-200"
                    : "text-green-800 dark:text-green-200"
                }`}>
                  {slot.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center"
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            Set Alert for This Route
          </button>
        </div>
      </div>
    </div>
  );
};

const BusSchedule = () => {
  const [routes, setRoutes] = useState(routesData);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [expandedRoute, setExpandedRoute] = useState(null);
  const [viewMode, setViewMode] = useState("list"); // "list" or "table"
  const [showServiceAlerts, setShowServiceAlerts] = useState(true);
  const [serviceAlerts, setServiceAlerts] = useState([
    "Route D (East Village Express) 10:10 AM service is cancelled today due to maintenance.",
    "Route B (North Campus Express) is experiencing delays of approximately 5 minutes due to construction."
  ]);
  const [filterStatus, setFilterStatus] = useState("all"); // "all", "ontime", "delayed", "alert"

  // Filter routes based on status
  const filteredRoutes = filterStatus === "all" 
    ? routes 
    : routes.filter(route => {
        if (filterStatus === "ontime") return route.status === "On Time";
        if (filterStatus === "delayed") return route.status === "Delayed";
        if (filterStatus === "alert") return route.status === "Service Alert";
        return true;
      });

  const toggleExpandRoute = (id) => {
    setExpandedRoute(expandedRoute === id ? null : id);
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-yellow-600 dark:text-yellow-300 mb-2">
              Campus Transportation
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Real-time bus routes, schedules, and status updates
            </p>
          </div>
          
          <div className="flex space-x-2 mt-4 md:mt-0">
            <button 
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 rounded-lg ${
                viewMode === "list" 
                  ? "bg-yellow-600 dark:bg-yellow-600 text-white" 
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700"
              } transition-colors duration-300`}
            >
              List View
            </button>
            <button 
              onClick={() => setViewMode("table")}
              className={`px-4 py-2 rounded-lg ${
                viewMode === "table" 
                  ? "bg-yellow-600 dark:bg-yellow-600 text-white" 
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700"
              } transition-colors duration-300`}
            >
              Table View
            </button>
          </div>
        </div>

        {/* Service Alerts */}
        {showServiceAlerts && (
          <ServiceAlert 
            alerts={serviceAlerts} 
            onClose={() => setShowServiceAlerts(false)} 
          />
        )}

        {/* Filters */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4 sm:mb-0">Filter Routes:</h3>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setFilterStatus("all")}
                className={`px-3 py-1 rounded-full text-sm ${
                  filterStatus === "all" 
                    ? "bg-yellow-600 text-white" 
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                All Routes
              </button>
              <button 
                onClick={() => setFilterStatus("ontime")}
                className={`px-3 py-1 rounded-full text-sm ${
                  filterStatus === "ontime" 
                    ? "bg-green-600 text-white" 
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                On Time
              </button>
              <button 
                onClick={() => setFilterStatus("delayed")}
                className={`px-3 py-1 rounded-full text-sm ${
                  filterStatus === "delayed" 
                    ? "bg-yellow-500 text-white" 
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                Delayed
              </button>
              <button 
                onClick={() => setFilterStatus("alert")}
                className={`px-3 py-1 rounded-full text-sm ${
                  filterStatus === "alert" 
                    ? "bg-red-600 text-white" 
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                Service Alerts
              </button>
            </div>
          </div>
        </div>

        {/* List View */}
        {viewMode === "list" && (
          <div className="space-y-4">
            {filteredRoutes.map(route => (
              <div key={route.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div 
                  className="p-4 flex items-center justify-between cursor-pointer"
                  onClick={() => toggleExpandRoute(route.id)}
                >
                  <div className="flex items-center">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-4" 
                      style={{ backgroundColor: route.id === 1 ? "#FF5733" : route.id === 2 ? "#3498DB" : route.id === 3 ? "#27AE60" : "#9B59B6" }}
                    >
                      {route.name.charAt(6)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{route.name}</h3>
                      <div className="flex items-center mt-1">
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                          route.status === "On Time" ? "bg-green-500" : 
                          route.status === "Delayed" ? "bg-yellow-500" : "bg-red-500"
                        }`}></span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{route.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button 
                      className="mr-4 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRoute(route);
                      }}
                    >
                      Details
                    </button>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${expandedRoute === route.id ? "transform rotate-180" : ""}`} 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                {expandedRoute === route.id && (
                  <div className="px-4 pb-4 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col md:flex-row md:gap-8">
                      <div className="mb-4 md:mb-0 md:flex-1">
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Next Departures</h4>
                        <div className="space-y-2">
                          {route.schedule.slice(0, 3).map((slot, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <span className="text-gray-800 dark:text-gray-200">{slot.time}</span>
                              <span className={`text-sm ${
                                slot.status.includes("Delayed") ? "text-yellow-600 dark:text-yellow-400" : 
                                slot.status.includes("Cancelled") ? "text-red-600 dark:text-red-400" : 
                                "text-green-600 dark:text-green-400"
                              }`}>
                                {slot.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="md:flex-1">
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Stops</h4>
                        <div className="flex flex-wrap gap-2">
                          {route.stops.map((stop, index) => (
                            <span 
                              key={index} 
                              className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm rounded"
                            >
                              {stop}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Table View */}
        {viewMode === "table" && (
          <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Route</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Next Departure</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Capacity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Bus Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredRoutes.map(route => {
                  const nextDeparture = route.schedule.find(slot => !slot.status.includes("Cancelled"));
                  return (
                    <tr 
                      key={route.id} 
                      className="hover:bg-yellow-50 dark:hover:bg-gray-700 transition-colors duration-300"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-3" 
                            style={{ backgroundColor: route.id === 1 ? "#FF5733" : route.id === 2 ? "#3498DB" : route.id === 3 ? "#27AE60" : "#9B59B6" }}
                          >
                            {route.name.charAt(6)}
                          </div>
                          <span className="text-gray-800 dark:text-gray-200">{route.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                            route.status === "On Time" ? "bg-green-500" : 
                            route.status === "Delayed" ? "bg-yellow-500" : "bg-red-500"
                          }`}></span>
                          <span className="text-sm text-gray-800 dark:text-gray-200">{route.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className="text-gray-800 dark:text-gray-200">{nextDeparture ? nextDeparture.time : "N/A"}</span>
                          {nextDeparture && (
                            <span className={`ml-2 text-sm ${
                              nextDeparture.status.includes("Delayed") ? "text-yellow-600 dark:text-yellow-400" : 
                              nextDeparture.status.includes("Cancelled") ? "text-red-600 dark:text-red-400" : 
                              "text-green-600 dark:text-green-400"
                            }`}>
                              {nextDeparture.status}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div 
                            className={`w-3 h-3 rounded-full mr-2 ${
                              route.capacity === "Low" ? "bg-green-500" : 
                              route.capacity === "Medium" ? "bg-yellow-500" : "bg-red-500"
                            }`} 
                          />
                          <span className="text-sm text-gray-800 dark:text-gray-200">{route.capacity}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-800 dark:text-gray-200">{route.busNumber}</span>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
                          onClick={() => setSelectedRoute(route)}
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Route Details Modal */}
        {selectedRoute && (
          <RouteDetailsModal 
            route={selectedRoute} 
            onClose={() => setSelectedRoute(null)} 
          />
        )}
      </div>
    </div>
  );
};

export default BusSchedule;