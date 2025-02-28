// import React, { useState, useEffect, useRef } from "react";
// import { motion } from "framer-motion";
// import { FiMapPin, FiClock, FiAlertCircle, FiBell, FiSearch, FiInfo, FiChevronDown, FiChevronUp, FiNavigation, FiUser } from "react-icons/fi";

// // Sample route data with enhanced details
// const routesData = [
//   {
//     id: 1,
//     name: "Route A - Main Campus Loop",
//     color: "#FF5733",
//     schedule: [
//       { time: "7:00 AM", status: "On Time" },
//       { time: "7:30 AM", status: "On Time" },
//       { time: "8:00 AM", status: "On Time" },
//       { time: "8:30 AM", status: "On Time" },
//       { time: "9:00 AM", status: "On Time" },
//       { time: "9:30 AM", status: "On Time" }
//     ],
//     stops: [
//       { id: "mc-1", name: "Student Center", location: { lat: 35.9132, lng: -79.0558 }, eta: 2 },
//       { id: "mc-2", name: "Engineering Building", location: { lat: 35.9145, lng: -79.0530 }, eta: 5 },
//       { id: "mc-3", name: "Library", location: { lat: 35.9120, lng: -79.0480 }, eta: 8 },
//       { id: "mc-4", name: "Science Complex", location: { lat: 35.9100, lng: -79.0510 }, eta: 12 },
//       { id: "mc-5", name: "Dormitories", location: { lat: 35.9080, lng: -79.0540 }, eta: 15 }
//     ],
//     status: "Normal",
//     currentPosition: { lat: 35.9132, lng: -79.0558 },
//     capacity: "Low",
//     driverName: "John Davis",
//     busNumber: "A-101"
//   },
//   {
//     id: 2,
//     name: "Route B - North Campus Express",
//     color: "#3498DB",
//     schedule: [
//       { time: "7:15 AM", status: "On Time" },
//       { time: "7:45 AM", status: "On Time" },
//       { time: "8:15 AM", status: "Delayed (5 min)" },
//       { time: "8:45 AM", status: "On Time" },
//       { time: "9:15 AM", status: "On Time" },
//       { time: "9:45 AM", status: "On Time" }
//     ],
//     stops: [
//       { id: "nc-1", name: "North Residence Hall", location: { lat: 35.9200, lng: -79.0500 }, eta: 0 },
//       { id: "nc-2", name: "Business School", location: { lat: 35.9220, lng: -79.0480 }, eta: 3 },
//       { id: "nc-3", name: "Research Park", location: { lat: 35.9250, lng: -79.0460 }, eta: 7 },
//       { id: "nc-4", name: "Medical Center", location: { lat: 35.9230, lng: -79.0420 }, eta: 12 },
//       { id: "nc-5", name: "Student Center", location: { lat: 35.9132, lng: -79.0558 }, eta: 18 }
//     ],
//     status: "Delay",
//     currentPosition: { lat: 35.9220, lng: -79.0480 },
//     capacity: "Medium",
//     driverName: "Sarah Johnson",
//     busNumber: "B-202"
//   },
//   {
//     id: 3,
//     name: "Route C - South Campus Connector",
//     color: "#27AE60",
//     schedule: [
//       { time: "7:30 AM", status: "On Time" },
//       { time: "8:00 AM", status: "On Time" },
//       { time: "8:30 AM", status: "On Time" },
//       { time: "9:00 AM", status: "On Time" },
//       { time: "9:30 AM", status: "On Time" },
//       { time: "10:00 AM", status: "On Time" }
//     ],
//     stops: [
//       { id: "sc-1", name: "South Parking Lot", location: { lat: 35.9050, lng: -79.0550 }, eta: 0 },
//       { id: "sc-2", name: "Athletic Complex", location: { lat: 35.9030, lng: -79.0530 }, eta: 4 },
//       { id: "sc-3", name: "Arts Center", location: { lat: 35.9010, lng: -79.0500 }, eta: 8 },
//       { id: "sc-4", name: "Student Center", location: { lat: 35.9132, lng: -79.0558 }, eta: 15 }
//     ],
//     status: "Normal",
//     currentPosition: { lat: 35.9030, lng: -79.0530 },
//     capacity: "High",
//     driverName: "Michael Brown",
//     busNumber: "C-303"
//   },
//   {
//     id: 4,
//     name: "Route D - East Village Express",
//     color: "#9B59B6",
//     schedule: [
//       { time: "7:10 AM", status: "On Time" },
//       { time: "7:40 AM", status: "On Time" },
//       { time: "8:10 AM", status: "On Time" },
//       { time: "8:40 AM", status: "On Time" },
//       { time: "9:10 AM", status: "On Time" },
//       { time: "9:40 AM", status: "Cancelled" }
//     ],
//     stops: [
//       { id: "ev-1", name: "East Village Apartments", location: { lat: 35.9150, lng: -79.0400 }, eta: 0 },
//       { id: "ev-2", name: "International Center", location: { lat: 35.9160, lng: -79.0430 }, eta: 5 },
//       { id: "ev-3", name: "Technology Hub", location: { lat: 35.9170, lng: -79.0460 }, eta: 8 },
//       { id: "ev-4", name: "Student Center", location: { lat: 35.9132, lng: -79.0558 }, eta: 12 }
//     ],
//     status: "Service Alert",
//     currentPosition: { lat: 35.9150, lng: -79.0400 },
//     capacity: "Medium",
//     driverName: "Emily Wilson",
//     busNumber: "D-404"
//   }
// ];

