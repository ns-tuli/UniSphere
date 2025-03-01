// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const connectDB = require("./config/db");
// const mealRoutes = require("./routes/mealRoutes");

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import mealRoutes from "./routes/mealRoutes.js";
import busRoutes from "./routes/busRoutes.js"
import classRoutes from "./routes/classRoutes.js"
import departmentRoutes from "./routes/departmentRoutes.js"
dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/meals", mealRoutes);
app.use("/api/bus", busRoutes);
app.use("/api/class", classRoutes);
app.use("/api/department", departmentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});