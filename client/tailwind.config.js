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
      },
      animation: {
        fadeIn: "fadeIn 0.6s ease-out forwards",
        pulseBar: "pulseBar 2s ease-in-out infinite alternate",
        "float-1": "float1 20s ease-in-out infinite",
        "float-2": "float2 25s ease-in-out infinite",
        "float-3": "float3 30s ease-in-out infinite",
        "float-4": "float4 18s ease-in-out infinite",
        "float-5": "float5 22s ease-in-out infinite",
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
        float1: {
          "0%, 100%": {
            transform: "translate(0, 0)",
          },
          "25%": {
            transform: "translate(100px, -50px)",
          },
          "50%": {
            transform: "translate(200px, 100px)",
          },
          "75%": {
            transform: "translate(-50px, 150px)",
          },
        },
        float2: {
          "0%, 100%": {
            transform: "translate(0, 0)",
          },
          "33%": {
            transform: "translate(-150px, -100px)",
          },
          "66%": {
            transform: "translate(100px, 200px)",
          },
        },
        float3: {
          "0%, 100%": {
            transform: "translate(0, 0)",
          },
          "20%": {
            transform: "translate(120px, -80px)",
          },
          "40%": {
            transform: "translate(-80px, 120px)",
          },
          "60%": {
            transform: "translate(200px, 50px)",
          },
          "80%": {
            transform: "translate(-120px, -150px)",
          },
        },
        float4: {
          "0%, 100%": {
            transform: "translate(0, 0)",
          },
          "50%": {
            transform: "translate(150px, -100px)",
          },
        },
        float5: {
          "0%, 100%": {
            transform: "translate(0, 0)",
          },
          "25%": {
            transform: "translate(-100px, 80px)",
          },
          "50%": {
            transform: "translate(80px, -120px)",
          },
          "75%": {
            transform: "translate(-80px, -80px)",
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
