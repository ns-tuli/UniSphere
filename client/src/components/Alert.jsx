import React, { useState, useEffect } from "react";
import axios from "axios"; // Add this import
import { createAlert } from "../api/Alert";
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
  const [loading, setLoading] = useState(false);

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

  const emergencyContacts = [
    {
      title: "Campus Security (24/7)",
      number: "080-2293-2400",
      icon: <FaShieldAlt className="text-2xl text-red-500" />,
    },
    {
      title: "Medical Emergency",
      number: "080-2293-2501",
      icon: <FaAmbulance className="text-2xl text-blue-500" />,
    },
    {
      title: "Fire Emergency",
      number: "080-2293-2333",
      icon: <FaFire className="text-2xl text-orange-500" />,
    },
    {
      title: "Emergency Helpline",
      number: "112",
      icon: <FaPhone className="text-2xl text-green-500" />,
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

  const cancelSOS = async () => {
    try {
      setCountdown(null);
      setIsSOSActive(false);
      setMessage("");
      setSelectedCategory("");
      setLoading(false);
    } catch (error) {
      console.error("Error cancelling alert:", error);
    }
  };

  const sendEmergencyAlert = async () => {
    setIsSOSActive(true);
    setLoading(true);
    
    const alertData = {
      category: selectedCategory,
      message: message || "Emergency alert", // Provide default message
      location: location || { lat: 0, lng: 0 }, // Provide default location
      status: "active"
    };

    try {
      console.log("Sending alert data:", alertData); // Debug log
      const response = await createAlert(alertData);
      console.log("Alert response:", response); // Debug log
      alert("Emergency alert has been sent to campus security.");
    } catch (error) {
      console.error("Error sending alert:", error);
      setIsSOSActive(false);
      alert("Failed to send emergency alert. Please call emergency services directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Emergency Header - Modified */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-4xl mr-4" />
              <div>
                <h1 className="text-3xl font-bold">Emergency Alert System</h1>
                <p className="text-lg opacity-90">
                  Quick response system for campus emergencies
                </p>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <span className="text-sm">Status: </span>
                <span className="font-semibold">System Active</span>
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full ml-2"></span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Map and Categories */}
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

            {/* Emergency Categories with Guidelines */}
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-6 flex items-center text-white">
                <FaBullhorn className="mr-2 text-red-500" />
                Select Emergency Type
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
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

              {/* Emergency Guidelines - Moved here */}
              {selectedCategory && (
                <div className="mt-8 border-t border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center text-white">
                    <FaInfoCircle className="mr-2 text-blue-500" />
                    Emergency Guidelines
                  </h3>
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
            </div>
          </div>

          {/* Right column - Modified */}
          <div className="space-y-6">
            {/* Emergency Contacts - New Section */}
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-6 flex items-center text-white">
                <FaPhone className="mr-2 text-red-500" />
                Emergency Contacts
              </h2>
              <div className="space-y-4">
                {emergencyContacts.map((contact, index) => (
                  <div
                    key={index}
                    className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {contact.icon}
                      <h3 className="text-white font-medium">
                        {contact.title}
                      </h3>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">
                      {contact.description}
                    </p>
                    <a
                      href={`tel:${contact.number}`}
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                    >
                      <FaPhone className="text-sm" />
                      <span className="font-mono">{contact.number}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-white">
                Additional Details
              </h2>
              <textarea
                className="w-full p-4 border rounded-lg bg-gray-700 text-white border-gray-600 
                  focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none mb-4"
                rows="4"
                placeholder="Provide specific details about the emergency..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              {/* SOS Button */}
              {!isSOSActive ? (
                <button
                  onClick={startSOS}
                  disabled={!selectedCategory || countdown !== null || loading}
                  className={`w-full ${
                    loading
                      ? "bg-gray-500"
                      : "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400"
                  } text-white rounded-lg py-4 flex items-center justify-center gap-3
                  transition-all transform hover:scale-102 disabled:opacity-50 disabled:cursor-not-allowed
                  shadow-lg hover:shadow-red-500/50`}
                >
                  {loading ? (
                    <span>Sending Alert...</span>
                  ) : countdown ? (
                    <div className="text-5xl font-bold animate-pulse">
                      {countdown}
                    </div>
                  ) : (
                    <>
                      <FaExclamationTriangle className="text-2xl" />
                      <span className="text-xl font-bold tracking-wider">
                        SEND EMERGENCY ALERT
                      </span>
                    </>
                  )}
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="bg-red-900/30 p-3 rounded-lg">
                    <p className="text-red-200 text-center font-medium">
                      Emergency Alert Active
                    </p>
                  </div>
                  <button
                    onClick={cancelSOS}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg 
                      flex items-center justify-center gap-2 font-bold transition-all"
                  >
                    Cancel Emergency Alert
                  </button>
                </div>
              )}

              {isSOSActive && (
                <div className="mt-4 p-4 bg-red-900/50 rounded-lg">
                  <p className="text-red-200 text-sm text-center">
                    Alert is active. Campus security has been notified.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alert;
