/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        iceberg: ['Iceberg', 'cursive'],
        robotoCondensed: ['Roboto Condensed', 'sans-serif'],
      },
    },
  },
  plugins: [],
}