// // Campus building locations for search functionality
// const campusLocations = [
//   { id: "loc-1", name: "Student Center", category: "Services", location: { lat: 35.9132, lng: -79.0558 } },
//   { id: "loc-2", name: "Main Library", category: "Academic", location: { lat: 35.9120, lng: -79.0480 } },
//   { id: "loc-3", name: "Engineering Building", category: "Academic", location: { lat: 35.9145, lng: -79.0530 } },
//   { id: "loc-4", name: "Science Complex", category: "Academic", location: { lat: 35.9100, lng: -79.0510 } },
//   { id: "loc-5", name: "Business School", category: "Academic", location: { lat: 35.9220, lng: -79.0480 } },
//   { id: "loc-6", name: "Medical Center", category: "Health", location: { lat: 35.9230, lng: -79.0420 } },
//   { id: "loc-7", name: "Athletic Complex", category: "Recreation", location: { lat: 35.9030, lng: -79.0530 } },
//   { id: "loc-8", name: "Arts Center", category: "Academic", location: { lat: 35.9010, lng: -79.0500 } },
//   { id: "loc-9", name: "North Residence Hall", category: "Housing", location: { lat: 35.9200, lng: -79.0500 } },
//   { id: "loc-10", name: "South Parking Lot", category: "Parking", location: { lat: 35.9050, lng: -79.0550 } },
//   { id: "loc-11", name: "East Village Apartments", category: "Housing", location: { lat: 35.9150, lng: -79.0400 } },
//   { id: "loc-12", name: "Research Park", category: "Research", location: { lat: 35.9250, lng: -79.0460 } },
//   { id: "loc-13", name: "Technology Hub", category: "Services", location: { lat: 35.9170, lng: -79.0460 } },
//   { id: "loc-14", name: "International Center", category: "Services", location: { lat: 35.9160, lng: -79.0430 } },
//   { id: "loc-15", name: "Dormitories", category: "Housing", location: { lat: 35.9080, lng: -79.0540 } }
// ];

// // ServiceAlert component
// const ServiceAlert = ({ alerts, onClose }) => {
//   if (!alerts || alerts.length === 0) return null;
  
