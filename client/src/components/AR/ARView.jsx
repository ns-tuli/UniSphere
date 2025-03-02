import React, { useEffect, useRef } from "react";
import "aframe";
import "ar.js";

const ARView = ({ buildings, userLocation }) => {
  const sceneRef = useRef(null);

  useEffect(() => {
    if (!buildings || !userLocation) return;

    // Initialize AR.js when component mounts
    const arSystem = sceneRef.current.systems["arjs"];
    if (arSystem) {
      arSystem.restart();
    }
  }, [buildings, userLocation]);

  return (
    <a-scene
      ref={sceneRef}
      embedded
      arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix;"
      vr-mode-ui="enabled: false"
    >
      {buildings?.map((building) => (
        <a-entity
          key={building.id}
          gps-entity-place={`latitude: ${building.coordinates[0]}; longitude: ${building.coordinates[1]}`}
        >
          <a-text
            value={building.name}
            look-at="[gps-camera]"
            scale="20 20 20"
            align="center"
            color="#FFD700"
          ></a-text>
        </a-entity>
      ))}
      <a-camera gps-camera rotation-reader></a-camera>
    </a-scene>
  );
};

export default ARView;
