/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E3A8A",
        secondary: "#F59E0B",
        bg: "#F3F4F6",
        surface: "#FFFFFF",
      },
    },
  },
  safelist: [
    "inline-flex",
    "items-center",
    "gap-2",
    "px-4",
    "py-2",
    "rounded-md",
    "font-semibold",
    "px-2",
    "py-1",
    "text-sm",
    "rounded-full",
    "bg-white",
    "rounded-lg",
    "shadow",
    "p-4",
  ],
  plugins: [],
}

