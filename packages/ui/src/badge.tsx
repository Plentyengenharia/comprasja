import * as React from 'react';
import { cn } from './cn';

export function Badge({
  className,
  tone = 'neutral',
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'tech';
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
        tone === 'neutral' && 'bg-surface-muted text-ink-muted',
        tone === 'success' && 'bg-green-50 text-success',
        tone === 'warning' && 'bg-amber-50 text-warning',
        tone === 'danger' && 'bg-red-50 text-danger',
        tone === 'tech' && 'bg-sky-50 text-brand-tech',
        className,
      )}
      {...props}
    />
  );
}
