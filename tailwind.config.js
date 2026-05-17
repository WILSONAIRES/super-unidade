/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        desbrava: {
          green: '#4B5320', // Verde Caqui (Army Green)
          yellow: '#FFB81C', // Amarelo Ouro
          blue: '#002B5C', // Azul Marinho
          brown: '#8B4513', // Marrom Madeira
          lightGreen: '#6B705C',
          sand: '#E6D5B8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
