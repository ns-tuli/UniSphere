import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import AROverlay from "./AROverlay";

const ARView = ({ buildings, userLocation }) => {
  const videoRef = useRef(null);
  const [detectedBuilding, setDetectedBuilding] = useState(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error("Camera access not supported");
      return;
    }

    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error("Camera access error:", err));

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Calculate distance between two coordinates
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // Simulated building detection based on user location
  useEffect(() => {
    if (!userLocation || !buildings) return;

    const checkNearbyBuildings = () => {
      const nearestBuilding = buildings.reduce((nearest, building) => {
        const dist = calculateDistance(
          userLocation[0],
          userLocation[1],
          building.coordinates[0],
          building.coordinates[1]
        );

        if (!nearest || dist < nearest.distance) {
          return { building, distance: dist };
        }
        return nearest;
      }, null);

      if (nearestBuilding && nearestBuilding.distance < 100) {
        // Within 100 meters
        setDetectedBuilding(nearestBuilding.building);
        setDistance(nearestBuilding.distance);
      } else {
        setDetectedBuilding(null);
      }
    };

    const interval = setInterval(checkNearbyBuildings, 1000);
    return () => clearInterval(interval);
  }, [userLocation, buildings]);

  return (
    <div className="relative h-full">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />

      {/* AR Compass Guide */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 rounded-full p-2">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8"
        >
          <svg viewBox="0 0 24 24" fill="white">
            <path d="M12 2L8 6h8l-4-4zm0 20l4-4H8l4 4zm4-16v8l4-4-4-4zm-8 0L4 6l4 4V6z" />
          </svg>
        </motion.div>
      </div>

      {/* Building Detection Overlay */}
      {detectedBuilding && (
        <AROverlay building={detectedBuilding} distance={distance} />
      )}

      {/* Camera Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg text-sm">
        Point your camera at buildings to view information
      </div>
    </div>
  );
};

export default ARView;
