import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const LostFound = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("lost");
  const [showReportForm, setShowReportForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    reporterName: "",
    reporterId: "",
    contactNumber: "",
    location: "",
    date: "",
    itemName: "",
    category: "electronics",
    description: "",
    itemType: "lost",
    status: "pending",
    image: null,
  });

  // Fetch all lost and found items
  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/lostfound/items`
      );
      setItems(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error("Failed to fetch items");
      console.error("Error fetching items:", error);
      setItems([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      image: file,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const formDataToSend = new FormData();

      // Append all form data to FormData object
      Object.keys(formData).forEach((key) => {
        if (key === "image" && formData.image) {
          formDataToSend.append("image", formData.image);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/lostfound/report`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        toast.success("Item reported successfully!");
        setShowReportForm(false);
        setFormData({
          reporterName: "",
          reporterId: "",
          contactNumber: "",
          location: "",
          date: "",
          itemName: "",
          category: "electronics",
          description: "",
          itemType: "lost",
          status: "pending",
          image: null,
        });
        fetchItems();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to report item");
      console.error("Error reporting item:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add handleMarkAsResolved function
  const handleMarkAsResolved = async (itemId) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/api/lostfound/items/${itemId}`,
        { status: "resolved" }
      );

      if (response.status === 200) {
        toast.success("Item has been marked as resolved!");
        // Remove the item from the local state
        setItems((prevItems) =>
          prevItems.filter((item) => item._id !== itemId)
        );
      }
    } catch (error) {
      toast.error("Failed to update item status");
      console.error("Error updating item status:", error);
    }
  };

  // Filter items based on search and filters
  const filteredItems = Array.isArray(items)
    ? items.filter((item) => {
        const matchesSearch =
          item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.location?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = activeTab === "all" || item.itemType === activeTab;
        const matchesStatus = filter === "all" || item.status === filter;

        return matchesSearch && matchesType && matchesStatus;
      })
    : [];

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-yellow-100/20 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-yellow-800 mb-2">
            Lost and Found Portal
          </h1>
          <p className="text-yellow-700">
            Help us reunite lost items with their owners
          </p>
        </div>

        {/* Tabs and actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex space-x-2">
              {["all", "lost", "found"].map((tab) => (
                <button
                  key={tab}
                  className={`px-6 py-2 rounded-full transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-yellow-600 text-white shadow-md"
                      : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <button
              className={`px-6 py-2 rounded-full transition-all duration-200 ${
                showReportForm
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-yellow-600 text-white hover:bg-yellow-700"
              } shadow-md`}
              onClick={() => setShowReportForm(!showReportForm)}
            >
              {showReportForm ? "× Cancel Report" : "+ Report Item"}
            </button>
          </div>
        </div>

        {/* Search and filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by item name, description or location..."
                className="w-full px-4 py-2 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border rounded-lg"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Report Form */}
        {showReportForm && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 transform transition-all duration-300 border-2 border-yellow-100">
            <h2 className="text-2xl font-bold text-yellow-800 mb-6">
              Report a Lost or Found Item
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Reporter Name *</label>
                  <input
                    type="text"
                    name="reporterName"
                    value={formData.reporterName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-yellow-100 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-200 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block mb-1">Reporter ID *</label>
                  <input
                    type="text"
                    name="reporterId"
                    value={formData.reporterId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-yellow-100 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-200 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block mb-1">Contact Number *</label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-yellow-100 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-200 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block mb-1">Item Type *</label>
                  <select
                    name="itemType"
                    value={formData.itemType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-yellow-100 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-200 outline-none transition-all"
                  >
                    <option value="lost">Lost Item</option>
                    <option value="found">Found Item</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-yellow-100 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-200 outline-none transition-all"
                    placeholder="Where lost/found"
                  />
                </div>

                <div>
                  <label className="block mb-1">Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-yellow-100 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-200 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block mb-1">Item Name *</label>
                  <input
                    type="text"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-yellow-100 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-200 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block mb-1">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-yellow-100 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-200 outline-none transition-all"
                  >
                    <option value="electronics">Electronics</option>
                    <option value="documents">Documents</option>
                    <option value="jewelry">Jewelry</option>
                    <option value="accessories">Accessories</option>
                    <option value="clothing">Clothing</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-1">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-yellow-100 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-200 outline-none transition-all"
                    rows="3"
                    placeholder="Detailed description of the item"
                  ></textarea>
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-1">Upload Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-yellow-100 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-200 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white rounded-full hover:from-yellow-700 hover:to-yellow-600 transition-all duration-200 shadow-md disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    "Submit Report"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Items Grid with improved styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-yellow-100"
            >
              {item.imageUrl && (
                <div className="relative h-48">
                  <img
                    src={item.imageUrl}
                    alt={item.itemName}
                    className="w-full h-full object-cover"
                  />
                  {item.status === "resolved" && (
                    <div className="absolute top-0 right-0 m-2 px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium">
                      Resolved
                    </div>
                  )}
                </div>
              )}

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-yellow-800">
                    {item.itemName}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      item.itemType === "lost"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {item.itemType === "lost" ? "Lost" : "Found"}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="flex items-center text-gray-600">
                    <span className="font-medium w-24">Category:</span>
                    <span className="capitalize">{item.category}</span>
                  </p>
                  <p className="flex items-center text-gray-600">
                    <span className="font-medium w-24">Location:</span>
                    <span>{item.location}</span>
                  </p>
                  <p className="flex items-center text-gray-600">
                    <span className="font-medium w-24">Date:</span>
                    <span>{formatDate(item.date || item.createdAt)}</span>
                  </p>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-3">
                  {item.description}
                </p>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-yellow-100">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      item.status === "resolved"
                        ? "bg-green-100 text-green-600"
                        : item.status === "in-progress"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {item.status}
                  </span>

                  <div className="flex gap-2">
                    {item.status !== "resolved" && (
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to mark this item as resolved? This will remove it from the list."
                            )
                          ) {
                            handleMarkAsResolved(item._id);
                          }
                        }}
                        className="px-3 py-1 text-sm bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                      >
                        Mark as Resolved
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setShowDetailsModal(true);
                      }}
                      className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Details Modal */}
        {showDetailsModal && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-yellow-800">
                  {selectedItem.itemName}
                </h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              {selectedItem.imageUrl && (
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.itemName}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <DetailItem label="Status" value={selectedItem.status} />
                  <DetailItem label="Type" value={selectedItem.itemType} />
                  <DetailItem label="Category" value={selectedItem.category} />
                  <DetailItem label="Location" value={selectedItem.location} />
                  <DetailItem
                    label="Date"
                    value={formatDate(
                      selectedItem.date || selectedItem.createdAt
                    )}
                  />
                  <DetailItem
                    label="Reporter"
                    value={selectedItem.reporterName}
                  />
                  <DetailItem
                    label="Contact"
                    value={selectedItem.contactNumber}
                  />
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">
                    Description
                  </h4>
                  <p className="text-gray-600">{selectedItem.description}</p>
                </div>

                {selectedItem.notes && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">
                      Additional Notes
                    </h4>
                    <p className="text-gray-600">{selectedItem.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper component for modal details
const DetailItem = ({ label, value }) => (
  <div>
    <span className="text-sm text-gray-500">{label}</span>
    <p className="font-medium capitalize">{value}</p>
  </div>
);

export default LostFound;
