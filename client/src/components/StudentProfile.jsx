import React, { useEffect, useState } from 'react';
import {
  FaBook,
  FaCalendar,
  FaEnvelope,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaPhone,
  FaUser,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const StudentProfile = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    studentId: user?.studentId || '',
    department: user?.department || '',
    semester: 'Spring 2024',
    phone: user?.phone || '',
    address: user?.address || '',
    cgpa: '3.85',
    credits: '45',
    enrollmentDate: user?.joinDate || '',
    currentCourses: [{ code: '', name: '', credits: '' }],
    achievements: [''],
  });
  useEffect(() => {
    data();
  });

  const data = async () => {
    const res = await fetch('http://localhost:5000/api/student', {
      method: 'POST', // Change to POST to send a request body
      headers: {
        'Content-Type': 'application/json',
      },
      // Pass the userId in the request body as JSON
      body: JSON.stringify({ id: user._id }),
    });

    if (!res.ok) {
      throw new Error('User not found');
    }
    const data = await res.json(); // Correct usage; no parameters here
    setUserData(data);
  };
  console.log('Address', userData?.address);

  if (!user) {
    return navigate('/auth');
  }

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  console.log(data);
  const handleCourseChange = (index, field, value) => {
    setFormData(prev => {
      const newCourses = [...prev.currentCourses];
      newCourses[index] = { ...newCourses[index], [field]: value };
      return { ...prev, currentCourses: newCourses };
    });
  };

  const handleAchievementChange = (index, value) => {
    setFormData(prev => {
      const newAchievements = [...prev.achievements];
      newAchievements[index] = value;
      return { ...prev, achievements: newAchievements };
    });
  };

  const addCourse = () => {
    setFormData(prev => ({
      ...prev,
      currentCourses: [
        ...prev.currentCourses,
        { code: '', name: '', credits: '' },
      ],
    }));
  };

  const addAchievement = () => {
    setFormData(prev => ({
      ...prev,
      achievements: [...prev.achievements, ''],
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (!user) {
        throw new Error('User ID not found');
      }

      const response = await fetch(`http://localhost:5000/api/student`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          id: user._id,
          studentId: formData.studentId,
          department: formData.department,
          phone: formData.phone,
          address: formData.address,
          cgpa: formData.cgpa,
          currentCourses: formData.currentCourses.filter(
            course => course.code && course.name && course.credits,
          ),
          achievements: formData.achievements.filter(achievement =>
            achievement.trim(),
          ),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update profile');
      }

      const updatedData = await response.json();

      // Update the user context with the new data
      updateUser({
        ...user,
        ...updatedData,
      });

      // Show success message
      alert('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const studentData = {
    name: user.name,
    email: user.email,
    picture: user.picture,
    studentId: user.studentId,
    department: user.department,
    semester: user.semester,
    phone: user.phone,
    address: user.address,
    cgpa: user.cgpa,
    credits: user.credits,
    enrollmentDate: user.joinDate,
    currentCourses: user.currentCourses || [''],
    achievements: user.achievement || [''],
  };
  console.log(studentData);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 mr-4"
            >
              Edit Profile
            </button>
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
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                  <FaUser className="w-16 h-16 text-yellow-600 dark:text-yellow-200" />
                </div>
              )}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.name}
              </h1>
              <p className="text-yellow-600 dark:text-yellow-400">
                {user.email}
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                {user.studentId || 'Student ID not set'}
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                Joined: {new Date(user.joinDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Edit Profile
                  </h2>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Student ID
                    </label>
                    <input
                      type="text"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Department
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      CGPA
                    </label>
                    <input
                      type="text"
                      name="cgpa"
                      value={formData.cgpa}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                    />
                  </div>
                </div>

                {/* Current Courses Section */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Courses
                  </label>
                  {formData.currentCourses.map((course, index) => (
                    <div key={index} className="grid grid-cols-3 gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Course Code"
                        value={course.code}
                        onChange={e =>
                          handleCourseChange(index, 'code', e.target.value)
                        }
                        className="rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                      />
                      <input
                        type="text"
                        placeholder="Course Name"
                        value={course.name}
                        onChange={e =>
                          handleCourseChange(index, 'name', e.target.value)
                        }
                        className="rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                      />
                      <input
                        type="number"
                        placeholder="Credits"
                        value={course.credits}
                        onChange={e =>
                          handleCourseChange(index, 'credits', e.target.value)
                        }
                        className="rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addCourse}
                    className="mt-2 text-sm text-yellow-600 hover:text-yellow-700"
                  >
                    + Add Course
                  </button>
                </div>

                {/* Achievements Section */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Achievements
                  </label>
                  {formData.achievements.map((achievement, index) => (
                    <div key={index} className="mb-2">
                      <input
                        type="text"
                        value={achievement}
                        onChange={e =>
                          handleAchievementChange(index, e.target.value)
                        }
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addAchievement}
                    className="mt-2 text-sm text-yellow-600 hover:text-yellow-700"
                  >
                    + Add Achievement
                    {user?._id}
                  </button>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-4 py-2 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Academic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Academic Information
            </h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FaGraduationCap className="text-yellow-600 dark:text-yellow-400" />
                <span className="text-gray-600 dark:text-gray-300">
                  CGPA: {userData?.cgpa}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <FaBook className="text-yellow-600 dark:text-yellow-400" />
                <span className="text-gray-600 dark:text-gray-300">
                  Credits Completed: {user.credits}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <FaCalendar className="text-yellow-600 dark:text-yellow-400" />
                <span className="text-gray-600 dark:text-gray-300">
                  Current Semester: {userData?.semester}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Contact Information
            </h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-yellow-600 dark:text-yellow-400" />
                <span className="text-gray-600 dark:text-gray-300">
                  {user.email}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhone className="text-yellow-600 dark:text-yellow-400" />
                <span className="text-gray-600 dark:text-gray-300">
                  {userData?.phone}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <FaMapMarkerAlt className="text-yellow-600 dark:text-yellow-400" />
                <span className="text-gray-600 dark:text-gray-300">
                  {userData?.address}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Current Courses */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Current Courses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studentData.currentCourses.map((course, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <h3 className="font-semibold text-yellow-600 dark:text-yellow-400">
                  {course.code}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {course.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Credits: {course.credits}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Achievements
            {user?._id}
          </h2>
          <div className="space-y-2">
            {studentData.achievements.map((achievement, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-yellow-600 dark:bg-yellow-400 rounded-full"></span>
                <span className="text-gray-600 dark:text-gray-300">
                  {achievement}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
