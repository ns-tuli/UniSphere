// models/newsModel.js
import axios from 'axios';

const getLatestNews = async (topics) => {
  const apiKey = process.env.NEWS_API_KEY;
  const url = 'https://eventregistry.org/api/v1/article/getArticles';

  try {
    const response = await axios.post(
      url,
      {
        action: "getArticles",
        keyword: topics.join(' OR '),  // Using OR for multiple topics
        articlesPage: 1,
        articlesCount: 10,  // Limit to 10 articles
        articlesSortBy: "date",
        articlesSortByAsc: false,
        articlesArticleBodyLen: -1,  // Full article body
        resultType: "articles",
        dataType: ["news", "blog"],
        apiKey: apiKey,  // Event Registry typically uses apiKey in the request body
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    // Check if we have articles in the response
    if (response.data && response.data.articles && response.data.articles.results) {
      return response.data.articles.results;
    } else {
      console.log("API response structure:", JSON.stringify(response.data).substring(0, 200) + "...");
      return [];  // Return empty array if no articles found
    }
  } catch (error) {
    console.error("Error fetching news:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    throw error;
  }
};

export default { getLatestNews };