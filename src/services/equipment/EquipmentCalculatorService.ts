/**
 * Equipment Calculator Service
 * 
 * Calculates variable equipment properties based on mech context.
 * 
 * @spec openspec/specs/equipment-services/spec.md
 */

import { TechBase } from '@/types/enums/TechBase';
import { IVariableEquipmentContext, ICalculatedEquipmentProperties } from '../common/types';
import { ValidationError } from '../common/errors';

/**
 * Variable equipment IDs
 */
export const VARIABLE_EQUIPMENT = {
  // Targeting Computers
  TARGETING_COMPUTER_IS: 'targeting-computer-is',
  TARGETING_COMPUTER_CLAN: 'targeting-computer-clan',
  
  // MASC
  MASC_IS: 'masc-is',
  MASC_CLAN: 'masc-clan',
  
  // Supercharger
  SUPERCHARGER: 'supercharger',
  
  // Partial Wing
  PARTIAL_WING: 'partial-wing',
  
  // TSM
  TSM: 'tsm',
} as const;

type VariableEquipmentId = typeof VARIABLE_EQUIPMENT[keyof typeof VARIABLE_EQUIPMENT];

/**
 * Required context fields per equipment type
 */
const REQUIRED_CONTEXT: Record<string, readonly string[]> = {
  [VARIABLE_EQUIPMENT.TARGETING_COMPUTER_IS]: ['directFireWeaponTonnage'],
  [VARIABLE_EQUIPMENT.TARGETING_COMPUTER_CLAN]: ['directFireWeaponTonnage'],
  [VARIABLE_EQUIPMENT.MASC_IS]: ['engineRating', 'tonnage'],
  [VARIABLE_EQUIPMENT.MASC_CLAN]: ['engineRating', 'tonnage'],
  [VARIABLE_EQUIPMENT.SUPERCHARGER]: ['engineWeight'],
  [VARIABLE_EQUIPMENT.PARTIAL_WING]: ['tonnage'],
  [VARIABLE_EQUIPMENT.TSM]: ['tonnage'],
};

/**
 * Equipment calculator service interface
 */
export interface IEquipmentCalculatorService {
  calculateProperties(
    equipmentId: string,
    context: IVariableEquipmentContext
  ): ICalculatedEquipmentProperties;
  
  isVariable(equipmentId: string): boolean;
  
  getRequiredContext(equipmentId: string): readonly string[];
}

/**
 * Equipment Calculator Service implementation
 */
export class EquipmentCalculatorService implements IEquipmentCalculatorService {
  
  /**
   * Calculate properties for variable equipment
   */
  calculateProperties(
    equipmentId: string,
    context: IVariableEquipmentContext
  ): ICalculatedEquipmentProperties {
    // Validate required context
    const required = this.getRequiredContext(equipmentId);
    const missing = required.filter(field => 
      context[field as keyof IVariableEquipmentContext] === undefined
    );
    
    if (missing.length > 0) {
      throw new ValidationError(
        `Missing required context for ${equipmentId}`,
        missing.map(f => `Missing: ${f}`)
      );
    }

    switch (equipmentId) {
      case VARIABLE_EQUIPMENT.TARGETING_COMPUTER_IS:
        return this.calculateTargetingComputer(context.directFireWeaponTonnage!, false);
      
      case VARIABLE_EQUIPMENT.TARGETING_COMPUTER_CLAN:
        return this.calculateTargetingComputer(context.directFireWeaponTonnage!, true);
      
      case VARIABLE_EQUIPMENT.MASC_IS:
        return this.calculateMASC(context.engineRating!, context.tonnage!, false);
      
      case VARIABLE_EQUIPMENT.MASC_CLAN:
        return this.calculateMASC(context.engineRating!, context.tonnage!, true);
      
      case VARIABLE_EQUIPMENT.SUPERCHARGER:
        return this.calculateSupercharger(context.engineWeight!);
      
      case VARIABLE_EQUIPMENT.PARTIAL_WING:
        return this.calculatePartialWing(context.tonnage!);
      
      case VARIABLE_EQUIPMENT.TSM:
        return this.calculateTSM(context.tonnage!);
      
      default:
        throw new ValidationError(
          `Unknown variable equipment: ${equipmentId}`,
          [`Equipment ID '${equipmentId}' is not a known variable equipment type`]
        );
    }
  }

  /**
   * Check if equipment has variable properties
   */
  isVariable(equipmentId: string): boolean {
    return Object.values(VARIABLE_EQUIPMENT).includes(equipmentId as VariableEquipmentId);
  }

  /**
   * Get required context fields for equipment
   */
  getRequiredContext(equipmentId: string): readonly string[] {
    return REQUIRED_CONTEXT[equipmentId] || [];
  }

  // ============================================================================
  // CALCULATION FORMULAS
  // ============================================================================

  /**
   * Targeting Computer: weight = ceil(directFireWeaponTonnage / divisor)
   * IS: divisor = 4, Clan: divisor = 5
   * Slots = weight
   * Cost = weight × 10,000
   */
  private calculateTargetingComputer(weaponTonnage: number, isClan: boolean): ICalculatedEquipmentProperties {
    const divisor = isClan ? 5 : 4;
    const weight = Math.ceil(weaponTonnage / divisor);
    return {
      weight,
      criticalSlots: weight,
      cost: weight * 10000,
    };
  }

  /**
   * MASC: weight = ceil(engineRating / divisor)
   * IS: divisor = 20, Clan: divisor = 25
   * Slots = weight
   * Cost = mechTonnage × 1,000
   */
  private calculateMASC(engineRating: number, tonnage: number, isClan: boolean): ICalculatedEquipmentProperties {
    const divisor = isClan ? 25 : 20;
    const weight = Math.ceil(engineRating / divisor);
    return {
      weight,
      criticalSlots: weight,
      cost: tonnage * 1000,
    };
  }

  /**
   * Supercharger: weight = ceil(engineWeight / 10) rounded to 0.5 tons
   * Slots = 1
   * Cost = engineWeight × 10,000
   */
  private calculateSupercharger(engineWeight: number): ICalculatedEquipmentProperties {
    const rawWeight = engineWeight / 10;
    const weight = Math.ceil(rawWeight * 2) / 2; // Round to nearest 0.5
    return {
      weight,
      criticalSlots: 1,
      cost: engineWeight * 10000,
    };
  }

  /**
   * Partial Wing: weight = tonnage × 0.05 rounded to 0.5 tons
   * Slots = 6 (3 per side torso)
   * Cost = weight × 50,000
   */
  private calculatePartialWing(tonnage: number): ICalculatedEquipmentProperties {
    const rawWeight = tonnage * 0.05;
    const weight = Math.ceil(rawWeight * 2) / 2; // Round to nearest 0.5
    return {
      weight,
      criticalSlots: 6,
      cost: weight * 50000,
    };
  }

  /**
   * TSM: weight = 0 (replaces standard myomer)
   * Slots = 6
   * Cost = tonnage × 16,000
   */
  private calculateTSM(tonnage: number): ICalculatedEquipmentProperties {
    return {
      weight: 0,
      criticalSlots: 6,
      cost: tonnage * 16000,
    };
  }
}

// Singleton instance
export const equipmentCalculatorService = new EquipmentCalculatorService();

