import express from 'express';
import {
    createMealSchedule,
    deleteMealSchedule,
    getAllMealSchedules,
    getMealScheduleByDayAndType,
    updateMealSchedule
} from '../controllers/mealController.js';

const router = express.Router();

router
  .route('/')
  .get(getAllMealSchedules)
  .post(createMealSchedule);

router
  .route('/:id')
  .put(updateMealSchedule)
  .delete(deleteMealSchedule);

router
  .route('/:day/:mealType')
  .get(getMealScheduleByDayAndType);

export default router;