/**
 * TechBase - Technology base enumeration
 * Defines the technology base classification for all equipment.
 * 
 * @spec openspec/specs/phase-1-foundation/core-enumerations/spec.md
 */

/**
 * Technology base for equipment and units.
 * Inner Sphere and Clan represent the two major technology families.
 */
export enum TechBase {
  /** Inner Sphere technology */
  INNER_SPHERE = 'Inner Sphere',
  
  /** Clan technology */
  CLAN = 'Clan',
  
  /** Mixed technology (both IS and Clan components) */
  MIXED = 'Mixed',
  
  /** Mixed with Inner Sphere base chassis */
  MIXED_IS_CHASSIS = 'Mixed (IS Chassis)',
  
  /** Mixed with Clan base chassis */
  MIXED_CLAN_CHASSIS = 'Mixed (Clan Chassis)',
}

/**
 * Array of all TechBase values for iteration
 */
export const ALL_TECH_BASES: readonly TechBase[] = Object.freeze([
  TechBase.INNER_SPHERE,
  TechBase.CLAN,
  TechBase.MIXED,
  TechBase.MIXED_IS_CHASSIS,
  TechBase.MIXED_CLAN_CHASSIS,
]);

/**
 * Primary tech bases (not mixed)
 */
export const PRIMARY_TECH_BASES: readonly TechBase[] = Object.freeze([
  TechBase.INNER_SPHERE,
  TechBase.CLAN,
]);

/**
 * Check if a tech base is a mixed configuration
 */
export function isMixedTechBase(techBase: TechBase): boolean {
  return (
    techBase === TechBase.MIXED ||
    techBase === TechBase.MIXED_IS_CHASSIS ||
    techBase === TechBase.MIXED_CLAN_CHASSIS
  );
}

/**
 * Get the base tech (IS or Clan) for mixed tech configurations
 */
export function getBaseTechBase(techBase: TechBase): TechBase.INNER_SPHERE | TechBase.CLAN {
  switch (techBase) {
    case TechBase.CLAN:
    case TechBase.MIXED_CLAN_CHASSIS:
      return TechBase.CLAN;
    case TechBase.INNER_SPHERE:
    case TechBase.MIXED:
    case TechBase.MIXED_IS_CHASSIS:
    default:
      return TechBase.INNER_SPHERE;
  }
}

