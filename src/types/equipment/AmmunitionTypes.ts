/**
 * Ammunition Type Definitions
 * 
 * Comprehensive ammunition types and compatibility rules.
 * 
 * @spec openspec/changes/implement-phase3-equipment/specs/ammunition-system/spec.md
 */

import { TechBase } from '../enums/TechBase';
import { RulesLevel } from '../enums/RulesLevel';

/**
 * Ammunition category
 */
export enum AmmoCategory {
  AUTOCANNON = 'Autocannon',
  GAUSS = 'Gauss',
  MACHINE_GUN = 'Machine Gun',
  LRM = 'LRM',
  SRM = 'SRM',
  MRM = 'MRM',
  ATM = 'ATM',
  NARC = 'NARC',
  ARTILLERY = 'Artillery',
  AMS = 'AMS',
}

/**
 * Special ammo variant types
 */
export enum AmmoVariant {
  STANDARD = 'Standard',
  ARMOR_PIERCING = 'Armor-Piercing',
  CLUSTER = 'Cluster',
  PRECISION = 'Precision',
  FLECHETTE = 'Flechette',
  INFERNO = 'Inferno',
  FRAGMENTATION = 'Fragmentation',
  INCENDIARY = 'Incendiary',
  SMOKE = 'Smoke',
  THUNDER = 'Thunder',
  SWARM = 'Swarm',
  TANDEM_CHARGE = 'Tandem-Charge',
  EXTENDED_RANGE = 'Extended Range',
  HIGH_EXPLOSIVE = 'High Explosive',
}

/**
 * Ammunition interface
 */
export interface IAmmunition {
  readonly id: string;
  readonly name: string;
  readonly category: AmmoCategory;
  readonly variant: AmmoVariant;
  readonly techBase: TechBase;
  readonly rulesLevel: RulesLevel;
  readonly compatibleWeaponIds: readonly string[];
  readonly shotsPerTon: number;
  readonly weight: number;
  readonly criticalSlots: number;
  readonly costPerTon: number;
  readonly battleValue: number;
  readonly isExplosive: boolean;
  readonly damageModifier?: number;
  readonly rangeModifier?: number;
  readonly introductionYear: number;
  readonly special?: readonly string[];
}

// ============================================================================
// AUTOCANNON AMMUNITION
// ============================================================================

/**
 * Standard AC Ammo
 */
