import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaEnvelope,
  FaPhone,
  FaLinkedin,
  FaGoogle,
  FaBuilding,
  FaClock,
  FaGraduationCap,
  FaUser, // Add this import
} from "react-icons/fa";
import { getFaculty } from "../api/faculty";

const FacultyContact = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [facultyMembers, setFacultyMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const departments = [
    "Computer Science",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Business Administration",
    "Mathematics",
    "Physics",
  ];

  // Fetch faculty data when component mounts
  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        setLoading(true);
        const data = await getFaculty();
        setFacultyMembers(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch faculty data. Please try again later.");
        console.error("Error fetching faculty:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFacultyData();
  }, []);

  const filteredFaculty = facultyMembers.filter((faculty) => {
    const matchesSearch =
      faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "all" || faculty.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-300">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Faculty Directory
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Connect with our distinguished faculty members and explore their
            expertise, research interests, and office hours.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or department..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 dark:bg-gray-800 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="w-full md:w-64 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 dark:bg-gray-800 dark:text-white"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* No Results Message */}
        {filteredFaculty.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              No faculty members found matching your criteria.
            </p>
          </div>
        )}

        {/* Faculty Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFaculty.map((faculty) => (
            <div
              key={faculty._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105"
            >
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                    <FaUser className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {faculty.name}
                    </h3>
                    <p className="text-yellow-600 dark:text-yellow-400 font-medium">
                      {faculty.position}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <FaBuilding className="mr-2" />
                    <span>{faculty.department}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <FaEnvelope className="mr-2" />
                    <a
                      href={`mailto:${faculty.email}`}
                      className="hover:text-yellow-600"
                    >
                      {faculty.email}
                    </a>
                  </div>
                  {faculty.phone && (
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <FaPhone className="mr-2" />
                      <span>{faculty.phone}</span>
                    </div>
                  )}
                  {faculty.officeHours && (
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <FaClock className="mr-2" />
                      <span>{faculty.officeHours}</span>
                    </div>
                  )}
                  {faculty.education && (
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <FaGraduationCap className="mr-2" />
                      <span>{faculty.education}</span>
                    </div>
                  )}
                </div>

                {faculty.expertise && faculty.expertise.length > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Expertise
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {faculty.expertise.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-center space-x-4 mt-6">
                  {faculty.linkedin && (
                    <a
                      href={faculty.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <FaLinkedin size={24} />
                    </a>
                  )}
                  {faculty.googleScholar && (
                    <a
                      href={faculty.googleScholar}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-600 hover:text-red-700"
                    >
                      <FaGoogle size={24} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FacultyContact;
