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
          'inline-flex items-center justify-center gap-2 rounded-2xl font-display font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-tech/40 disabled:pointer-events-none disabled:opacity-50',
          size === 'sm' && 'h-10 px-4 text-sm',
          size === 'md' && 'h-11 px-5 text-sm',
          size === 'lg' && 'h-12 px-7 text-base',
          variant === 'primary' &&
            'bg-brand-charcoal text-white shadow-soft hover:-translate-y-0.5 hover:bg-[#303741]',
          variant === 'secondary' &&
            'bg-brand-gold text-brand-charcoal shadow-soft hover:-translate-y-0.5 hover:bg-brand-gold-hover hover:text-white',
          variant === 'outline' &&
            'border border-line bg-white/80 text-ink backdrop-blur hover:bg-white dark:bg-transparent',
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
