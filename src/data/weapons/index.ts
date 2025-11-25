/**
 * index.ts
 * Export all weapon data.
 */

import type { IWeapon } from '../../types/Equipment';
import { ENERGY_WEAPONS } from './EnergyWeapons';
import { BALLISTIC_WEAPONS } from './BallisticWeapons';
import { MISSILE_WEAPONS } from './MissileWeapons';

export const WEAPONS_DB: IWeapon[] = [
  ...ENERGY_WEAPONS,
  ...BALLISTIC_WEAPONS,
  ...MISSILE_WEAPONS,
];

// Helper for lookups
export const getWeaponById = (id: string): IWeapon | undefined =>
  WEAPONS_DB.find(weapon => weapon.id === id);

