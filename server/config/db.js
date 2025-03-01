<<<<<<< HEAD
import dotenv from 'dotenv'
import mongoose from "mongoose"

dotenv.config()

const connectDB = async () => {
    try {
        if (!process.env.MONGO) {
            throw new Error('MONGO environment variable is not defined')
        }

        const conn = await mongoose.connect(process.env.MONGO, {
           
        })

        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.error(`Error: ${error.message}`)
        process.exit(1)
    }
}

export default connectDB
=======
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO, {
      
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
>>>>>>> 7b81708313d525954466a4b5e908e7eb0fb5c533
