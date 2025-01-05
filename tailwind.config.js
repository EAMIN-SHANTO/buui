/** @type {import('tailwindcss').Config} */
import { defineConfig } from 'tailwindcss';
import lineClamp from '@tailwindcss/line-clamp';
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#EBF5FF',
          // ... other shades
          600: '#2563EB',
          700: '#1D4ED8',
        },
        gray: {
          50: '#F9FAFB',
          // ... other shades
          800: '#1F2937',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
};
