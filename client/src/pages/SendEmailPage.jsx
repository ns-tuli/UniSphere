import React, { useState } from "react";

const SendEmailPage = () => {
  const [notificationMessage, setNotificationMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Sending the notification message to the backend
    const response = await fetch("http://localhost:5000/api/email/sendemail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ notificationMessage }),
    });

    const data = await response.json();
    alert(data.message); // Show the response message
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Send Notification to Users
        </h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={notificationMessage}
            onChange={(e) => setNotificationMessage(e.target.value)}
            placeholder="Enter your one-liner notification..."
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
            rows="3"
          />
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Send Notification
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendEmailPage;
