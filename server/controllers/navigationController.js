import Building from "../models/buildingModel.js";

export const getCampusBuildings = async (req, res) => {
  try {
    const buildings = await Building.find();
    res.json(buildings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBuildingDetails = async (req, res) => {
  try {
    const building = await Building.findById(req.params.id);
    if (!building) {
      return res.status(404).json({ message: "Building not found" });
    }
    res.json(building);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNavigationRoute = async (req, res) => {
  try {
    const { from, to } = req.params;
    // Add routing logic here
    res.json({ message: "Route calculation not implemented yet" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
