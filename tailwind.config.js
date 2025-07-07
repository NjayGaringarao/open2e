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
        textBody: "var(--textBody)",
        textHeader: "var(--textHeader)",
        secondary: "var(--secondary)",
        panel: "var(--panel)",
        uBlack: "var(--uBlack)",
        uGray: "var(--uGray)",
        uGrayLight: "var(--uGrayLight)",
      },
    },
  },
  safelist: [
    {
      pattern: /^lg:col-span-(1|2|3)$/,
    },
  ],
  plugins: [],
};
