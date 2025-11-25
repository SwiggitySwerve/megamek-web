/**
 * Enhanced System Components Data Model
 * Extended structure with tech base awareness and construction rules validation
 * 
 * @deprecated
 * Use `src/types/core/ComponentInterfaces.ts` instead.
 */

import { 
  SystemComponents, 
  EngineComponent, 
  GyroComponent, 
  CockpitComponent, 
  StructureComponent, 
  ArmorComponent, 
  HeatSinkComponent
} from './systemComponents';

import {
  EngineType,
  HeatSinkType,
  TechBase,
  TechLevel
} from './core/BaseTypes';

export { TechBase, TechLevel };

// Enhanced component interfaces with tech base awareness
/** @deprecated */
export interface EnhancedEngineComponent extends EngineComponent {
  techBase: 'Inner Sphere' | 'Clan' | 'Both';
  specification: EngineSpecification;
}

/** @deprecated */
export interface EnhancedHeatSinkComponent extends HeatSinkComponent {
  techBase: 'Inner Sphere' | 'Clan' | 'Both';
  specification: HeatSinkSpecification;
}

/** @deprecated */
export interface EnhancedStructureComponent extends StructureComponent {
  techBase: 'Inner Sphere' | 'Clan' | 'Both';
  specification: StructureSpecification;
}

/** @deprecated */
export interface EnhancedArmorComponent extends ArmorComponent {
  techBase: 'Inner Sphere' | 'Clan' | 'Both';
  specification: ArmorSpecification;
}

/** @deprecated */
export interface EnhancedGyroComponent extends GyroComponent {
  techBase: 'Inner Sphere' | 'Clan' | 'Both';
  specification: GyroSpecification;
}

/** @deprecated */
export interface EnhancedCockpitComponent extends CockpitComponent {
  techBase: 'Inner Sphere' | 'Clan' | 'Both';
  specification: CockpitSpecification;
}

// Enhanced system components interface
/** @deprecated */
export interface EnhancedSystemComponents extends SystemComponents {
  techBase: TechBase;
  techLevel: TechLevel;
  era: string;
  
  // Enhanced component specs with tech base awareness
  engine: EnhancedEngineComponent;
  gyro: EnhancedGyroComponent;
  cockpit: EnhancedCockpitComponent;
  structure: EnhancedStructureComponent;
  armor: EnhancedArmorComponent;
  heatSinks: EnhancedHeatSinkComponent;
}

// Component specifications
/** @deprecated */
export interface EngineSpecification {
  techBase: 'Inner Sphere' | 'Clan' | 'Both';
  weightMultiplier: number;
  slotRequirements: {
    centerTorso: number;
    leftTorso: number;
    rightTorso: number;
  };
  survivabilityRules: {
    sideDestroyed: 'shutdown' | 'continue_penalty' | 'destroyed';
    bothSidesDestroyed: 'destroyed' | 'continue_severe';
  };
  heatSinkCapacity: number;
  costMultiplier: number;
  techLevel: TechLevel;
  introductionYear: number;
  extinctionYear?: number;
}

/** @deprecated */
export interface HeatSinkSpecification {
  techBase: 'Inner Sphere' | 'Clan' | 'Both';
  dissipation: number;
  weight: number;
  criticalSlots: number;
  costMultiplier: number;
  techLevel: TechLevel;
  introductionYear: number;
  extinctionYear?: number;
}

/** @deprecated */
export interface StructureSpecification {
  techBase: 'Inner Sphere' | 'Clan' | 'Both';
  weightMultiplier: number;
  criticalSlots: number;
  slotDistribution: { [location: string]: number };
  costMultiplier: number;
  techLevel: TechLevel;
  introductionYear: number;
  extinctionYear?: number;
}

/** @deprecated */
export interface ArmorSpecification {
  techBase: 'Inner Sphere' | 'Clan' | 'Both';
  weightMultiplier: number;
  criticalSlots: number;
  slotDistribution: { [location: string]: number };
  costMultiplier: number;
  techLevel: TechLevel;
  introductionYear: number;
  extinctionYear?: number;
}

