/**
 * Unit Structure Store - Chassis Actions
 *
 * Actions for chassis configuration:
 * tonnage, configuration, isOmni, mode switching (LAM/QuadVee)
 */

import type {
  LAMMode,
  QuadVeeMode,
} from '@/types/construction/MechConfigurationSystem';

import { MechLocation } from '@/types/construction';
import { CockpitType } from '@/types/construction/CockpitType';
import { GyroType } from '@/types/construction/GyroType';
import {
  MechConfiguration,
  getLocationsForConfig,
} from '@/types/construction/MechConfigurationSystem';

import type { UnitSliceSetFn } from './unitSliceTypes';

import { applyTonnageChange } from './useUnitStructureStore.helpers';

export interface ChassisActions {
  setTonnage: (tonnage: number) => void;
  setConfiguration: (configuration: MechConfiguration) => void;
  setIsOmni: (isOmni: boolean) => void;
  setLAMMode: (mode: LAMMode) => void;
  setQuadVeeMode: (mode: QuadVeeMode) => void;
}

export function createChassisActions(set: UnitSliceSetFn): ChassisActions {
  return {
    setTonnage: (tonnage) =>
      set((state) => {
        const { equipment, engineRating } = applyTonnageChange({
          equipment: state.equipment,
          oldTonnage: state.tonnage,
          newTonnage: tonnage,
          engineRating: state.engineRating,
          engineType: state.engineType,
          enhancement: state.enhancement,
          techBase: state.techBase,
          jumpMP: state.jumpMP,
          jumpJetType: state.jumpJetType,
        });

        return {
          tonnage,
          cockpitType:
            tonnage > 100
              ? CockpitType.SUPER_HEAVY
              : state.cockpitType === CockpitType.SUPER_HEAVY
                ? CockpitType.STANDARD
                : state.cockpitType,
          gyroType:
            tonnage > 100
              ? GyroType.SUPERHEAVY
              : state.gyroType === GyroType.SUPERHEAVY
                ? GyroType.STANDARD
                : state.gyroType,
          engineRating,
          equipment,
          isModified: true,
          lastModifiedAt: Date.now(),
        };
      }),

    setConfiguration: (configuration) =>
      set((state) => {
        const locations = new Set(getLocationsForConfig(configuration));
        const armorAllocation = { ...state.armorAllocation };
        for (const location of getLocationsForConfig(state.configuration)) {
          if (!locations.has(location)) armorAllocation[location] = 0;
        }
        return {
          configuration,
          armorAllocation,
          equipment: state.equipment.map((item) =>
            item.location && !locations.has(item.location as MechLocation)
              ? { ...item, location: undefined, slots: [] }
              : item,
          ),
          isModified: true,
          lastModifiedAt: Date.now(),
        };
      }),

    setIsOmni: (isOmni) =>
      set({
        isOmni,
        isModified: true,
        lastModifiedAt: Date.now(),
      }),

    setLAMMode: (lamMode) =>
      set((state) => {
        if (state.configuration !== MechConfiguration.LAM) {
          return state;
        }
        return {
          lamMode,
          isModified: true,
          lastModifiedAt: Date.now(),
        };
      }),

    setQuadVeeMode: (quadVeeMode) =>
      set((state) => {
        if (state.configuration !== MechConfiguration.QUADVEE) {
          return state;
        }
        return {
          quadVeeMode,
          isModified: true,
          lastModifiedAt: Date.now(),
        };
      }),
  };
}
