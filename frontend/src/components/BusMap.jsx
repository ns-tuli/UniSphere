import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { toast } from 'react-toastify';
import io from 'socket.io-client';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'react-toastify/dist/ReactToastify.css';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const BusMap = () => {
  const [buses, setBuses] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initial fetch of bus data
    fetch('http://localhost:5000/api/buses')
      .then(res => res.json())
      .then(data => setBuses(data))
      .catch(err => console.error('Error fetching buses:', err));

    // Socket.io connection
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('busUpdate', (updatedBus) => {
      setBuses(prevBuses => {
        const newBuses = [...prevBuses];
        const index = newBuses.findIndex(bus => bus.busId === updatedBus.busId);
        
        if (index !== -1) {
          newBuses[index] = { ...newBuses[index], ...updatedBus };
          
          if (updatedBus.status === 'DELAYED') {
            toast.warning(`Bus ${updatedBus.busId} is delayed!`);
          }
        }
        
        return newBuses;
      });
    });

    return () => {
      socket.off('busUpdate');
    };
  }, [socket]);

  return (
    <div className="map-container" style={{ height: '500px', width: '100%' }}>
      <MapContainer
        center={[51.505, -0.09]} // Set your default center coordinates
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {buses.map(bus => (
          <Marker
            key={bus.busId}
            position={[bus.location.coordinates[1], bus.location.coordinates[0]]}
          >
            <Popup>
              Bus ID: {bus.busId}<br />
              Route: {bus.routeName}<br />
              Status: {bus.status}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default BusMap;
