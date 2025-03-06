import express from 'express';
import {
    cancelOrder,
    createOrder,
    getAllOrders,
    getOrdersByStudent,
    updateOrderStatus
} from "../controllers/orderController.js";

const router = express.Router();

router
  .route('/')
  .get(getAllOrders)
  .post(createOrder);

router
  .route('/:id/status')
  .put(updateOrderStatus);

router
  .route('/:id/cancel')
  .put(cancelOrder);

router
  .route('/student/:id')
  .get(getOrdersByStudent);

export default router;