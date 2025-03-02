import { Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
  createClub,
  getCategories,
  getClubById,
  getClubs,
  joinClub,
} from '../services/clubApiService';

const Clubs = () => {
  const [clubs, setClubs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [newClub, setNewClub] = useState({
    name: '',
    description: '',
    category: '',
    location: '',
    capacity: 0,
  });
  const [userId, setUserId] = useState('');
  const [userRole, setUserRole] = useState('member');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch clubs and categories on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [clubsData, categoriesData] = await Promise.all([
          getClubs(),
          getCategories(),
        ]);
        setClubs(clubsData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err.message || 'Failed to load data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // UI Handlers
  const handleSearch = async e => {
    e.preventDefault();
    try {
      const result = await getClubs(selectedCategory, searchTerm);
      setClubs(result);
    } catch (err) {
      setError(err.message || 'Search failed');
    }
  };

  const handleCategoryChange = async e => {
    try {
      const category = e.target.value;
      setSelectedCategory(category);
      setLoading(true);

      const result = await getClubs(category, searchTerm);
      if (result.data) {
        setClubs(result.data);
      }
    } catch (err) {
      setError('Failed to filter by category');
      console.error('Category filter error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClubSelect = async clubId => {
    try {
      const clubDetails = await getClubById(clubId);
      setSelectedClub(clubDetails);
    } catch (err) {
      setError(err.message || 'Failed to load club details');
    }
  };

  const handleCreateClub = async e => {
    e.preventDefault();
    try {
      const createdClub = await createClub(newClub);
      setClubs(prev => [...prev, createdClub]);
      setNewClub({
        name: '',
        description: '',
        category: '',
        location: '',
        capacity: 0,
      });
    } catch (err) {
      setError(err.message || 'Failed to create club');
    }
  };

  const handleJoinClub = async e => {
    e.preventDefault();
    if (!selectedClub || !userId) return;

    try {
      const result = await joinClub(selectedClub._id, {
        userId,
        role: userRole,
      });
      setSelectedClub(result.data);
      setUserId('');
      setUserRole('member');
    } catch (err) {
      setError(err.message || 'Failed to join club');
    }
  };

  const handleInputChange = (e, formSetter, formData) => {
    const { name, value } = e.target;
    formSetter({
      ...formData,
      [name]: value,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0F172A] text-xl text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#0F172A] to-gray-900 text-gray-100 p-4 md:p-8">
      {/* Page Header with improved styling */}
      <div className="text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-lg shadow-2xl">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-white">
          University Clubs
        </h1>
        <p className="text-gray-200 text-lg">
          Discover and join amazing communities
        </p>
      </div>

      {/* Action Cards with improved styling */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 transition-all duration-300 rounded-xl p-6 text-center transform hover:scale-105 shadow-xl">
          <h2 className="text-xl font-bold">View Clubs</h2>
          <p className="text-blue-100 mt-2">Browse all clubs</p>
        </div>
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 transition-all duration-300 rounded-xl p-6 text-center transform hover:scale-105 shadow-xl">
          <h2 className="text-xl font-bold">Add Club</h2>
          <p className="text-emerald-100 mt-2">Create new club</p>
        </div>
        <div className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 transition-all duration-300 rounded-xl p-6 text-center transform hover:scale-105 shadow-xl">
          <h2 className="text-xl font-bold">Edit Club</h2>
          <p className="text-amber-100 mt-2">Update details</p>
        </div>
        <div className="bg-gradient-to-r from-rose-500 to-rose-700 hover:from-rose-600 hover:to-rose-800 transition-all duration-300 rounded-xl p-6 text-center transform hover:scale-105 shadow-xl">
          <h2 className="text-xl font-bold">Delete Club</h2>
          <p className="text-rose-100 mt-2">Remove clubs</p>
        </div>
      </div>

      {/* Error Banner with animation */}
      {error && (
        <div className="bg-red-600 text-white px-6 py-4 rounded-lg mb-6 animate-shake shadow-lg">
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Main Content Grid with improved styling */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Search and Club List */}
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-xl border border-gray-700">
          <h2 className="text-2xl font-bold mb-4 text-blue-400">Find Clubs</h2>
          <form onSubmit={handleSearch} className="mb-4 space-y-4">
            <div className="flex">
              <input
                type="text"
                placeholder="Search clubs..."
                className="w-full px-4 py-2 rounded-l-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-r-lg flex items-center justify-center transition-colors"
              >
                <Search size={20} />
              </button>
            </div>
            <select
              className="w-full px-4 py-2 rounded-lg bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </form>

          {/* Club List with improved styling */}
          <div className="max-h-[calc(100vh-400px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
            <h3 className="text-lg font-semibold mb-3 text-blue-400">
              Available Clubs
            </h3>
            {clubs.length > 0 ? (
              <ul className="space-y-2">
                {clubs.map(club => (
                  <li
                    key={club.id}
                    className="bg-gray-800/50 hover:bg-gray-700/50 p-3 rounded-lg cursor-pointer transition-all duration-300 border border-gray-700/50"
                    onClick={() => handleClubSelect(club.id)}
                  >
                    <div className="font-medium text-white">{club.name}</div>
                    <div className="text-sm text-blue-400">{club.category}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-sm">No clubs found</p>
            )}
          </div>
        </div>

        {/* Middle Column - Club Details with improved styling */}
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-xl border border-gray-700">
          {selectedClub ? (
            <>
              <h2 className="text-2xl font-bold mb-2">{selectedClub.name}</h2>
              <div className="mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {selectedClub.category}
                </span>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold text-lg">Description</h3>
                <p className="text-gray-300 mt-1">
                  {selectedClub.description || 'No description available.'}
                </p>
              </div>
              {selectedClub.location && (
                <div className="mb-4">
                  <h3 className="font-semibold text-lg">Location</h3>
                  <p className="text-gray-300 mt-1">{selectedClub.location}</p>
                </div>
              )}
              <div className="mb-4">
                <h3 className="font-semibold text-lg">Capacity</h3>
                <p className="text-gray-300 mt-1">
                  {selectedClub.capacity || 'Unlimited'}
                </p>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold text-lg mb-2">
                  Members ({selectedClub.members?.length || 0})
                </h3>
                {selectedClub.members && selectedClub.members.length > 0 ? (
                  <ul className="max-h-32 overflow-y-auto divide-y divide-gray-700">
                    {selectedClub.members.map((member, index) => (
                      <li key={index} className="py-2">
                        <div className="font-medium">
                          {member.user?.name || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-400 capitalize">
                          {member.role}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400">No members yet</p>
                )}
              </div>
              <div className="mb-4">
                <h3 className="font-semibold text-lg mb-2">Upcoming Events</h3>
                {selectedClub.events && selectedClub.events.length > 0 ? (
                  <ul className="max-h-32 overflow-y-auto divide-y divide-gray-700">
                    {selectedClub.events.map((event, index) => (
                      <li key={index} className="py-2">
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm text-gray-400">
                          {new Date(event.startDate).toLocaleDateString()}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400">No upcoming events</p>
                )}
              </div>
              {/* Join Club Form - Updated Styles */}
              <div className="mt-4">
                <h3 className="font-semibold text-lg mb-2">Join Club</h3>
                <form onSubmit={handleJoinClub}>
                  <div className="mb-3">
                    <input
                      type="text"
                      placeholder="User ID"
                      className="w-full px-4 py-2 rounded mb-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={userId}
                      onChange={e => setUserId(e.target.value)}
                      required
                    />
                    <select
                      className="w-full px-4 py-2 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={userRole}
                      onChange={e => setUserRole(e.target.value)}
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition-colors"
                    disabled={!userId}
                  >
                    Join Club
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">Select a club to view details</p>
            </div>
          )}
        </div>

        {/* Right Column - Create Club Form with improved styling */}
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-xl border border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-blue-400">
            Create New Club
          </h2>
          <form onSubmit={handleCreateClub} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Club Name
              </label>
              <input
                type="text"
                name="name"
                className="w-full px-4 py-2 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newClub.name}
                onChange={e => handleInputChange(e, setNewClub, newClub)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Description
              </label>
              <textarea
                name="description"
                rows="3"
                className="w-full px-4 py-2 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newClub.description}
                onChange={e => handleInputChange(e, setNewClub, newClub)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Category
              </label>
              <input
                type="text"
                name="category"
                placeholder="Enter category (e.g., Sports, Academic, Cultural)"
                className="w-full px-4 py-2 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newClub.category}
                onChange={e => handleInputChange(e, setNewClub, newClub)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Location
              </label>
              <input
                type="text"
                name="location"
                className="w-full px-4 py-2 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newClub.location}
                onChange={e => handleInputChange(e, setNewClub, newClub)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Capacity
              </label>
              <input
                type="number"
                name="capacity"
                min="0"
                className="w-full px-4 py-2 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newClub.capacity}
                onChange={e => handleInputChange(e, setNewClub, newClub)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Create Club
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Clubs;
