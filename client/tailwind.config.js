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
          primary: "#5A64EA",
          secondary: "#c111b0",
          accent: "#ea7781",
          neutral: "#272c30",
          "base-100": "#f9f9fb",
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
