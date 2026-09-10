import React, { useState } from 'react';

import { AppIcon } from '@/components/ui/AppIcon';

export interface CriticalSlotData {
  id: string;
  index: number;
  equipment: {
    id: string;
    name: string;
    type: string;
    icon?: string;
  } | null;
}

export interface CriticalSlotProps {
  slot: CriticalSlotData;
  onRemove: (slotId: string) => void;
  onAssign?: (slotId: string) => void;
  className?: string;
}

export function CriticalSlot({
  slot,
  onRemove,
  onAssign,
  className = '',
}: CriticalSlotProps): React.ReactElement {
  const [isHighlighted, setIsHighlighted] = useState(false);

  const handleTap = () => {
    if (!slot.equipment && onAssign) {
      onAssign(slot.id);
    } else {
      setIsHighlighted(!isHighlighted);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(slot.id);
  };

  const hasEquipment = slot.equipment !== null;

  return (
    <div
      className={`critical-slot bg-surface-base relative min-h-[88px] rounded-lg border-2 transition-colors ${
        isHighlighted
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-border-theme'
      } ${className}`.trim()}
      onClick={handleTap}
      role="button"
      tabIndex={0}
      aria-label={`Critical slot ${slot.index + 1}${hasEquipment && slot.equipment ? ` containing ${slot.equipment.name}` : ' empty'}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleTap();
        }
      }}
    >
      {/* Slot number */}
      <div className="text-text-theme-muted absolute top-1 left-2 text-xs">
        #{slot.index + 1}
      </div>

      {hasEquipment && slot.equipment ? (
        <>
          {/* Equipment icon */}
          <div className="mb-1 flex h-12 items-center justify-center">
            {slot.equipment.icon ? (
              // oxlint-disable-next-line @next/next/no-img-element -- Equipment icons are static SVG/PNG assets
              <img
                src={slot.equipment.icon}
                alt=""
                className="h-10 w-10"
                aria-hidden="true"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <AppIcon
                  name="impact"
                  size="toolbar"
                  className="text-blue-500"
                  aria-hidden="true"
                />
              </div>
            )}
          </div>

          {/* Equipment name */}
          <div className="px-2 text-center">
            <p className="text-text-theme-primary line-clamp-2 text-xs font-medium">
              {slot.equipment.name}
            </p>
            <p className="text-text-theme-muted text-xs">
              {slot.equipment.type}
            </p>
          </div>

          {/* Remove button - visible when highlighted */}
          {isHighlighted && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 right-1 flex min-h-11 min-w-11 items-center justify-center rounded-full bg-red-500 p-1 transition-colors hover:bg-red-600"
              aria-label={`Remove ${slot.equipment.name} from slot ${slot.index + 1}`}
            >
              <AppIcon
                name="close"
                size="inline"
                className="text-text-theme-primary"
                aria-hidden="true"
              />
            </button>
          )}
        </>
      ) : (
        <>
          {/* Empty slot state */}
          <div className="flex h-full flex-col items-center justify-center px-2 py-4">
            <div className="border-border-theme-strong mb-2 flex h-12 w-12 items-center justify-center rounded-lg border-2 border-dashed">
              <AppIcon
                name="add"
                size="toolbar"
                className="text-text-theme-muted"
                aria-hidden="true"
              />
            </div>
            <p className="text-text-theme-muted text-center text-xs">
              {onAssign ? 'Tap to assign' : 'Empty slot'}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export interface CriticalSlotsGridProps {
  slots: CriticalSlotData[];
  onRemove: (slotId: string) => void;
  onAssign?: (slotId: string) => void;
  className?: string;
}

export function CriticalSlotsGrid({
  slots,
  onRemove,
  onAssign,
  className = '',
}: CriticalSlotsGridProps): React.ReactElement {
  return (
    <div
      className={`critical-slots-grid grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 ${className}`.trim()}
    >
      {slots.map((slot) => (
        <CriticalSlot
          key={slot.id}
          slot={slot}
          onRemove={onRemove}
          onAssign={onAssign}
        />
      ))}
    </div>
  );
}
