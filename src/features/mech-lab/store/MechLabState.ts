/**
 * MechLabState.ts
 * State definition for the Mech Lab editor.
 */

import { TechBase, RulesLevel } from '../../../types/TechBase';
import {
  EngineType,
  GyroType,
  CockpitType,
  StructureType,
  ArmorType,
  HeatSinkType,
} from '../../../types/SystemComponents';

export const ARMOR_LOCATIONS = [
  { id: 'HD', label: 'Head', hasRear: false },
  { id: 'CT', label: 'Center Torso', hasRear: true },
  { id: 'LT', label: 'Left Torso', hasRear: true },
  { id: 'RT', label: 'Right Torso', hasRear: true },
  { id: 'LA', label: 'Left Arm', hasRear: false },
  { id: 'RA', label: 'Right Arm', hasRear: false },
  { id: 'LL', label: 'Left Leg', hasRear: false },
  { id: 'RL', label: 'Right Leg', hasRear: false },
] as const;

export type ArmorLocation = (typeof ARMOR_LOCATIONS)[number]['id'];

export interface IArmorSegmentAllocation {
  front: number;
  rear?: number;
}

export const createEmptyArmorAllocation = (): Record<ArmorLocation, IArmorSegmentAllocation> =>
  ARMOR_LOCATIONS.reduce<Record<ArmorLocation, IArmorSegmentAllocation>>((acc, location) => {
    acc[location.id as ArmorLocation] = {
      front: 0,
      ...(location.hasRear ? { rear: 0 } : {}),
    };
    return acc;
  }, {} as Record<ArmorLocation, IArmorSegmentAllocation>);

export interface IMechLabState {
  // Metadata
  name: string;
  model: string;

  // Core Specs
  techBase: TechBase;
  rulesLevel: RulesLevel;
  tonnage: number;
  walkingMP: number;

  // Systems Configuration
  structureType: StructureType;
  engineType: EngineType;
  gyroType: GyroType;
  cockpitType: CockpitType;
  armorType: ArmorType;
  heatSinkType: HeatSinkType;

  // Allocations
  armorAllocation: Record<ArmorLocation, IArmorSegmentAllocation>;
  equipment: IInstalledEquipmentState[];
  criticalSlots: Record<string, ISlotState[]>; // Location -> Slots
  fluffNotes: string;

  // Validation & Metrics (Derived)
  currentWeight: number;
  isValid: boolean;
  validationErrors: string[];
  validationWarnings: string[];
}

export interface IInstalledEquipmentState {
  id: string;
  equipmentId: string; // Reference to Equipment DB
  location: string;
  slotIndex: number;
  count: number;
  slotsAllocated: number; // Number of slots used
}

export interface ISlotState {
  index: number;
  content: string | null; // null = empty, string = equipment ID or system name (e.g. "Engine")
  isDynamic: boolean; // True if occupied by dynamic component (Engine, Gyro)
}

export interface IMechLabActions {
  setTonnage(tonnage: number): void;
  setTechBase(techBase: TechBase): void;
  setWalkingMP(mp: number): void;
  setStructureType(type: StructureType): void;
  setEngineType(type: EngineType): void;
  setGyroType(type: GyroType): void;
  setCockpitType(type: CockpitType): void;
  setArmorType(type: ArmorType): void;
  setHeatSinkType(type: HeatSinkType): void;
  setArmorAllocation(location: ArmorLocation, allocation: IArmorSegmentAllocation): void;
  setFluffNotes(notes: string): void;
  addEquipment(equipmentId: string): void;
  removeEquipment(instanceId: string): void;
  assignEquipment(instanceId: string, location: string, slotIndex: number): void;
  unassignEquipment(instanceId: string): void;
}

export const DEFAULT_MECH_STATE: IMechLabState = {
  name: 'New Mech',
  model: 'PRT-01',
  techBase: TechBase.INNER_SPHERE,
  rulesLevel: RulesLevel.STANDARD,
  tonnage: 20,
  walkingMP: 1,
  structureType: StructureType.STANDARD,
  engineType: EngineType.STANDARD,
  gyroType: GyroType.STANDARD,
  cockpitType: CockpitType.STANDARD,
  armorType: ArmorType.STANDARD,
  heatSinkType: HeatSinkType.SINGLE,
  armorAllocation: createEmptyArmorAllocation(),
  equipment: [],
  criticalSlots: {},
  fluffNotes: '',
  currentWeight: 0,
  isValid: false,
  validationErrors: [],
  validationWarnings: [],
};

