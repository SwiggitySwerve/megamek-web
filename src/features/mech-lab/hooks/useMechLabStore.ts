/**
 * useMechLabStore.ts
 * Simple React hook for managing Mech Lab state (for now).
 * Can be upgraded to Redux/Zustand later if complexity grows.
 */

import { useState, useCallback, useMemo } from 'react';
import {
  IMechLabState,
  DEFAULT_MECH_STATE,
  IInstalledEquipmentState,
  IMechLabActions,
} from '../store/MechLabState';
import { TechBase } from '../../../types/TechBase';
import {
  EngineType,
  GyroType,
  StructureType,
  ArmorType,
  CockpitType,
  HeatSinkType,
} from '../../../types/SystemComponents';
import { calculateMechLabMetrics, IMechLabMetrics } from '../store/MechLabMetrics';

export function useMechLabStore(initialState: IMechLabState = DEFAULT_MECH_STATE) {
  const [state, setState] = useState<IMechLabState>(initialState);

  const metrics = useMemo<IMechLabMetrics>(() => calculateMechLabMetrics(state), [state]);

  const actions = useMemo<IMechLabActions>(() => ({
    setTonnage: (tonnage: number) => setState(prev => ({ ...prev, tonnage })),
    setTechBase: (techBase: TechBase) => setState(prev => ({ ...prev, techBase })),
    setWalkingMP: (mp: number) => setState(prev => ({ ...prev, walkingMP: mp })),
    setStructureType: (type: StructureType) => setState(prev => ({ ...prev, structureType: type })),
    setEngineType: (type: EngineType) => setState(prev => ({ ...prev, engineType: type })),
    setGyroType: (type: GyroType) => setState(prev => ({ ...prev, gyroType: type })),
    setCockpitType: (type: CockpitType) => setState(prev => ({ ...prev, cockpitType: type })),
    setArmorType: (type: ArmorType) => setState(prev => ({ ...prev, armorType: type })),
    setHeatSinkType: (type: HeatSinkType) => setState(prev => ({ ...prev, heatSinkType: type })),
    addEquipment: (equipmentId: string) => {
      setState(prev => {
        const newItem: IInstalledEquipmentState = {
          id: crypto.randomUUID(),
          equipmentId,
          location: 'unallocated',
          slotIndex: -1,
          count: 1,
          slotsAllocated: 0,
        };
        return { ...prev, equipment: [...prev.equipment, newItem] };
      });
    },
    removeEquipment: (instanceId: string) =>
      setState(prev => ({
        ...prev,
        equipment: prev.equipment.filter(e => e.id !== instanceId),
      })),
    assignEquipment: (instanceId: string, location: string, slotIndex: number) =>
      setState(prev => ({
        ...prev,
        equipment: prev.equipment.map(item =>
          item.id === instanceId ? { ...item, location, slotIndex } : item
        ),
      })),
    unassignEquipment: (instanceId: string) =>
      setState(prev => ({
        ...prev,
        equipment: prev.equipment.map(item =>
          item.id === instanceId ? { ...item, location: 'unallocated', slotIndex: -1 } : item
        ),
      })),
  }), [setState]);

  return { state, metrics, actions };
}

