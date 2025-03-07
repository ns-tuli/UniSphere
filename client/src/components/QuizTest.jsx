import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faSpinner,
  faArrowRight,
  faArrowLeft,
  faLightbulb,
  faRedo,
  faTrophy,
  faCheck,
  faTimes,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";

const QuizTest = () => {
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState("medium");
  const [questionCount, setQuestionCount] = useState(5);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const inputRef = useRef(null);

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [quizStarted]);

  // Generate quiz questions based on the topic
  const generateQuiz = async () => {
    if (!topic.trim()) return;

    setIsLoading(true);
    try {
      // Format a prompt for the AI to generate quiz questions
      const message = `I want to test my knowledge on "${topic}". Please create a quiz with ${questionCount} ${difficulty} difficulty questions.

For each question, provide:
1. A clear, concise question
2. The correct answer

Format your response exactly like this example:
1. What is the capital of France?
Answer: Paris

2. Who wrote "Romeo and Juliet"?
Answer: William Shakespeare

Please make sure the questions are factually accurate and appropriate for ${difficulty} difficulty level.
- Easy: Basic facts and definitions
- Medium: More detailed knowledge and application of concepts
- Hard: Complex concepts, specific details, and challenging applications

ONLY provide the questions and answers in the numbered format above. Do not include any other text.`;

      // Use the same API endpoint as the Chatbot component
      const response = await axios.post("http://localhost:5000/api/chat", {
        message: message,
      });

      if (response.data && response.data.text) {
        // Parse the AI response to extract questions and answers
        const aiResponse = response.data.text;
        const parsedQuestions = parseQuestionsFromText(
          aiResponse,
          parseInt(questionCount)
        );

        if (parsedQuestions.length > 0) {
          setQuestions(parsedQuestions);
          setQuizStarted(true);
          setCurrentQuestionIndex(0);
          setUserAnswers({});
          setShowAnswer(false);
          setQuizCompleted(false);
          setScore(0);
        } else {
          alert(
            "Failed to generate quiz questions. Please try a different topic."
          );
        }
      } else {
        alert("Failed to generate quiz. Please try again.");
      }
    } catch (error) {
      console.error("Error generating quiz:", error);
      alert("Error generating quiz. Please try again later.");
    }
    setIsLoading(false);
  };

  // Parse questions and answers from AI text response
  const parseQuestionsFromText = (text, count) => {
    const questions = [];

    // Try to find numbered questions with "Answer:" format (our preferred format)
    const preferredPattern =
      /(\d+)\s*\.\s*([^?]+\??)\s*\n\s*Answer:\s*([^\n]+)/gi;
    let match;

    while (
      (match = preferredPattern.exec(text)) !== null &&
      questions.length < count
    ) {
      questions.push({
        question: match[2].trim(),
        answer: match[3].trim(),
      });
    }

    // If we couldn't find enough questions in the preferred format, try alternative patterns
    if (questions.length < count) {
      // Try to find numbered questions with any format
      const numberedPattern =
        /(\d+)[.)\]]\s+([^?]+\??)\s*(?:Answer:?\s*)?([^0-9\n]+)/gi;

      while (
        (match = numberedPattern.exec(text)) !== null &&
        questions.length < count
      ) {
        // Check if this question is already added
        const questionText = match[2].trim();
        if (!questions.some((q) => q.question === questionText)) {
          questions.push({
            question: questionText,
            answer: match[3].trim(),
          });
        }
      }
    }

    // If we still don't have enough questions, try to find question-answer pairs
    if (questions.length < count) {
      const qaPairs = text.split(/\n\s*\n/); // Split by empty lines

      for (const pair of qaPairs) {
        if (questions.length >= count) break;

        // Look for "Question:" and "Answer:" format
        const qaMatch = pair.match(
          /(?:Question:?\s*)?([^?]+\??)\s*(?:\n|:)\s*(?:Answer:?\s*)([^?]+)/i
        );
        if (qaMatch) {
          const questionText = qaMatch[1].trim();
          if (!questions.some((q) => q.question === questionText)) {
            questions.push({
              question: questionText,
              answer: qaMatch[2].trim(),
            });
          }
        }
      }
    }

    // If we still don't have enough questions, generate fallback questions
    if (questions.length < count) {
      const templates = [
        {
          q: `What is ${topic}?`,
          a: `${topic} is a concept or subject in its relevant field.`,
        },
        {
          q: `Who is associated with ${topic}?`,
          a: `Various experts and scholars have contributed to ${topic}.`,
        },
        {
          q: `When did ${topic} become significant?`,
          a: `${topic} gained significance at an important point in history.`,
        },
        {
          q: `Why is ${topic} important?`,
          a: `${topic} is important for various reasons in its field.`,
        },
        {
          q: `How does ${topic} work?`,
          a: `${topic} functions through specific processes relevant to its domain.`,
        },
        {
          q: `What are the main components of ${topic}?`,
          a: `${topic} consists of several key components or elements.`,
        },
        {
          q: `Where is ${topic} commonly found or used?`,
          a: `${topic} is commonly found or used in specific contexts.`,
        },
        {
          q: `What is a common misconception about ${topic}?`,
          a: `There are several misconceptions about ${topic} that experts have clarified.`,
        },
        {
          q: `How has ${topic} evolved over time?`,
          a: `${topic} has evolved significantly throughout its history.`,
        },
        {
          q: `What is the future of ${topic}?`,
          a: `Experts predict various developments in the future of ${topic}.`,
        },
      ];

      const neededCount = count - questions.length;
      for (let i = 0; i < neededCount; i++) {
        const template = templates[i % templates.length];
        questions.push({
          question: template.q,
          answer: template.a,
        });
      }
    }

    return questions.slice(0, count);
  };

  // Handle form submission to start the quiz
  const handleSubmit = (e) => {
    e.preventDefault();
    generateQuiz();
  };

  // Submit answer for the current question
  const submitAnswer = () => {
    if (!userAnswer.trim()) return;

    // Save the user's answer
    setUserAnswers({
      ...userAnswers,
      [currentQuestionIndex]: userAnswer,
    });

    // Check if the answer is correct
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = checkAnswer(userAnswer, currentQuestion.answer);

    if (isCorrect) {
      setFeedback("Correct! Well done!");
      setScore((prevScore) => prevScore + 1);
    } else {
      setFeedback(
        `Not quite. The correct answer is: ${currentQuestion.answer}`
      );
    }

    setShowAnswer(true);
    setUserAnswer("");
  };

  // Simple answer checking function
  const checkAnswer = (userAnswer, correctAnswer) => {
    if (!userAnswer || !correctAnswer) return false;

    // Convert both to lowercase and trim whitespace for comparison
    const normalizedUserAnswer = userAnswer.toLowerCase().trim();
    const normalizedCorrectAnswer = correctAnswer.toLowerCase().trim();

    // Exact match
    if (normalizedUserAnswer === normalizedCorrectAnswer) {
      return true;
    }

    // Check if the user's answer contains the correct answer or vice versa
    if (
      normalizedUserAnswer.includes(normalizedCorrectAnswer) ||
      normalizedCorrectAnswer.includes(normalizedUserAnswer)
    ) {
      return true;
    }

    // Check for key terms in the correct answer
    const correctAnswerWords = normalizedCorrectAnswer.split(/\s+/);
    const keyTerms = correctAnswerWords.filter(
      (word) =>
        word.length > 3 &&
        ![
          "this",
          "that",
          "with",
          "from",
          "have",
          "were",
          "they",
          "their",
          "what",
          "when",
          "where",
          "which",
          "there",
        ].includes(word)
    );

    // If the answer has at least 3 key terms, check if the user's answer contains at least 60% of them
    if (keyTerms.length >= 3) {
      const matchedTerms = keyTerms.filter((term) =>
        normalizedUserAnswer.includes(term)
      );
      if (matchedTerms.length / keyTerms.length >= 0.6) {
        return true;
      }
    }

    return false;
  };

  // Move to the next question
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowAnswer(false);
      setFeedback("");
      setUserAnswer("");
    } else {
      // Quiz completed
      setQuizCompleted(true);
    }
  };

  // Move to the previous question
  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowAnswer(false);
      setFeedback("");
      setUserAnswer(userAnswers[currentQuestionIndex - 1] || "");
    }
  };

  // Restart the quiz with the same topic
  const restartQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowAnswer(false);
    setScore(0);
    setFeedback("");
  };

  // Start a new quiz with a different topic
  const newQuiz = () => {
    setTopic("");
    setQuizStarted(false);
    setQuizCompleted(false);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowAnswer(false);
    setScore(0);
    setFeedback("");
  };

  // Calculate the percentage score
  const calculatePercentage = () => {
    return Math.round((score / questions.length) * 100);
  };

  // Get feedback based on the score percentage
  const getScoreFeedback = () => {
    const percentage = calculatePercentage();
    if (percentage >= 90) return "Outstanding! You've mastered this topic!";
    if (percentage >= 80)
      return "Excellent work! You have a strong understanding!";
    if (percentage >= 70) return "Good job! You know this topic well!";
    if (percentage >= 60) return "Nice effort! Keep studying to improve!";
    return "Keep practicing! You'll get better with more study!";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            <FontAwesomeIcon
              icon={faGraduationCap}
              className="mr-2 text-yellow-600"
            />
            Knowledge Quiz
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Test your knowledge on any topic with AI-generated questions
          </p>
        </div>

        {!quizStarted ? (
          /* Quiz Setup Form */
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="topic"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  What topic would you like to be quizzed on?
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter a topic (e.g., 'JavaScript Basics', 'World War II', 'Quantum Physics')"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label
                    htmlFor="difficulty"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Difficulty Level
                  </label>
                  <select
                    id="difficulty"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    disabled={isLoading}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="questionCount"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Number of Questions
                  </label>
                  <select
                    id="questionCount"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    disabled={isLoading}
                  >
                    <option value="3">3 Questions</option>
                    <option value="5">5 Questions</option>
                    <option value="10">10 Questions</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-3 px-4 rounded-lg shadow transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 disabled:opacity-50"
                disabled={isLoading || !topic.trim()}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className="animate-spin mr-2"
                    />
                    Generating Quiz...
                  </span>
                ) : (
                  "Start Quiz"
                )}
              </button>
            </form>
          </div>
        ) : quizCompleted ? (
          /* Quiz Results */
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8 text-center">
            <div className="mb-6">
              <div className="inline-block p-4 rounded-full bg-yellow-100 dark:bg-yellow-900 mb-4">
                <FontAwesomeIcon
                  icon={faTrophy}
                  className="text-4xl text-yellow-600 dark:text-yellow-400"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Quiz Completed!
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                You scored {score} out of {questions.length} (
                {calculatePercentage()}%)
              </p>
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                <p className="text-gray-800 dark:text-yellow-100 font-medium">
                  {getScoreFeedback()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={restartQuiz}
                className="flex items-center justify-center bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-3 px-4 rounded-lg shadow transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
              >
                <FontAwesomeIcon icon={faRedo} className="mr-2" />
                Retry Quiz
              </button>
              <button
                onClick={newQuiz}
                className="flex items-center justify-center bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg shadow transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              >
                <FontAwesomeIcon icon={faLightbulb} className="mr-2" />
                New Topic
              </button>
            </div>
          </div>
        ) : (
          /* Quiz Questions */
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Topic: {topic}
              </span>
            </div>

            <div className="mb-6">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {questions[currentQuestionIndex]?.question}
                </h2>
              </div>

              {!showAnswer ? (
                <div>
                  <div className="mb-4">
                    <label
                      htmlFor="answer"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Your Answer:
                    </label>
                    <input
                      ref={inputRef}
                      type="text"
                      id="answer"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Type your answer here..."
                      onKeyPress={(e) => e.key === "Enter" && submitAnswer()}
                    />
                  </div>
                  <button
                    onClick={submitAnswer}
                    className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-3 px-4 rounded-lg shadow transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 disabled:opacity-50"
                    disabled={!userAnswer.trim()}
                  >
                    <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                    Submit Answer
                  </button>
                </div>
              ) : (
                <div>
                  <div
                    className={`p-4 rounded-lg mb-4 ${
                      feedback.startsWith("Correct")
                        ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                        : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                    }`}
                  >
                    <div className="flex items-start">
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          feedback.startsWith("Correct")
                            ? "bg-green-100 dark:bg-green-800"
                            : "bg-red-100 dark:bg-red-800"
                        }`}
                      >
                        <FontAwesomeIcon
                          icon={
                            feedback.startsWith("Correct") ? faCheck : faTimes
                          }
                          className={
                            feedback.startsWith("Correct")
                              ? "text-green-600 dark:text-green-300"
                              : "text-red-600 dark:text-red-300"
                          }
                        />
                      </div>
                      <div className="ml-3">
                        <h3
                          className={`text-sm font-medium ${
                            feedback.startsWith("Correct")
                              ? "text-green-800 dark:text-green-200"
                              : "text-red-800 dark:text-red-200"
                          }`}
                        >
                          {feedback.split(".")[0]}
                        </h3>
                        <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                          <p>
                            Your answer:{" "}
                            <span className="font-medium">
                              {userAnswers[currentQuestionIndex]}
                            </span>
                          </p>
                          <p>
                            Correct answer:{" "}
                            <span className="font-medium">
                              {questions[currentQuestionIndex]?.answer}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={prevQuestion}
                      className="flex items-center justify-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                      disabled={currentQuestionIndex === 0}
                    >
                      <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                      Previous
                    </button>
                    <button
                      onClick={nextQuestion}
                      className="flex items-center justify-center bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg shadow transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                    >
                      {currentQuestionIndex < questions.length - 1 ? (
                        <>
                          Next
                          <FontAwesomeIcon
                            icon={faArrowRight}
                            className="ml-2"
                          />
                        </>
                      ) : (
                        <>
                          Finish Quiz
                          <FontAwesomeIcon icon={faTrophy} className="ml-2" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-yellow-600 h-2.5 rounded-full"
                    style={{
                      width: `${
                        ((currentQuestionIndex + 1) / questions.length) * 100
                      }%`,
                    }}
                  ></div>
                </div>
                <span className="ml-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  {Math.round(
                    ((currentQuestionIndex + 1) / questions.length) * 100
                  )}
                  %
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!quizStarted && (
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <ul className="space-y-3 text-gray-600 dark:text-gray-300">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center mr-2 mt-0.5">
                  <span className="text-yellow-600 dark:text-yellow-400 font-bold text-sm">
                    1
                  </span>
                </span>
                <span>Enter any topic you want to be quizzed on</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center mr-2 mt-0.5">
                  <span className="text-yellow-600 dark:text-yellow-400 font-bold text-sm">
                    2
                  </span>
                </span>
                <span>
                  Our AI will generate custom questions based on your topic
                </span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center mr-2 mt-0.5">
                  <span className="text-yellow-600 dark:text-yellow-400 font-bold text-sm">
                    3
                  </span>
                </span>
                <span>Answer each question to test your knowledge</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center mr-2 mt-0.5">
                  <span className="text-yellow-600 dark:text-yellow-400 font-bold text-sm">
                    4
                  </span>
                </span>
                <span>Get instant feedback and see your final score</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizTest;
