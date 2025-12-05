/**
 * Movement Calculations
 * 
 * Functions for calculating movement points and related values.
 * 
 * @spec openspec/specs/movement-system/spec.md
 */

import { TechBase } from '../../types/enums/TechBase';
import { RulesLevel } from '../../types/enums/RulesLevel';

// calculateWalkMP is exported from engineCalculations.ts
// Re-export it here for convenience
export { calculateWalkMP } from './engineCalculations';

/**
 * Calculate run MP from walk MP
 * 
 * runMP = ceil(walkMP × 1.5)
 * 
 * @param walkMP - Walking movement points
 * @returns Run MP
 */
export function calculateRunMP(walkMP: number): number {
  if (walkMP <= 0) {
    return 0;
  }
  return Math.ceil(walkMP * 1.5);
}

/**
 * Calculate sprint MP from walk MP (with MASC/Supercharger)
 * 
 * sprintMP = floor(walkMP × 2)
 * 
 * @param walkMP - Walking movement points
 * @returns Sprint MP
 */
export function calculateSprintMP(walkMP: number): number {
  if (walkMP <= 0) {
    return 0;
  }
  return Math.floor(walkMP * 2);
}

/**
 * Calculate combined sprint MP with MASC and Supercharger
 * 
 * combinedSprintMP = floor(walkMP × 2.5)
 * 
 * @param walkMP - Walking movement points
 * @returns Combined sprint MP
 */
export function calculateCombinedSprintMP(walkMP: number): number {
  if (walkMP <= 0) {
    return 0;
  }
  return Math.floor(walkMP * 2.5);
}

/**
 * Jump jet type enumeration
 */
export enum JumpJetType {
  STANDARD = 'Standard',
  IMPROVED = 'Improved',
  MECHANICAL = 'Mechanical Jump Boosters',
}

/**
 * Jump jet definition
 */
export interface JumpJetDefinition {
  readonly type: JumpJetType;
  readonly name: string;
  readonly techBase: TechBase;
  readonly rulesLevel: RulesLevel;
  /** Slots per jump jet */
  readonly slotsPerJump: number;
  /** Weight multiplier based on tonnage class */
  readonly getWeight: (tonnage: number) => number;
  /** Introduction year */
  readonly introductionYear: number;
}

/**
 * Jump jet definitions
 */
export const JUMP_JET_DEFINITIONS: readonly JumpJetDefinition[] = [
  {
    type: JumpJetType.STANDARD,
    name: 'Standard Jump Jet',
    techBase: TechBase.INNER_SPHERE,
    rulesLevel: RulesLevel.INTRODUCTORY,
    slotsPerJump: 1,
    getWeight: (tonnage) => {
      if (tonnage <= 55) return 0.5;
      if (tonnage <= 85) return 1.0;
      return 2.0;
    },
    introductionYear: 2471,
  },
  {
    type: JumpJetType.IMPROVED,
    name: 'Improved Jump Jet',
    techBase: TechBase.INNER_SPHERE,
    rulesLevel: RulesLevel.STANDARD,
    slotsPerJump: 2,
    getWeight: (tonnage) => {
      if (tonnage <= 55) return 1.0;
      if (tonnage <= 85) return 2.0;
      return 4.0;
    },
    introductionYear: 3069,
  },
  {
    type: JumpJetType.MECHANICAL,
    name: 'Mechanical Jump Boosters',
    techBase: TechBase.INNER_SPHERE,
    rulesLevel: RulesLevel.EXPERIMENTAL,
    slotsPerJump: 1,
    getWeight: (tonnage) => tonnage * 0.025,
    introductionYear: 3060,
  },
] as const;

/**
 * Get jump jet definition by type
 */
export function getJumpJetDefinition(type: JumpJetType): JumpJetDefinition | undefined {
  return JUMP_JET_DEFINITIONS.find(def => def.type === type);
}

/**
 * Calculate jump jet weight
 * 
 * @param tonnage - Unit tonnage
 * @param jumpMP - Jump movement points
 * @param jumpJetType - Type of jump jets
 * @returns Total weight in tons
 */
export function calculateJumpJetWeight(
  tonnage: number,
  jumpMP: number,
  jumpJetType: JumpJetType
): number {
  const definition = getJumpJetDefinition(jumpJetType);
  if (!definition) {
    return jumpMP * 0.5;
  }
  
  return jumpMP * definition.getWeight(tonnage);
}

/**
 * Calculate jump jet slots
 * 
 * @param jumpMP - Jump movement points
 * @param jumpJetType - Type of jump jets
 * @returns Total critical slots
 */
export function calculateJumpJetSlots(jumpMP: number, jumpJetType: JumpJetType): number {
  const definition = getJumpJetDefinition(jumpJetType);
  if (!definition) {
    return jumpMP;
  }
  
  return jumpMP * definition.slotsPerJump;
}

/**
 * Get maximum jump MP
 * 
 * Standard: max = walkMP
 * Improved: max = runMP = ceil(walkMP × 1.5)
 * 
 * @param walkMP - Walk movement points
 * @param jumpJetType - Type of jump jets
 * @returns Maximum jump MP
 */
export function getMaxJumpMP(walkMP: number, jumpJetType: JumpJetType): number {
  if (jumpJetType === JumpJetType.IMPROVED) {
    // Improved jets can reach up to run MP
    return Math.ceil(walkMP * 1.5);
  }
  return walkMP;
}

/**
 * Validate jump configuration
 * 
 * @param walkMP - Walk MP
 * @param jumpMP - Jump MP
 * @param jumpJetType - Type of jump jets
 * @returns Validation result
 */
export function validateJumpConfiguration(
  walkMP: number,
  jumpMP: number,
  jumpJetType: JumpJetType
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (jumpMP < 0) {
    errors.push('Jump MP cannot be negative');
  }
  
  const maxJump = getMaxJumpMP(walkMP, jumpJetType);
  if (jumpMP > maxJump) {
    errors.push(`Jump MP (${jumpMP}) exceeds maximum (${maxJump}) for ${jumpJetType}`);
  }
  
  return { isValid: errors.length === 0, errors };
}

/**
 * Calculate the maximum run/sprint MP when an enhancement is active
 * 
 * - MASC: Sprint = Walk × 2
 * - Supercharger: Sprint = Walk × 2
 * - TSM: Enhanced Run = Base Run + 1
 *        (+2 Walk from TSM, -1 from heat penalty at 9+ heat = net +1 Run MP)
 * - MASC + Supercharger: Sprint = Walk × 2.5
 * 
 * @param walkMP - Base walking movement points
 * @param enhancement - Active movement enhancement name (or null)
 * @param hasBoth - Whether both MASC and Supercharger are equipped
 * @returns Maximum run MP when enhancement is active, or undefined if no enhancement
 */
export function calculateEnhancedMaxRunMP(
  walkMP: number,
  enhancement: string | null | undefined,
  hasBoth: boolean = false
): number | undefined {
  if (!enhancement) return undefined;
  
  if (hasBoth) {
    return calculateCombinedSprintMP(walkMP);
  }
  
  // Normalize enhancement name for comparison
  const enhancementLower = enhancement.toLowerCase();
  
  if (enhancementLower === 'masc' || enhancementLower === 'supercharger') {
    return calculateSprintMP(walkMP);
  }
  
  if (enhancementLower.includes('triple') || enhancementLower === 'tsm') {
    // TSM: +2 Walk MP at 9+ heat, but -1 from heat penalty = net +1 Run MP
    const baseRunMP = calculateRunMP(walkMP);
    return baseRunMP + 1;
  }
  
  return undefined;
}

