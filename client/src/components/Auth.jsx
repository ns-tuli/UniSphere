//path: client/src/components/Auth.jsx
import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaUniversity, FaIdCard } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Auth = () => {
  const navigate = useNavigate();
  const [isSignIn, setIsSignIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    studentId: '',
    department: '',
    confirmPassword: ''
  });

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        );
        localStorage.setItem('user', JSON.stringify(userInfo.data));
        navigate('/homepage');
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to login with Google');
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.log('Login Failed:', error);
      alert('Google login failed');
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isSignIn && formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
      setIsLoading(true);
      // Add your API call here for traditional sign-in/sign-up
      console.log('Form submitted:', formData);
      navigate('/homepage');
    } catch (error) {
      console.error('Error:', error);
      alert('Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {isSignIn ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {isSignIn ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsSignIn(!isSignIn)}
              className="font-medium text-yellow-600 hover:text-yellow-500"
            >
              {isSignIn ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        <div className="flex flex-col items-center">
          <button
            onClick={() => login()}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 transition-colors duration-300 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 dark:border-white"></div>
            ) : (
              <>
                <FcGoogle className="text-xl" />
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <div className="my-4 flex items-center w-full">
            <div className="border-t border-gray-300 dark:border-gray-600 flex-grow"></div>
            <span className="px-4 text-gray-500 dark:text-gray-400">or</span>
            <div className="border-t border-gray-300 dark:border-gray-600 flex-grow"></div>
          </div>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {!isSignIn && (
            <>
              <div className="rounded-md shadow-sm -space-y-px">
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    className="appearance-none rounded-none relative block w-full px-10 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 rounded-t-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="relative">
                  <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    className="appearance-none rounded-none relative block w-full px-10 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
                    placeholder="Student ID"
                    value={formData.studentId}
                    onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                  />
                </div>
                <div className="relative">
                  <FaUniversity className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    required
                    className="appearance-none rounded-none relative block w-full px-10 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                  >
                    <option value="">Select Department</option>
                    <option value="CSE">Computer Science</option>
                    <option value="EEE">Electrical Engineering</option>
                    <option value="ME">Mechanical Engineering</option>
                    <option value="BBA">Business Administration</option>
                  </select>
                </div>
              </div>
            </>
          )}
          
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-10 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 rounded-t-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-10 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 rounded-b-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          {!isSignIn && (
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                required
                className="appearance-none rounded-md relative block w-full px-10 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </div>
          )}

          {isSignIn && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-yellow-600 hover:text-yellow-500">
                  Forgot your password?
                </a>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                isSignIn ? 'Sign in' : 'Sign up'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;