const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const Bus = require('./models/Bus');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/bus-tracking', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// API endpoints
app.get('/api/buses', async (req, res) => {
  try {
    const buses = await Bus.find();
    res.json(buses);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Simulate bus movement (for testing)
const updateBusLocations = async () => {
  try {
    const buses = await Bus.find();
    buses.forEach(async (bus) => {
      // Simulate movement by slightly changing coordinates
      const newLng = bus.location.coordinates[0] + (Math.random() - 0.5) * 0.001;
      const newLat = bus.location.coordinates[1] + (Math.random() - 0.5) * 0.001;

      await Bus.findByIdAndUpdate(bus._id, {
        'location.coordinates': [newLng, newLat],
        lastUpdated: new Date()
      });

      io.emit('busUpdate', {
        busId: bus.busId,
        location: { coordinates: [newLng, newLat] },
        status: bus.status
      });
    });
  } catch (error) {
    console.error('Error updating bus locations:', error);
  }
};

setInterval(updateBusLocations, 5000); // Update every 5 seconds

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
