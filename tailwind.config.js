/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        abyss: "#030a1f",
        deep: "#061433",
        ocean: "#0b2a6b",
        brand: { DEFAULT: "#1e7bff", light: "#3fd0ff", glow: "#7fe6ff" },
        zap: { DEFAULT: "#25d366", dark: "#14a84b" },
      },
      fontFamily: {
        display: ['"Sora"', "system-ui", "sans-serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
      keyframes: {
        eq: { "0%,100%": { transform: "scaleY(.25)" }, "50%": { transform: "scaleY(1)" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-14px)" } },
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        pulseRing: { "0%": { transform: "scale(1)", opacity: ".55" }, "100%": { transform: "scale(1.6)", opacity: "0" } },
        bubble: { "0%": { transform: "translateY(0)", opacity: "0" }, "15%": { opacity: ".7" }, "100%": { transform: "translateY(-110vh)", opacity: "0" } },
      },
      animation: {
        eq: "eq 1s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
        pulseRing: "pulseRing 1.8s ease-out infinite",
        bubble: "bubble linear infinite",
      },
    },
  },
  plugins: [],
};
