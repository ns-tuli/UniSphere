import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Search,
  RefreshCw,
  Book,
  Clock,
  User,
  Calendar,
  MapPin,
  Award,
  List,
  BookOpen,
  FileText,
  GraduationCap,
} from "lucide-react";
import axios from "axios";

const ClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [activeCard, setActiveCard] = useState("view"); // view, add, edit, delete

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentClassId, setCurrentClassId] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [formData, setFormData] = useState({
    department: "",
    courseCode: "",
    name: "",
    description: "",
    credits: "",
    days: [],
    time: "",
    location: "",
    professor: "",
    email: "",
    officeHours: "",
    officeLocation: "",
    learningOutcomes: [""],
    materials: [""],
    textbooks: [
      {
        title: "",
        author: "",
        isbn: "",
        required: true,
      },
    ],
    assignments: [
      {
        name: "",
        dueDate: null,
        points: "",
        status: "upcoming",
      },
    ],
    gradeBreakdown: {
      assignments: "30",
      midterm: "30",
      final: "40",
    },
  });

  // Days of week for selection
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // Notification state
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchClasses();
    fetchDepartments();
  }, []);

  // Filter classes based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredClasses(classes);
    } else {
      const filtered = classes.filter(
        (cls) =>
          cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cls.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cls.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredClasses(filtered);
    }
  }, [searchQuery, classes]);

  // API calls
  const fetchClasses = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/class");
      setClasses(response.data);
      setFilteredClasses(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch classes. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/department");
      setDepartments(response.data);
    } catch (err) {
      showNotification("Failed to fetch departments", "error");
    }
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDaysChange = (day) => {
    setFormData((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }));
  };

  // Array field handlers
  const handleArrayFieldChange = (field, index, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayField = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayField = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  // Form actions
  const openCreateForm = () => {
    // Reset form data
    setFormData({
      department: "",
      courseCode: "",
      name: "",
      description: "",
      credits: "",
      days: [],
      time: "",
      location: "",
      professor: "",
      email: "",
      officeHours: "",
      officeLocation: "",
      learningOutcomes: [""],
      materials: [""],
      textbooks: [
        {
          title: "",
          author: "",
          isbn: "",
          required: true,
        },
      ],
      assignments: [
        {
          name: "",
          dueDate: null,
          points: "",
          status: "upcoming",
        },
      ],
      gradeBreakdown: {
        assignments: "30",
        midterm: "30",
        final: "40",
      },
    });
    setIsEditing(false);
    setIsFormOpen(true);
    setActiveCard("add");
  };

  const openEditForm = async (classId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/class/${classId}`
      );
      setFormData(response.data);
      setCurrentClassId(classId);
      setIsFormOpen(true);
      setIsEditing(true);
      setActiveCard("edit");
    } catch (err) {
      showNotification("Failed to load class details", "error");
    } finally {
      setLoading(false);
    }
  };

  const openDeleteConfirmation = (classItem) => {
    setSelectedClass(classItem);
    setActiveCard("delete");
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setActiveCard("view");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        await axios.put(
          `http://localhost:5000/api/class/${currentClassId}`,
          formData
        );
        showNotification("Class updated successfully!", "success");
      } else {
        await axios.post("http://localhost:5000/api/class", formData);
        showNotification("New class added successfully!", "success");
      }
      fetchClasses();
      closeForm();
    } catch (err) {
      showNotification(
        isEditing ? "Failed to update class" : "Failed to add class",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (classId) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/class/${classId}`);
      showNotification("Class deleted successfully!", "success");
      fetchClasses();
      setActiveCard("view");
    } catch (err) {
      showNotification("Failed to delete class", "error");
    } finally {
      setLoading(false);
    }
  };

  // Notification handler
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400 mb-2">
              Course Management
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl">
              Manage university courses, schedules, and academic content
            </p>
          </div>

          {/* Search */}
          <div className="mt-4 md:mt-0 w-full md:w-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search courses, professors..."
                className="block w-full md:w-64 pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification.show && (
        <div className="max-w-6xl mx-auto mb-6">
          <div
            className={`p-4 rounded-lg flex items-start ${
              notification.type === "error"
                ? "bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800"
                : "bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800"
            }`}
          >
            {notification.type === "error" ? (
              <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
            )}
            <span
              className={
                notification.type === "error"
                  ? "text-red-700 dark:text-red-300"
                  : "text-green-700 dark:text-green-300"
              }
            >
              {notification.message}
            </span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* View Classes Card */}
          <div
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition duration-300 ${
              activeCard === "view"
                ? "ring-2 ring-indigo-500 scale-100"
                : "scale-95 hover:scale-100"
            }`}
            onClick={() => setActiveCard("view")}
          >
            <div className="p-5 bg-gradient-to-r from-indigo-500 to-purple-600">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">View Courses</h3>
                <Book className="w-10 h-10 text-white opacity-90" />
              </div>
            </div>
            <div className="p-5">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Browse and monitor all courses and their details
              </p>
              <button
                onClick={() => setActiveCard("view")}
                className="w-full bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-medium px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
              >
                <List className="w-4 h-4 mr-2" />
                View Courses
              </button>
            </div>
          </div>

          {/* Add Class Card */}
          <div
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition duration-300 ${
              activeCard === "add"
                ? "ring-2 ring-emerald-500 scale-100"
                : "scale-95 hover:scale-100"
            }`}
            onClick={openCreateForm}
          >
            <div className="p-5 bg-gradient-to-r from-emerald-500 to-teal-600">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Add Course</h3>
                <Plus className="w-10 h-10 text-white opacity-90" />
              </div>
            </div>
            <div className="p-5">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Create new courses with complete academic information
              </p>
              <button
                onClick={openCreateForm}
                className="w-full bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-medium px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Course
              </button>
            </div>
          </div>

          {/* Edit Class Card */}
          <div
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition duration-300 ${
              activeCard === "edit"
                ? "ring-2 ring-amber-500 scale-100"
                : "scale-95 hover:scale-100"
            }`}
          >
            <div className="p-5 bg-gradient-to-r from-amber-500 to-orange-600">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Edit Courses</h3>
                <Edit className="w-10 h-10 text-white opacity-90" />
              </div>
            </div>
            <div className="p-5">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Update and modify existing course information
              </p>
              <button
                onClick={() => setActiveCard("edit")}
                className="w-full bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/20 dark:hover:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-medium px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
              >
                <Edit className="w-4 h-4 mr-2" />
                Select to Edit
              </button>
            </div>
          </div>

          {/* Delete Class Card */}
          <div
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition duration-300 ${
              activeCard === "delete"
                ? "ring-2 ring-rose-500 scale-100"
                : "scale-95 hover:scale-100"
            }`}
          >
            <div className="p-5 bg-gradient-to-r from-rose-500 to-red-600">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Delete Courses</h3>
                <Trash2 className="w-10 h-10 text-white opacity-90" />
              </div>
            </div>
            <div className="p-5">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Remove courses from the academic system
              </p>
              <button
                onClick={() => setActiveCard("delete")}
                className="w-full bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/20 dark:hover:bg-rose-900/30 text-rose-700 dark:text-rose-400 font-medium px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Select to Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of the component implementation */}
      {/* Content Based on Active Card */}
      <div className="max-w-6xl mx-auto">
        {/* Loading State */}
        {loading && !isFormOpen && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-4 rounded-lg text-red-700 dark:text-red-300 mb-6">
            <p className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </p>
          </div>
        )}

        {/* View Classes */}
        {activeCard === "view" && !loading && !error && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                All Courses
              </h3>
              <button
                onClick={fetchClasses}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Refresh
              </button>
            </div>

            {filteredClasses.length === 0 ? (
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                  <Book className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  {searchQuery
                    ? "No courses found matching your search."
                    : "No courses found."}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-indigo-600 dark:text-indigo-400 underline"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <div className="grid gap-4 p-6">
                {filteredClasses.map((cls) => (
                  <div
                    key={cls._id}
                    className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                            {cls.courseCode}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {cls.department}
                          </span>
                        </div>

                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {cls.name}
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <User className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>{cls.professor}</span>
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>{cls.days.join(", ")}</span>
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>{cls.time}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex mt-4 md:mt-0 space-x-2">
                        <button
                          onClick={() => openEditForm(cls._id)}
                          className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => openDeleteConfirmation(cls)}
                          className="text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 bg-rose-50 dark:bg-rose-900/20 p-2 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Edit Selection View */}
        {activeCard === "edit" && !isFormOpen && !loading && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Select Course to Edit
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Choose a course from the list below to modify its details
              </p>
            </div>

            {filteredClasses.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  No courses available to edit.
                </p>
              </div>
            ) : (
              <div className="grid gap-2 p-6">
                {filteredClasses.map((cls) => (
                  <button
                    key={cls._id}
                    onClick={() => openEditForm(cls._id)}
                    className="text-left bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 border border-amber-200 dark:border-amber-800/30 rounded-lg p-4 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div className="bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 p-3 rounded-lg mr-4">
                        <Book className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {cls.name}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {cls.courseCode} • {cls.department}
                        </p>
                      </div>
                    </div>
                    <Edit className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Delete Selection View */}
        {activeCard === "delete" && !selectedClass && !loading && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Select Course to Delete
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Choose a course from the list below to remove it from the system
              </p>
            </div>

            {filteredClasses.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  No courses available to delete.
                </p>
              </div>
            ) : (
              <div className="grid gap-2 p-6">
                {filteredClasses.map((cls) => (
                  <button
                    key={cls._id}
                    onClick={() => openDeleteConfirmation(cls)}
                    className="text-left bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/30 border border-rose-200 dark:border-rose-800/30 rounded-lg p-4 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div className="bg-rose-200 dark:bg-rose-800 text-rose-800 dark:text-rose-200 p-3 rounded-lg mr-4">
                        <Book className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {cls.name}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {cls.courseCode} • {cls.department}
                        </p>
                      </div>
                    </div>
                    <Trash2 className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Delete Confirmation */}
        {activeCard === "delete" && selectedClass && !loading && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Confirm Deletion
              </h3>
            </div>
            <div className="p-6">
              <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-lg mb-6 border border-rose-200 dark:border-rose-800/30">
                <div className="flex items-center mb-4">
                  <AlertCircle className="w-6 h-6 text-rose-600 dark:text-rose-400 mr-2" />
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Are you sure?
                  </h4>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  You are about to delete the following course. This action
                  cannot be undone.
                </p>
                <div className="bg-white dark:bg-gray-700 rounded-lg p-4 mb-4">
                  <p className="font-medium text-gray-900 dark:text-white mb-1">
                    {selectedClass.name}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {selectedClass.courseCode} • {selectedClass.department}
                  </p>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setSelectedClass(null);
                    setActiveCard("view");
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(selectedClass._id)}
                  className="px-4 py-2 text-white bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600 rounded-lg transition-colors flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Course
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Class Form (Add/Edit) */}
        {isFormOpen && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {isEditing ? "Edit Course" : "Add New Course"}
              </h3>
              <button
                onClick={closeForm}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Book className="w-5 h-5" />
                    Basic Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Department *
                      </label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                          <option key={dept._id} value={dept.name}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Course Code *
                      </label>
                      <input
                        type="text"
                        name="courseCode"
                        value={formData.courseCode}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="e.g. CS101"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Course Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="e.g. Introduction to Computer Science"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="Course description..."
                      />
                    </div>
                  </div>
                </div>

                {/* Schedule Information */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Schedule Information
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Class Days *
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {daysOfWeek.map((day) => (
                          <button
                            key={day}
                            type="button"
                            onClick={() => handleDaysChange(day)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                              formData.days.includes(day)
                                ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Time *
                        </label>
                        <input
                          type="text"
                          name="time"
                          value={formData.time}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          placeholder="e.g. 9:00 AM - 10:20 AM"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Location *
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          placeholder="e.g. Room 101"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Learning Outcomes */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Learning Outcomes
                  </h4>
                  <div className="space-y-2">
                    {formData.learningOutcomes.map((outcome, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={outcome}
                          onChange={(e) =>
                            handleArrayFieldChange(
                              "learningOutcomes",
                              index,
                              e.target.value
                            )
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          placeholder={`Learning outcome ${index + 1}`}
                        />
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() =>
                              removeArrayField("learningOutcomes", index)
                            }
                            className="p-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayField("learningOutcomes")}
                      className="text-indigo-600 dark:text-indigo-400 text-sm flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Add Learning Outcome
                    </button>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center ${
                      isEditing
                        ? "bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600"
                        : "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600"
                    } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    ) : isEditing ? (
                      <Save className="w-4 h-4 mr-2" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    {isEditing ? "Update Course" : "Add Course"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassManagement;
