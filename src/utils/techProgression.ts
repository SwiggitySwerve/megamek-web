import { TechBase } from '../types';

export type TechBranch = Exclude<TechBase, TechBase.MIXED>;

export interface TechProgression {
  chassis: TechBranch;
  gyro: TechBranch;
  engine: TechBranch;
  heatsink: TechBranch;
  targeting: TechBranch;
  myomer: TechBranch;
  movement: TechBranch;
  armor: TechBranch;
}

export function createDefaultTechProgression(
  base: TechBranch = TechBase.INNER_SPHERE,
): TechProgression {
  return {
    chassis: base,
    gyro: base,
    engine: base,
    heatsink: base,
    targeting: base,
    myomer: base,
    movement: base,
    armor: base,
  };
}

export function updateTechProgression(
  current: TechProgression,
  subsystem: keyof TechProgression,
  newTech: TechBranch,
): TechProgression {
  if (current[subsystem] === newTech) {
    return current;
  }
  return { ...current, [subsystem]: newTech };
}

export function isMixedTech(progression: TechProgression): boolean {
  const values = Object.values(progression);
  const hasInnerSphere = values.includes(TechBase.INNER_SPHERE);
  const hasClan = values.includes(TechBase.CLAN);
  return hasInnerSphere && hasClan;
}

export function getPrimaryTechBase(progression: TechProgression): TechBase {
  if (!isMixedTech(progression)) {
    return progression.chassis;
  }

  const values = Object.values(progression);
  const innerSphereCount = values.filter((value) => value === TechBase.INNER_SPHERE).length;
  const clanCount = values.filter((value) => value === TechBase.CLAN).length;

  if (innerSphereCount > clanCount) {
    return TechBase.INNER_SPHERE;
  }
  if (clanCount > innerSphereCount) {
    return TechBase.CLAN;
  }
  return TechBase.MIXED;
}

export interface TechRating {
  era2100_2800: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'X';
  era2801_3050: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'X';
  era3051_3082: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'X';
  era3083_Now: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'X';
}

export interface EquipmentAvailabilityProfile {
  introductionYear: number;
  retirementYear?: number;
  availabilityRatings?: [string, string, string, string];
  factions?: string[];
}

const DEFAULT_EQUIPMENT_PROFILE: EquipmentAvailabilityProfile = {
  introductionYear: 2000,
  availabilityRatings: ['A', 'A', 'A', 'A'],
};

export const EQUIPMENT_TECH_DATA: Record<string, EquipmentAvailabilityProfile> = {};

const normalizeEquipmentId = (equipment: string | { id: string }): string =>
  typeof equipment === 'string' ? equipment : equipment.id;

export function getEraFromYear(year: number): string {
  if (year >= 2005 && year <= 2570) return 'Age of War';
  if (year >= 2571 && year <= 2780) return 'Star League';
  if (year >= 2781 && year <= 3049) return 'Succession Wars';
  if (year >= 3050 && year <= 3067) return 'Clan Invasion';
  if (year >= 3068 && year <= 3080) return 'Civil War';
  if (year >= 3081 && year <= 3151) return 'Dark Age';
  if (year >= 3152) return 'ilClan';
  return 'Unknown';
}

export function isEquipmentAvailable(
  equipment: string | { id: string },
  year: number,
  faction?: string,
): boolean {
  const profile = EQUIPMENT_TECH_DATA[normalizeEquipmentId(equipment)] ?? DEFAULT_EQUIPMENT_PROFILE;

  if (year < profile.introductionYear) {
    return false;
  }

  if (profile.retirementYear && year > profile.retirementYear) {
    return false;
  }

  if (faction && profile.factions && profile.factions.length > 0) {
    return profile.factions.some((allowed) => allowed.toLowerCase() === faction.toLowerCase());
  }

  return true;
}

export function getAvailabilityRating(
  equipment: string | { id: string },
  year?: number,
  faction?: string,
): string {
  const profile = EQUIPMENT_TECH_DATA[normalizeEquipmentId(equipment)] ?? DEFAULT_EQUIPMENT_PROFILE;
  const ratings = profile.availabilityRatings ?? DEFAULT_EQUIPMENT_PROFILE.availabilityRatings!;
  return ratings.join('-');
}