export const AC_AMMUNITION: readonly IAmmunition[] = [
  // Standard AC Ammo
  {
    id: 'ac-2-ammo',
    name: 'AC/2 Ammo',
    category: AmmoCategory.AUTOCANNON,
    variant: AmmoVariant.STANDARD,
    techBase: TechBase.INNER_SPHERE,
    rulesLevel: RulesLevel.INTRODUCTORY,
    compatibleWeaponIds: ['ac-2'],
    shotsPerTon: 45,
    weight: 1,
    criticalSlots: 1,
    costPerTon: 1000,
    battleValue: 5,
    isExplosive: true,
    introductionYear: 2290,
  },
  {
    id: 'ac-5-ammo',
    name: 'AC/5 Ammo',
    category: AmmoCategory.AUTOCANNON,
    variant: AmmoVariant.STANDARD,
    techBase: TechBase.INNER_SPHERE,
    rulesLevel: RulesLevel.INTRODUCTORY,
    compatibleWeaponIds: ['ac-5'],
    shotsPerTon: 20,
    weight: 1,
    criticalSlots: 1,
    costPerTon: 4500,
    battleValue: 9,
    isExplosive: true,
    introductionYear: 2250,
  },
  {
    id: 'ac-10-ammo',
    name: 'AC/10 Ammo',
    category: AmmoCategory.AUTOCANNON,
    variant: AmmoVariant.STANDARD,
    techBase: TechBase.INNER_SPHERE,
    rulesLevel: RulesLevel.INTRODUCTORY,
    compatibleWeaponIds: ['ac-10'],
    shotsPerTon: 10,
    weight: 1,
    criticalSlots: 1,
    costPerTon: 6000,
    battleValue: 15,
    isExplosive: true,
    introductionYear: 2443,
  },
  {
    id: 'ac-20-ammo',
    name: 'AC/20 Ammo',
    category: AmmoCategory.AUTOCANNON,
    variant: AmmoVariant.STANDARD,
    techBase: TechBase.INNER_SPHERE,
    rulesLevel: RulesLevel.INTRODUCTORY,
    compatibleWeaponIds: ['ac-20'],
    shotsPerTon: 5,
    weight: 1,
    criticalSlots: 1,
    costPerTon: 10000,
    battleValue: 22,
    isExplosive: true,
    introductionYear: 2500,
  },
  // Armor-Piercing AC Ammo
  {
    id: 'ac-2-ap-ammo',
    name: 'AC/2 Armor-Piercing Ammo',
    category: AmmoCategory.AUTOCANNON,
    variant: AmmoVariant.ARMOR_PIERCING,
    techBase: TechBase.INNER_SPHERE,
    rulesLevel: RulesLevel.STANDARD,
    compatibleWeaponIds: ['ac-2'],
    shotsPerTon: 22,
    weight: 1,
    criticalSlots: 1,
    costPerTon: 4000,
    battleValue: 7,
    isExplosive: true,
    introductionYear: 3055,
    special: ['+4 damage vs armor'],
  },
  {
    id: 'ac-5-ap-ammo',
    name: 'AC/5 Armor-Piercing Ammo',
    category: AmmoCategory.AUTOCANNON,
    variant: AmmoVariant.ARMOR_PIERCING,
    techBase: TechBase.INNER_SPHERE,
    rulesLevel: RulesLevel.STANDARD,
    compatibleWeaponIds: ['ac-5'],
    shotsPerTon: 10,
    weight: 1,
    criticalSlots: 1,
    costPerTon: 9000,
    battleValue: 14,
    isExplosive: true,
    introductionYear: 3055,
    special: ['+4 damage vs armor'],
  },
  // Precision AC Ammo
  {
    id: 'ac-2-precision-ammo',
    name: 'AC/2 Precision Ammo',
    category: AmmoCategory.AUTOCANNON,
    variant: AmmoVariant.PRECISION,
    techBase: TechBase.INNER_SPHERE,
    rulesLevel: RulesLevel.STANDARD,
    compatibleWeaponIds: ['ac-2'],
    shotsPerTon: 22,
    weight: 1,
    criticalSlots: 1,
    costPerTon: 6000,
    battleValue: 7,
    isExplosive: true,
    introductionYear: 3062,
    special: ['-1 to-hit modifier'],
  },
] as const;

/**
 * Ultra AC Ammo
 */
export const ULTRA_AC_AMMUNITION: readonly IAmmunition[] = [
  {
    id: 'uac-2-ammo',
    name: 'Ultra AC/2 Ammo',
    category: AmmoCategory.AUTOCANNON,
    variant: AmmoVariant.STANDARD,
    techBase: TechBase.INNER_SPHERE,
    rulesLevel: RulesLevel.STANDARD,
    compatibleWeaponIds: ['uac-2', 'clan-uac-2'],
    shotsPerTon: 45,
    weight: 1,
    criticalSlots: 1,
    costPerTon: 1000,
    battleValue: 8,
    isExplosive: true,
    introductionYear: 2827,
  },
  {
    id: 'uac-5-ammo',
    name: 'Ultra AC/5 Ammo',
    category: AmmoCategory.AUTOCANNON,
    variant: AmmoVariant.STANDARD,
    techBase: TechBase.INNER_SPHERE,
    rulesLevel: RulesLevel.STANDARD,
    compatibleWeaponIds: ['uac-5', 'clan-uac-5'],
    shotsPerTon: 20,
    weight: 1,
    criticalSlots: 1,
    costPerTon: 9000,
    battleValue: 15,
    isExplosive: true,
    introductionYear: 2825,
  },
  {
    id: 'uac-10-ammo',
    name: 'Ultra AC/10 Ammo',
    category: AmmoCategory.AUTOCANNON,
    variant: AmmoVariant.STANDARD,
    techBase: TechBase.INNER_SPHERE,
    rulesLevel: RulesLevel.STANDARD,
    compatibleWeaponIds: ['uac-10', 'clan-uac-10'],
    shotsPerTon: 10,
    weight: 1,
    criticalSlots: 1,
    costPerTon: 12000,
    battleValue: 26,
    isExplosive: true,
    introductionYear: 2825,
  },
  {
    id: 'uac-20-ammo',
    name: 'Ultra AC/20 Ammo',
    category: AmmoCategory.AUTOCANNON,
    variant: AmmoVariant.STANDARD,
    techBase: TechBase.INNER_SPHERE,
    rulesLevel: RulesLevel.STANDARD,
    compatibleWeaponIds: ['uac-20', 'clan-uac-20'],
    shotsPerTon: 5,
    weight: 1,
    criticalSlots: 1,
    costPerTon: 20000,
    battleValue: 35,
    isExplosive: true,
    introductionYear: 2825,
  },
] as const;

