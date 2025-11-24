import type { ReactNode } from 'react';
import { classNames } from './utils/classNames';

export interface TabOption {
  readonly id: string;
  readonly label: string;
  readonly icon?: ReactNode;
  readonly count?: number;
}

interface TabsProps {
  readonly tabs: ReadonlyArray<TabOption>;
  readonly activeTab: string;
  readonly onChange: (tabId: string) => void;
  readonly className?: string;
}

export const Tabs = ({ tabs, activeTab, onChange, className }: TabsProps): JSX.Element => {
  return (
    <div
      className={classNames(
        'flex flex-wrap border-b border-[var(--surface-border)] bg-[var(--surface-panel)]',
        className
      )}
    >
      {tabs.map(tab => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            className={classNames(
              'relative flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-colors duration-150',
              isActive
                ? 'text-[var(--text-primary)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
            )}
            onClick={() => onChange(tab.id)}
            aria-selected={isActive}
            role="tab"
          >
            {tab.icon && <span aria-hidden>{tab.icon}</span>}
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span
                className={classNames(
                  'rounded-full px-2 py-0.5 text-[10px] font-mono',
                  isActive
                    ? 'bg-[var(--accent-primary)] text-slate-950'
                    : 'bg-[var(--surface-sunken)] text-[var(--text-muted)]'
                )}
              >
                {tab.count}
              </span>
            )}
            {isActive && (
              <span className="absolute inset-x-5 bottom-0 h-0.5 bg-[var(--accent-primary)]" />
            )}
          </button>
        );
      })}
    </div>
  );
};


