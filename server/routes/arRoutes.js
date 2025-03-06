import express from 'express';
import Location from '../models/Location.js';

const router = express.Router();

// Get all locations
router.get('/locations', async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new location
router.post('/locations', async (req, res) => {
  const location = new Location({
    name: req.body.name,
    type: req.body.type,
    coordinates: req.body.coordinates,
    description: req.body.description,
    icon: req.body.icon
  });

  try {
    const newLocation = await location.save();
    res.status(201).json(newLocation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
