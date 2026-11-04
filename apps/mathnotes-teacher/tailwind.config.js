/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        educator: {
          dark: '#090D16',
          card: '#131B2E',
          border: '#1E293B',
          primary: '#059669',
          accent: '#10B981',
          highlight: '#38BDF8'
        }
      }
    },
  },
  plugins: [],
};
