import * as React from 'react';
import { cn } from './cn';

type LogoProps = {
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
  showWordmark?: boolean;
  inverted?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
};

const markSize = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
  xl: 'h-14 w-14',
} as const;

const wordSize = {
  sm: 'text-[1.05rem] tracking-[-0.02em]',
  md: 'text-[1.35rem] tracking-[-0.03em]',
  lg: 'text-[1.65rem] tracking-[-0.035em]',
  xl: 'text-[1.9rem] tracking-[-0.04em]',
} as const;

/** Logotipo provisório original — símbolo geométrico de conexão/agilidade. */
export function ComprasJaLogo({
  className,
  markClassName,
  wordmarkClassName,
  showWordmark = true,
  inverted = false,
  size = 'md',
}: LogoProps) {
  const ink = inverted ? '#FFFFFF' : '#102A43';
  const accent = inverted ? '#5EEAD4' : '#0D9488';
  const tech = inverted ? '#7DD3FC' : '#176B9A';

  return (
    <span
      className={cn('inline-flex items-center gap-3', className)}
      aria-label="Compras Já"
    >
      <svg
        className={cn(markSize[size], 'shrink-0', markClassName)}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-hidden={showWordmark}
      >
        <title>Compras Já</title>
        <defs>
          <linearGradient id="cjMarkBg" x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor={ink} />
            <stop offset="1" stopColor={inverted ? '#0D9488' : '#176B9A'} stopOpacity="0.92" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="44" height="44" rx="14" fill="url(#cjMarkBg)" />
        <path
          d="M14 24c0-5.523 4.477-10 10-10"
          stroke={tech}
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <path
          d="M34 24c0 5.523-4.477 10-10 10"
          stroke={accent}
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <circle cx="24" cy="24" r="3.8" fill={accent} />
        <path
          d="M31.5 14.5l5 1.5-1.5 5"
          stroke={tech}
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showWordmark ? (
        <span
          className={cn(
            'font-display font-semibold leading-none whitespace-nowrap',
            wordSize[size],
            inverted ? 'text-white' : 'text-brand-navy dark:text-white',
            wordmarkClassName,
          )}
        >
          Compras{' '}
          <span className={inverted ? 'text-teal-200' : 'text-brand-emerald'}>Já</span>
        </span>
      ) : null}
    </span>
  );
}
