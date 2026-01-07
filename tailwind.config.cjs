const lineClamp = require('@tailwindcss/line-clamp');

module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [lineClamp],
};
