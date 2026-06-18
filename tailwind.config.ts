import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#edf6ff',
          100: '#d9ebff',
          200: '#b7d9ff',
          300: '#8cbfff',
          400: '#5b88b2',
          500: '#3f6287',
          600: '#2f4968',
          700: '#23384f',
          800: '#1b2c3f',
          900: '#122c4f'
        },
        leaf: {
          50: '#eff9f0',
          100: '#dff2e1',
          200: '#bce4c0',
          300: '#8ed59b',
          400: '#5db06a',
          500: '#3d8c4b',
          600: '#2e6d3b',
          700: '#245632',
          800: '#1d4427',
          900: '#18371f'
        },
        cream: '#fbf9e4'
      },
      boxShadow: {
        soft: '0 20px 60px rgba(18, 44, 79, 0.14)',
        lift: '0 14px 40px rgba(18, 44, 79, 0.18)'
      },
      backgroundImage: {
        'hero-glow': 'radial-gradient(circle at top left, rgba(91, 136, 178, 0.35), transparent 42%), radial-gradient(circle at 80% 10%, rgba(61, 140, 75, 0.24), transparent 30%)',
        'mesh': 'linear-gradient(rgba(18,44,79,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(18,44,79,0.04) 1px, transparent 1px)'
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