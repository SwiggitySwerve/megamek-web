/**
 * Critical Slots Types - STUB FILE
 * Types for critical slot management
 * TODO: Replace with spec-driven implementation
 */

export interface CriticalSlot {
  index: number;
  location: string;
  content: CriticalSlotContent | null;
  isFixed: boolean;
  isRollable: boolean;
}

export interface CriticalSlotContent {
  id: string;
  name: string;
  type: 'equipment' | 'actuator' | 'system' | 'empty';
  equipmentId?: string;
  isDestroyed?: boolean;
}

export interface LocationSlots {
  location: string;
  totalSlots: number;
  usedSlots: number;
  freeSlots: number;
  slots: CriticalSlot[];
}

export interface CriticalAllocation {
  equipmentId: string;
  location: string;
  startSlot: number;
  slotsUsed: number;
}

// Location constants
export const MECH_LOCATIONS = [
  'Head',
  'Center Torso',
  'Left Torso',
  'Right Torso',
  'Left Arm',
  'Right Arm',
  'Left Leg',
  'Right Leg',
] as const;

export type MechLocation = typeof MECH_LOCATIONS[number];

export const LOCATION_SLOT_COUNTS: Record<string, number> = {
  'Head': 6,
  'Center Torso': 12,
  'Left Torso': 12,
  'Right Torso': 12,
  'Left Arm': 12,
  'Right Arm': 12,
  'Left Leg': 6,
  'Right Leg': 6,
};


