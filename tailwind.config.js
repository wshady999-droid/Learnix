/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary)',
          soft: 'var(--primary-soft)',
          hover: 'var(--primary-hover)',
        },
        ink: 'var(--text)',
        muted: 'var(--text-secondary)',
        surface: 'var(--bg-secondary)',
        card: 'var(--bg-card)',
        line: 'var(--border)',
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: 'var(--shadow)',
        'card-hover': '0 4px 8px rgba(24, 24, 27, 0.08), 0 12px 32px rgba(24, 24, 27, 0.14)',
        'primary-glow': '0 6px 18px rgba(229, 9, 20, 0.35)',
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
