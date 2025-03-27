/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        tajawal: ['Tajawal', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#e6f0f9',
          100: '#cce0f3',
          200: '#99c2e6',
          300: '#66a3da',
          400: '#3385cd',
          500: '#0056b3',
          600: '#004e9f',
          700: '#00468c',
          800: '#003d78',
          900: '#003565',
        },
        secondary: {
          50: '#f2f3f5',
          100: '#e6e7ea',
          200: '#cdd0d5',
          300: '#b3b9c0',
          400: '#9aa2ab',
          500: '#6c757d',
          600: '#616971',
          700: '#565e65',
          800: '#4a5258',
          900: '#3f464c',
        },
        accent: {
          50: '#fff9e6',
          100: '#fff3cc',
          200: '#ffe799',
          300: '#ffdb66',
          400: '#ffcf33',
          500: '#ffc107',
          600: '#e6ae06',
          700: '#cc9a05',
          800: '#b38705',
          900: '#997304',
        },
        dark: {
          100: '#d5d7e0',
          200: '#acaebf',
          300: '#8c8fa3',
          400: '#666980',
          500: '#4d4f66',
          600: '#34354a',
          700: '#2b2c3d',
          800: '#1d1e30',
          900: '#0c0d21',
        },
        success: {
          50: '#e3f9e5',
          100: '#c1efc4',
          200: '#a0e6a5',
          300: '#7ddb85',
          400: '#57cf64',
          500: '#28a745',
          600: '#23963e',
          700: '#1e8436',
          800: '#19722f',
          900: '#155f27',
        },
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '2rem',
        '3xl': '3rem',
        '4xl': '4rem',
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'card': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        'elevated': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'inner-glow': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'glow': '0 0 15px rgba(0, 86, 179, 0.5)',
        'neon': '0 0 10px rgba(0, 86, 179, 0.8), 0 0 20px rgba(0, 86, 179, 0.6), 0 0 30px rgba(0, 86, 179, 0.4)',
      },
      zIndex: {
        '-10': '-10',
        '-1': '-1',
      },
      transitionDuration: {
        '2000': '2000ms',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in-left': 'slideInFromLeft 0.5s ease-in-out',
        'slide-in-right': 'slideInFromRight 0.5s ease-in-out',
        'slide-in-top': 'slideInFromTop 0.5s ease-in-out',
        'slide-in-bottom': 'slideInFromBottom 0.5s ease-in-out',
        'scale-in': 'scaleIn 0.5s ease-in-out',
        'rotate-in': 'rotateIn 0.5s ease-in-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInFromLeft: {
          '0%': { transform: 'translateX(-30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInFromRight: {
          '0%': { transform: 'translateX(30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInFromTop: {
          '0%': { transform: 'translateY(-30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInFromBottom: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        rotateIn: {
          '0%': { transform: 'rotate(-10deg)', opacity: '0' },
          '100%': { transform: 'rotate(0)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-diagonal': 'linear-gradient(to right bottom, var(--tw-gradient-stops))',
      },
      backdropBlur: {
        xs: '2px',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: 'inherit',
            a: {
              color: '#0056b3',
              '&:hover': {
                color: '#004e9f',
              },
            },
          },
        },
      },
    },
  },
  plugins: [],
}
