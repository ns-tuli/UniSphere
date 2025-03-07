import express from "express";
import Todo from "../models/Todo.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Get all todos for a user
router.get("/", verifyToken, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user.id });
    res.json(todos);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching todos", error: error.message });
  }
});

// Create a new todo
router.post("/", verifyToken, async (req, res) => {
  try {
    const newTodo = new Todo({
      ...req.body,
      userId: req.user.id,
    });
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating todo", error: error.message });
  }
});

// Update a todo
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedTodo);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating todo", error: error.message });
  }
});

// Delete a todo
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting todo", error: error.message });
  }
});

// Get todos by date range
router.get("/range", verifyToken, async (req, res) => {
  try {
    const { start, end } = req.query;
    const todos = await Todo.find({
      userId: req.user.id,
      due: {
        $gte: new Date(start),
        $lte: new Date(end),
      },
    });
    res.json(todos);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching todos", error: error.message });
  }
});

export default router;
