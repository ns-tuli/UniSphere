# Virtual Quiz System

A system that allows users to upload notes (PDFs or images), extract text, and ask questions to an AI chatbot about the content.

## Features

- Upload PDF documents or images
- Extract text using OCR (for images) or PDF parsing
- Ask questions about the document content
- AI-powered responses using Gemini AI
- Fallback mechanisms when AI services are unavailable

## Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Gemini AI API key (already in your .env file)

### Installation

1. Make sure your `.env` file contains the Gemini API key:

```
GEMINI_AI=your_gemini_api_key_here
```

2. Install dependencies:

```bash
# In the root directory
npm install

# In the client directory
cd client
npm install
```

### Running the System

1. Start the server:

```bash
# In the root directory
node start-server.js
```

2. In a separate terminal, start the client:

```bash
# In the client directory
cd client
npm run dev
```

3. Access the application at http://localhost:5175 (or whatever port Vite is using)

## Troubleshooting

### Connection Issues

If you see "No response from server" or "Failed to connect to server" errors:

1. Make sure the server is running on port 5000
2. Check that the Vite proxy is configured correctly in `client/vite.config.js`
3. Restart both the server and client

### File Upload Issues

If file uploads fail:

1. Make sure the `uploads` directory exists in the root of the project
2. Check that the server has write permissions to this directory
3. Verify that the file size is under 10MB

### Text Extraction Issues

If text extraction fails:

1. For PDFs, make sure the PDF is not encrypted or password-protected
2. For images, ensure the image is clear and the text is readable
3. Try a different file format if possible

## How It Works

1. **Upload**: Files are uploaded to the server and stored in the `uploads` directory
2. **Extract**: Text is extracted using pdf-parse (for PDFs) or Tesseract.js (for images)
3. **Chat**: User questions are sent to the Gemini AI with the extracted text as context
4. **Response**: AI generates responses based on the document content

## Technologies Used

- Frontend: React, Vite, Tailwind CSS
- Backend: Express.js
- AI: Gemini AI
- Text Extraction: pdf-parse, Tesseract.js
- File Storage: Local filesystem
