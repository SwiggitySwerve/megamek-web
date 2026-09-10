import React from 'react';

export interface PreviewToggleProps {
  readonly enabled: boolean;
  readonly onToggle: (next: boolean) => void;
}

export function PreviewToggle({
  enabled,
  onToggle,
}: PreviewToggleProps): React.ReactElement {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onToggle(!enabled)}
      data-testid="weapon-selector-preview-toggle"
      className={`min-h-[32px] rounded px-3 py-1 text-xs font-semibold transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none ${
        enabled
          ? 'bg-accent text-on-accent hover:bg-accent-hover focus:ring-accent'
          : 'text-text-theme-secondary bg-surface-raised hover:bg-surface-raised focus:ring-border-theme'
      }`}
    >
      Preview Damage: {enabled ? 'ON' : 'OFF'}
    </button>
  );
}
