/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Link color when not active
        'link-inactive': '#020817',

        // Title text
        'title-text': '#202020',

        // Primary colors for buttons, icons, etc.
        'primary-brown': '#5C4033',
        'primary-olive': '#808000',
        'primary-magenta': '#FF00FF',

        // Light and dark body text
        'light-text': '#404040',
        'dark-text': '#191720',

        // Additional heading text
        'heading-alt': '#323539',
      },
    },
  },
  plugins: [],
}
