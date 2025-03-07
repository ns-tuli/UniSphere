// controllers/orderController.js
import Order from '../models/Order.js';

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('items.menuItem');
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get orders by student ID - Fix the parameter extraction and population
export const getOrdersByStudent = async (req, res) => {
  try {
    console.log('🔍 Getting orders for student ID:', req.params.id);
    
    const orders = await Order.find({ userId: req.params.id })
      .populate('items.menuItem')
      .sort({ createdAt: -1 }); // Sort by newest first
    
    console.log(`✅ Found ${orders.length} orders`);
    
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Create order - Fix the item handling and validation
export const createOrder = async (req, res) => {
  try {
    console.log('📩 Received order request');
    console.log('📦 Request body:', JSON.stringify(req.body, null, 2));
    
    const { items, day, userId, studentName, mealType, pickupTime, totalPrice } = req.body;
    
    // Validate required fields
    if (!items || !Array.isArray(items) || !userId || !studentName || !mealType || !pickupTime) {
      console.error('❌ Missing required fields');
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Create array of order items with proper structure
    const orderItems = items.map(item => ({
      menuItem: item.menuItem,
      quantity: item.quantity
    }));

    // Create new order
    const order = await Order.create({
      userId,
      studentName,
      mealType,
      day,
      pickupTime,
      items: orderItems,
      totalPrice,
      status: 'pending'
    });

    // Populate the order with menu item details
    const populatedOrder = await Order.findById(order._id)
      .populate('items.menuItem');

    console.log('✅ Order created successfully:', order._id);
    
    res.status(201).json({
      success: true,
      data: populatedOrder
    });
  } catch (error) {
    console.error('❌ Order creation error:', {
      message: error.message,
      stack: error.stack
    });
    
    res.status(500).json({
      success: false,
      error: 'Server Error',
      details: error.message
    });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Please provide order status'
      });
    }
    
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, {
      new: true,
      runValidators: true
    }).populate('items.menuItem');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    // Only allow cancellation if status is pending or confirmed
    if (order.status !== 'pending' && order.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        error: 'Cannot cancel order with status: ' + order.status
      });
    }
    
    // Update the status to cancelled
    order.status = 'cancelled';
    await order.save();
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};