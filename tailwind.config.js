/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/*.{ts,tsx,jsx,js}",
    "./src/pages/**/*.{ts,tsx,jsx,js}",
    "./src/components/**/*.{ts,tsx,jsx,js}",
  ],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        background: "var(--background)",
        secondary: "var(--secondary)",
        panel: "var(--panel)",
        uBlack: "var(--uBlack)",
        uGray: "var(--uGray)",
        uGrayLight: "var(--uGrayLight)",
        uGrayLightLight: "var(--uGrayLightLight)",
        uRed: "var(--uRed)",
        uGreen: "var(--uGreen)",
        uBlue: "var(--uBlue)",
        score: {
          0: "var(--score-0)",
          1: "var(--score-1)",
          2: "var(--score-2)",
          3: "var(--score-3)",
          4: "var(--score-4)",
          5: "var(--score-5)",
          6: "var(--score-6)",
          7: "var(--score-7)",
          8: "var(--score-8)",
          9: "var(--score-9)",
          10: "var(--score-10)",
        },
      },
      animation: {
        fadeIn: "fadeIn 0.2s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
    },
  },
  safelist: [
    {
      pattern: /^bg-score-(0|1|2|3|4|5|6|7|8|9|10)$/,
    },
    {
      pattern: /^text-score-(0|1|2|3|4|5|6|7|8|9|10)$/,
    },
    {
      pattern: /^border-score-(0|1|2|3|4|5|6|7|8|9|10)$/,
    },
  ],

  plugins: [],
};
