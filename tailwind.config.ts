import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Points to your app folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;
