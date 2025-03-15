module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#fe2c55',
        secondary: '#25F4EE',
        dark: {
          100: '#333333',
          200: '#252525',
          300: '#1f1f1f',
          400: '#121212',
          500: '#000000',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', 'sans-serif'],
      },
      height: {
        '128': '32rem',
        '144': '36rem',
        '160': '40rem',
        'screen-90': '90vh',
      },
      width: {
        '88': '22rem',
        '104': '26rem',
        '108': '27rem',
      },
    },
  },
  plugins: [],
} 