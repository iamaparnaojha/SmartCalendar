import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary, #2563eb)',
        secondary: 'var(--color-secondary, #1e40af)',
        accent: 'var(--color-accent, #60a5fa)',
      },
      fontFamily: {
        heading: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
        '3xl': '64px',
      },
      animation: {
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-out-left': 'slideOutLeft 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'fade-out': 'fadeOut 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'flip-card': 'flipCard 0.6s ease-in-out',
        'holiday-glow': 'holidayGlow 2.5s ease-in-out infinite',
        'float-in': 'floatIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'month-slide': 'monthSlideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'tooltip-in': 'tooltipIn 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'note-reveal': 'noteReveal 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'bg-crossfade': 'bgCrossfade 0.8s ease-in-out forwards',
        'gentle-pulse': 'gentlePulse 3s ease-in-out infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
      },
      keyframes: {
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOutLeft: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(-100%)', opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        flipCard: {
          '0%': { transform: 'perspective(600px) rotateY(0deg)' },
          '50%': { transform: 'perspective(600px) rotateY(90deg)' },
          '100%': { transform: 'perspective(600px) rotateY(0deg)' },
        },
        holidayGlow: {
          '0%, 100%': {
            boxShadow: '0 0 8px var(--holiday-color, #ffd700), 0 0 20px rgba(255, 215, 0, 0.15)',
          },
          '50%': {
            boxShadow: '0 0 16px var(--holiday-color, #ffd700), 0 0 40px rgba(255, 215, 0, 0.25)',
          },
        },
        floatIn: {
          '0%': { opacity: '0', transform: 'translateY(12px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        monthSlideIn: {
          '0%': { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        tooltipIn: {
          '0%': { opacity: '0', transform: 'translateX(-50%) translateY(4px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateX(-50%) translateY(0) scale(1)' },
        },
        noteReveal: {
          '0%': { opacity: '0', transform: 'translateY(8px) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        bgCrossfade: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        gentlePulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.03)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0', transform: 'scale(0) rotate(0deg)' },
          '50%': { opacity: '1', transform: 'scale(1) rotate(180deg)' },
        },
      },
      backgroundImage: {
        'gradient-to-br-custom': 'linear-gradient(to bottom right, var(--color-start), var(--color-end))',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
export default config
