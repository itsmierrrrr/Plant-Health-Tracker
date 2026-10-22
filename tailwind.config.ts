import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef8f5',
          100: '#d8eee8',
          200: '#b5ddd3',
          300: '#86c4b7',
          400: '#5aa496',
          500: '#347c70',
          600: '#28685e',
          700: '#21564e',
          800: '#1c443f',
          900: '#173a36'
        },
        leaf: {
          50: '#eef8f5',
          100: '#d8eee8',
          200: '#b5ddd3',
          300: '#86c4b7',
          400: '#347c70',
          500: '#28685e',
          600: '#21564e',
          700: '#1c443f',
          800: '#173a36',
          900: '#122f2c'
        },
        cream: '#fffdf7'
      },
      boxShadow: {
        soft: '0 20px 60px rgba(32, 49, 47, 0.10)',
        lift: '0 14px 40px rgba(32, 49, 47, 0.14)'
      },
      backgroundImage: {
        'hero-glow': 'radial-gradient(circle at top left, rgba(233, 185, 73, 0.20), transparent 42%), radial-gradient(circle at 80% 10%, rgba(52, 124, 112, 0.18), transparent 30%)',
        'mesh': 'linear-gradient(rgba(32,49,47,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(32,49,47,0.04) 1px, transparent 1px)'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite'
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'serif']
      }
    }
  },
  plugins: []
} satisfies Config;