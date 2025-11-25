import { WeightOps } from '../../../mechanics/WeightOps';
import { getWeaponById } from '../../../data/weapons';
import { IMechLabState } from './MechLabState';

export interface IMechLabMetrics {
  structureWeight: number;
  engineWeight: number;
  gyroWeight: number;
  cockpitWeight: number;
  equipmentWeight: number;
  currentWeight: number;
  remainingTonnage: number;
  engineRating: number;
}

const roundTo = (value: number, precision = 2): number => {
  const factor = Math.pow(10, precision);
  return Math.round(value * factor) / factor;
};

export function calculateMechLabMetrics(state: IMechLabState): IMechLabMetrics {
  const structureWeight = roundTo(
    WeightOps.calculateStructureWeight(state.tonnage, state.structureType)
  );
  const engineRating = state.walkingMP * state.tonnage;
  const engineWeight = roundTo(
    WeightOps.calculateEngineWeight(state.engineType, engineRating)
  );
  const gyroWeight = roundTo(WeightOps.calculateGyroWeight(state.gyroType, engineRating));
  const cockpitWeight = roundTo(WeightOps.calculateCockpitWeight(state.cockpitType));
  const equipmentWeight = roundTo(
    state.equipment.reduce((total, item) => {
      const equipmentDef = getWeaponById(item.equipmentId);
      if (!equipmentDef) {
        return total;
      }
      return total + equipmentDef.weight * item.count;
    }, 0)
  );

  const currentWeight =
    structureWeight + engineWeight + gyroWeight + cockpitWeight + equipmentWeight;
  const remainingTonnage = roundTo(state.tonnage - currentWeight);

  return {
    structureWeight,
    engineWeight,
    gyroWeight,
    cockpitWeight,
    equipmentWeight,
    currentWeight: roundTo(currentWeight),
    remainingTonnage,
    engineRating,
  };
}

