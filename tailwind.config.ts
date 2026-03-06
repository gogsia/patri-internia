import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "solarpunk-dark": "#1a3a1a",
        "solarpunk-green": "#2d5016",
        "solarpunk-bright": "#4a7c59",
        "solarpunk-lime": "#7ddf64",
        "solarpunk-gold": "#d4af37",
        "solarpunk-earth": "#8b6f47",
        "solarpunk-dark-earth": "#5a4a3a",
      },
    },
  },
  plugins: [],
};
export default config;