/**
 * LB-X AC Ammo
 */
export const LBX_AMMUNITION: readonly IAmmunition[] = [
  // Standard Slug
  {
    id: 'lb-2-x-ammo',
    name: 'LB 2-X Slug Ammo',
    category: AmmoCategory.AUTOCANNON,
    variant: AmmoVariant.STANDARD,
    techBase: TechBase.INNER_SPHERE,
    rulesLevel: RulesLevel.STANDARD,
    compatibleWeaponIds: ['lb-2-x-ac', 'clan-lb-2-x-ac'],
    shotsPerTon: 45,
    weight: 1,
    criticalSlots: 1,
    costPerTon: 2000,
    battleValue: 6,
    isExplosive: true,
    introductionYear: 2595,
  },
  {
    id: 'lb-5-x-ammo',
    name: 'LB 5-X Slug Ammo',
    category: AmmoCategory.AUTOCANNON,
    variant: AmmoVariant.STANDARD,
    techBase: TechBase.INNER_SPHERE,
    rulesLevel: RulesLevel.STANDARD,
    compatibleWeaponIds: ['lb-5-x-ac', 'clan-lb-5-x-ac'],
    shotsPerTon: 20,
    weight: 1,
    criticalSlots: 1,
    costPerTon: 9000,
    battleValue: 12,
    isExplosive: true,
    introductionYear: 2595,
  },
  {
    id: 'lb-10-x-ammo',
    name: 'LB 10-X Slug Ammo',
    category: AmmoCategory.AUTOCANNON,
    variant: AmmoVariant.STANDARD,
    techBase: TechBase.INNER_SPHERE,
    rulesLevel: RulesLevel.STANDARD,
    compatibleWeaponIds: ['lb-10-x-ac', 'clan-lb-10-x-ac'],
    shotsPerTon: 10,
    weight: 1,
    criticalSlots: 1,
    costPerTon: 12000,
    battleValue: 19,
    isExplosive: true,
    introductionYear: 2595,
  },
  {
    id: 'lb-20-x-ammo',
    name: 'LB 20-X Slug Ammo',
    category: AmmoCategory.AUTOCANNON,
    variant: AmmoVariant.STANDARD,
    techBase: TechBase.INNER_SPHERE,
    rulesLevel: RulesLevel.STANDARD,
    compatibleWeaponIds: ['lb-20-x-ac', 'clan-lb-20-x-ac'],
    shotsPerTon: 5,
    weight: 1,
    criticalSlots: 1,
    costPerTon: 20000,
    battleValue: 30,
    isExplosive: true,
    introductionYear: 2595,
  },
  // Cluster
  {
    id: 'lb-10-x-cluster-ammo',
    name: 'LB 10-X Cluster Ammo',
    category: AmmoCategory.AUTOCANNON,
    variant: AmmoVariant.CLUSTER,
    techBase: TechBase.INNER_SPHERE,
    rulesLevel: RulesLevel.STANDARD,
    compatibleWeaponIds: ['lb-10-x-ac', 'clan-lb-10-x-ac'],
    shotsPerTon: 10,
    weight: 1,
    criticalSlots: 1,
    costPerTon: 15000,
    battleValue: 19,
    isExplosive: true,
    introductionYear: 2595,
    special: ['-2 to-hit vs aerospace', 'Cluster damage'],
  },
  {
    id: 'lb-20-x-cluster-ammo',
    name: 'LB 20-X Cluster Ammo',
    category: AmmoCategory.AUTOCANNON,
    variant: AmmoVariant.CLUSTER,
    techBase: TechBase.INNER_SPHERE,
    rulesLevel: RulesLevel.STANDARD,
    compatibleWeaponIds: ['lb-20-x-ac', 'clan-lb-20-x-ac'],
    shotsPerTon: 5,
    weight: 1,
    criticalSlots: 1,
    costPerTon: 25000,
    battleValue: 30,
    isExplosive: true,
    introductionYear: 2595,
    special: ['-2 to-hit vs aerospace', 'Cluster damage'],
  },
] as const;