//   return (
//     <motion.div 
//       className="mb-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md"
//       initial={{ opacity: 0, y: -10 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//     >
//       <div className="flex items-start">
//         <div className="flex-shrink-0">
//           <FiAlertCircle className="h-5 w-5 text-yellow-600" />
//         </div>
//         <div className="ml-3">
//           <h3 className="text-sm font-medium text-yellow-800">Service Alerts ({alerts.length})</h3>
//           <div className="mt-2 text-sm text-yellow-700">
//             <ul className="list-disc pl-5 space-y-1">
//               {alerts.map((alert, index) => (
//                 <li key={index}>{alert}</li>
//               ))}
//             </ul>
//           </div>
//         </div>
//         <div className="ml-auto pl-3">
//           <div className="-mx-1.5 -my-1.5">
//             <button
//               onClick={onClose}
//               className="inline-flex rounded-md p-1.5 text-yellow-500 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-600"
//             >
//               <span className="sr-only">Dismiss</span>
//               <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// // Bus details modal component
// const BusDetailsModal = ({ bus, onClose }) => {
//   return (
//     <motion.div 
//       className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       onClick={onClose}
//     >
//       <motion.div 
//         className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-lg w-full shadow-2xl"
//         initial={{ y: 50, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         exit={{ y: 50, opacity: 0 }}
//         onClick={e => e.stopPropagation()}
//       >
//         <div className="flex justify-between items-center mb-6">
//           <div className="flex items-center">
//             <div 
//               className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4" 
//               style={{ backgroundColor: bus.color }}
//             >
//               {bus.name.charAt(6)}
//             </div>
//             <div>
//               <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{bus.name}</h3>
//               <p className="text-gray-500 dark:text-gray-400">Bus #{bus.busNumber}</p>
//             </div>
//           </div>
//           <button 
//             className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
//             onClick={onClose}
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         <div className="grid grid-cols-2 gap-4 mb-6">
//           <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
//             <div className="text-sm text-gray-500 dark:text-gray-400">Driver</div>
//             <div className="flex items-center mt-1">
//               <FiUser className="text-gray-600 dark:text-gray-300 mr-2" />
//               <div className="text-lg font-medium text-gray-800 dark:text-gray-200">{bus.driverName}</div>
//             </div>
//           </div>
//           <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
//             <div className="text-sm text-gray-500 dark:text-gray-400">Capacity</div>
//             <div className="flex items-center mt-1">
//               <div 
//                 className={`w-3 h-3 rounded-full mr-2 ${
//                   bus.capacity === "Low" ? "bg-green-500" : 
//                   bus.capacity === "Medium" ? "bg-yellow-500" : "bg-red-500"
//                 }`} 
//               />
//               <div className="text-lg font-medium text-gray-800 dark:text-gray-200">{bus.capacity}</div>
//             </div>
//           </div>
//         </div>

//         <div className="mb-6">
//           <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Current Route Status</h4>
//           <div className={`p-3 rounded-lg ${
//             bus.status === "Normal" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : 
//             bus.status === "Delay" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" : 
//             "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
//           }`}>
//             <div className="flex items-center">
//               {bus.status === "Normal" ? (
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                 </svg>
//               ) : bus.status === "Delay" ? (
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                 </svg>
//               ) : (
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                 </svg>
//               )}
//               <span>{bus.status === "Normal" ? "Operating Normally" : bus.status === "Delay" ? "Minor Delays" : "Service Disruption"}</span>
//             </div>
//           </div>
//         </div>

