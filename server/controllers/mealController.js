import MealSchedule from '../models/MealSchedule.js';

// Get all meal schedules
export const getAllMealSchedules = async (req, res) => {
  try {
    const mealSchedules = await MealSchedule.find().populate('menuItems');
    res.status(200).json({
      success: true,
      count: mealSchedules.length,
      data: mealSchedules
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get meal schedule by day and type
export const getMealScheduleByDayAndType = async (req, res) => {
  try {
    const { day, mealType } = req.params;
    
    const mealSchedule = await MealSchedule.findOne({ day, mealType }).populate('menuItems');
    
    if (!mealSchedule) {
      return res.status(404).json({
        success: false,
        error: 'Meal schedule not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: mealSchedule
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Create meal schedule
export const createMealSchedule = async (req, res) => {
  try {
    const mealSchedule = await MealSchedule.create(req.body);
    
    res.status(201).json({
      success: true,
      data: mealSchedule
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Meal schedule for this day and type already exists'
      });
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

// Update meal schedule
export const updateMealSchedule = async (req, res) => {
  try {
    const mealSchedule = await MealSchedule.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!mealSchedule) {
      return res.status(404).json({
        success: false,
        error: 'Meal schedule not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: mealSchedule
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Delete meal schedule
export const deleteMealSchedule = async (req, res) => {
  try {
    const mealSchedule = await MealSchedule.findByIdAndDelete(req.params.id);
    
    if (!mealSchedule) {
      return res.status(404).json({
        success: false,
        error: 'Meal schedule not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

