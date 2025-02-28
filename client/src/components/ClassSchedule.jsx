import React from "react";

const classes = [
  {
    id: 1,
    name: "Introduction to Programming",
    time: "9:00 AM - 10:30 AM",
    location: "Room 101",
    instructor: "Dr. Smith",
  },
  {
    id: 2,
    name: "Data Structures",
    time: "11:00 AM - 12:30 PM",
    location: "Room 202",
    instructor: "Prof. Johnson",
  },
  {
    id: 3,
    name: "Web Development",
    time: "2:00 PM - 3:30 PM",
    location: "Room 303",
    instructor: "Ms. Lee",
  },
];

export default function ClassSchedule() {
  return (
    <div className="p-8 bg-yellow-50 dark:bg-[#18181b] min-h-screen">
      <h2 className="text-3xl font-bold text-yellow-600 dark:text-yellow-200 mb-6">
        Class Schedule
      </h2>
      <div className="space-y-4">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <h3 className="text-xl font-semibold text-yellow-800 dark:text-yellow-200">
              {cls.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{cls.time}</p>
            <p className="text-gray-600 dark:text-gray-400">{cls.location}</p>
            <p className="text-gray-600 dark:text-gray-400">
              Instructor: {cls.instructor}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}