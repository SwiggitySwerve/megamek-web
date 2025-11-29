/**
 * TechLevel - Technology advancement level enumeration
 * Similar to RulesLevel but represents tech advancement.
 * 
 * @spec openspec/specs/phase-1-foundation/core-enumerations/spec.md
 */

/**
 * Technology level for equipment.
 * Represents the advancement/complexity of technology.
 */
export enum TechLevel {
  /** Primitive technology (pre-Star League) */
  PRIMITIVE = 'Primitive',
  
  /** Basic technology available in introductory games */
  INTRODUCTORY = 'Introductory',
  
  /** Standard technology for regular games */
  STANDARD = 'Standard',
  
  /** Advanced technology requiring additional rules */
  ADVANCED = 'Advanced',
  
  /** Experimental technology with limited availability */
  EXPERIMENTAL = 'Experimental',
}

/**
 * Array of all TechLevel values in order of advancement
 */
export const ALL_TECH_LEVELS: readonly TechLevel[] = Object.freeze([
  TechLevel.PRIMITIVE,
  TechLevel.INTRODUCTORY,
  TechLevel.STANDARD,
  TechLevel.ADVANCED,
  TechLevel.EXPERIMENTAL,
]);

/**
 * Numeric ordering for tech levels (lower = simpler)
 */
export const TECH_LEVEL_ORDER: Readonly<Record<TechLevel, number>> = Object.freeze({
  [TechLevel.PRIMITIVE]: 0,
  [TechLevel.INTRODUCTORY]: 1,
  [TechLevel.STANDARD]: 2,
  [TechLevel.ADVANCED]: 3,
  [TechLevel.EXPERIMENTAL]: 4,
});

/**
 * Compare two tech levels.
 * @returns negative if a < b, 0 if equal, positive if a > b
 */
export function compareTechLevels(a: TechLevel, b: TechLevel): number {
  return TECH_LEVEL_ORDER[a] - TECH_LEVEL_ORDER[b];
}

/**
 * Check if a tech level is at or below a maximum level
 */
export function isWithinTechLevel(level: TechLevel, maxLevel: TechLevel): boolean {
  return TECH_LEVEL_ORDER[level] <= TECH_LEVEL_ORDER[maxLevel];
}

