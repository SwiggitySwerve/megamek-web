/**
 * Customizer Types - STUB FILE
 * Types for the unit customizer
 * TODO: Replace with spec-driven implementation
 */

import { TechBase, RulesLevel } from './core';

export interface CustomizerState {
  unitId: string | null;
  selectedTab: string;
  selectedLocation: string | null;
  isDirty: boolean;
  validationResults: ValidationResult[];
}

export interface ValidationResult {
  code: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  location?: string;
  field?: string;
}

export interface CustomizerConfig {
  techBase: TechBase;
  rulesLevel: RulesLevel;
  era: string;
  allowMixedTech: boolean;
}

export interface ComparisonData {
  unitA: ComparisonUnit | null;
  unitB: ComparisonUnit | null;
}

export interface VariantDetails {
  variant_name: string;
  created_at: string;
  notes?: string;
  custom_data: {
    loadout?: UnitEquipmentItem[];
    [key: string]: unknown;
  };
}

export interface LoadoutChanges {
  onlyInA: UnitEquipmentItem[];
  onlyInB: UnitEquipmentItem[];
}

export interface ComparisonUnit {
  id: string;
  name: string;
  tonnage: number;
  techBase: string;
  movement: string;
  armor: number;
  firepower: number;
  battleValue: number;
}

// CustomizableUnit is an alias for units that can be edited
export type CustomizableUnit = import('./editor').EditableUnit;

// Equipment items
export interface EquipmentItem {
  id: string;
  internal_id?: string;
  name: string;
  category: string;
  weight: number;
  tonnage?: number;
  slots: number;
  techBase?: string;
  damage?: number | string;
  heat?: number;
  range?: string;
}

export interface UnitEquipmentItem extends EquipmentItem {
  location: string;
  slotIndex: number;
  quantity: number;
  instanceId: string;
  item_name?: string;
  item_type?: string;
}

// Comparison types
export interface ComparisonResult {
  unitA: ComparisonUnit | null;
  unitB: ComparisonUnit | null;
  differences: ComparisonDifference[];
  variantADetails: VariantDetails;
  variantBDetails: VariantDetails;
  loadoutChanges: LoadoutChanges;
  criticalsDifferences: CriticalsComparisonDifference[];
  totalEquipmentTonnageA: number;
  totalEquipmentTonnageB: number;
}

export interface ComparisonDifference {
  category: string;
  field: string;
  valueA: unknown;
  valueB: unknown;
  significant: boolean;
}

export interface CriticalsComparisonDifference {
  location: string;
  slotIndex: number;
  itemA: string | null;
  itemB: string | null;
  slotsA?: string[];
  slotsB?: string[];
}

