import type { Config } from 'tailwindcss';

/**
 * Design tokens oficiais do Compras Já.
 * Identidade própria — não replicar Canal de Compras Brasil.
 */
const preset: Partial<Config> = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#102A43',
          tech: '#176B9A',
          emerald: '#0D9488',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F3F7FB',
        },
        ink: {
          DEFAULT: '#122033',
          muted: '#5B6B7C',
        },
        line: '#D9E3EE',
        success: '#16A34A',
        warning: '#D97706',
        danger: '#DC2626',
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-outfit)', 'var(--font-manrope)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(16, 42, 67, 0.05), 0 18px 40px rgba(16, 42, 67, 0.08)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
    },
  },
};

export default preset;
