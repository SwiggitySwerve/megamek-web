/**
 * Editor Types - STUB FILE
 * Types for the unit editor
 * TODO: Replace with spec-driven implementation
 */

import { TechBase, RulesLevel, EntityId } from './core';

// Mech location constants
export const MECH_LOCATIONS = {
  HEAD: 'Head',
  CENTER_TORSO: 'Center Torso',
  LEFT_TORSO: 'Left Torso',
  RIGHT_TORSO: 'Right Torso',
  LEFT_ARM: 'Left Arm',
  RIGHT_ARM: 'Right Arm',
  LEFT_LEG: 'Left Leg',
  RIGHT_LEG: 'Right Leg',
} as const;

export type MechLocation = typeof MECH_LOCATIONS[keyof typeof MECH_LOCATIONS];

// Armor allocation type
export type ArmorAllocationRecord = Record<string, number>;

export interface EditableUnit {
  id: EntityId;
  name: string;
  chassis: string;
  model: string;
  type?: string; // Unit type (BattleMech, Vehicle, etc.)
  techBase: TechBase;
  rulesLevel: RulesLevel;
  tonnage: number;
  mass: number; // Alias for tonnage
  
  // Engine
  engineRating: number;
  engineType: string;
  
  // Movement
  walkMP: number;
  runMP: number;
  jumpMP: number;
  
  // Structure & Armor
  structureType: string;
  armorType: string;
  armorAllocation: Record<string, number>;
  armor?: {
    type?: string;
    allocation: ArmorAllocationRecord;
    tonnage?: number;
    definition?: import('./core/ComponentInterfaces').IArmorDef;
  };
  structure?: {
    type?: string;
    maxPoints?: {
      head: number;
      centerTorso: number;
      leftTorso: number;
      rightTorso: number;
      leftArm: number;
      rightArm: number;
      leftLeg: number;
      rightLeg: number;
    };
  };
  
  // Heat Sinks
  heatSinkType: string;
  heatSinkCount: number;
  
  // Gyro & Cockpit
  gyroType: string;
  cockpitType: string;
  
  // Equipment
  equipment: EditableEquipment[];
  
  // Critical Slots
  criticalSlots: Record<string, CriticalSlotData[]>;
  
  // Optional data for extended unit information
  data?: UnitData;
  
  // Battle Armor mounting (OmniMechs)
  mountedBattleArmor?: MountedBattleArmor[];
  hasOmniMounts?: boolean;
  
  // LAM configuration
  lamConfiguration?: {
    currentMode: string;
    bomberPayload?: unknown;
    structureMass?: number;
    currentFuel?: number;
    maxFuel?: number;
  };
  
  // QuadVee configuration
  quadVeeConfiguration?: {
    currentMode: string;
    lastTransformation?: number;
    conversionEquipmentDamaged?: boolean;
  };
  
  // Pilot
  pilot?: {
    name?: string;
    gunnerySkill?: number;
    pilotingSkill?: number;
  };
  
  // ProtoMech properties
  protoMechScale?: number;
  
  // Game state properties (for gameplay mode)
  currentMovementPoints?: number;
  currentTerrain?: string;
  currentHeat?: number;
  isShutdown?: boolean;
}

export interface MountedBattleArmor {
  id: string;
  name: string;
  type?: string;
  location: string;
  troopers: number;
  squad?: string;
  isOmniMount?: boolean;
}

export interface UnitData {
  type?: string;
  config?: string;
  tech_base?: string;
  era?: string;
  armor?: {
    locations?: Array<{
      location: string;
      armor_points?: number;
      rear_armor_points?: number;
    }>;
  };
  movement?: {
    walk_mp?: number;
    run_mp?: number;
    jump_mp?: number;
  };
  structure?: {
    type?: string;
    totalPoints?: number;
  };
}

export interface EditableEquipment {
  id: EntityId;
  equipmentId: string;
  name: string;
  location: string;
  slotIndex: number;
  slots: number;
  weight: number;
}

export interface CriticalSlotData {
  index: number;
  content: string | null;
  equipmentId: string | null;
  isFixed: boolean;
  isRollable: boolean;
}

export interface EditorState {
  unit: EditableUnit | null;
  isDirty: boolean;
  validationErrors: string[];
  selectedLocation: string | null;
}

// Factory function
export function createEmptyUnit(tonnage: number = 50): EditableUnit {
  return {
    id: `unit_${Date.now()}`,
    name: 'New Mech',
    chassis: 'Unknown',
    model: 'UNK-1',
    techBase: TechBase.INNER_SPHERE,
    rulesLevel: RulesLevel.STANDARD,
    tonnage,
    mass: tonnage,
    engineRating: tonnage * 4,
    engineType: 'Standard',
    walkMP: 4,
    runMP: 6,
    jumpMP: 0,
    structureType: 'Standard',
    armorType: 'Standard',
    armorAllocation: {},
    heatSinkType: 'Single',
    heatSinkCount: 10,
    gyroType: 'Standard',
    cockpitType: 'Standard',
    equipment: [],
    criticalSlots: {},
  };
}