//         <div className="mb-6">
//           <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Next Stops</h4>
//           <div className="space-y-4">
//             {bus.stops.map((stop, index) => (
//               <div key={stop.id} className="flex items-start">
//                 <div className="flex flex-col items-center mr-4">
//                   <div 
//                     className={`w-6 h-6 rounded-full ${index === 0 ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"} flex items-center justify-center text-white text-xs`}
//                   >
//                     {index + 1}
//                   </div>
//                   {index < bus.stops.length - 1 && (
//                     <div className="w-0.5 h-12 bg-gray-300 dark:bg-gray-600 -mt-1"></div>
//                   )}
//                 </div>
//                 <div className="flex-grow">
//                   <div className="font-medium text-gray-800 dark:text-gray-200">{stop.name}</div>
//                   <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
//                     <FiClock className="mr-1" /> 
//                     {stop.eta === 0 ? (
//                       <span className="text-green-600 dark:text-green-400">Arriving now</span>
//                     ) : (
//                       <span>ETA: {stop.eta} min</span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div>
//           <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Today's Schedule</h4>
//           <div className="grid grid-cols-2 gap-3">
//             {bus.schedule.map((slot, index) => (
//               <div 
//                 key={index} 
//                 className={`p-3 rounded-lg border ${
//                   slot.status.includes("Delayed") 
//                     ? "border-yellow-300 bg-yellow-50 dark:bg-yellow-900 dark:border-yellow-700"
//                     : slot.status.includes("Cancelled")
//                     ? "border-red-300 bg-red-50 dark:bg-red-900 dark:border-red-700"
//                     : "border-green-300 bg-green-50 dark:bg-green-900 dark:border-green-700"
//                 }`}
//               >
//                 <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{slot.time}</div>
//                 <div className={`text-xs ${
//                   slot.status.includes("Delayed")
//                     ? "text-yellow-800 dark:text-yellow-200"
//                     : slot.status.includes("Cancelled")
//                     ? "text-red-800 dark:text-red-200"
//                     : "text-green-800 dark:text-green-200"
//                 }`}>
//                   {slot.status}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="mt-8 flex justify-end">
//           <button
//             className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center"
//             onClick={onClose}
//           >
//             <FiBell className="mr-2" />
//             Set Alert for This Route
//           </button>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// // Building details component
// const BuildingDetailsModal = ({ building, onClose, onFindRoute }) => {
//   return (
//     <motion.div 
//       className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       onClick={onClose}
//     >
//       <motion.div 
//         className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl"
//         initial={{ y: 50, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         exit={{ y: 50, opacity: 0 }}
//         onClick={e => e.stopPropagation()}
//       >
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{building.name}</h3>
//           <button 
//             className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
//             onClick={onClose}
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         <div className="mb-4">
//           <div className="inline-block px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-300 font-medium">
//             {building.category}
//           </div>
//         </div>

//         <div className="mb-6">
//           <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
//             <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Closest Bus Stops</h4>
//             <ul className="space-y-2">
//               {routesData.flatMap(route => 
//                 route.stops
//                   .filter(stop => calculateDistance(stop.location, building.location) < 0.5)
//                   .map(stop => (
//                     <li key={`${route.id}-${stop.id}`} className="flex items-center">
//                       <div 
//                         className="w-3 h-3 rounded-full mr-2" 
//                         style={{ backgroundColor: route.color }}
//                       />
//                       <span className="text-gray-700 dark:text-gray-300">{stop.name} - Route {route.name.substring(0, 8)}</span>
//                     </li>
//                   ))
//               )}
//             </ul>
//           </div>
//         </div>

//         <div className="flex space-x-4">
//           <button
//             className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg transition-colors duration-300 flex items-center justify-center"
//             onClick={onClose}
//           >
//             <FiInfo className="mr-2" />
//             Details
//           </button>
//           <button
//             className="flex-1 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center justify-center"
//             onClick={() => {
//               onFindRoute(building);
//               onClose();
//             }}
//           >
//             <FiNavigation className="mr-2" />
//             Get Directions
//           </button>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// // Utility function to calculate distance between two points
// const calculateDistance = (point1, point2) => {
//   // This is a simplified version - in a real app, you'd use a proper geospatial library
//   const lat1 = point1.lat;
//   const lng1 = point1.lng;
//   const lat2 = point2.lat;
//   const lng2 = point2.lng;
  
//   return Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lng2 - lng1, 2));
// };

