/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'Monaco', 'Consolas', 'Liberation Mono', 'monospace'],
      },
      colors: {
        // Primary Purple - Design Token
        primary: {
          DEFAULT: '#6C63FF',
          dark: '#5A52D5',
          light: '#8B85FF',
          50: '#F0EFFF',
          100: '#D9D6FF',
          200: '#B3ADFF',
          300: '#8D85FF',
          400: '#6C63FF',
          500: '#5A52E0',
          600: '#4842B3',
          700: '#363186',
          800: '#242059',
          900: '#12102D',
        },
        // Accent Amber
        accent: '#F59E0B',
        // Success Green
        success: {
          DEFAULT: '#10B981',
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        // Danger Red
        danger: {
          DEFAULT: '#EF4444',
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
        // Dark theme colors - Design Token
        dark: {
          bg: '#0F0F1A',
          surface: '#1A1A2E',
          card: '#16213E',
          border: '#2A2A4A',
          'surface-hover': '#252542',
        },
        // Light theme colors - Design Token
        light: {
          bg: '#F9FAFB',
          surface: '#FFFFFF',
          card: '#F3F4F6',
          border: '#E5E7EB',
          'surface-hover': '#F1F5F9',
        },
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
        'glow': '0 0 20px rgba(108, 99, 255, 0.3)',
        'glow-lg': '0 0 40px rgba(108, 99, 255, 0.4)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #6C63FF 0%, #8D85FF 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0F0F1A 0%, #1A1A2E 100%)',
        'gradient-light': 'linear-gradient(180deg, #F9FAFB 0%, #FFFFFF 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
