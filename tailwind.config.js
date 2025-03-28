/** @type {import('tailwindcss').Config} */
import { nextui } from '@nextui-org/react';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        blob: "blob 7s infinite",
        shake: "shake 0.5s ease-in-out",
      },
    },
  },
  plugins: [nextui()],
};