import React, { useState } from 'react';
import { FaThumbsUp, FaComment, FaCheck, FaSearch, FaTag } from 'react-icons/fa';

export default function Forums() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "How to prepare for Database Systems midterm?",
      author: "Sarah Chen",
      timestamp: "2h ago",
      content: "I'm struggling with normalization concepts. Any tips or study resources?",
      tags: ["Database", "Exams", "Study Tips"],
      upvotes: 24,
      comments: 8,
      isSolved: true,
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
    },
    {
      id: 2,
      title: "Looking for Algorithm project teammates",
      author: "Mike Ross",
      timestamp: "5h ago",
      content: "Need 2 more people for the graph theory implementation project...",
      tags: ["Algorithms", "Projects", "Team Building"],
      upvotes: 15,
      comments: 12,
      isSolved: false,
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike"
    }
  ]);

  const categories = [
    { name: "All Topics", count: 156 },
    { name: "Academics", count: 64 },
    { name: "Campus Life", count: 42 },
    { name: "Projects", count: 28 },
    { name: "Events", count: 22 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discussion Forums</h1>
          <p className="text-gray-600">Join the conversation, ask questions, and share your knowledge</p>
        </div>

        {/* Search and Create Post */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search discussions..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Start New Discussion
          </button>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Categories */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="font-semibold text-gray-800 mb-4">Categories</h2>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.name}>
                    <a
                      href="#"
                      className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-50 transition-colors duration-200"
                    >
                      <span className="text-gray-700">{category.name}</span>
                      <span className="bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main Content - Posts */}
          <div className="lg:w-3/4">
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow-sm p-6 transition-all duration-200 hover:shadow-md">
                  <div className="flex items-start space-x-4">
                    <img
                      src={post.authorAvatar}
                      alt={post.author}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {post.title}
                          {post.isSolved && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <FaCheck className="mr-1" /> Solved
                            </span>
                          )}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">
                        Posted by {post.author} • {post.timestamp}
                      </p>
                      <p className="text-gray-700 mb-4">{post.content}</p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700"
                          >
                            <FaTag className="mr-1 text-xs" /> {tag}
                          </span>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                          <FaThumbsUp />
                          <span>{post.upvotes}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                          <FaComment />
                          <span>{post.comments} Comments</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
