import React, { useState, useEffect } from "react";

const UploadNotes = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [extractedText, setExtractedText] = useState(""); // State to store extracted text

  useEffect(() => {
    // Fetch the list of uploaded files when the component mounts
    fetchUploadedFiles();
  }, []);

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
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message); // Display the message returned by the backend
        setExtractedText(data.extractedText); // Set the extracted text from the response
        setError("");
        fetchUploadedFiles(); // Refresh the uploaded files list
      } else {
        setError(data.error || "Failed to upload file.");
      }
    } catch (err) {
      setError("Error uploading file: " + err.message);
    }
  };

  const fetchUploadedFiles = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/uploads/files", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setUploadedFiles(data.files);
      } else {
        setError(data.error || "Failed to fetch uploaded files.");
      }
    } catch (err) {
      setError("Error fetching uploaded files: " + err.message);
    }
  };

  return (
    <div className="uploadNotesContainer">
      <h2>Upload Notes</h2>
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}

      <form onSubmit={handleUpload}>
        <div className="fileInput">
          <input type="file" onChange={handleFileChange} />
        </div>
        <button type="submit">Upload</button>
      </form>

      {extractedText && (
        <div>
          <h3>Extracted Text from Uploaded PDF:</h3>
          <pre>{extractedText}</pre>
        </div>
      )}

      <div>
        <h3>Uploaded Notes</h3>
        <ul>
          {uploadedFiles.map((file, index) => (
            <li key={index}>{file.pdfFileName}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UploadNotes;
