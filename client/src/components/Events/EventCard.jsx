import React from 'react';

const EventCard = ({ event }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-xl font-bold">{event.title}</h3>
      <p className="text-gray-600">{event.description}</p>
      <div className="mt-2 space-y-1">
        <p className="text-sm">📍 {event.location}</p>
        <p className="text-sm">
          🗓️ {new Date(event.startDate).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default EventCard;
