const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

// Check if uploads directory exists, create if not
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  console.log("Creating uploads directory...");
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Start the server
console.log("Starting server...");
const server = spawn("node", ["server/server.js"], {
  stdio: "inherit",
  env: { ...process.env },
});

server.on("error", (err) => {
  console.error("Failed to start server:", err);
});

console.log("Server started. Press Ctrl+C to stop.");
