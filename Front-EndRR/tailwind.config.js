/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#9C27B0",
          hover: "#7B1FA2",
          light: "#D1A3D8",
          dark: "#6A1B9A",
        },
        secondary: {
          light: "#E1F5FE",
          lighter: "#FFF3E0",
        },
        text: {
          primary: "#4A4A4A",
          secondary: "#757575",
        },
      },
    },
  },
  plugins: [],
};
