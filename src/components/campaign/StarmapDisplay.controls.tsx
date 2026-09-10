import React from 'react';

import { AppIcon } from '@/components/ui/AppIcon';

import { FACTION_COLORS } from './StarmapDisplay.model';

interface StarmapFactionLegendProps {
  readonly isOpen: boolean;
  readonly onToggle: (isOpen: boolean) => void;
}

interface StarmapZoomControlsProps {
  readonly zoom: number;
  readonly onZoomIn: () => void;
  readonly onZoomOut: () => void;
  readonly onResetView: () => void;
}

export function StarmapFactionLegend({
  isOpen,
  onToggle,
}: StarmapFactionLegendProps): React.ReactElement {
  return (
    <div className="text-text-theme-primary absolute top-3 right-3 text-xs">
      {isOpen ? (
        <div className="border-border-theme/80 bg-surface-deep/90 rounded border p-3 shadow-lg">
          <button
            type="button"
            onClick={() => onToggle(false)}
            className="text-text-theme-primary mb-2 flex w-full items-center justify-between gap-4 font-semibold"
            data-testid="starmap-legend-toggle"
            aria-expanded="true"
          >
            <span>Factions</span>
            <AppIcon name="close" size="inline" aria-hidden="true" />
          </button>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {Object.entries(FACTION_COLORS).map(([faction, color]) => (
              <div key={faction} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span>{faction}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => onToggle(true)}
          className="border-border-theme/80 bg-surface-deep/90 text-text-theme-primary hover:bg-surface-base rounded border px-3 py-1.5 font-semibold shadow-lg transition-colors"
          data-testid="starmap-legend-toggle"
          aria-expanded="false"
        >
          Legend
        </button>
      )}
    </div>
  );
}

export function StarmapZoomControls({
  zoom,
  onZoomIn,
  onZoomOut,
  onResetView,
}: StarmapZoomControlsProps): React.ReactElement {
  return (
    <div
      className="absolute right-4 bottom-4 flex flex-col items-end gap-1"
      data-testid="zoom-controls"
    >
      <span
        className="bg-surface-base/90 text-text-theme-primary rounded px-2 py-1 text-xs shadow-lg"
        data-testid="starmap-detail-status"
      >
        Zoom {(zoom * 100).toFixed(0)}%
      </span>
      <button
        type="button"
        onClick={onZoomIn}
        className="bg-surface-base text-text-theme-primary hover:bg-surface-raised flex min-h-11 min-w-11 items-center justify-center rounded p-2 shadow-lg transition-colors"
        title="Zoom in"
        data-testid="zoom-in-btn"
      >
        <AppIcon name="add" size="control" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={onZoomOut}
        className="bg-surface-base text-text-theme-primary hover:bg-surface-raised flex min-h-11 min-w-11 items-center justify-center rounded p-2 shadow-lg transition-colors"
        title="Zoom out"
        data-testid="zoom-out-btn"
      >
        <AppIcon name="remove" size="control" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={onResetView}
        className="bg-surface-base text-text-theme-primary hover:bg-surface-raised flex min-h-11 min-w-11 items-center justify-center rounded p-2 shadow-lg transition-colors"
        title="Reset view"
        data-testid="reset-view-btn"
      >
        <AppIcon name="refresh" size="control" aria-hidden="true" />
      </button>
    </div>
  );
}
