import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const makeAdmin = async (email) => {
  try {
    await mongoose.connect(process.env.MONGO);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return;
    }

    user.role = "admin";
    await user.save();

    console.log(`Successfully made ${email} an admin`);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
  }
};

// Usage: node makeAdmin.js user@example.com
const email = process.argv[2];
if (email) {
  makeAdmin(email);
} else {
  console.log("Please provide an email address");
}
