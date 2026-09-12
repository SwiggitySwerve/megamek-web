import type { IMountedEquipmentInstance } from '@/types/equipment/MountedEquipment';

import { MechLocation } from '@/types/construction';
import { isValidLocationForEquipment } from '@/types/equipment/EquipmentPlacement';
import { canChangeEquipmentMount } from '@/utils/construction/equipmentMutationPolicy';

import { findContiguousSlotStarts } from './topology';

export interface IEquipmentPlacementOption {
  readonly location: MechLocation;
  readonly start?: number;
  readonly availableSlots: number;
  readonly canFit: boolean;
  readonly reason?: string;
}

/** Shared by Critical Slots and the catalog's placement preview/confirmation. */
export function getEquipmentPlacementOption(
  equipment: IMountedEquipmentInstance,
  location: MechLocation,
  freeSlots: readonly number[],
  isOmni: boolean,
  readOnly: boolean,
): IEquipmentPlacementOption {
  const start = findContiguousSlotStarts(freeSlots, equipment.criticalSlots)[0];
  const reason = readOnly
    ? 'Read-only unit'
    : !canChangeEquipmentMount(isOmni, equipment)
      ? 'Fixed OmniMech equipment'
      : !isValidLocationForEquipment(equipment.equipmentId, location)
        ? 'Restricted location'
        : equipment.criticalSlots > 0 && start === undefined
          ? 'No contiguous space'
          : undefined;
  return {
    location,
    start,
    availableSlots: freeSlots.length,
    canFit: !reason,
    reason,
  };
}