// ============================================================================
// GAUSS AMMUNITION
// ============================================================================

export const GAUSS_AMMUNITION: readonly IAmmunition[] = [
  {
    id: 'gauss-ammo',
    name: 'Gauss Ammo',
    category: AmmoCategory.GAUSS,
    variant: AmmoVariant.STANDARD,
    techBase: TechBase.INNER_SPHERE,
    rulesLevel: RulesLevel.STANDARD,
    compatibleWeaponIds: ['gauss-rifle', 'clan-gauss-rifle'],
    shotsPerTon: 8,
    weight: 1,
    criticalSlots: 1,
    costPerTon: 20000,
    battleValue: 40,
    isExplosive: true,
    introductionYear: 2590,
  },
  {
    id: 'light-gauss-ammo',
    name: 'Light Gauss Ammo',
    category: AmmoCategory.GAUSS,
    variant: AmmoVariant.STANDARD,
    techBase: TechBase.INNER_SPHERE,
    rulesLevel: RulesLevel.STANDARD,
    compatibleWeaponIds: ['light-gauss-rifle'],
    shotsPerTon: 16,
    weight: 1,
    criticalSlots: 1,
    costPerTon: 20000,
    battleValue: 20,
    isExplosive: true,
    introductionYear: 3056,
  },
  {
    id: 'heavy-gauss-ammo',
    name: 'Heavy Gauss Ammo',
    category: AmmoCategory.GAUSS,
    variant: AmmoVariant.STANDARD,
    techBase: TechBase.INNER_SPHERE,
    rulesLevel: RulesLevel.STANDARD,
    compatibleWeaponIds: ['heavy-gauss-rifle'],
    shotsPerTon: 4,
    weight: 1,
    criticalSlots: 1,
    costPerTon: 20000,
    battleValue: 43,
    isExplosive: true,
    introductionYear: 3061,
  },
  {
    id: 'ap-gauss-ammo',
    name: 'AP Gauss Ammo',
    category: AmmoCategory.GAUSS,
    variant: AmmoVariant.STANDARD,
    techBase: TechBase.CLAN,
    rulesLevel: RulesLevel.STANDARD,
    compatibleWeaponIds: ['ap-gauss-rifle'],
    shotsPerTon: 40,
    weight: 1,
    criticalSlots: 1,
    costPerTon: 3000,
    battleValue: 3,
    isExplosive: true,
    introductionYear: 3069,
  },
] as const;

// ============================================================================
// MACHINE GUN AMMUNITION
// ============================================================================