/** @deprecated */
export interface GyroSpecification {
  techBase: 'Inner Sphere' | 'Clan' | 'Both';
  weightMultiplier: number;
  criticalSlots: number;
  costMultiplier: number;
  techLevel: TechLevel;
  introductionYear: number;
  extinctionYear?: number;
}

/** @deprecated */
export interface CockpitSpecification {
  techBase: 'Inner Sphere' | 'Clan' | 'Both';
  weight: number;
  criticalSlots: number;
  costMultiplier: number;
  techLevel: TechLevel;
  introductionYear: number;
  extinctionYear?: number;
}

// Construction context for validation
/** @deprecated */
export interface ConstructionContext {
  mechTonnage: number;
  techBase: TechBase;
  techLevel: TechLevel;
  era: string;
  allowMixedTech: boolean;
  customRules?: string[];
}

// Validation results
/** @deprecated */
export interface ConstructionValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  techBaseViolations: TechBaseViolation[];
  slotViolations: SlotViolation[];
  weightViolations: WeightViolation[];
  costCalculation: CostCalculation | null;
}

/** @deprecated */
export interface TechBaseViolation {
  component: string;
  violation: 'tech_base_mismatch' | 'era_unavailable' | 'tech_level_incompatible';
  details: string;
}

/** @deprecated */
export interface SlotViolation {
  location: string;
  required: number;
  available: number;
  component: string;
}

/** @deprecated */
export interface WeightViolation {
  type: 'overweight' | 'invalid_modifier';
  excess?: number;
  details: string;
}

/** @deprecated */
export interface CostCalculation {
  totalCost: number;
  breakdown: CostBreakdown;
  modifiers: CostModifier[];
}

/** @deprecated */
export interface CostBreakdown {
  chassis: number;
  engine: number;
  structure: number;
  armor: number;
  heatSinks: number;
  gyro: number;
  cockpit: number;
  equipment: number;
  mixedTechPenalty: number;
}

/** @deprecated */
export interface CostModifier {
  type: string;
  description: string;
  multiplier: number;
  applies_to: string[];
}

// Change impact analysis
/** @deprecated */
export interface ConstructionChangeImpact {
  slotImpact: SlotChangeImpact;
  weightImpact: WeightChangeImpact;
  costImpact: CostChangeImpact;
  techCompatibilityImpact: TechCompatibilityImpact;
}

/** @deprecated */
export interface SlotChangeImpact {
  displacedEquipment: EquipmentAllocation[];
  newSlotRequirements: { [location: string]: number };
  availabilityChange: { [location: string]: number };
}

/** @deprecated */
export interface WeightChangeImpact {
  weightDelta: number;
  newTotalWeight: number;
  affectedSystems: string[];
  violations: WeightViolation[];
}

/** @deprecated */
export interface CostChangeImpact {
  costDelta: number;
  newTotalCost: number;
  affectedSystems: string[];
}

/** @deprecated */
export interface TechCompatibilityImpact {
  compatibilityChanges: string[];
  newRestrictions: string[];
  removedRestrictions: string[];
}

/** @deprecated */
export interface EquipmentAllocation {
  equipmentData: any; // Will be defined when integrating with equipment system
  location: string;
  slots: number[];
}

// Component change tracking
/** @deprecated */
export interface ComponentChange {
  componentType: 'engine' | 'gyro' | 'structure' | 'armor' | 'heatSink' | 'cockpit';
  oldValue: any;
  newValue: any;
}

// Component options for UI
/** @deprecated */
export interface ComponentOption {
  id: string
  name: string
  techBase: string
  available: boolean
  reason?: string
  details?: {
    weight: number
    criticalSlots: number
    cost: number
    techLevel: string
    introductionYear: number
  }
}

/** @deprecated */
export interface EquipmentCompatibilityResult {
  isCompatible: boolean
  issues: string[]
  warnings: string[]
  recommendations: string[]
}

export type ComponentType = 'engine' | 'gyro' | 'structure' | 'armor' | 'heatSink' | 'cockpit';

