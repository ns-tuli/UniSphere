import React from 'react';

const ClubCard = ({ club }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-xl font-bold">{club.name}</h3>
      <p className="text-gray-600">{club.description}</p>
      <div className="mt-2">
        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
          {club.category}
        </span>
      </div>
    </div>
  );
};

export default ClubCard;
