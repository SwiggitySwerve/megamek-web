/**
 * Types Index
 * Main export barrel for all types
 * 
 * @spec openspec/specs/phase-1-foundation
 */

// Core types (new spec-driven implementation)
export * from './core';

// Enums (new spec-driven implementation)
export * from './enums';

// Domain types (UI compatibility)
export * from './editor';
export * from './systemComponents';
export * from './unitDisplay';
export * from './customizer';
export * from './componentConfiguration';
// Re-export only non-conflicting items from criticalSlots
export type { 
  CriticalSlot, 
  CriticalSlotContent, 
  LocationSlots, 
  CriticalAllocation,
} from './criticalSlots';
export { LOCATION_SLOT_COUNTS } from './criticalSlots';

// Armor location interface
export interface ArmorLocation {
  location: string;
  name: string;
  abbreviation?: string;
  armor: number;
  armor_points?: number; // Alias for armor
  maxArmor: number;
  max_armor?: number; // Alias
  rearArmor?: number;
  rear_armor?: number; // Alias
  rear_armor_points?: number; // Alias  
  maxRearArmor?: number;
  max_rear_armor?: number; // Alias
  internalStructure?: number;
  internal_structure?: number; // Alias
}

// Critical slot location interface
export interface CriticalSlotLocation {
  name: string;
  slots: Array<{
    index: number;
    content: string | null;
    isFixed: boolean;
  }>;
}

// Armor location data from database
export interface FullUnitArmorLocation {
  location: string;
  armor_points?: number;
  rear_armor_points?: number;
  [key: string]: string | number | undefined;
}

// FullUnit is a less strict version for database records
export interface FullUnit {
  readonly id?: string;
  readonly name?: string;
  readonly chassis?: string;
  readonly model?: string;
  readonly techBase?: string;
  readonly rulesLevel?: string;
  readonly tonnage?: number;
  readonly mass?: number; // Alias for tonnage in some formats
  readonly unitType?: string;
  readonly type?: string;
  readonly data?: {
    type?: string;
    config?: string;
    armor?: {
      locations: FullUnitArmorLocation[];
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

// Unit configuration summary used by filters and UI components
export type UnitConfig = string;
export type UnitRole = string;
