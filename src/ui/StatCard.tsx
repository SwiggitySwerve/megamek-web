import type { ReactNode } from 'react';
import { Surface } from './Surface';
import { classNames } from './utils/classNames';

type StatTone = 'neutral' | 'positive' | 'negative';

export interface StatCardProps {
  readonly label: string;
  readonly value: ReactNode;
  readonly helperText?: string;
  readonly icon?: ReactNode;
  readonly tone?: StatTone;
  readonly className?: string;
}

const toneClasses: Record<StatTone, string> = {
  neutral: 'text-[var(--text-primary)]',
  positive: 'text-[var(--status-success)]',
  negative: 'text-[var(--status-danger)]',
};

export const StatCard = ({
  label,
  value,
  helperText,
  icon,
  tone = 'neutral',
  className,
}: StatCardProps): JSX.Element => (
  <Surface padding="sm" className={classNames('flex flex-col gap-2', className)}>
    <div className="flex items-center gap-2 text-[var(--text-muted)] text-xs uppercase tracking-wide">
      {icon && <span className="text-[var(--text-secondary)]">{icon}</span>}
      <span>{label}</span>
    </div>
    <div className={classNames('text-2xl font-mono', toneClasses[tone])}>{value}</div>
    {helperText && <p className="text-[var(--text-muted)] text-[11px]">{helperText}</p>}
  </Surface>
);


