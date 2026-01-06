/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        scribed: {
          orange: '#BD3900',
          bg: '#0E1117',
          black: '#000000',
        },
      },
      backgroundImage: {
        'scribed-gradient': 'linear-gradient(180deg, #BD3900 0%, #000000 100%)',
      },
    },
  },
  plugins: [],
}