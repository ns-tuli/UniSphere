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
import { useRef, useState } from "react";
import { useSelector } from "react-redux";

const RoadmapForm = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [isExpanded, setIsExpanded] = useState(true);
  const [step, setStep] = useState(1);
  const roadmapRef = useRef(null);
  const [formData, setFormData] = useState({
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
    languages: [],
    tools: "",
    demographics: {
      ageRange: "",
      status: "",
    },
    feedback: "",
  });

  const [generatedRoadmap, setGeneratedRoadmap] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/roadmap/generate", {
        userId: currentUser._id,
        ...formData,
      });
      setGeneratedRoadmap(response.data.roadmap.generatedRoadmap);
      setSuccessMessage("Your learning roadmap has been successfully created!");
    } catch (error) {
      console.error("Submission error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to submit form";
      alert(`Error: ${errorMessage}`);
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

  // const handleDownloadTxt = () => {
  //   const element = document.createElement("a");
  //   const file = new Blob([generatedRoadmap], {type: 'text/plain'});
  //   element.href = URL.createObjectURL(file);
  //   element.download = "my-learning-roadmap.txt";
  //   document.body.appendChild(element);
  //   element.click();
  //   document.body.removeChild(element);
  // };

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
      <SideButtons />
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
                Tell us about your goals and preferences, and we'll create your
                personalized learning roadmap.
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

                {/* Step 1: Goals & Interests */}
                {step === 1 && (
                  <div className="space-y-6 transition-all duration-300">
                    <div className="text-center mb-6">
                      <Target className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                      <h2 className="text-3xl font-bold text-amber-900">
                        Your Learning Goals
                      </h2>
                      <p className="text-amber-700 mt-2">
                        Let's start by understanding what you want to achieve
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

                {/* Your existing steps 2-7 remain exactly the same */}
                {/* ... (keep all your existing step components) ... */}

                {/* Step 2: Experience Level */}
                {step === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold">
                      Your Experience Level
                    </h2>

                    <div className="space-y-4">
                      <fieldset className="space-y-2">
                        <legend className="text-gray-700 mb-2">
                          Self-assessment:
                        </legend>
                        {[
                          "Do you understand variables and loops?",
                          "Have you written code before?",
                          "Are you familiar with object-oriented programming?",
                          "Can you solve basic algorithmic problems?",
                        ].map((question, index) => (
                          <label
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              checked={formData.experience.quiz.includes(
                                question
                              )}
                              onChange={(e) => {
                                const quiz = e.target.checked
                                  ? [...formData.experience.quiz, question]
                                  : formData.experience.quiz.filter(
                                      (q) => q !== question
                                    );
                                setFormData({
                                  ...formData,
                                  experience: { ...formData.experience, quiz },
                                });
                              }}
                              className="rounded"
                            />
                            <span>{question}</span>
                          </label>
                        ))}
                      </fieldset>

                      <label className="block">
                        <span className="text-gray-700">
                          Additional Experience Description:
                        </span>
                        <textarea
                          value={formData.experience.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              experience: {
                                ...formData.experience,
                                description: e.target.value,
                              },
                            })
                          }
                          className="w-full p-2 border rounded mt-1 h-32"
                          placeholder="Briefly describe your coding experience..."
                        />
                      </label>
                    </div>
                  </div>
                )}

                {/* Step 3: Time Commitment */}
                {step === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Time Commitment</h2>

                    <div className="space-y-4">
                      <fieldset className="space-y-2">
                        <legend className="text-gray-700">Weekly Hours:</legend>
                        {["2-5", "5-10", "10+"].map((option) => (
                          <label
                            key={option}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="radio"
                              name="hours"
                              value={option}
                              checked={
                                formData.timeCommitment.hoursPerWeek === option
                              }
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  timeCommitment: {
                                    ...formData.timeCommitment,
                                    hoursPerWeek: e.target.value,
                                  },
                                })
                              }
                              className="rounded"
                            />
                            <span>{option} hours/week</span>
                          </label>
                        ))}
                      </fieldset>

                      <label className="block">
                        <span className="text-gray-700">Learning Pace:</span>
                        <select
                          value={formData.timeCommitment.pace}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              timeCommitment: {
                                ...formData.timeCommitment,
                                pace: e.target.value,
                              },
                            })
                          }
                          className="w-full p-2 border rounded mt-1"
                        >
                          <option value="relaxed">Relaxed</option>
                          <option value="moderate">Moderate</option>
                          <option value="intensive">Intensive</option>
                        </select>
                      </label>
                    </div>
                  </div>
                )}

                {/* Step 4: Learning Preferences */}
                {step === 4 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Learning Preferences</h2>

                    <div className="space-y-4">
                      <fieldset className="space-y-2">
                        <legend className="text-gray-700">
                          Preferred Learning Style:
                        </legend>
                        {[
                          { value: "videos", label: "Video Tutorials" },
                          { value: "text", label: "Text/Articles" },
                          { value: "interactive", label: "Interactive Coding" },
                          {
                            value: "projects",
                            label: "Project-Based Learning",
                          },
                          { value: "theory", label: "Theory-First Approach" },
                        ].map((option) => (
                          <label
                            key={option.value}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="radio"
                              name="learningStyle"
                              value={option.value}
                              checked={
                                formData.preferences.learningStyle ===
                                option.value
                              }
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  preferences: {
                                    ...formData.preferences,
                                    learningStyle: e.target.value,
                                  },
                                })
                              }
                              className="rounded"
                            />
                            <span>{option.label}</span>
                          </label>
                        ))}
                      </fieldset>

                      <fieldset className="space-y-2">
                        <legend className="text-gray-700">
                          Difficulty Preference:
                        </legend>
                        {[
                          "Stick to fundamentals first",
                          "Challenge me with advanced topics early",
                        ].map((option) => (
                          <label
                            key={option}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="radio"
                              name="difficulty"
                              value={option.toLowerCase().replace(/ /g, "-")}
                              checked={
                                formData.preferences.difficulty ===
                                option.toLowerCase().replace(/ /g, "-")
                              }
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  preferences: {
                                    ...formData.preferences,
                                    difficulty: e.target.value,
                                  },
                                })
                              }
                              className="rounded"
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </fieldset>
                    </div>
                  </div>
                )}

                {/* Step 5: Language Focus */}
                {step === 5 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Language Focus</h2>

                    <div className="space-y-4">
                      <fieldset className="space-y-2">
                        <legend className="text-gray-700">
                          Select Languages:
                        </legend>
                        {["C", "C++", "Java", "Python"].map((lang) => (
                          <label
                            key={lang}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              checked={formData.languages.some(
                                (l) => l.name === lang
                              )}
                              onChange={(e) => {
                                const languages = e.target.checked
                                  ? [
                                      ...formData.languages,
                                      {
                                        name: lang,
                                        priority: formData.languages.length + 1,
                                      },
                                    ]
                                  : formData.languages.filter(
                                      (l) => l.name !== lang
                                    );
                                setFormData({ ...formData, languages });
                              }}
                              className="rounded"
                            />
                            <span>{lang}</span>
                          </label>
                        ))}
                      </fieldset>

                      {formData.languages.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-gray-700">Set Priorities:</span>
                          {formData.languages.map((lang, index) => (
                            <div
                              key={lang.name}
                              className="flex items-center space-x-2"
                            >
                              <span>{lang.name}</span>
                              <select
                                value={lang.priority}
                                onChange={(e) => {
                                  const newLanguages = [...formData.languages];
                                  newLanguages[index].priority = parseInt(
                                    e.target.value
                                  );
                                  setFormData({
                                    ...formData,
                                    languages: newLanguages,
                                  });
                                }}
                                className="p-1 border rounded"
                              >
                                {formData.languages.map((_, i) => (
                                  <option key={i + 1} value={i + 1}>
                                    {i + 1}
                                  </option>
                                ))}
                              </select>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 6: Tools & Demographics */}
                {step === 6 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold">
                      Additional Information
                    </h2>

                    <div className="space-y-4">
                      <label className="block">
                        <span className="text-gray-700">
                          Specific Tools/Projects:
                        </span>
                        <input
                          type="text"
                          value={formData.tools}
                          onChange={(e) =>
                            setFormData({ ...formData, tools: e.target.value })
                          }
                          className="w-full p-2 border rounded mt-1"
                          placeholder="e.g., Android Studio, Django, Arduino"
                        />
                      </label>

                      <div className="space-y-2">
                        <label className="block">
                          <span className="text-gray-700">Age Range:</span>
                          <select
                            value={formData.demographics.ageRange}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                demographics: {
                                  ...formData.demographics,
                                  ageRange: e.target.value,
                                },
                              })
                            }
                            className="w-full p-2 border rounded mt-1"
                          >
                            <option value="">Prefer not to say</option>
                            <option value="<18">Under 18</option>
                            <option value="18-25">18-25</option>
                            <option value="25+">25+</option>
                          </select>
                        </label>

                        <label className="block">
                          <span className="text-gray-700">Status:</span>
                          <select
                            value={formData.demographics.status}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                demographics: {
                                  ...formData.demographics,
                                  status: e.target.value,
                                },
                              })
                            }
                            className="w-full p-2 border rounded mt-1"
                          >
                            <option value="">Prefer not to say</option>
                            <option value="student">Student</option>
                            <option value="professional">
                              Working Professional
                            </option>
                            <option value="other">Other</option>
                          </select>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 7: Final Feedback */}
                {step === 7 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Final Touches</h2>

                    <label className="block">
                      <span className="text-gray-700">
                        Anything else we should know?
                      </span>
                      <textarea
                        value={formData.feedback}
                        onChange={(e) =>
                          setFormData({ ...formData, feedback: e.target.value })
                        }
                        className="w-full p-2 border rounded mt-1 h-32"
                        placeholder="Additional information to help customize your roadmap..."
                      />
                    </label>
                  </div>
                )}

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
                      disabled={step === 1 && !formData.goals.primaryGoal}
                    >
                      Next →
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="flex items-center px-8 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors ml-auto"
                    >
                      Generate My Roadmap →
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

export default Roadmap;
