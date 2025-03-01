import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false; // Stop after one sentence
      recognitionRef.current.interimResults = false; // Only final results
      recognitionRef.current.lang = "en-US"; // Set language to English

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript); // Set the recognized text as input
        setIsListening(false); // Stop listening
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false); // Stop listening on error
      };
    } else {
      console.warn("Speech recognition not supported in this browser.");
    }
  }, []);

  // Scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await axios.post("http://localhost:5000/api/chat", {
        message: input,
      });
      if (response.data.text) {
        const botMessage = { text: response.data.text, sender: "bot" };
        setMessages((prev) => [...prev, botMessage]);
      } else if (response.data.error) {
        setMessages((prev) => [
          ...prev,
          { text: response.data.error, sender: "bot" },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { text: "Failed to get a valid response.", sender: "bot" },
        ]);
      }
    } catch (error) {
      console.error(
        "Error fetching response:",
        error.response ? error.response.data : error.message
      );
      setMessages((prev) => [
        ...prev,
        { text: "Failed to get response.", sender: "bot" },
      ]);
    }
    setIsLoading(false);
  };

  // Start voice input
  const startVoiceInput = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F5F5DC]">
      {/* Header */}
      <div className="bg-[#8B4513] text-white p-4 text-center">
        <h1 className="text-2xl font-bold">Chatbot</h1>
        <p className="text-sm">Your conversational assistant</p>
      </div>

      {/* Chat Container */}
      <div className="flex-grow overflow-auto p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            } mb-2`}
          >
            <div
              className={`rounded-lg p-3 ${
                msg.sender === "user"
                  ? "bg-[#D2B48C] text-[#654321]"
                  : "bg-[#F4A460] text-[#654321]"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-center text-[#654321]">Thinking...</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex p-4 bg-[#FFF8DC]">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow p-2 border rounded-l-lg bg-[#F5F5DC] text-[#654321]"
          placeholder="Type a message..."
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={startVoiceInput}
          disabled={isLoading || isListening}
          className={`bg-[#FFD700] text-[#654321] p-2 border border-[#654321] ${
            isListening ? "bg-[#F4A460]" : ""
          }`}
        >
          <FontAwesomeIcon icon={faMicrophone} />
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-[#FFD700] text-[#654321] p-2 rounded-r-lg"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
