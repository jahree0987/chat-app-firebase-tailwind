/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      maxHeight: {
        '128': '32rem',
      },
      width:{
        '200': '50rem',
      } ,
      height:{
        '128': '32rem',
      },
      fontFamily:{
        'sans':['Montserrat']
      },
      fontSize:{
        'vs':'0.7rem'
      }
    },
  },
  plugins: [

  ],
}

