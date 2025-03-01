import React, { useState, useRef, useEffect } from 'react';
import {
  Save, FileText, Copy, Trash2, Edit, Download, Clock, ChevronDown,
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Heading1, Quote,
  Mic
} from 'lucide-react';
// Import fonts through your public index.html or via npm packages

function Notes() {
  const [text, setText] = useState('');
  const [savedTexts, setSavedTexts] = useState([]);
  const [selectedText, setSelectedText] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [languages] = useState(["English", "Bengali", "Hindi", "Spanish", "Arabic"]);
  const [selectedLanguage, setSelectedLanguage] = useState("Bengali");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [targetText, setTargetText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Font-related states
  const [fonts] = useState([
    'Inter',
    'Arial',
    'Times New Roman',
    'Roboto',
    'Verdana',
    'Georgia',
    'Helvetica',
    'Courier New',
    'Ubuntu',
    'DejaVu Sans',
    'DejaVu Serif',
    'DejaVu Sans Mono',
    'Liberation Sans',
    'Liberation Serif',
    'Liberation Mono',
    'Noto Sans',
    'Cantarell',
    'Noto Sans Bengali',
    'Noto Serif Bengali',
    'Lohit Bengali',
    'Mukta Malar',
    'SolaimanLipi'
  ]);

  const [selectedFont, setSelectedFont] = useState('Inter');
  const [showFontDropdown, setShowFontDropdown] = useState(false);

  const textareaRef = useRef(null);
  const editorRef = useRef(null);
  const languageDropdownRef = useRef(null);
  const fontDropdownRef = useRef(null);

  // Load saved texts from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('kahiniTexts');
    if (savedData) {
      setSavedTexts(JSON.parse(savedData));
    }
  }, []);

  // Translation hook (simplified mock implementation)
  useEffect(() => {
    if (showTranslation && text) {
      setIsLoading(true);
      // Mock translation API call
      setTimeout(() => {
        setTargetText(`Translated to ${selectedLanguage}: ${text.substring(0, 50)}...`);
        setIsLoading(false);
      }, 1000);
    }
  }, [showTranslation, text, selectedLanguage]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target)) {
        setShowLanguageDropdown(false);
      }
      if (fontDropdownRef.current &&
        !fontDropdownRef.current.contains(event.target)) {
        setShowFontDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Speech Recognition Logic
  const startListening = () => {
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    setIsListening(true);
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = selectedLanguage === 'English' ? 'en-US' : 'bn-BD'; // Set appropriate language code
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const editor = editorRef.current;

      // Insert text at current cursor position or append
      if (editor) {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const textNode = document.createTextNode(transcript + ' ');
        range.insertNode(textNode);

        // Update text state
        setText(editor.innerHTML);
      }

      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  // Text Formatting Functions
  const applyFormatting = (formatType) => {
    const editor = editorRef.current;
    if (!editor) return;

    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    let formattedText = document.createElement('span');
    switch (formatType) {
      case 'bold':
        formattedText.style.fontWeight = 'bold';
        break;
      case 'italic':
        formattedText.style.fontStyle = 'italic';
        break;
      case 'underline':
        formattedText.style.textDecoration = 'underline';
        break;
      case 'quote':
        formattedText.style.fontStyle = 'italic';
        formattedText.style.borderLeft = '2px solid #ccc';
        formattedText.style.paddingLeft = '8px';
        break;
      case 'heading':
        formattedText.style.fontSize = '1.5em';
        formattedText.style.fontWeight = 'bold';
        break;
      case 'bulletList':
        formattedText = document.createElement('ul');
        selectedText.split('\n').forEach(line => {
          const li = document.createElement('li');
          li.textContent = line;
          formattedText.appendChild(li);
        });
        break;
      case 'numberedList':
        formattedText = document.createElement('ol');
        selectedText.split('\n').forEach((line, index) => {
          const li = document.createElement('li');
          li.textContent = line;
          formattedText.appendChild(li);
        });
        break;
    }

    if (['bulletList', 'numberedList'].includes(formatType)) {
      range.deleteContents();
      range.insertNode(formattedText);
    } else {
      formattedText.textContent = selectedText;
      range.deleteContents();
      range.insertNode(formattedText);
    }

    // Update the text state
    setText(editor.innerHTML);
  };

  // Core Functions
  const handleSave = () => {
    if (text.trim()) {
      const newSavedText = {
        id: Date.now(),
        content: text,
        timestamp: new Date().toLocaleString()
      };
      const updatedTexts = [...savedTexts, newSavedText];
      setSavedTexts(updatedTexts);
      localStorage.setItem('kahiniTexts', JSON.stringify(updatedTexts));
      setText('');
      if (editorRef.current) {
        editorRef.current.innerHTML = '';
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(showTranslation ? targetText : text);
  };

  const handleDownload = () => {
    const content = showTranslation ? targetText : text;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `story_${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
  };

  const handleDelete = (id) => {
    const updatedTexts = savedTexts.filter(item => item.id !== id);
    setSavedTexts(updatedTexts);
    localStorage.setItem('kahiniTexts', JSON.stringify(updatedTexts));
  };

  const handleEdit = (savedText) => {
    setSelectedText(savedText);
    setText(savedText.content);
    if (editorRef.current) {
      editorRef.current.innerHTML = savedText.content;
    }
    setIsEditMode(true);
  };

  const handleUpdateSavedText = () => {
    if (selectedText) {
      const updatedTexts = savedTexts.map(item =>
        item.id === selectedText.id
          ? { ...item, content: text }
          : item
      );
      setSavedTexts(updatedTexts);
      localStorage.setItem('kahiniTexts', JSON.stringify(updatedTexts));
      setIsEditMode(false);
      setSelectedText(null);
      setText('');
      if (editorRef.current) {
        editorRef.current.innerHTML = '';
      }
    }
  };

  return (
    <div className="flex bg-gray-900 min-h-screen text-gray-200 font-sans">
      {/* Editor Section */}
      <div className="w-3/4 p-3">
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          {/* Text Editor Toolbar */}
          <div className="flex bg-gray-700 rounded-lg p-1 mb-4 gap-4 flex-wrap">
            <div className="flex gap-1 items-center border-r border-gray-600 pr-4 relative">
              <button
                className="bg-transparent text-gray-200 p-2 rounded hover:bg-gray-600 transition-colors"
                onClick={() => applyFormatting('bold')}
                title="Bold"
              >
                <Bold size={16} />
              </button>
              <button
                className="bg-transparent text-gray-200 p-2 rounded hover:bg-gray-600 transition-colors"
                onClick={() => applyFormatting('italic')}
                title="Italic"
              >
                <Italic size={16} />
              </button>
              <button
                className="bg-transparent text-gray-200 p-2 rounded hover:bg-gray-600 transition-colors"
                onClick={() => applyFormatting('underline')}
                title="Underline"
              >
                <Underline size={16} />
              </button>
            </div>

            <div className="flex gap-1 items-center border-r border-gray-600 pr-4 relative">
              <button
                className="bg-transparent text-gray-200 p-2 rounded hover:bg-gray-600 transition-colors"
                onClick={() => applyFormatting('heading')}
                title="Heading"
              >
                <Heading1 size={16} />
              </button>
              <button
                className="bg-transparent text-gray-200 p-2 rounded hover:bg-gray-600 transition-colors"
                onClick={() => applyFormatting('quote')}
                title="Quote"
              >
                <Quote size={16} />
              </button>
            </div>

            <div className="flex gap-1 items-center border-r border-gray-600 pr-4 relative">
              <button
                className="bg-transparent text-gray-200 p-2 rounded hover:bg-gray-600 transition-colors"
                onClick={() => applyFormatting('bulletList')}
                title="Bullet List"
              >
                <List size={16} />
              </button>
              <button
                className="bg-transparent text-gray-200 p-2 rounded hover:bg-gray-600 transition-colors"
                onClick={() => applyFormatting('numberedList')}
                title="Numbered List"
              >
                <ListOrdered size={16} />
              </button>
            </div>

            {/* Font Selector */}
            <div
              className="flex gap-1 items-center relative"
              ref={fontDropdownRef}
            >
              <div
                className="bg-gray-600 text-gray-200 px-2 py-1 rounded flex items-center gap-1 cursor-pointer hover:bg-gray-500 transition-colors"
                onClick={() => setShowFontDropdown(!showFontDropdown)}
                style={{ fontFamily: selectedFont }}
              >
                {selectedFont}
                <ChevronDown size={16} />
              </div>
              {showFontDropdown && (
                <div className="absolute top-full left-0 bg-gray-800 border border-gray-600 rounded z-10 min-w-32 max-h-48 overflow-y-auto shadow-lg">
                  {fonts.map(font => (
                    <div
                      key={font}
                      className="p-2 cursor-pointer hover:bg-gray-700 transition-colors"
                      style={{ fontFamily: font }}
                      onClick={() => {
                        setSelectedFont(font);
                        setShowFontDropdown(false);

                        // Apply font to entire editor
                        if (editorRef.current) {
                          editorRef.current.style.fontFamily = font;
                        }
                      }}
                    >
                      {font}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Editor */}
          <div
            ref={editorRef}
            className="w-full bg-transparent text-gray-200 border-none outline-none text-base leading-relaxed min-h-80 empty:before:content-[attr(placeholder)] empty:before:text-gray-500"
            contentEditable
            style={{ fontFamily: selectedFont }}
            onInput={(e) => setText(e.target.innerHTML)}
            placeholder="Start writing your story..."
          />

          {/* Voice-to-Text Button */}
          <div className="mt-4 flex justify-end">
            <button
              className={`bg-gray-600 text-gray-200 border-none px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 transition-colors ${isListening ? 'bg-green-700' : 'hover:bg-gray-500'}`}
              onClick={startListening}
              disabled={isListening}
              title="Voice to Text"
            >
              <Mic size={16} />
              {isListening ? "Listening..." : ""}
            </button>
          </div>

          {/* Language Selector and Action Buttons */}
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-4 relative" ref={languageDropdownRef}>
              <div
                className="bg-gray-600 text-gray-200 px-2 py-1 rounded flex items-center gap-1 cursor-pointer hover:bg-gray-500 transition-colors"
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              >
                {selectedLanguage}
                <ChevronDown size={16} />
              </div>
              {showLanguageDropdown && (
                <div className="absolute top-full left-0 bg-gray-800 border border-gray-600 rounded z-10 min-w-32 max-h-48 overflow-y-auto shadow-lg">
                  {languages.map(lang => (
                    <div
                      key={lang}
                      className="p-2 cursor-pointer hover:bg-gray-700 transition-colors"
                      onClick={() => {
                        setSelectedLanguage(lang);
                        setShowLanguageDropdown(false);
                      }}
                    >
                      {lang}
                    </div>
                  ))}
                </div>
              )}
              <button
                className="bg-green-700 text-gray-200 border-none px-3 py-1 rounded cursor-pointer hover:bg-green-600 transition-colors"
                onClick={() => setShowTranslation(!showTranslation)}
              >
                Translate
              </button>
            </div>

            <div className="flex gap-2">
              {isEditMode ? (
                <button
                  onClick={handleUpdateSavedText}
                  className="bg-gray-600 text-gray-200 border-none p-2 rounded cursor-pointer flex items-center justify-center hover:bg-gray-500 transition-colors"
                >
                  Update
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  className="bg-gray-600 text-gray-200 border-none p-2 rounded cursor-pointer flex items-center justify-center hover:bg-gray-500 transition-colors"
                >
                  <Save size={16} />
                </button>
              )}
              <button
                onClick={handleCopy}
                className="bg-gray-600 text-gray-200 border-none p-2 rounded cursor-pointer flex items-center justify-center hover:bg-gray-500 transition-colors"
              >
                <Copy size={16} />
              </button>
              <button
                onClick={handleDownload}
                className="bg-gray-600 text-gray-200 border-none p-2 rounded cursor-pointer flex items-center justify-center hover:bg-gray-500 transition-colors"
              >
                <Download size={16} />
              </button>
            </div>
          </div>

          {/* Translation Section */}
          {showTranslation && (
            <div className="mt-4 border-t border-gray-600 pt-4 max-h-48 overflow-auto">
              <textarea
                className="w-full bg-gray-700 text-gray-200 border-none resize-none min-h-36 p-2 rounded max-h-36 overflow-auto"
                value={isLoading ? "Translating..." : targetText || ""}
                readOnly
                placeholder={error || "Translation"}
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => navigator.clipboard.writeText(targetText)}
                  className="bg-gray-600 text-gray-200 border-none p-2 rounded cursor-pointer flex items-center justify-center hover:bg-gray-500 transition-colors"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Saved Stories Section */}
      <div className="w-1/4 p-2 bg-gray-800 border-l border-gray-600 overflow-y-auto rounded-md">
        <h2 className="flex items-center gap-2 mb-4 text-gray-200 text-xl font-bold">
          <FileText size={20} /> Saved Stories
        </h2>
        {savedTexts.length === 0 ? (
          <p className="text-gray-400 text-center p-4">No stories saved yet</p>
        ) : (
          savedTexts.map((savedText) => (
            <div key={savedText.id} className="bg-gray-700 rounded-lg p-4 mb-4">
              <p className="mb-2 max-h-24 overflow-hidden text-ellipsis">{savedText.content}</p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 flex items-center gap-1">
                  <Clock size={12} /> {savedText.timestamp}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(savedText)}
                    className="bg-gray-600 text-gray-200 border-none p-1 rounded cursor-pointer flex items-center justify-center hover:bg-gray-500 transition-colors"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(savedText.id)}
                    className="bg-gray-600 text-gray-200 border-none p-1 rounded cursor-pointer flex items-center justify-center hover:bg-gray-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notes;