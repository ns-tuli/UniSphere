import LostFoundItem from "../models/LostFoundItem.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import fs from "fs/promises";

// Get all items
export const getAllItems = async (req, res) => {
  try {
    const items = await LostFoundItem.find().sort({ createdAt: -1 });
    res.status(200).json(items || []); // Ensure we always return an array
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ error: "Failed to fetch items" });
  }
};

// Create new item
export const createItem = async (req, res) => {
  try {
    const data = req.body;
    let imageUrl = null;

    if (req.file) {
      try {
        const cloudinaryResponse = await uploadToCloudinary(
          req.file,
          "lost-found"
        );
        imageUrl = cloudinaryResponse.url;
        // Clean up the temporary file
        await fs.unlink(req.file.path);
      } catch (uploadError) {
        console.error("Error uploading to Cloudinary:", uploadError);
        // Clean up the temporary file on error
        if (req.file) {
          await fs.unlink(req.file.path).catch(console.error);
        }
        throw uploadError;
      }
    }

    const newItem = new LostFoundItem({
      ...data,
      imageUrl,
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error creating item:", error);
    // Clean up the temporary file on error
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }
    res.status(500).json({ error: "Failed to create item: " + error.message });
  }
};

// Update item status
export const updateItemStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedItem = await LostFoundItem.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to update item status" });
  }
};

// Delete item
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await LostFoundItem.findById(id);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    if (item.imageUrl) {
      const publicId = item.imageUrl.split("/").pop().split(".")[0];
      await deleteFromCloudinary(publicId);
    }

    await item.deleteOne();
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete item" });
  }
};

// Bulk delete items
export const bulkDeleteItems = async (req, res) => {
  try {
    const { itemIds } = req.body;

    // Delete images from Cloudinary
    const items = await LostFoundItem.find({ _id: { $in: itemIds } });
    for (const item of items) {
      if (item.imageUrl) {
        const publicId = item.imageUrl.split("/").pop().split(".")[0];
        await deleteFromCloudinary(publicId);
      }
    }

    await LostFoundItem.deleteMany({ _id: { $in: itemIds } });
    res.status(200).json({ message: "Items deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete items" });
  }
};
