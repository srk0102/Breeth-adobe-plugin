/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'purple-pink': 'linear-gradient(to bottom right, #a855f7, #ec4899)',
      },
    },
  },
  plugins: [],
}

