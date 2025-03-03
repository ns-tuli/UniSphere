import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Lobby = () => {
  const [room, setRoom] = useState("");
  const [email, setEmail] = useState("");  // Added state for email
  const navigate = useNavigate();

  const joinRoom = (e) => {
    e.preventDefault();
    if (room.trim() === "" || email.trim() === "") return; // Ensure both fields are filled
    navigate(`/classroom/${room}`, { state: { email, room } }); // Pass email and room via state
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="p-8 bg-gray-800 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Join a Classroom</h2>
        <form onSubmit={joinRoom}>
          <input
            type="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 rounded w-full text-black"
            required
          />
          <input
            type="text"
            placeholder="Enter Room ID"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="p-2 rounded w-full text-black mt-4"
            required
          />
          <button className="mt-4 bg-yellow-500 p-2 rounded w-full">Join</button>
        </form>
      </div>
    </div>
  );
};

export default Lobby;
