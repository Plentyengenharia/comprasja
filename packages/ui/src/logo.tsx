import * as React from 'react';
import { cn } from './cn';

type LogoProps = {
  className?: string;
  markClassName?: string;
  showWordmark?: boolean;
  inverted?: boolean;
};

/** Logotipo provisório original — símbolo geométrico de conexão/agilidade. */
export function ComprasJaLogo({
  className,
  markClassName,
  showWordmark = true,
  inverted = false,
}: LogoProps) {
  const ink = inverted ? '#FFFFFF' : '#102A43';
  const accent = inverted ? '#5EEAD4' : '#0D9488';
  const tech = inverted ? '#7DD3FC' : '#176B9A';

  return (
    <span className={cn('inline-flex items-center gap-2.5', className)} aria-label="Compras Já">
      <svg
        className={cn('h-8 w-8 shrink-0', markClassName)}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-hidden={showWordmark}
      >
        <title>Compras Já</title>
        <rect x="2" y="2" width="36" height="36" rx="10" fill={ink} />
        <path
          d="M12 20c0-4.418 3.582-8 8-8"
          stroke={tech}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M28 20c0 4.418-3.582 8-8 8"
          stroke={accent}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="20" cy="20" r="3.2" fill={accent} />
        <path d="M26 12l4 1.2-1.2 4" stroke={tech} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {showWordmark ? (
        <span
          className={cn(
            'text-lg font-semibold tracking-tight',
            inverted ? 'text-white' : 'text-brand-navy dark:text-white',
          )}
        >
          Compras <span className={inverted ? 'text-teal-200' : 'text-brand-emerald'}>Já</span>
        </span>
      ) : null}
    </span>
  );
}
