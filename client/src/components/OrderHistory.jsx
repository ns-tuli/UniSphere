import { format } from 'date-fns';
import { motion } from 'framer-motion';
import React from 'react';

const OrderHistory = ({ orders }) => {
  console.log('🔵 Rendering OrderHistory with orders:', orders);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6"
    >
      <h3 className="text-2xl font-bold text-yellow-600 dark:text-yellow-300 mb-4">
        Order History
      </h3>
      <div className="space-y-4">
        {!orders || orders.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No orders found</p>
        ) : (
          orders.map(order => {
            console.log('🔵 Rendering order:', order);
            return (
              <motion.div
                key={order._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-b border-gray-200 dark:border-gray-700 pb-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      {order.mealType} - {order.day}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(order.createdAt), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                  <span className="px-2 py-1 text-sm rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
                    ${order.totalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="space-y-2">
                  {order.items &&
                    order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between text-sm text-gray-600 dark:text-gray-400"
                      >
                        <span>
                          {item.menuItem.name} × {item.quantity}
                        </span>
                        <span>
                          ${(item.menuItem.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                </div>
                <div className="mt-2 text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Pickup: {order.pickupTime}
                  </span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
};

export default OrderHistory;
