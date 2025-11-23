/**
 * WeaponRulesValidator - BattleTech weapon validation rules
 * 
 * Extracted from ConstructionRulesValidator as part of large file refactoring.
 * Handles weapon validation logic.
 * 
 * @see IMPLEMENTATION_REFERENCE.md for architectural patterns
 */

import { UnitConfiguration } from '../../utils/criticalSlots/UnitCriticalManagerTypes';
import { EquipmentObject } from '../../utils/criticalSlots/CriticalSlot';

export interface WeaponValidation {
  isValid: boolean;
  violations: WeaponViolation[];
  recommendations: string[];
  weaponCount: number;
  totalDamage: number;
  totalHeat: number;
}

export interface WeaponViolation {
  type: 'invalid_location' | 'ammo_missing' | 'invalid_weight' | 'invalid_slots';
  message: string;
  severity: 'critical' | 'major' | 'minor';
  suggestedFix: string;
  equipmentId?: string;
}

export class WeaponRulesValidator {
  
  /**
   * Validate weapon rules for a unit configuration
   */
  static validateWeaponRules(config: UnitConfiguration, equipmentList: EquipmentObject[]): WeaponValidation {
    const violations: WeaponViolation[] = [];
    const recommendations: string[] = [];
    
    let totalDamage = 0;
    let totalHeat = 0;
    let weaponCount = 0;

    equipmentList.forEach(eq => {
      if (eq.type === 'weapon') {
        weaponCount++;
        
        if (eq.damage) {
          totalDamage += Number(eq.damage);
        }
        
        if (eq.heat) {
          totalHeat += Number(eq.heat);
        }
        
        // Validation logic would go here
        // e.g., check ammo dependency if requiresAmmo is true
        // But EquipmentObject doesn't explicitly have requiresAmmo on base interface always
      }
    });

    return {
      isValid: violations.length === 0,
      violations,
      recommendations,
      weaponCount,
      totalDamage,
      totalHeat
    };
  }
}

export default WeaponRulesValidator;

