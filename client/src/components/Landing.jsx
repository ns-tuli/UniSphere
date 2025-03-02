import React from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import { Award, Book, Brain, Terminal, Timer, Users } from "lucide-react";
import Header from "./Header";

export function Landing() {
  return (
    <div>
      <Header />
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 hover:scale-105"
          style={{
            backgroundImage:
              "url('https://i.pinimg.com/736x/be/d8/eb/bed8eb366f4cf15e85220a1f2ca4f703.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-gray-900/70"></div>
        </div>
        <div className="relative container mx-auto px-4 py-32">
          <div className="max-w-3xl transform transition-all duration-700 hover:translate-x-2">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-yellow-200 animate-fade-in">
              Welcome to UniSphere!
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              All-in-One University App – Revolutionizing every student's life
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/Auth">
                <button className="w-full sm:w-auto bg-yellow-200 hover:bg-yellow-300 text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-200/20">
                  Let's Get Started
                </button>
              </Link>
              <Link to="/HomePage">
                <button className="w-full sm:w-auto bg-transparent border-2 border-yellow-200 hover:bg-yellow-200/10 text-yellow-200 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-200/20">
                  Explore
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-[#f5f5f5] dark:bg-[#18181b] py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                number: "50+",
                label: "Cafeteria Menu Items",
                description: "Daily updated menu with pricing and availability",
              },
              {
                number: "100+",
                label: "Bus Schedules",
                description: "Real-time bus tracking and route information",
              },
              {
                number: "500+",
                label: "Class Timetable Entries",
                description: "Up-to-date schedules with faculty details",
              },
              {
                number: "20+",
                label: "Campus Navigation Features",
                description:
                  "AR maps and GPS-based navigation for easy movement",
              },
              {
                number: "1000+",
                label: "Club & Event Announcements",
                description:
                  "AI-integrated chatbot for real-time event updates",
              },
              {
                number: "99%",
                label: "Learning Support",
                description:
                  "Video calls, online whiteboard, and text-based coding sessions",
              },
              {
                number: "200+",
                label: "Skill-Specific Courses",
                description:
                  "Personalized learning paths for university students",
              },
              {
                number: "95%",
                label: "Student Engagement",
                description:
                  "Collaborative text editor and interactive quiz system",
              },
              {
                number: "1000+",
                label: "Complaints Resolved",
                description:
                  "Secure complaint system for hall, security, and academic issues",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-yellow-100 p-8 rounded-2xl transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl dark:hover:shadow-yellow-200 dark:hover:shadow-lg group"
              >
                <div className="text-5xl font-bold text-black mb-2 group-hover:text-yellow-800 transition-colors duration-300">
                  {stat.number}
                </div>
                <div className="text-xl font-semibold text-gray-700 mb-2">
                  {stat.label}
                </div>
                <div className="text-gray-600">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-black dark:text-yellow-200 mb-16 transform transition-all duration-500 hover:scale-105">
            Everything You Need in One Platform
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <Terminal className="w-12 h-12 text-black dark:text-yellow-200 group-hover:text-gray-800 dark:group-hover:text-yellow-300 transition-colors duration-300" />
                ),
                title: "Cafeteira Menu",
                description:
                  "enjoy your meal and get the best food in the cafeteria.",
              },
              {
                icon: (
                  <Brain className="w-12 h-12 text-black dark:text-yellow-200 group-hover:text-gray-800 dark:group-hover:text-yellow-300 transition-colors duration-300" />
                ),
                title: "AI-Powered Learning and take quizzes",
                description:
                  "Get personalized suggestions and help from our AI assistant as you code.",
              },
              {
                icon: (
                  <Book className="w-12 h-12 text-black dark:text-yellow-200 group-hover:text-gray-800 dark:group-hover:text-yellow-300 transition-colors duration-300" />
                ),
                title: "courses to get skilled",
                description: "course to get skilled and learn new things.",
              },
              {
                icon: (
                  <Timer className="w-12 h-12 text-black dark:text-yellow-200 group-hover:text-gray-800 dark:group-hover:text-yellow-300 transition-colors duration-300" />
                ),
                title: "Bus Schedules",
                description: "monitor the bus schedules.",
              },
              {
                icon: (
                  <Users className="w-12 h-12 text-black dark:text-yellow-200 group-hover:text-gray-800 dark:group-hover:text-yellow-300 transition-colors duration-300" />
                ),
                title: "complaint box",
                description:
                  "secure complaint system for hall, security, and academic issues.",
              },
              {
                icon: (
                  <Award className="w-12 h-12 text-black dark:text-yellow-200 group-hover:text-gray-800 dark:group-hover:text-yellow-300 transition-colors duration-300" />
                ),
                title: "personalized study zone",
                description:
                  "get personalized study zone and learn at your own pace.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-yellow-50 dark:bg-gray-800 p-8 rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg"
              >
                <div className="mb-6 transform transition-all duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold text-yellow-800 dark:text-yellow-200 mb-4 dark:group-hover:text-yellow-300 group-hover:text-yellow-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-[#f5f5f5] dark:bg-[#18181b]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-yellow-700 dark:text-yellow-200 mb-16 transform transition-all duration-500 hover:scale-105">
            What Our Users Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Raisa Hasan",
                role: "CSE 3rd year",
                image:
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
                quote:
                  "UniSphere helped me transition from a beginner to a confident developer. The AI suggestions are incredibly helpful!",
              },
              {
                name: "Tasnim Akhter",
                role: "Mechanical 2nd year",
                image:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
                quote:
                  "The interactive  environment and community support made learning enjoyable and effective.",
              },
              {
                name: "Tasnim Hossain Orna",
                role: "IPE 4rth year",
                image:
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
                quote:
                  "I love the variety of courses available on UniSphere. It's a great platform for students to learn and grow together.",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="group bg-gray-300 dark:bg-gray-800 p-8 rounded-2xl transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl dark:shadow-black dark:hover:shadow-black"
              >
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full mr-4 transform transition-all duration-300 group-hover:scale-110"
                  />
                  <div>
                    <h4 className="text-xl font-semibold text-black dark:text-yellow-300 group-hover:text-gray-600 dark:group-hover:text-yellow-100 transition-colors duration-300">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 group-hover:text-gray-500 dark:group-hover:text-gray-100 transition-colors duration-300">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-yellow-50 italic group-hover:text-gray-800 dark:group-hover:text-yellow-100 transition-colors duration-300">
                  "{testimonial.quote}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-black dark:text-yellow-200 mb-16 transform transition-all duration-500 hover:scale-105">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "What features does the campus app offer?",
                answer:
                  "It includes cafeteria menus, bus schedules, class timetables, faculty contacts, campus navigation, AR maps, alerts, event management, virtual classrooms, note-taking, and a chatbot.",
              },
              {
                question: "How does the event management system work?",
                answer:
                  "AI recommends events based on interests, and announcements automatically appear in chatbot prompts for easy access.",
              },
              {
                question:
                  "Can students report complaints or security concerns?",
                answer:
                  "Yes, the complaint box allows reporting of security, hall, and mental health issues, along with career guidance support.",
              },
              {
                question: "Does the app support real-time collaboration?",
                answer:
                  "Yes, students can use a collaborative text editor with Socket.io for group coding and learning.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="group bg-yellow-50 dark:bg-gray-800 rounded-2xl p-8 transform transition-all duration-300 hover:scale-102 shadow-lg dark:shadow-black hover:shadow-xl dark:hover:shadow-black"
              >
                <h3 className="text-xl font-semibold text-yellow-800 dark:text-yellow-300 mb-4 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors duration-300">
                  {faq.question}
                </h3>
                <p className="text-gray-800 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200  transition-colors duration-300">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-yellow-50 dark:bg-[#18181b] py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="transform transition-all duration-300 hover:translate-x-2">
              <h3 className="text-xl font-bold text-yellow-600 dark:text-yellow-200 mb-4">
                UniSphere
              </h3>
              <p className="text-gray-800 dark:text-gray-400">
                Empowering developers through interactive learning and
                AI-powered guidance.
              </p>
            </div>
            {[
              {
                title: "Quick Links",
                links: [
                  { name: "Courses", path: "/courses" },
                  { name: "Pricing", path: "/pricing" },
                  { name: "About Us", path: "/about" },
                  { name: "Contact", path: "/contact" },
                ],
              },
              {
                title: "Resources",
                links: [
                  { name: "Blog", path: "/blog" },
                  { name: "Documentation", path: "/documentation" },
                  { name: "Tutorials", path: "/tutorials" },
                  { name: "FAQ", path: "/faq" },
                ],
              },
              {
                title: "Connect",
                links: [
                  {
                    name: "GitHub",
                    path: "https://github.com/Siyam-Bhuiyan/UniSphere",
                  },
                  { name: "Twitter", path: "#" },
                  { name: "LinkedIn", path: "#" },
                  { name: "Discord", path: "#" },
                ],
              },
            ].map((section, index) => (
              <div
                key={index}
                className="transform transition-all duration-300 hover:translate-x-2"
              >
                <h4 className="font-semibold text-yellow-600 dark:text-yellow-200 mb-4">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        to={link.path}
                        className="text-gray-800 dark:text-gray-400 hover:text-yellow-700 dark:hover:text-yellow-100 transition-colors duration-300"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-800 dark:text-gray-400">
            <p>© 2025 UniSphere. All rights reserved.</p>
          </div>
        </div>
      </footer>
      <Footer />
    </div>
  );
}

export default Landing;
