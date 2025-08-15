/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#a855f7',
          secondary: '#8b5cf6',
          accent: '#c084fc',
        },
        file: {
          video: '#a855f7',
          audio: '#10b981',
          image: '#22d3ee',
          unknown: '#9ca3af',
        },
        ui: {
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6',
        },
      },
    },
  },
  plugins: [],
};

