import React, { useEffect, useState } from "react";
import axios from "axios";
import "aframe";
import "aframe-look-at-component";
import { Entity, Scene } from "aframe-react";
import "./AR.css"; // We'll create this next

const AR = () => {
  const [places, setPlaces] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [filterType, setFilterType] = useState("all");

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

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/ar/locations`
        );
        setPlaces(response.data);
      } catch (error) {
        console.error("Error fetching locations:", error);
        setErrorMessage("Failed to load locations");
      } finally {
        setLoading(false);
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(
        // Use watchPosition instead of getCurrentPosition
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => setErrorMessage("Error getting location: " + error.message),
        { enableHighAccuracy: true }
      );

      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(() => fetchLocations())
        .catch(() => setErrorMessage("Please allow camera access"));
    } else {
      setErrorMessage("Geolocation not supported");
    }
  }, []);

  const filteredPlaces = places.filter(
    (place) => filterType === "all" || place.type === filterType
  );

  return (
    <div className="ar-container">
      {/* AR Scene */}
      <div className="ar-scene-container">
        {loading ? (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p>Loading AR Experience...</p>
          </div>
        ) : (
          <Scene
            embedded
            arjs="sourceType: webcam; debugUIEnabled: false; sourceWidth: 1280; sourceHeight: 960; displayWidth: 1280; displayHeight: 960;"
            renderer="antialias: true; alpha: true"
            vr-mode-ui="enabled: false"
          >
            {filteredPlaces.map((place, index) => {
              const distance = userLocation
                ? calculateDistance(
                    userLocation.latitude,
                    userLocation.longitude,
                    place.coordinates.latitude,
                    place.coordinates.longitude
                  )
                : null;

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
                      selectedPlace?.name === place.name ? "#FF4444" : "#4CC3D9"
                    }`}
                    scale="0.5 0.5 0.5"
                    animation__scale={`property: scale; to: 1 1 1; dur: 200; startEvents: mouseenter`}
                    animation__scale_reverse={`property: scale; to: 0.5 0.5 0.5; dur: 200; startEvents: mouseleave`}
                  />
                  <Entity
                    text={`value: ${place.name}\n${distance}m; align: center; width: 3`}
                    position="0 1 0"
                    scale="1 1 1"
                  />
                </Entity>
              );
            })}
            <Entity primitive="a-camera" gps-camera rotation-reader />
          </Scene>
        )}
      </div>

      {/* UI Overlays */}
      <div className="ar-ui-overlay">
        <div className="ar-controls">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Places</option>
            <option value="building">Buildings</option>
            <option value="classroom">Classrooms</option>
            <option value="office">Offices</option>
          </select>
        </div>

        {selectedPlace && (
          <div className="place-details">
            <h3>{selectedPlace.name}</h3>
            <p>{selectedPlace.description}</p>
            <button
              onClick={() => {
                // Open in Google Maps
                window.open(
                  `https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.coordinates.latitude},${selectedPlace.coordinates.longitude}`
                );
              }}
            >
              Navigate Here
            </button>
            <button onClick={() => setSelectedPlace(null)}>Close</button>
          </div>
        )}

        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default AR;
