import React from "react";

const routes = [
  {
    id: 1,
    name: "Route A",
    schedule: "8:00 AM, 10:00 AM, 12:00 PM",
    status: "On Time",
  },
  {
    id: 2,
    name: "Route B",
    schedule: "9:00 AM, 11:00 AM, 1:00 PM",
    status: "Delayed by 10 mins",
  },
  {
    id: 3,
    name: "Route C",
    schedule: "10:00 AM, 12:00 PM, 2:00 PM",
    status: "On Time",
  },
];

export default function BusSchedule() {
  return (
    <div className="p-8 bg-yellow-50 dark:bg-[#18181b] min-h-screen">
      <h2 className="text-3xl font-bold text-yellow-600 dark:text-yellow-200 mb-6">
        Bus Routes & Schedules
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                Route
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                Schedule
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {routes.map((route) => (
              <tr
                key={route.id}
                className="hover:bg-yellow-50 dark:hover:bg-gray-700 transition-colors duration-300"
              >
                <td className="px-6 py-4 text-gray-800 dark:text-gray-400">
                  {route.name}
                </td>
                <td className="px-6 py-4 text-gray-800 dark:text-gray-400">
                  {route.schedule}
                </td>
                <td className="px-6 py-4 text-gray-800 dark:text-gray-400">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      route.status.includes("Delayed")
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {route.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}