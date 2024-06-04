/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class", // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        purple: "#9747FF",
        soft_gray: "#F5F4F6",
        neutral_gray: "#888888",
      },
      fontFamily: {
        allura: ["Allura", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
