import React, { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import io from "socket.io-client";
import { FaUsers, FaCopy, FaCheck } from "react-icons/fa";
import Whiteboard from "./Whiteboard";

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ size: ["small", false, "large", "huge"] }],
  ["bold", "italic", "underline", "strike"],
  [{ color: [] }, { background: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ align: [] }],
  ["blockquote", "code-block"],
  ["link", "image"],
  ["clean"],
];

const CollabEditor = ({ roomId, username }) => {
  const editorRef = useRef(null);
  const socketRef = useRef(null);
  const quillRef = useRef(null);
  const [userCount, setUserCount] = useState(1);
  const [isCopied, setIsCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editorType, setEditorType] = useState("text"); // 'text' or 'whiteboard'

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy room ID:", err);
    }
  };

  useEffect(() => {
    if (!editorRef.current) return;

    // Add custom class to remove default toolbar
    editorRef.current.classList.add("custom-quill-editor");

    const editor = new Quill(editorRef.current, {
      theme: "snow",
      modules: {
        toolbar: TOOLBAR_OPTIONS,
        history: {
          userOnly: true,
        },
      },
      placeholder: "Start collaborating...",
    });

    quillRef.current = editor;

    const socket = io("http://localhost:5000");
    socketRef.current = socket;

    socket.emit("join-room", { roomId, username });

    socket.on("user-count", (count) => {
      setUserCount(count);
    });

    socket.on("receive-changes", (delta) => {
      if (quillRef.current) {
        quillRef.current.updateContents(delta);
      }
    });

    socket.on("load-document", (document) => {
      if (quillRef.current) {
        quillRef.current.setContents(document);
        quillRef.current.enable();
      }
    });

    const handleTextChange = (delta, oldDelta, source) => {
      if (source !== "user" || !socketRef.current) return;
      setSaving(true);
      socketRef.current.emit("send-changes", { delta, roomId });
      setTimeout(() => setSaving(false), 1000);
    };

    quillRef.current.on("text-change", handleTextChange);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (quillRef.current) {
        quillRef.current.off("text-change", handleTextChange);
      }
    };
  }, [roomId, username]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="px-8 py-6 border-b border-yellow-100">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <FaUsers className="h-8 w-8 text-yellow-600" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Collaborative Editor
                  </h2>
                  <p className="text-sm text-gray-600">
                    {userCount} active users
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-2 bg-yellow-50 px-3 py-2 rounded-lg">
                  <span className="text-sm text-gray-600">Room ID:</span>
                  <code className="px-2 py-1 bg-white rounded text-sm font-mono border border-yellow-200">
                    {roomId}
                  </code>
                  <button
                    onClick={copyRoomId}
                    className="p-1.5 hover:bg-yellow-100 rounded-full transition-colors"
                    title="Copy room ID"
                  >
                    {isCopied ? (
                      <FaCheck className="text-green-500 h-4 w-4" />
                    ) : (
                      <FaCopy className="text-yellow-600 h-4 w-4" />
                    )}
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  Connected as:{" "}
                  <span className="font-medium text-yellow-600">
                    {username}
                  </span>
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setEditorType("text")}
                  className={`px-4 py-2 rounded ${
                    editorType === "text"
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  Text Editor
                </button>
                <button
                  onClick={() => setEditorType("whiteboard")}
                  className={`px-4 py-2 rounded ${
                    editorType === "whiteboard"
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  Whiteboard
                </button>
              </div>
            </div>
          </div>

          {/* Editor Container */}
          <div className="relative">
            {editorType === "text" ? (
              <div ref={editorRef} className="min-h-[calc(100vh-300px)]" />
            ) : (
              <div className="min-h-[calc(100vh-300px)]">
                <Whiteboard socket={socketRef.current} roomId={roomId} />
              </div>
            )}
          </div>

          {/* Status Footer */}
          <div className="px-8 py-4 bg-yellow-50 border-t border-yellow-100">
            <p className="text-sm text-gray-600 text-right">
              {saving ? "Saving changes..." : "All changes saved"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollabEditor;
