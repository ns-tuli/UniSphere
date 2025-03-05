import React, { useState, useEffect } from "react";

const UploadNotes = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Fetch the list of uploaded files when the component mounts
  useEffect(() => {
    fetchUploadedFiles(); // Call the function to fetch uploaded files
  }, []);

  // Handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Upload the file to the server
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    const user= JSON.parse(localStorage.getItem("user"));
    formData.append("file", file);
    formData.append("email", user.email);
    
    try {
      const response = await fetch("http://localhost:5000/api/v1/uploads/upload", {
        method: "POST",
        body: formData, // Attach the file in the form data
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message); // Success message
        setError(""); // Clear any previous error
        fetchUploadedFiles(); // Refresh the uploaded files list after successful upload
      } else {
        setError(data.error || "Failed to upload file.");
      }
    } catch (err) {
      setError("Error uploading file: " + err.message);
    }
  };

  // Fetch the list of uploaded files from the server
  const fetchUploadedFiles = async () => {
    const user= JSON.parse(localStorage.getItem("user"));

    try {
      const response = await fetch("http://localhost:5000/api/v1/uploads/files",{
        method: "GET",
        headers: {
          'email': user.email
        },
      })

      const data = await response.json();
      if (response.ok) {
        setUploadedFiles(data.files); // Update the state with the fetched files
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
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* File Upload Form */}
      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>

      {/* Display Uploaded Files */}
      <div>
        <h3>Uploaded PDFs</h3>
        <ul>
          {uploadedFiles.length > 0 ? (
            uploadedFiles.map((file, index) => (
              <li key={index}>
                <a
                  href={`http://localhost:5000/api/v1/uploads/file/${file._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {file.pdfFileName}
                </a>
              </li>
            ))
          ) : (
            <li>No files uploaded yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default UploadNotes;
