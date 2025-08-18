/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/*.{ts,tsx,jsx,js}",
    "./src/pages/**/*.{ts,tsx,jsx,js}",
    "./src/components/**/*.{ts,tsx,jsx,js}",
  ],
  darkMode: "class",
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
      backgroundImage: {
        "grid":
          "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
        "radial-glow":
          "radial-gradient(600px 300px at 0% 0%, rgba(255,193,49,0.10), transparent 60%), radial-gradient(600px 300px at 100% 100%, rgba(255,193,49,0.10), transparent 60%)",
      },
      animation: {
        fadeIn: "fadeIn 0.2s ease-in-out",
        float: "float 6s ease-in-out infinite",
        pulseGlow: "pulseGlow 2.4s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0px rgba(255,193,49,0.0), 0 0 0px rgba(255,193,49,0.0)' },
          '50%': { boxShadow: '0 0 24px rgba(255,193,49,0.35), 0 0 60px rgba(255,193,49,0.10)' },
        },
      },
      boxShadow: {
        glow: '0 0 24px rgba(255,193,49,0.35)',
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
