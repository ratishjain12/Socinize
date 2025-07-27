/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        inter: ["Inter", "system-ui", "sans-serif"],
        space: ["Space Grotesk", "monospace"],
        instrument: ["Instrument Serif", "serif"],
        muli: ["Muli", "sans-serif"],
        sourcesans: ["Source Sans 3", "sans-serif"],
      },
      animation: {
        fadeIn: "fadeIn 0.6s ease-out forwards",
        pulseBar: "pulseBar 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn: {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        pulseBar: {
          "0%": {
            opacity: "0.3",
          },
          "100%": {
            opacity: "1",
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
