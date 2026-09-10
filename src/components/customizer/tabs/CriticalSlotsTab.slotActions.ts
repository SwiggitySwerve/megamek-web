import type { IMountedEquipmentInstance } from '@/types/equipment/MountedEquipment';

import { MechLocation } from '@/types/construction';
import { isValidLocationForEquipment } from '@/types/equipment/EquipmentPlacement';
import { findContiguousSlotStarts } from '@/utils/construction/slotOperations/topology';

import type { LocationData } from '../critical-slots';

export type EquipmentList = readonly IMountedEquipmentInstance[];
type GetLocationData = (location: MechLocation) => LocationData;
type UpdateEquipmentLocation = (
  equipmentId: string,
  location: MechLocation,
  slots: number[],
) => void;
type ClearEquipmentLocation = (equipmentId: string) => void;

interface AssignableSlotArgs {
  readonly selectedEquipment: IMountedEquipmentInstance | null;
  readonly readOnly: boolean;
  readonly location: MechLocation;
  readonly getLocationData: GetLocationData;
  readonly unitIsSuperheavy: boolean;
}

interface SlotClickActionArgs {
  readonly readOnly: boolean;
  readonly selectedEquipment: IMountedEquipmentInstance | null;
  readonly location: MechLocation;
  readonly slotIndex: number;
  readonly getLocationData: GetLocationData;
  readonly getAssignableSlots: (location: MechLocation) => number[];
  readonly updateEquipmentLocation: UpdateEquipmentLocation;
  readonly onSelectEquipment?: (id: string | null) => void;
}

interface EquipmentDropActionArgs {
  readonly readOnly: boolean;
  readonly equipment: EquipmentList;
  readonly location: MechLocation;
  readonly slotIndex: number;
  readonly equipmentId: string;
  readonly getLocationData: GetLocationData;
  readonly unitIsSuperheavy: boolean;
  readonly updateEquipmentLocation: UpdateEquipmentLocation;
  readonly onSelectEquipment?: (id: string | null) => void;
}

interface EquipmentRemoveActionArgs {
  readonly readOnly: boolean;
  readonly location: MechLocation;
  readonly slotIndex: number;
  readonly getLocationData: GetLocationData;
  readonly clearEquipmentLocation: ClearEquipmentLocation;
}

export function findEquipmentByInstanceId(
  equipment: EquipmentList,
  equipmentId: string | null | undefined,
): IMountedEquipmentInstance | null {
  if (!equipmentId) return null;
  return equipment.find((item) => item.instanceId === equipmentId) ?? null;
}

function buildSlotIndexes(slotIndex: number, slotsNeeded: number): number[] {
  return Array.from({ length: slotsNeeded }, (_, index) => slotIndex + index);
}

export function buildAssignableSlots({
  selectedEquipment,
  readOnly,
  location,
  getLocationData,
}: AssignableSlotArgs): number[] {
  if (!selectedEquipment || readOnly) return [];
  if (!isValidLocationForEquipment(selectedEquipment.equipmentId, location)) {
    return [];
  }

  const locData = getLocationData(location);
  const emptySlots = locData.slots
    .filter((slot) => slot.type === 'empty')
    .map((slot) => slot.index);
  const assignable = findContiguousSlotStarts(
    emptySlots,
    selectedEquipment.criticalSlots,
  );

  return assignable;
}

function selectClickedEquipment(
  clickedEquipmentId: string,
  selectedEquipment: IMountedEquipmentInstance | null,
  onSelectEquipment?: (id: string | null) => void,
): void {
  const nextSelection =
    selectedEquipment?.instanceId === clickedEquipmentId
      ? null
      : clickedEquipmentId;
  onSelectEquipment?.(nextSelection);
}

export function handleSlotClickAction({
  readOnly,
  selectedEquipment,
  location,
  slotIndex,
  getLocationData,
  getAssignableSlots,
  updateEquipmentLocation,
  onSelectEquipment,
}: SlotClickActionArgs): void {
  if (readOnly) return;

  const locData = getLocationData(location);
  const clickedSlot = locData.slots.find((slot) => slot.index === slotIndex);

  if (clickedSlot?.type === 'equipment' && clickedSlot.equipmentId) {
    selectClickedEquipment(
      clickedSlot.equipmentId,
      selectedEquipment,
      onSelectEquipment,
    );
    return;
  }

  if (!selectedEquipment || clickedSlot?.type !== 'empty') return;
  if (!getAssignableSlots(location).includes(slotIndex)) return;

  updateEquipmentLocation(
    selectedEquipment.instanceId,
    location,
    buildSlotIndexes(slotIndex, selectedEquipment.criticalSlots),
  );
  onSelectEquipment?.(null);
}

function hasEmptySlotRun(
  locData: LocationData,
  slotIndex: number,
  slotsNeeded: number,
): boolean {
  for (const targetIndex of buildSlotIndexes(slotIndex, slotsNeeded)) {
    const targetSlot = locData.slots.find((slot) => slot.index === targetIndex);
    if (!targetSlot || targetSlot.type !== 'empty') return false;
  }
  return true;
}

export function handleEquipmentDropAction({
  readOnly,
  equipment,
  location,
  slotIndex,
  equipmentId,
  getLocationData,
  updateEquipmentLocation,
  onSelectEquipment,
}: EquipmentDropActionArgs): void {
  if (readOnly) return;

  const eq = findEquipmentByInstanceId(equipment, equipmentId);
  if (!eq) return;
  if (!isValidLocationForEquipment(eq.equipmentId, location)) return;

  const locData = getLocationData(location);
  if (!hasEmptySlotRun(locData, slotIndex, eq.criticalSlots)) return;

  updateEquipmentLocation(
    equipmentId,
    location,
    buildSlotIndexes(slotIndex, eq.criticalSlots),
  );
  onSelectEquipment?.(null);
}

export function handleEquipmentRemoveAction({
  readOnly,
  location,
  slotIndex,
  getLocationData,
  clearEquipmentLocation,
}: EquipmentRemoveActionArgs): void {
  if (readOnly) return;

  const locData = getLocationData(location);
  const slot = locData.slots.find((item) => item.index === slotIndex);
  if (!slot || slot.type !== 'equipment' || !slot.equipmentId) return;

  clearEquipmentLocation(slot.equipmentId);
}
