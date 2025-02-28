import React from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import ThemeToggle from "./ThemeToggle";
import { Award, Book, Brain, Terminal, Timer, Users } from "lucide-react";
export function Landing() {
  return (
    <div>
      {/* Header */}
      <header className="fixed w-full bg-yellow-50 dark:bg-[#18181b] backdrop-blur-sm py-4 z-50 transition-all duration-300">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-yellow-600 dark:text-yellow-200 hover:text-yellow-500 dark:hover:text-yellow-100 transition-colors duration-300">
            DoodleDuck
          </h1>
          <nav className="hidden md:flex space-x-6"></nav>
          <div className="flex space-x-4">
            <Link to="/sign-in">
              <button className="bg-yellow-600 dark:bg-yellow-200 hover:bg-yellow-500 dark:hover:bg-yellow-100 text-[#f5f5f5] dark:text-black px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-200/20">
                Get Started
              </button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 hover:scale-105"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-gray-900/70"></div>
        </div>
        <div className="relative container mx-auto px-4 py-32">
          <div className="max-w-3xl transform transition-all duration-700 hover:translate-x-2">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-yellow-200 animate-fade-in">
              Master Programming with Confidence
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Interactive learning platform with AI-powered guidance, real-time
              coding environments, and a supportive community to help you
              achieve your coding goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/sign-up">
                <button className="w-full sm:w-auto bg-yellow-200 hover:bg-yellow-300 text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-200/20">
                  Start Learning Now
                </button>
              </Link>
              <Link to="/courses">
                <button className="w-full sm:w-auto bg-transparent border-2 border-yellow-200 hover:bg-yellow-200/10 text-yellow-200 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-200/20">
                  Explore Courses
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
                number: "50K+",
                label: "Active Learners",
                description:
                  "Join our growing community of dedicated programmers",
              },
              {
                number: "200+",
                label: "Video Tutorials",
                description:
                  "High-quality, curated content for effective learning",
              },
              {
                number: "15+",
                label: "Programming Languages",
                description: "Comprehensive coverage of popular technologies",
              },
              {
                number: "98%",
                label: "Success Rate",
                description: "Our students achieve their learning goals",
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
            Everything You Need to Succeed
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <Terminal className="w-12 h-12 text-black dark:text-yellow-200 group-hover:text-gray-800 dark:group-hover:text-yellow-300 transition-colors duration-300" />
                ),
                title: "Interactive Code Editor",
                description:
                  "Write, compile, and test code directly in your browser with our powerful editor.",
              },
              {
                icon: (
                  <Brain className="w-12 h-12 text-black dark:text-yellow-200 group-hover:text-gray-800 dark:group-hover:text-yellow-300 transition-colors duration-300" />
                ),
                title: "AI-Powered Learning",
                description:
                  "Get personalized suggestions and help from our AI assistant as you code.",
              },
              {
                icon: (
                  <Book className="w-12 h-12 text-black dark:text-yellow-200 group-hover:text-gray-800 dark:group-hover:text-yellow-300 transition-colors duration-300" />
                ),
                title: "Comprehensive Curriculum",
                description:
                  "Structured learning paths for multiple programming languages and skill levels.",
              },
              {
                icon: (
                  <Timer className="w-12 h-12 text-black dark:text-yellow-200 group-hover:text-gray-800 dark:group-hover:text-yellow-300 transition-colors duration-300" />
                ),
                title: "Progress Tracking",
                description:
                  "Monitor your learning journey with detailed progress analytics.",
              },
              {
                icon: (
                  <Users className="w-12 h-12 text-black dark:text-yellow-200 group-hover:text-gray-800 dark:group-hover:text-yellow-300 transition-colors duration-300" />
                ),
                title: "Community Support",
                description:
                  "Connect with fellow learners and mentors in our active community.",
              },
              {
                icon: (
                  <Award className="w-12 h-12 text-black dark:text-yellow-200 group-hover:text-gray-800 dark:group-hover:text-yellow-300 transition-colors duration-300" />
                ),
                title: "Certification",
                description:
                  "Earn certificates upon completing courses and projects.",
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
                name: "Sarah Johnson",
                role: "Software Developer",
                image:
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
                quote:
                  "DoodleDuck helped me transition from a beginner to a confident developer. The AI suggestions are incredibly helpful!",
              },
              {
                name: "Michael Chen",
                role: "Computer Science Student",
                image:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
                quote:
                  "The interactive coding environment and community support made learning programming enjoyable and effective.",
              },
              {
                name: "Emily Rodriguez",
                role: "Web Developer",
                image:
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
                quote:
                  "The structured curriculum and progress tracking helped me stay motivated throughout my learning journey.",
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
                question: "What programming languages do you offer?",
                answer:
                  "We offer courses in Python, JavaScript, Java, C++, C#, and many more. Our curriculum is constantly expanding to include new languages and technologies.",
              },
              {
                question: "Is DoodleDuck suitable for complete beginners?",
                answer:
                  "Absolutely! Our platform is designed to accommodate learners of all levels, from complete beginners to advanced developers.",
              },
              {
                question: "How does the AI-powered learning assistance work?",
                answer:
                  "Our AI system analyzes your code in real-time, providing personalized suggestions, identifying potential errors, and offering optimization tips.",
              },
              {
                question: "Can I access the platform on mobile devices?",
                answer:
                  "Yes, DoodleDuck is fully responsive and can be accessed on any device with a web browser.",
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
                DoodleDuck
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
                    path: "https://github.com/N4M154/Design_Project-I-SWE-4506",
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
          {/* <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-800 dark:text-gray-400">
            <p>© 2024 DoodleDuck. All rights reserved.</p>
          </div> */}
        </div>
      </footer>
      <Footer/>
    </div>
  );
}

export default Landing;
