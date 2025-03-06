import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'aframe';
import 'aframe-look-at-component';
import { Entity, Scene } from 'aframe-react';

const AR = () => {
  const [places, setPlaces] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Load locations from API
    const fetchLocations = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/ar/locations`);
        setPlaces(response.data);
      } catch (error) {
        console.error('Error fetching locations:', error);
        setErrorMessage('Failed to load locations');
      }
    };

    // Get user's location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        error => {
          setErrorMessage('Error getting location: ' + error.message);
        }
      );

      // Request camera permission
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(() => {
          fetchLocations();
        })
        .catch(() => {
          setErrorMessage('Please allow camera access to use AR features');
        });
    } else {
      setErrorMessage('Geolocation is not supported by your browser');
    }
  }, []);

  if (errorMessage) {
    return <div className="error-message">{errorMessage}</div>;
  }

  if (!userLocation) {
    return <div>Loading location...</div>;
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
      <Scene
        embedded
        arjs='sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;'
        renderer="logarithmicDepthBuffer: true;"
        vr-mode-ui="enabled: false"
      >
        {places.map((place, index) => (
          <Entity
            key={index}
            gps-entity-place={`latitude: ${place.coordinates.latitude}; longitude: ${place.coordinates.longitude};`}
            look-at="[gps-camera]"
          >
            <Entity
              geometry={`primitive: ${place.icon || 'box'}`}
              material="color: #4CC3D9"
              scale="0.5 0.5 0.5"
              position="0 0 0"
            />
            <Entity
              text={`value: ${place.name}; align: center; width: 3`}
              position="0 1 0"
              scale="1 1 1"
            />
          </Entity>
        ))}
        <Entity primitive="a-camera" gps-camera rotation-reader />
      </Scene>
    </div>
  );
};

export default AR;
