import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaEdit, FaList, FaPlus, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { menuService } from '../../api/menuService';

export default function CafeteriaManagement() {
  // State for current view
  const [activeView, setActiveView] = useState('main');
  // State for meals data
  const [meals, setMeals] = useState([]);
  // State for loading status
  const [loading, setLoading] = useState(false);
  // State for error messages
  const [error, setError] = useState(null);
  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'main',
    isAvailable: true,
    image: '',
    nutritionInfo: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    },
  });
  // State for selected meal (for update/delete)
  const [selectedMeal, setSelectedMeal] = useState(null);

  // Fetch meals on component mount
  useEffect(() => {
    fetchMeals();
  }, []);

  // Function to fetch meals from API
  const fetchMeals = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await menuService.getAllItems();
      setMeals(data);
    } catch (err) {
      setError('Failed to load menu items. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle form submission for adding a meal
  const handleAddMeal = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const newMeal = {
        ...formData,
        price: parseFloat(formData.price),
        isAvailable: formData.isAvailable,
        nutritionInfo: {
          calories: parseInt(formData.nutritionInfo.calories),
          protein: parseInt(formData.nutritionInfo.protein),
          carbs: parseInt(formData.nutritionInfo.carbs),
          fat: parseInt(formData.nutritionInfo.fat),
        },
      };

      await menuService.addItem(newMeal);
      await fetchMeals();
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'main',
        isAvailable: true,
        image: '',
        nutritionInfo: {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
        },
      });
      setActiveView('main');
    } catch (err) {
      setError('Failed to add menu item. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission for updating a meal
  const handleUpdateMeal = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updatedMeal = {
        ...formData,
        price: parseFloat(formData.price),
        isAvailable: formData.isAvailable,
        nutritionInfo: {
          calories: parseInt(formData.nutritionInfo.calories),
          protein: parseInt(formData.nutritionInfo.protein),
          carbs: parseInt(formData.nutritionInfo.carbs),
          fat: parseInt(formData.nutritionInfo.fat),
        },
      };

      await menuService.updateItem(selectedMeal._id, updatedMeal);
      await fetchMeals();
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'main',
        isAvailable: true,
        image: '',
        nutritionInfo: {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
        },
      });
      setSelectedMeal(null);
      setActiveView('main');
    } catch (err) {
      setError('Failed to update menu item. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle meal deletion
  const handleDeleteMeal = async id => {
    setLoading(true);
    setError(null);

    try {
      await menuService.deleteItem(id);
      await fetchMeals();
      setActiveView('main');
    } catch (err) {
      setError('Failed to delete menu item. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Set up for updating a meal
  const setupUpdateMeal = meal => {
    setSelectedMeal(meal);
    setFormData({
      name: meal.name,
      description: meal.description,
      price: meal.price.toString(),
      category: meal.category,
      isAvailable: meal.isAvailable,
      image: meal.image || '',
      nutritionInfo: meal.nutritionInfo || {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      },
    });
    setActiveView('update');
  };

  // Set up for deleting a meal
  const setupDeleteMeal = meal => {
    setSelectedMeal(meal);
    setActiveView('delete');
  };

  // Render different views based on activeView state
  const renderView = () => {
    // Show loading indicator
    if (loading) {
      return (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    // Show error message if there is one
    if (error) {
      return (
        <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg mb-6">
          <p className="text-red-800 dark:text-red-200 font-medium">{error}</p>
          <button
            onClick={() => {
              setError(null);
              if (activeView === 'main') {
                fetchMeals();
              }
            }}
            className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Try Again
          </button>
        </div>
      );
    }

    switch (activeView) {
      case 'list':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Menu Items
              </h2>
              <button
                onClick={() => setActiveView('main')}
                className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <FaArrowLeft className="mr-2" /> Back
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Categories
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {meals.length > 0 ? (
                    meals.map(meal => (
                      <tr
                        key={meal.mealId}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {meal.mealId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {meal.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs truncate">
                          {meal.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          ${meal.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {Array.isArray(meal.categories)
                            ? meal.categories.join(', ')
                            : meal.categories}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              meal.available
                                ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100'
                                : 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100'
                            }`}
                          >
                            {meal.available ? 'Available' : 'Not Available'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <button
                            onClick={() => setupUpdateMeal(meal)}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => setupDeleteMeal(meal)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                      >
                        No menu items found. Add some items to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'add':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Add Menu Item
              </h2>
              <button
                onClick={() => setActiveView('main')}
                className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <FaArrowLeft className="mr-2" /> Back
              </button>
            </div>
            <form onSubmit={handleAddMeal}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="mb-4">
                  <label
                    className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                    htmlFor="name"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                    htmlFor="price"
                  >
                    Price ($)
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    min="0"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                    htmlFor="categories"
                  >
                    Categories (comma separated)
                  </label>
                  <input
                    type="text"
                    id="categories"
                    name="categories"
                    value={formData.categories}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                    htmlFor="prepTime"
                  >
                    Preparation Time
                  </label>
                  <input
                    type="text"
                    id="prepTime"
                    name="prepTime"
                    value={formData.prepTime}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4 col-span-2">
                  <label
                    className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                    htmlFor="description"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  ></textarea>
                </div>
                <div className="mb-4 flex items-center">
                  <input
                    type="checkbox"
                    id="available"
                    name="available"
                    checked={formData.available}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    className="ml-2 block text-gray-700 dark:text-gray-300 text-sm font-bold"
                    htmlFor="available"
                  >
                    Available
                  </label>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setActiveView('main')}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        );

      case 'update':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Update Menu Item
              </h2>
              <button
                onClick={() => setActiveView('main')}
                className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <FaArrowLeft className="mr-2" /> Back
              </button>
            </div>
            <form onSubmit={handleUpdateMeal}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="mb-4">
                  <label
                    className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                    htmlFor="name"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                    htmlFor="price"
                  >
                    Price ($)
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    min="0"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                    htmlFor="categories"
                  >
                    Categories (comma separated)
                  </label>
                  <input
                    type="text"
                    id="categories"
                    name="categories"
                    value={formData.categories}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                    htmlFor="prepTime"
                  >
                    Preparation Time
                  </label>
                  <input
                    type="text"
                    id="prepTime"
                    name="prepTime"
                    value={formData.prepTime}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4 col-span-2">
                  <label
                    className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                    htmlFor="description"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  ></textarea>
                </div>
                <div className="mb-4 flex items-center">
                  <input
                    type="checkbox"
                    id="available"
                    name="available"
                    checked={formData.available}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    className="ml-2 block text-gray-700 dark:text-gray-300 text-sm font-bold"
                    htmlFor="available"
                  >
                    Available
                  </label>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setActiveView('main')}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Item'}
                </button>
              </div>
            </form>
          </div>
        );

      case 'delete':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Delete Menu Item
              </h2>
              <button
                onClick={() => setActiveView('main')}
                className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <FaArrowLeft className="mr-2" /> Back
              </button>
            </div>
            {selectedMeal && (
              <div>
                <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg mb-6">
                  <p className="text-red-800 dark:text-red-200 font-medium">
                    Are you sure you want to delete the following menu item?
                    This action cannot be undone.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {selectedMeal.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    {selectedMeal.description}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Price: ${selectedMeal.price.toFixed(2)}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Categories:{' '}
                    {Array.isArray(selectedMeal.categories)
                      ? selectedMeal.categories.join(', ')
                      : selectedMeal.categories}
                  </p>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    type="button"
                    onClick={() => setActiveView('main')}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteMeal(selectedMeal.mealId)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    disabled={loading}
                  >
                    {loading ? 'Deleting...' : 'Delete Item'}
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              onClick={() => setActiveView('list')}
              className="cursor-pointer bg-blue-50 dark:bg-blue-900 rounded-lg shadow-md overflow-hidden transition-transform duration-300 transform hover:scale-105 hover:bg-blue-100 dark:hover:bg-blue-800 border border-blue-200 dark:border-blue-700"
            >
              <div className="p-6">
                <div className="flex items-center justify-center h-16 w-16 rounded-md bg-white dark:bg-gray-700 mx-auto mb-4 shadow-sm">
                  <FaList className="text-3xl text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-2">
                  View Menu Items
                </h3>
                <p className="text-sm text-center text-gray-600 dark:text-gray-300">
                  Browse and manage all cafeteria menu items
                </p>
              </div>
            </div>

            <div
              onClick={() => setActiveView('add')}
              className="cursor-pointer bg-green-50 dark:bg-green-900 rounded-lg shadow-md overflow-hidden transition-transform duration-300 transform hover:scale-105 hover:bg-green-100 dark:hover:bg-green-800 border border-green-200 dark:border-green-700"
            >
              <div className="p-6">
                <div className="flex items-center justify-center h-16 w-16 rounded-md bg-white dark:bg-gray-700 mx-auto mb-4 shadow-sm">
                  <FaPlus className="text-3xl text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-2">
                  Add Menu Item
                </h3>
                <p className="text-sm text-center text-gray-600 dark:text-gray-300">
                  Create a new item for the cafeteria menu
                </p>
              </div>
            </div>

            <div
              onClick={() =>
                meals.length > 0
                  ? setActiveView('list')
                  : setError('No items to update')
              }
              className="cursor-pointer bg-yellow-50 dark:bg-yellow-900 rounded-lg shadow-md overflow-hidden transition-transform duration-300 transform hover:scale-105 hover:bg-yellow-100 dark:hover:bg-yellow-800 border border-yellow-200 dark:border-yellow-700"
            >
              <div className="p-6">
                <div className="flex items-center justify-center h-16 w-16 rounded-md bg-white dark:bg-gray-700 mx-auto mb-4 shadow-sm">
                  <FaEdit className="text-3xl text-yellow-600 dark:text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-2">
                  Update Menu Items
                </h3>
                <p className="text-sm text-center text-gray-600 dark:text-gray-300">
                  Edit existing cafeteria menu items
                </p>
              </div>
            </div>

            <div
              onClick={() =>
                meals.length > 0
                  ? setActiveView('list')
                  : setError('No items to delete')
              }
              className="cursor-pointer bg-red-50 dark:bg-red-900 rounded-lg shadow-md overflow-hidden transition-transform duration-300 transform hover:scale-105 hover:bg-red-100 dark:hover:bg-red-800 border border-red-200 dark:border-red-700"
            >
              <div className="p-6">
                <div className="flex items-center justify-center h-16 w-16 rounded-md bg-white dark:bg-gray-700 mx-auto mb-4 shadow-sm">
                  <FaTrash className="text-3xl text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-2">
                  Delete Menu Items
                </h3>
                <p className="text-sm text-center text-gray-600 dark:text-gray-300">
                  Remove items from the cafeteria menu
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Cafeteria Management
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Manage cafeteria menu items, pricing, and availability
            </p>
          </div>
          <Link
            to="/Admin"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FaArrowLeft className="mr-2" /> Back to Dashboard
          </Link>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          {renderView()}
        </div>

        {/* Quick Stats */}
        {activeView === 'main' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Menu Items
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {meals.length}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Available Items
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {meals.filter(meal => meal.available).length}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-purple-500">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Average Price
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                $
                {meals.length > 0
                  ? (
                      meals.reduce((sum, meal) => sum + meal.price, 0) /
                      meals.length
                    ).toFixed(2)
                  : '0.00'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
