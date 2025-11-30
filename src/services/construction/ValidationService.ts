/**
 * Validation Service
 * 
 * Validates mech builds against BattleTech construction rules.
 * 
 * @spec openspec/specs/construction-services/spec.md
 */

import { IValidationResult, IValidationError, ValidationSeverity, validResult, invalidResult } from '../common/types';
import { IEditableMech } from './MechBuilderService';

/**
 * Validation service interface
 */
export interface IValidationService {
  validate(mech: IEditableMech): IValidationResult;
  validateWeight(mech: IEditableMech): IValidationError[];
  validateArmor(mech: IEditableMech): IValidationError[];
  validateCriticalSlots(mech: IEditableMech): IValidationError[];
  validateTechLevel(mech: IEditableMech): IValidationError[];
  canAddEquipment(mech: IEditableMech, equipmentId: string, location: string): boolean;
}

/**
 * Maximum armor per location based on structure points
 * (Simplified - actual values depend on tonnage)
 */
const MAX_ARMOR: Record<string, number> = {
  head: 9,
  centerTorso: 99,      // Varies by tonnage
  centerTorsoRear: 99,  // Varies by tonnage
  leftTorso: 99,        // Varies by tonnage
  leftTorsoRear: 99,    // Varies by tonnage
  rightTorso: 99,       // Varies by tonnage
  rightTorsoRear: 99,   // Varies by tonnage
  leftArm: 99,          // Varies by tonnage
  rightArm: 99,         // Varies by tonnage
  leftLeg: 99,          // Varies by tonnage
  rightLeg: 99,         // Varies by tonnage
};

/**
 * Validation Service implementation
 */
export class ValidationService implements IValidationService {

  /**
   * Validate entire mech build
   */
  validate(mech: IEditableMech): IValidationResult {
    const allErrors: IValidationError[] = [
      ...this.validateWeight(mech),
      ...this.validateArmor(mech),
      ...this.validateCriticalSlots(mech),
      ...this.validateTechLevel(mech),
      ...this.validateEngine(mech),
      ...this.validateHeatSinks(mech),
    ];

    if (allErrors.length === 0) {
      return validResult();
    }

    return invalidResult(allErrors);
  }

  /**
   * Validate weight budget
   */
  validateWeight(mech: IEditableMech): IValidationError[] {
    const errors: IValidationError[] = [];
    
    // Calculate total weight (simplified)
    const structureWeight = mech.tonnage * 0.1; // 10% for standard
    const engineWeight = this.calculateEngineWeight(mech.engineRating, mech.engineType);
    const gyroWeight = Math.ceil(mech.engineRating / 100);
    const cockpitWeight = 3;
    const armorWeight = this.calculateArmorWeight(mech.armorAllocation);
    const heatSinkWeight = Math.max(0, mech.heatSinkCount - 10); // First 10 are free
    
    const totalWeight = structureWeight + engineWeight + gyroWeight + cockpitWeight + armorWeight + heatSinkWeight;
    
    if (totalWeight > mech.tonnage) {
      const overage = (totalWeight - mech.tonnage).toFixed(1);
      errors.push({
        code: 'OVERWEIGHT',
        message: `Mech exceeds maximum tonnage by ${overage} tons`,
        severity: ValidationSeverity.ERROR,
        details: { totalWeight, maxWeight: mech.tonnage },
      });
    }

    return errors;
  }

  /**
   * Validate armor limits
   */
  validateArmor(mech: IEditableMech): IValidationError[] {
    const errors: IValidationError[] = [];
    const armor = mech.armorAllocation;

    // Head armor max is always 9
    if (armor.head > 9) {
      errors.push({
        code: 'ARMOR_EXCEEDS_MAX',
        message: 'Head armor exceeds maximum of 9',
        severity: ValidationSeverity.ERROR,
        field: 'head',
        details: { actual: armor.head, max: 9 },
      });
    }

    // TODO: Add per-location max based on internal structure

    return errors;
  }

