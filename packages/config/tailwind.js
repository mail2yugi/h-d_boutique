const { brandColors } = require('@hd-boutique/types/src/index');

module.exports = {
  content: [],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: brandColors.primary,
          accent: brandColors.accent,
          background: brandColors.background,
          muted: brandColors.muted,
          text: brandColors.text,
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
