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
  FaUser,
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

        {/* Faculty Grid - Updated with more compact and elegant cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFaculty.map((faculty) => (
            <div
              key={faculty._id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:translate-y-1 max-w-sm mx-auto w-full"
            >
              {/* Card Header with Image */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
                {faculty.image?.url ? (
                  <img
                    src={faculty.image.url}
                    alt={faculty.name}
                    className="w-full h-56 object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-56 flex items-center justify-center bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800">
                    <FaUser className="w-20 h-20 text-yellow-600 dark:text-yellow-400 opacity-60" />
                  </div>
                )}
                
                {/* Name and Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h3 className="text-xl font-bold text-white">
                    {faculty.name}
                  </h3>
                  <p className="text-yellow-300 font-medium">
                    {faculty.position}
                  </p>
                </div>
              </div>
              
              {/* Card Content */}
              <div className="p-5">
                <div className="space-y-2.5 mb-4">
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <FaBuilding className="mr-2 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                    <span className="text-sm">{faculty.department}</span>
                  </div>
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <FaEnvelope className="mr-2 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                    <a
                      href={`mailto:${faculty.email}`}
                      className="text-sm hover:text-yellow-600 truncate"
                    >
                      {faculty.email}
                    </a>
                  </div>
                  {faculty.phone && (
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <FaPhone className="mr-2 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                      <span className="text-sm">{faculty.phone}</span>
                    </div>
                  )}
                  {faculty.officeHours && (
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <FaClock className="mr-2 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                      <span className="text-sm">{faculty.officeHours}</span>
                    </div>
                  )}
                  {faculty.education && (
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <FaGraduationCap className="mr-2 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                      <span className="text-sm">{faculty.education}</span>
                    </div>
                  )}
                </div>

                {/* Expertise Tags */}
                {faculty.expertise && faculty.expertise.length > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">
                      Expertise
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {faculty.expertise.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 rounded-full text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Social Links */}
                <div className="flex justify-center space-x-4 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                  {faculty.linkedin && (
                    <a
                      href={faculty.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <FaLinkedin size={20} />
                    </a>
                  )}
                  {faculty.googleScholar && (
                    <a
                      href={faculty.googleScholar}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-600 hover:text-red-700 transition-colors"
                    >
                      <FaGoogle size={20} />
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