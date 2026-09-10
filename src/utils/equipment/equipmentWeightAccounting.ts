import type { IMountedEquipmentInstance } from '@/types/equipment/MountedEquipment';

import {
  ARMOR_SLOTS_EQUIPMENT_ID,
  HEAT_SINK_EQUIPMENT_IDS,
  INTERNAL_STRUCTURE_EQUIPMENT_ID,
  JUMP_JET_EQUIPMENT_IDS,
} from './equipmentConstants';

/**
 * Returns true when the mounted record represents a component whose weight is
 * already included by `useUnitCalculations`.
 *
 * These records remain in the equipment array with their physical weights so
 * placement and serialization stay truthful. Aggregate unit weight must not
 * charge them again as payload equipment.
 */
export function isComponentWeightManagedEquipment(
  item: IMountedEquipmentInstance,
): boolean {
  if (item.isRemovable) return false;

  return (
    HEAT_SINK_EQUIPMENT_IDS.includes(item.equipmentId) ||
    JUMP_JET_EQUIPMENT_IDS.includes(item.equipmentId) ||
    item.equipmentId.startsWith(INTERNAL_STRUCTURE_EQUIPMENT_ID) ||
    item.equipmentId.startsWith(ARMOR_SLOTS_EQUIPMENT_ID)
  );
}

export function getEquipmentPayloadWeight(
  equipment: readonly IMountedEquipmentInstance[],
): number {
  return equipment.reduce(
    (total, item) =>
      total + (isComponentWeightManagedEquipment(item) ? 0 : item.weight),
    0,
  );
}
