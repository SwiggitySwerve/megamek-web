import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { classNames } from './utils/classNames';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--accent-primary)] text-slate-950 hover:bg-[var(--accent-primary-hover)] focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]',
  secondary:
    'bg-[var(--surface-panel)] text-[var(--text-primary)] border border-[var(--surface-border)] hover:border-[var(--accent-primary)]',
  ghost:
    'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[color-mix(in srgb,var(--surface-panel) 60%,transparent)]',
  danger:
    'bg-[var(--status-danger)] text-slate-950 hover:bg-[color-mix(in srgb,var(--status-danger) 85%,black)] focus-visible:ring-2 focus-visible:ring-[var(--status-danger)]',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'text-xs px-3 py-1.5',
  md: 'text-sm px-4 py-2',
  lg: 'text-base px-6 py-3',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      className,
      children,
      disabled,
      ...rest
    },
    ref
  ) => (
    <button
      ref={ref}
      className={classNames(
        'inline-flex items-center justify-center gap-2 rounded-pill font-semibold transition-colors duration-200 focus:outline-none',
        variantClasses[variant],
        sizeClasses[size],
        (disabled || loading) ? 'opacity-60 cursor-not-allowed' : '',
        className
      )}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <span className="animate-pulse-soft h-2 w-2 rounded-full bg-current" />}
      {children}
    </button>
  )
);

Button.displayName = 'Button';


