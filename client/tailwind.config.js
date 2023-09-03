/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {},
  daisyui: {
    themes: [
      {
        mytheme: {
          primary:  "#4c1d95",
          secondary: "#c111b0",
          accent: "#ede9fe",
          neutral: "#272c30",
          "base-100": "#f9f9fb",
          "violet-100":"#ede9fe",
          info: "#6f98ec",
          success: "#0e7c4e",
          warning: "#f0d033",
          error: "#f5324c",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
