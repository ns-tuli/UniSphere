import React, { useState, useEffect } from "react";

const UploadNotes = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);

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
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message); // Display success message
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
      const response = await fetch("http://localhost:5000/api/uploads/upload", {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${localStorage.getItem("token")}` 
        },
        body: formData,
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
    <div>
      {/* Display success or error message */}
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}

      {/* File Upload Form */}
      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>

      {/* Display Uploaded Files */}
      <div>
        <h3>Uploaded PDFs</h3>
        <ul>
          {uploadedFiles.map((file, index) => (
            <li key={index}>
              <a
                href={`http://localhost:5000/api/uploads/file/${file._id}`}
                target="_blank"
              >
                {file.pdfFileName}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UploadNotes;
