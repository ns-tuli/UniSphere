import React, { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";  // Use useLocation to access passed state
import Whiteboard from "../components/Whiteboard";
import { useSocket } from "../context/SocketContext";  // Assuming socket context is set up

const Classroom = () => {
  const { roomId } = useParams();  // Get room ID from the URL
  const { state } = useLocation();  // Get email and room data passed from the Lobby
  const socket = useSocket();
  
  const email = state?.email || '';  // Access email passed through state

  useEffect(() => {
    if (!email || !roomId) {
      console.error("Room or email is missing");
      return;
    }

    // Join the room and pass both room ID and email
    socket.emit("room:join", { email, room: roomId });

    return () => {
      // Leave the room when the component unmounts
      socket.emit("room:leave", { room: roomId });
    };
  }, [roomId, email, socket]);

  return (
    <div className="classroom-container">
      <h1 className="text-3xl">Classroom - {roomId}</h1>
      <Whiteboard roomId={roomId} />
    </div>
  );
};

export default Classroom;
