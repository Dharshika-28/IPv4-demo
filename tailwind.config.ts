import { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8',
        secondary: '#10B981',
      },
      spacing: {
        128: '32rem',
      },
    },
  },
  plugins: [],
};

export default config;
