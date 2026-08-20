import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          hot: "#E8157A",
          pink: "#D94F8A",
          blush: "#DFA0C0",
          dark: "#1A0A14",
          surface: "#2D1025",
          plum: "#4A2140",
        },
      },
      fontFamily: {
        fredoka: ["var(--font-fredoka)"],
        dmsans: ["var(--font-dmsans)"],
      },
    },
  },
  plugins: [],
};
export default config;
