/**
 * Canonical Type Index for Critical Slots Infrastructure
 * 
 * This module exports all shared types used across the critical-slot managers.
 * Import from here to ensure consistency and avoid circular dependencies.
 */

// Re-export core types from the main types system
export type {
  EquipmentObject,
  EquipmentAllocation,
  FixedSystemComponent,
  LocationSlotConfiguration,
  SectionValidationResult,
  SlotValidationResult,
} from '../../../types/CriticalSlots';

// Re-export UnitConfiguration and related types
export type {
  UnitConfiguration,
  UnitValidationResult,
  CompleteUnitState,
  SerializedEquipment,
  SerializedSlotAllocations,
  StateValidationResult,
  ArmorAllocation,
  SpecialEquipmentObject,
} from '../UnitCriticalManagerTypes';

// Export SlotAllocationManager types
export type {
  AllocationResult,
  EquipmentAllocation as SlotEquipmentAllocation,
  OptimizationResult,
  SlotConflict,
  ConflictResolution,
  ReorganizationSuggestion,
} from '../SlotAllocationManager';

// Export SlotValidationManager types
export type {
  ValidationResult,
  ValidationError,
  ValidationWarning,
  EfficiencyAnalysis,
  SlotReport,
  AvailableSlotLocation,
} from '../SlotValidationManager';

// Export SlotCalculationManager types
export type {
  SlotRequirements,
  AvailableSlots,
  SlotUtilization,
} from '../SlotCalculationManager';

// Export SpecialComponentCalculator types
export type {
  SpecialComponentAllocation,
  EndoSteelSlotAllocation,
  FerroFibrousSlotAllocation,
} from '../SpecialComponentCalculator';

// Export UnitCalculationManager types
export type {
  WeightBreakdown,
  ArmorAnalysis,
  HeatAnalysis,
} from '../UnitCalculationManager';

// Export ValidationManager types (from UnitCriticalManagerTypes)
export type {
  UnitValidationResult,
} from '../UnitCriticalManagerTypes';

