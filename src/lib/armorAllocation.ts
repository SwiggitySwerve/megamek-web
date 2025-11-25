import { EditableUnit } from '../types';
import {
  IInternalStructurePoints,
  INTERNAL_STRUCTURE_PER_TONNAGE,
} from '../data/InternalStructureTables';

type LocationAllocation = {
  front: number;
  rear?: number;
};

type ArmorAllocationRecord = Record<string, LocationAllocation>;

const HEAD_MAX = 9;

const LOCATION_DEFINITIONS = [
  { label: 'Head', key: 'HD', hasRear: false },
  { label: 'Center Torso', key: 'CT', hasRear: true },
  { label: 'Left Torso', key: 'LT', hasRear: true },
  { label: 'Right Torso', key: 'RT', hasRear: true },
  { label: 'Left Arm', key: 'LA', hasRear: false },
  { label: 'Right Arm', key: 'RA', hasRear: false },
  { label: 'Left Leg', key: 'LL', hasRear: false },
  { label: 'Right Leg', key: 'RL', hasRear: false },
];

const getStructureByTonnage = (tonnage: number): IInternalStructurePoints => {
  const sortedTonnages = Object.keys(INTERNAL_STRUCTURE_PER_TONNAGE)
    .map(Number)
    .sort((a, b) => a - b);

  const matched =
    sortedTonnages.find(value => value >= tonnage) ??
    sortedTonnages[sortedTonnages.length - 1];

  return INTERNAL_STRUCTURE_PER_TONNAGE[matched];
};

const calculateMaxArmorByLocation = (
  structure: IInternalStructurePoints,
): Record<string, number> => ({
  Head: HEAD_MAX,
  'Center Torso': structure.CT * 2,
  'Left Torso': structure.LT * 2,
  'Right Torso': structure.RT * 2,
  'Left Arm': structure.LA * 2,
  'Right Arm': structure.RA * 2,
  'Left Leg': structure.LL * 2,
  'Right Leg': structure.RL * 2,
});

const splitFrontRear = (total: number) => {
  if (total <= 0) {
    return { front: 0, rear: 0 };
  }
  const front = Math.max(0, Math.ceil(total * 0.75));
  const rear = Math.max(0, total - front);
  return { front, rear };
};

const clampArmorPoints = (
  desired: number,
  maxValue: number,
  remaining: number,
) => Math.min(Math.min(desired, maxValue), remaining);

export const autoAllocateArmor = (unit: EditableUnit): ArmorAllocationRecord => {
  const tonnage = unit.tonnage ?? unit.mass ?? unit.data?.mass ?? 50;
  const structure = getStructureByTonnage(Number(tonnage));
  const maxByLocation = calculateMaxArmorByLocation(structure);
  const totalMax = Object.values(maxByLocation).reduce((sum, value) => sum + value, 0);

  const requestedPoints =
    unit.data?.armor?.total_armor_points ??
    totalMax;

  const ratio = totalMax === 0 ? 0 : Math.min(1, requestedPoints / totalMax);
  let remainingPoints = Math.round(requestedPoints);

  const allocation: ArmorAllocationRecord = {};

  LOCATION_DEFINITIONS.forEach(location => {
    const maxPoints = maxByLocation[location.label] ?? 0;
    const desired = Math.floor(maxPoints * ratio);
    const points = clampArmorPoints(desired, maxPoints, remainingPoints);
    remainingPoints -= points;

    if (location.hasRear) {
      const { front, rear } = splitFrontRear(points);
      allocation[location.label] = { front, rear };
    } else {
      allocation[location.label] = { front: points };
    }
  });

  // Any remaining points are distributed to torsos in order.
  if (remainingPoints > 0) {
    for (const location of LOCATION_DEFINITIONS) {
      if (!remainingPoints) break;
      const maxPoints = maxByLocation[location.label] ?? 0;
      const current =
        (allocation[location.label]?.front ?? 0) +
        (allocation[location.label]?.rear ?? 0);
      if (current >= maxPoints) continue;

      const available = maxPoints - current;
      const addition = Math.min(available, remainingPoints);
      remainingPoints -= addition;

      if (location.hasRear) {
        const { front, rear } = allocation[location.label]!;
        allocation[location.label] = splitFrontRear(current + addition);
        allocation[location.label].front = Math.max(allocation[location.label].front, front);
        allocation[location.label].rear = Math.max(allocation[location.label].rear ?? 0, rear ?? 0);
      } else {
        allocation[location.label] = {
          front: current + addition,
        };
      }
    }
  }

  return allocation;
};

export interface IArmorAllocation extends Record<string, number> {
  head: number;
  centerTorso: number;
  centerTorsoRear: number;
  leftTorso: number;
  leftTorsoRear: number;
  rightTorso: number;
  rightTorsoRear: number;
  leftArm: number;
  rightArm: number;
  leftLeg: number;
  rightLeg: number;
}

export const convertToIArmorAllocation = (allocation: Record<string, number>): IArmorAllocation => ({
  head: allocation.head ?? 0,
  centerTorso: allocation.centerTorso ?? 0,
  centerTorsoRear: allocation.centerTorsoRear ?? 0,
  leftTorso: allocation.leftTorso ?? 0,
  leftTorsoRear: allocation.leftTorsoRear ?? 0,
  rightTorso: allocation.rightTorso ?? 0,
  rightTorsoRear: allocation.rightTorsoRear ?? 0,
  leftArm: allocation.leftArm ?? 0,
  rightArm: allocation.rightArm ?? 0,
  leftLeg: allocation.leftLeg ?? 0,
  rightLeg: allocation.rightLeg ?? 0,
});