export const MG_AMMUNITION: readonly IAmmunition[] = [
  {
    id: 'mg-ammo',
    name: 'MG Ammo',
    category: AmmoCategory.MACHINE_GUN,
    variant: AmmoVariant.STANDARD,
    techBase: TechBase.INNER_SPHERE,
    rulesLevel: RulesLevel.INTRODUCTORY,
    compatibleWeaponIds: ['machine-gun', 'clan-machine-gun'],
    shotsPerTon: 200,
    weight: 1,
    criticalSlots: 1,
    costPerTon: 1000,
    battleValue: 1,
    isExplosive: true,
    introductionYear: 1950,
  },
  {
    id: 'mg-ammo-half',
    name: 'MG Ammo (Half)',
    category: AmmoCategory.MACHINE_GUN,
    variant: AmmoVariant.STANDARD,
    techBase: TechBase.INNER_SPHERE,
    rulesLevel: RulesLevel.INTRODUCTORY,
    compatibleWeaponIds: ['machine-gun', 'clan-machine-gun'],
    shotsPerTon: 100,
    weight: 0.5,
    criticalSlots: 1,
    costPerTon: 500,
    battleValue: 1,
    isExplosive: true,
    introductionYear: 1950,
  },
  {
    id: 'light-mg-ammo',
    name: 'Light MG Ammo',
    category: AmmoCategory.MACHINE_GUN,
    variant: AmmoVariant.STANDARD,
    techBase: TechBase.INNER_SPHERE,
    rulesLevel: RulesLevel.STANDARD,
    compatibleWeaponIds: ['light-machine-gun'],
    shotsPerTon: 200,
    weight: 1,
    criticalSlots: 1,
    costPerTon: 1000,
    battleValue: 1,
    isExplosive: true,
    introductionYear: 3068,
  },
  {
    id: 'heavy-mg-ammo',
    name: 'Heavy MG Ammo',
    category: AmmoCategory.MACHINE_GUN,
    variant: AmmoVariant.STANDARD,
    techBase: TechBase.INNER_SPHERE,
    rulesLevel: RulesLevel.STANDARD,
    compatibleWeaponIds: ['heavy-machine-gun'],
    shotsPerTon: 100,
    weight: 1,
    criticalSlots: 1,
    costPerTon: 1000,
    battleValue: 1,
    isExplosive: true,
    introductionYear: 3068,
  },
] as const;

// ============================================================================
// MISSILE AMMUNITION
// ============================================================================

/**
 * LRM Ammo
 */
export const LRM_AMMUNITION: readonly IAmmunition[] = [
  {
    id: 'lrm-ammo',
    name: 'LRM Ammo',
    category: AmmoCategory.LRM,
    variant: AmmoVariant.STANDARD,
    techBase: TechBase.INNER_SPHERE,
    rulesLevel: RulesLevel.INTRODUCTORY,
    compatibleWeaponIds: ['lrm-5', 'lrm-10', 'lrm-15', 'lrm-20', 'clan-lrm-5', 'clan-lrm-10', 'clan-lrm-15', 'clan-lrm-20'],
    shotsPerTon: 120,
    weight: 1,
    criticalSlots: 1,
    costPerTon: 30000,
    battleValue: 17,
    isExplosive: true,
    introductionYear: 2295,
  },
  {
    id: 'lrm-fragmentation-ammo',
    name: 'LRM Fragmentation Ammo',
    category: AmmoCategory.LRM,
    variant: AmmoVariant.FRAGMENTATION,
    techBase: TechBase.INNER_SPHERE,
    rulesLevel: RulesLevel.STANDARD,
    compatibleWeaponIds: ['lrm-5', 'lrm-10', 'lrm-15', 'lrm-20'],
    shotsPerTon: 120,
    weight: 1,
    criticalSlots: 1,
    costPerTon: 30000,
    battleValue: 17,
    isExplosive: true,
    introductionYear: 3054,
    special: ['+2 damage vs infantry'],
  },
  {
    id: 'lrm-thunder-ammo',
    name: 'LRM Thunder Ammo',
    category: AmmoCategory.LRM,
    variant: AmmoVariant.THUNDER,
    techBase: TechBase.INNER_SPHERE,
    rulesLevel: RulesLevel.STANDARD,
    compatibleWeaponIds: ['lrm-5', 'lrm-10', 'lrm-15', 'lrm-20'],
    shotsPerTon: 120,
    weight: 1,
    criticalSlots: 1,
    costPerTon: 60000,
    battleValue: 17,
    isExplosive: true,
    introductionYear: 3054,
    special: ['Minefield deployment'],
  },
  {
    id: 'lrm-swarm-ammo',
    name: 'LRM Swarm Ammo',
    category: AmmoCategory.LRM,
    variant: AmmoVariant.SWARM,
    techBase: TechBase.INNER_SPHERE,
    rulesLevel: RulesLevel.STANDARD,
    compatibleWeaponIds: ['lrm-5', 'lrm-10', 'lrm-15', 'lrm-20'],
    shotsPerTon: 120,
    weight: 1,
    criticalSlots: 1,
    costPerTon: 30000,
    battleValue: 17,
    isExplosive: true,
    introductionYear: 3049,
    special: ['Ignore AMS'],
  },
] as const;

