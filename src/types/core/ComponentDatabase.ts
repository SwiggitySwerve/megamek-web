/**
 * Component Database Architecture
 * Unified system for all construction components (engines, gyros, structure, armor, etc.)
 * Provides consistent interfaces for slot calculations, tonnage, and restrictions
 * 
 * Consolidates legacy ComponentDatabase definitions into a single source of truth.
 */

import { 
  ComponentCategory, 
  TechBase, 
  RulesLevel,
  TechLevel,
  UnitType,
  IEquipmentConfiguration,
  IComponentConfiguration
} from './BaseTypes';

import { PlacementType } from './ComponentPlacement';

// Re-export for convenience
export { ComponentCategory, TechBase, RulesLevel, TechLevel, UnitType };

// ===== CORE COMPONENT DEFINITIONS =====

export interface ComponentVariant {
  id: string;
  name: string;
  techBase: TechBase;
  introductionYear: number;
  rulesLevel: RulesLevel;
  cost: number;
  battleValue: number;
  availability: string[];
  notes?: string;
}

export interface EngineVariant extends ComponentVariant {
  type: 'engine';
  rating: number; // Engine rating (e.g., 200, 300)
  weight: number; // Calculated weight based on rating and type
  criticalSlots: {
    centerTorso: number[];
    leftTorso: number[];
    rightTorso: number[];
  };
  heatDissipation: number; // Base heat dissipation
  fuelType: 'Fusion' | 'ICE' | 'Fuel Cell';
  features: string[]; // XL, Light, Compact, etc.
}

export interface GyroVariant extends ComponentVariant {
  type: 'gyro';
  weight: number; // Calculated based on engine rating
  criticalSlots: {
    centerTorso: number[];
  };
  features: string[]; // XL, Compact, Heavy-Duty, etc.
}

export interface StructureVariant extends ComponentVariant {
  type: 'structure';
  weight: number; // Usually 0, weight is part of base structure
  criticalSlots: {
    centerTorso: number[];
    leftTorso: number[];
    rightTorso: number[];
    leftArm: number[];
    rightArm: number[];
    leftLeg: number[];
    rightLeg: number[];
  };
  features: string[]; // Endo Steel, Composite, Reinforced, etc.
  internalStructurePoints: number; // Multiplier for IS points
  placementType?: PlacementType; // For dynamic components like Endo Steel
  totalSlots?: number; // Total slots for dynamic placement
}

export interface ArmorVariant extends ComponentVariant {
  type: 'armor';
  weight: number; // Usually 0, weight is allocated separately
  criticalSlots: {
    centerTorso: number[];
    leftTorso: number[];
    rightTorso: number[];
    leftArm: number[];
    rightArm: number[];
    leftLeg: number[];
    rightLeg: number[];
  };
  features: string[]; // Ferro-Fibrous, Stealth, Reactive, etc.
  armorPointsPerTon: number; // How many armor points per ton
  maxArmorPoints: number; // Maximum armor points allowed
  placementType?: PlacementType; // For dynamic components like Ferro-Fibrous
  totalSlots?: number; // Total slots for dynamic placement
}

export interface HeatSinkVariant extends ComponentVariant {
  type: 'heatSink';
  weight: number; // Usually 1 ton
  criticalSlots: number; // Usually 1 slot
  heatDissipation: number; // Heat dissipation per sink
  features: string[]; // Single, Double, etc.
  allowedLocations: string[]; // Where they can be placed
}

export interface JumpJetVariant extends ComponentVariant {
  type: 'jumpJet';
  weight: number; // Variable based on unit tonnage
  criticalSlots: number; // Usually 1 slot
  jumpMP: number; // Jump movement points provided
  features: string[]; // Standard, Improved, etc.
  allowedLocations: string[]; // Where they can be placed
}

export interface EnhancementVariant extends ComponentVariant {
  type: 'enhancement';
  weight: number;
  criticalSlots: number;
  features: string[]; // MASC, TSM, Supercharger, etc.
  allowedLocations: string[];
  effects: {
    movement?: number; // MP bonus
    heat?: number; // Heat generation
    damage?: number; // Damage bonus
  };
}

export type ComponentVariantUnion = 
  | EngineVariant 
  | GyroVariant 
  | StructureVariant 
  | ArmorVariant 
  | HeatSinkVariant 
  | JumpJetVariant 
  | EnhancementVariant;

// ===== COMPONENT SPECIFICATION (RICH METADATA) =====

/**
 * Complete specification for a single component variant
 * Contains all metadata needed for display, calculations, and validation
 * Merged from legacy types/componentDatabase.ts
 */
