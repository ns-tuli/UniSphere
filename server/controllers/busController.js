import BusSchedule from "../models/Bus.js"; // Adjust path as necessary

// Get all bus schedules
const getBusSchedules = async (req, res) => {
  try {
    const busSchedules = await BusSchedule.find();
    res.status(200).json(busSchedules);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bus schedules", error });
  }
};

// Get a single bus schedule by busId
const getBusScheduleById = async (req, res) => {
  try {
    const busSchedule = await BusSchedule.findOne({ busId: req.params.busId });
    if (!busSchedule) {
      return res.status(404).json({ message: "Bus schedule not found" });
    }
    res.status(200).json(busSchedule);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bus schedule", error });
  }
};

// Add a new bus schedule
const addBusSchedule = async (req, res) => {
  try {
    const newBusSchedule = new BusSchedule(req.body); // Create a new schedule using the provided data
    await newBusSchedule.save(); // Save to the database
    res.status(201).json({ message: "Bus schedule added successfully", busSchedule: newBusSchedule });
  } catch (error) {
    res.status(500).json({ message: "Error adding bus schedule", error });
  }
};

// Update an existing bus schedule by busId
const updateBusSchedule = async (req, res) => {
  try {
    const updatedBusSchedule = await BusSchedule.findOneAndUpdate(
      { busId: req.params.busId },
      req.body,
      { new: true }
    );
    if (!updatedBusSchedule) {
      return res.status(404).json({ message: "Bus schedule not found" });
    }
    res.status(200).json({ message: "Bus schedule updated successfully", busSchedule: updatedBusSchedule });
  } catch (error) {
    res.status(500).json({ message: "Error updating bus schedule", error });
  }
};

// Delete a bus schedule by busId
const deleteBusSchedule = async (req, res) => {
  try {
    const deletedBusSchedule = await BusSchedule.findOneAndDelete({ busId: req.params.busId });
    if (!deletedBusSchedule) {
      return res.status(404).json({ message: "Bus schedule not found" });
    }
    res.status(200).json({ message: "Bus schedule deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting bus schedule", error });
  }
};

export default {
  getBusSchedules,
  getBusScheduleById,
  addBusSchedule,
  updateBusSchedule,
  deleteBusSchedule,
};