/**
 * SRM Ammo
 */
export const SRM_AMMUNITION: readonly IAmmunition[] = [
  {
    id: 'srm-ammo',
    name: 'SRM Ammo',
    category: AmmoCategory.SRM,
    variant: AmmoVariant.STANDARD,
    techBase: TechBase.INNER_SPHERE,
    rulesLevel: RulesLevel.INTRODUCTORY,
    compatibleWeaponIds: ['srm-2', 'srm-4', 'srm-6', 'clan-srm-2', 'clan-srm-4', 'clan-srm-6'],
    shotsPerTon: 100,
    weight: 1,
    criticalSlots: 1,
    costPerTon: 27000,
    battleValue: 12,
    isExplosive: true,
    introductionYear: 2370,
  },
  {
    id: 'srm-inferno-ammo',
    name: 'SRM Inferno Ammo',
    category: AmmoCategory.SRM,
    variant: AmmoVariant.INFERNO,
    techBase: TechBase.INNER_SPHERE,
    rulesLevel: RulesLevel.STANDARD,
    compatibleWeaponIds: ['srm-2', 'srm-4', 'srm-6'],
    shotsPerTon: 100,
    weight: 1,
    criticalSlots: 1,
    costPerTon: 13500,
    battleValue: 12,
    isExplosive: true,
    introductionYear: 2370,
    special: ['Causes 2 heat per missile', 'No physical damage'],
  },
  {
    id: 'srm-fragmentation-ammo',
    name: 'SRM Fragmentation Ammo',
    category: AmmoCategory.SRM,
    variant: AmmoVariant.FRAGMENTATION,
    techBase: TechBase.INNER_SPHERE,
    rulesLevel: RulesLevel.STANDARD,
    compatibleWeaponIds: ['srm-2', 'srm-4', 'srm-6'],
    shotsPerTon: 100,
    weight: 1,
    criticalSlots: 1,
    costPerTon: 27000,
    battleValue: 12,
    isExplosive: true,
    introductionYear: 3054,
    special: ['+2 damage vs infantry'],
  },
  {
    id: 'srm-tandem-charge-ammo',
    name: 'SRM Tandem-Charge Ammo',
    category: AmmoCategory.SRM,
    variant: AmmoVariant.TANDEM_CHARGE,
    techBase: TechBase.INNER_SPHERE,
    rulesLevel: RulesLevel.ADVANCED,
    compatibleWeaponIds: ['srm-2', 'srm-4', 'srm-6'],
    shotsPerTon: 50,
    weight: 1,
    criticalSlots: 1,
    costPerTon: 54000,
    battleValue: 24,
    isExplosive: true,
    introductionYear: 3057,
    special: ['Extra damage vs armor'],
    damageModifier: 1,
  },
] as const;

/**
 * Streak SRM Ammo
 */
export const STREAK_AMMUNITION: readonly IAmmunition[] = [
  {
    id: 'streak-srm-ammo',
    name: 'Streak SRM Ammo',
    category: AmmoCategory.SRM,
    variant: AmmoVariant.STANDARD,
    techBase: TechBase.INNER_SPHERE,
    rulesLevel: RulesLevel.STANDARD,
    compatibleWeaponIds: ['streak-srm-2', 'streak-srm-4', 'streak-srm-6', 'clan-streak-srm-2', 'clan-streak-srm-4', 'clan-streak-srm-6'],
    shotsPerTon: 100,
    weight: 1,
    criticalSlots: 1,
    costPerTon: 54000,
    battleValue: 17,
    isExplosive: true,
    introductionYear: 2647,
  },
] as const;

