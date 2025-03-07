import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FaCalendarAlt,
  FaCheckSquare,
  FaClock,
  FaBell,
  FaBook,
  FaExclamationTriangle,
  FaFilter,
  FaSearch,
  FaPlus,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import { getClasses } from "../api/class";
import { toast } from "react-toastify";

export default function ClassRoutine() {
  const { day } = useParams();
  const navigate = useNavigate();

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Get current day
  function getCurrentDay() {
    const dayIndex = new Date().getDay();
    // Convert from 0-6 (Sunday-Saturday) to our format (Monday-Sunday)
    return days[dayIndex === 0 ? 6 : dayIndex - 1];
  }

  const [activeDay, setActiveDay] = useState(day || getCurrentDay());
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({
    title: "",
    due: "",
    type: "assignment",
  });
  const [showAddTodo, setShowAddTodo] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch classes from API
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const data = await getClasses();
        setClasses(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching classes:", error);
        toast.error("Failed to load class schedule");
        setLoading(false);
      }
    };

    fetchClasses();

    // Load todos from localStorage
    const savedTodos = localStorage.getItem("classTodos");
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    } else {
      // Sample todos for demonstration
      const sampleTodos = [
        {
          id: 1,
          title: "Algorithm Assignment",
          due: "2024-03-15",
          type: "assignment",
          completed: false,
          course: "Computer Science 101",
        },
        {
          id: 2,
          title: "Midterm Exam",
          due: "2024-03-20",
          type: "exam",
          completed: false,
          course: "Mathematics",
        },
        {
          id: 3,
          title: "Group Project Submission",
          due: "2024-03-25",
          type: "assignment",
          completed: false,
          course: "Physics Lab",
        },
      ];
      setTodos(sampleTodos);
      localStorage.setItem("classTodos", JSON.stringify(sampleTodos));
    }

    // Set up reminder check
    const checkReminders = setInterval(() => {
      checkForUpcomingDeadlines();
    }, 60000); // Check every minute

    return () => clearInterval(checkReminders);
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("classTodos", JSON.stringify(todos));
  }, [todos]);

  // Update URL when active day changes
  useEffect(() => {
    navigate(`/ClassRoutine/${activeDay}`);
  }, [activeDay, navigate]);

  // Check for upcoming deadlines and show reminders
  const checkForUpcomingDeadlines = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    todos.forEach((todo) => {
      if (todo.completed) return;

      const dueDate = new Date(todo.due);
      const timeDiff = dueDate.getTime() - now.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (daysDiff <= 1 && daysDiff >= 0) {
        const timeString = daysDiff === 0 ? "today" : "tomorrow";
        toast.info(`Reminder: "${todo.title}" is due ${timeString}!`, {
          autoClose: 5000,
          icon: todo.type === "exam" ? <FaExclamationTriangle /> : <FaBook />,
        });
      }
    });
  };

  // Filter classes for the selected day
  const filteredClasses = classes
    .filter((cls) => cls.days && cls.days.includes(activeDay))
    .sort((a, b) => {
      // Sort by time (assuming time is in format "HH:MM AM/PM")
      const timeA = new Date(`01/01/2023 ${a.time}`);
      const timeB = new Date(`01/01/2023 ${b.time}`);
      return timeA - timeB;
    });

  // Filter todos based on selected filter and search term
  const filteredTodos = todos
    .filter((todo) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "completed" && todo.completed) ||
        (filter === "pending" && !todo.completed) ||
        (filter === "exams" && todo.type === "exam") ||
        (filter === "assignments" && todo.type === "assignment");

      const matchesSearch =
        todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (todo.course &&
          todo.course.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      // Sort by due date (closest first)
      return new Date(a.due) - new Date(b.due);
    });

  // Handle adding a new todo
  const handleAddTodo = () => {
    if (!newTodo.title || !newTodo.due) {
      toast.error("Please fill in all required fields");
      return;
    }

    const todo = {
      id: Date.now(),
      ...newTodo,
      completed: false,
    };

    setTodos([...todos, todo]);
    setNewTodo({ title: "", due: "", type: "assignment", course: "" });
    setShowAddTodo(false);
    toast.success("Todo added successfully");
  };

  // Toggle todo completion status
  const toggleTodoStatus = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Delete a todo
  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    toast.success("Todo removed successfully");
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate if a todo is due soon (within 2 days)
  const isDueSoon = (dateString) => {
    const now = new Date();
    const dueDate = new Date(dateString);
    const timeDiff = dueDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff <= 2 && daysDiff >= 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
            Class Routine
          </h1>

          <div className="flex space-x-2">
            <button
              onClick={() => setShowAddTodo(!showAddTodo)}
              className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              <FaPlus className="mr-2" />
              Add Todo
            </button>
          </div>
        </div>

        {/* Day selector */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 min-w-max">
            {days.map((d) => (
              <button
                key={d}
                onClick={() => setActiveDay(d)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeDay === d
                    ? "bg-teal-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Add Todo Form */}
        {showAddTodo && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6 animate-fadeIn">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Add New Todo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newTodo.title}
                  onChange={(e) =>
                    setNewTodo({ ...newTodo, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter todo title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newTodo.due}
                  onChange={(e) =>
                    setNewTodo({ ...newTodo, due: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type
                </label>
                <select
                  value={newTodo.type}
                  onChange={(e) =>
                    setNewTodo({ ...newTodo, type: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="assignment">Assignment</option>
                  <option value="exam">Exam</option>
                  <option value="project">Project</option>
                  <option value="reading">Reading</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Course (Optional)
                </label>
                <input
                  type="text"
                  value={newTodo.course || ""}
                  onChange={(e) =>
                    setNewTodo({ ...newTodo, course: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter course name"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddTodo(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTodo}
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
              >
                Add Todo
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Class Schedule */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <FaCalendarAlt className="text-teal-600 mr-2 text-xl" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {activeDay}'s Schedule
                  </h2>
                </div>

                {loading ? (
                  <div className="py-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">
                      Loading your schedule...
                    </p>
                  </div>
                ) : filteredClasses.length > 0 ? (
                  <div className="space-y-6">
                    {filteredClasses.map((cls, index) => (
                      <div
                        key={cls._id || index}
                        className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 transition-all hover:shadow-md"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <FaClock className="mr-2 text-teal-600" />
                            <span className="font-medium">{cls.time}</span>
                          </div>
                          <span className="px-2 py-1 text-xs bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200 rounded-full">
                            {cls.credits} Credits
                          </span>
                        </div>

                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                          {cls.name}
                          {cls.courseCode && (
                            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                              ({cls.courseCode})
                            </span>
                          )}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                          <div className="flex items-start">
                            <div className="bg-gray-200 dark:bg-gray-600 rounded-full p-1 mr-2 mt-0.5">
                              <svg
                                className="w-4 h-4 text-gray-600 dark:text-gray-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                ></path>
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                ></path>
                              </svg>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {cls.location}
                            </span>
                          </div>

                          <div className="flex items-start">
                            <div className="bg-gray-200 dark:bg-gray-600 rounded-full p-1 mr-2 mt-0.5">
                              <svg
                                className="w-4 h-4 text-gray-600 dark:text-gray-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                ></path>
                              </svg>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {cls.professor}
                            </span>
                          </div>
                        </div>

                        {cls.description && (
                          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {cls.description}
                          </p>
                        )}

                        {cls.assignments && cls.assignments.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Upcoming for this class:
                            </h4>
                            <div className="space-y-2">
                              {cls.assignments
                                .slice(0, 2)
                                .map((assignment, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-between text-xs"
                                  >
                                    <span className="text-gray-600 dark:text-gray-400">
                                      {assignment.name}
                                    </span>
                                    <span
                                      className={`px-2 py-0.5 rounded ${
                                        new Date(assignment.dueDate) <
                                        new Date()
                                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                      }`}
                                    >
                                      Due: {formatDate(assignment.dueDate)}
                                    </span>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                      No Classes Scheduled
                    </h3>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">
                      You don't have any classes scheduled for {activeDay}.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* To-dos */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <FaCheckSquare className="text-teal-600 mr-2 text-xl" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      To-dos
                    </h2>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white w-full"
                      />
                    </div>
                    <div className="relative">
                      <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="pl-8 pr-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white appearance-none"
                      >
                        <option value="all">All</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="exams">Exams</option>
                        <option value="assignments">Assignments</option>
                      </select>
                      <FaFilter className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                  {filteredTodos.length > 0 ? (
                    filteredTodos.map((todo) => (
                      <div
                        key={todo.id}
                        className={`p-3 rounded-lg transition-all ${
                          todo.completed
                            ? "bg-gray-100 dark:bg-gray-700 opacity-75"
                            : isDueSoon(todo.due)
                            ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
                            : "bg-gray-50 dark:bg-gray-700"
                        }`}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 pt-0.5">
                            <input
                              type="checkbox"
                              checked={todo.completed}
                              onChange={() => toggleTodoStatus(todo.id)}
                              className="h-5 w-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                            />
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="flex items-center justify-between">
                              <p
                                className={`text-sm font-medium ${
                                  todo.completed
                                    ? "text-gray-500 dark:text-gray-400 line-through"
                                    : "text-gray-900 dark:text-white"
                                }`}
                              >
                                {todo.title}
                              </p>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => deleteTodo(todo.id)}
                                  className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                  <FaTrash size={14} />
                                </button>
                              </div>
                            </div>

                            {todo.course && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {todo.course}
                              </p>
                            )}

                            <div className="flex items-center justify-between mt-2">
                              <span
                                className={`px-2 py-1 text-xs rounded ${
                                  todo.type === "exam"
                                    ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200"
                                    : todo.type === "project"
                                    ? "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200"
                                    : todo.type === "reading"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200"
                                    : "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200"
                                }`}
                              >
                                {todo.type.charAt(0).toUpperCase() +
                                  todo.type.slice(1)}
                              </span>

                              <span
                                className={`text-xs ${
                                  isDueSoon(todo.due) && !todo.completed
                                    ? "text-red-600 dark:text-red-400 font-medium"
                                    : "text-gray-500 dark:text-gray-400"
                                }`}
                              >
                                Due: {formatDate(todo.due)}
                                {isDueSoon(todo.due) && !todo.completed && (
                                  <FaBell className="inline-block ml-1 text-yellow-500" />
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                        />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                        No todos found
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {searchTerm
                          ? "No todos match your search criteria."
                          : "Get started by creating a new todo."}
                      </p>
                      <div className="mt-6">
                        <button
                          onClick={() => setShowAddTodo(true)}
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                        >
                          <FaPlus className="-ml-1 mr-2 h-5 w-5" />
                          New Todo
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
