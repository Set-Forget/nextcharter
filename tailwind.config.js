const colors = require("tailwindcss/colors")
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      ...colors,
      nextcolor: "#13274b"
    },
    extend: {
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

