import React, { useState, useEffect } from "react";
import {
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaPhone,
  FaFire,
  FaAmbulance,
  FaShieldAlt,
  FaCarCrash,
  FaExclamationCircle,
  FaHistory,
  FaInfoCircle,
  FaBullhorn,
  FaCloudShowersHeavy,
} from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Alert = () => {
  const [location, setLocation] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [message, setMessage] = useState("");
  const [isSOSActive, setIsSOSActive] = useState(false);

  const emergencyCategories = [
    {
      id: "fire",
      label: "Fire Emergency",
      color: "bg-red-500",
      icon: <FaFire className="text-2xl mb-2" />,
    },
    {
      id: "medical",
      label: "Medical Emergency",
      color: "bg-blue-500",
      icon: <FaAmbulance className="text-2xl mb-2" />,
    },
    {
      id: "harassment",
      label: "Harassment",
      color: "bg-purple-500",
      icon: <FaShieldAlt className="text-2xl mb-2" />,
    },
    {
      id: "accident",
      label: "Accident",
      color: "bg-yellow-500",
      icon: <FaCarCrash className="text-2xl mb-2" />,
    },
    {
      id: "security",
      label: "Security Threat",
      color: "bg-orange-500",
      icon: <FaExclamationCircle className="text-2xl mb-2" />,
    },
    {
      id: "natural",
      label: "Natural Disaster",
      color: "bg-teal-500",
      icon: <FaCloudShowersHeavy className="text-2xl mb-2" />,
    },
  ];

  const emergencyGuidelines = {
    fire: [
      "Evacuate the building immediately",
      "Pull the fire alarm",
      "Call campus security",
      "Do not use elevators",
    ],
    medical: [
      "Call emergency services",
      "Don't move the injured person",
      "Apply first aid if qualified",
      "Clear the area",
    ],
    harassment: [
      "Move to a safe location",
      "Document the incident",
      "Contact campus security",
      "Preserve any evidence",
    ],
    accident: [
      "Check for injuries",
      "Call emergency services",
      "Document the scene",
      "Exchange information if vehicle-related",
    ],
    security: [
      "Find safe shelter",
      "Lock doors and windows",
      "Stay quiet",
      "Follow authority instructions",
    ],
    natural: [
      "Move to designated shelter",
      "Stay away from windows",
      "Follow evacuation routes",
      "Monitor emergency broadcasts",
    ],
  };

  const recentAlerts = [
    {
      id: 1,
      category: "Fire Drill",
      time: "2 hours ago",
      location: "Engineering Building",
    },
    {
      id: 2,
      category: "Medical Response",
      time: "Yesterday",
      location: "Student Center",
    },
    {
      id: 3,
      category: "Security Alert",
      time: "2 days ago",
      location: "North Parking Lot",
    },
  ];

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  const startSOS = () => {
    setCountdown(5);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          sendEmergencyAlert();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelSOS = () => {
    setCountdown(null);
    setIsSOSActive(false);
  };

  const sendEmergencyAlert = async () => {
    setIsSOSActive(true);
    // Implement your alert sending logic here
    const alertData = {
      category: selectedCategory,
      location,
      message,
      timestamp: new Date().toISOString(),
    };

    try {
      // Send to your backend
      console.log("Sending emergency alert:", alertData);
      // await axios.post('/api/emergency-alerts', alertData);
    } catch (error) {
      console.error("Error sending alert:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Emergency Header with SOS Button */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white relative">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center flex-grow">
              <FaExclamationTriangle className="text-4xl mr-4" />
              <div>
                <h1 className="text-3xl font-bold">Emergency Alert System</h1>
                <p className="text-lg opacity-90">
                  Quick response system for campus emergencies
                </p>
              </div>
            </div>

            {/* Moved SOS Button here */}
            <div className="flex-shrink-0">
              {!isSOSActive ? (
                <button
                  onClick={startSOS}
                  disabled={!selectedCategory || countdown !== null}
                  className="bg-white text-red-600 rounded-lg px-8 py-4 flex flex-col items-center justify-center text-xl font-bold shadow-lg hover:bg-gray-100 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {countdown ? (
                    <span className="text-3xl">{countdown}</span>
                  ) : (
                    <>
                      <FaExclamationTriangle className="text-3xl mb-1" />
                      <span>SOS</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={cancelSOS}
                  className="bg-gray-800 text-white rounded-lg px-8 py-4 flex items-center justify-center text-xl font-bold shadow-lg hover:bg-gray-700 transition-all"
                >
                  Cancel Alert
                </button>
              )}
            </div>

            <div className="hidden md:block ml-4">
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <span className="text-sm">Status: </span>
                <span className="font-semibold">System Active</span>
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full ml-2"></span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Map Container */}
            {location && (
              <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
                <div className="h-[500px] w-full">
                  <MapContainer
                    center={[location.lat, location.lng]}
                    zoom={17}
                    style={{ height: "100%", width: "100%" }}
                    className="dark-map" // Add this class for dark theme
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[location.lat, location.lng]}>
                      <Popup>Your current location</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>
            )}

            {/* Emergency Categories */}
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-6 flex items-center text-white">
                <FaBullhorn className="mr-2 text-red-500" />
                Select Emergency Type
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {emergencyCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`p-6 rounded-xl ${
                      category.color
                    } text-white transition-all transform hover:scale-105 
                      flex flex-col items-center justify-center text-center
                      ${
                        selectedCategory === category.id
                          ? "ring-4 ring-offset-2"
                          : ""
                      }`}
                  >
                    {category.icon}
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Emergency Guidelines */}
            {selectedCategory && (
              <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                <h2 className="text-xl font-semibold mb-4 flex items-center text-white">
                  <FaInfoCircle className="mr-2 text-blue-500" />
                  Emergency Guidelines
                </h2>
                <ul className="space-y-3">
                  {emergencyGuidelines[selectedCategory].map(
                    (guideline, index) => (
                      <li
                        key={index}
                        className="flex items-center text-gray-300"
                      >
                        <span className="w-6 h-6 rounded-full bg-blue-900 text-blue-300 flex items-center justify-center mr-3 text-sm">
                          {index + 1}
                        </span>
                        {guideline}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            {/* Message Input */}
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-white">
                Additional Details
              </h2>
              <textarea
                className="w-full p-4 border rounded-lg bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows="4"
                placeholder="Provide specific details about the emergency..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {/* Recent Alerts */}
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-white">
                <FaHistory className="mr-2 text-gray-400" />
                Recent Alerts
              </h2>
              <div className="space-y-3">
                {recentAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium text-white">
                        {alert.category}
                      </h3>
                      <p className="text-sm text-gray-400">{alert.location}</p>
                    </div>
                    <span className="text-xs text-gray-400">{alert.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alert;
