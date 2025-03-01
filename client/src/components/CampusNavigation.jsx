// src/components/CampusNavigation.jsx
import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  Search,
  Navigation,
  Map,
  Info,
  Compass,
  Layers,
  AlertTriangle,
  BookOpen,
} from "lucide-react";
//import { motion } from "framer-motion";

// Fix for default marker icon in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom marker icons
const buildingIcon = new L.Icon({
  iconUrl: "/building-icon.png", // Replace with actual path
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const libraryIcon = new L.Icon({
  iconUrl: "/library-icon.png", // Replace with actual path
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Sample campus data
const campusBuildings = [
  {
    id: 1,
    name: "Main Hall",
    type: "academic",
    coordinates: [34.0522, -118.2437],
    description:
      "The primary administrative building with lecture halls and faculty offices.",
    facilities: ["Lecture Halls", "Administrative Offices", "Student Services"],
    hours: "7:00 AM - 10:00 PM",
    image: "https://via.placeholder.com/300x200",
    accessibility: true,
    events: [
      "Faculty Meeting (Room 101) - 2:00 PM",
      "Student Council (Room 204) - 5:00 PM",
    ],
  },
  {
    id: 2,
    name: "Science Center",
    type: "academic",
    coordinates: [34.0525, -118.244],
    description:
      "Home to the sciences with modern laboratories and research facilities.",
    facilities: ["Research Labs", "Computer Labs", "Lecture Halls"],
    hours: "8:00 AM - 9:00 PM",
    image: "https://via.placeholder.com/300x200",
    accessibility: true,
    events: [
      "Chemistry Lab (Room 302) - 1:00 PM",
      "Physics Seminar (Room 405) - 4:00 PM",
    ],
  },
  {
    id: 3,
    name: "University Library",
    type: "library",
    coordinates: [34.0518, -118.2432],
    description:
      "Five-story library with extensive collections and study spaces.",
    facilities: ["Study Rooms", "Computer Lab", "Reading Lounges", "Archives"],
    hours: "7:00 AM - 12:00 AM",
    image: "https://via.placeholder.com/300x200",
    accessibility: true,
    events: ["Research Workshop - 11:00 AM", "Book Club - 6:00 PM"],
  },
  {
    id: 4,
    name: "Student Union",
    type: "recreational",
    coordinates: [34.0515, -118.2445],
    description:
      "Center for student activities, dining, and social gatherings.",
    facilities: ["Food Court", "Lounges", "Meeting Rooms", "Game Room"],
    hours: "6:00 AM - 11:00 PM",
    image: "https://via.placeholder.com/300x200",
    accessibility: true,
    events: ["Club Fair - 12:00 PM", "Movie Night - 8:00 PM"],
  },
  {
    id: 5,
    name: "Recreation Center",
    type: "recreational",
    coordinates: [34.051, -118.245],
    description:
      "Modern fitness facility with equipment, courts, and a swimming pool.",
    facilities: ["Gym", "Swimming Pool", "Basketball Courts", "Yoga Studio"],
    hours: "6:00 AM - 10:00 PM",
    image: "https://via.placeholder.com/300x200",
    accessibility: true,
    events: ["Yoga Class - 9:00 AM", "Swimming Competition - 3:00 PM"],
  },
];

// Component to recenter map on location change
function SetViewOnClick({ coords }) {
  const map = useMap();
  map.setView(coords, map.getZoom());
  return null;
}

// AR Mode helper component
function ARModeComponent() {
  const videoRef = useRef(null);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Could not access camera: ", err);
        });
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="relative h-full">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <div className="text-center bg-black bg-opacity-50 p-4 rounded-lg">
          <p className="text-white text-lg">
            Point your camera at campus buildings
          </p>
          <p className="text-yellow-300 text-sm mt-2">
            AR navigation currently in demo mode
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CampusNavigation() {
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBuildings, setFilteredBuildings] = useState(campusBuildings);
  const [mapCenter, setMapCenter] = useState([34.0522, -118.2437]);
  const [activeMode, setActiveMode] = useState("map"); // "map", "ar", "directions"
  const [activeFilter, setActiveFilter] = useState("all");
  const [showARWarning, setShowARWarning] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  // Filter buildings based on search query and type filter
  useEffect(() => {
    let results = campusBuildings;

    // Filter by search query
    if (searchQuery) {
      results = results.filter(
        (building) =>
          building.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          building.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by building type
    if (activeFilter !== "all") {
      results = results.filter((building) => building.type === activeFilter);
    }

    setFilteredBuildings(results);
  }, [searchQuery, activeFilter]);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  // Handle AR mode activation
  const handleARMode = () => {
    setShowARWarning(true);
    setTimeout(() => {
      setShowARWarning(false);
      setActiveMode("ar");
    }, 2000);
  };

  // Handle building selection
  const handleBuildingSelect = (building) => {
    setSelectedBuilding(building);
    setMapCenter(building.coordinates);
  };

  // Get icon based on building type
  const getBuildingIcon = (type) => {
    switch (type) {
      case "library":
        return libraryIcon;
      default:
        return buildingIcon;
    }
  };

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-gray-900 dark:to-gray-800 min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-4xl font-bold text-yellow-700 dark:text-yellow-300">
            Campus Navigation
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Explore the campus with our interactive map and AR navigation
          </p>
        </header>

        {/* Navigation Mode Selector */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveMode("map")}
              className={`flex items-center px-4 py-2 rounded-lg ${
                activeMode === "map"
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              } transition-colors duration-200`}
            >
              <Map className="w-5 h-5 mr-2" />
              Map View
            </button>
            <button
              onClick={handleARMode}
              className={`flex items-center px-4 py-2 rounded-lg ${
                activeMode === "ar"
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              } transition-colors duration-200`}
            >
              <Compass className="w-5 h-5 mr-2" />
              AR Navigation
            </button>
            <button
              onClick={() => setActiveMode("directions")}
              className={`flex items-center px-4 py-2 rounded-lg ${
                activeMode === "directions"
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              } transition-colors duration-200`}
            >
              <Navigation className="w-5 h-5 mr-2" />
              Get Directions
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search buildings, facilities..."
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-3 py-2 rounded-lg ${
                  activeFilter === "all"
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                } transition-colors duration-200`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter("academic")}
                className={`px-3 py-2 rounded-lg ${
                  activeFilter === "academic"
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                } transition-colors duration-200`}
              >
                Academic
              </button>
              <button
                onClick={() => setActiveFilter("library")}
                className={`px-3 py-2 rounded-lg ${
                  activeFilter === "library"
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                } transition-colors duration-200`}
              >
                Library
              </button>
              <button
                onClick={() => setActiveFilter("recreational")}
                className={`px-3 py-2 rounded-lg ${
                  activeFilter === "recreational"
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                } transition-colors duration-200`}
              >
                Recreational
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Building List */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden h-full">
              <div className="p-4 bg-yellow-500 dark:bg-yellow-600 text-white">
                <h3 className="text-xl font-semibold flex items-center">
                  <Layers className="w-5 h-5 mr-2" />
                  Campus Buildings
                </h3>
              </div>
              <div className="overflow-y-auto max-h-[500px]">
                {filteredBuildings.length > 0 ? (
                  filteredBuildings.map((building) => (
                    <motion.div
                      key={building.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleBuildingSelect(building)}
                      className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-yellow-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                        selectedBuilding?.id === building.id
                          ? "bg-yellow-100 dark:bg-gray-700"
                          : ""
                      }`}
                    >
                      <h3 className="text-lg font-medium text-yellow-700 dark:text-yellow-300">
                        {building.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {building.description.substring(0, 80)}...
                      </p>
                      <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="mr-4">
                          <Info className="w-4 h-4 inline mr-1" />
                          {building.type.charAt(0).toUpperCase() +
                            building.type.slice(1)}
                        </span>
                        <span>
                          <Clock className="w-4 h-4 inline mr-1" />
                          {building.hours}
                        </span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <SearchX className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>No buildings found matching your search.</p>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setActiveFilter("all");
                      }}
                      className="mt-2 text-yellow-600 dark:text-yellow-400 underline"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Map or AR View */}
          <div className="lg:col-span-2">
            {activeMode === "map" && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden h-[600px]">
                <MapContainer
                  center={mapCenter}
                  zoom={17}
                  className="h-full w-full"
                  zoomControl={false}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {/* User location marker */}
                  {userLocation && (
                    <Marker
                      position={userLocation}
                      icon={
                        new L.Icon({
                          iconUrl: "/user-location.png", // Replace with actual user location icon
                          iconSize: [30, 30],
                          iconAnchor: [15, 15],
                        })
                      }
                    >
                      <Popup>You are here</Popup>
                    </Marker>
                  )}

                  {/* Building markers */}
                  {filteredBuildings.map((building) => (
                    <Marker
                      key={building.id}
                      position={building.coordinates}
                      icon={getBuildingIcon(building.type)}
                    >
                      <Popup>
                        <div className="text-center">
                          <h3 className="text-lg font-semibold text-yellow-700">
                            {building.name}
                          </h3>
                          <img
                            src={building.image}
                            alt={building.name}
                            className="w-full h-32 object-cover my-2 rounded"
                          />
                          <p className="text-sm text-gray-600">
                            {building.description}
                          </p>
                          <div className="mt-2 pt-2 border-t border-gray-200">
                            <p className="text-sm font-medium">
                              Hours: {building.hours}
                            </p>
                          </div>
                          <button
                            className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                            onClick={() => {
                              setSelectedBuilding(building);
                              setActiveMode("directions");
                            }}
                          >
                            Get Directions
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  ))}

                  {/* Update map center when selected building changes */}
                  {selectedBuilding && (
                    <SetViewOnClick coords={selectedBuilding.coordinates} />
                  )}
                </MapContainer>
              </div>
            )}

            {activeMode === "ar" && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden h-[600px]">
                <ARModeComponent />
              </div>
            )}

            {activeMode === "directions" && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden h-[600px]">
                <div className="p-4 bg-yellow-500 dark:bg-yellow-600 text-white">
                  <h3 className="text-xl font-semibold flex items-center">
                    <Navigation className="w-5 h-5 mr-2" />
                    Directions
                  </h3>
                </div>

                <div className="p-6">
                  {selectedBuilding ? (
                    <div>
                      <div className="mb-4">
                        <h3 className="text-xl font-medium text-yellow-700 dark:text-yellow-300">
                          Directions to {selectedBuilding.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                          {!userLocation
                            ? "Please enable location services to get directions."
                            : "Directions from your current location:"}
                        </p>
                      </div>

                      {userLocation && (
                        <div className="mt-4">
                          <div className="flex items-start p-4 bg-yellow-50 dark:bg-gray-700 rounded-lg">
                            <div className="mr-4 mt-1">
                              <div className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold">
                                1
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium text-yellow-700 dark:text-yellow-300">
                                Start at your current location
                              </h4>
                              <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Head east toward University Avenue
                              </p>
                            </div>
                          </div>

                          <div className="h-10 w-1 bg-yellow-200 dark:bg-gray-600 ml-8"></div>

                          <div className="flex items-start p-4 bg-yellow-50 dark:bg-gray-700 rounded-lg">
                            <div className="mr-4 mt-1">
                              <div className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold">
                                2
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium text-yellow-700 dark:text-yellow-300">
                                Continue straight for 200 meters
                              </h4>
                              <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Pass the Student Union on your right
                              </p>
                            </div>
                          </div>

                          <div className="h-10 w-1 bg-yellow-200 dark:bg-gray-600 ml-8"></div>

                          <div className="flex items-start p-4 bg-yellow-50 dark:bg-gray-700 rounded-lg">
                            <div className="mr-4 mt-1">
                              <div className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold">
                                3
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium text-yellow-700 dark:text-yellow-300">
                                Turn left at the fountain
                              </h4>
                              <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Walk 150 meters toward the quad
                              </p>
                            </div>
                          </div>

                          <div className="h-10 w-1 bg-yellow-200 dark:bg-gray-600 ml-8"></div>

                          <div className="flex items-start p-4 bg-yellow-50 dark:bg-gray-700 rounded-lg">
                            <div className="mr-4 mt-1">
                              <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                                <Check className="h-5 w-5" />
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium text-green-600 dark:text-green-400">
                                Arrive at {selectedBuilding.name}
                              </h4>
                              <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Your destination is on the right
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="mt-6 flex justify-center">
                        <button
                          onClick={() => setActiveMode("map")}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded flex items-center"
                        >
                          <Map className="w-5 h-5 mr-2" />
                          View on Map
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <div className="mx-auto w-16 h-16 bg-yellow-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <Map className="w-8 h-8 text-yellow-500 dark:text-yellow-400" />
                      </div>
                      <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">
                        Select a building to get directions
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
                        Choose a location from the list on the left to view
                        detailed walking directions.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Building Details (when selected) */}
        {selectedBuilding && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="p-4 bg-yellow-500 dark:bg-yellow-600 text-white flex justify-between items-center">
              <h3 className="text-xl font-semibold">
                {selectedBuilding.name} Details
              </h3>
              <button
                onClick={() => setSelectedBuilding(null)}
                className="bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-800 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedBuilding.image}
                    alt={selectedBuilding.name}
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                  />

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="bg-yellow-50 dark:bg-gray-700 p-3 rounded-lg">
                      <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                        Type
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 capitalize">
                        {selectedBuilding.type}
                      </p>
                    </div>

                    <div className="bg-yellow-50 dark:bg-gray-700 p-3 rounded-lg">
                      <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                        Hours
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300">
                        {selectedBuilding.hours}
                      </p>
                    </div>

                    <div className="bg-yellow-50 dark:bg-gray-700 p-3 rounded-lg">
                      <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                        Accessibility
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300">
                        {selectedBuilding.accessibility
                          ? "Wheelchair Accessible"
                          : "Limited Accessibility"}
                      </p>
                    </div>

                    <div className="bg-yellow-50 dark:bg-gray-700 p-3 rounded-lg">
                      <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                        Location
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300">
                        Central Campus
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-yellow-700 dark:text-yellow-300 mb-4">
                    About {selectedBuilding.name}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {selectedBuilding.description}
                  </p>

                  <div className="mb-4">
                    <h4 className="text-lg font-medium text-yellow-700 dark:text-yellow-300 mb-2">
                      Available Facilities
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedBuilding.facilities.map((facility, index) => (
                        <span
                          key={index}
                          className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full text-sm"
                        >
                          {facility}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-yellow-700 dark:text-yellow-300 mb-2">
                      Today's Events
                    </h4>
                    <div className="space-y-2">
                      {selectedBuilding.events.map((event, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
                        >
                          <p className="text-gray-800 dark:text-gray-200">
                            {event}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-3">
                    <button
                      onClick={() => setActiveMode("directions")}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                      <Navigation className="w-5 h-5 mr-2" />
                      Get Directions
                    </button>

                    <button
                      onClick={handleARMode}
                      className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg flex items-center"
                    >
                      <Compass className="w-5 h-5 mr-2" />
                      AR View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* AR Warning Modal */}
        {showARWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-lg">
              <div className="flex items-center mb-4 text-yellow-500">
                <AlertTriangle className="w-8 h-8 mr-3" />
                <h3 className="text-xl font-bold">AR Mode Activating</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                AR mode uses your camera to provide navigation assistance.
                Please allow camera access and point your device at campus
                buildings to see information overlaid on your view.
              </p>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2 }}
                  className="h-full bg-yellow-500"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Campus Legend and Help Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h3 className="text-2xl font-semibold text-yellow-700 dark:text-yellow-300 mb-4 flex items-center">
            <BookOpen className="w-6 h-6 mr-2" />
            Campus Navigation Guide
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-medium text-yellow-600 dark:text-yellow-400 mb-3">
                Map Legend
              </h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    Your Current Location
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-red-500 rounded-full mr-3"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    Academic Buildings
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    Library
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-500 rounded-full mr-3"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    Recreational Facilities
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium text-yellow-600 dark:text-yellow-400 mb-3">
                Navigation Tips
              </h4>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 w-6 h-6 rounded-full flex items-center justify-center mr-2 shrink-0">
                    1
                  </span>
                  <span>
                    Use the search bar to quickly find specific buildings or
                    facilities.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 w-6 h-6 rounded-full flex items-center justify-center mr-2 shrink-0">
                    2
                  </span>
                  <span>
                    Filter buildings by type using the category buttons.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 w-6 h-6 rounded-full flex items-center justify-center mr-2 shrink-0">
                    3
                  </span>
                  <span>
                    Click on a building marker to view detailed information.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 w-6 h-6 rounded-full flex items-center justify-center mr-2 shrink-0">
                    4
                  </span>
                  <span>
                    Try AR mode for an immersive navigation experience.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Accessibility Features */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h3 className="text-2xl font-semibold text-yellow-700 dark:text-yellow-300 mb-4">
            Accessibility Features
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-yellow-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="h-12 w-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center text-yellow-600 dark:text-yellow-300 mb-3">
                <Wheelchair className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-medium text-yellow-700 dark:text-yellow-300 mb-2">
                Wheelchair Routes
              </h4>
              <p className="text-gray-700 dark:text-gray-300">
                Discover wheelchair-accessible paths throughout campus with
                highlighted routes and ramp locations.
              </p>
            </div>

            <div className="bg-yellow-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="h-12 w-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center text-yellow-600 dark:text-yellow-300 mb-3">
                <Headphones className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-medium text-yellow-700 dark:text-yellow-300 mb-2">
                Audio Navigation
              </h4>
              <p className="text-gray-700 dark:text-gray-300">
                Enable voice guidance for turn-by-turn directions and building
                information read aloud.
              </p>
            </div>

            <div className="bg-yellow-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="h-12 w-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center text-yellow-600 dark:text-yellow-300 mb-3">
                <Eye className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-medium text-yellow-700 dark:text-yellow-300 mb-2">
                High Contrast Mode
              </h4>
              <p className="text-gray-700 dark:text-gray-300">
                Toggle high contrast display for improved visibility and
                readability of map elements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper components for missing imports
function Check(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}

function Clock(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  );
}

function Eye(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );
}

function Headphones(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
    </svg>
  );
}

function SearchX(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      <line x1="17" y1="17" x2="21" y2="21"></line>
    </svg>
  );
}

function Wheelchair(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="14" cy="6" r="2"></circle>
      <path d="M10 9h4l-3 6"></path>
      <circle cx="8" cy="17" r="5"></circle>
      <path d="m17 15-2 4"></path>
      <path d="m22 18-5-3"></path>
    </svg>
  );
}

function X(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}
