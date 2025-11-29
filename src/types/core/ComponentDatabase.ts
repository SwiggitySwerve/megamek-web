/**
 * ComponentDatabase.ts - STUB FILE
 * Component database interface
 * TODO: Replace with spec-driven implementation
 */

import { TechBase, RulesLevel } from '../enums';
import { IArmorDef, IStructureDef, IEngineDef, IGyroDef, ICockpitDef, IHeatSinkDef } from './ComponentInterfaces';

export interface IComponentDatabase {
  getArmorTypes(): IArmorDef[];
  getStructureTypes(): IStructureDef[];
  getEngineTypes(): IEngineDef[];
  getGyroTypes(): IGyroDef[];
  getCockpitTypes(): ICockpitDef[];
  getHeatSinkTypes(): IHeatSinkDef[];
}

// Placeholder data
export const ARMOR_TYPES: IArmorDef[] = [];
export const STRUCTURE_TYPES: IStructureDef[] = [];
export const ENGINE_TYPES: IEngineDef[] = [];
export const GYRO_TYPES: IGyroDef[] = [];
export const COCKPIT_TYPES: ICockpitDef[] = [];
export const HEAT_SINK_TYPES: IHeatSinkDef[] = [];


