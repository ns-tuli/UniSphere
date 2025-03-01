import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import "highlight.js/styles/github.css";
import { jsPDF } from "jspdf";
import { Code, Copy, Download } from "lucide-react";
import React, { useState } from "react";

hljs.registerLanguage("javascript", javascript);

function Notes() {
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [isCodeMode, setIsCodeMode] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    alert("Text copied to clipboard!");
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    doc.setFontSize(fontSize);
    doc.text(text, 10, 10);
    doc.save("notes.pdf");
  };

  const wordCount = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  return (
    <div className="flex flex-col justify-center min-h-screen bg-gray-100 dark:bg-[#18181b] font-['Poppins']">
      <div
        id="main-content"
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: isExpanded ? "260px" : "80px" }}
      >
        <div className="flex flex-col min-h-screen p-8 bg-yellow-50 dark:bg-[#18181b] font-['Poppins'] dark:border dark:border-yellow-200/50 dark:rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl flex flex-col justify-center items-center  font-bold dark:text-yellow-100">
              Notes
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-2 bg-blue-600 dark:bg-blue-400 text-white dark:text-black rounded hover:bg-blue-700 dark:hover:bg-blue-800 transition"
              >
                <Copy size={18} />
              </button>
              <button
                onClick={handleDownload}
                className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                <Download size={18} />
              </button>
              <button
                onClick={() => setIsCodeMode(!isCodeMode)}
                className={`px-3 py-2 rounded ${
                  isCodeMode
                    ? "bg-gray-800 dark:bg-yellow-500/70 dark:text-black text-white"
                    : "bg-gray-200"
                }`}
              >
                <Code size={18} />
              </button>
            </div>
          </div>

          <div className="flex justify-between mb-4">
            <div>
              <label className="mr-2 dark:text-gray-300">Font Size:</label>
              <input
                type="range"
                min="12"
                max="24"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="cursor-pointer"
              />
            </div>
            <p className="text-gray-700 dark:text-white">
              Word Count: <span className="font-bold">{wordCount}</span>
            </p>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className={`w-full h-96 p-4 border rounded ${
              isCodeMode
                ? "font-mono bg-gray-100 dark:bg-yellow-50/10 text-grey-900"
                : "bg-white dark:bg-gray-400/10 dark:border dark:border-black dark:focus:ring-black text-black "
            }`}
            style={{ fontSize: `${fontSize}px` }}
            placeholder="Start typing your notes here..."
          />

          {isCodeMode && (
            <div className="mt-6 p-4 bg-gray-900 dark:bg-transparent dark:border dark:border-yellow-100/40 text-white dark:text-white rounded">
              <pre>
                <code
                  dangerouslySetInnerHTML={{
                    __html: hljs.highlight(text, { language: "javascript" })
                      .value,
                  }}
                />
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notes;
