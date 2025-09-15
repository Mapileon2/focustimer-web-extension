module.exports = {\n  darkMode: 'class',\n  content: ["./*.html", "./**/*.{js,ts,jsx,tsx}"],\n  theme: {
    extend: {
      colors: {
        'brand-primary': '#4f46e5',
        'brand-secondary': '#ec4899',
        'base-100': '#111827',
        'base-200': '#1f2937',
        'base-300': '#374151',
        'text-primary': '#f9fafb',
        'text-secondary': '#d1d5db',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};