/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#050505",
        secondary: "#0B0B0B",
        text: "#EAEAEA",
        muted: "#9E9E9E",
        accent: "#D8B48A",
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ['"Inter"', "Helvetica", "Arial", "sans-serif"],
      },
      maxWidth: {
        site: "1700px",
      },
      letterSpacing: {
        nav: "3px",
      },
    },
  },
  plugins: [],
};
