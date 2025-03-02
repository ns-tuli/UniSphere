import React, { useState } from 'react';
import { FaSearch, FaEnvelope, FaPhone, FaLinkedin, FaGoogle, FaBuilding, FaClock, FaGraduationCap } from 'react-icons/fa';

const FacultyContact = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const departments = [
    'Computer Science',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Business Administration',
    'Mathematics',
    'Physics'
  ];

  const facultyMembers = [
    {
      id: 1,
      name: "Prof. Dr. Ahmad Rahman",
      department: "Computer Science",
      position: "Head of Department",
      expertise: ["Software Engineering", "Cybersecurity", "Cloud Computing"],
      email: "ahmad.rahman@iub.edu.bd",
      phone: "+880 1712-345678",
      officeHours: "Sunday & Tuesday: 2:00 PM - 4:00 PM",
      office: "CS Building, Room 501",
      education: "Ph.D. in Computer Science, Stanford University",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      linkedin: "https://linkedin.com/in/ahmad-rahman",
      googleScholar: "https://scholar.google.com/ahmad-rahman"
    },
    {
      id: 2,
      name: "Dr. Fatima Khan",
      department: "Electrical Engineering",
      position: "Associate Professor",
      expertise: ["Power Systems", "Renewable Energy", "Smart Grid"],
      email: "fatima.khan@iub.edu.bd",
      phone: "+880 1723-456789",
      officeHours: "Monday & Wednesday: 11:00 AM - 1:00 PM",
      office: "EEE Building, Room 302",
      education: "Ph.D. in Electrical Engineering, MIT",
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      linkedin: "https://linkedin.com/in/fatima-khan",
      googleScholar: "https://scholar.google.com/fatima-khan"
    },
    {
      id: 3,
      name: "Dr. Kamal Hossain",
      department: "Mathematics",
      position: "Professor",
      expertise: ["Applied Mathematics", "Statistics", "Data Analysis"],
      email: "kamal.hossain@iub.edu.bd",
      phone: "+880 1734-567890",
      officeHours: "Tuesday & Thursday: 10:00 AM - 12:00 PM",
      office: "Math Building, Room 205",
      education: "Ph.D. in Mathematics, University of Cambridge",
      image: "https://randomuser.me/api/portraits/men/3.jpg",
      linkedin: "https://linkedin.com/in/kamal-hossain",
      googleScholar: "https://scholar.google.com/kamal-hossain"
    },
    {
      id: 4,
      name: "Dr. Nadia Islam",
      department: "Business Administration",
      position: "Assistant Professor",
      expertise: ["Marketing", "Business Strategy", "Digital Commerce"],
      email: "nadia.islam@iub.edu.bd",
      phone: "+880 1745-678901",
      officeHours: "Wednesday & Thursday: 2:30 PM - 4:30 PM",
      office: "Business School, Room 405",
      education: "Ph.D. in Business Administration, Harvard Business School",
      image: "https://randomuser.me/api/portraits/women/4.jpg",
      linkedin: "https://linkedin.com/in/nadia-islam",
      googleScholar: "https://scholar.google.com/nadia-islam"
    },
    {
      id: 5,
      name: "Prof. Dr. Rashid Ahmed",
      department: "Physics",
      position: "Professor",
      expertise: ["Quantum Physics", "Theoretical Physics", "Nuclear Physics"],
      email: "rashid.ahmed@iub.edu.bd",
      phone: "+880 1756-789012",
      officeHours: "Sunday & Tuesday: 9:00 AM - 11:00 AM",
      office: "Physics Building, Room 301",
      education: "Ph.D. in Physics, California Institute of Technology",
      image: "https://randomuser.me/api/portraits/men/5.jpg",
      linkedin: "https://linkedin.com/in/rashid-ahmed",
      googleScholar: "https://scholar.google.com/rashid-ahmed"
    },
    {
        id: 6,
        name: "Dr. Ayesha Siddika",
        department: "Mechanical Engineering",
        position: "Associate Professor",
        expertise: ["Thermodynamics", "Fluid Mechanics", "Heat Transfer"],
        email: "Ayesha@gmail.com",
        phone: "+880 1756-789012",
        officeHours: "Sunday & Tuesday: 9:00 AM - 11:00 AM",
        office: "Physics Building, Room 301",
        education: "Ph.D. in Physics, California Institute of Technology",
        image: "https://randomuser.me/api/portraits/women/5.jpg",
        linkedin: "https://linkedin.com/in/rashid-ahmed",
        googleScholar: "https://scholar.google.com/rashid-ahmed"
    }
  ];

  const filteredFaculty = facultyMembers.filter(faculty => {
    const matchesSearch = faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || faculty.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Faculty Directory
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Connect with our distinguished faculty members and explore their expertise, research interests, and office hours.
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
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        {/* Faculty Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFaculty.map((faculty) => (
            <div key={faculty.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105">
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={faculty.image}
                    alt={faculty.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-yellow-500"
                  />
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
                    <a href={`mailto:${faculty.email}`} className="hover:text-yellow-600">
                      {faculty.email}
                    </a>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <FaPhone className="mr-2" />
                    <span>{faculty.phone}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <FaClock className="mr-2" />
                    <span>{faculty.officeHours}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <FaGraduationCap className="mr-2" />
                    <span>{faculty.education}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Expertise</h4>
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

                <div className="flex justify-center space-x-4 mt-6">
                  <a
                    href={faculty.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <FaLinkedin size={24} />
                  </a>
                  <a
                    href={faculty.googleScholar}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-600 hover:text-red-700"
                  >
                    <FaGoogle size={24} />
                  </a>
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