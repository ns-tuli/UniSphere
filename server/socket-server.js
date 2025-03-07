import { Server } from "socket.io";

const initializeSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // Adjust this as necessary
      methods: ["GET", "POST"],
    },
  });

  server.app.set("io", io); // Store the io instance in the app for use in controllers

  const rooms = new Map();
  const busSubscribers = new Map();
  let users = [];

  io.on("connection", (socket) => {
    console.log("A user connected");

    // User joins a specific room
    socket.on("join-room", ({ roomId, username }) => {
      console.log(`${username} joined room ${roomId}`);
      socket.join(roomId);
      if (!rooms.has(roomId)) {
        rooms.set(roomId, { content: "", users: new Set() });
      }
      const room = rooms.get(roomId);
      room.users.add(username);
      socket.emit("load-document", room.content);
      io.to(roomId).emit("user-count", room.users.size);
    });

    // Send changes in a document collaboration scenario
    socket.on("send-changes", ({ delta, roomId }) => {
      const room = rooms.get(roomId);
      if (room) {
        room.content = delta;
        socket.broadcast.to(roomId).emit("receive-changes", delta);
      }
    });

    // Drawing function for real-time collaboration
    socket.on("draw", ({ drawLine, roomId }) => {
      socket.broadcast.to(roomId).emit("receive-drawing", drawLine);
    });

    // User subscribes to real-time bus tracking
    socket.on("subscribe-to-bus", (busId) => {
      console.log(`User subscribed to bus ${busId}`);
      socket.join(`bus-${busId}`);
      if (!busSubscribers.has(busId)) {
        busSubscribers.set(busId, new Set());
      }
      busSubscribers.get(busId).add(socket.id);
    });

    // User unsubscribes from bus tracking
    socket.on("unsubscribe-from-bus", (busId) => {
      console.log(`User unsubscribed from bus ${busId}`);
      socket.leave(`bus-${busId}`);
      if (busSubscribers.has(busId)) {
        busSubscribers.get(busId).delete(socket.id);
        if (busSubscribers.get(busId).size === 0) {
          busSubscribers.delete(busId);
        }
      }
    });

    // Adding a new user
    socket.on("addUser", (userData) => {
      addUser(userData, socket.id);
      io.emit("getUsers", users);
    });

    // Sending messages to specific users
    socket.on("sendMessage", (data) => {
      const user = getUser(data.receiverId);
      if (user && user.socketId) {
        io.to(user.socketId).emit('getMessage', data);
      }
    });

    // Handling user disconnection
    socket.on('disconnect', () => {
      console.log("A user disconnected");
      removeUser(socket.id);
      io.emit("getUsers", users);

      // Clean up document rooms
      rooms.forEach((room, roomId) => {
        room.users.delete(socket.id);
        if (room.users.size === 0) {
          rooms.delete(roomId);
        }
      });

      // Clean up bus subscribers
      busSubscribers.forEach((subscribers, busId) => {
        subscribers.delete(socket.id);
        if (subscribers.size === 0) {
          busSubscribers.delete(busId);
        }
      });
    });
  });

  return io;
};

const addUser = (userData, socketId) => {
  if (!users.some(user => user.sub === userData.sub)) {
    users.push({ ...userData, socketId });
  }
};

const removeUser = (socketId) => {
  users = users.filter(user => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find(user => user.sub === userId);
};

export default initializeSocketServer;