export interface ComponentSpec extends IEquipmentConfiguration {
  // Inherited from IEquipmentConfiguration:
  // name, id, weight, heatGeneration, category, etc.

  // Weight properties (mutually exclusive based on component type)
  weightMultiplier?: number;       // For structure/armor: 0.05 = 5% of tonnage
  weightMod?: number;              // For engine/gyro: 0.5 = half weight
  
  // Game mechanics
  criticalSlots: number;           // Required critical slots
  dissipation?: number;            // Heat dissipation for heat sinks
  
  // Tech classification
  techLevel: TechLevel;            // Technology sophistication level
  rulesLevel: RulesLevel;          // Tournament/campaign legality
  introductionYear: number;        // Year introduced for era games
  
  // Behavioral flags
  isDefault?: boolean;             // Default choice for this tech base
  isAdvanced?: boolean;            // Requires advanced rules
  isExperimental?: boolean;        // Experimental technology
  
  // Display and documentation
  gameEffect?: string;             // Mechanical game effect description
  specialRules?: string[];         // Special rules or restrictions
  
  // Validation constraints
  minTonnage?: number;             // Minimum unit tonnage for this component
  maxTonnage?: number;             // Maximum unit tonnage for this component
  requiredTech?: string[];         // Other tech that must be present
  incompatibleTech?: string[];     // Tech that cannot be used together
}

// ===== DROPDOWN GENERATION INTERFACES =====

/**
 * Formatted option for dropdown components
 */
export interface DropdownOption {
  id: string;                      // For <option value="">
  name: string;                    // Display name
  description?: string;            // Metadata display
  weight?: string;                 // "0.5x weight" or "3.0 tons"
  criticalSlots?: string;          // "14 slots"
  isDisabled?: boolean;            // Rules/tech level restrictions
  isDefault?: boolean;             // Default selection
  techLevel?: string;              // Tech level indicator
  introYear?: number;              // Introduction year
}

/**
 * Options for dropdown generation
 */
export interface DropdownGenerationOptions {
  techBase: TechBase;
  rulesLevel?: RulesLevel;
  currentYear?: number;            // For era filtering
  currentSelection?: string;       // Current selection to preserve
  showMetadata?: boolean;          // Include weight/slots in display
  showTechLevels?: boolean;        // Show tech level indicators
  groupByTechLevel?: boolean;      // Group options by tech level
}

// ===== VALIDATION INTERFACES =====

/**
 * Result of component validation
 */
export interface ValidationResult {
  isValid: boolean;
  resolvedComponent?: ComponentSpec;
  errors: string[];
  warnings: string[];
  autoResolved: boolean;
  resolutionReason?: string;
}

/**
 * Component compatibility check result
 */
export interface CompatibilityResult {
  isCompatible: boolean;
  conflicts: string[];
  requirements: string[];
  warnings: string[];
}

// ===== DATABASE STRUCTURE INTERFACES =====

/**
 * Components for a single tech base
 */
export interface ComponentCategoryMap {
  [techBase: string]: ComponentSpec[];
}

/**
 * Complete component database structure (Schema)
 */
export interface IComponentDatabaseSchema {
  chassis: ComponentCategoryMap;     // Internal structure types
  engine: ComponentCategoryMap;      // Engine types
  gyro: ComponentCategoryMap;        // Gyroscope types
  heatsink: ComponentCategoryMap;    // Heat sink types
  armor: ComponentCategoryMap;       // Armor types
  myomer: ComponentCategoryMap;      // Enhancement/myomer systems
  targeting: ComponentCategoryMap;   // Targeting systems
  movement: ComponentCategoryMap;    // Jump jets and movement systems
}

// ===== TECH PROGRESSION INTEGRATION =====

/**
 * Tech progression state for all subsystems
 */
export interface TechProgression {
  chassis: TechBase;
  engine: TechBase;
  gyro: TechBase;
  heatsink: TechBase;
  armor: TechBase;
  myomer: TechBase;
  targeting: TechBase;
  movement: TechBase;
}

/**
 * Memory system to remember component selections per tech base
 */
export interface TechBaseMemory {
  chassis: { [K in TechBase]?: string };
  engine: { [K in TechBase]?: string };
  gyro: { [K in TechBase]?: string };
  heatsink: { [K in TechBase]?: string };
  armor: { [K in TechBase]?: string };
  myomer: { [K in TechBase]?: string };
  targeting: { [K in TechBase]?: string };
  movement: { [K in TechBase]?: string };
}

// ===== SERVICE INTERFACES =====

export interface IComponentDatabaseService {
  // Core query methods
  getComponents(
    category: ComponentCategory,
    filters: {
      techBase?: TechBase;
      unitType?: UnitType;
      rulesLevel?: string;
      introductionYear?: number;
    }
  ): ComponentVariantUnion[];
  