/**
 * MRM Ammo
 */
export const MRM_AMMUNITION: readonly IAmmunition[] = [
  {
    id: 'mrm-ammo',
    name: 'MRM Ammo',
    category: AmmoCategory.MRM,
    variant: AmmoVariant.STANDARD,
    techBase: TechBase.INNER_SPHERE,
    rulesLevel: RulesLevel.STANDARD,
    compatibleWeaponIds: ['mrm-10', 'mrm-20', 'mrm-30', 'mrm-40'],
    shotsPerTon: 240,
    weight: 1,
    criticalSlots: 1,
    costPerTon: 5000,
    battleValue: 11,
    isExplosive: true,
    introductionYear: 3058,
  },
] as const;

/**
 * ATM Ammo
 */
export const ATM_AMMUNITION: readonly IAmmunition[] = [
  {
    id: 'atm-standard-ammo',
    name: 'ATM Standard Ammo',
    category: AmmoCategory.ATM,
    variant: AmmoVariant.STANDARD,
    techBase: TechBase.CLAN,
    rulesLevel: RulesLevel.STANDARD,
    compatibleWeaponIds: ['atm-3', 'atm-6', 'atm-9', 'atm-12'],
    shotsPerTon: 20,
    weight: 1,
    criticalSlots: 1,
    costPerTon: 75000,
    battleValue: 26,
    isExplosive: true,
    introductionYear: 3054,
  },
  {
    id: 'atm-er-ammo',
    name: 'ATM Extended Range Ammo',
    category: AmmoCategory.ATM,
    variant: AmmoVariant.EXTENDED_RANGE,
    techBase: TechBase.CLAN,
    rulesLevel: RulesLevel.STANDARD,
    compatibleWeaponIds: ['atm-3', 'atm-6', 'atm-9', 'atm-12'],
    shotsPerTon: 20,
    weight: 1,
    criticalSlots: 1,
    costPerTon: 75000,
    battleValue: 26,
    isExplosive: true,
    introductionYear: 3054,
    special: ['Double range', 'Half damage'],
    damageModifier: 0.5,
    rangeModifier: 2,
  },
  {
    id: 'atm-he-ammo',
    name: 'ATM High Explosive Ammo',
    category: AmmoCategory.ATM,
    variant: AmmoVariant.HIGH_EXPLOSIVE,
    techBase: TechBase.CLAN,
    rulesLevel: RulesLevel.STANDARD,
    compatibleWeaponIds: ['atm-3', 'atm-6', 'atm-9', 'atm-12'],
    shotsPerTon: 20,
    weight: 1,
    criticalSlots: 1,
    costPerTon: 75000,
    battleValue: 26,
    isExplosive: true,
    introductionYear: 3054,
    special: ['Half range', '+50% damage'],
    damageModifier: 1.5,
    rangeModifier: 0.5,
  },
] as const;

// ============================================================================
// AMS AMMUNITION
// ============================================================================

export const AMS_AMMUNITION: readonly IAmmunition[] = [
  {
    id: 'ams-ammo',
    name: 'AMS Ammo',
    category: AmmoCategory.AMS,
    variant: AmmoVariant.STANDARD,
    techBase: TechBase.INNER_SPHERE,
    rulesLevel: RulesLevel.STANDARD,
    compatibleWeaponIds: ['ams'],
    shotsPerTon: 12,
    weight: 1,
    criticalSlots: 1,
    costPerTon: 2000,
    battleValue: 11,
    isExplosive: true,
    introductionYear: 2617,
  },
  {
    id: 'clan-ams-ammo',
    name: 'AMS Ammo (Clan)',
    category: AmmoCategory.AMS,
    variant: AmmoVariant.STANDARD,
    techBase: TechBase.CLAN,
    rulesLevel: RulesLevel.STANDARD,
    compatibleWeaponIds: ['clan-ams'],
    shotsPerTon: 24,
    weight: 1,
    criticalSlots: 1,
    costPerTon: 2000,
    battleValue: 11,
    isExplosive: true,
    introductionYear: 2831,
  },
] as const;

