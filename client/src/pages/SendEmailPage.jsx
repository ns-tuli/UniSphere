import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const SendEmailPage = () => {
  const location = useLocation();
  const { role, alertId } = location.state || {};
  const [notificationMessage, setNotificationMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Sending the notification message to the backend
    const response = await fetch("http://localhost:5000/api/email/sendemail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ notificationMessage, role, alertId }),
    });

    const data = await response.json();
    alert(data.message); // Show the response message
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-900 to-yellow-300">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Send Notification Email
        </h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={notificationMessage}
            onChange={(e) => setNotificationMessage(e.target.value)}
            placeholder={`Enter your notification for ${role}...`}
            className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
          />
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Send Notification
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendEmailPage;
