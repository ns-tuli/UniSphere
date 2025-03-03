import { Server } from "socket.io";

const io = new Server(9001, {
  cors: true,
});

const rooms = {};  // Store room information
const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();

io.on("connection", (socket) => {
  console.log(`Socket Connected`, socket.id);

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
      rooms[room] = { whiteboardData: "" };  // Initialize room if not exists
    }
  
    // Join the room
    socket.join(room);
    emailToSocketIdMap.set(email, socket.id);
    socketidToEmailMap.set(socket.id, email);
  
    io.to(socket.id).emit("room:join:success", { room });
    io.to(room).emit("user:joined", { email, id: socket.id });
  });

  // Sync whiteboard drawing to all other users in the room
  socket.on("whiteboard:draw", ({ room, data }) => {
    socket.to(room).emit("whiteboard:update", data);  // Broadcast drawing data to others in the room
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    const email = socketidToEmailMap.get(socket.id);
    const room = Array.from(socket.rooms)[1];  // The room the user is in
    console.log(`User ${email} disconnected from room ${room}`);
    emailToSocketIdMap.delete(email);
    socketidToEmailMap.delete(socket.id);
  });
});

const PORT = 9001;
io.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
