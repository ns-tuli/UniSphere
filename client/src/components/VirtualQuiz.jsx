import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  FileText,
  Send,
  Trash2,
  RefreshCw,
  Bot,
  User,
  Book,
  AlertTriangle,
  CheckCircle,
  X,
  ChevronDown,
  ChevronUp,
  Download,
} from "lucide-react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
axios.defaults.baseURL = API_BASE_URL;

const VirtualQuiz = () => {
  // State for file upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);

  // State for text extraction
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedText, setExtractedText] = useState("");

  // State for chat
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Refs
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Load saved files from localStorage on component mount
  useEffect(() => {
    // Test API connection
    testApiConnection();

    const savedFiles = localStorage.getItem("virtualQuizFiles");
    if (savedFiles) {
      try {
        setUploadedFiles(JSON.parse(savedFiles));
      } catch (error) {
        console.error("Error parsing saved files:", error);
      }
    }
  }, []);

  // Save files to localStorage when uploadedFiles changes
  useEffect(() => {
    localStorage.setItem("virtualQuizFiles", JSON.stringify(uploadedFiles));
  }, [uploadedFiles]);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Test API connection
  const testApiConnection = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/virtual-quiz/test`,
        {
          timeout: 5000, // 5 second timeout
        }
      );
      console.log("API connection test:", response.data);
      toast.success("Connected to server successfully!");
    } catch (error) {
      console.error("API connection test failed:", error);
      const errorMessage = error.response
        ? `Server error: ${error.response.status}`
        : `Connection failed: ${error.message}`;
      toast.error(
        `Could not connect to the server (${errorMessage}). File uploads may not work.`
      );
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "application/pdf" || file.type.includes("image/")) {
        setSelectedFile(file);
      } else {
        toast.error("Please select a PDF or image file");
      }
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      console.log("Starting file upload...");

      // Upload via our backend API
      const response = await axios.post(
        `${API_BASE_URL}/api/virtual-quiz/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
            console.log(`Upload progress: ${progress}%`);
          },
        }
      );

      console.log("Upload response:", response.data);

      if (!response.data || !response.data.success) {
        throw new Error(
          response.data?.msg || "Upload failed with unknown error"
        );
      }

      // Add file to uploaded files list
      const newFile = {
        id: Date.now().toString(),
        name: selectedFile.name,
        type: selectedFile.type,
        url: response.data.file.url,
        publicId: response.data.file.publicId,
        uploadedAt: new Date().toISOString(),
        extractedText: "",
      };

      console.log("File uploaded successfully:", newFile);

      setUploadedFiles((prev) => [...prev, newFile]);
      setSelectedFile(null);
      setActiveFile(newFile);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast.success("File uploaded successfully!");

      // Automatically start text extraction
      extractTextFromFile(newFile);
    } catch (error) {
      console.error("Error uploading file:", error);

      // More detailed error logging
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);

        toast.error(
          `Upload failed: ${
            error.response.data?.msg ||
            error.response.statusText ||
            "Server error"
          }`
        );
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error request:", error.request);
        toast.error(
          "No response from server. Please check your connection and try again."
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error(`Failed to upload file: ${error.message}`);
      }
    } finally {
      setIsUploading(false);
    }
  };

  // Extract text from file
  const extractTextFromFile = async (file) => {
    if (!file) return;

    setIsExtracting(true);
    setActiveFile(file);

    try {
      // Check if text has already been extracted
      const existingFile = uploadedFiles.find((f) => f.id === file.id);
      if (existingFile && existingFile.extractedText) {
        setExtractedText(existingFile.extractedText);
        setIsExtracting(false);

        // Initialize chat with a welcome message if there are no messages yet
        if (messages.length === 0) {
          setMessages([
            {
              role: "assistant",
              content:
                "I've analyzed your document. What would you like to know about it?",
            },
          ]);
        }

        return;
      }

      // For PDFs or images, use our backend API for text extraction
      const response = await axios.post(
        `${API_BASE_URL}/api/virtual-quiz/extract-text`,
        {
          fileUrl: file.url,
          fileType: file.type.includes("pdf") ? "pdf" : "image",
        },
        {
          timeout: 60000, // 60 seconds timeout for extraction
        }
      );

      if (!response.data || !response.data.text) {
        throw new Error("No text was extracted from the file");
      }

      const extractedText = response.data.text;

      // If extracted text is too short, it might be an error
      if (extractedText.trim().length < 10) {
        toast.warning(
          "Very little text was extracted. The file might be an image with no text or a scanned document."
        );
      }

      // Update file with extracted text
      setUploadedFiles((prev) =>
        prev.map((f) => (f.id === file.id ? { ...f, extractedText } : f))
      );

      setExtractedText(extractedText);

      toast.success("Text extracted successfully!");

      // Initialize chat with a welcome message
      setMessages([
        {
          role: "assistant",
          content:
            "I've analyzed your document. What would you like to know about it?",
        },
      ]);
    } catch (error) {
      console.error("Error extracting text:", error);

      // Create a fallback message for the user
      const errorMessage =
        "I couldn't extract text from this document. It might be encrypted, scanned, or in a format I can't process. You can still ask questions, but I won't have specific context from your document.";

      // Set a placeholder extracted text so the chat can still function
      const fallbackText = `This is a document titled "${file.name}". The text extraction failed, but the user can still ask general questions.`;

      // Update file with fallback text
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === file.id ? { ...f, extractedText: fallbackText } : f
        )
      );

      setExtractedText(fallbackText);

      toast.error(
        "Failed to extract text. You can still ask general questions."
      );

      // Initialize chat with an error message
      setMessages([
        {
          role: "assistant",
          content: errorMessage,
        },
      ]);
    } finally {
      setIsExtracting(false);
    }
  };

  // Handle sending message to AI
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !activeFile || !extractedText) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    setIsSendingMessage(true);

    try {
      // Send message to AI API with extracted text as context
      const response = await axios.post(
        `${API_BASE_URL}/api/virtual-quiz/chat`,
        {
          message: userMessage,
          context: extractedText,
        },
        {
          timeout: 30000, // 30 seconds timeout
        }
      );

      if (!response.data || !response.data.message) {
        throw new Error("No response received from AI");
      }

      // Add AI response to chat
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.data.message },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);

      // Check if it's a timeout error
      const isTimeout =
        error.code === "ECONNABORTED" ||
        (error.message && error.message.includes("timeout"));

      // Check if it's a server error
      const isServerError = error.response && error.response.status >= 500;

      // Create appropriate error message
      let errorMessage =
        "I'm sorry, I encountered an error processing your request. Please try again.";

      if (isTimeout) {
        errorMessage =
          "The request took too long to process. This might be due to high server load or the complexity of your question. Please try a simpler question or try again later.";
        toast.error("Request timed out. Please try again.");
      } else if (isServerError) {
        errorMessage =
          "There seems to be an issue with the server. Please try again later.";
        toast.error("Server error. Please try again later.");
      } else {
        toast.error("Failed to get response. Please try again.");
      }

      // Add error message to chat
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: errorMessage,
        },
      ]);

      // Try to generate a simple response based on the document content
      try {
        // Simple keyword matching for basic responses
        const keywords = userMessage.toLowerCase().split(/\s+/);

        // Find sentences in the extracted text that contain keywords from the user's message
        const sentences = extractedText
          .split(/[.!?]+/)
          .filter((s) => s.trim().length > 0);
        const relevantSentences = sentences.filter((sentence) => {
          const sentenceLower = sentence.toLowerCase();
          return keywords.some(
            (keyword) => keyword.length > 3 && sentenceLower.includes(keyword)
          );
        });

        // If we found relevant sentences, add them as a fallback response
        if (relevantSentences.length > 0) {
          const fallbackResponse =
            "I couldn't connect to the AI service, but I found these relevant parts in your document:\n\n" +
            relevantSentences.slice(0, 3).join(". ") +
            ".";

          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: fallbackResponse,
            },
          ]);
        }
      } catch (fallbackError) {
        console.error("Error generating fallback response:", fallbackError);
      }
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Handle deleting a file
  const handleDeleteFile = async (fileId) => {
    try {
      const fileToDelete = uploadedFiles.find((file) => file.id === fileId);

      if (fileToDelete && fileToDelete.publicId) {
        // Delete from server
        await axios.post(`${API_BASE_URL}/api/virtual-quiz/delete-file`, {
          publicId: fileToDelete.publicId,
        });
      }

      // Remove from state
      setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));

      // If active file is deleted, reset active file
      if (activeFile && activeFile.id === fileId) {
        setActiveFile(null);
        setExtractedText("");
        setMessages([]);
      }

      toast.success("File deleted successfully!");
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file. Please try again.");
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  // Truncate text
  const truncateText = (text, maxLength = 100) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Virtual Quiz System
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Upload your notes, extract text, and ask questions to the AI chatbot
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - File Upload and Management */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Upload Notes
                </h2>

                {/* Connection Test Button */}
                <div className="mb-4">
                  <button
                    onClick={testApiConnection}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Test server connection
                  </button>
                </div>

                {/* File Upload */}
                <div className="mb-6">
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-10 h-10 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PDF or Image files only
                        </p>
                      </div>
                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept="application/pdf,image/*"
                        onChange={handleFileSelect}
                        ref={fileInputRef}
                      />
                    </label>
                  </div>

                  {selectedFile && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-blue-500 mr-2" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[150px]">
                            {selectedFile.name}
                          </span>
                        </div>
                        <button
                          onClick={() => setSelectedFile(null)}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={handleUpload}
                        disabled={isUploading}
                        className={`mt-3 w-full px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center ${
                          isUploading
                            ? "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {isUploading ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Uploading ({uploadProgress}%)
                          </>
                        ) : (
                          "Upload File"
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Uploaded Files */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    Your Notes
                  </h3>

                  {uploadedFiles.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Book className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No notes uploaded yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {uploadedFiles.map((file) => (
                        <div
                          key={file.id}
                          className={`border rounded-lg overflow-hidden ${
                            activeFile && activeFile.id === file.id
                              ? "border-blue-500 dark:border-blue-400"
                              : "border-gray-200 dark:border-gray-700"
                          }`}
                        >
                          <div
                            className={`p-3 cursor-pointer ${
                              activeFile && activeFile.id === file.id
                                ? "bg-blue-50 dark:bg-blue-900/20"
                                : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                            }`}
                            onClick={() => extractTextFromFile(file)}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex items-start">
                                <FileText className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
                                <div>
                                  <p className="font-medium text-gray-800 dark:text-white text-sm truncate max-w-[180px]">
                                    {file.name}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatTimestamp(file.uploadedAt)}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteFile(file.id);
                                }}
                                className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            {file.extractedText && (
                              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                                {truncateText(file.extractedText, 150)}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden h-full flex flex-col">
              {/* Active Document Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                {activeFile ? (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-blue-500 mr-2" />
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {activeFile.name}
                      </h3>
                    </div>

                    {isExtracting ? (
                      <div className="flex items-center text-amber-500 dark:text-amber-400">
                        <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                        <span className="text-sm">Extracting text...</span>
                      </div>
                    ) : (
                      extractedText && (
                        <div className="flex items-center text-green-500 dark:text-green-400">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          <span className="text-sm">Ready for questions</span>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    <h3 className="font-medium">No document selected</h3>
                  </div>
                )}
              </div>

              {/* Chat Messages */}
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4"
                style={{ maxHeight: "500px" }}
              >
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                    <Bot className="w-16 h-16 mb-4 opacity-50" />
                    <p className="text-center max-w-md">
                      {activeFile
                        ? isExtracting
                          ? "Extracting text from your document..."
                          : "Select a document and ask questions about it"
                        : "Upload and select a document to start chatting"}
                    </p>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.role === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        }`}
                      >
                        <div className="flex items-center mb-1">
                          {message.role === "user" ? (
                            <User className="w-4 h-4 mr-1" />
                          ) : (
                            <Bot className="w-4 h-4 mr-1" />
                          )}
                          <span className="text-xs font-medium">
                            {message.role === "user" ? "You" : "AI Assistant"}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  ))
                )}

                {isSendingMessage && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2 max-w-[80%]">
                      <div className="flex items-center">
                        <Bot className="w-4 h-4 mr-1" />
                        <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
                          AI Assistant
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 mt-2">
                        <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"></div>
                        <div
                          className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={
                      !activeFile
                        ? "Select a document first..."
                        : isExtracting
                        ? "Extracting text..."
                        : !extractedText
                        ? "No text extracted yet..."
                        : "Ask a question about your document..."
                    }
                    disabled={!activeFile || isExtracting || !extractedText}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:dark:bg-gray-800 disabled:cursor-not-allowed"
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={
                      !activeFile ||
                      isExtracting ||
                      !extractedText ||
                      !inputMessage.trim() ||
                      isSendingMessage
                    }
                    className={`px-4 py-2 rounded-r-lg ${
                      !activeFile ||
                      isExtracting ||
                      !extractedText ||
                      !inputMessage.trim() ||
                      isSendingMessage
                        ? "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {isSendingMessage ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {activeFile && extractedText && (
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Ask questions about "{activeFile.name}" •{" "}
                    {extractedText.split(" ").length} words extracted
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualQuiz;
