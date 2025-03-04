import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const TestAuth = () => {
  const { login, register, logout, user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    studentId: "",
    department: "",
  });
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      setMessage("Registration successful!");
    } catch (error) {
      setMessage(error.message || "Registration failed");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      setMessage("Login successful!");
    } catch (error) {
      setMessage(error.message || "Login failed");
    }
  };

  const handleLogout = () => {
    logout();
    setMessage("Logged out successfully!");
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Auth Test Component</h2>

      {/* Current User Status */}
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <h3 className="font-bold">Current User:</h3>
        <pre>{user ? JSON.stringify(user, null, 2) : "No user logged in"}</pre>
      </div>

      {/* Message Display */}
      {message && (
        <div className="mb-4 p-2 bg-blue-100 text-blue-700 rounded">
          {message}
        </div>
      )}

      {/* Form */}
      <form className="space-y-4 max-w-md">
        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 border rounded"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Student ID"
          className="w-full p-2 border rounded"
          onChange={(e) =>
            setFormData({ ...formData, studentId: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Department"
          className="w-full p-2 border rounded"
          onChange={(e) =>
            setFormData({ ...formData, department: e.target.value })
          }
        />

        {/* Action Buttons */}
        <div className="space-x-4">
          <button
            onClick={handleRegister}
            className="bg-green-500 text-white px-4 py-2 rounded"
            type="button"
          >
            Register
          </button>
          <button
            onClick={handleLogin}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            type="button"
          >
            Login
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
            type="button"
          >
            Logout
          </button>
        </div>
      </form>
    </div>
  );
};

export default TestAuth;
