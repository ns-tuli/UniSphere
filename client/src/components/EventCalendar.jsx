import React from "react";

const events = [
  {
    id: 1,
    title: "Coding Workshop",
    date: "2024-10-15",
    location: "Room 202",
    description: "Learn advanced coding techniques from industry experts.",
  },
  {
    id: 2,
    title: "Career Fair",
    date: "2024-11-20",
    location: "Main Hall",
    description: "Meet top employers and explore job opportunities.",
  },
  {
    id: 3,
    title: "Hackathon",
    date: "2024-12-05",
    location: "Tech Lab",
    description: "Compete in a 24-hour coding challenge.",
  },
];

export default function EventCalendar() {
  return (
    <div className="p-8 bg-yellow-50 dark:bg-[#18181b] min-h-screen">
      <h2 className="text-3xl font-bold text-yellow-600 dark:text-yellow-200 mb-6">
        Upcoming Events
      </h2>
      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <h3 className="text-xl font-semibold text-yellow-800 dark:text-yellow-200">
              {event.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{event.date}</p>
            <p className="text-gray-600 dark:text-gray-400">{event.location}</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {event.description}
            </p>
            <button className="mt-4 bg-yellow-600 dark:bg-yellow-200 text-white dark:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 dark:hover:bg-yellow-100 transition-colors duration-300">
              RSVP
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}