import React, { useEffect, useRef } from "react";
import * as fabric from "fabric";
import { useSocket } from "../context/SocketContext";  // Assuming socket context is set up


const Whiteboard = ({ roomId }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Initialize Fabric.js canvas
    const canvas = new fabric.Canvas(canvasRef.current);
    canvas.isDrawingMode = true;  // Enable drawing mode

    // Send drawing data to server via Socket.IO
    canvas.on("path:created", () => {
      const whiteboardData = JSON.stringify(canvas.toJSON());
      useSocket.emit("whiteboard:draw", { room: roomId, data: whiteboardData });
    });

    // Listen for whiteboard updates from other users
    useSocket.on("whiteboard:update", (data) => {
      canvas.clear();  // Clear the canvas before applying new drawing
      if (data) {
        canvas.loadFromJSON(data, canvas.renderAll.bind(canvas)); // Sync canvas
      }
    });

    // Cleanup: Dispose of the canvas when component unmounts
    return () => {
      canvas.dispose();  // Dispose of the previous canvas to avoid memory leaks and re-initialization errors
      useSocket.off("whiteboard:update");  // Clean up the socket event listener
    };
  }, [roomId]);

  return <canvas ref={canvasRef} className="w-full h-full border" />;
};

export default Whiteboard;
