import type { Config } from 'tailwindcss'

export default {
  theme: {
    extend: {
      borderColor: {
        'input': 'var(--border)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out'
      },
      height: {
        'search-results': 'calc(100vh - 180px)',
        'code-block': '400px', // Add custom height for code blocks
      }
    },
  },
} satisfies Config
