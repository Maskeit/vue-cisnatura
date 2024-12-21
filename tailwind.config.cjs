// tailwind.config.cjs
const aspectRatio = require("@tailwindcss/aspect-ratio");
const lineClamp = require("@tailwindcss/line-clamp"); // Importa el plugin
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./src/assets/**/*.scss",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [aspectRatio, lineClamp],
};