import { Server } from "socket.io";

const io = new Server(8000, {
  cors: true,
});

const rooms = {};  // Store room information with whiteboard data
const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();

io.on("connection", (socket) => {
  console.log("Socket Connected", socket.id);

  // User joins a room
  socket.on("room:join", (data) => {
    const { email, room } = data;
    console.log("User email:", email);
    console.log("Joining room:", room);

    if (!room || !email) {
      console.error("Room ID or email is missing!");
      return;
    }

    if (!rooms[room]) {
      rooms[room] = { whiteboardData: "" };  // Initialize room if it doesn't exist
    }

    // Join the room
    socket.join(room);
    emailToSocketIdMap.set(email, socket.id);
    socketidToEmailMap.set(socket.id, email);

    io.to(socket.id).emit("room:join:success", { room });

    // Send the current whiteboard data when a user joins
    if (rooms[room].whiteboardData) {
      socket.emit("whiteboard:update", rooms[room].whiteboardData);  // Send the last whiteboard data
    }

    io.to(room).emit("user:joined", { email, id: socket.id });
  });

  // Sync whiteboard drawing to all other users in the room
  socket.on("whiteboard:draw", ({ room, data }) => {
    // Ensure the room exists and has a whiteboardData object
    if (!rooms[room]) {
      rooms[room] = { whiteboardData: "" };  // Initialize room if missing
    }

    // Update the whiteboard data for the room
    rooms[room].whiteboardData = data;
    socket.to(room).emit("whiteboard:update", data);  // Broadcast drawing data to others in the room
  });

  // Video Call Signaling: Handle User Call (Sending Offer)
  socket.on("user:call", ({ to, offer }) => {
    console.log(`Sending offer to ${to}`);
    socket.to(to).emit("incoming:call", { from: socket.id, offer });
  });

  // Video Call Signaling: Handle Call Acceptance (Sending Answer)
  socket.on("call:accepted", ({ to, ans }) => {
    console.log(`Sending answer to ${to}`);
    socket.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  // ICE Candidate Exchange
  socket.on("send:ice-candidate", ({ to, candidate }) => {
    console.log(`Sending ICE candidate to ${to}`);
    socket.to(to).emit("receive:ice-candidate", { from: socket.id, candidate });
  });

  // Handle User Disconnect
  socket.on("disconnect", () => {
    const email = socketidToEmailMap.get(socket.id);
    const room = Array.from(socket.rooms)[1];  // The room the user is in
    console.log(`User ${email} disconnected from room ${room}`);
    emailToSocketIdMap.delete(email);
    socketidToEmailMap.delete(socket.id);

    // Notify others in the room about user disconnection
    io.to(room).emit("user:left", { email, id: socket.id });
  });
});
