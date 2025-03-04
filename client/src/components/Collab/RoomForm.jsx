import React, { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { FaUsers, FaPlus, FaDoorOpen } from "react-icons/fa";

const RoomForm = ({ onJoinRoom }) => {
  const [formData, setFormData] = useState({
    username: "",
    roomId: "",
    isNewRoom: true,
  });
  const [errors, setErrors] = useState({});

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.isNewRoom && !formData.roomId.trim()) {
      newErrors.roomId = "Room ID is required to join a room";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const finalRoomId = formData.isNewRoom ? uuidv4() : formData.roomId;
      onJoinRoom({ username: formData.username, roomId: finalRoomId });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="px-8 pt-6 pb-8">
          <div className="text-center mb-8">
            <FaUsers className="mx-auto h-12 w-12 text-yellow-600" />
            <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
              Collaborative Room
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Create or join a room to start collaborating
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.username ? "border-red-300" : "border-gray-300"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="Enter your display name"
                />
                {errors.username && (
                  <p className="mt-1 text-xs text-red-600">{errors.username}</p>
                )}
              </div>
            </div>

            {/* Room Type Selection */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, isNewRoom: true }))
                }
                className={`flex items-center justify-center px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                  formData.isNewRoom
                    ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                    : "border-gray-200 hover:border-yellow-200 hover:bg-yellow-50"
                }`}
              >
                <FaPlus className="mr-2" />
                Create Room
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, isNewRoom: false }))
                }
                className={`flex items-center justify-center px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                  !formData.isNewRoom
                    ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                    : "border-gray-200 hover:border-yellow-200 hover:bg-yellow-50"
                }`}
              >
                <FaDoorOpen className="mr-2" />
                Join Room
              </button>
            </div>

            {/* Room ID Input (for joining) */}
            {!formData.isNewRoom && (
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Room ID
                </label>
                <input
                  type="text"
                  name="roomId"
                  value={formData.roomId}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.roomId ? "border-red-300" : "border-gray-300"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="Enter room ID"
                />
                {errors.roomId && (
                  <p className="text-xs text-red-600">{errors.roomId}</p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition duration-150 ease-in-out transform hover:scale-[1.02]"
            >
              {formData.isNewRoom ? (
                <>
                  <FaPlus className="mr-2 h-5 w-5" />
                  Create & Join Room
                </>
              ) : (
                <>
                  <FaDoorOpen className="mr-2 h-5 w-5" />
                  Join Existing Room
                </>
              )}
            </button>
          </form>
        </div>

        
        <div className="px-8 py-4 bg-yellow-50 border-t border-yellow-100">
          <p className="text-xs text-gray-500 text-center">
            {formData.isNewRoom
              ? "You'll receive a unique room ID after creation"
              : "Ask your collaborator for the room ID"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoomForm;
