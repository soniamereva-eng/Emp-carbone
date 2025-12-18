/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      /* 🎨 Couleurs EMP Carbone */
      colors: {
        primary: "#6F9FA0",
        primaryLight: "#BFD9D5",
        sand: "#F4D6A0",
        peach: "#F3A27A",
        background: "#F8F6F2",
        textDark: "#2F3E3E",
      },

      /* 🎞️ Animations */
      animation: {
        slowFloat: "slowFloat 18s ease-in-out infinite",
        slowFloatDelay: "slowFloat 22s ease-in-out infinite",
        slowFloatReverse: "slowFloatReverse 26s ease-in-out infinite",
        pulseSlow: "pulseSlow 4s ease-in-out infinite",
      },

      /* 🔁 Keyframes */
      keyframes: {
        slowFloat: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(40px)" },
        },
        slowFloatReverse: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-40px)" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
