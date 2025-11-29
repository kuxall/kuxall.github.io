/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'bg-color': '#171c28',
        'text-color': '#ffffff',
        'accent-color': '#09d3ac',
        'dark-blue': '#171c28',
        'purple-accent': '#55198b',
        'cyan-accent': '#09d3ac',
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Agustina Regular', 'Montserrat', 'sans-serif'],
        orbitron: ['Orbitron', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      keyframes: {
        'pulse-light': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        neonPulse: {
          '0%, 100%': {
            textShadow: '0 0 5px rgba(0, 255, 255, 0.5), 0 0 10px rgba(0, 255, 255, 0.5), 0 0 20px rgba(0, 255, 255, 0.5)',
          },
          '50%': {
            textShadow: '0 0 10px rgba(0, 255, 255, 0.8), 0 0 20px rgba(0, 255, 255, 0.8), 0 0 40px rgba(0, 255, 255, 0.8)',
          },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      animation: {
        'pulse-light': 'pulse-light 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        glitch: 'glitch 0.3s infinite',
        'neon-pulse': 'neonPulse 2s ease-in-out infinite',
        scanline: 'scanline 2s linear infinite',
      },
    },
  },
  plugins: [],
}
