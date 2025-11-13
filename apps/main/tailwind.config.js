/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/shared/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Enhanced Orbitron Theme Colors - Dark Indigo + Hunter Green blend
        primarydark: '#1e2749',     // Dark indigo
        secondarydark: '#2C5530',   // Hunter green dark
        tertiarydark: '#2d3561',    // Medium dark indigo

        // Accent Colors - Dark Indigo + Hunter Green Palette
        indigo: {
          50: '#e0e7ff',
          400: '#6366f1',
          500: '#3d3d6b',
          600: '#2d3561',
          700: '#1e2749',
        },
        emerald: {
          50: '#d1fae5',
          400: '#34d399',
          500: '#355E3B',
          600: '#2C5530',
          700: '#1e3a20',
        },
        blue: {
          50: '#dbeafe',
          400: '#60a5fa',
          500: '#3b82f6', 
          600: '#2563eb',
          700: '#1d4ed8',
        },
        purple: {
          50: '#ede9fe',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        orange: {
          50: '#fed7aa',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
        },
        
        // Glass morphism and overlays - enhanced
        white: {
          DEFAULT: '#ffffff',
          5: 'rgba(255, 255, 255, 0.05)',
          10: 'rgba(255, 255, 255, 0.10)',
          20: 'rgba(255, 255, 255, 0.20)',
          30: 'rgba(255, 255, 255, 0.30)',
          40: 'rgba(255, 255, 255, 0.40)',
          60: 'rgba(255, 255, 255, 0.60)',
          80: 'rgba(255, 255, 255, 0.80)',
        },
        
        // Status colors
        success: '#10b981',
        warning: '#f59e0b', 
        error: '#ef4444',
        info: '#3b82f6',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'hero-xs': ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'hero-sm': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'hero-md': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'hero-lg': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'hero-xl': ['6rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        
        // Enhanced gradients - Dark Indigo + Hunter Green
        'orbitron-primary': 'linear-gradient(135deg, #1e2749 0%, #2d3561 50%, #2C5530 100%)',
        'orbitron-secondary': 'linear-gradient(135deg, #2C5530 0%, #2d3561 50%, #1e2749 100%)',
        'orbitron-hero': 'linear-gradient(to right, var(--tw-gradient-stops))',
        'gradient-subtle': 'linear-gradient(135deg, rgba(53, 94, 59, 0.1) 0%, rgba(61, 61, 107, 0.1) 100%)',
        'gradient-strong': 'linear-gradient(135deg, rgba(53, 94, 59, 0.2) 0%, rgba(61, 61, 107, 0.2) 100%)',
        'gradient-emerald': 'linear-gradient(135deg, #355E3B 0%, #2C5530 100%)',
        'gradient-indigo': 'linear-gradient(135deg, #3d3d6b 0%, #2d3561 100%)',
        'gradient-purple': 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        'gradient-text': 'linear-gradient(135deg, #355E3B 0%, #3d3d6b 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite alternate',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-in-up': 'slideInUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'scale-up': 'scaleUp 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': {
            boxShadow: '0 0 5px rgba(16, 185, 129, 0.5), 0 0 20px rgba(16, 185, 129, 0.3)',
          },
          '100%': {
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.8), 0 0 40px rgba(16, 185, 129, 0.5)',
          },
        },
        slideUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        scaleUp: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.95)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        pulseGlow: {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
          },
          '50%': {
            boxShadow: '0 0 40px rgba(16, 185, 129, 0.8)',
          },
        },
        bounceSubtle: {
          '0%, 100%': {
            transform: 'translateY(-5%)',
          },
          '50%': {
            transform: 'translateY(0)',
          },
        },
        shimmer: {
          '0%': {
            transform: 'translateX(-100%)',
          },
          '100%': {
            transform: 'translateX(100%)',
          },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-emerald': '0 0 20px rgba(16, 185, 129, 0.5)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.5)',
        'glow-emerald-lg': '0 0 40px rgba(16, 185, 129, 0.6)',
        'glow-blue-lg': '0 0 40px rgba(59, 130, 246, 0.6)',
        'glow-purple-lg': '0 0 40px rgba(139, 92, 246, 0.6)',
        'inner-glow': 'inset 0 0 20px rgba(16, 185, 129, 0.1)',
        'card-hover': '0 20px 40px rgba(0, 0, 0, 0.3)',
        'button-glow': '0 0 30px rgba(16, 185, 129, 0.4)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [],
}