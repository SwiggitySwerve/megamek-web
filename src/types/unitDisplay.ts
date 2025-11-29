/**
 * Unit Display Types - STUB FILE
 * Types for displaying unit information
 * TODO: Replace with spec-driven implementation
 */

export interface UnitDisplayData {
  name: string;
  chassis: string;
  model: string;
  tonnage: number;
  techBase: string;
  rulesLevel: string;
  movement: MovementDisplay;
  armor: ArmorDisplay;
  weapons: WeaponDisplay[];
  equipment: EquipmentDisplay[];
}

export interface MovementDisplay {
  walk: number;
  run: number;
  jump: number;
  formatted: string;
}

export interface ArmorDisplay {
  total: number;
  max: number;
  percentage: number;
  byLocation: Record<string, LocationArmorDisplay>;
}

export interface LocationArmorDisplay {
  current: number;
  max: number;
  rear?: number;
  rearMax?: number;
}

export interface WeaponDisplay {
  name: string;
  location: string;
  damage: number | string;
  heat: number;
  range: string;
}

export interface EquipmentDisplay {
  name: string;
  location: string;
  slots: number;
  weight: number;
}

export interface CriticalSlotDisplay {
  index: number;
  name: string;
  isFixed: boolean;
  isDestroyed: boolean;
}

export interface LocationDisplay {
  name: string;
  structure: number;
  maxStructure: number;
  armor: number;
  maxArmor: number;
  rearArmor?: number;
  maxRearArmor?: number;
  slots: CriticalSlotDisplay[];
}

export interface UnitDisplayOptions {
  showArmor?: boolean;
  showWeapons?: boolean;
  showEquipment?: boolean;
  showCriticals?: boolean;
  compactMode?: boolean;
  highlightDamage?: boolean;
  showBasicInfo?: boolean;
  showMovement?: boolean;
  showHeatManagement?: boolean;
  showStructure?: boolean;
  showEquipmentSummary?: boolean;
  showCriticalSlotSummary?: boolean;
  showBuildRecommendations?: boolean;
  showTechnicalSpecs?: boolean;
  showFluffText?: boolean;
  compact?: boolean;
  interactive?: boolean;
  [key: string]: boolean | undefined;
}

export interface UnitAnalysisContext {
  unit?: UnitDisplayData;
  options?: UnitDisplayOptions;
  techBase?: string;
  rulesLevel?: string;
  includeHeatAnalysis?: boolean;
  includeArmorAnalysis?: boolean;
  includeEquipmentAnalysis?: boolean;
  includeBuildRecommendations?: boolean;
  [key: string]: unknown;
}

export interface ArmorLocationInfo {
  location: string;
  name: string;
  armor: number;
  maxArmor: number;
  front: number;
  rear?: number;
  max: number;
  [key: string]: string | number | undefined;
}

export interface ArmorInfo {
  // Core properties
  total: number;
  max: number;
  coverage: number;
  type: string;
  // Derived properties
  totalArmorPoints: number;
  maxArmorPoints: number;
  armorEfficiency: number;
  weight: number;
  maxWeight: number;
  pointsPerTon: number;
  armorTonnage: number;
  locations: ArmorLocationInfo[];
  // Allow any additional properties
  [key: string]: string | number | boolean | ArmorLocationInfo[] | undefined;
}

export interface StructureInfo {
  type: string;
  weight: number;
  totalPoints: number;
  structureTonnage: number;
  totalStructurePoints: number;
  totalInternalStructure: number;
  headStructure: number;
  centerTorsoStructure: number;
  sideTorsoStructure: number;
  armStructure: number;
  legStructure: number;
}

export interface HeatManagementInfo {
  heatSinkType: string;
  heatSinkCount: number;
  totalHeatSinks: number;
  totalDissipation: number;
  totalHeatDissipation: number;
  maxHeatGeneration: number;
  totalHeatGeneration: number;
  heatBalance: number;
  overheatingRisk: 'none' | 'low' | 'medium' | 'high' | 'critical';
  alphaStrikeHeat: number;
  sustainedFireHeat: number;
  movementHeat: number;
  jumpHeat: number;
  engineIntegratedHeatSinks: number;
  engineHeatSinkCapacity: number;
  externalHeatSinks: number;
}

export interface WeaponSummary {
  totalWeapons: number;
  energyWeapons: number;
  ballisticWeapons: number;
  missileWeapons: number;
  physicalWeapons: number;
}

export interface EquipmentCategorySummary {
  category: string;
  count: number;
  weight: number;
  tonnage: number;
}

export interface EquipmentSummary {
  totalWeight: number;
  totalSlots: number;
  weaponCount: number;
  ammoCount: number;
  equipmentCount: number;
  totalEquipmentCount: number;
  totalEquipmentTonnage: number;
  weaponWeight: number;
  ammoWeight: number;
  equipmentWeight: number;
  weapons: unknown[];
  ammo: unknown[];
  equipment: unknown[];
  weaponSummary: WeaponSummary;
  equipmentByCategory: EquipmentCategorySummary[];
}

export interface CriticalSlotLocationBreakdown {
  location: string;
  name: string;
  usedSlots: number;
  totalSlots: number;
  availableSlots: number;
  utilizationPercentage: number;
}

export interface CriticalSlotSummary {
  totalSlots: number;
  usedSlots: number;
  freeSlots: number;
  availableSlots: number;
  byLocation: Record<string, { used: number; total: number }>;
  locationBreakdown: CriticalSlotLocationBreakdown[];
}

export interface TechnicalSpecs {
  tonnage: number;
  techBase: string;
  techLevel: string;
  rulesLevel: string;
  engineRating: number;
  engineType: string;
  walkMP: number;
  runMP: number;
  jumpMP: number;
  walkSpeed: number;
  runSpeed: number;
  jumpSpeed: number;
  jumpRange: number;
  movementMode: string;
  battleValue: number;
  cost: number;
  costCBills: number;
  tonnageBreakdown: {
    chassis: number;
    engine: number;
    weapons: number;
    equipment: number;
    armor: number;
    structure: number;
    other: number;
  };
}

export interface BuildRecommendation {
  id: string;
  type: 'warning' | 'suggestion' | 'optimization';
  category: string;
  message: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low' | number;
  suggestedActions: string[];
  autoApplyable: boolean;
}

