import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "black-text": "#0D0D0D",
        primary: "#55A605",
        secondary: "#488C04",
        tertiary: "#BFD962",

        "primary-white": "#DEF2B3",

        grey: "#595959",
        "grey-2": "#A6A6A6",
        green: "#21BA45",

        "white-2": "#fafafa",
        "white-06": "rgba(255,255,255,0.6)",

        success: "#179C70",
        info: "#2CB5DB",
        warning: "#DBA416",
        error: "#C23613",
      },
      fontSize: {
        "heading-1": [
          "3.625rem",
          {
            lineHeight: "4rem",
          },
        ],
        "heading-2": [
          "3.25rem",
          {
            lineHeight: "3.5rem",
          },
        ],
        "heading-3": [
          "2.875rem",
          {
            lineHeight: "3rem",
          },
        ],
        "heading-4": [
          "2.5625rem",
          {
            lineHeight: "3rem",
          },
        ],
        "heading-5": [
          "2rem",
          {
            lineHeight: "2.5rem",
          },
        ],
        "heading-6": [
          "1.8125rem",
          {
            lineHeight: "2rem",
          },
        ],
        "subtitle-1": [
          "1.625rem",
          {
            lineHeight: "2rem",
          },
        ],
        "subtitle-2": [
          "1.4375rem",
          {
            lineHeight: "2rem",
          },
        ],
        "subtitle-3": [
          "1.25rem",
          {
            lineHeight: "1.5rem",
          },
        ],
        "subtitle-4": [
          "1.125rem",
          {
            lineHeight: "1.5rem",
          },
        ],
        "body-1": [
          "1rem",
          {
            lineHeight: "1.5rem",
          },
        ],
        "body-2": [
          "0.875rem",
          {
            lineHeight: "1.5rem",
          },
        ],
        caption: [
          "0.8125rem",
          {
            lineHeight: "1rem",
          },
        ],
        overline: [
          "0.6875rem",
          {
            lineHeight: "1rem",
          },
        ],
      },
    },
  },
  plugins: [],
};
export default config;
