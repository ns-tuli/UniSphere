import express from "express";
import { ObjectId } from "mongodb";

const router = express.Router();

// Fetch note content by ID
router.get("/note-content/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const gfsBucket = req.app.locals.gfsBucket;

    if (!gfsBucket) {
      return res.status(500).json({ error: "GridFSBucket is not initialized." });
    }

    const file = await req.app.locals.db.collection("uploads.files").findOne({ _id: new ObjectId(id) });

    if (!file) {
      return res.status(404).json({ error: "File not found." });
    }

    const readStream = gfsBucket.openDownloadStream(new ObjectId(id));
    const chunks = [];
    readStream.on("data", (chunk) => chunks.push(chunk));
    readStream.on("end", () => {
      const fileContent = Buffer.concat(chunks).toString("utf-8");
      res.status(200).json({ content: fileContent });
    });
    readStream.on("error", (err) => {
      console.error("Error reading file:", err);
      res.status(500).json({ error: "Failed to read file content." });
    });
  } catch (error) {
    console.error("Error fetching note content:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

export default router;