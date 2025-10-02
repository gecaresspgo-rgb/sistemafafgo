/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        abyss: {
          primary: '#45acab', // ciano escuro
          secondary: '#3b8898', // azul petróleo
          deep: '#284a6f', // azul profundo
          dark: '#151b3d', // azul quase preto
          black: '#0a0a24', // preto azulado
        },
      },
    },
  },
  plugins: [],
}
