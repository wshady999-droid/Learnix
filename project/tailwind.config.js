/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEEEFD',
          100: '#DCDDFB',
          200: '#BDBEF7',
          300: '#9C9DF2',
          400: '#7C83FD',
          500: '#6B70F5',
          600: '#5B5FEF',
          700: '#4A4ED1',
          800: '#3A3DAF',
          900: '#2B2D80',
        },
        secondary: '#7C83FD',
        background: '#F7F8FC',
        ink: '#202235',
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(32, 34, 53, 0.06), 0 4px 16px rgba(32, 34, 53, 0.06)',
        'card-hover': '0 4px 8px rgba(32, 34, 53, 0.08), 0 12px 32px rgba(32, 34, 53, 0.12)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.35s ease-out both',
        'slide-up': 'slide-up 0.45s ease-out both',
      },
    },
  },
  plugins: [],
};
