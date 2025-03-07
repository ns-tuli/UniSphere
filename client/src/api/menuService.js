const BASE_URL = 'http://localhost:5000/api';

export const menuService = {
  // Get all menu items
  getAllItems: async () => {
    const response = await fetch(`${BASE_URL}/menu`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  // Add new menu item
  addItem: async (menuItem) => {
    const response = await fetch(`${BASE_URL}/menu`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(menuItem),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  // Update menu item
  updateItem: async (id, menuItem) => {
    const response = await fetch(`${BASE_URL}/menu/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(menuItem),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  // Delete menu item
  deleteItem: async (id) => {
    const response = await fetch(`${BASE_URL}/menu/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return true;
  },
};
