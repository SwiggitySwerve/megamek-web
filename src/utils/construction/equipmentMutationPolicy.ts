import type { IMountedEquipmentInstance } from '@/types/equipment/MountedEquipment';

/** @spec openspec/specs/omnimech-system/spec.md */
export function isFixedOmniEquipment(
  isOmni: boolean,
  equipment: Pick<IMountedEquipmentInstance, 'isOmniPodMounted'>,
): boolean {
  return isOmni && equipment.isOmniPodMounted === false;
}

export function canChangeEquipmentMount(
  isOmni: boolean,
  equipment: Pick<IMountedEquipmentInstance, 'isOmniPodMounted' | 'location'>,
): boolean {
  return !equipment.location || !isFixedOmniEquipment(isOmni, equipment);
}

export function hasFixedOmniMountConflict(
  isOmni: boolean,
  equipment: readonly IMountedEquipmentInstance[],
  location: IMountedEquipmentInstance['location'],
  slots: readonly number[],
): boolean {
  return (
    isOmni &&
    equipment.some(
      (item) =>
        isFixedOmniEquipment(isOmni, item) &&
        item.location === location &&
        item.slots?.some((slot) => slots.includes(slot)),
    )
  );
}
