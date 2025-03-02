import React, { useState } from "react";

const UploadNotes = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/api/uploads/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message); // Display the message returned by the backend
        setError("");
      } else {
        setError(data.error || "Failed to upload file.");
      }
    } catch (err) {
      setError("Error uploading file: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white">Upload Notes</h2>
        
        {/* Display success or error message */}
        {message && <p className="text-green-500 text-center">{message}</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* File Upload Form */}
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-600 dark:text-gray-300">Select a file to upload</label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              className="mt-2 block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
            />
          </div>

          {/* Upload Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200"
          >
            Upload
          </button>
        </form>

        {/* Text Editor (Placeholder for future functionality) */}
        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Notes Editor</h3>
          <textarea
            placeholder="Write your notes here..."
            rows="5"
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default UploadNotes;
