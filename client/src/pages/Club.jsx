import React, { useEffect, useState } from 'react';

// Club Component
const Club = () => {
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [categories, setCategories] = useState([]);
  const URL = 'http://localhost:5000'; // Replace with your actual API URL

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await fetch(`${URL}/api/clubs`);
        const data = await response.json();
        setClubs(data);
      } catch (error) {
        console.error('Error fetching clubs:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch(`${URL}/api/clubs/categories`);
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchClubs();
    fetchCategories();
  }, [URL]);

  const fetchClubDetails = async id => {
    try {
      const response = await fetch(`${URL}/api/clubs/${id}`);
      const data = await response.json();
      setSelectedClub(data);
    } catch (error) {
      console.error('Error fetching club details:', error);
    }
  };

  const joinClub = async id => {
    try {
      const response = await fetch(`${URL}/api/clubs/${id}/join`, {
        method: 'POST',
      });
      const data = await response.json();
      alert(data.message || 'Joined club!');
    } catch (error) {
      console.error('Error joining club:', error);
    }
  };

  return (
    <div className="font-sans p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold text-center mb-8 text-gray-800">
        Clubs
      </h1>
      <select
        className="block w-full p-2 mb-8 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        onChange={e => console.log('Selected category:', e.target.value)}
      >
        <option value="">All</option>
        {categories.map((cat, index) => (
          <option key={index} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      {clubs.map(club => (
        <div
          key={club._id}
          className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow duration-300"
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            {club.name}
          </h2>
          <p className="text-gray-600 mb-4">{club.description}</p>
          <div className="flex space-x-2">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => fetchClubDetails(club._id)}
            >
              View Details
            </button>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => joinClub(club._id)}
            >
              Join Club
            </button>
          </div>
        </div>
      ))}
      {selectedClub && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            {selectedClub.name}
          </h2>
          <p className="text-gray-600 mb-4">{selectedClub.description}</p>
        </div>
      )}
    </div>
  );
};

export default Club;
