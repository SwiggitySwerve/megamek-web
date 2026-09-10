import type { Dispatch, SetStateAction } from 'react';

import type { SlotContent } from './criticalSlotTypes';

export interface SlotInteractivityState {
  canDrag: boolean;
  isTouchDevice: boolean;
  isFixedOnOmni: boolean;
  canUnassign: boolean;
}

export interface SlotDragStartState {
  canDrag: boolean;
  equipmentId?: string;
  onDragStart?: (equipmentId: string) => void;
  setIsDragging: Dispatch<SetStateAction<boolean>>;
}

export interface SlotDropState {
  slot: SlotContent;
  onDrop: (equipmentId: string) => void;
  setIsDragOver: Dispatch<SetStateAction<boolean>>;
}

export interface SlotRemoveState {
  canUnassign: boolean;
  onRemove: () => void;
}

export interface SlotContextMenuState extends SlotRemoveState {
  setContextMenu: Dispatch<SetStateAction<{ x: number; y: number } | null>>;
}

export interface SlotTouchState extends SlotContextMenuState {
  isTouchDevice: boolean;
  setLongPressTimer: Dispatch<
    SetStateAction<ReturnType<typeof setTimeout> | null>
  >;
}

export interface SlotKeyState extends SlotRemoveState {
  onClick: () => void;
}

export interface DoubleSlotDragStartState {
  canDrag: boolean;
  equipmentId?: string;
  onDragStart?: (equipmentId: string) => void;
}

export interface DoubleSlotDropState {
  onDrop: (equipmentId: string) => void;
  setIsDragOver: Dispatch<SetStateAction<boolean>>;
}

export interface DoubleSlotRemoveState {
  canUnassign: boolean;
  onRemove: () => void;
}

export interface DoubleSlotContextMenuState extends DoubleSlotRemoveState {
  setContextMenu: Dispatch<SetStateAction<{ x: number; y: number } | null>>;
}
