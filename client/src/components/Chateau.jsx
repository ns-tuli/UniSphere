import React, { useState } from "react";
import axios from "axios";

const Chateau = () => {
  const [query, setQuery] = useState("");
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [fileUploading, setFileUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setFileUploading(true);
    setError("");
    setUploadStatus("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:5000/api/quiz/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200) {
        setUploadStatus("File uploaded successfully!");
      } else {
        setUploadStatus("Failed to upload file.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Error uploading file.");
    } finally {
      setFileUploading(false);
      setFile(null); // Reset file input after upload
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      setError("Please enter a valid question.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const endpoint = "http://localhost:5000/api/quiz/chat"; // Updated backend URL

      const payload = { question: query };

      const res = await axios.post(endpoint, payload);

      const newConversation = {
        question: query,
        answer: res.data.answer || "No answer available.",
      };
      setConversations([...conversations, newConversation]);
      setQuery("");
    } catch (error) {
      console.error("Error asking question:", error);
      setConversations([
        ...conversations,
        {
          question: query,
          answer: "Sorry, there was an error answering your question.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-semibold mb-6">Interactive Chatbot</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* File Upload Section */}
      <div className="mb-6">
        <h3 className="text-xl font-medium mb-2">Upload Your Notes</h3>
        <form onSubmit={handleFileUpload} className="space-y-4">
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleFileChange}
            className="border-2 border-gray-300 p-2 rounded-md w-full"
            disabled={fileUploading}
          />
          <button
            type="submit"
            className={`w-full py-2 rounded-md text-white ${
              fileUploading ? "bg-gray-500" : "bg-blue-500"
            }`}
            disabled={fileUploading || !file}
          >
            {fileUploading ? "Uploading..." : "Upload Note"}
          </button>
        </form>
        {uploadStatus && <p className="mt-2 text-green-500">{uploadStatus}</p>}
      </div>

      {/* Chat Section */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-2">General Chat</h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question..."
            className="w-full p-2 border-2 border-gray-300 rounded-md"
            disabled={loading}
          />
          <button
            type="submit"
            className={`w-full py-2 rounded-md text-white ${
              loading ? "bg-gray-500" : "bg-green-500"
            }`}
            disabled={loading}
          >
            {loading ? "Processing..." : "Ask"}
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {conversations.map((conv, index) => (
          <div key={index} className="p-4 border border-gray-300 rounded-md">
            <p>
              <strong className="font-semibold">You:</strong> {conv.question}
            </p>
            <p>
              <strong className="font-semibold">Bot:</strong> {conv.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chateau;
