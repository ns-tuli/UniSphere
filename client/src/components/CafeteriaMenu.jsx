import React, { useState, useEffect } from "react";
import { FiClock, FiDollarSign, FiHeart, FiFilter, FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";

// Sample meal category data
const categories = [
  { id: "all", name: "All" },
  { id: "breakfast", name: "Breakfast" },
  { id: "lunch", name: "Lunch" },
  { id: "dinner", name: "Dinner" },
  { id: "vegetarian", name: "Vegetarian" },
  { id: "vegan", name: "Vegan" },
  { id: "gluten-free", name: "Gluten Free" }
];

// Sample meal data with expanded details
const mealData = [
  {
    id: 1,
    name: "Grilled Herb Chicken",
    description: "Juicy grilled chicken breast seasoned with fresh herbs, served with roasted vegetables and quinoa.",
    price: 8.99,
    image: "https://via.placeholder.com/400x300?text=Grilled+Chicken",
    nutrition: {
      calories: 350,
      protein: 40,
      carbs: 25,
      fat: 12,
      fiber: 6
    },
    allergens: ["none"],
    categories: ["lunch", "dinner"],
    available: true,
    popularity: 4.8,
    prepTime: "15 min"
  },
  {
    id: 2,
    name: "Mediterranean Veggie Bowl",
    description: "Fresh mixed greens, cherry tomatoes, cucumber, red onions, kalamata olives, feta cheese, and hummus with olive oil dressing.",
    price: 7.99,
    image: "https://via.placeholder.com/400x300?text=Veggie+Bowl",
    nutrition: {
      calories: 280,
      protein: 12,
      carbs: 32,
      fat: 14,
      fiber: 8
    },
    allergens: ["dairy"],
    categories: ["lunch", "vegetarian"],
    available: true,
    popularity: 4.6,
    prepTime: "10 min"
  },
  {
    id: 3,
    name: "Quinoa Breakfast Bowl",
    description: "Warm quinoa topped with sliced bananas, mixed berries, honey, and toasted almonds.",
    price: 6.49,
    image: "https://via.placeholder.com/400x300?text=Breakfast+Bowl",
    nutrition: {
      calories: 310,
      protein: 8,
      carbs: 54,
      fat: 9,
      fiber: 7
    },
    allergens: ["nuts"],
    categories: ["breakfast", "vegetarian", "vegan"],
    available: true,
    popularity: 4.3,
    prepTime: "8 min"
  },
  {
    id: 4,
    name: "Teriyaki Salmon Bowl",
    description: "Grilled salmon glazed with house-made teriyaki sauce, served over brown rice with steamed broccoli and carrots.",
    price: 10.99,
    image: "https://via.placeholder.com/400x300?text=Salmon+Bowl",
    nutrition: {
      calories: 420,
      protein: 32,
      carbs: 40,
      fat: 16,
      fiber: 5
    },
    allergens: ["fish", "soy"],
    categories: ["lunch", "dinner"],
    available: true,
    popularity: 4.9,
    prepTime: "18 min"
  },
  {
    id: 5,
    name: "Avocado Toast",
    description: "Multigrain toast topped with smashed avocado, cherry tomatoes, microgreens, and a sprinkle of everything bagel seasoning.",
    price: 5.99,
    image: "https://via.placeholder.com/400x300?text=Avocado+Toast",
    nutrition: {
      calories: 250,
      protein: 6,
      carbs: 28,
      fat: 14,
      fiber: 8
    },
    allergens: ["gluten"],
    categories: ["breakfast", "vegetarian", "vegan"],
    available: true,
    popularity: 4.7,
    prepTime: "5 min"
  },
  {
    id: 6,
    name: "Southwest Chicken Wrap",
    description: "Grilled chicken, black beans, corn, romaine lettuce, avocado, and chipotle ranch dressing in a spinach tortilla.",
    price: 8.49,
    image: "https://via.placeholder.com/400x300?text=Chicken+Wrap",
    nutrition: {
      calories: 380,
      protein: 28,
      carbs: 42,
      fat: 14,
      fiber: 7
    },
    allergens: ["gluten", "dairy"],
    categories: ["lunch"],
    available: true,
    popularity: 4.5,
    prepTime: "12 min"
  }
];

// Nutrition info component
const NutritionModal = ({ nutrition, onClose }) => {
  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-2xl font-bold text-yellow-600 dark:text-yellow-300 mb-4">Nutritional Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-yellow-50 dark:bg-gray-700 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-300">{nutrition.calories}</div>
            <div className="text-gray-600 dark:text-gray-400">Calories</div>
          </div>
          <div className="bg-yellow-50 dark:bg-gray-700 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-300">{nutrition.protein}g</div>
            <div className="text-gray-600 dark:text-gray-400">Protein</div>
          </div>
          <div className="bg-yellow-50 dark:bg-gray-700 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-300">{nutrition.carbs}g</div>
            <div className="text-gray-600 dark:text-gray-400">Carbs</div>
          </div>
          <div className="bg-yellow-50 dark:bg-gray-700 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-300">{nutrition.fat}g</div>
            <div className="text-gray-600 dark:text-gray-400">Fat</div>
          </div>
        </div>
        <div className="mt-6 text-center">
          <button 
            className="bg-yellow-600 hover:bg-yellow-500 text-white px-6 py-2 rounded-lg transition-colors duration-300"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const CafeteriaMenu = () => {
  const [meals, setMeals] = useState(mealData);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  // Filter meals based on category and search query
  useEffect(() => {
    let filteredMeals = mealData;
    
    if (selectedCategory !== "all") {
      filteredMeals = filteredMeals.filter(meal => 
        meal.categories.includes(selectedCategory)
      );
    }
    
    if (searchQuery) {
      filteredMeals = filteredMeals.filter(meal =>
        meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meal.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setMeals(filteredMeals);
  }, [selectedCategory, searchQuery]);

  // Add meal to cart
  const addToCart = (meal) => {
    const existingItem = cart.find(item => item.id === meal.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === meal.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, { ...meal, quantity: 1 }]);
    }

    // Show cart notification
    const notification = document.getElementById('cart-notification');
    notification.classList.remove('opacity-0');
    notification.classList.add('opacity-100');
    
    setTimeout(() => {
      notification.classList.remove('opacity-100');
      notification.classList.add('opacity-0');
    }, 2000);
  };

  // Remove item from cart
  const removeFromCart = (mealId) => {
    setCart(cart.filter(item => item.id !== mealId));
  };

  // Update item quantity
  const updateQuantity = (mealId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCart(cart.map(item => 
      item.id === mealId 
        ? { ...item, quantity: newQuantity } 
        : item
    ));
  };

  // Calculate total price
  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="p-8 bg-yellow-50 dark:bg-gray-900 min-h-screen">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-center mb-8"
        >
          <div>
            <h2 className="text-4xl font-bold text-yellow-600 dark:text-yellow-300 mb-2">
              Today's Menu
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Fresh, delicious meals prepared daily
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <button 
              className="relative bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-300"
              onClick={() => setShowCart(!showCart)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
              </svg>
              Cart
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </motion.div>

        {/* Search and Filter Section */}
        <div className="mb-8 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search meals..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto py-2 md:py-0">
              <FiFilter className="text-yellow-600 dark:text-yellow-300" />
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                    selectedCategory === category.id
                      ? "bg-yellow-500 dark:bg-yellow-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  } transition-colors duration-300`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Meal Cards Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {meals.map((meal) => (
            <motion.div
              key={meal.id}
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={meal.image}
                  alt={meal.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 right-0 m-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    ★ {meal.popularity}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    {meal.name}
                  </h3>
                  <span className="text-lg font-bold text-yellow-600 dark:text-yellow-300">
                    ${meal.price.toFixed(2)}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {meal.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {meal.categories.map(category => (
                    <span key={category} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                      {categories.find(c => c.id === category)?.name}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <FiClock className="mr-1" />
                  <span>{meal.prepTime}</span>
                  {meal.allergens[0] !== "none" && (
                    <span className="ml-3">
                      Allergens: {meal.allergens.join(", ")}
                    </span>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <button
                    className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                    onClick={() => addToCart(meal)}
                  >
                    Pre-Order
                  </button>
                  <button
                    className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-lg transition-colors duration-300"
                    onClick={() => setSelectedMeal(meal)}
                  >
                    Nutrition
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty state */}
        {meals.length === 0 && (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No meals found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>

      {/* Shopping Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowCart(false)}></div>
          <div className="absolute top-0 right-0 w-full md:w-96 h-full bg-white dark:bg-gray-800 shadow-xl overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-yellow-600 dark:text-yellow-300">Your Order</h3>
                <button 
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={() => setShowCart(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">Add some delicious meals to get started.</p>
                  <button 
                    className="bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                    onClick={() => setShowCart(false)}
                  >
                    Continue Browsing
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex border-b border-gray-200 dark:border-gray-700 pb-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="ml-4 flex-grow">
                          <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200">{item.name}</h4>
                          <div className="flex justify-between items-center mt-2">
                            <div className="flex items-center">
                              <button
                                className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                -
                              </button>
                              <span className="mx-2 w-8 text-center">{item.quantity}</span>
                              <button
                                className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                +
                              </button>
                            </div>
                            <div className="flex items-center">
                              <span className="text-yellow-600 dark:text-yellow-300 font-medium mr-2">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                              <button
                                className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Tax</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">${(totalPrice * 0.08).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span className="text-gray-800 dark:text-gray-200">Total</span>
                      <span className="text-yellow-600 dark:text-yellow-300">${(totalPrice * 1.08).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <button className="w-full bg-yellow-600 hover:bg-yellow-500 text-white py-3 rounded-lg text-lg font-medium transition-colors duration-300">
                      Checkout
                    </button>
                    <button 
                      className="w-full mt-4 bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-lg text-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
                      onClick={() => setShowCart(false)}
                    >
                      Continue Shopping
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Nutrition Modal */}
      {selectedMeal && (
        <NutritionModal 
          nutrition={selectedMeal.nutrition} 
          onClose={() => setSelectedMeal(null)} 
        />
      )}

      {/* Cart Notification */}
      <div 
        id="cart-notification" 
        className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg opacity-0 transition-opacity duration-300"
      >
        Item added to cart!
      </div>
    </div>
  );
};

export default CafeteriaMenu;