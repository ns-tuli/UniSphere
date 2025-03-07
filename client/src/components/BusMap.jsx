import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Bus } from "lucide-react";

const BusMap = ({ busLocation, busInfo, isRealTime = false }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const pathRef = useRef(null);
  const locationHistoryRef = useRef([]);

  // Add current location to history
  useEffect(() => {
    if (busLocation && busLocation.lat && busLocation.lng) {
      // Only add if it's different from the last location
      const lastLocation =
        locationHistoryRef.current[locationHistoryRef.current.length - 1];
      if (
        !lastLocation ||
        lastLocation.lat !== busLocation.lat ||
        lastLocation.lng !== busLocation.lng
      ) {
        locationHistoryRef.current.push({ ...busLocation, time: new Date() });

        // Keep only the last 100 points
        if (locationHistoryRef.current.length > 100) {
          locationHistoryRef.current.shift();
        }

        // Update path if it exists
        if (pathRef.current && mapRef.current) {
          const points = locationHistoryRef.current.map((loc) => [
            loc.lat,
            loc.lng,
          ]);
          pathRef.current.setLatLngs(points);
        }

        // Update marker position if it exists
        if (markerRef.current) {
          markerRef.current.setLatLng([busLocation.lat, busLocation.lng]);
        }
      }
    }
  }, [busLocation]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) {
      // Create map instance
      const map = L.map("bus-map").setView(
        [busLocation.lat, busLocation.lng],
        15
      );
      mapRef.current = map;

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Create custom bus icon
      const busIcon = L.divIcon({
        html: `<div class="bus-icon">
                <div class="bus-icon-inner">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bus">
                    <path d="M8 6v6"></path>
                    <path d="M16 6v6"></path>
                    <path d="M2 12h20"></path>
                    <path d="M7 18h10"></path>
                    <path d="M18 18h1a2 2 0 0 0 2-2v-7a5 5 0 0 0-5-5H8a5 5 0 0 0-5 5v7a2 2 0 0 0 2 2h1"></path>
                    <circle cx="7" cy="18" r="2"></circle>
                    <circle cx="17" cy="18" r="2"></circle>
                  </svg>
                </div>
                <div class="bus-pulse"></div>
              </div>`,
        className: "",
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      // Add marker for bus location
      const marker = L.marker([busLocation.lat, busLocation.lng], {
        icon: busIcon,
      }).addTo(map);
      markerRef.current = marker;

      // Add popup with bus info
      marker.bindPopup(`
        <div class="bus-popup">
          <div class="bus-popup-header">
            <strong>Bus ${busInfo.busNumber}</strong>
          </div>
          <div class="bus-popup-content">
            <p>${busInfo.name}</p>
            <p>Driver: ${busInfo.driver}</p>
            ${isRealTime ? '<p class="real-time-badge">LIVE</p>' : ""}
          </div>
        </div>
      `);

      // Add path for tracking
      const path = L.polyline([], {
        color: "#3b82f6",
        weight: 3,
        opacity: 0.7,
        lineJoin: "round",
      }).addTo(map);
      pathRef.current = path;

      // Initialize with current location
      if (busLocation && busLocation.lat && busLocation.lng) {
        locationHistoryRef.current = [{ ...busLocation, time: new Date() }];
      }
    }

    // Clean up on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
        pathRef.current = null;
      }
    };
  }, []);

  // Update map when real-time status changes
  useEffect(() => {
    if (markerRef.current) {
      // Update popup content with real-time status
      const popupContent = `
        <div class="bus-popup">
          <div class="bus-popup-header">
            <strong>Bus ${busInfo.busNumber}</strong>
          </div>
          <div class="bus-popup-content">
            <p>${busInfo.name}</p>
            <p>Driver: ${busInfo.driver}</p>
            ${isRealTime ? '<p class="real-time-badge">LIVE</p>' : ""}
          </div>
        </div>
      `;
      markerRef.current.setPopupContent(popupContent);

      // If real-time is active, open the popup
      if (isRealTime && !markerRef.current.isPopupOpen()) {
        markerRef.current.openPopup();
      }
    }
  }, [isRealTime, busInfo]);

  // Update map when location changes
  useEffect(() => {
    if (mapRef.current && markerRef.current && busLocation) {
      // Update marker position
      markerRef.current.setLatLng([busLocation.lat, busLocation.lng]);

      // Pan map to new location if real-time tracking is active
      if (isRealTime) {
        mapRef.current.panTo([busLocation.lat, busLocation.lng]);
      }
    }
  }, [busLocation, isRealTime]);

  return (
    <>
      <style jsx="true">{`
        .bus-icon {
          position: relative;
          width: 40px;
          height: 40px;
        }
        .bus-icon-inner {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 30px;
          height: 30px;
          background-color: ${isRealTime ? "#ef4444" : "#3b82f6"};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          z-index: 10;
          box-shadow: 0 0 0 2px white;
        }
        .bus-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
          background-color: ${isRealTime
            ? "rgba(239, 68, 68, 0.5)"
            : "rgba(59, 130, 246, 0.5)"};
          border-radius: 50%;
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0;
          }
        }
        .bus-popup {
          min-width: 150px;
        }
        .bus-popup-header {
          font-size: 14px;
          margin-bottom: 5px;
        }
        .bus-popup-content {
          font-size: 12px;
        }
        .bus-popup-content p {
          margin: 3px 0;
        }
        .real-time-badge {
          display: inline-block;
          background-color: #ef4444;
          color: white;
          font-size: 10px;
          font-weight: bold;
          padding: 2px 6px;
          border-radius: 10px;
          margin-top: 5px;
        }
      `}</style>
      <div id="bus-map" style={{ width: "100%", height: "100%" }}></div>
    </>
  );
};

export default BusMap;
