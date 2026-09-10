import type { CritEntry, SlotContent } from './criticalSlotTypes';

import { getSlotContentClasses } from './SlotVisualHelpers';

interface DoubleSlotVisualState {
  primary: SlotContent;
  isAssignable: boolean;
  isDragOver: boolean;
  isPairable: boolean;
  hasPair: boolean;
}

export function getDoubleSlotContainerClasses(
  state: DoubleSlotVisualState,
): string {
  const { primary, isAssignable, isDragOver, isPairable, hasPair } = state;
  const canAcceptDrop =
    (primary.type === 'empty' && isAssignable) || (isPairable && !hasPair);
  if (isDragOver) {
    return canAcceptDrop
      ? 'bg-green-700 border-green-400 text-white scale-[1.02]'
      : 'bg-red-950/70 border-red-400';
  }
  if (isAssignable && primary.type === 'empty') {
    return 'bg-amber-500/10 border-amber-400/70';
  }
  if (isPairable && !hasPair && primary.type === 'equipment') {
    return `${getSlotContentClasses(primary)} ring-1 ring-blue-500/30 ring-inset`;
  }
  return getSlotContentClasses(primary);
}

export function getDoubleSlotTitle(
  primary: SlotContent,
  canDrag: boolean,
  isPairable: boolean,
  hasPair: boolean,
): string | undefined {
  if (isPairable && !hasPair && primary.type === 'equipment') {
    return 'Double-slot: drop compatible ammo or heat sink to pair';
  }
  return canDrag
    ? 'Drag to move, double-click or right-click to unassign'
    : undefined;
}

export function getSingleDoubleSlotAriaLabel(entry: CritEntry): string {
  return entry.primary.name
    ? `Slot ${entry.index + 1}: ${entry.primary.name}`
    : `Empty slot ${entry.index + 1}`;
}

export function getPairDoubleSlotAriaLabel(
  entry: CritEntry,
  secondary: SlotContent,
): string {
  return `Double slot ${entry.index + 1}: ${entry.primary.name ?? 'unknown'} + ${
    secondary.name ?? 'unknown'
  }`;
}
