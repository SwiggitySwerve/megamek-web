import type { ReactNode } from 'react';
import { classNames } from './utils/classNames';

export interface FormFieldProps {
  readonly id?: string;
  readonly label: string;
  readonly helperText?: string;
  readonly error?: string;
  readonly children: ReactNode;
  readonly className?: string;
  readonly inline?: boolean;
}

export const FormField = ({
  id,
  label,
  helperText,
  error,
  children,
  className,
  inline = false,
}: FormFieldProps): JSX.Element => (
  <div
    className={classNames(
      'space-y-2',
      inline ? 'md:flex md:items-center md:gap-4 md:space-y-0' : '',
      className
    )}
  >
    <div className="flex-1">
      <label
        htmlFor={id}
        className="text-xs uppercase tracking-wide text-[var(--text-muted)] block"
      >
        {label}
      </label>
      {helperText && !error && (
        <p className="text-[11px] text-[var(--text-placeholder)] mt-1">{helperText}</p>
      )}
      {error && (
        <p className="text-[11px] text-[var(--status-danger)] mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
    <div className={inline ? 'flex-1' : ''}>{children}</div>
  </div>
);


