import express from 'express';
import {
    createMenuItem,
    deleteMenuItem,
    getAllMenuItems,
    getMenuItem,
    updateMenuItem
} from '../controllers/menuController.js';

const router = express.Router();

router
  .route('/')
  .get(getAllMenuItems)
  .post(createMenuItem);

router
  .route('/:id')
  .get(getMenuItem)
  .put(updateMenuItem)
  .delete(deleteMenuItem);

export default router;