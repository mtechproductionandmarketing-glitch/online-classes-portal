/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'paf-blue': '#2C5AA0',
        'paf-dark-blue': '#1E4380',
        'paf-orange': '#C46A1C',
        'paf-light': '#F3F5F9',
        'paf-gray': '#5A6475',
      },
      fontFamily: {
        'barlow': ['Barlow Condensed', 'Arial Narrow', 'sans-serif'],
        'plex': ['IBM Plex Sans', 'Segoe UI', 'sans-serif'],
        'mono': ['IBM Plex Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
