/**
 * Era - Historical era enumeration
 * Defines the 8 canonical BattleTech eras.
 * 
 * @spec openspec/specs/phase-1-foundation/core-enumerations/spec.md
 */

/**
 * Historical eras in the BattleTech universe.
 * Used for era-based filtering and historical accuracy.
 */
export enum Era {
  /** Age of War (2005-2570) - Early interstellar conflict */
  AGE_OF_WAR = 'Age of War',
  
  /** Star League (2571-2780) - Golden age of technology */
  STAR_LEAGUE = 'Star League',
  
  /** Succession Wars (2781-3049) - Dark age of technology loss */
  SUCCESSION_WARS = 'Succession Wars',
  
  /** Clan Invasion (3050-3067) - Return of the Clans */
  CLAN_INVASION = 'Clan Invasion',
  
  /** Civil War (3068-3080) - Word of Blake Jihad */
  CIVIL_WAR = 'Civil War',
  
  /** Dark Age (3081-3151) - Republic of the Sphere */
  DARK_AGE = 'Dark Age',
  
  /** ilClan (3152+) - Clan Wolf takes Terra */
  ILCLAN = 'ilClan',
  
  /** Early Spaceflight (pre-2005) - Before the Age of War */
  EARLY_SPACEFLIGHT = 'Early Spaceflight',
}

/**
 * Era date range definition
 */
export interface EraRange {
  readonly era: Era;
  readonly startYear: number;
  readonly endYear: number; // Infinity for open-ended eras
}

/**
 * All eras with their date ranges in chronological order
 */
export const ERA_RANGES: readonly EraRange[] = Object.freeze([
  { era: Era.EARLY_SPACEFLIGHT, startYear: -Infinity, endYear: 2004 },
  { era: Era.AGE_OF_WAR, startYear: 2005, endYear: 2570 },
  { era: Era.STAR_LEAGUE, startYear: 2571, endYear: 2780 },
  { era: Era.SUCCESSION_WARS, startYear: 2781, endYear: 3049 },
  { era: Era.CLAN_INVASION, startYear: 3050, endYear: 3067 },
  { era: Era.CIVIL_WAR, startYear: 3068, endYear: 3080 },
  { era: Era.DARK_AGE, startYear: 3081, endYear: 3151 },
  { era: Era.ILCLAN, startYear: 3152, endYear: Infinity },
]);

/**
 * Array of all Era values in chronological order
 */
export const ALL_ERAS: readonly Era[] = Object.freeze(
  ERA_RANGES.map(range => range.era)
);

/**
 * Determine the era for a given year
 */
export function getEraForYear(year: number): Era {
  for (const range of ERA_RANGES) {
    if (year >= range.startYear && year <= range.endYear) {
      return range.era;
    }
  }
  // Default to ilClan for future years
  return Era.ILCLAN;
}

/**
 * Get the date range for an era
 */
export function getEraRange(era: Era): EraRange | undefined {
  return ERA_RANGES.find(range => range.era === era);
}

/**
 * Check if a year falls within an era
 */
export function isYearInEra(year: number, era: Era): boolean {
  const range = getEraRange(era);
  if (!range) return false;
  return year >= range.startYear && year <= range.endYear;
}

