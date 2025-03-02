import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaUniversity,
  FaIdCard,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/UserContext";

const Auth = () => {
  const { updateUser } = useUser();
  const navigate = useNavigate();
  const [isSignIn, setIsSignIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    studentId: "",
    department: "",
    confirmPassword: "",
  });

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        );

        // Create enhanced user object with additional fields
        const enhancedUserData = {
          ...userInfo.data,
          studentId: '',
          department: '',
          joinDate: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          accessToken: tokenResponse.access_token
        };

        

        // Store user data
        localStorage.setItem("user", JSON.stringify(userInfo.data));

        // Redirect to homepage
        navigate('/profile');
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to login with Google: ' + (error.response?.data?.message || error.message));
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.log("Login Failed:", error);
      alert("Google login failed: " + error.message);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isSignIn && formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
      setIsLoading(true);
      // Create user object for traditional sign-in
      const userData = {
        ...formData,
        joinDate: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        loginMethod: 'traditional'
      };
      
      updateUser(userData);
      navigate('/profile');
    } catch (error) {
      console.error('Error:', error);
      alert('Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-yellow-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-yellow-600 dark:bg-yellow-600 p-6 text-white">
          <h2 className="text-3xl font-extrabold text-center">
            {isSignIn ? "Welcome" : "Join Us Today"}
          </h2>
          <p className="mt-2 text-center text-yellow-100">
            {isSignIn
              ? "Sign in to access your account"
              : "Create an account to get started"}
          </p>
        </div>

        <div className="p-8 space-y-6">
          <div className="flex flex-col items-center">
            <button
              onClick={() => login()}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm transition-all duration-300 disabled:opacity-50 font-medium"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-800 dark:border-white"></div>
              ) : (
                <>
                  <FcGoogle className="text-xl" />
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            <div className="my-6 flex items-center w-full">
              <div className="border-t border-gray-300 dark:border-gray-600 flex-grow"></div>
              <span className="px-4 text-gray-500 dark:text-gray-400 font-medium">
                or
              </span>
              <div className="border-t border-gray-300 dark:border-gray-600 flex-grow"></div>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isSignIn && (
              <div className="space-y-4">
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-300 sm:text-sm"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div className="relative">
                  <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-300 sm:text-sm"
                    placeholder="Student ID"
                    value={formData.studentId}
                    onChange={(e) =>
                      setFormData({ ...formData, studentId: e.target.value })
                    }
                  />
                </div>

                <div className="relative">
                  <FaUniversity className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-300 sm:text-sm"
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                  >
                    <option value="">Select Department</option>
                    <option value="CSE">Computer Science</option>
                    <option value="EEE">Electrical Engineering</option>
                    <option value="ME">Mechanical Engineering</option>
                    <option value="BBA">Business Administration</option>
                  </select>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-300 sm:text-sm"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-300 sm:text-sm"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {!isSignIn && (
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-300 sm:text-sm"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            )}

            {isSignIn && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-yellow-600 hover:text-yellow-500 transition-colors duration-300"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-300 shadow-md disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : isSignIn ? (
                  "Sign in"
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isSignIn
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                onClick={() => setIsSignIn(!isSignIn)}
                className="font-medium text-yellow-600 hover:text-yellow-500 transition-colors duration-300"
              >
                {isSignIn ? "Sign up now" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
