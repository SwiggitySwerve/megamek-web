/**
 * ComponentInterfaces.ts - STUB FILE
 * Component interface definitions
 * TODO: Replace with spec-driven implementation from openspec/specs/phase-2-construction/
 */

import { TechBase, RulesLevel, ComponentCategory } from './index';

export interface IArmorDef {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly category: ComponentCategory;
  readonly pointsPerTon: number;
  readonly criticalSlots: number;
  readonly techBase?: TechBase | 'Both';
  readonly techLevel?: string;
  readonly rulesLevel?: RulesLevel;
  readonly costMultiplier?: number;
  readonly maxPointsPerLocationMultiplier?: number;
  readonly introductionYear?: number;
}

export interface IStructureDef {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly category: ComponentCategory;
  readonly weightMultiplier: number;
  readonly criticalSlots: number;
  readonly techBase?: TechBase | 'Both';
  readonly rulesLevel?: RulesLevel;
}

export interface IEngineDef {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly category: ComponentCategory;
  readonly weightMultiplier: number;
  readonly criticalSlots: { ct: number; sideTorso: number };
  readonly techBase?: TechBase | 'Both';
  readonly rulesLevel?: RulesLevel;
}

export interface IGyroDef {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly category: ComponentCategory;
  readonly weightMultiplier: number;
  readonly criticalSlots: number;
  readonly techBase?: TechBase | 'Both';
  readonly rulesLevel?: RulesLevel;
}

export interface ICockpitDef {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly category: ComponentCategory;
  readonly weight: number;
  readonly criticalSlots: number;
  readonly techBase?: TechBase | 'Both';
  readonly rulesLevel?: RulesLevel;
}

export interface IHeatSinkDef {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly category: ComponentCategory;
  readonly dissipation: number;
  readonly weight: number;
  readonly criticalSlots: number;
  readonly techBase?: TechBase | 'Both';
  readonly rulesLevel?: RulesLevel;
}


