import React from 'react';

import { TabValidationCounts } from '@/utils/validation/validationNavigation';

import {
  ValidationIssueIcon,
  validationIconColors,
} from './ValidationIssueIcon';

interface ValidationTabBadgeProps {
  id?: string;
  counts: TabValidationCounts;
  showZero?: boolean;
  className?: string;
}

export function ValidationTabBadge({
  id,
  counts,
  className = '',
}: ValidationTabBadgeProps): React.ReactElement | null {
  if (counts.errors === 0 && counts.warnings === 0) return null;
  return (
    <span id={id} className={`inline-flex items-center gap-2 ${className}`}>
      {(['error', 'warning'] as const).map((severity) => {
        const count = severity === 'error' ? counts.errors : counts.warnings;
        return count > 0 ? (
          <span
            key={severity}
            className={`inline-flex items-center gap-1 text-[10px] font-semibold ${validationIconColors[severity]}`}
            aria-label={`${count} ${severity}${count === 1 ? '' : 's'}`}
          >
            <ValidationIssueIcon severity={severity} />
            {count > 99 ? '99+' : count}
            <span className="sr-only">
              {' '}
              {severity}
              {count === 1 ? '' : 's'}
            </span>
          </span>
        ) : null;
      })}
    </span>
  );
}

export function ValidationTabBadgeCompact({
  errorCount,
  warningCount,
  className = '',
}: {
  errorCount: number;
  warningCount: number;
  className?: string;
}): React.ReactElement | null {
  return (
    <ValidationTabBadge
      counts={{ errors: errorCount, warnings: warningCount, infos: 0 }}
      className={className}
    />
  );
}
