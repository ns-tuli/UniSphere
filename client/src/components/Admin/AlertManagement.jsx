import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaExclamationTriangle,
  FaCheck,
  FaTimes,
  FaPhoneVolume,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { getAlerts, updateAlert } from "../../api/Alert";

const AlertManagement = () => {
  const [alerts, setAlerts] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);

  useEffect(() => {
    fetchAlerts();
    // Set up real-time updates
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const data = await getAlerts();
      console.log("Received alerts:", data); // Debug log
      
      // Ensure data is an array before filtering
      const alertsList = Array.isArray(data) ? data : [];
      const activeAlerts = alertsList.filter(alert => 
        ["active", "pending"].includes(alert.status)
      );
      
      setAlerts(activeAlerts);
      setError(null);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      setError(error.message || "Failed to fetch alerts");
      setAlerts([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const updateAlertStatus = async (alertId, status) => {
    try {
      await updateAlert(alertId, status);
      alert(`Alert successfully marked as ${status}`);
      fetchAlerts();
      if (selectedAlert?._id === alertId) {
        setSelectedAlert(null);
      }
    } catch (error) {
      console.error("Error updating alert:", error);
      alert("Failed to update alert status");
    }
  };

  const getPriorityColor = (category) => {
    const colors = {
      fire: "red",
      medical: "blue",
      harassment: "purple",
      accident: "yellow",
      security: "orange",
      natural: "teal",
    };
    return colors[category] || "gray";
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center">
            <FaExclamationTriangle className="text-4xl text-white mr-4" />
            <div>
              <h1 className="text-3xl font-bold text-white">
                Emergency Alert Management
              </h1>
              <p className="text-white opacity-90">
                Monitor and respond to campus emergencies
              </p>
            </div>
          </div>
        </div>

        {/* Alert List and Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Alert List */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-6 text-white">
                Active Alerts
              </h2>

              {loading ? (
                <div className="text-gray-400 text-center py-4">Loading...</div>
              ) : error ? (
                <div className="text-red-400 text-center py-4">{error}</div>
              ) : alerts.length === 0 ? (
                <div className="text-gray-400 text-center py-4">
                  No active alerts
                </div>
              ) : (
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div
                      key={alert._id}
                      onClick={() => setSelectedAlert(alert)}
                      className={`p-4 rounded-lg cursor-pointer transition-all
                        ${
                          selectedAlert?._id === alert._id
                            ? "bg-gray-600"
                            : "bg-gray-700 hover:bg-gray-650"
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div
                            className={`w-3 h-3 rounded-full mr-3 bg-${getPriorityColor(
                              alert.category
                            )}-500`}
                          ></div>
                          <span className="text-white font-medium">
                            {alert.category.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm text-gray-400">
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-gray-300 mt-2 text-sm line-clamp-2">
                        {alert.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Alert Details and Map */}
          <div className="lg:col-span-2">
            {selectedAlert ? (
              <div className="space-y-6">
                {/* Alert Details */}
                <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {selectedAlert.category.toUpperCase()} EMERGENCY
                      </h3>
                      <p className="text-gray-400">
                        Reported:{" "}
                        {new Date(selectedAlert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          updateAlertStatus(selectedAlert._id, "resolved")
                        }
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <FaCheck /> Resolve
                      </button>
                      <button
                        onClick={() =>
                          updateAlertStatus(selectedAlert._id, "dismissed")
                        }
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        <FaTimes /> Dismiss
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-white font-semibold mb-4">Details</h4>
                      <p className="text-gray-300">{selectedAlert.message}</p>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-4">Contact</h4>
                      <div className="flex items-center gap-3 text-gray-300">
                        <FaPhoneVolume />
                        <span>Emergency Services: 112</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map */}
                {selectedAlert.location && (
                  <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
                    <div className="h-[400px] w-full">
                      <MapContainer
                        center={[
                          selectedAlert.location.lat,
                          selectedAlert.location.lng,
                        ]}
                        zoom={17}
                        style={{ height: "100%", width: "100%" }}
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker
                          position={[
                            selectedAlert.location.lat,
                            selectedAlert.location.lng,
                          ]}
                        >
                          <Popup>Emergency Location</Popup>
                        </Marker>
                      </MapContainer>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700 flex items-center justify-center h-64">
                <p className="text-gray-400 text-lg">
                  Select an alert to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertManagement;
