/**
 * Era Definitions with Year Boundaries
 * 
 * Defines all canonical BattleTech eras with their historical year ranges.
 * 
 * @spec openspec/changes/implement-phase1-foundation/specs/era-temporal-system/spec.md
 */

/**
 * Canonical BattleTech Eras
 * 
 * These represent the major historical periods in the BattleTech universe.
 * Each era has distinct technological and political characteristics.
 */
export enum Era {
  AGE_OF_WAR = 'Age of War',
  STAR_LEAGUE = 'Star League',
  EARLY_SUCCESSION_WARS = 'Early Succession Wars',
  LATE_SUCCESSION_WARS = 'Late Succession Wars',
  RENAISSANCE = 'Renaissance',
  CLAN_INVASION = 'Clan Invasion',
  CIVIL_WAR = 'Civil War',
  JIHAD = 'Jihad',
  DARK_AGE = 'Dark Age',
  IL_CLAN = 'ilClan',
}

/**
 * Era definition with year boundaries
 */
export interface EraDefinition {
  readonly era: Era;
  readonly name: string;
  readonly startYear: number;
  readonly endYear: number;
  readonly description: string;
}

/**
 * Canonical era definitions with year boundaries
 * 
 * Year ranges are inclusive: a component introduced in 2439 is available
 * in the Age of War era (which ends in 2439).
 */
export const ERA_DEFINITIONS: readonly EraDefinition[] = [
  {
    era: Era.AGE_OF_WAR,
    name: 'Age of War',
    startYear: 2005,
    endYear: 2570,
    description: 'The period of interstellar expansion and conflict before the Star League.',
  },
  {
    era: Era.STAR_LEAGUE,
    name: 'Star League',
    startYear: 2571,
    endYear: 2780,
    description: 'The golden age of human civilization under the Star League.',
  },
  {
    era: Era.EARLY_SUCCESSION_WARS,
    name: 'Early Succession Wars',
    startYear: 2781,
    endYear: 2900,
    description: 'The devastating wars following the fall of the Star League.',
  },
  {
    era: Era.LATE_SUCCESSION_WARS,
    name: 'Late Succession Wars',
    startYear: 2901,
    endYear: 3019,
    description: 'The period of technological decline and limited warfare.',
  },
  {
    era: Era.RENAISSANCE,
    name: 'Renaissance',
    startYear: 3020,
    endYear: 3049,
    description: 'The recovery period marked by the discovery of the Helm Memory Core.',
  },
  {
    era: Era.CLAN_INVASION,
    name: 'Clan Invasion',
    startYear: 3050,
    endYear: 3061,
    description: 'The return of the Clans and their invasion of the Inner Sphere.',
  },
  {
    era: Era.CIVIL_WAR,
    name: 'Civil War',
    startYear: 3062,
    endYear: 3067,
    description: 'The FedCom Civil War and related conflicts.',
  },
  {
    era: Era.JIHAD,
    name: 'Jihad',
    startYear: 3068,
    endYear: 3081,
    description: 'The Word of Blake Jihad and its devastating consequences.',
  },
  {
    era: Era.DARK_AGE,
    name: 'Dark Age',
    startYear: 3082,
    endYear: 3150,
    description: 'The collapse of the HPG network and rise of new powers.',
  },
  {
    era: Era.IL_CLAN,
    name: 'ilClan',
    startYear: 3151,
    endYear: 9999, // Ongoing era
    description: 'The era following the ilClan Trial on Terra.',
  },
] as const;

/**
 * Map for quick era lookup by enum value
 */
export const ERA_MAP: ReadonlyMap<Era, EraDefinition> = new Map(
  ERA_DEFINITIONS.map(def => [def.era, def])
);

/**
 * Get era definition by era enum
 */
export function getEraDefinition(era: Era): EraDefinition | undefined {
  return ERA_MAP.get(era);
}

/**
 * Get all era definitions
 */
export function getAllEraDefinitions(): readonly EraDefinition[] {
  return ERA_DEFINITIONS;
}

