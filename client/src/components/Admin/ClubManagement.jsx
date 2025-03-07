// client\src\components\Admin\ClubManagement.jsx

import React, { useState, useEffect } from "react";
import {
    createClub,
    getClubs,
    getClub,
    updateClub,
    deleteClub,
    addMember,
} from "../../api/club.js";
import {
    Plus,
    Edit,
    Trash2,
    Save,
    X,
    CheckCircle,
    AlertCircle,
    Search,
    List,
    Users,
    Image,
} from "lucide-react";

const ClubManagement = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredClubs, setFilteredClubs] = useState([]);
    const [activeCard, setActiveCard] = useState("view"); // view, add, edit, delete
    const [clubs, setClubs] = useState([]);

    // Form states
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentClubId, setCurrentClubId] = useState(null);
    const [selectedClub, setSelectedClub] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        foundedYear: "",
        contactEmail: "",
        socialMedia: {
            website: "",
            facebook: "",
            instagram: "",
            twitter: "",
        },
        logo: "",
        members: [],
        newMemberEmail: "", // For adding new member by email
    });

    // Notification state
    const [notification, setNotification] = useState({
        show: false,
        message: "",
        type: "",
    });

    // Fetch clubs from the API
    const fetchClubs = async () => {
        setLoading(true);
        try {
            const data = await getClubs();
            setClubs(data); // Assuming the response is an array of clubs
            setFilteredClubs(data); // Initially, show all clubs
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClubs();
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle social media input changes
    const handleSocialMediaChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            socialMedia: {
                ...formData.socialMedia,
                [name]: value,
            },
        });
    };

    // Open form for creating a new club
    const openCreateForm = () => {
        setFormData({
            name: "",
            description: "",
            category: "",
            foundedYear: "",
            contactEmail: "",
            socialMedia: {
                website: "",
                facebook: "",
                instagram: "",
                twitter: "",
            },
            logo: "",
            members: [],
            newMemberEmail: "",
        });
        setIsEditing(false);
        setCurrentClubId(null);
        setIsFormOpen(true);
        setActiveCard("add");
    };

    const handleAddMember = async () => {
        if (formData.newMemberEmail) {
            try {
                // Assuming addMember API accepts clubId and new member's email
                const response = await addMember(currentClubId, formData.newMemberEmail);
                showNotification("Member added successfully!", "success");
                fetchClubs(); // Re-fetch the clubs to reflect changes
            } catch (err) {
                showNotification("Failed to add member. Please try again.", "error");
                console.error(err);
            }
        }
    };


    // Open form for editing a club
    const openEditForm = async (clubId) => {
        setLoading(true);
        try {
            const clubData = await getClub(clubId);
            setFormData({
                name: clubData.name || "",
                description: clubData.description || "",
                category: clubData.category || "",
                foundedYear: clubData.foundedYear || "",
                contactEmail: clubData.contactEmail || "",
                socialMedia: clubData.socialMedia || {},
                logo: clubData.logo || "",
                members: clubData.members || [],
                newMemberEmail: "",
            });
            setIsEditing(true);
            setCurrentClubId(clubId);
            setIsFormOpen(true);
            setActiveCard("edit");
        } catch (err) {
            showNotification("Failed to load club details. Please try again.", "error");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Open delete confirmation
    const openDeleteConfirmation = (club) => {
        setSelectedClub(club);
        setActiveCard("delete");
    };

    // Close form
    const closeForm = () => {
        setIsFormOpen(false);
        setActiveCard("view");
    };

    // Submit form (add/edit club)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditing) {
                await updateClub(currentClubId, formData);
                showNotification("Club updated successfully!", "success");
            } else {
                await createClub(formData);
                showNotification("New club added successfully!", "success");
            }
            fetchClubs();
            closeForm();
        } catch (err) {
            showNotification(
                isEditing
                    ? "Failed to update club. Please try again."
                    : "Failed to add club. Please try again.",
                "error"
            );
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Delete a club
    const handleDelete = async (clubId) => {
        setLoading(true);
        try {
            await deleteClub(clubId);
            showNotification("Club deleted successfully!", "success");
            fetchClubs();
            setActiveCard("view");
        } catch (err) {
            showNotification("Failed to delete club. Please try again.", "error");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Show notification
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
                            University Club Management
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-xl">
                            Efficiently manage university clubs and their members
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
                                placeholder="Search clubs..."
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
                    {/* Card 1: View Clubs */}
                    <div
                        className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition duration-300 ${
                            activeCard === "view" ? "ring-2 ring-indigo-500 scale-100" : "scale-95 hover:scale-100"
                        }`}
                        onClick={() => setActiveCard("view")}
                    >
                        <div className="p-5 bg-gradient-to-r from-indigo-500 to-purple-600">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold text-white">View Clubs</h3>
                                <Users className="w-10 h-10 text-white opacity-90" />
                            </div>
                        </div>
                        <div className="p-5">
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Browse and manage university clubs
                            </p>
                            <button
                                onClick={() => setActiveCard("view")}
                                className="w-full bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-medium px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                            >
                                <List className="w-4 h-4 mr-2" />
                                View Clubs
                            </button>
                        </div>
                    </div>

                    {/* Card 2: Add Club */}
                    <div
                        className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition duration-300 ${
                            activeCard === "add" ? "ring-2 ring-emerald-500 scale-100" : "scale-95 hover:scale-100"
                        }`}
                        onClick={openCreateForm}
                    >
                        <div className="p-5 bg-gradient-to-r from-emerald-500 to-teal-600">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold text-white">Create Club</h3>
                                <Plus className="w-10 h-10 text-white opacity-90" />
                            </div>
                        </div>
                        <div className="p-5">
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Create a new university club
                            </p>
                            <button
                                onClick={openCreateForm}
                                className="w-full bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-medium px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Create Club
                            </button>
                        </div>
                    </div>

                    {/* Card 3: Edit Club */}
                    <div
                        className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition duration-300 ${
                            activeCard === "edit" ? "ring-2 ring-amber-500 scale-100" : "scale-95 hover:scale-100"
                        }`}
                    >
                        <div className="p-5 bg-gradient-to-r from-amber-500 to-orange-600">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold text-white">Update Clubs</h3>
                                <Edit className="w-10 h-10 text-white opacity-90" />
                            </div>
                        </div>
                        <div className="p-5">
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Update and modify existing clubs
                            </p>
                            <button
                                onClick={() => setActiveCard("edit")}
                                className="w-full bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/20 dark:hover:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-medium px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                            >
                                <Edit className="w-4 h-4 mr-2" />
                                Select to Update
                            </button>
                        </div>
                    </div>

                    {/* Card 4: Delete Club */}
                    <div
                        className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition duration-300 ${
                            activeCard === "delete" ? "ring-2 ring-rose-500 scale-100" : "scale-95 hover:scale-100"
                        }`}
                    >
                        <div className="p-5 bg-gradient-to-r from-rose-500 to-red-600">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold text-white">Delete Clubs</h3>
                                <Trash2 className="w-10 h-10 text-white opacity-90" />
                            </div>
                        </div>
                        <div className="p-5">
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Remove obsolete or discontinued clubs
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

                {/* View Clubs */}
                {activeCard === "view" && !isFormOpen && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredClubs.length > 0 ? (
                            filteredClubs.map((club) => (
                                <div
                                    key={club._id}
                                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:translate-y-1 max-w-sm mx-auto w-full"
                                >
                                    {/* Club Header with Image */}
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
                                        {club.logo ? (
                                            <img
                                                src={club.logo}
                                                alt={club.name}
                                                className="w-full h-56 object-cover object-center"
                                            />
                                        ) : (
                                            <div className="w-full h-56 flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800">
                                                <Image className="w-20 h-20 text-blue-600 dark:text-blue-400 opacity-60" />
                                            </div>
                                        )}

                                        {/* Name and Title Overlay */}
                                        <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                                            <h3 className="text-xl font-bold text-white">
                                                {club.name}
                                            </h3>
                                            <p className="text-blue-300 font-medium">
                                                {club.category}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Club Content */}
                                    <div className="p-5">
                                        <div className="space-y-2.5 mb-4">
                                            <div className="flex items-center text-gray-700 dark:text-gray-300">
                                                <Users className="mr-2 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                                                <span className="text-sm">{club.members.length} Members</span>
                                            </div>

                                            <div className="flex items-center text-gray-700 dark:text-gray-300">
                                                <span className="text-sm">{club.contactEmail}</span>
                                            </div>
                                        </div>

                                        {/* Club Description */}
                                        <div className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                                            <p>{(club.description)?.slice(0, 100)}{(club.description)?.length > 100 && '...'}</p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex space-x-2 mt-4">
                                            <button
                                                onClick={() => openEditForm(club._id)}
                                                className="flex-1 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-medium px-2 py-1.5 rounded-lg transition-colors flex items-center justify-center"
                                            >
                                                <Edit className="w-4 h-4 mr-1" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => openDeleteConfirmation(club)}
                                                className="flex-1 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-700 dark:text-red-400 font-medium px-2 py-1.5 rounded-lg transition-colors flex items-center justify-center"
                                            >
                                                <Trash2 className="w-4 h-4 mr-1" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center col-span-full text-gray-500">No clubs available.</div>
                        )}
                    </div>
                )}

                {/* Edit Club */}
                {activeCard === "edit" && !isFormOpen && !loading && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Select Club to Edit</h3>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Choose a club from the list below to modify its details
                            </p>
                        </div>

                        {filteredClubs.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-gray-600 dark:text-gray-400">No clubs available to edit.</p>
                            </div>
                        ) : (
                            <div className="grid gap-2 p-6">
                                {filteredClubs.map((club) => (
                                    <button
                                        key={club._id}
                                        onClick={() => openEditForm(club._id)}
                                        className="text-left bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 border border-amber-200 dark:border-amber-800/30 rounded-lg p-4 transition-colors flex items-center justify-between"
                                    >
                                        <div className="flex items-center">
                                            <div className="bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 p-3 rounded-lg mr-4">
                                                <Users className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900 dark:text-white">{club.name}</h4>
                                                <p className="text-gray-600 dark:text-gray-400 text-sm">{club.category}</p>
                                            </div>
                                        </div>
                                        <Edit className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Delete Club */}
                {activeCard === "delete" && selectedClub && !loading && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Confirm Deletion</h3>
                        </div>
                        <div className="p-6">
                            <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-lg mb-6 border border-rose-200 dark:border-rose-800/30">
                                <div className="flex items-center mb-4">
                                    <AlertCircle className="w-6 h-6 text-rose-600 dark:text-rose-400 mr-2" />
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Are you sure?</h4>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 mb-4">
                                    You are about to delete the following club. This action cannot be undone.
                                </p>
                                <div className="bg-white dark:bg-gray-700 rounded-lg p-4 mb-4">
                                    <p className="font-medium text-gray-900 dark:text-white mb-1">{selectedClub.name}</p>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">{selectedClub.category}</p>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => {
                                        setSelectedClub(null);
                                        setActiveCard("view");
                                    }}
                                    className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(selectedClub._id)}
                                    className="px-4 py-2 text-white bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600 rounded-lg transition-colors flex items-center"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Club
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Club Form (Add/Edit) */}
                {isFormOpen && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {isEditing ? "Edit Club" : "Add New Club"}
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
                                    {/* Club Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Club Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Robotics Club"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>

                                    {/* Club Description */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Club Description *
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            placeholder="Describe the club"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>

                                    {/* Club Category */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Club Category *
                                        </label>
                                        <input
                                            type="text"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Academic, Sports"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>

                                    {/* Founded Year */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Founded Year *
                                        </label>
                                        <input
                                            type="number"
                                            name="foundedYear"
                                            value={formData.foundedYear}
                                            onChange={handleInputChange}
                                            placeholder="e.g. 2020"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>

                                    {/* Contact Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Contact Email *
                                        </label>
                                        <input
                                            type="email"
                                            name="contactEmail"
                                            value={formData.contactEmail}
                                            onChange={handleInputChange}
                                            placeholder="e.g. club@university.edu"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>

                                    {/* Club Logo URL */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Club Logo URL (optional)
                                        </label>
                                        <input
                                            type="text"
                                            name="logo"
                                            value={formData.logo}
                                            onChange={handleInputChange}
                                            placeholder="e.g. https://example.com/logo.jpg"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>

                                    {/* Social Media Links */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Social Media Links (optional)
                                        </label>
                                        <div className="space-y-2">
                                            <input
                                                type="text"
                                                name="website"
                                                value={formData.socialMedia.website}
                                                onChange={handleSocialMediaChange}
                                                placeholder="Website"
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            />
                                            <input
                                                type="text"
                                                name="facebook"
                                                value={formData.socialMedia.facebook}
                                                onChange={handleSocialMediaChange}
                                                placeholder="Facebook"
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            />
                                            <input
                                                type="text"
                                                name="instagram"
                                                value={formData.socialMedia.instagram}
                                                onChange={handleSocialMediaChange}
                                                placeholder="Instagram"
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            />
                                            <input
                                                type="text"
                                                name="twitter"
                                                value={formData.socialMedia.twitter}
                                                onChange={handleSocialMediaChange}
                                                placeholder="Twitter"
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            />
                                        </div>
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
                                        {isEditing ? "Update Club" : "Add Club"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {/* Add Member Option */}
            {activeCard === "edit" && isFormOpen  && (
                <div className="max-w-6xl mx-auto mb-8">
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg">
                        <h3 className="text-xl font-bold mb-4">Add Member by Email</h3>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                value={formData.newMemberEmail}
                                onChange={(e) => setFormData({ ...formData, newMemberEmail: e.target.value })}
                                placeholder="Enter member email"
                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                            <button
                                onClick={handleAddMember}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                            >
                                Add Member
                            </button>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
};

export default ClubManagement;