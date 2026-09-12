import type { WeightClass } from '@/types/enums/WeightClass';

export type ChassisId = `battlemech:${string}`;
export type ChassisTechBase = 'INNER_SPHERE' | 'CLAN' | 'MIXED';

export interface IChassisVariant {
  readonly unitId: string;
  readonly name: string;
  readonly weight: number;
  readonly techBase: ChassisTechBase;
  readonly introductionYear: number;
  readonly rulesLevel: string | null;
  readonly role: string | null;
}

export interface IChassisEntry {
  readonly id: ChassisId;
  readonly name: string;
  readonly aliases: readonly string[];
  readonly weights: readonly number[];
  readonly weightClasses: readonly WeightClass[];
  readonly techBases: readonly ChassisTechBase[];
  readonly introductionYear: number;
  readonly variants: readonly IChassisVariant[];
}

export interface IChassisIndex {
  readonly schemaVersion: 1;
  readonly source: {
    readonly path: '/data/units/battlemechs/index.json';
    readonly version: string;
    readonly generatedAt: string;
  };
  readonly totalVariants: number;
  readonly chassis: readonly IChassisEntry[];
}
