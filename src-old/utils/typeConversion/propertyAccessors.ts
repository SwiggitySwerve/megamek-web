/**
 * Property Accessors
 * 
 * Provides safe access to unit properties that may be in either
 * snake_case (legacy/API format) or camelCase (internal format).
 * 
 * This utility helps during the migration period where both formats
 * may exist in the codebase.
 */

import { EditableUnit } from '../../types/editor';
import { FullUnit } from '../../types';
import { TechBase, RulesLevel } from '../../types/core/BaseTypes';
import { stringToTechBaseWithDefault, stringToRulesLevelWithDefault } from './enumConverters';

/**
 * Type guard to check if unit has camelCase properties (internal format)
 */
function hasCamelCaseProperties(unit: any): unit is { techBase: TechBase; rulesLevel: RulesLevel; tonnage: number } {
  return 'techBase' in unit && 'rulesLevel' in unit && 'tonnage' in unit;
}

/**
 * Type guard to check if unit has snake_case properties (API format)
 */
function hasSnakeCaseProperties(unit: any): unit is { tech_base: string; rules_level: string | number; mass: number } {
  return 'tech_base' in unit || 'rules_level' in unit || 'mass' in unit;
}

/**
 * Safely gets tech base from a unit, preferring camelCase but falling back to snake_case
 * 
 * @param unit - Unit object (EditableUnit, FullUnit, or any object with tech base)
 * @param defaultValue - Default tech base if not found
 * @returns TechBase enum value
 */
export function getTechBase(
  unit: any,
  defaultValue: TechBase = TechBase.INNER_SPHERE
): TechBase {
  // Prefer camelCase (internal format)
  if (hasCamelCaseProperties(unit) && unit.techBase) {
    return unit.techBase;
  }
  
  // Fall back to snake_case (API/legacy format)
  if (hasSnakeCaseProperties(unit)) {
    const techBaseStr = unit.tech_base || (unit.data?.tech_base);
    if (techBaseStr) {
      return stringToTechBaseWithDefault(techBaseStr, defaultValue);
    }
  }
  
  return defaultValue;
}

/**
 * Safely gets rules level from a unit, preferring camelCase but falling back to snake_case
 * 
 * @param unit - Unit object (EditableUnit, FullUnit, or any object with rules level)
 * @param defaultValue - Default rules level if not found
 * @returns RulesLevel enum value
 */
export function getRulesLevel(
  unit: any,
  defaultValue: RulesLevel = RulesLevel.STANDARD
): RulesLevel {
  // Prefer camelCase (internal format)
  if (hasCamelCaseProperties(unit) && unit.rulesLevel) {
    return unit.rulesLevel;
  }
  
  // Fall back to snake_case (API/legacy format)
  if (hasSnakeCaseProperties(unit)) {
    const rulesLevelValue = unit.rules_level || (unit.data?.rules_level);
    if (rulesLevelValue !== undefined && rulesLevelValue !== null) {
      return stringToRulesLevelWithDefault(rulesLevelValue, defaultValue);
    }
  }
  
  return defaultValue;
}

/**
 * Safely gets tonnage/mass from a unit, preferring camelCase but falling back to snake_case
 * 
 * @param unit - Unit object (EditableUnit, FullUnit, or any object with mass/tonnage)
 * @param defaultValue - Default tonnage if not found
 * @returns Tonnage in tons
 */
export function getTonnage(
  unit: any,
  defaultValue: number = 50
): number {
  // Prefer camelCase (internal format)
  if (hasCamelCaseProperties(unit) && unit.tonnage !== undefined && unit.tonnage !== null) {
    return unit.tonnage;
  }
  
  // Fall back to snake_case (API/legacy format)
  if (hasSnakeCaseProperties(unit)) {
    const mass = unit.mass || (unit.data?.mass);
    if (mass !== undefined && mass !== null) {
      return Number(mass) || defaultValue;
    }
  }
  
  return defaultValue;
}

/**
 * Safely gets era from a unit
 * 
 * @param unit - Unit object
 * @param defaultValue - Default era if not found
 * @returns Era string
 */
export function getEra(
  unit: any,
  defaultValue: string = 'Unknown'
): string {
  if (unit.era) {
    return unit.era;
  }
  
  if (unit.data?.era) {
    return unit.data.era;
  }
  
  return defaultValue;
}

/**
 * Checks if a unit has a tech base property (in either format)
 * 
 * @param unit - Unit object
 * @returns True if unit has a tech base property
 */
export function hasTechBase(unit: any): boolean {
  return (
    (hasCamelCaseProperties(unit) && unit.techBase !== undefined) ||
    (hasSnakeCaseProperties(unit) && (unit.tech_base !== undefined || unit.data?.tech_base !== undefined))
  );
}

/**
 * Checks if a unit has a rules level property (in either format)
 * 
 * @param unit - Unit object
 * @returns True if unit has a rules level property
 */
export function hasRulesLevel(unit: any): boolean {
  return (
    (hasCamelCaseProperties(unit) && unit.rulesLevel !== undefined) ||
    (hasSnakeCaseProperties(unit) && (unit.rules_level !== undefined || unit.data?.rules_level !== undefined))
  );
}

/**
 * Checks if a unit has a tonnage/mass property (in either format)
 * 
 * @param unit - Unit object
 * @returns True if unit has a tonnage/mass property
 */
export function hasTonnage(unit: any): boolean {
  return (
    (hasCamelCaseProperties(unit) && unit.tonnage !== undefined && unit.tonnage !== null) ||
    (hasSnakeCaseProperties(unit) && (unit.mass !== undefined || unit.data?.mass !== undefined))
  );
}
