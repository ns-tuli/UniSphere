import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { ChromePicker } from 'react-color';
import { saveAs } from 'file-saver';
import { FaPencilAlt, FaEraser, FaSquare, FaCircle, FaFont, FaSave, FaTrash } from 'react-icons/fa';

const Whiteboard = ({ socket, roomId }) => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [color, setColor] = useState('#000000');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [tool, setTool] = useState('pencil');
  const [brushSize, setBrushSize] = useState(5);

  useEffect(() => {
    let canvas;
    
    // Wait for the DOM to be ready
    setTimeout(() => {
      canvas = new fabric.Canvas(canvasRef.current, {
        isDrawingMode: true,
        width: window.innerWidth * 0.8,
        height: window.innerHeight * 0.7,
        backgroundColor: 'white',
      });

      setCanvas(canvas);

      // Handle receiving drawing data
      socket?.on('receive-drawing', (data) => {
        canvas.loadFromJSON(data, canvas.renderAll.bind(canvas));
      });

      // Emit changes to other users
      canvas.on('path:created', () => {
        const data = canvas.toJSON();
        socket?.emit('draw', { drawLine: data, roomId });
      });

      // Handle window resize
      const handleResize = () => {
        canvas.setWidth(window.innerWidth * 0.8);
        canvas.setHeight(window.innerHeight * 0.7);
        canvas.renderAll();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, 100);

    return () => {
      if (canvas) {
        canvas.dispose();
      }
      socket?.off('receive-drawing');
    };
  }, [socket, roomId]);

  useEffect(() => {
    if (!canvas) return;
    canvas.freeDrawingBrush.color = color;
    canvas.freeDrawingBrush.width = brushSize;
  }, [color, brushSize, canvas]);

  const handleToolChange = (selectedTool) => {
    if (!canvas) return;
    setTool(selectedTool);

    switch (selectedTool) {
      case 'pencil':
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        canvas.freeDrawingBrush.color = color;
        canvas.freeDrawingBrush.width = brushSize;
        break;
      case 'eraser': {
        canvas.isDrawingMode = true;
        const brush = new fabric.PencilBrush(canvas);
        brush.color = '#ffffff';
        brush.width = brushSize * 2;
        canvas.freeDrawingBrush = brush;
        break;
      }
      case 'rectangle':
        canvas.isDrawingMode = false;
        break;
      case 'circle':
        canvas.isDrawingMode = false;
        break;
      default:
        break;
    }
  };

  const addShape = (shape) => {
    if (!canvas) return;
    let fabricShape;

    if (shape === 'rectangle') {
      fabricShape = new fabric.Rect({
        left: 100,
        top: 100,
        fill: color,
        width: 100,
        height: 100,
      });
    } else if (shape === 'circle') {
      fabricShape = new fabric.Circle({
        left: 100,
        top: 100,
        fill: color,
        radius: 50,
      });
    }

    if (fabricShape) {
      canvas.add(fabricShape);
      canvas.renderAll();
      socket?.emit('draw', { drawLine: canvas.toJSON(), roomId });
    }
  };

  const addText = () => {
    if (!canvas) return;
    const text = new fabric.IText('Type here', {
      left: 100,
      top: 100,
      fill: color,
      fontSize: brushSize * 4,
    });
    canvas.add(text);
    canvas.renderAll();
    socket?.emit('draw', { drawLine: canvas.toJSON(), roomId });
  };

  const clearCanvas = () => {
    if (!canvas) return;
    canvas.clear();
    canvas.setBackgroundColor('white', canvas.renderAll.bind(canvas));
    socket?.emit('draw', { drawLine: canvas.toJSON(), roomId });
  };

  const saveCanvas = () => {
    if (!canvas) return;
    const dataUrl = canvas.toDataURL({ format: 'png' });
    saveAs(dataUrl, 'whiteboard.png');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 bg-gray-100">
        <div className="flex space-x-4">
          <button
            onClick={() => handleToolChange('pencil')}
            className={`p-2 ${tool === 'pencil' ? 'bg-yellow-500' : 'bg-white'} rounded`}
          >
            <FaPencilAlt />
          </button>
          <button
            onClick={() => handleToolChange('eraser')}
            className={`p-2 ${tool === 'eraser' ? 'bg-yellow-500' : 'bg-white'} rounded`}
          >
            <FaEraser />
          </button>
          <button
            onClick={() => addShape('rectangle')}
            className="p-2 bg-white rounded"
          >
            <FaSquare />
          </button>
          <button
            onClick={() => addShape('circle')}
            className="p-2 bg-white rounded"
          >
            <FaCircle />
          </button>
          <button
            onClick={addText}
            className="p-2 bg-white rounded"
          >
            <FaFont />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-8 h-8 rounded"
              style={{ backgroundColor: color }}
            />
            {showColorPicker && (
              <div className="absolute z-10 mt-2">
                <ChromePicker
                  color={color}
                  onChange={(c) => setColor(c.hex)}
                />
              </div>
            )}
          </div>
          <input
            type="range"
            min="1"
            max="30"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="w-32"
          />
        </div>
        <div className="flex space-x-4">
          <button
            onClick={saveCanvas}
            className="p-2 bg-green-500 text-white rounded"
          >
            <FaSave />
          </button>
          <button
            onClick={clearCanvas}
            className="p-2 bg-red-500 text-white rounded"
          >
            <FaTrash />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default Whiteboard;
