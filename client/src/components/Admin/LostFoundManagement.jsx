import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  Search,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Filter,
  Download,
  Edit,
} from "lucide-react";

const LostFoundManagement = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [itemToUpdate, setItemToUpdate] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [itemTypeFilter, setItemTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateSort, setDateSort] = useState("newest");

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    lost: 0,
    found: 0,
    resolved: 0,
    pending: 0,
  });

  // Fetch all lost and found items for admin
  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/admin/lostfound/items`
      );
      const data = Array.isArray(response.data) ? response.data : [];
      setItems(data);
      calculateStats(data);
    } catch (error) {
      toast.error("Failed to fetch items");
      console.error("Error fetching items:", error);
      setItems([]);
      calculateStats([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics from items data
  const calculateStats = (itemsData = []) => {
    if (!Array.isArray(itemsData)) {
      console.error("Invalid items data:", itemsData);
      return;
    }

    const newStats = {
      total: itemsData.length,
      lost: itemsData.filter((item) => item?.itemType === "lost").length,
      found: itemsData.filter((item) => item?.itemType === "found").length,
      resolved: itemsData.filter((item) => item?.status === "resolved").length,
      pending: itemsData.filter((item) => item?.status === "pending").length,
    };
    setStats(newStats);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Update item status
  const updateItemStatus = async (itemId, newStatus) => {
    try {
      const response = await axios.patch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/admin/lostfound/items/${itemId}`,
        { status: newStatus }
      );

      if (response.status === 200) {
        toast.success(
          `Item ${
            newStatus === "resolved" ? "resolved" : "status updated"
          } successfully`
        );
        // Update items list
        setItems((prevItems) =>
          prevItems.map((item) =>
            item._id === itemId ? { ...item, status: newStatus } : item
          )
        );
        // Recalculate stats
        calculateStats(items);
      }
    } catch (error) {
      toast.error("Failed to update item status");
      console.error("Error updating item status:", error);
    }
  };

  // Handle item update form submission
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `/api/admin/lostfound/items/${itemToUpdate._id}`,
        itemToUpdate
      );

      if (response.status === 200) {
        toast.success("Item updated successfully");
        setShowUpdateModal(false);
        fetchItems();
      }
    } catch (error) {
      toast.error("Failed to update item");
      console.error("Error updating item:", error);
    }
  };

  // Delete single item
  const deleteItem = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const response = await axios.delete(
          `/api/admin/lostfound/items/${itemId}`
        );

        if (response.status === 200) {
          toast.success("Item deleted successfully");
          fetchItems();
        }
      } catch (error) {
        toast.error("Failed to delete item");
        console.error("Error deleting item:", error);
      }
    }
  };

  // Delete multiple selected items
  const deleteSelectedItems = async () => {
    if (selectedItems.length === 0) {
      toast.error("No items selected");
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to delete ${selectedItems.length} selected items?`
      )
    ) {
      try {
        const response = await axios.post("/api/admin/lostfound/bulk-delete", {
          itemIds: selectedItems,
        });

        if (response.status === 200) {
          toast.success(`${selectedItems.length} items deleted successfully`);
          setSelectedItems([]);
          fetchItems();
        }
      } catch (error) {
        toast.error("Failed to delete selected items");
        console.error("Error deleting items:", error);
      }
    }
  };

  // Handle checkbox selection
  const handleSelectItem = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  // Select/deselect all items
  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map((item) => item._id));
    }
  };

  // Export data as CSV
  const exportToCSV = () => {
    const headers = [
      "Item Name",
      "Type",
      "Category",
      "Location",
      "Date",
      "Reporter",
      "Contact",
      "Status",
    ];

    // Transform the data for CSV
    const csvData = filteredItems.map((item) => [
      item.itemName,
      item.itemType,
      item.category,
      item.location,
      new Date(item.date || item.createdAt).toLocaleDateString(),
      item.reporterName,
      item.contactNumber,
      item.status,
    ]);

    // Combine headers and data
    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute(
      "download",
      `lost_found_report_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Apply all filters and sorting
  const filteredItems = items
    .filter((item) => {
      const matchesSearch =
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.reporterName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        itemTypeFilter === "all" || item.itemType === itemTypeFilter;
      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;
      const matchesCategory =
        categoryFilter === "all" || item.category === categoryFilter;

      return matchesSearch && matchesType && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date || a.createdAt);
      const dateB = new Date(b.date || b.createdAt);

      return dateSort === "newest" ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="container mx-auto px-4 py-6 bg-yellow-50">
      <h1 className="text-2xl font-bold mb-6 text-yellow-800">
        Lost & Found Management
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md border-2 border-yellow-100 p-4">
          <p className="text-yellow-700 text-sm">Total Items</p>
          <p className="text-2xl font-semibold text-yellow-800">
            {stats.total}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-500 text-sm">Lost Items</p>
          <p className="text-2xl font-semibold text-red-600">{stats.lost}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-500 text-sm">Found Items</p>
          <p className="text-2xl font-semibold text-green-600">{stats.found}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-500 text-sm">Resolved</p>
          <p className="text-2xl font-semibold text-blue-600">
            {stats.resolved}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-500 text-sm">Pending</p>
          <p className="text-2xl font-semibold text-yellow-600">
            {stats.pending}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md border-2 border-yellow-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by item name, location or reporter..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="px-4 py-2 border rounded-lg"
            value={itemTypeFilter}
            onChange={(e) => setItemTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="lost">Lost Items</option>
            <option value="found">Found Items</option>
          </select>

          <select
            className="px-4 py-2 border rounded-lg"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>

          <select
            className="px-4 py-2 border rounded-lg"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="documents">Documents</option>
            <option value="jewelry">Jewelry</option>
            <option value="accessories">Accessories</option>
            <option value="clothing">Clothing</option>
            <option value="other">Other</option>
          </select>

          <select
            className="px-4 py-2 border rounded-lg"
            value={dateSort}
            onChange={(e) => setDateSort(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            {filteredItems.length}{" "}
            {filteredItems.length === 1 ? "item" : "items"} found
          </p>

          <div className="flex gap-2">
            {selectedItems.length > 0 && (
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-1"
                onClick={deleteSelectedItems}
              >
                <Trash2 size={16} />
                Delete Selected ({selectedItems.length})
              </button>
            )}

            <button
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition flex items-center gap-1"
              onClick={exportToCSV}
            >
              <Download size={16} />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Items Table */}
      {loading ? (
        <div className="flex justify-center my-12">
          <div className="loader">Loading...</div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-lg text-gray-600">
            No items found. Try adjusting your filters.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md border-2 border-yellow-100 overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={
                      selectedItems.length === filteredItems.length &&
                      filteredItems.length > 0
                    }
                    onChange={handleSelectAll}
                    className="h-4 w-4"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reporter
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item._id)}
                      onChange={() => handleSelectItem(item._id)}
                      className="h-4 w-4"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      {item.imageUrl ? (
                        <div className="flex-shrink-0 h-10 w-10 mr-3">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={item.imageUrl}
                            alt={item.itemName}
                          />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 h-10 w-10 mr-3 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-500 text-xs">
                            {item.category.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {item.itemName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.category}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.itemType === "lost"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {item.itemType === "lost" ? "Lost" : "Found"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{item.location}</td>
                  <td className="px-4 py-3 text-sm">
                    {formatDate(item.date || item.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">{item.reporterName}</div>
                    <div className="text-xs text-gray-500">
                      {item.contactNumber}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={item.status}
                      onChange={(e) =>
                        updateItemStatus(item._id, e.target.value)
                      }
                      className={`text-xs rounded-full px-2 py-1 border ${
                        item.status === "resolved"
                          ? "bg-green-100 text-green-800 border-green-200"
                          : item.status === "in-progress"
                          ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                          : "bg-gray-100 text-gray-800 border-gray-200"
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => {
                          setItemToUpdate(item);
                          setShowUpdateModal(true);
                        }}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => deleteItem(item._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Update Modal */}
      {showUpdateModal && itemToUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Edit Item</h3>

            <form onSubmit={handleUpdateSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Item Name
                  </label>
                  <input
                    type="text"
                    value={itemToUpdate.itemName}
                    onChange={(e) =>
                      setItemToUpdate({
                        ...itemToUpdate,
                        itemName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Category
                  </label>
                  <select
                    value={itemToUpdate.category}
                    onChange={(e) =>
                      setItemToUpdate({
                        ...itemToUpdate,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="electronics">Electronics</option>
                    <option value="documents">Documents</option>
                    <option value="jewelry">Jewelry</option>
                    <option value="accessories">Accessories</option>
                    <option value="clothing">Clothing</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Item Type
                  </label>
                  <select
                    value={itemToUpdate.itemType}
                    onChange={(e) =>
                      setItemToUpdate({
                        ...itemToUpdate,
                        itemType: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="lost">Lost</option>
                    <option value="found">Found</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Status
                  </label>
                  <select
                    value={itemToUpdate.status}
                    onChange={(e) =>
                      setItemToUpdate({
                        ...itemToUpdate,
                        status: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Location
                  </label>
                  <input
                    type="text"
                    value={itemToUpdate.location}
                    onChange={(e) =>
                      setItemToUpdate({
                        ...itemToUpdate,
                        location: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">Date</label>
                  <input
                    type="date"
                    value={itemToUpdate.date?.split("T")[0] || ""}
                    onChange={(e) =>
                      setItemToUpdate({ ...itemToUpdate, date: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Reporter Name
                  </label>
                  <input
                    type="text"
                    value={itemToUpdate.reporterName}
                    onChange={(e) =>
                      setItemToUpdate({
                        ...itemToUpdate,
                        reporterName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    value={itemToUpdate.contactNumber}
                    onChange={(e) =>
                      setItemToUpdate({
                        ...itemToUpdate,
                        contactNumber: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-1 text-sm font-medium">
                    Description
                  </label>
                  <textarea
                    value={itemToUpdate.description}
                    onChange={(e) =>
                      setItemToUpdate({
                        ...itemToUpdate,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    rows="3"
                  ></textarea>
                </div>

                {itemToUpdate.imageUrl && (
                  <div className="md:col-span-2">
                    <label className="block mb-1 text-sm font-medium">
                      Current Image
                    </label>
                    <div className="h-40 w-40 overflow-hidden">
                      <img
                        src={itemToUpdate.imageUrl}
                        alt={itemToUpdate.itemName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                  onClick={() => setShowUpdateModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LostFoundManagement;
