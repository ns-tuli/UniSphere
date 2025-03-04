import NewsModel from '../models/newsModel.js';

const readArticle = async (req, res) => {
  const { topics } = req.body; // Assuming topics are sent as an array in the request body
  
  if (!topics || topics.length === 0) {
    return res.status(400).json({ message: 'Please provide at least one topic' });
  }

  try {
    const articles = await NewsModel.getLatestNews(topics);
    return res.status(200).json({ articles });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching news articles' });
  }
};

export default { readArticle };
