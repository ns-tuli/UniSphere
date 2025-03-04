import React, { useEffect, useRef, useState } from 'react';

const Whiteboard = ({ socket, roomId }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(2);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Set initial canvas properties
    context.lineCap = 'round';
    context.strokeStyle = color;
    context.lineWidth = brushSize;

    // Handle receiving drawing data
    socket.on('receive-drawing', drawLine => {
      const { startX, startY, endX, endY, color, brushSize } = drawLine;
      context.beginPath();
      context.strokeStyle = color;
      context.lineWidth = brushSize;
      context.moveTo(startX, startY);
      context.lineTo(endX, endY);
      context.stroke();
    });

    return () => {
      socket.off('receive-drawing');
    };
  }, [socket, color, brushSize]);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(true);
    const context = canvas.getContext('2d');
    context.beginPath();
    context.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const context = canvas.getContext('2d');
    context.lineTo(x, y);
    context.stroke();

    // Emit drawing data
    socket.emit('draw', {
      roomId,
      drawLine: {
        startX: context.moveTo.x,
        startY: context.moveTo.y,
        endX: x,
        endY: y,
        color,
        brushSize
      }
    });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-4 p-4 bg-gray-100">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-10 h-10"
        />
        <input
          type="range"
          min="1"
          max="20"
          value={brushSize}
          onChange={(e) => setBrushSize(e.target.value)}
          className="w-32"
        />
      </div>
      <canvas
        ref={canvasRef}
        className="flex-1 border border-gray-300 bg-white"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
      />
    </div>
  );
};

export default Whiteboard;
