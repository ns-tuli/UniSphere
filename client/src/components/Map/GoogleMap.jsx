import React, { useCallback, useEffect, useMemo } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

const GoogleMapComponent = ({
  buildings,
  selectedBuilding,
  userLocation,
  onBuildingSelect,
  viewState,
  onViewStateChange,
  routeStart,
  routeEnd,
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["marker"],
  });

  const mapRef = React.useRef(null);
  const markersRef = React.useRef({});

  const mapOptions = useMemo(
    () => ({
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      clickableIcons: false,
    }),
    []
  );

  const onLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  // Handle map center changes without causing infinite loops
  const handleCenterChanged = useCallback(() => {
    if (mapRef.current) {
      const center = mapRef.current.getCenter();
      if (center && !isNaN(center.lat()) && !isNaN(center.lng())) {
        const newCenter = {
          latitude: center.lat(),
          longitude: center.lng(),
          zoom: viewState.zoom,
        };

        // Only update if values have changed significantly
        if (
          Math.abs(newCenter.latitude - viewState.latitude) > 0.0001 ||
          Math.abs(newCenter.longitude - viewState.longitude) > 0.0001
        ) {
          onViewStateChange(newCenter);
        }
      }
    }
  }, [viewState.zoom, onViewStateChange]);

  // Create and manage markers
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const { AdvancedMarkerElement } = google.maps.marker;

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => (marker.map = null));
    markersRef.current = {};

    // Create user location marker
    if (userLocation) {
      const userMarker = new AdvancedMarkerElement({
        map: mapRef.current,
        position: { lat: userLocation[0], lng: userLocation[1] },
        title: "Your Location",
        content: createUserLocationMarker(),
      });
      markersRef.current.user = userMarker;
    }

    // Create building markers
    buildings?.forEach((building) => {
      const marker = new AdvancedMarkerElement({
        map: mapRef.current,
        position: {
          lat: building.coordinates[0],
          lng: building.coordinates[1],
        },
        title: building.name,
        content: createBuildingMarker(building.type),
      });

      marker.addListener("click", () => onBuildingSelect(building));
      markersRef.current[building.id] = marker;
    });

    return () => {
      Object.values(markersRef.current).forEach(
        (marker) => (marker.map = null)
      );
      markersRef.current = {};
    };
  }, [isLoaded, buildings, userLocation, mapRef.current]);

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-full bg-red-50 dark:bg-red-900">
        <p className="text-red-600 dark:text-red-200">Error loading maps</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading maps...</p>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%" }}
      center={{ lat: viewState.latitude, lng: viewState.longitude }}
      zoom={viewState.zoom}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={mapOptions}
      onCenterChanged={handleCenterChanged}
      onZoomChanged={() => {
        if (mapRef.current) {
          onViewStateChange({
            ...viewState,
            zoom: mapRef.current.getZoom(),
          });
        }
      }}
    />
  );
};

// Helper function to create custom marker elements
function createBuildingMarker(type) {
  const div = document.createElement("div");
  div.className = "building-marker";
  div.style.width = "24px";
  div.style.height = "24px";
  div.style.borderRadius = "50%";
  div.style.border = "2px solid white";
  div.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";

  switch (type) {
    case "academic":
      div.style.backgroundColor = "#EF4444"; // red-500
      break;
    case "library":
      div.style.backgroundColor = "#10B981"; // green-500
      break;
    default:
      div.style.backgroundColor = "#8B5CF6"; // purple-500
  }

  return div;
}

function createUserLocationMarker() {
  const div = document.createElement("div");
  div.className = "user-location-marker";
  div.style.width = "16px";
  div.style.height = "16px";
  div.style.backgroundColor = "#3B82F6"; // blue-500
  div.style.borderRadius = "50%";
  div.style.border = "2px solid white";
  div.style.boxShadow = "0 0 0 8px rgba(59, 130, 246, 0.2)";
  return div;
}

export default React.memo(GoogleMapComponent);
