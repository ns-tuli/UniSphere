/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography'; // Import the plugin

export default {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    typography, // Use the imported plugin
  ],
};