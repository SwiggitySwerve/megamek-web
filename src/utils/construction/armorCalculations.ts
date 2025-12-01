/**
 * Armor Calculations
 * 
 * Functions for calculating armor allocation and limits.
 * 
 * @spec openspec/specs/armor-system/spec.md
 */

import { ArmorTypeEnum, ArmorDefinition, getArmorDefinition } from '../../types/construction/ArmorType';
import { getStructurePoints } from '../../types/construction/InternalStructureType';
import { ceilToHalfTon } from '../physical/weightUtils';

/**
 * Maximum armor points for head location
 */
export const MAX_HEAD_ARMOR = 9;

/**
 * Calculate maximum armor for a location
 * 
 * Max armor = 2 × internal structure points (head = 9)
 * 
 * @param tonnage - Unit tonnage
 * @param location - Location name
 * @returns Maximum armor points
 */
export function getMaxArmorForLocation(tonnage: number, location: string): number {
  const normalizedLocation = location.toLowerCase();
  
  // Head is special - max 9
  if (normalizedLocation.includes('head')) {
    return MAX_HEAD_ARMOR;
  }
  
  const structurePoints = getStructurePoints(tonnage, location);
  return structurePoints * 2;
}

/**
 * Calculate maximum total armor points for a mech
 * 
 * @param tonnage - Unit tonnage
 * @returns Maximum total armor points
 */
export function getMaxTotalArmor(tonnage: number): number {
  return (
    MAX_HEAD_ARMOR +
    getMaxArmorForLocation(tonnage, 'centerTorso') +
    getMaxArmorForLocation(tonnage, 'leftTorso') +
    getMaxArmorForLocation(tonnage, 'rightTorso') +
    getMaxArmorForLocation(tonnage, 'leftArm') +
    getMaxArmorForLocation(tonnage, 'rightArm') +
    getMaxArmorForLocation(tonnage, 'leftLeg') +
    getMaxArmorForLocation(tonnage, 'rightLeg')
  );
}

/**
 * Calculate armor weight from points and armor type
 * 
 * @param armorPoints - Total armor points
 * @param armorType - Type of armor
 * @returns Armor weight in tons
 */
export function calculateArmorWeight(armorPoints: number, armorType: ArmorTypeEnum): number {
  const definition = getArmorDefinition(armorType);
  if (!definition) {
    return ceilToHalfTon(armorPoints / 16); // Default to standard
  }
  
  return ceilToHalfTon(armorPoints / definition.pointsPerTon);
}

/**
 * Calculate armor points from tonnage and armor type
 * 
 * @param tonnage - Armor tonnage
 * @param armorType - Type of armor
 * @returns Armor points available
 */
export function calculateArmorPoints(tonnage: number, armorType: ArmorTypeEnum): number {
  const definition = getArmorDefinition(armorType);
  if (!definition) {
    return Math.floor(tonnage * 16);
  }
  
  return Math.floor(tonnage * definition.pointsPerTon);
}

/**
 * Calculate critical slots required for armor
 * 
 * @param armorType - Type of armor
 * @returns Critical slots needed
 */
export function getArmorCriticalSlots(armorType: ArmorTypeEnum): number {
  const definition = getArmorDefinition(armorType);
  return definition?.criticalSlots ?? 0;
}

/**
 * Validate armor allocation for a location
 * 
 * @param tonnage - Unit tonnage
 * @param location - Location name
 * @param front - Front armor points
 * @param rear - Rear armor points (for torsos)
 * @returns Validation result
 */
export function validateLocationArmor(
  tonnage: number,
  location: string,
  front: number,
  rear: number = 0
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const maxArmor = getMaxArmorForLocation(tonnage, location);
  const total = front + rear;
  
  if (total > maxArmor) {
    errors.push(`${location} armor (${total}) exceeds maximum (${maxArmor})`);
  }
  
  if (front < 0) {
    errors.push(`${location} front armor cannot be negative`);
  }
  
  if (rear < 0) {
    errors.push(`${location} rear armor cannot be negative`);
  }
  
  // Rear armor rules
  const normalizedLocation = location.toLowerCase();
  if (normalizedLocation.includes('torso') && rear > 0) {
    // Rear armor is allowed for torso locations
  } else if (rear > 0) {
    errors.push(`${location} does not support rear armor`);
  }
  
  return { isValid: errors.length === 0, errors };
}

/**
 * Get recommended armor allocation percentages
 */
export function getRecommendedArmorDistribution(): Record<string, number> {
  return {
    head: 0.05,           // 5% - head
    centerTorso: 0.20,    // 20% - CT front
    centerTorsoRear: 0.05, // 5% - CT rear
    leftTorso: 0.12,      // 12% - LT front
    leftTorsoRear: 0.03,  // 3% - LT rear
    rightTorso: 0.12,     // 12% - RT front
    rightTorsoRear: 0.03, // 3% - RT rear
    leftArm: 0.10,        // 10% - LA
    rightArm: 0.10,       // 10% - RA
    leftLeg: 0.10,        // 10% - LL
    rightLeg: 0.10,       // 10% - RL
  };
}

/**
 * Calculate armor cost
 * 
 * @param armorPoints - Total armor points
 * @param armorType - Type of armor
 * @returns Cost in C-Bills
 */
export function calculateArmorCost(armorPoints: number, armorType: ArmorTypeEnum): number {
  const definition = getArmorDefinition(armorType);
  const baseCost = armorPoints * 10000; // Base 10000 C-Bills per point
  return baseCost * (definition?.costMultiplier ?? 1);
}

