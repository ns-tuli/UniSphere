import React, { useEffect, useRef, useState } from "react";
import { useSocket } from "../context/SocketContext";
import * as fabric from "fabric";
const Whiteboard = ({ roomId }) => {
  const canvasRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const [activeColor, setActiveColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState("brush");
  const [isDrawing, setIsDrawing] = useState(false);
  const [shapes, setShapes] = useState([]);
  const [currentShape, setCurrentShape] = useState(null);
  const [startPoint, setStartPoint] = useState(null);
  const [canvasHistory, setCanvasHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const socket = useSocket();
  
  const fabricCanvasRef = useRef(null);
  
  const colors = [
    "#000000", "#ffffff", "#ff0000", "#00ff00", "#0000ff", 
    "#ffff00", "#ff00ff", "#00ffff", "#FFA500", "#800080"
  ];
  
  const brushSizes = [2, 5, 10, 15, 20];
  
  useEffect(() => {
    // Wait for the DOM to fully load
    if (!canvasRef.current) return;
    
    // Import Fabric.js dynamically to avoid SSR issues
    import("fabric").then(({ Canvas, PencilBrush, Line, Rect, Circle, IText }) => {
      // Initialize Fabric.js canvas
      const canvas = new Canvas(canvasRef.current);
      fabricCanvasRef.current = canvas;
      
      // Setup canvas
      const container = canvasContainerRef.current;
      if (container) {
        canvas.setDimensions({
          width: container.clientWidth,
          height: container.clientHeight,
        });
      }
      
      // Enable drawing mode by default
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush.width = brushSize;
      canvas.freeDrawingBrush.color = activeColor;
      
      // Handle window resize
      const handleResize = () => {
        canvas.width(container.clientWidth);
        canvas.height(container.clientHeight);
        canvas.renderAll();
        
        // Send updated canvas after resize
        saveCanvasState();
      };
      
      window.addEventListener("resize", handleResize);
      
      // Send drawing data to server via Socket.IO
      canvas.on("path:created", () => {
        saveCanvasState();
      });
      
      canvas.on("object:modified", () => {
        saveCanvasState();
      });
      
      // Listen for whiteboard updates from other users
      socket.on("whiteboard:update", (data) => {
        if (data) {
          canvas.loadFromJSON(data, () => {
            canvas.renderAll();
          });
        }
      });
      
      // Initialize canvas with any existing data
      socket.emit("whiteboard:join", roomId);
      
      // Define saveCanvasState function
      const saveCanvasState = () => {
        const whiteboardData = JSON.stringify(canvas.toJSON());
        // Update history
        const newHistory = canvasHistory.slice(0, historyIndex + 1);
        newHistory.push(whiteboardData);
        setCanvasHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        // Send to server
        socket.emit("whiteboard:draw", { room: roomId, data: whiteboardData });
      };
      
      // Cleanup
      return () => {
        window.removeEventListener("resize", handleResize);
        canvas.dispose();
        socket.off("whiteboard:update");
      };
    });
  }, [roomId]);
  
  // Update brush properties when colors/sizes change
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    if (tool === "brush" || tool === "eraser") {
      fabricCanvasRef.current.isDrawingMode = true;
      fabricCanvasRef.current.freeDrawingBrush.width = brushSize;
      fabricCanvasRef.current.freeDrawingBrush.color = tool === "eraser" ? "#ffffff" : activeColor;
    } else {
      fabricCanvasRef.current.isDrawingMode = false;
    }
    
    fabricCanvasRef.current.renderAll();
  }, [activeColor, brushSize, tool]);
  
  // Handle shape creation
  useEffect(() => {
    if (!fabricCanvasRef.current || tool === "brush" || tool === "eraser" || tool === "text") return;
    
    const canvas = fabricCanvasRef.current;
    
    const handleMouseDown = (e) => {
      if (tool !== "brush" && tool !== "eraser") {
        setIsDrawing(true);
        const pointer = canvas.getPointer(e.e);
        setStartPoint({ x: pointer.x, y: pointer.y });
        
        let shapeObj;
        if (tool === "rect") {
          shapeObj = new fabric.Rect({
            left: pointer.x,
            top: pointer.y,
            width: 0,
            height: 0,
            fill: "transparent",
            stroke: activeColor,
            strokeWidth: brushSize / 2,
          });
        } else if (tool === "circle") {
          shapeObj = new fabric.Circle({
            left: pointer.x,
            top: pointer.y,
            radius: 0,
            fill: "transparent",
            stroke: activeColor,
            strokeWidth: brushSize / 2,
          });
        } else if (tool === "line") {
          shapeObj = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
            stroke: activeColor,
            strokeWidth: brushSize,
          });
        }
        
        if (shapeObj) {
          canvas.add(shapeObj);
          setCurrentShape(shapeObj);
        }
      }
    };
    
    const handleMouseMove = (e) => {
      if (!isDrawing || !currentShape || !startPoint) return;
      
      const pointer = canvas.getPointer(e.e);
      
      if (tool === "rect") {
        const width = pointer.x - startPoint.x;
        const height = pointer.y - startPoint.y;
        
        currentShape.set({
          width: Math.abs(width),
          height: Math.abs(height),
          left: width > 0 ? startPoint.x : pointer.x,
          top: height > 0 ? startPoint.y : pointer.y,
        });
      } else if (tool === "circle") {
        const radius = Math.sqrt(
          Math.pow(pointer.x - startPoint.x, 2) + Math.pow(pointer.y - startPoint.y, 2)
        ) / 2;
        
        const midX = (pointer.x + startPoint.x) / 2;
        const midY = (pointer.y + startPoint.y) / 2;
        
        currentShape.set({
          radius: radius,
          left: midX - radius,
          top: midY - radius,
        });
      } else if (tool === "line") {
        currentShape.set({
          x2: pointer.x,
          y2: pointer.y,
        });
      }
      
      canvas.renderAll();
    };
    
    const handleMouseUp = () => {
      setIsDrawing(false);
      if (currentShape) {
        fabricCanvasRef.current.setActiveObject(currentShape);
        setCurrentShape(null);
        setStartPoint(null);
        
        // Save state after creating shape
        const whiteboardData = JSON.stringify(canvas.toJSON());
        socket.emit("whiteboard:draw", { room: roomId, data: whiteboardData });
        
        // Update history
        const newHistory = canvasHistory.slice(0, historyIndex + 1);
        newHistory.push(whiteboardData);
        setCanvasHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
      }
    };
    
    canvas.on("mouse:down", handleMouseDown);
    canvas.on("mouse:move", handleMouseMove);
    canvas.on("mouse:up", handleMouseUp);
    
    return () => {
      canvas.off("mouse:down", handleMouseDown);
      canvas.off("mouse:move", handleMouseMove);
      canvas.off("mouse:up", handleMouseUp);
    };
  }, [tool, isDrawing, currentShape, startPoint, activeColor, brushSize, roomId]);
  
  // Text tool handler
  useEffect(() => {
    if (!fabricCanvasRef.current || tool !== "text") return;
    
    const canvas = fabricCanvasRef.current;
    
    const handleTextAdd = (e) => {
      if (tool === "text") {
        const pointer = canvas.getPointer(e.e);
        const text = new fabric.IText("Type here", {
          left: pointer.x,
          top: pointer.y,
          fontFamily: "Arial",
          fontSize: brushSize * 2,
          fill: activeColor,
          editingBorderColor: '#00aeff',
        });
        
        canvas.add(text);
        canvas.setActiveObject(text);
        text.enterEditing();
        
        // Save state after text is added and edited
        text.on('editing:exited', () => {
          const whiteboardData = JSON.stringify(canvas.toJSON());
          socket.emit("whiteboard:draw", { room: roomId, data: whiteboardData });
          
          // Update history
          const newHistory = canvasHistory.slice(0, historyIndex + 1);
          newHistory.push(whiteboardData);
          setCanvasHistory(newHistory);
          setHistoryIndex(newHistory.length - 1);
        });
      }
    };
    
    canvas.on("mouse:down", handleTextAdd);
    
    return () => {
      canvas.off("mouse:down", handleTextAdd);
    };
  }, [tool, activeColor, brushSize, roomId]);
  
  // Undo/Redo handlers
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.loadFromJSON(canvasHistory[newIndex], () => {
          fabricCanvasRef.current.renderAll();
          
          // Send updated canvas to others
          socket.emit("whiteboard:draw", { room: roomId, data: canvasHistory[newIndex] });
        });
      }
    }
  };
  
  const handleRedo = () => {
    if (historyIndex < canvasHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.loadFromJSON(canvasHistory[newIndex], () => {
          fabricCanvasRef.current.renderAll();
          
          // Send updated canvas to others
          socket.emit("whiteboard:draw", { room: roomId, data: canvasHistory[newIndex] });
        });
      }
    }
  };
  
  const handleClear = () => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.clear();
      
      // Save empty canvas state
      const emptyCanvasData = JSON.stringify(fabricCanvasRef.current.toJSON());
      
      // Update history
      const newHistory = [...canvasHistory, emptyCanvasData];
      setCanvasHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      
      // Send to server
      socket.emit("whiteboard:draw", { room: roomId, data: emptyCanvasData });
    }
  };
  
  const handleDownload = () => {
    if (fabricCanvasRef.current) {
      const dataURL = fabricCanvasRef.current.toDataURL({
        format: 'png',
        quality: 1
      });
      
      const link = document.createElement('a');
      link.download = `whiteboard-${roomId}-${new Date().toISOString()}.png`;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  const selectTool = (selectedTool) => {
    setTool(selectedTool);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-gray-100 p-2 border-b flex flex-wrap items-center gap-2">
        {/* Tool selection */}
        <div className="flex items-center gap-1 mr-4">
          <button
            className={`p-2 rounded ${tool === 'brush' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => selectTool('brush')}
            title="Brush"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          
          <button
            className={`p-2 rounded ${tool === 'eraser' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => selectTool('eraser')}
            title="Eraser"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <button
            className={`p-2 rounded ${tool === 'rect' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => selectTool('rect')}
            title="Rectangle"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
            </svg>
          </button>
          
          <button
            className={`p-2 rounded ${tool === 'circle' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => selectTool('circle')}
            title="Circle"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="9" strokeWidth="2" />
            </svg>
          </button>
          
          <button
            className={`p-2 rounded ${tool === 'line' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => selectTool('line')}
            title="Line"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <line x1="5" y1="19" x2="19" y2="5" strokeWidth="2" />
            </svg>
          </button>
          
          <button
            className={`p-2 rounded ${tool === 'text' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => selectTool('text')}
            title="Text"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9h18v2H3V9zm2-5h14v2H5V4zm2 10h10v2H7v-2zm2 5h6v2H9v-2z" />
            </svg>
          </button>
        </div>
        
        {/* Color selection */}
        <div className="flex items-center mr-4 gap-1">
          {colors.map((color) => (
            <button
              key={color}
              className={`w-6 h-6 rounded-full border ${activeColor === color ? 'border-blue-500 border-2' : 'border-gray-400'}`}
              style={{ backgroundColor: color }}
              onClick={() => setActiveColor(color)}
              title={color}
            />
          ))}
        </div>
        
        {/* Brush size selection */}
        <div className="flex items-center mr-4">
          <span className="mr-2 text-sm">Size:</span>
          <select 
            className="p-1 border rounded"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
          >
            {brushSizes.map((size) => (
              <option key={size} value={size}>
                {size}px
              </option>
            ))}
          </select>
        </div>
        
        {/* Undo/Redo buttons */}
        <div className="flex items-center gap-1">
          <button
            className="p-2 rounded bg-gray-200 disabled:opacity-50"
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            title="Undo"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          
          <button
            className="p-2 rounded bg-gray-200 disabled:opacity-50"
            onClick={handleRedo}
            disabled={historyIndex >= canvasHistory.length - 1}
            title="Redo"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
        
        {/* Additional buttons */}
        <div className="flex items-center gap-1 ml-auto">
          <button
            className="p-2 rounded bg-red-500 text-white"
            onClick={handleClear}
            title="Clear whiteboard"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          
          <button
            className="p-2 rounded bg-green-500 text-white"
            onClick={handleDownload}
            title="Download whiteboard"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Canvas container */}
      <div 
        ref={canvasContainerRef} 
        className="flex-grow relative bg-white"
        style={{ width: '100%', height: '400px' }}
      >
        <canvas ref={canvasRef} />
        
        {/* Room info overlay */}
        <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-sm">
          Room: {roomId}
        </div>
        
        {/* Status indicator */}
        <div className="absolute bottom-2 left-2 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" title="Connected"></div>
          <span className="text-xs text-gray-600">Connected</span>
        </div>
      </div>
    </div>
  );
};

export default Whiteboard;