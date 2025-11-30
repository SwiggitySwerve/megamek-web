/**
 * Calculation Service
 * 
 * Computes derived values for mech builds.
 * 
 * @spec openspec/specs/construction-services/spec.md
 */

import { IEditableMech } from './MechBuilderService';

/**
 * Mech totals summary
 */
export interface IMechTotals {
  readonly totalWeight: number;
  readonly remainingWeight: number;
  readonly maxWeight: number;
  readonly totalArmorPoints: number;
  readonly maxArmorPoints: number;
  readonly usedCriticalSlots: number;
  readonly totalCriticalSlots: number;
}

/**
 * Heat profile analysis
 */
export interface IHeatProfile {
  readonly heatGenerated: number;
  readonly heatDissipated: number;
  readonly netHeat: number;
  readonly alphaStrikeHeat: number;
}

/**
 * Movement profile
 */
export interface IMovementProfile {
  readonly walkMP: number;
  readonly runMP: number;
  readonly jumpMP: number;
  readonly sprintMP?: number;
}

/**
 * Calculation service interface
 */
export interface ICalculationService {
  calculateTotals(mech: IEditableMech): IMechTotals;
  calculateBattleValue(mech: IEditableMech): number;
  calculateCost(mech: IEditableMech): number;
  calculateHeatProfile(mech: IEditableMech): IHeatProfile;
  calculateMovement(mech: IEditableMech): IMovementProfile;
}

/**
 * Calculation Service implementation
 */
export class CalculationService implements ICalculationService {

  /**
   * Calculate all totals for a mech
   */
  calculateTotals(mech: IEditableMech): IMechTotals {
    const weights = this.calculateComponentWeights(mech);
    const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);

    const armorPoints = this.calculateTotalArmorPoints(mech);
    const maxArmorPoints = this.calculateMaxArmorPoints(mech.tonnage);

    const usedSlots = mech.equipment.length;
    const totalSlots = 78; // Standard mech has 78 critical slots

    return {
      totalWeight,
      remainingWeight: mech.tonnage - totalWeight,
      maxWeight: mech.tonnage,
      totalArmorPoints: armorPoints,
      maxArmorPoints,
      usedCriticalSlots: usedSlots,
      totalCriticalSlots: totalSlots,
    };
  }

  /**
   * Calculate Battle Value
   */
  calculateBattleValue(mech: IEditableMech): number {
    // Simplified BV calculation
    // Actual BV is much more complex
    const baseBV = mech.tonnage * 10;
    const movementBonus = mech.walkMP * 5;
    const armorBonus = this.calculateTotalArmorPoints(mech) * 0.5;
    
    return Math.round(baseBV + movementBonus + armorBonus);
  }

  /**
   * Calculate C-Bill cost
   */
  calculateCost(mech: IEditableMech): number {
    // Simplified cost calculation
    const baseCost = mech.tonnage * 10000;
    const engineCost = mech.engineRating * 1000;
    
    let multiplier = 1.0;
    if (mech.engineType.includes('XL')) {
      multiplier = 2.0;
    } else if (mech.engineType.includes('Light')) {
      multiplier = 1.5;
    }

    return Math.round((baseCost + engineCost) * multiplier);
  }

  /**
   * Calculate heat profile
   */
  calculateHeatProfile(mech: IEditableMech): IHeatProfile {
    // Calculate heat dissipation
    const heatSinkCapacity = mech.heatSinkType.includes('Double') ? 2 : 1;
    const heatDissipated = mech.heatSinkCount * heatSinkCapacity;

    // TODO: Calculate heat generated from weapons
    const heatGenerated = 0;
    const alphaStrikeHeat = 0;

    return {
      heatGenerated,
      heatDissipated,
      netHeat: heatGenerated - heatDissipated,
      alphaStrikeHeat,
    };
  }

  /**
   * Calculate movement profile
   */
  calculateMovement(mech: IEditableMech): IMovementProfile {
    const walkMP = mech.walkMP;
    const runMP = Math.floor(walkMP * 1.5);
    
    // TODO: Calculate jump MP from equipment
    const jumpMP = 0;

    return {
      walkMP,
      runMP,
      jumpMP,
    };
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private calculateComponentWeights(mech: IEditableMech): Record<string, number> {
    return {
      structure: mech.tonnage * 0.1, // 10% for standard
      engine: this.calculateEngineWeight(mech.engineRating, mech.engineType),
      gyro: Math.ceil(mech.engineRating / 100),
      cockpit: 3,
      armor: this.calculateArmorWeight(mech),
      heatSinks: Math.max(0, mech.heatSinkCount - 10),
    };
  }

  private calculateEngineWeight(rating: number, type: string): number {
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

  private calculateArmorWeight(mech: IEditableMech): number {
    const totalPoints = this.calculateTotalArmorPoints(mech);
    return Math.ceil(totalPoints / 16 * 2) / 2;
  }

  private calculateTotalArmorPoints(mech: IEditableMech): number {
    const a = mech.armorAllocation;
    return (
      a.head +
      a.centerTorso + a.centerTorsoRear +
      a.leftTorso + a.leftTorsoRear +
      a.rightTorso + a.rightTorsoRear +
      a.leftArm + a.rightArm +
      a.leftLeg + a.rightLeg
    );
  }

  private calculateMaxArmorPoints(tonnage: number): number {
    // Simplified: actual max depends on internal structure
    return tonnage * 4 + 9; // Head gets 9 max
  }
}

// Singleton instance
export const calculationService = new CalculationService();

