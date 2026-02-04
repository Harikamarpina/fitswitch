/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'lg': '1.0625rem',  // 17px (was 18px)
        'xl': '1.125rem',   // 18px (was 20px)
        '2xl': '1.25rem',   // 20px (was 24px)
        '3xl': '1.5rem',    // 24px (was 30px)
        '4xl': '1.875rem',  // 30px (was 36px)
        '5xl': '2.25rem',   // 36px (was 48px)
        '6xl': '3rem',      // 48px (was 60px)
        '7xl': '3.75rem',   // 60px (was 72px)
      },
    },
  },
  plugins: [],
}
