import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  FaSearch,
  FaUserMinus,
  FaUserCog,
  FaTrash,
  FaUserCircle,
} from "react-icons/fa";
import { motion } from "framer-motion";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/admin/users`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setUsers(response.data);
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleAdminStatus = async (userId, makeAdmin) => {
    try {
      const endpoint = makeAdmin ? "make-admin" : "remove-admin";
      await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/admin/${endpoint}/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      fetchUsers();
      setError("");
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to update admin status"
      );
    }
  };

  const removeUser = async (userId) => {
    if (!window.confirm("Are you sure you want to remove this user?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/api/admin/users/${userId}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      fetchUsers();
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to remove user");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.studentId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-yellow-600 p-6">
            <h1 className="text-2xl font-bold text-white">User Management</h1>
            <p className="text-yellow-100 mt-1">
              Manage system users and their roles
            </p>
          </div>

          {/* Search and Stats */}
          <div className="p-6 border-b dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name, email, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="flex gap-4">
                <div className="px-4 py-2 bg-green-100 dark:bg-green-800 rounded-lg">
                  <span className="text-sm text-green-800 dark:text-green-100">
                    Total Users: {users.length}
                  </span>
                </div>
                <div className="px-4 py-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                  <span className="text-sm text-blue-800 dark:text-blue-100">
                    Admins: {users.filter((u) => u.role === "admin").length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
              <p>{error}</p>
            </div>
          )}

          {/* User List */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.map((userData) => (
                  <motion.tr
                    key={userData._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-yellow-500 flex items-center justify-center">
                            <FaUserCircle className="text-white text-xl" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {userData.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {userData.studentId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {userData.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {userData.department}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          userData.role === "admin"
                            ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-100"
                        }`}
                      >
                        {userData.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            toggleAdminStatus(
                              userData._id,
                              userData.role !== "admin"
                            )
                          }
                          className={`inline-flex items-center px-3 py-1 rounded-md text-sm transition-colors ${
                            userData.role === "admin"
                              ? "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900"
                              : "text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900"
                          }`}
                        >
                          {userData.role === "admin" ? (
                            <>
                              <FaUserMinus className="mr-1" />
                              Remove Admin
                            </>
                          ) : (
                            <>
                              <FaUserCog className="mr-1" />
                              Make Admin
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => removeUser(userData._id)}
                          className="inline-flex items-center px-3 py-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900 rounded-md transition-colors"
                        >
                          <FaTrash className="mr-1" />
                          Remove
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserManagement;
