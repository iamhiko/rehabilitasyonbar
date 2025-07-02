/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-montserrat)"],
        serif: ["var(--font-playfair)"],
      },
      colors: {
        bg: 'hsl(var(--background))',
        content: 'hsl(var(--foreground))',
        primary: 'hsl(var(--primary))',
        accent: 'hsl(var(--accent))',
        secondary: 'hsl(var(--secondary))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
