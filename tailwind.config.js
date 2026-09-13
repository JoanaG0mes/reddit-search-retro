/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0d0221',        // preto arroxeado — bordas e texto
        base: '#1a1035',       // fundo principal
        panel: '#2c1854',      // painéis / cards escuros
        panel2: '#3a1e6d',     // painéis secundários
        cyan: {
          DEFAULT: '#4deeea',
          soft: '#7ee8fa',
        },
        pink: {
          DEFAULT: '#f92aad',
        },
        yellow: {
          DEFAULT: '#ffe66d',
        },
        cream: '#f7f3e9',      // área de conteúdo clara
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'cursive'],
        mono: ['"Space Mono"', 'monospace'],
      },
      boxShadow: {
        pixel: '4px 4px 0 0 #0d0221',
        pixelSm: '2px 2px 0 0 #0d0221',
        pixelLg: '6px 6px 0 0 #0d0221',
        glowCyan: '0 0 0 2px #0d0221, 0 0 16px rgba(77,238,234,0.5)',
      },
      backgroundImage: {
        scanlines:
          'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 3px)',
        grid:
          'linear-gradient(rgba(77,238,234,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(77,238,234,0.06) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '24px 24px',
      },
      keyframes: {
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        floatY: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        blink: 'blink 1s steps(1) infinite',
        floatY: '3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
