import type { Config } from 'tailwindcss';

/**
 * Design tokens oficiais do Compras Já.
 * Paleta definida no prompt master — não replicar Canal de Compras Brasil.
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
          muted: '#F7F9FC',
        },
        ink: {
          DEFAULT: '#172334',
          muted: '#64748B',
        },
        line: '#E2E8F0',
        success: '#16A34A',
        warning: '#D97706',
        danger: '#DC2626',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(16, 42, 67, 0.06), 0 8px 24px rgba(16, 42, 67, 0.06)',
      },
      borderRadius: {
        xl: '0.875rem',
      },
    },
  },
};

export default preset;