// ============================================================================
// NARC AMMUNITION
// ============================================================================

export const NARC_AMMUNITION: readonly IAmmunition[] = [
  {
    id: 'narc-ammo',
    name: 'NARC Beacon Pods',
    category: AmmoCategory.NARC,
    variant: AmmoVariant.STANDARD,
    techBase: TechBase.INNER_SPHERE,
    rulesLevel: RulesLevel.STANDARD,
    compatibleWeaponIds: ['narc', 'clan-narc'],
    shotsPerTon: 6,
    weight: 1,
    criticalSlots: 1,
    costPerTon: 6000,
    battleValue: 30,
    isExplosive: true,
    introductionYear: 2587,
  },
  {
    id: 'inarc-ammo',
    name: 'iNARC Pods',
    category: AmmoCategory.NARC,
    variant: AmmoVariant.STANDARD,
    techBase: TechBase.INNER_SPHERE,
    rulesLevel: RulesLevel.STANDARD,
    compatibleWeaponIds: ['inarc'],
    shotsPerTon: 4,
    weight: 1,
    criticalSlots: 1,
    costPerTon: 7500,
    battleValue: 21,
    isExplosive: true,
    introductionYear: 3062,
  },
] as const;

// ============================================================================
// COMBINED EXPORTS
// ============================================================================

/**
 * All ammunition types combined
 */
export const ALL_AMMUNITION: readonly IAmmunition[] = [
  ...AC_AMMUNITION,
  ...ULTRA_AC_AMMUNITION,
  ...LBX_AMMUNITION,
  ...GAUSS_AMMUNITION,
  ...MG_AMMUNITION,
  ...LRM_AMMUNITION,
  ...SRM_AMMUNITION,
  ...STREAK_AMMUNITION,
  ...MRM_AMMUNITION,
  ...ATM_AMMUNITION,
  ...AMS_AMMUNITION,
  ...NARC_AMMUNITION,
] as const;

// Backwards compatibility
export const AMMUNITION_TYPES = ALL_AMMUNITION;

/**
 * Get ammunition by ID
 */
export function getAmmunitionById(id: string): IAmmunition | undefined {
  return ALL_AMMUNITION.find(a => a.id === id);
}

/**
 * Get compatible ammunition for a weapon
 */
export function getCompatibleAmmunition(weaponId: string): IAmmunition[] {
  return ALL_AMMUNITION.filter(a => a.compatibleWeaponIds.includes(weaponId));
}

/**
 * Get ammunition by category
 */
export function getAmmunitionByCategory(category: AmmoCategory): IAmmunition[] {
  return ALL_AMMUNITION.filter(a => a.category === category);
}

/**
 * Check if ammunition is compatible with weapon
 */
export function isAmmoCompatible(ammoId: string, weaponId: string): boolean {
  const ammo = getAmmunitionById(ammoId);
  return ammo?.compatibleWeaponIds.includes(weaponId) ?? false;
}

// ============================================================================
// CASE PROTECTION
// ============================================================================

/**
 * CASE (Cellular Ammunition Storage Equipment) protection rules
 */
export interface CASEProtection {
  readonly type: 'CASE' | 'CASE_II';
  readonly techBase: TechBase;
  readonly weight: number;
  readonly criticalSlots: number;
  readonly protectsAdjacentLocations: boolean;
  readonly preventsTorsoDestruction: boolean;
}

export const CASE_DEFINITIONS: readonly CASEProtection[] = [
  {
    type: 'CASE',
    techBase: TechBase.INNER_SPHERE,
    weight: 0.5,
    criticalSlots: 1,
    protectsAdjacentLocations: false,
    preventsTorsoDestruction: true,
  },
  {
    type: 'CASE_II',
    techBase: TechBase.INNER_SPHERE,
    weight: 1,
    criticalSlots: 1,
    protectsAdjacentLocations: true,
    preventsTorsoDestruction: true,
  },
  {
    type: 'CASE',
    techBase: TechBase.CLAN,
    weight: 0,
    criticalSlots: 0,
    protectsAdjacentLocations: false,
    preventsTorsoDestruction: true,
  },
] as const;