  /**
   * Validate critical slots
   */
  validateCriticalSlots(mech: IEditableMech): IValidationError[] {
    const errors: IValidationError[] = [];
    
    // Count slots per location
    const slotsUsed: Record<string, number> = {};
    for (const eq of mech.equipment) {
      slotsUsed[eq.location] = (slotsUsed[eq.location] || 0) + 1;
    }

    // Check against max (simplified - actual max varies)
    const maxSlots: Record<string, number> = {
      head: 6,
      centerTorso: 12,
      leftTorso: 12,
      rightTorso: 12,
      leftArm: 12,
      rightArm: 12,
      leftLeg: 6,
      rightLeg: 6,
    };

    for (const [location, used] of Object.entries(slotsUsed)) {
      const max = maxSlots[location] || 12;
      if (used > max) {
        errors.push({
          code: 'SLOTS_EXCEEDED',
          message: `${location} exceeds maximum of ${max} critical slots`,
          severity: ValidationSeverity.ERROR,
          field: location,
          details: { used, max },
        });
      }
    }

    return errors;
  }

  /**
   * Validate tech level compatibility
   */
  validateTechLevel(mech: IEditableMech): IValidationError[] {
    const errors: IValidationError[] = [];
    // TODO: Implement tech level validation
    return errors;
  }

  /**
   * Validate engine configuration
   */
  private validateEngine(mech: IEditableMech): IValidationError[] {
    const errors: IValidationError[] = [];

    if (mech.engineRating < 10 || mech.engineRating > 400) {
      errors.push({
        code: 'INVALID_ENGINE_RATING',
        message: `Engine rating ${mech.engineRating} must be between 10 and 400`,
        severity: ValidationSeverity.ERROR,
        field: 'engineRating',
      });
    }

    if (mech.engineRating % 5 !== 0) {
      errors.push({
        code: 'INVALID_ENGINE_RATING',
        message: `Engine rating ${mech.engineRating} must be a multiple of 5`,
        severity: ValidationSeverity.ERROR,
        field: 'engineRating',
      });
    }

    return errors;
  }

  /**
   * Validate heat sink count
   */
  private validateHeatSinks(mech: IEditableMech): IValidationError[] {
    const errors: IValidationError[] = [];

    if (mech.heatSinkCount < 10) {
      errors.push({
        code: 'INSUFFICIENT_HEAT_SINKS',
        message: `Mech must have at least 10 heat sinks (has ${mech.heatSinkCount})`,
        severity: ValidationSeverity.ERROR,
        field: 'heatSinkCount',
      });
    }

    return errors;
  }

  /**
   * Check if equipment can be added to a location
   */
  canAddEquipment(mech: IEditableMech, equipmentId: string, location: string): boolean {
    // Simplified check - just verify slots available
    const locationEquipment = mech.equipment.filter(e => e.location === location);
    const maxSlots: Record<string, number> = {
      head: 6,
      centerTorso: 12,
      leftTorso: 12,
      rightTorso: 12,
      leftArm: 12,
      rightArm: 12,
      leftLeg: 6,
      rightLeg: 6,
    };
    
    const max = maxSlots[location] || 12;
    return locationEquipment.length < max;
  }

  // ============================================================================
  // HELPER CALCULATIONS
  // ============================================================================

  private calculateEngineWeight(rating: number, type: string): number {
    // Simplified engine weight table
    const baseWeight = Math.ceil(rating * rating / 2000);
    
    switch (type) {
      case 'XL':
      case 'XL (Clan)':
        return baseWeight * 0.5;
      case 'Light':
        return baseWeight * 0.75;
      case 'Compact':
        return baseWeight * 1.5;
      default:
        return baseWeight;
    }
  }

  private calculateArmorWeight(armor: IEditableMech['armorAllocation']): number {
    const totalPoints = 
      armor.head +
      armor.centerTorso + armor.centerTorsoRear +
      armor.leftTorso + armor.leftTorsoRear +
      armor.rightTorso + armor.rightTorsoRear +
      armor.leftArm + armor.rightArm +
      armor.leftLeg + armor.rightLeg;
    
    // Standard armor: 16 points per ton
    return Math.ceil(totalPoints / 16 * 2) / 2; // Round to 0.5 tons
  }
}

// Singleton instance
export const validationService = new ValidationService();

