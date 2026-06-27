/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sakura: {
          50: '#FFF5F7',
          100: '#FFE4E9',
          200: '#FFCAD6',
          300: '#FF9DB3',
          400: '#FF6B8A',
          500: '#FF4772',
          600: '#ED2057',
          700: '#C81247',
          800: '#A6123E',
          900: '#881539'
        },
        lavender: {
          50: '#FAF8FF',
          100: '#F3EFFE',
          200: '#E9E2FE',
          300: '#D7C9FD',
          400: '#BCA5FA',
          500: '#9E7CF5',
          600: '#8857ED',
          700: '#7842D9',
          800: '#6437B5',
          900: '#533093'
        },
        sky: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E'
        }
      },
      fontFamily: {
        cute: ['"ZCOOL KuaiLe"', 'cursive'],
        serif: ['"Noto Serif SC"', 'serif'],
        sans: ['Nunito', 'system-ui', 'sans-serif']
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'sakura-fall': 'sakuraFall 10s linear infinite',
        'twinkle': 'twinkle 2s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        sakuraFall: {
          '0%': { transform: 'translateY(-10vh) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' }
        },
        twinkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      },
      backdropBlur: {
        xs: '2px'
      }
    }
  },
  plugins: []
}
