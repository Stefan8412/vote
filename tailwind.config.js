/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        red: {
          400: "#fb7185", // Define the hex value or RGB value of the color you want for text-red-400
        },
      },
    },
  },
  plugins: [],
};
