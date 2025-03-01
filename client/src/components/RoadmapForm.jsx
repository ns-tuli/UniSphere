import React, { useState, useRef } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";
import {
  BookOpen,
  Brain,
  Clock,
  Code,
  Download,
  MessageSquare,
  Target,
  PenTool as Tool,
} from "lucide-react";
import { useSelector } from "react-redux";

const RoadmapForm = () => {
  const { currentUser } = useSelector((state) => state.roadmap);
  const [isExpanded, setIsExpanded] = useState(true);
  const [step, setStep] = useState(1);
  const roadmapRef = useRef(null);
  const [formData, setFormData] = useState({
    course: "", // Dynamic course input
    goals: {
      primaryGoal: "",
      specificArea: "",
    },
    experience: {
      quiz: [],
      description: "",
    },
    timeCommitment: {
      hoursPerWeek: "2-5",
      pace: "relaxed",
    },
    preferences: {
      learningStyle: "interactive",
      difficulty: "fundamentals",
    },
    tools: "",
    feedback: "",
  });

  const [generatedRoadmap, setGeneratedRoadmap] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/roadmap/generate",
        {
          userId: currentUser?._id || "anonymous", // Fallback for non-logged-in users
          ...formData,
        }
      );
      setGeneratedRoadmap(response.data.roadmap.generatedRoadmap);
      setSuccessMessage("Your learning roadmap has been successfully created!");
    } catch (error) {
      console.error("Submission error:", error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    const element = roadmapRef.current;
    const opt = {
      margin: 1,
      filename: "my-learning-roadmap.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  const StepIcon = ({ step }) => {
    const icons = {
      1: <Target className="w-6 h-6" />,
      2: <BookOpen className="w-6 h-6" />,
      3: <Clock className="w-6 h-6" />,
      4: <Brain className="w-6 h-6" />,
      5: <Code className="w-6 h-6" />,
      6: <Tool className="w-6 h-6" />,
      7: <MessageSquare className="w-6 h-6" />,
    };
    return icons[step] || null;
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#FFFDF7] to-[#FFF9E6]">
      <div
        id="main-content"
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: isExpanded ? "260px" : "80px" }}
      >
        {/* Compact Hero Section */}
        <div className="bg-gradient-to-r from-[#FFF9E6] to-[#FFFDF7] border-b border-amber-100 py-8 px-6 mb-8">
          <div className="max-w-4xl mx-auto flex items-center gap-8">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-amber-900 mb-3">
                Your Programming Journey Starts Here
              </h1>
              <p className="text-amber-800 leading-relaxed">
                Tell us about your goals and preferences, and we&apos;ll create
                your personalized learning roadmap.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="px-4 py-2 bg-amber-50 rounded-lg border border-amber-200 text-center">
                <p className="text-amber-700 text-sm">7-step process</p>
              </div>
              <div className="px-4 py-2 bg-amber-50 rounded-lg border border-amber-200 text-center">
                <p className="text-amber-700 text-sm">Personalized plan</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6 space-y-8">
          {successMessage && (
            <div className="bg-amber-50 border border-amber-200 text-amber-700 px-6 py-4 rounded-lg text-center shadow-sm">
              <p className="font-semibold text-xl">{successMessage}</p>
            </div>
          )}

          {generatedRoadmap ? (
            <div className="bg-white rounded-lg shadow-sm p-8" ref={roadmapRef}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-amber-900">
                  Your Learning Roadmap
                </h2>
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>

              <div className="bg-amber-50/50 rounded-lg p-6">
                <pre className="whitespace-pre-wrap font-sans text-amber-900 leading-relaxed">
                  {generatedRoadmap}
                </pre>
              </div>

              <button
                onClick={() => {
                  setGeneratedRoadmap(null);
                  setSuccessMessage("");
                  setStep(1);
                }}
                className="mt-8 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                Create New Roadmap
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Progress Steps */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    {[1, 2, 3, 4, 5, 6, 7].map((number) => (
                      <div
                        key={number}
                        className={`flex flex-col items-center ${
                          number <= step ? "text-amber-600" : "text-gray-400"
                        }`}
                      >
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                            number <= step ? "bg-amber-100" : "bg-gray-100"
                          }`}
                        >
                          <StepIcon step={number} />
                        </div>
                        <span className="text-sm">Step {number}</span>
                      </div>
                    ))}
                  </div>
                  <div className="h-2 bg-amber-100 rounded-full">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${(step / 7) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Step 1: Course Selection */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <Target className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                      <h2 className="text-3xl font-bold text-amber-900">
                        Select Your Course
                      </h2>
                      <p className="text-amber-700 mt-2">
                        Enter the course you want to learn about
                      </p>
                    </div>
                    <div className="space-y-4">
                      <label className="block">
                        <span className="text-amber-800">Course Name:</span>
                        <input
                          type="text"
                          value={formData.course}
                          onChange={(e) =>
                            setFormData({ ...formData, course: e.target.value })
                          }
                          className="w-full p-2 border border-amber-200 rounded mt-1 focus:ring-amber-500 focus:border-amber-500"
                          placeholder="e.g., Machine Learning, Artificial Intelligence"
                          required
                        />
                      </label>
                    </div>
                  </div>
                )}

                {/* Step 2: Goals & Interests */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <BookOpen className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                      <h2 className="text-3xl font-bold text-amber-900">
                        Your Learning Goals
                      </h2>
                      <p className="text-amber-700 mt-2">
                        Lets start by understanding what you want to achieve
                      </p>
                    </div>
                    <div className="space-y-4">
                      <label className="block">
                        <span className="text-amber-800">Primary Goal:</span>
                        <select
                          value={formData.goals.primaryGoal}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              goals: {
                                ...formData.goals,
                                primaryGoal: e.target.value,
                              },
                            })
                          }
                          className="w-full p-2 border border-amber-200 rounded mt-1 focus:ring-amber-500 focus:border-amber-500"
                          required
                        >
                          <option value="">Select your primary goal</option>
                          <option value="job">Land a job in tech</option>
                          <option value="projects">
                            Build personal projects
                          </option>
                          <option value="exams">
                            Prepare for college/coding exams
                          </option>
                          <option value="basics">Learn coding basics</option>
                          <option value="other">Other</option>
                        </select>
                      </label>

                      {formData.goals.primaryGoal === "other" ? (
                        <label className="block">
                          <span className="text-amber-800">
                            Please specify:
                          </span>
                          <input
                            type="text"
                            value={formData.goals.specificArea}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                goals: {
                                  ...formData.goals,
                                  specificArea: e.target.value,
                                },
                              })
                            }
                            className="w-full p-2 border border-amber-200 rounded mt-1 focus:ring-amber-500 focus:border-amber-500"
                            required
                          />
                        </label>
                      ) : (
                        <label className="block">
                          <span className="text-amber-800">
                            Specific Area of Interest:
                          </span>
                          <input
                            type="text"
                            value={formData.goals.specificArea}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                goals: {
                                  ...formData.goals,
                                  specificArea: e.target.value,
                                },
                              })
                            }
                            className="w-full p-2 border border-amber-200 rounded mt-1 focus:ring-amber-500 focus:border-amber-500"
                            placeholder="e.g., AI/Data Science, Game Development"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                )}

                {/* Steps 3-7: Add similar components for other steps */}

                {/* Navigation Controls */}
                <div className="flex justify-between pt-6">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="flex items-center px-6 py-3 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors"
                    >
                      ← Previous
                    </button>
                  )}

                  {step < 7 ? (
                    <button
                      type="button"
                      onClick={() => setStep(step + 1)}
                      className="flex items-center px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors ml-auto"
                      disabled={step === 1 && !formData.course}
                    >
                      Next →
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="flex items-center px-8 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors ml-auto"
                      disabled={loading}
                    >
                      {loading ? "Generating..." : "Generate My Roadmap →"}
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoadmapForm;
