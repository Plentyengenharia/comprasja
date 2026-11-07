import * as React from 'react';
import { cn } from './cn';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-tech/40 disabled:pointer-events-none disabled:opacity-50',
          size === 'sm' && 'h-9 px-3 text-sm',
          size === 'md' && 'h-11 px-4 text-sm',
          size === 'lg' && 'h-12 px-6 text-base',
          variant === 'primary' && 'bg-brand-navy text-white hover:bg-[#0c2136]',
          variant === 'secondary' && 'bg-brand-emerald text-white hover:bg-[#0b7f75]',
          variant === 'outline' &&
            'border border-line bg-white text-ink hover:bg-surface-muted dark:bg-transparent',
          variant === 'ghost' && 'text-ink hover:bg-surface-muted',
          variant === 'danger' && 'bg-danger text-white hover:bg-red-700',
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';
