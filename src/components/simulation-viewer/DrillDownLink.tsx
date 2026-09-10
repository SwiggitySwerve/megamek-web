import React from 'react';

import type { IDrillDownLinkProps } from '@/components/simulation-viewer/types';

import { AppIcon, type AppIconName } from '@/components/ui/AppIcon';
import { FOCUS_RING_CLASSES } from '@/utils/accessibility';

const ICONS: Record<string, AppIconName> = {
  'arrow-right': 'arrow-right',
  'external-link': 'external-link',
  'chevron-right': 'chevron-right',
  filter: 'filter',
  search: 'search',
};

interface DrillDownLinkInternalProps extends IDrillDownLinkProps {
  readonly onClick?: (
    targetTab: string,
    filter?: Record<string, unknown>,
  ) => void;
}

export const DrillDownLink: React.FC<DrillDownLinkInternalProps> = ({
  label,
  targetTab,
  filter,
  icon,
  onClick,
  className = '',
}) => {
  const handleClick = () => {
    onClick?.(targetTab, filter);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const resolvedIcon = icon ? ICONS[icon] : null;

  const linkClasses = [
    'inline-flex items-center gap-2',
    'text-accent',
    'hover:underline cursor-pointer',
    'py-2 px-3 min-h-[44px] md:py-0 md:px-0 md:min-h-0',
    FOCUS_RING_CLASSES,
    'rounded',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span
      role="link"
      tabIndex={0}
      className={linkClasses}
      aria-label={`Navigate to ${label}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      data-testid="drill-down-link"
      data-target-tab={targetTab}
    >
      {icon && (
        <span
          className="inline-block"
          aria-hidden="true"
          data-testid="drill-down-icon"
        >
          {resolvedIcon ? <AppIcon name={resolvedIcon} size="inline" /> : icon}
        </span>
      )}
      <span data-testid="drill-down-label">{label}</span>
    </span>
  );
};
