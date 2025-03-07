// const mongoose = require("mongoose");
import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";

const mealSchema = new mongoose.Schema({
  mealId: { type: Number, unique: true },
  image:{type:String},
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String},
  categories: { type: [String]},
  available: { type: Boolean},
  prepTime: { type: String},
});

mealSchema.plugin(mongooseSequence(mongoose), {
  inc_field: 'mealId',  // Specify the field that will be auto-incremented
  start_seq: 1,         // Start incrementing from 1
});

// module.exports = mongoose.model("Meal", mealSchema);
export default mongoose.model("Meal", mealSchema);