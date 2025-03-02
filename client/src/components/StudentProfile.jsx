//path: client/src/components/StudentProfile.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaIdCard, FaCalendar, FaMapMarkerAlt, FaBook } from 'react-icons/fa';
import { useUser } from '../context/UserContext';

const StudentProfile = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser();

  if (!user) {
    return navigate('/auth');
  }
  
  const studentData = {
    name: user.name,
    email: user.email,
    picture: user.picture,
    studentId: user.studentId || "2024-1234-567",
    department: user.department || "Computer Science & Engineering",
    semester: "Spring 2024",
    phone: user.phone || "+880 1712-345678",
    address: user.address || "Bashundhara R/A, Dhaka",
    cgpa: "3.85",
    credits: "45",
    enrollmentDate: user.joinDate || "January 2024",
    currentCourses:  [
      { code: "CSE303", name: "Database Management Systems", credits: 3 },
      { code: "CSE310", name: "Object Oriented Programming", credits: 3 },
      { code: "CSE315", name: "Web Technologies", credits: 3 },
      { code: "CSE320", name: "Software Engineering", credits: 3 }
    ],
    achievements: [
      "Dean's List - Fall 2023",
      "Programming Contest Winner",
      "Research Assistant"
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex justify-end mb-4">
            <button
              onClick={logout}
              className="px-4 py-2 text-sm text-red-600 hover:text-red-700"
            >
              Sign Out
            </button>
          </div>
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-32 h-32 rounded-full overflow-hidden">
              {user.picture ? (
                <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                  <FaUser className="w-16 h-16 text-yellow-600 dark:text-yellow-200" />
                </div>
              )}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
              <p className="text-yellow-600 dark:text-yellow-400">{user.email}</p>
              <p className="text-gray-500 dark:text-gray-400">
                {user.studentId || 'Student ID not set'}
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                Joined: {new Date(user.joinDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Academic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Academic Information</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FaGraduationCap className="text-yellow-600 dark:text-yellow-400" />
                <span className="text-gray-600 dark:text-gray-300">CGPA: {studentData.cgpa}</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaBook className="text-yellow-600 dark:text-yellow-400" />
                <span className="text-gray-600 dark:text-gray-300">Credits Completed: {studentData.credits}</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaCalendar className="text-yellow-600 dark:text-yellow-400" />
                <span className="text-gray-600 dark:text-gray-300">Current Semester: {studentData.semester}</span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-yellow-600 dark:text-yellow-400" />
                <span className="text-gray-600 dark:text-gray-300">{studentData.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhone className="text-yellow-600 dark:text-yellow-400" />
                <span className="text-gray-600 dark:text-gray-300">{studentData.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaMapMarkerAlt className="text-yellow-600 dark:text-yellow-400" />
                <span className="text-gray-600 dark:text-gray-300">{studentData.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Current Courses */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Current Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studentData.currentCourses.map((course, index) => (
              <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-semibold text-yellow-600 dark:text-yellow-400">{course.code}</h3>
                <p className="text-gray-600 dark:text-gray-300">{course.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Credits: {course.credits}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Achievements</h2>
          <div className="space-y-2">
            {studentData.achievements.map((achievement, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-yellow-600 dark:bg-yellow-400 rounded-full"></span>
                <span className="text-gray-600 dark:text-gray-300">{achievement}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;