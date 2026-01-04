/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#f5f0e8",
        cream: "#e8dece",
        sage: "#7c8b6d",
        "sage-dark": "#3f4636",
        gold: "#e0b14c",
        "custom-gold": "#C0990F",
        "custom-blue": "#1C2168",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        script: ["var(--font-script)", "cursive"],
        body: ["var(--font-body)", "serif"],
        sitka: ["Sitka", "serif"],
      },
      animation: {
        "marquee-lr": "marquee-lr 20s linear infinite",
        "marquee-rl": "marquee-rl 20s linear infinite",
        "marquee-tb": "marquee-tb 20s linear infinite",
        "marquee-bt": "marquee-bt 20s linear infinite",
      },
      keyframes: {
        "marquee-lr": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
        "marquee-rl": {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-tb": {
          "0%": { transform: "translateY(-50%)" },
          "100%": { transform: "translateY(0%)" },
        },
        "marquee-bt": {
          "0%": { transform: "translateY(0%)" },
          "100%": { transform: "translateY(-50%)" },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
};
