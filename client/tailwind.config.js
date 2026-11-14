/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#05060F',
          surface: '#0B0F1E',
          'surface-subtle': '#0E1428',
          'surface-raised': '#131B34',
          'surface-overlay': '#1A2444',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-active': 'rgba(34, 211, 238, 0.35)',
          'border-violet': 'rgba(139, 92, 246, 0.35)',
          'border-danger': 'rgba(244, 63, 94, 0.35)',
        },
        neon: {
          cyan: '#22D3EE',
          violet: '#8B5CF6',
          magenta: '#F43F5E',
          emerald: '#10B981',
          amber: '#F59E0B',
        },
        strength: {
          red: '#EF4444',
          orange: '#F97316',
          yellow: '#EAB308',
          green: '#10B981',
          cyan: '#22D3EE',
        },
      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 24px -2px rgba(34, 211, 238, 0.45)',
        'glow-cyan-lg': '0 0 48px -4px rgba(34, 211, 238, 0.65)',
        'glow-violet': '0 0 24px -2px rgba(139, 92, 246, 0.45)',
        'glow-violet-lg': '0 0 48px -4px rgba(139, 92, 246, 0.65)',
        'glow-magenta': '0 0 24px -2px rgba(244, 63, 94, 0.45)',
        'glow-emerald': '0 0 24px -2px rgba(16, 185, 129, 0.45)',
        'inner-glow-cyan': 'inset 0 0 24px 0 rgba(34, 211, 238, 0.12)',
        'inner-glow-violet': 'inset 0 0 24px 0 rgba(139, 92, 246, 0.12)',
        'glass-edge': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.12)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radar 6s linear infinite',
        'scanline-flow': 'scanline 8s linear infinite',
        shimmer: 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};
