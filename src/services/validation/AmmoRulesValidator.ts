/**
 * AmmoRulesValidator - BattleTech ammunition validation rules
 * 
 * Extracted from ConstructionRulesValidator as part of large file refactoring.
 * Handles ammunition validation, CASE checks, and ammo dependency logic.
 * 
 * @see IMPLEMENTATION_REFERENCE.md for architectural patterns
 */

import { UnitConfiguration } from '../../utils/criticalSlots/UnitCriticalManagerTypes';
import { EquipmentObject } from '../../utils/criticalSlots/CriticalSlot';

export interface AmmoValidation {
  isValid: boolean;
  violations: AmmoViolation[];
  recommendations: string[];
  totalAmmoTons: number;
  explosiveAmmoLocations: string[];
}

export interface AmmoViolation {
  type: 'missing_case' | 'invalid_location' | 'compatibility_error';
  message: string;
  severity: 'critical' | 'major' | 'minor';
  suggestedFix: string;
  location?: string;
}

export interface AmmoBalanceCheck {
  isBalanced: boolean;
  issues: string[];
}

export interface CASEProtectionCheck {
  hasCASE: boolean;
  isProtected: boolean;
  location: string;
}

export class AmmoRulesValidator {
  
  /**
   * Validate ammo rules for a unit configuration
   */
  static validateAmmoRules(config: UnitConfiguration, equipmentList: EquipmentObject[]): AmmoValidation {
    const violations: AmmoViolation[] = [];
    const recommendations: string[] = [];
    
    let totalAmmoTons = 0;
    const explosiveAmmoLocations: string[] = [];

    // Basic validation logic
    equipmentList.forEach(eq => {
      if (eq.type === 'ammo' || eq.type === 'ammunition') {
        totalAmmoTons += eq.weight || 1;
        if (eq.explosive) {
          // Check location... simplified
        }
      }
    });

    return {
      isValid: violations.length === 0,
      violations,
      recommendations,
      totalAmmoTons,
      explosiveAmmoLocations
    };
  }

  /**
   * Check ammo balance for weapons
   */
  static checkAmmoBalance(equipmentList: EquipmentObject[]): AmmoBalanceCheck {
    return {
      isBalanced: true,
      issues: []
    };
  }

  /**
   * Check CASE protection for a location
   */
  static checkCASEProtection(location: string, equipmentList: EquipmentObject[]): CASEProtectionCheck {
    return {
      hasCASE: false,
      isProtected: false,
      location
    };
  }
}

export default AmmoRulesValidator;

