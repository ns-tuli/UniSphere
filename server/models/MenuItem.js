// models/MenuItem.js
import mongoose from 'mongoose';

const MenuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  nutritionInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  },
  category: {
    type: String,
    enum: ['main', 'side', 'dessert', 'drink'],
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  image: {
    type: String
  }
}, { timestamps: true });

export default mongoose.model('MenuItem', MenuItemSchema);

