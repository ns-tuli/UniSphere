import React, { useState } from "react";
import axios from "axios";

const NewsPortal = () => {
  const [topics, setTopics] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/news", // Update this to match the backend route
        { topics }
      );

      setArticles(response.data.articles);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">News Portal</h1>
      <div>
        <input
          type="text"
          placeholder="Enter topics"
          className="input input-bordered w-full mb-4"
          onChange={(e) => setTopics(e.target.value.split(","))}
        />
        <button onClick={handleSubmit} className="btn btn-primary w-full">
          Get Latest News
        </button>
      </div>

      {loading ? (
        <p className="text-center mt-4">Loading...</p>
      ) : (
        <div className="mt-6">
          {articles.length > 0 ? (
            articles.map((article, index) => (
              <div key={index} className="border-b pb-4 mb-4">
                <h2 className="text-xl font-semibold">{article.title}</h2>
                <p>{article.description}</p>
                <a href={article.url} target="_blank" className="text-blue-500">
                  Read more
                </a>
              </div>
            ))
          ) : (
            <p>No articles found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NewsPortal;
