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
    res.status(201).json({
      message: "Bus schedule added successfully",
      busSchedule: newBusSchedule,
    });
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
    res.status(200).json({
      message: "Bus schedule updated successfully",
      busSchedule: updatedBusSchedule,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating bus schedule", error });
  }
};

// Delete a bus schedule by busId
const deleteBusSchedule = async (req, res) => {
  try {
    const deletedBusSchedule = await BusSchedule.findOneAndDelete({
      busId: req.params.busId,
    });
    if (!deletedBusSchedule) {
      return res.status(404).json({ message: "Bus schedule not found" });
    }
    res.status(200).json({ message: "Bus schedule deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting bus schedule", error });
  }
};

// Update bus location
const updateBusLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;

    if (!lat || !lng) {
      return res
        .status(400)
        .json({ message: "Latitude and longitude are required" });
    }

    const updatedBus = await BusSchedule.findOneAndUpdate(
      { busId: req.params.busId },
      {
        "location.lat": lat,
        "location.lng": lng,
        "location.lastUpdated": new Date(),
      },
      { new: true }
    );

    if (!updatedBus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    // Emit the location update via socket.io (will be handled in the socket server)
    if (req.app.get("io")) {
      req.app.get("io").emit("bus-location-update", {
        busId: updatedBus.busId,
        location: updatedBus.location,
      });
    }

    res
      .status(200)
      .json({ message: "Bus location updated successfully", bus: updatedBus });
  } catch (error) {
    res.status(500).json({ message: "Error updating bus location", error });
  }
};

// Add a notification for a bus
const addBusNotification = async (req, res) => {
  try {
    const { type, message } = req.body;

    if (!type || !message) {
      return res
        .status(400)
        .json({ message: "Notification type and message are required" });
    }

    const bus = await BusSchedule.findOne({ busId: req.params.busId });

    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    const notification = {
      type,
      message,
      timestamp: new Date(),
      isActive: true,
    };

    bus.notifications.push(notification);
    await bus.save();

    // Emit the notification via socket.io
    if (req.app.get("io")) {
      req.app.get("io").emit("bus-notification", {
        busId: bus.busId,
        notification,
      });
    }

    res
      .status(201)
      .json({ message: "Notification added successfully", notification });
  } catch (error) {
    res.status(500).json({ message: "Error adding notification", error });
  }
};

// Get all active notifications for a bus
const getBusNotifications = async (req, res) => {
  try {
    const bus = await BusSchedule.findOne({ busId: req.params.busId });

    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    const activeNotifications = bus.notifications.filter(
      (notification) => notification.isActive
    );

    res.status(200).json(activeNotifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications", error });
  }
};

export default {
  getBusSchedules,
  getBusScheduleById,
  addBusSchedule,
  updateBusSchedule,
  deleteBusSchedule,
  updateBusLocation,
  addBusNotification,
  getBusNotifications,
};
