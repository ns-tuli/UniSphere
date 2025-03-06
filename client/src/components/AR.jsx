import React, { useEffect, useState } from "react";
import axios from "axios";
import "aframe";
import "aframe-look-at-component";
import { Entity, Scene } from "aframe-react";
import { FaCompass } from "react-icons/fa";
import "./AR.css";

const AR = () => {
  const [places, setPlaces] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [cameraPermission, setCameraPermission] = useState(false);
  const [arStarted, setArStarted] = useState(false);
  const [navigationMode, setNavigationMode] = useState("ar"); // 'ar' or 'maps'
  const [deviceOrientation, setDeviceOrientation] = useState(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);

  // Calculate distance between two points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c * 1000).toFixed(0); // Convert to meters
  };

  // Calculate bearing between two points
  const calculateBearing = (lat1, lon1, lat2, lon2) => {
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;
    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x =
      Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    return Math.atan2(y, x);
  };

  const handleOrientation = (event) => {
    setDeviceOrientation({
      alpha: event.alpha, // compass direction
      beta: event.beta, // front/back tilt
      gamma: event.gamma, // left/right tilt
    });
  };

  const startAR = async () => {
    try {
      // Request camera permission
      await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraPermission(true);

      if (isDesktop) {
        // For desktop: request device orientation permission
        if (typeof DeviceOrientationEvent.requestPermission === "function") {
          const permission = await DeviceOrientationEvent.requestPermission();
          if (permission === "granted") {
            window.addEventListener("deviceorientation", handleOrientation);
          }
        } else {
          window.addEventListener("deviceorientation", handleOrientation);
        }
      }

      // Get user location
      navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          console.log("Current position:", position.coords);
        },
        (error) => setErrorMessage("Error getting location: " + error.message),
        { enableHighAccuracy: true, maximumAge: 0 }
      );

      // Fetch nearby locations
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/ar/locations`
      );
      setPlaces(response.data);
      setArStarted(true);
      setLoading(false);
    } catch (error) {
      setErrorMessage(
        error.name === "NotAllowedError"
          ? "Please allow camera access to use AR"
          : "Error starting AR experience"
      );
    }
  };

  const openNavigation = (place) => {
    // Get user's current location
    if (!userLocation) {
      setErrorMessage("Cannot get current location");
      return;
    }

    const { latitude: startLat, longitude: startLon } = userLocation;
    const { latitude: destLat, longitude: destLon } = place.coordinates;

    // Different navigation options
    const navigationOptions = {
      walking: `https://www.google.com/maps/dir/?api=1&origin=${startLat},${startLon}&destination=${destLat},${destLon}&travelmode=walking`,
      driving: `https://www.google.com/maps/dir/?api=1&origin=${startLat},${startLon}&destination=${destLat},${destLon}&travelmode=driving`,
      transit: `https://www.google.com/maps/dir/?api=1&origin=${startLat},${startLon}&destination=${destLat},${destLon}&travelmode=transit`,
    };

    return (
      <div className="navigation-modal">
        <h4>Navigate to {place.name}</h4>
        <p>
          Distance: {calculateDistance(startLat, startLon, destLat, destLon)}m
        </p>
        <div className="navigation-buttons">
          <button onClick={() => window.open(navigationOptions.walking)}>
            🚶 Walk
          </button>
          <button onClick={() => window.open(navigationOptions.driving)}>
            🚗 Drive
          </button>
          <button onClick={() => window.open(navigationOptions.transit)}>
            🚌 Transit
          </button>
        </div>
      </div>
    );
  };

  const DesktopAROverlay = () => (
    <div className="desktop-ar-overlay">
      <div className="compass">
        <FaCompass
          style={{
            transform: `rotate(${deviceOrientation?.alpha || 0}deg)`,
            fontSize: "2rem",
          }}
        />
      </div>
      <div className="location-markers">
        {places.map((place, index) => {
          if (!userLocation) return null;
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            place.coordinates.latitude,
            place.coordinates.longitude
          );

          // Calculate relative position based on bearing
          const bearing = calculateBearing(
            userLocation.latitude,
            userLocation.longitude,
            place.coordinates.latitude,
            place.coordinates.longitude
          );

          return (
            <div
              key={index}
              className="location-marker"
              style={{
                transform: `translate(${
                  (Math.sin(bearing) * distance) / 10
                }px, ${(Math.cos(bearing) * distance) / 10}px)`,
              }}
              onClick={() => setSelectedPlace(place)}
            >
              <div className="marker-dot" />
              <span className="marker-label">{place.name}</span>
              <span className="marker-distance">{distance}m</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  if (!arStarted) {
    return (
      <div className="ar-start-screen">
        <h2>AR Navigation</h2>
        <p>Point your camera to discover nearby locations</p>
        <button className="start-ar-button" onClick={startAR}>
          Start AR Navigation
        </button>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>
    );
  }

  return (
    <div className="ar-container">
      {loading ? (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Starting AR Experience...</p>
        </div>
      ) : (
        <>
          <Scene
            embedded
            arjs="sourceType: webcam; debugUIEnabled: true; sourceWidth: 1280; sourceHeight: 960; displayWidth: 1280; displayHeight: 960;"
            renderer="antialias: true; alpha: true"
            vr-mode-ui="enabled: false"
          >
            {places.map((place, index) => {
              const distance = userLocation
                ? calculateDistance(
                    userLocation.latitude,
                    userLocation.longitude,
                    place.coordinates.latitude,
                    place.coordinates.longitude
                  )
                : null;

              if (distance > 1000) return null; // Only show places within 1km

              return (
                <Entity
                  key={index}
                  gps-entity-place={`latitude: ${place.coordinates.latitude}; longitude: ${place.coordinates.longitude};`}
                  look-at="[gps-camera]"
                  onClick={() => setSelectedPlace(place)}
                >
                  <Entity
                    geometry={`primitive: ${place.icon || "box"}`}
                    material={`color: ${
                      place.name === "Siyam's home" ? "#FF0000" : "#4CC3D9"
                    }`}
                    scale="0.5 0.5 0.5"
                    animation__scale="property: scale; to: 1 1 1; dur: 200; startEvents: mouseenter"
                    animation__scale_reverse="property: scale; to: 0.5 0.5 0.5; dur: 200; startEvents: mouseleave"
                  />
                  <Entity
                    text={`value: ${
                      place.name
                    }\n${distance}m; align: center; width: 3; color: ${
                      place.name === "Siyam's home" ? "#FF0000" : "#FFFFFF"
                    }`}
                    position="0 1 0"
                    scale="1 1 1"
                  />
                </Entity>
              );
            })}
            <Entity primitive="a-camera" gps-camera rotation-reader />
          </Scene>

          {isDesktop && <DesktopAROverlay />}

          <div className="ar-overlay">
            {userLocation && (
              <div className="location-info">
                Your Location: {userLocation.latitude.toFixed(4)},
                {userLocation.longitude.toFixed(4)}
              </div>
            )}

            {selectedPlace && (
              <div className="place-details">
                <h3>{selectedPlace.name}</h3>
                <p>{selectedPlace.description}</p>
                {openNavigation(selectedPlace)}
                <button onClick={() => setSelectedPlace(null)}>Close</button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AR;
