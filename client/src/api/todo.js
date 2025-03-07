import axios from "axios";

const API_URL = "http://localhost:5000/api/todo";

// Get all todos
export const getTodos = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching todos: " + error.message);
  }
};

// Get todos by date range
export const getTodosByRange = async (start, end) => {
  try {
    const response = await axios.get(`${API_URL}/range`, {
      params: { start, end },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error fetching todos: " + error.message);
  }
};

// Create a new todo
export const createTodo = async (todoData) => {
  try {
    const response = await axios.post(API_URL, todoData);
    return response.data;
  } catch (error) {
    throw new Error("Error creating todo: " + error.message);
  }
};

// Update a todo
export const updateTodo = async (id, todoData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, todoData);
    return response.data;
  } catch (error) {
    throw new Error("Error updating todo: " + error.message);
  }
};

// Delete a todo
export const deleteTodo = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Error deleting todo: " + error.message);
  }
};
