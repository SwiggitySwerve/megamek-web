import React from 'react';

import type {
  MobileEquipmentItem,
  AvailableLocationOption,
} from './MobileEquipmentRow';

export function MobileLocationMenu({
  item,
  availableLocations,
  isLocationMenuOpen,
  onQuickAssign,
  onToggleLocationMenu,
}: {
  readonly item: MobileEquipmentItem;
  readonly availableLocations: readonly AvailableLocationOption[];
  readonly isLocationMenuOpen: boolean;
  readonly onQuickAssign?: (location: string) => void;
  readonly onToggleLocationMenu?: () => void;
}): React.ReactElement | null {
  if (!isLocationMenuOpen || item.isAllocated) {
    return null;
  }

  return (
    <div
      className="bg-surface-base border-accent/40 absolute top-full right-0 z-50 mt-1 min-w-[200px] rounded-lg border px-2 py-2 shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="text-text-theme-secondary mb-2 px-1 text-[10px] font-medium tracking-wide uppercase">
        Assign to Location
      </div>
      {availableLocations.length > 0 ? (
        <div className="grid grid-cols-2 gap-1">
          {availableLocations.map((loc) => (
            <button
              key={loc.location}
              disabled={!loc.canFit}
              onClick={(e) => {
                e.stopPropagation();
                onQuickAssign?.(loc.location);
                onToggleLocationMenu?.();
              }}
              className="bg-surface-raised hover:bg-accent/20 hover:border-accent/50 border-border-theme-subtle min-h-11 rounded border px-2 py-2 text-left text-xs transition-colors disabled:opacity-50"
            >
              <div className="text-text-theme-primary text-[11px] font-medium">
                {loc.label}
              </div>
              <div className="text-[9px] text-green-400/80">
                {loc.canFit
                  ? `${loc.availableSlots} free`
                  : (loc.reason ?? 'Not enough free slots')}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded bg-amber-900/10 px-2 py-3 text-center text-xs text-amber-400/80">
          No locations with enough slots
        </div>
      )}
    </div>
  );
}
