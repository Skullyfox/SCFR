const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './renderer/pages/**/*.{js,ts,jsx,tsx}',
    './renderer/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      // use colors only specified
      white: colors.white,
      gray: colors.gray,
      blue: colors.blue,
      slate: colors.slate,
      green: colors.green,
      rose: colors.rose,
      indigo: colors.indigo,
      violet: colors.violet,
      cyan: colors.cyan,
    },
    extend: {},
  },
  plugins: [],
};
