import React from "react";
import { X, AlertTriangle, Clock, Bus } from "lucide-react";

const BusNotification = ({ notification, onClose }) => {
  const getNotificationTypeStyles = (type) => {
    switch (type) {
      case "delay":
        return {
          icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
          bgColor: "bg-amber-50 dark:bg-amber-900/20",
          borderColor: "border-amber-200 dark:border-amber-800",
          textColor: "text-amber-800 dark:text-amber-300",
        };
      case "cancellation":
        return {
          icon: <X className="h-5 w-5 text-red-500" />,
          bgColor: "bg-red-50 dark:bg-red-900/20",
          borderColor: "border-red-200 dark:border-red-800",
          textColor: "text-red-800 dark:text-red-300",
        };
      case "update":
      default:
        return {
          icon: <Clock className="h-5 w-5 text-blue-500" />,
          bgColor: "bg-blue-50 dark:bg-blue-900/20",
          borderColor: "border-blue-200 dark:border-blue-800",
          textColor: "text-blue-800 dark:text-blue-300",
        };
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const styles = getNotificationTypeStyles(notification.type);

  return (
    <div
      className={`mb-3 p-3 rounded-lg border ${styles.bgColor} ${styles.borderColor}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          {styles.icon}
          <div className="ml-2">
            <div className="flex items-center">
              <Bus className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {notification.busName}
              </span>
            </div>
            <p className={`text-sm mt-1 ${styles.textColor}`}>
              {notification.message}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {formatTime(notification.timestamp)}
            </p>
          </div>
        </div>
        <button
          onClick={() => onClose(notification)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default BusNotification;
