import React, { useState, useEffect } from "react";
import {
    getBusSchedules,
    getBusScheduleById,
    addBusSchedule,
    updateBusSchedule,
    deleteBusSchedule
} from "../../api/bus";
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
    MapPin,
    Bus,
    Clock,
    User,
    List,
    Calendar
} from "lucide-react";

const ClubManagement = () => {
    const [busSchedules, setBusSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredSchedules, setFilteredSchedules] = useState([]);
    const [activeCard, setActiveCard] = useState("view"); // view, add, edit, delete

    // Form states
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentBusId, setCurrentBusId] = useState(null);
    const [selectedBus, setSelectedBus] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        busNumber: "",
        capacity: "",
        driver: "",
        accessibility: false,
        estimatedTime: "",
        currentLocation: "",
        stops: [],
        schedule: []
    });

    // Notification state
    const [notification, setNotification] = useState({ show: false, message: "", type: "" });

    // Fetch all bus schedules on component mount
    useEffect(() => {
        fetchBusSchedules();
    }, []);

    // Filter bus schedules based on search query
    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredSchedules(busSchedules);
        } else {
            const filtered = busSchedules.filter(
                (bus) =>
                    bus.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    bus.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    bus.driver.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredSchedules(filtered);
        }
    }, [searchQuery, busSchedules]);

    // Fetch all bus schedules
    const fetchBusSchedules = async () => {
        setLoading(true);
        try {
            const data = await getBusSchedules();
            setBusSchedules(data);
            setFilteredSchedules(data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch bus schedules. Please try again.");
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
            [name]: type === "checkbox" ? checked : value
        });
    };

    // Handle stop changes
    const handleStopChange = (index, value) => {
        const updatedStops = [...formData.stops];
        updatedStops[index] = value;
        setFormData({ ...formData, stops: updatedStops });
    };

    // Add new stop field
    const addStopField = () => {
        setFormData({ ...formData, stops: [...formData.stops, ""] });
    };

    // Remove stop field
    const removeStopField = (index) => {
        const updatedStops = formData.stops.filter((_, i) => i !== index);
        setFormData({ ...formData, stops: updatedStops });
    };

    // Handle schedule changes
    const handleScheduleChange = (index, field, value) => {
        const updatedSchedule = [...formData.schedule];
        updatedSchedule[index] = { ...updatedSchedule[index], [field]: value };
        setFormData({ ...formData, schedule: updatedSchedule });
    };

    // Add new schedule entry
    const addScheduleEntry = () => {
        setFormData({
            ...formData,
            schedule: [...formData.schedule, { time: "", status: "On Time" }]
        });
    };

    // Remove schedule entry
    const removeScheduleEntry = (index) => {
        const updatedSchedule = formData.schedule.filter((_, i) => i !== index);
        setFormData({ ...formData, schedule: updatedSchedule });
    };

    // Open form for creating new bus
    const openCreateForm = () => {
        setFormData({
            name: "",
            busNumber: "",
            capacity: "",
            driver: "",
            accessibility: false,
            estimatedTime: "",
            currentLocation: "",
            stops: [""],
            schedule: [{ time: "", status: "On Time" }]
        });
        setIsEditing(false);
        setCurrentBusId(null);
        setIsFormOpen(true);
        setActiveCard("add");
    };

    // Open form for editing bus
    const openEditForm = async (busId) => {
        setLoading(true);
        try {
            const busData = await getBusScheduleById(busId);
            setFormData({
                name: busData.name || "",
                busNumber: busData.busNumber || "",
                capacity: busData.capacity || "",
                driver: busData.driver || "",
                accessibility: busData.accessibility || false,
                estimatedTime: busData.estimatedTime || "",
                currentLocation: busData.currentLocation || "",
                stops: busData.stops.length ? busData.stops : [""],
                schedule: busData.schedule.length ? busData.schedule : [{ time: "", status: "On Time" }]
            });
            setIsEditing(true);
            setCurrentBusId(busId);
            setIsFormOpen(true);
            setActiveCard("edit");
        } catch (err) {
            showNotification("Failed to load bus details. Please try again.", "error");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Open delete confirmation
    const openDeleteConfirmation = (bus) => {
        setSelectedBus(bus);
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
        if (!formData.name || !formData.busNumber || !formData.driver) {
            showNotification("Please fill in all required fields.", "error");
            setLoading(false);
            return;
        }

        // Filter out empty stops
        const cleanedFormData = {
            ...formData,
            stops: formData.stops.filter(stop => stop.trim() !== ""),
            schedule: formData.schedule.filter(entry => entry.time.trim() !== "")
        };

        try {
            if (isEditing) {
                await updateBusSchedule(currentBusId, cleanedFormData);
                showNotification("Bus schedule updated successfully!", "success");
            } else {
                await addBusSchedule(cleanedFormData);
                showNotification("New bus schedule added successfully!", "success");
            }
            fetchBusSchedules();
            closeForm();
        } catch (err) {
            showNotification(
                isEditing
                    ? "Failed to update bus schedule. Please try again."
                    : "Failed to add bus schedule. Please try again.",
                "error"
            );
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Delete bus schedule
    const handleDelete = async (busId) => {
        setLoading(true);
        try {
            await deleteBusSchedule(busId);
            showNotification("Bus schedule deleted successfully!", "success");
            fetchBusSchedules();
            setActiveCard("view");
        } catch (err) {
            showNotification("Failed to delete bus schedule. Please try again.", "error");
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

    // Get status color
    const getStatusColor = (location) => {
        if (location.includes("At")) {
            return "text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400";
        }
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400";
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
            {/* Header */}
            <div className="max-w-6xl mx-auto mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400 mb-2">
                            Campus Transit
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-xl">
                            Streamlined bus schedule management system for efficient campus transportation
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
                                placeholder="Search routes, buses, drivers..."
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
                        className={`p-4 rounded-lg flex items-start ${notification.type === "error"
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
                    {/* Card 1: View Buses */}
                    <div
                        className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition duration-300 ${activeCard === "view" ? "ring-2 ring-indigo-500 scale-100" : "scale-95 hover:scale-100"}`}
                        onClick={() => setActiveCard("view")}
                    >
                        <div className="p-5 bg-gradient-to-r from-indigo-500 to-purple-600">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold text-white">View Events</h3>
                                <Bus className="w-10 h-10 text-white opacity-90" />
                            </div>
                        </div>
                        <div className="p-5">
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Browse and monitor all active bus routes and schedules of the campus
                            </p>
                            <button
                                onClick={() => setActiveCard("view")}
                                className="w-full bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-medium px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                            >
                                <List className="w-4 h-4 mr-2" />
                                View Events
                            </button>
                        </div>
                    </div>

                    {/* Card 2: Add Bus */}
                    <div
                        className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition duration-300 ${activeCard === "add" ? "ring-2 ring-emerald-500 scale-100" : "scale-95 hover:scale-100"}`}
                        onClick={openCreateForm}
                    >
                        <div className="p-5 bg-gradient-to-r from-emerald-500 to-teal-600">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold text-white">Create Event</h3>
                                <Plus className="w-10 h-10 text-white opacity-90" />
                            </div>
                        </div>
                        <div className="p-5">
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Create new bus routes with stops, schedules, and driver assignments
                            </p>
                            <button
                                onClick={openCreateForm}
                                className="w-full bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-medium px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Create Event
                            </button>
                        </div>
                    </div>

                    {/* Card 3: Edit Bus */}
                    <div
                        className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition duration-300 ${activeCard === "edit" ? "ring-2 ring-amber-500 scale-100" : "scale-95 hover:scale-100"}`}
                    >
                        <div className="p-5 bg-gradient-to-r from-amber-500 to-orange-600">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold text-white">Update Events</h3>
                                <Edit className="w-10 h-10 text-white opacity-90" />
                            </div>
                        </div>
                        <div className="p-5">
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Update and modify existing routes, schedules, and bus information
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

                    {/* Card 4: Delete Bus */}
                    <div
                        className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition duration-300 ${activeCard === "delete" ? "ring-2 ring-rose-500 scale-100" : "scale-95 hover:scale-100"}`}
                    >
                        <div className="p-5 bg-gradient-to-r from-rose-500 to-red-600">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold text-white">Delete Events</h3>
                                <Trash2 className="w-10 h-10 text-white opacity-90" />
                            </div>
                        </div>
                        <div className="p-5">
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Remove obsolete or discontinued bus routes from the system
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

                {/* View Buses */}
                {activeCard === "view" && !loading && !error && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">All Bus Routes</h3>
                            <button
                                onClick={fetchBusSchedules}
                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center"
                            >
                                <RefreshCw className="w-4 h-4 mr-1" />
                                Refresh
                            </button>
                        </div>

                        {/* No results */}
                        {filteredSchedules.length === 0 && (
                            <div className="p-8 text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                                    <Bus className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 mb-2">
                                    {searchQuery ? "No buses found matching your search." : "No bus schedules found."}
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

                        {/* Bus list */}
                        {filteredSchedules.length > 0 && (
                            <div className="grid gap-4 p-6">
                                {filteredSchedules.map((bus) => (
                                    <div
                                        key={bus.busId}
                                        className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center mb-2">
                                                    <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                                                        #{bus.busId}
                                                    </span>
                                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                        {bus.name}
                                                    </h4>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                                                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                                                        <Bus className="w-4 h-4 mr-2 flex-shrink-0" />
                                                        <span>Bus #{bus.busNumber}</span>
                                                    </div>
                                                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                                                        <User className="w-4 h-4 mr-2 flex-shrink-0" />
                                                        <span>{bus.driver}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <MapPin className="w-4 h-4 mr-2 flex-shrink-0 text-gray-500 dark:text-gray-500" />
                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(bus.currentLocation)}`}>
                                                            {bus.currentLocation}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex mt-4 md:mt-0 space-x-2">
                                                <button
                                                    onClick={() => openEditForm(bus.busId)}
                                                    className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteConfirmation(bus)}
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
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Select Route to Edit</h3>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Choose a bus route from the list below to modify its details
                            </p>
                        </div>

                        {filteredSchedules.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-gray-600 dark:text-gray-400">No bus routes available to edit.</p>
                            </div>
                        ) : (
                            <div className="grid gap-2 p-6">
                                {filteredSchedules.map((bus) => (
                                    <button
                                        key={bus.busId}
                                        onClick={() => openEditForm(bus.busId)}
                                        className="text-left bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 border border-amber-200 dark:border-amber-800/30 rounded-lg p-4 transition-colors flex items-center justify-between"
                                    >
                                        <div className="flex items-center">
                                            <div className="bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 p-3 rounded-lg mr-4">
                                                <Bus className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900 dark:text-white">{bus.name}</h4>
                                                <p className="text-gray-600 dark:text-gray-400 text-sm">Bus #{bus.busNumber} • Driver: {bus.driver}</p>
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
                {activeCard === "delete" && !selectedBus && !loading && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Select Route to Delete</h3>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Choose a bus route from the list below to remove it from the system
                            </p>
                        </div>

                        {filteredSchedules.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-gray-600 dark:text-gray-400">No bus routes available to delete.</p>
                            </div>
                        ) : (
                            <div className="grid gap-2 p-6">
                                {filteredSchedules.map((bus) => (
                                    <button
                                        key={bus.busId}
                                        onClick={() => openDeleteConfirmation(bus)}
                                        className="text-left bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/30 border border-rose-200 dark:border-rose-800/30 rounded-lg p-4 transition-colors flex items-center justify-between"
                                    >
                                        <div className="flex items-center">
                                            <div className="bg-rose-200 dark:bg-rose-800 text-rose-800 dark:text-rose-200 p-3 rounded-lg mr-4">
                                                <Bus className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900 dark:text-white">{bus.name}</h4>
                                                <p className="text-gray-600 dark:text-gray-400 text-sm">Bus #{bus.busNumber} • Driver: {bus.driver}</p>
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
                {activeCard === "delete" && selectedBus && !loading && (
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
                                    You are about to delete the following bus route. This action cannot be undone.
                                </p>
                                <div className="bg-white dark:bg-gray-700 rounded-lg p-4 mb-4">
                                    <p className="font-medium text-gray-900 dark:text-white mb-1">{selectedBus.name}</p>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">Bus #{selectedBus.busNumber} • Driver: {selectedBus.driver}</p>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => {
                                        setSelectedBus(null);
                                        setActiveCard("view");
                                    }}
                                    className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(selectedBus.busId)}
                                    className="px-4 py-2 text-white bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600 rounded-lg transition-colors flex items-center"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Bus Route
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bus Form (Add/Edit) */}
                {isFormOpen && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {isEditing ? "Edit Bus Route" : "Add New Bus Route"}
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
                                    {/* Event Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Event Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="eventName"
                                            value={formData.eventName}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Annual Science Fair"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    {/* Event Location */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Event Location *
                                        </label>
                                        <input
                                            type="text"
                                            name="eventLocation"
                                            value={formData.eventLocation}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Auditorium 2"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    {/* Hosting Club */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Hosting Club *
                                        </label>
                                        <input
                                            type="text"
                                            name="hostingClub"
                                            value={formData.hostingClub}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Robotics Club"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    {/* Event Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Event Date *
                                        </label>
                                        <input
                                            type="date"
                                            name="eventDate"
                                            value={formData.eventDate}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    {/* Event Time */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Event Time *
                                        </label>
                                        <input
                                            type="time"
                                            name="eventTime"
                                            value={formData.eventTime}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    {/* Event Description */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Event Description
                                        </label>
                                        <textarea
                                            name="eventDescription"
                                            value={formData.eventDescription}
                                            onChange={handleInputChange}
                                            placeholder="e.g. This event showcases student innovations in robotics."
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>

                                    
                                </div>

                                {/* Schedule */}
                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Event Schedule
                                        </label>
                                        <button
                                            type="button"
                                            onClick={addScheduleEntry}
                                            className="text-indigo-600 dark:text-indigo-400 text-sm flex items-center"
                                        >
                                            <Plus className="w-4 h-4 mr-1" />
                                            Add Time
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        {formData.schedule.map((entry, index) => (
                                            <div key={`schedule-${index}`} className="flex items-center">
                                                <div className="flex-1 grid grid-cols-2 gap-2">
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <Clock className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={entry.time}
                                                            onChange={(e) => handleScheduleChange(index, "time", e.target.value)}
                                                            placeholder="e.g. 10:00 AM"
                                                            className="block w-full pl-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                        />
                                                    </div>
                                                    <select
                                                        value={entry.status}
                                                        onChange={(e) => handleScheduleChange(index, "status", e.target.value)}
                                                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                    >
                                                        <option value="Scheduled">Scheduled</option>
                                                        <option value="Ongoing">Ongoing</option>
                                                        <option value="Completed">Completed</option>
                                                    </select>
                                                </div>
                                                {formData.schedule.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeScheduleEntry(index)}
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
                                        className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center ${isEditing
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
                                        {isEditing ? "Update Event" : "Add Event"}
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

export default ClubManagement;