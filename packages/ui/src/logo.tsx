import * as React from 'react';
import { cn } from './cn';

type LogoProps = {
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
  showWordmark?: boolean;
  inverted?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Prefer PNG app icon; falls back to /logo-mark.png from the host app public folder. */
  markSrc?: string;
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

/** Logotipo oficial — ícone hexagonal com detalhe dourado + wordmark. */
export function ComprasJaLogo({
  className,
  markClassName,
  wordmarkClassName,
  showWordmark = true,
  inverted = false,
  size = 'md',
  markSrc = '/logo-mark.png',
}: LogoProps) {
  return (
    <span
      className={cn('inline-flex items-center gap-3', className)}
      aria-label="Compras Já"
    >
      <img
        src={markSrc}
        alt=""
        width={56}
        height={56}
        className={cn(markSize[size], 'shrink-0 rounded-[22%]', markClassName)}
        aria-hidden={showWordmark}
      />
      {showWordmark ? (
        <span
          className={cn(
            'font-display font-semibold leading-none whitespace-nowrap',
            wordSize[size],
            inverted ? 'text-white' : 'text-brand-navy dark:text-white',
            wordmarkClassName,
          )}
        >
          Compras <span className="text-brand-gold">Já</span>
        </span>
      ) : null}
    </span>
  );
}
