/**
 * Variable Equipment Calculations
 * 
 * @deprecated This entire file is deprecated. Use EquipmentCalculatorService instead.
 * 
 * The unified formula system in services/equipment/ now handles all variable equipment
 * calculations through a data-driven approach. These functions are preserved only for
 * backwards compatibility and will be removed in a future version.
 * 
 * Migration:
 * - OLD: calculateTargetingComputer(context)
 * - NEW: equipmentCalculatorService.calculateProperties('targeting-computer-is', context)
 * 
 * @see src/services/equipment/EquipmentCalculatorService.ts
 * @see src/services/equipment/FormulaRegistry.ts
 */

import { TechBase } from '../../types/enums/TechBase';
import {
  IVariableEquipmentContext,
  ICalculatedEquipmentProperties,
} from '../../types/equipment/VariableEquipment';
import { ceilToHalfTon } from '../physical/weightUtils';

// ============================================================================
// TARGETING COMPUTER
// ============================================================================

/**
 * Calculate Targeting Computer weight
 * 
 * IS: ceil(directFireWeaponTonnage / 4)
 * Clan: ceil(directFireWeaponTonnage / 5)
 * 
 * @param directFireWeaponTonnage - Total tonnage of direct-fire weapons
 * @param techBase - IS or Clan
 * @returns Weight in tons (minimum 1)
 */
export function calculateTargetingComputerWeight(
  directFireWeaponTonnage: number,
  techBase: TechBase
): number {
  if (directFireWeaponTonnage <= 0) {
    return 0;
  }
  const divisor = techBase === TechBase.CLAN ? 5 : 4;
  return Math.max(1, Math.ceil(directFireWeaponTonnage / divisor));
}

/**
 * Calculate Targeting Computer critical slots
 * Slots = weight (1 per ton)
 */
export function calculateTargetingComputerSlots(weight: number): number {
  return weight;
}

/**
 * Calculate Targeting Computer cost
 * Cost = weight × 10,000 C-Bills
 */
export function calculateTargetingComputerCost(weight: number): number {
  return weight * 10000;
}

/**
 * Full Targeting Computer calculation
 */
export function calculateTargetingComputer(
  context: IVariableEquipmentContext
): ICalculatedEquipmentProperties {
  const weight = calculateTargetingComputerWeight(
    context.directFireWeaponTonnage,
    context.techBase
  );
  const slots = calculateTargetingComputerSlots(weight);
  const cost = calculateTargetingComputerCost(weight);

  return {
    weight,
    criticalSlots: slots,
    costCBills: cost,
    battleValue: Math.round(weight * 26), // Approximate BV per TechManual
  };
}

// ============================================================================
// MASC (Myomer Accelerator Signal Circuitry)
// ============================================================================

/**
 * Calculate MASC weight
 * 
 * IS: ceil(engineRating / 20)
 * Clan: ceil(engineRating / 25)
 * 
 * @param engineRating - Engine rating
 * @param techBase - IS or Clan
 * @returns Weight in tons
 */
export function calculateMASCWeight(
  engineRating: number,
  techBase: TechBase
): number {
  if (engineRating <= 0) {
    return 0;
  }
  const divisor = techBase === TechBase.CLAN ? 25 : 20;
  return Math.ceil(engineRating / divisor);
}

/**
 * Calculate MASC critical slots
 * Same formula as weight for both IS and Clan
 */
export function calculateMASCSlots(
  engineRating: number,
  techBase: TechBase
): number {
  return calculateMASCWeight(engineRating, techBase);
}

/**
 * Calculate MASC cost
 * Cost = mechTonnage × 1,000 C-Bills
 */
export function calculateMASCCost(mechTonnage: number): number {
  return mechTonnage * 1000;
}

/**
 * Full MASC calculation
 */
export function calculateMASC(
  context: IVariableEquipmentContext
): ICalculatedEquipmentProperties {
  const weight = calculateMASCWeight(context.engineRating, context.techBase);
  const slots = calculateMASCSlots(context.engineRating, context.techBase);
  const cost = calculateMASCCost(context.mechTonnage);

  return {
    weight,
    criticalSlots: slots,
    costCBills: cost,
  };
}

// ============================================================================
// SUPERCHARGER
// ============================================================================

