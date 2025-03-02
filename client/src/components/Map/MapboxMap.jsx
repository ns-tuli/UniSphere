import React, { useEffect, useState } from "react";
import Map, { Marker, Popup, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MapboxMap = ({
  buildings,
  selectedBuilding,
  userLocation,
  onBuildingSelect,
  viewState,
  onViewStateChange,
}) => {
  const [mapError, setMapError] = useState(null);

  useEffect(() => {
    // Verify Mapbox token on component mount
    if (!import.meta.env.VITE_MAPBOX_TOKEN) {
      setMapError("Mapbox token is missing");
      console.error("Mapbox token is not configured");
    }
  }, []);

  if (mapError) {
    return (
      <div className="flex items-center justify-center h-full bg-red-50 dark:bg-red-900">
        <p className="text-red-600 dark:text-red-200">{mapError}</p>
      </div>
    );
  }

  return (
    <Map
      {...viewState}
      onMove={(evt) => onViewStateChange(evt.viewState)}
      style={{ width: "100%", height: "100%" }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
      onError={(e) => {
        console.error("Mapbox Error:", e);
        setMapError("Failed to load map");
      }}
    >
      <NavigationControl position="top-right" />

      {/* Enhanced User Location Marker */}
      {userLocation && (
        <Marker longitude={userLocation[1]} latitude={userLocation[0]}>
          <div className="relative">
            {/* Outer pulsing circle */}
            <div className="absolute w-12 h-12 bg-blue-500/30 rounded-full animate-ping" />
            {/* Middle circle */}
            <div className="absolute w-8 h-8 bg-blue-500/50 rounded-full top-2 left-2" />
            {/* Inner dot */}
            <div className="absolute w-4 h-4 bg-blue-500 rounded-full top-4 left-4 border-2 border-white shadow-lg" />
            {/* Accuracy circle */}
            <div className="absolute w-16 h-16 border-2 border-blue-500/20 rounded-full -top-2 -left-2" />
          </div>
        </Marker>
      )}

      {/* Building Markers */}
      {buildings?.map((building) => (
        <Marker
          key={building.id}
          longitude={building.coordinates[1]}
          latitude={building.coordinates[0]}
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            onBuildingSelect(building);
          }}
        >
          <div className="cursor-pointer transform hover:scale-110 transition-transform">
            <div
              className={`w-6 h-6 rounded-full ${
                building.type === "academic"
                  ? "bg-red-500"
                  : building.type === "library"
                  ? "bg-green-500"
                  : "bg-purple-500"
              } shadow-lg border-2 border-white`}
            />
          </div>
        </Marker>
      ))}

      {/* Selected Building Popup */}
      {selectedBuilding && (
        <Popup
          longitude={selectedBuilding.coordinates[1]}
          latitude={selectedBuilding.coordinates[0]}
          anchor="bottom"
          onClose={() => onBuildingSelect(null)}
          closeOnClick={false}
        >
          <div className="p-2 max-w-xs">
            <h3 className="font-bold text-lg">{selectedBuilding.name}</h3>
            <p className="text-sm text-gray-600">
              {selectedBuilding.description}
            </p>
            <p className="text-xs mt-1 text-gray-500">
              {selectedBuilding.hours}
            </p>
          </div>
        </Popup>
      )}
    </Map>
  );
};

export default MapboxMap;
