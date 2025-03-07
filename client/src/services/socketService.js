import { io } from "socket.io-client";

// Create a singleton socket instance
let socket;

export const initializeSocket = () => {
  if (!socket) {
    const SOCKET_URL =
      import.meta.env.VITE_SERVER_URL || "http://localhost:5000";
    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      autoConnect: true,
    });

    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });
  }

  return socket;
};

// Subscribe to bus updates
export const subscribeToBus = (busId) => {
  if (!socket) {
    initializeSocket();
  }
  socket.emit("subscribe-to-bus", busId);
};

// Unsubscribe from bus updates
export const unsubscribeFromBus = (busId) => {
  if (socket) {
    socket.emit("unsubscribe-from-bus", busId);
  }
};

// Listen for bus location updates
export const onBusLocationUpdate = (callback) => {
  if (!socket) {
    initializeSocket();
  }
  socket.on("bus-location-update", callback);

  // Return a cleanup function
  return () => {
    socket.off("bus-location-update", callback);
  };
};

// Listen for bus notifications
export const onBusNotification = (callback) => {
  if (!socket) {
    initializeSocket();
  }
  socket.on("bus-notification", callback);

  // Return a cleanup function
  return () => {
    socket.off("bus-notification", callback);
  };
};

// Emit bus location update for real-time tracking
export const emitBusLocationUpdate = (busId, locationData) => {
  if (!socket) {
    initializeSocket();
  }
  socket.emit("bus-location-update", { busId, location: locationData });
};

// Emit bus notification for real-time alerts
export const emitBusNotification = (busId, notificationData) => {
  if (!socket) {
    initializeSocket();
  }
  socket.emit("bus-notification", { busId, notification: notificationData });
};

// Disconnect socket
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export default {
  initializeSocket,
  subscribeToBus,
  unsubscribeFromBus,
  onBusLocationUpdate,
  onBusNotification,
  emitBusLocationUpdate,
  emitBusNotification,
  disconnectSocket,
};