/**
 * Calculate Supercharger weight
 * Weight = engineWeight / 10, rounded to 0.5 tons
 * 
 * @param engineWeight - Engine weight in tons
 * @returns Weight in tons
 */
export function calculateSuperchargerWeight(engineWeight: number): number {
  if (engineWeight <= 0) {
    return 0;
  }
  return ceilToHalfTon(engineWeight / 10);
}

/**
 * Calculate Supercharger cost
 * Cost = engineWeight × 10,000 C-Bills
 */
export function calculateSuperchargerCost(engineWeight: number): number {
  return engineWeight * 10000;
}

/**
 * Full Supercharger calculation
 */
export function calculateSupercharger(
  context: IVariableEquipmentContext
): ICalculatedEquipmentProperties {
  const weight = calculateSuperchargerWeight(context.engineWeight);
  const cost = calculateSuperchargerCost(context.engineWeight);

  return {
    weight,
    criticalSlots: 1, // Always 1 slot
    costCBills: cost,
  };
}

// ============================================================================
// PARTIAL WING
// ============================================================================

/**
 * Calculate Partial Wing weight
 * Weight = mechTonnage × 0.05, rounded to 0.5 tons
 * 
 * @param mechTonnage - Mech tonnage
 * @returns Weight in tons
 */
export function calculatePartialWingWeight(mechTonnage: number): number {
  return ceilToHalfTon(mechTonnage * 0.05);
}

/**
 * Calculate Partial Wing cost
 * Cost = weight × 50,000 C-Bills
 */
export function calculatePartialWingCost(weight: number): number {
  return weight * 50000;
}

/**
 * Full Partial Wing calculation
 */
export function calculatePartialWing(
  context: IVariableEquipmentContext
): ICalculatedEquipmentProperties {
  const weight = calculatePartialWingWeight(context.mechTonnage);
  const cost = calculatePartialWingCost(weight);

  return {
    weight,
    criticalSlots: 6, // 3 per side torso
    costCBills: cost,
  };
}

// ============================================================================
// TRIPLE STRENGTH MYOMER (TSM)
// ============================================================================

/**
 * Calculate TSM cost
 * Cost = mechTonnage × 16,000 C-Bills
 * Weight is 0 (replaces standard myomer)
 * 
 * @param mechTonnage - Mech tonnage
 * @returns Cost in C-Bills
 */
export function calculateTSMCost(mechTonnage: number): number {
  return mechTonnage * 16000;
}

/**
 * Full TSM calculation
 */
export function calculateTSM(
  context: IVariableEquipmentContext
): ICalculatedEquipmentProperties {
  const cost = calculateTSMCost(context.mechTonnage);

  return {
    weight: 0, // Replaces standard myomer
    criticalSlots: 6, // Distributed across torso/legs
    costCBills: cost,
  };
}

// ============================================================================
// JUMP JETS
// ============================================================================

/**
 * Calculate weight per jump jet based on mech tonnage class
 * 
 * Light (10-55 tons): 0.5 tons per JJ
 * Medium (60-85 tons): 1.0 tons per JJ
 * Heavy/Assault (90-100+ tons): 2.0 tons per JJ
 * 
 * @param mechTonnage - Mech tonnage
 * @param isImproved - True for Improved Jump Jets (double weight)
 * @returns Weight per jump jet
 */
export function calculateJumpJetWeightPerJet(
  mechTonnage: number,
  isImproved: boolean = false
): number {
  let baseWeight: number;
  if (mechTonnage <= 55) {
    baseWeight = 0.5;
  } else if (mechTonnage <= 85) {
    baseWeight = 1.0;
  } else {
    baseWeight = 2.0;
  }
  return isImproved ? baseWeight * 2 : baseWeight;
}

/**
 * Calculate total jump jet weight
 * 
 * @param mechTonnage - Mech tonnage
 * @param jumpMP - Number of jump jets / jump MP
 * @param isImproved - True for Improved Jump Jets
 * @returns Total weight in tons
 */
export function calculateJumpJetWeight(
  mechTonnage: number,
  jumpMP: number,
  isImproved: boolean = false
): number {
  const weightPerJet = calculateJumpJetWeightPerJet(mechTonnage, isImproved);
  return jumpMP * weightPerJet;
}


