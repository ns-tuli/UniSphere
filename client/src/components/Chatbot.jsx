import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faMicrophone, 
  faPaperPlane, 
  faTimes, 
  faComments, 
  faSpinner,
  faStar,
  faUniversity
} from "@fortawesome/free-solid-svg-icons";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm Lumina, your UniSphere Assistant. How can I help you today?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [typingEffect, setTypingEffect] = useState(false);
  const [currentBotMessage, setCurrentBotMessage] = useState("");
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

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

  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  // Scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, currentBotMessage]);

  // Simulate typing effect for bot messages
  const simulateTypingEffect = (text) => {
    setTypingEffect(true);
    setCurrentBotMessage("");
    
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setCurrentBotMessage(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
        setTypingEffect(false);
        setMessages(prev => [...prev, { text, sender: "bot" }]);
        setCurrentBotMessage("");
      }
    }, 15); // Speed of typing effect
  };

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
        simulateTypingEffect(response.data.text);
      } else if (response.data.error) {
        simulateTypingEffect(response.data.error);
      } else {
        simulateTypingEffect("Failed to get a valid response.");
      }
    } catch (error) {
      console.error(
        "Error fetching response:",
        error.response ? error.response.data : error.message
      );
      simulateTypingEffect("Sorry, I'm having trouble connecting right now. Please try again later.");
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
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-yellow-600 hover:bg-yellow-500 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <FontAwesomeIcon 
          icon={isOpen ? faTimes : faComments} 
          className="text-xl" 
        />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-96 h-[500px] bg-yellow-50 dark:bg-[#18181b] rounded-lg shadow-xl flex flex-col overflow-hidden border border-yellow-200 dark:border-yellow-800 transition-all duration-300 transform translate-y-0 opacity-100">
          {/* Header */}
          <div className="bg-yellow-600 dark:bg-yellow-700 p-4 border-b border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faUniversity} className="text-yellow-200" />
                <h1 className="text-xl font-bold text-white">
                  Lumina
                </h1>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-yellow-100 hover:text-white transition-colors"
                aria-label="Close chat"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-grow overflow-auto p-4 space-y-3 bg-yellow-50 dark:bg-[#18181b]">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                } opacity-100 transition-opacity duration-300`}
              >
                {msg.sender === "bot" && (
                  <div className="w-6 h-6 rounded-full bg-yellow-600 flex items-center justify-center mr-2 self-end mb-1">
                    <FontAwesomeIcon icon={faStar} className="text-xs text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-xl px-4 py-2 shadow-sm ${
                    msg.sender === "user"
                      ? "bg-yellow-600 text-white rounded-tr-none"
                      : "bg-yellow-100 dark:bg-yellow-800/30 text-gray-800 dark:text-yellow-100 rounded-tl-none"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                </div>
                {msg.sender === "user" && (
                  <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center ml-2 self-end mb-1">
                    <span className="text-xs text-white font-bold">U</span>
                  </div>
                )}
              </div>
            ))}
            {typingEffect && (
              <div className="flex justify-start opacity-100 transition-opacity duration-300">
                <div className="w-6 h-6 rounded-full bg-yellow-600 flex items-center justify-center mr-2 self-end mb-1">
                  <FontAwesomeIcon icon={faStar} className="text-xs text-white" />
                </div>
                <div className="max-w-[80%] rounded-xl px-4 py-2 shadow-sm bg-yellow-100 dark:bg-yellow-800/30 text-gray-800 dark:text-yellow-100 rounded-tl-none">
                  <p className="text-sm whitespace-pre-wrap">{currentBotMessage}</p>
                </div>
              </div>
            )}
            {isLoading && !typingEffect && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full bg-yellow-600 flex items-center justify-center mr-2 self-end mb-1">
                  <FontAwesomeIcon icon={faStar} className="text-xs text-white" />
                </div>
                <div className="bg-yellow-100 dark:bg-yellow-800/30 text-yellow-800 dark:text-yellow-100 rounded-xl rounded-tl-none px-4 py-2 text-sm shadow-sm">
                  <div className="flex items-center space-x-2">
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="p-3 bg-yellow-50 dark:bg-[#18181b] border-t border-yellow-200 dark:border-yellow-800">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-grow p-2 rounded-lg border border-yellow-200 dark:border-yellow-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Ask Lumina something..."
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={startVoiceInput}
                disabled={isLoading || isListening}
                className={`p-2 rounded-lg transition-colors ${
                  isListening
                    ? "bg-red-500 text-white animate-pulse"
                    : "bg-yellow-600 text-white hover:bg-yellow-500 disabled:opacity-50"
                }`}
                aria-label="Voice input"
              >
                <FontAwesomeIcon icon={faMicrophone} />
              </button>
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-yellow-600 text-white p-2 rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50"
                aria-label="Send message"
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;