// // Main BusSchedule Component
// const BusSchedule = () => {
//   const [routes, setRoutes] = useState(routesData);
//   const [filteredLocations, setFilteredLocations] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedBus, setSelectedBus] = useState(null);
//   const [selectedBuilding, setSelectedBuilding] = useState(null);
//   const [expandedRoute, setExpandedRoute] = useState(null);
//   const [activeTab, setActiveTab] = useState("routes");  // "routes" or "map"
//   const [viewMode, setViewMode] = useState("list");  // "list" or "table"
//   const [showServiceAlerts, setShowServiceAlerts] = useState(true);
//   const [serviceAlerts, setServiceAlerts] = useState([
//     "Route D (East Village Express) 9:40 AM service is cancelled today due to maintenance.",
//     "Route B (North Campus Express) is experiencing delays of approximately 5 minutes due to construction."
//   ]);
//   const mapRef = useRef(null);

//   // Filter locations based on search query
//   useEffect(() => {
//     if (!searchQuery.trim()) {
//       setFilteredLocations([]);
//       return;
//     }
    
//     const query = searchQuery.toLowerCase();
//     const matches = campusLocations.filter(location => 
//       location.name.toLowerCase().includes(query) || 
//       location.category.toLowerCase().includes(query)
//     );
    
//     setFilteredLocations(matches);
//   }, [searchQuery]);

//   // Handle route finding
//   const handleFindRoute = (building) => {
//     // In a real app, this would calculate and show the optimal route
//     console.log(`Finding route to ${building.name}`);
//     setActiveTab("routes");
//   };

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: { 
//       opacity: 1,
//       transition: { 
//         staggerChildren: 0.08
//       }
//     }
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { 
//       opacity: 1, 
//       y: 0,
//       transition: { duration: 0.4 }
//     }
//   };

//   return (
//     <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <motion.div 
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="flex flex-col md:flex-row justify-between items-center mb-8"
//         >
//           <div>
//             <h2 className="text-4xl font-bold text-blue-600 dark:text-blue-300 mb-2">
//               Campus Transportation
//             </h2>
//             <p className="text-gray-600 dark:text-gray-400 text-lg">
//               Real-time bus routes, schedules, and campus navigation
//             </p>
//           </div>
          
//           <div className="flex space-x-4 mt-4 md:mt-0">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Find a building or location..."
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FiSearch className="text-gray-400" />
//               </div>
              
//               {filteredLocations.length > 0 && (
//   <div className="absolute z-10 w-full mt-1 rounded-md bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
//     <ul className="py-1">
//       {filteredLocations.map(location => (
//         <li 
//           key={location.id} 
//           className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center"
//           onClick={() => {
//             setSelectedBuilding(location);
//             setSearchQuery("");
//             setFilteredLocations([]);
//           }}
//         >
//           <FiMapPin className="text-gray-400 dark:text-gray-500 mr-2" />
//           <div>
//             <div className="text-gray-800 dark:text-gray-200">{location.name}</div>
//             <div className="text-xs text-gray-500 dark:text-gray-400">{location.category}</div>
//           </div>
//         </li>
//       ))}
//     </ul>
//   </div>
// )}

// src/components/BusSchedule.jsx
import React from "react";

const routes = [
  {
    id: 1,
    name: "Route A",
    schedule: "8:00 AM, 10:00 AM, 12:00 PM",
    status: "On Time",
  },
  // Add more routes
];

export default function BusSchedule() {
  return (
    <div className="p-8 bg-yellow-50 dark:bg-[#18181b]">
      <h2 className="text-3xl font-bold text-yellow-600 dark:text-yellow-200 mb-6">
        Bus Routes & Schedules
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                Route
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                Schedule
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {routes.map((route) => (
              <tr key={route.id} className="hover:bg-yellow-50 dark:hover:bg-gray-700 transition-colors duration-300">
                <td className="px-6 py-4 text-gray-800 dark:text-gray-400">{route.name}</td>
                <td className="px-6 py-4 text-gray-800 dark:text-gray-400">{route.schedule}</td>
                <td className="px-6 py-4 text-gray-800 dark:text-gray-400">{route.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}