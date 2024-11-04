/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode : ["class"],
  theme: {
    extend: {
      screens: {
        'sm-two': '660px',
        "sm-three": "700px"
        // => @media (min-width: 640px) { ... }
      },
    },
  },
  plugins: [],
}