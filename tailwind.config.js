/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["'JetBrains Mono'", "'IBM Plex Mono'", "ui-monospace", "monospace"],
        sans: ["'Inter'", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        case: {
          950: "#020617",
          900: "#0a0f1a",
          850: "#0e1420",
          800: "#121a28",
          700: "#1b2638",
          border: "#1f2a3d",
        },
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(52,211,153,0.15), 0 0 24px -4px rgba(52,211,153,0.25)",
        "glow-sm": "0 0 0 1px rgba(52,211,153,0.12), 0 0 12px -4px rgba(52,211,153,0.2)",
      },
      backgroundImage: {
        scanlines:
          "repeating-linear-gradient(to bottom, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 3px)",
      },
      animation: {
        blink: "blink 1.1s steps(2, start) infinite",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0 },
        },
      },
    },
  },
  plugins: [],
};
