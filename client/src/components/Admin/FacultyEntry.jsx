import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import {
  getFaculty,
  getFacultyById,
  addFaculty,
  updateFaculty,
  deleteFaculty,
} from "../../api/faculty";
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
  User,
  Briefcase,
  BookOpen,
  Linkedin,
  Award,
  Clock,
  MapPin,
  List, // Add this import
} from "lucide-react";

const FacultyEntry = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFaculty, setFilteredFaculty] = useState([]);
  const [activeCard, setActiveCard] = useState("view"); // view, add, edit, delete

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentFacultyId, setCurrentFacultyId] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    position: "",
    email: "",
    phone: "",
    officeHours: "",
    office: "",
    education: "",
    expertise: [""],
    linkedin: "",
    googleScholar: "",
    available: true,
  });

  // Notification state
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  // Fetch all faculty on component mount
  useEffect(() => {
    fetchFacultyList();
  }, []);

  // Filter faculty based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFaculty(facultyList);
    } else {
      const filtered = facultyList.filter(
        (faculty) =>
          faculty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faculty.department
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          faculty.position.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFaculty(filtered);
    }
  }, [searchQuery, facultyList]);

  // Fetch all faculty
  const fetchFacultyList = async () => {
    setLoading(true);
    try {
      const data = await getFaculty();
      setFacultyList(data);
      setFilteredFaculty(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch faculty list. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle expertise changes
  const handleExpertiseChange = (index, value) => {
    const updatedExpertise = [...formData.expertise];
    updatedExpertise[index] = value;
    setFormData({ ...formData, expertise: updatedExpertise });
  };

  // Add new expertise field
  const addExpertiseField = () => {
    setFormData({ ...formData, expertise: [...formData.expertise, ""] });
  };

  // Remove expertise field
  const removeExpertiseField = (index) => {
    const updatedExpertise = formData.expertise.filter((_, i) => i !== index);
    setFormData({ ...formData, expertise: updatedExpertise });
  };

  // Open form for creating new faculty
  const openCreateForm = () => {
    setFormData({
      name: "",
      department: "",
      position: "",
      email: "",
      phone: "",
      officeHours: "",
      office: "",
      education: "",
      expertise: [""],
      linkedin: "",
      googleScholar: "",
      available: true,
    });
    setIsEditing(false);
    setCurrentFacultyId(null);
    setIsFormOpen(true);
    setActiveCard("add");
  };

  // Open form for editing faculty
  const openEditForm = async (facultyId) => {
    setLoading(true);
    try {
      const facultyData = await getFacultyById(facultyId);
      setFormData({
        name: facultyData.name || "",
        department: facultyData.department || "",
        position: facultyData.position || "",
        email: facultyData.email || "",
        phone: facultyData.phone || "",
        officeHours: facultyData.officeHours || "",
        office: facultyData.office || "",
        education: facultyData.education || "",
        expertise: facultyData.expertise.length ? facultyData.expertise : [""],
        linkedin: facultyData.linkedin || "",
        googleScholar: facultyData.googleScholar || "",
        available: facultyData.available || true,
      });
      setIsEditing(true);
      setCurrentFacultyId(facultyId);
      setIsFormOpen(true);
      setActiveCard("edit");
    } catch (err) {
      showNotification(
        "Failed to load faculty details. Please try again.",
        "error"
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Open delete confirmation
  const openDeleteConfirmation = (faculty) => {
    setSelectedFaculty(faculty);
    setActiveCard("delete");
  };

  // Close form
  const closeForm = () => {
    setIsFormOpen(false);
    setActiveCard("view");
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate form data
    if (!formData.name || !formData.department || !formData.position) {
      showNotification("Please fill in all required fields.", "error");
      setLoading(false);
      return;
    }

    // Filter out empty expertise
    const cleanedFormData = {
      ...formData,
      expertise: formData.expertise.filter(
        (expertise) => expertise.trim() !== ""
      ),
    };

    try {
      if (isEditing) {
        await updateFaculty(currentFacultyId, cleanedFormData);
        showNotification("Faculty updated successfully!", "success");
      } else {
        await addFaculty(cleanedFormData);
        showNotification("New faculty added successfully!", "success");
      }
      fetchFacultyList();
      closeForm();
    } catch (err) {
      showNotification(
        isEditing
          ? "Failed to update faculty. Please try again."
          : "Failed to add faculty. Please try again.",
        "error"
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete faculty
  const handleDelete = async (facultyId) => {
    setLoading(true);
    try {
      await deleteFaculty(facultyId);
      showNotification("Faculty deleted successfully!", "success");
      fetchFacultyList();
      setActiveCard("view");
    } catch (err) {
      showNotification("Failed to delete faculty. Please try again.", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Show notification
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    // Auto-hide notification after 5 seconds
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
              Faculty Management
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl">
              Streamlined faculty management system for efficient campus
              administration
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
                placeholder="Search faculty, departments, positions..."
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
          {/* Card 1: View Faculty */}
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
                <h3 className="text-xl font-bold text-white">View Faculty</h3>
                <User className="w-10 h-10 text-white opacity-90" />
              </div>
            </div>
            <div className="p-5">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Browse and monitor all faculty members and their details
              </p>
              <button
                onClick={() => setActiveCard("view")}
                className="w-full bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-medium px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
              >
                <List className="w-4 h-4 mr-2" />
                View Faculty
              </button>
            </div>
          </div>

          {/* Card 2: Add Faculty */}
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
                <h3 className="text-xl font-bold text-white">Add Faculty</h3>
                <Plus className="w-10 h-10 text-white opacity-90" />
              </div>
            </div>
            <div className="p-5">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Add new faculty members with their details and expertise
              </p>
              <button
                onClick={openCreateForm}
                className="w-full bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-medium px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Faculty
              </button>
            </div>
          </div>

          {/* Card 3: Edit Faculty */}
          <div
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition duration-300 ${
              activeCard === "edit"
                ? "ring-2 ring-amber-500 scale-100"
                : "scale-95 hover:scale-100"
            }`}
          >
            <div className="p-5 bg-gradient-to-r from-amber-500 to-orange-600">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Edit Faculty</h3>
                <Edit className="w-10 h-10 text-white opacity-90" />
              </div>
            </div>
            <div className="p-5">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Update and modify existing faculty details and information
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

          {/* Card 4: Delete Faculty */}
          <div
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition duration-300 ${
              activeCard === "delete"
                ? "ring-2 ring-rose-500 scale-100"
                : "scale-95 hover:scale-100"
            }`}
          >
            <div className="p-5 bg-gradient-to-r from-rose-500 to-red-600">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Delete Faculty</h3>
                <Trash2 className="w-10 h-10 text-white opacity-90" />
              </div>
            </div>
            <div className="p-5">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Remove faculty members from the system
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

        {/* View Faculty */}
        {activeCard === "view" && !loading && !error && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                All Faculty Members
              </h3>
              <button
                onClick={fetchFacultyList}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Refresh
              </button>
            </div>

            {/* No results */}
            {filteredFaculty.length === 0 && (
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                  <User className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  {searchQuery
                    ? "No faculty found matching your search."
                    : "No faculty members found."}
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
            )}

            {/* Faculty list */}
            {filteredFaculty.length > 0 && (
              <div className="grid gap-4 p-6">
                {filteredFaculty.map((faculty) => (
                  <div
                    key={faculty._id}
                    className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                            #{faculty._id}
                          </span>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {faculty.name}
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <Briefcase className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>{faculty.position}</span>
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <BookOpen className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>{faculty.department}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 flex-shrink-0 text-gray-500 dark:text-gray-500" />
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                faculty.available
                                  ? "text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400"
                                  : "text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400"
                              }`}
                            >
                              {faculty.available ? "Available" : "Unavailable"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex mt-4 md:mt-0 space-x-2">
                        <button
                          onClick={() => openEditForm(faculty._id)}
                          className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => openDeleteConfirmation(faculty)}
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
                Select Faculty to Edit
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Choose a faculty member from the list below to modify their
                details
              </p>
            </div>

            {filteredFaculty.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  No faculty members available to edit.
                </p>
              </div>
            ) : (
              <div className="grid gap-2 p-6">
                {filteredFaculty.map((faculty) => (
                  <button
                    key={faculty._id}
                    onClick={() => openEditForm(faculty._id)}
                    className="text-left bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 border border-amber-200 dark:border-amber-800/30 rounded-lg p-4 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div className="bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 p-3 rounded-lg mr-4">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {faculty.name}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {faculty.position} • {faculty.department}
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
        {activeCard === "delete" && !selectedFaculty && !loading && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Select Faculty to Delete
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Choose a faculty member from the list below to remove them from
                the system
              </p>
            </div>

            {filteredFaculty.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  No faculty members available to delete.
                </p>
              </div>
            ) : (
              <div className="grid gap-2 p-6">
                {filteredFaculty.map((faculty) => (
                  <button
                    key={faculty._id}
                    onClick={() => openDeleteConfirmation(faculty)}
                    className="text-left bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/30 border border-rose-200 dark:border-rose-800/30 rounded-lg p-4 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div className="bg-rose-200 dark:bg-rose-800 text-rose-800 dark:text-rose-200 p-3 rounded-lg mr-4">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {faculty.name}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {faculty.position} • {faculty.department}
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
        {activeCard === "delete" && selectedFaculty && !loading && (
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
                  You are about to delete the following faculty member. This
                  action cannot be undone.
                </p>
                <div className="bg-white dark:bg-gray-700 rounded-lg p-4 mb-4">
                  <p className="font-medium text-gray-900 dark:text-white mb-1">
                    {selectedFaculty.name}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {selectedFaculty.position} • {selectedFaculty.department}
                  </p>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setSelectedFaculty(null);
                    setActiveCard("view");
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(selectedFaculty._id)}
                  className="px-4 py-2 text-white bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600 rounded-lg transition-colors flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Faculty Member
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Faculty Form (Add/Edit) */}
        {isFormOpen && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {isEditing ? "Edit Faculty Member" : "Add New Faculty Member"}
              </h3>
              <button
                onClick={closeForm}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. John Doe"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Department *
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Department</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Electrical Engineering">
                        Electrical Engineering
                      </option>
                      <option value="Mechanical Engineering">
                        Mechanical Engineering
                      </option>
                      <option value="Business Administration">
                        Business Administration
                      </option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Physics">Physics</option>
                    </select>
                  </div>

                  {/* Position */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Position *
                    </label>
                    <select
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Position</option>
                      <option value="Professor">Professor</option>
                      <option value="Associate Professor">
                        Associate Professor
                      </option>
                      <option value="Assistant Professor">
                        Assistant Professor
                      </option>
                      <option value="Lecturer">Lecturer</option>
                      <option value="Adjunct Faculty">Adjunct Faculty</option>
                      <option value="Head of Department">
                        Head of Department
                      </option>
                    </select>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. john.doe@university.edu"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. +1 (555) 555-5555"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  {/* Office Hours */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Office Hours
                    </label>
                    <input
                      type="text"
                      name="officeHours"
                      value={formData.officeHours}
                      onChange={handleInputChange}
                      placeholder="e.g. Mon-Fri 9am-5pm"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  {/* Office */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Office Location
                    </label>
                    <input
                      type="text"
                      name="office"
                      value={formData.office}
                      onChange={handleInputChange}
                      placeholder="e.g. Building A, Room 101"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  {/* Education */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Education
                    </label>
                    <input
                      type="text"
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      placeholder="e.g. Ph.D. in Computer Science"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  {/* LinkedIn */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      placeholder="e.g. https://linkedin.com/in/johndoe"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  {/* Google Scholar */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Google Scholar Profile
                    </label>
                    <input
                      type="url"
                      name="googleScholar"
                      value={formData.googleScholar}
                      onChange={handleInputChange}
                      placeholder="e.g. https://scholar.google.com/citations?user=12345"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  {/* Availability */}
                  <div>
                    <div className="flex items-center mt-6">
                      <input
                        type="checkbox"
                        id="available"
                        name="available"
                        checked={formData.available}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="available"
                        className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                      >
                        Available
                      </label>
                    </div>
                  </div>
                </div>

                {/* Expertise */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Expertise
                    </label>
                    <button
                      type="button"
                      onClick={addExpertiseField}
                      className="text-indigo-600 dark:text-indigo-400 text-sm flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Expertise
                    </button>
                  </div>

                  <div className="space-y-2">
                    {formData.expertise.map((expertise, index) => (
                      <div
                        key={`expertise-${index}`}
                        className="flex items-center"
                      >
                        <div className="flex-1">
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Award className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              value={expertise}
                              onChange={(e) =>
                                handleExpertiseChange(index, e.target.value)
                              }
                              placeholder={`Expertise #${index + 1}`}
                              className="block w-full pl-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        {formData.expertise.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeExpertiseField(index)}
                            className="ml-2 text-rose-600 dark:text-rose-400 p-2"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
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
                    {isEditing ? "Update Faculty" : "Add Faculty"}
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

export default FacultyEntry;
