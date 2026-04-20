/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#050505',
        surface: '#121212',
        border: '#262626',
        primary: '#A855F7',
        secondary: '#D946EF',
        'text-primary': '#FFFFFF',
        'text-secondary': '#A1A1AA',
        success: '#22c55e',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6',
        'accent': '#A855F7',
        'accent-hover': '#D946EF',
        'accent-muted': 'rgba(168, 85, 247, 0.3)',
        'accent-glow': 'rgba(168, 85, 247, 0.5)',
        'bg-primary': '#050505',
        'bg-surface': '#121212',
        'bg-elevated': '#1a1a1a',
        'bg-card': '#121212',
        'bg-muted': 'rgba(18, 18, 18, 0.6)',
        'bg-glass': 'rgba(18, 18, 18, 0.75)',
        'text-muted': '#71717A',
        'border-subtle': '#1f1f1f',
        'border-accent': 'rgba(168, 85, 247, 0.4)',
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(168, 85, 247, 0.25)',
        'glow': '0 0 30px rgba(168, 85, 247, 0.35)',
        'glow-md': '0 0 40px rgba(168, 85, 247, 0.4)',
        'glow-lg': '0 0 60px rgba(168, 85, 247, 0.45)',
        'glow-xl': '0 0 80px rgba(168, 85, 247, 0.5)',
        'glow-purple': '0 0 40px rgba(168, 85, 247, 0.4)',
        'glow-purple-sm': '0 0 20px rgba(168, 85, 247, 0.25)',
        'glow-purple-lg': '0 0 60px rgba(168, 85, 247, 0.5)',
        'glow-magenta': '0 0 40px rgba(217, 70, 239, 0.4)',
        'glow-magenta-sm': '0 0 20px rgba(217, 70, 239, 0.25)',
        'glow-intense': '0 0 80px rgba(168, 85, 247, 0.5)',
        'inner-glow': 'inset 0 0 20px rgba(168, 85, 247, 0.15)',
        'inner-glow-lg': 'inset 0 0 30px rgba(168, 85, 247, 0.2)',
        'card-hover': '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 60px rgba(168, 85, 247, 0.15)',
        'card-glow': '0 0 0 1px rgba(168, 85, 247, 0.15), 0 20px 50px -10px rgba(0, 0, 0, 0.5)',
        'button-glow': '0 0 20px rgba(168, 85, 247, 0.3), 0 4px 20px -4px rgba(168, 85, 247, 0.4)',
        'button-glow-lg': '0 0 35px rgba(168, 85, 247, 0.5), 0 10px 30px -10px rgba(0, 0, 0, 0.5)',
        'play-btn': '0 0 30px rgba(168, 85, 247, 0.4)',
        'play-btn-lg': '0 0 50px rgba(168, 85, 247, 0.6)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-down': 'slideDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-left': 'slideLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-right': 'slideRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
        'spin-fast': 'spin 4s linear infinite',
        'pulse-ring': 'pulseRing 1.5s ease-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseGlow: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.3)' 
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(168, 85, 247, 0.6), 0 0 60px rgba(217, 70, 239, 0.3)' 
          },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseRing: {
          '0%': { 
            transform: 'scale(0.8)',
            opacity: '1' 
          },
          '100%': { 
            transform: 'scale(1.5)',
            opacity: '0' 
          },
        },
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '32px',
        '4xl': '40px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #A855F7 0%, #D946EF 50%, #A855F7 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #D946EF 0%, #A855F7 100%)',
        'gradient-dark': 'linear-gradient(180deg, #050505 0%, #121212 100%)',
        'gradient-surface': 'linear-gradient(180deg, #121212 0%, #0a0a0a 100%)',
        'shimmer-gradient': 'linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.1), transparent)',
        'glow-radial': 'radial-gradient(circle at center, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      transitionDuration: {
        '0': '0ms',
        '100': '100ms',
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      minWidth: {
        'sidebar': '280px',
      },
      maxWidth: {
        'content': '1280px',
        'card': '400px',
      },
      zIndex: {
        'dropdown': '100',
        'sticky': '200',
        'fixed': '300',
        'modal-backdrop': '400',
        'modal': '500',
        'popover': '600',
        'tooltip': '700',
      },
    },
  },
  plugins: [],
}