  getComponentById(id: string): ComponentVariantUnion | null;
  
  // Specialized query methods
  getEngines(filters: { techBase?: TechBase; rulesLevel?: string }): EngineVariant[];
  getGyros(filters: { techBase?: TechBase; rulesLevel?: string }): GyroVariant[];
  getStructures(filters: { techBase?: TechBase; rulesLevel?: string }): StructureVariant[];
  getArmors(filters: { techBase?: TechBase; rulesLevel?: string }): ArmorVariant[];
  getHeatSinks(filters: { techBase?: TechBase; rulesLevel?: string }): HeatSinkVariant[];
  getJumpJets(filters: { techBase?: TechBase; rulesLevel?: string }): JumpJetVariant[];
  getEnhancements(filters: { techBase?: TechBase; rulesLevel?: string }): EnhancementVariant[];
  
  // Calculation methods
  calculateEngineWeight(engineType: string, rating: number): number;
  calculateGyroWeight(gyroType: string, engineRating: number): number;
  calculateHeatSinkWeight(heatSinkType: string, count: number): number;
  calculateJumpJetWeight(jumpJetType: string, unitTonnage: number, count: number): number;
  
  // Slot calculation methods
  getEngineCriticalSlots(engineType: string, gyroType: string): {
    centerTorso: number[];
    leftTorso: number[];
    rightTorso: number[];
  };
  getGyroCriticalSlots(gyroType: string): { centerTorso: number[] };
  getStructureCriticalSlots(structureType: string): {
    centerTorso: number[];
    leftTorso: number[];
    rightTorso: number[];
    leftArm: number[];
    rightArm: number[];
    leftLeg: number[];
    rightLeg: number[];
  };
  getArmorCriticalSlots(armorType: string): {
    centerTorso: number[];
    leftTorso: number[];
    rightTorso: number[];
    leftArm: number[];
    rightArm: number[];
    leftLeg: number[];
    rightLeg: number[];
  };
  
  // Validation methods
  validateComponentCompatibility(
    component1: ComponentVariantUnion,
    component2: ComponentVariantUnion
  ): { compatible: boolean; errors: string[] };
  
  validateUnitConfiguration(components: {
    engine?: EngineVariant;
    gyro?: GyroVariant;
    structure?: StructureVariant;
    armor?: ArmorVariant;
    heatSinks?: HeatSinkVariant[];
    jumpJets?: JumpJetVariant[];
    enhancements?: EnhancementVariant[];
  }): { valid: boolean; errors: string[]; warnings: string[] };
}

// Singleton service for component selection
export interface IComponentSelectionService {
  // Get available components based on filters
  getAvailableComponents(
    category: ComponentCategory,
    filters: {
      techBase: TechBase;
      unitType: UnitType;
      rulesLevel?: string;
      introductionYear?: number;
    }
  ): ComponentVariantUnion[];
  
  // Get component recommendations
  getComponentRecommendations(
    unitType: UnitType,
    techBase: TechBase,
    tonnage: number,
    walkMP: number
  ): {
    engines: EngineVariant[];
    gyros: GyroVariant[];
    structures: StructureVariant[];
    armors: ArmorVariant[];
    heatSinks: HeatSinkVariant[];
    jumpJets: JumpJetVariant[];
    enhancements: EnhancementVariant[];
  };
  
  // Validate component selections
  validateSelections(selections: {
    engine?: string;
    gyro?: string;
    structure?: string;
    armor?: string;
    heatSink?: string;
    jumpJet?: string;
    enhancements?: string[];
  }): { valid: boolean; errors: string[]; warnings: string[] };
  
  // Get component details
  getComponentDetails(componentId: string): ComponentVariantUnion | null;
  
  // Calculate total slots for a configuration
  calculateTotalSlots(configuration: {
    engine?: string;
    gyro?: string;
    structure?: string;
    armor?: string;
    heatSinks?: number;
    jumpJets?: number;
    enhancements?: string[];
  }): {
    total: number;
    breakdown: {
      engine: number;
      gyro: number;
      structure: number;
      armor: number;
      heatSinks: number;
      jumpJets: number;
      enhancements: number;
    }
  };
}

// ===== QUERY AND FILTER INTERFACES =====

/**
 * Query parameters for component database
 */
export interface ComponentQuery {
  category: ComponentCategory;
  techBase?: TechBase;
  rulesLevel?: RulesLevel;
  techLevel?: TechLevel;
  minYear?: number;
  maxYear?: number;
  includeTonnageRange?: [number, number];
  excludeExperimental?: boolean;
}
