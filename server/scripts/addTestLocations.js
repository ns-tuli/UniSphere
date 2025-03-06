import axios from "axios";

const testLocations = [
  {
    name: "Main Building",
    type: "building",
    coordinates: {
      latitude: 23.8103, // Replace with your university's coordinates
      longitude: 90.4125,
    },
    description: "Main administrative building",
    icon: "box",
  },
  {
    name: "Science Lab",
    type: "classroom",
    coordinates: {
      latitude: 23.8105, // Slightly offset coordinates
      longitude: 90.4127,
    },
    description: "Physics and Chemistry laboratories",
    icon: "cylinder",
  },
  {
    name: "Library",
    type: "building",
    coordinates: {
      latitude: 23.8101, // Slightly offset coordinates
      longitude: 90.4122,
    },
    description: "Central library with study areas",
    icon: "sphere",
  },
  {
    name: "my location",
    type: "other",
    coordinates: {
      latitude: 23.8102, // Slightly offset coordinates
      longitude: 90.4123,
    },
    description: "Campus dining hall",
    icon: "cone",
  },
];

const addLocations = async () => {
  try {
    for (const location of testLocations) {
      const response = await axios.post(
        "http://localhost:5000/api/ar/locations",
        location
      );
      console.log(`Added location: ${location.name}`);
    }
    console.log("All test locations added successfully");
  } catch (error) {
    console.error("Error adding locations:", error.message);
  }
};

addLocations();
