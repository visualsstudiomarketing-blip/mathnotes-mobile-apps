/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0F172A',
          card: '#1E293B',
          border: '#334155',
          primary: '#2563EB',
          accent: '#38BDF8',
          success: '#10B981',
          warning: '#F59E0B'
        }
      }
    },
  },
  plugins: [],
};
