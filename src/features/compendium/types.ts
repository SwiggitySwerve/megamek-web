/**
 * Shared compendium view-model contracts.
 * These types let UI surfaces treat equipment/components/units consistently.
 */

import { TechBase, RulesLevel } from '../../types/TechBase';
import { ComponentType } from '../../types/ComponentType';
import {
  StructureType,
  ArmorType,
  EngineType,
  GyroType,
  CockpitType,
  HeatSinkType,
} from '../../types/SystemComponents';
import { IWeapon } from '../../types/Equipment';
import { IMechLabState } from '../mech-lab/store/MechLabState';
import { IMechLabMetrics } from '../mech-lab/store/MechLabMetrics';
import { IValidationResult } from '../../mechanics/Validation';

export type CompendiumCategory = 'equipment' | 'component' | 'unit';

export interface ICompendiumStat {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly description?: string;
}

export interface ICompendiumEntry<TCategory extends CompendiumCategory, TPayload> {
  readonly id: string;
  readonly category: TCategory;
  readonly name: string;
  readonly summary: string;
  readonly source: string;
  readonly tags: readonly string[];
  readonly techBase?: TechBase;
  readonly rulesLevel?: RulesLevel;
  readonly stats: readonly ICompendiumStat[];
  readonly payload: TPayload;
}

export type IEquipmentCompendiumEntry = ICompendiumEntry<'equipment', IWeapon>;

export interface IStructureComponentProfile {
  readonly componentType: ComponentType.STRUCTURE;
  readonly structureType: StructureType;
  readonly weightMultiplier: number;
  readonly slotCost: Record<TechBase, number>;
}

export interface IArmorComponentProfile {
  readonly componentType: ComponentType.ARMOR;
  readonly armorType: ArmorType;
  readonly pointsPerTon: number;
  readonly slotCost: Record<TechBase, number>;
}

export interface IEngineComponentProfile {
  readonly componentType: ComponentType.ENGINE;
  readonly engineType: EngineType;
  readonly weightMultiplier: number;
  readonly slotFootprint: Record<TechBase, { readonly ct: number; readonly sideTorso: number }>;
}

export interface IGyroComponentProfile {
  readonly componentType: ComponentType.GYRO;
  readonly gyroType: GyroType;
  readonly weightMultiplier: number;
  readonly slots: number;
}

export interface ICockpitComponentProfile {
  readonly componentType: ComponentType.COCKPIT;
  readonly cockpitType: CockpitType;
  readonly weight: number;
  readonly slotDistribution: {
    readonly head: number;
    readonly centerTorso: number;
  };
  readonly allowedTechBases: readonly TechBase[];
  readonly minRulesLevel: RulesLevel;
  readonly notes?: string;
}

export interface IHeatSinkComponentProfile {
  readonly componentType: ComponentType.HEAT_SINK;
  readonly heatSinkType: HeatSinkType;
  readonly weightPerSink: number;
  readonly dissipationPerSink: number;
  readonly slotsPerSink: Record<TechBase, number>;
  readonly allowedTechBases: readonly TechBase[];
  readonly minRulesLevel: RulesLevel;
  readonly notes?: string;
}

export type ComponentProfile =
  | IStructureComponentProfile
  | IArmorComponentProfile
  | IEngineComponentProfile
  | IGyroComponentProfile
  | ICockpitComponentProfile
  | IHeatSinkComponentProfile;

export type IComponentCompendiumEntry = ICompendiumEntry<'component', ComponentProfile>;

export interface IUnitCompendiumPayload {
  readonly blueprint: IMechLabState;
  readonly metrics: IMechLabMetrics;
  readonly validation: IValidationResult;
}

export type IUnitCompendiumEntry = ICompendiumEntry<'unit', IUnitCompendiumPayload>;


