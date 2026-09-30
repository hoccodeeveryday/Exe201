/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#F05A7E",
          dark: "#C43D60",
          light: "#FFF0F3",
          mid: "#FFF5F7",
        },
        surface: "#FFFFFF",
        border: "#F0E8E8",
        darkbg: "#1A1A2E",
        muted: "#6B7280",
        success: {
          DEFAULT: "#22C55E",
          bg: "#F0FDF4",
        },
        warning: {
          DEFAULT: "#D97706",
          bg: "#FFFBEB",
        },
        danger: {
          DEFAULT: "#DC2626",
          bg: "#FEF2F2",
        }
      },
      fontFamily: {
        sans: ["Inter", "SF Pro Display", "sans-serif"],
      },
      boxShadow: {
        premium: "0 8px 30px rgba(240, 90, 126, 0.08)",
        premiumHover: "0 20px 40px -15px rgba(240, 90, 126, 0.2)",
      }
    },
  },
  plugins: [],
}