// Tech compatibility utilities
/** @deprecated */
export interface TechCompatibilityResult {
  isCompatible: boolean;
  restrictions: string[];
  warnings: string[];
  errors: string[];
}

// Mixed tech rules
/** @deprecated */
export interface MixedTechPenalties {
  battleValueMultiplier: number;
  costMultiplier: number;
  additionalRestrictions: string[];
}

/** @deprecated */
export interface MixedTechValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  violations: TechBaseViolation[];
}

// Era availability
/** @deprecated */
export interface EraAvailability {
  available: boolean;
  rating: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'X';
  costMultiplier: number;
  restrictions?: string[];
}

// Enhanced utility functions
/** @deprecated */
export function isTechBaseCompatible(
  componentTechBase: string, 
  chassisTechBase: TechBase
): boolean {
  const compatibilityRules: { [key: string]: TechBase[] } = {
    'Inner Sphere': ['Inner Sphere', 'Mixed (IS Chassis)'],
    'Clan': ['Clan', 'Mixed (Clan Chassis)'],
    'Both': ['Inner Sphere', 'Clan', 'Mixed (IS Chassis)', 'Mixed (Clan Chassis)']
  };

  return compatibilityRules[componentTechBase]?.includes(chassisTechBase) || false;
}

/** @deprecated */
export function getTechBaseFromEngineType(engineType: EngineType): 'Inner Sphere' | 'Clan' | 'Both' {
  if (engineType === 'XL (IS)' || engineType === 'Light') {
    return 'Inner Sphere';
  } else if (engineType === 'XL (Clan)') {
    return 'Clan';
  }
  return 'Both';
}

/** @deprecated */
export function getTechBaseFromHeatSinkType(heatSinkType: HeatSinkType): 'Inner Sphere' | 'Clan' | 'Both' {
  if (heatSinkType === 'Double (IS)') {
    return 'Inner Sphere';
  } else if (heatSinkType === 'Double (Clan)') {
    return 'Clan';
  }
  return 'Both';
}

/** @deprecated */
export function isAdvancedTechnology(techLevel: TechLevel): boolean {
  return techLevel === 'Advanced' || techLevel === 'Experimental';
}

/** @deprecated */
export function isTechLevelCompatible(
  componentTechLevel: TechLevel, 
  contextTechLevel: TechLevel
): boolean {
  const techLevelHierarchy: TechLevel[] = ['Introductory', 'Standard', 'Advanced', 'Experimental'];
  const componentIndex = techLevelHierarchy.indexOf(componentTechLevel);
  const contextIndex = techLevelHierarchy.indexOf(contextTechLevel);
  return componentIndex <= contextIndex;
}

// Engine survivability utility
/** @deprecated */
export function getEngineSurvivabilityDescription(engineType: EngineType): string {
  if (engineType === 'XL (IS)') {
    return 'Destroyed if either side torso is lost';
  } else if (engineType === 'XL (Clan)') {
    return 'Continues with -2 penalty if one side torso is lost';
  } else if (engineType === 'Light') {
    return 'Reduced penalty for side torso loss';
  } else if (engineType === 'XXL') {
    return 'Destroyed if any side torso is lost';
  }
  return 'Standard survivability - continues operating with penalties';
}

// Heat sink efficiency utility
/** @deprecated */
export function getHeatSinkEfficiency(heatSinkType: HeatSinkType): number {
  const efficiencyMap: { [key in HeatSinkType]: number } = {
    'Single': 1.0,           // 1 dissipation / 1 slot = 1.0
    'Double': 0.67,          // Generic Double (assume IS worst case)
    'Double (IS)': 0.67,     // 2 dissipation / 3 slots = 0.67
    'Double (Clan)': 1.0,    // 2 dissipation / 2 slots = 1.0
    'Compact': 1.0,          // 1 dissipation / 1 slot = 1.0
    'Compact (Clan)': 1.0,   // Same as standard compact
    'Laser': 1.0,            // 1 dissipation / 1 slot = 1.0
    'Laser (Clan)': 1.0      // Same as standard laser
  };
  
  return efficiencyMap[heatSinkType] || 0;
}
