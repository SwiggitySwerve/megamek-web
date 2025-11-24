import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { classNames } from './utils/classNames';

type SurfaceVariant = 'base' | 'sunken' | 'raised' | 'overlay';
type SurfacePadding = 'none' | 'sm' | 'md' | 'lg';

export interface SurfaceProps extends ComponentPropsWithoutRef<'div'> {
  readonly variant?: SurfaceVariant;
  readonly padding?: SurfacePadding;
  readonly border?: boolean;
  readonly children?: ReactNode;
}

const variantClasses: Record<SurfaceVariant, string> = {
  base: 'bg-[var(--surface-panel)]',
  sunken: 'bg-[var(--surface-sunken)]',
  raised: 'bg-[var(--surface-panel)] shadow-soft',
  overlay: 'bg-[var(--surface-overlay)] backdrop-blur',
};

const paddingClasses: Record<SurfacePadding, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-8',
};

export const Surface = ({
  variant = 'base',
  padding = 'md',
  border = true,
  className,
  children,
  ...rest
}: SurfaceProps): JSX.Element => (
  <div
    className={classNames(
      'rounded-2xl transition-colors duration-200',
      variantClasses[variant],
      paddingClasses[padding],
      border ? 'border border-[var(--surface-border)]' : '',
      className
    )}
    {...rest}
  >
    {children}
  </div>
);


