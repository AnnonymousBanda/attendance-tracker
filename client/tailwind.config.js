import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", ...fontFamily.sans],
      },
    },
  },
  plugins: [],
};
