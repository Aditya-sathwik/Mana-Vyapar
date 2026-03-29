import * as React from 'react';
import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-11 w-full rounded-xl bg-muted px-4 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:bg-card focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:shadow-[0px_0px_8px_rgba(0,105,72,0.2)] dark:focus-visible:shadow-[0px_0px_8px_rgba(16,185,129,0.2)] disabled:cursor-not-allowed disabled:opacity-50',
          error && 'bg-destructive/10 focus-visible:ring-destructive',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
