/**
 * Armor Calculations Tests
 * 
 * Tests for armor weight, points, and allocation calculations.
 * 
 * @spec openspec/specs/armor-system/spec.md
 */

import {
  MAX_HEAD_ARMOR,
  getMaxArmorForLocation,
  getMaxTotalArmor,
  calculateArmorWeight,
  calculateArmorPoints,
  getArmorCriticalSlots,
  validateLocationArmor,
  getRecommendedArmorDistribution,
  calculateArmorCost,
} from '@/utils/construction/armorCalculations';
import { ArmorTypeEnum } from '@/types/construction/ArmorType';

// Import custom assertions
import '@/__tests__/helpers/assertions';

describe('Armor Calculations', () => {
  // ============================================================================
  // Constants
  // ============================================================================
  describe('Constants', () => {
    it('MAX_HEAD_ARMOR should be 9', () => {
      expect(MAX_HEAD_ARMOR).toBe(9);
    });
  });

  // ============================================================================
  // getMaxArmorForLocation
  // ============================================================================
  describe('getMaxArmorForLocation', () => {
    // From armor-system/spec.md:
    // Maximum armor: 2× structure (head = 9)
    
    describe('head armor', () => {
      it.each([20, 50, 75, 100])(
        'head max armor is 9 for %d ton mech',
        (tonnage) => {
          expect(getMaxArmorForLocation(tonnage, 'head')).toBe(9);
          expect(getMaxArmorForLocation(tonnage, 'HEAD')).toBe(9);
          expect(getMaxArmorForLocation(tonnage, 'Head')).toBe(9);
        }
      );
    });

    describe('other locations (2× structure)', () => {
      // Using structure point table values
      // 50 ton mech structure: CT=16, ST=12, Arms=8, Legs=12
      it.each([
        [50, 'centerTorso', 32],   // 16 × 2 = 32
        [50, 'leftTorso', 24],     // 12 × 2 = 24
        [50, 'rightTorso', 24],    // 12 × 2 = 24
        [50, 'leftArm', 16],       // 8 × 2 = 16
        [50, 'rightArm', 16],      // 8 × 2 = 16
        [50, 'leftLeg', 24],       // 12 × 2 = 24
        [50, 'rightLeg', 24],      // 12 × 2 = 24
      ])('%d ton mech %s max armor = %d', (tonnage, location, expected) => {
        expect(getMaxArmorForLocation(tonnage, location)).toBe(expected);
      });
    });

    describe('tonnage scaling', () => {
      // Light mechs have less structure, so less max armor
      it('light mech has less max armor than assault mech', () => {
        const lightCT = getMaxArmorForLocation(20, 'centerTorso');
        const assaultCT = getMaxArmorForLocation(100, 'centerTorso');
        expect(lightCT).toBeLessThan(assaultCT);
      });
    });
  });

  // ============================================================================
  // getMaxTotalArmor
  // ============================================================================
  describe('getMaxTotalArmor', () => {
    it('should calculate total of all locations', () => {
      const tonnage = 50;
      const total = getMaxTotalArmor(tonnage);
      
      // Manual calculation: 9 + 32 + 24 + 24 + 16 + 16 + 24 + 24 = 169
      // (head + CT + LT + RT + LA + RA + LL + RL)
      expect(total).toBeGreaterThan(0);
      expect(total).toBe(
        9 + // head
        getMaxArmorForLocation(tonnage, 'centerTorso') +
        getMaxArmorForLocation(tonnage, 'leftTorso') +
        getMaxArmorForLocation(tonnage, 'rightTorso') +
        getMaxArmorForLocation(tonnage, 'leftArm') +
        getMaxArmorForLocation(tonnage, 'rightArm') +
        getMaxArmorForLocation(tonnage, 'leftLeg') +
        getMaxArmorForLocation(tonnage, 'rightLeg')
      );
    });

    it('total increases with tonnage', () => {
      expect(getMaxTotalArmor(20)).toBeLessThan(getMaxTotalArmor(50));
      expect(getMaxTotalArmor(50)).toBeLessThan(getMaxTotalArmor(75));
      expect(getMaxTotalArmor(75)).toBeLessThan(getMaxTotalArmor(100));
    });
  });

  // ============================================================================
  // calculateArmorWeight
  // ============================================================================
  describe('calculateArmorWeight', () => {
    // From armor-system/spec.md:
    // - Standard (16 pts/ton, 0 slots)
    // - Ferro-Fibrous IS (17.92 pts/ton, 14 slots)
    // - Ferro-Fibrous Clan (19.2 pts/ton, 7 slots)
    
    describe('Standard Armor (16 pts/ton)', () => {
      it.each([
        [16, 1],     // 16 / 16 = 1 ton
        [32, 2],     // 32 / 16 = 2 tons
        [160, 10],   // 160 / 16 = 10 tons
        [17, 1.5],   // 17 / 16 = 1.0625 → ceil to 1.5
        [100, 6.5],  // 100 / 16 = 6.25 → ceil to 6.5
      ])('%d points = %s tons', (points, expected) => {
        expect(calculateArmorWeight(points, ArmorTypeEnum.STANDARD)).toBe(expected);
      });
    });

    describe('Ferro-Fibrous IS (17.92 pts/ton)', () => {
      it('should give more points per ton than standard', () => {
        const points = 100;
        const standardWeight = calculateArmorWeight(points, ArmorTypeEnum.STANDARD);
        const ferroWeight = calculateArmorWeight(points, ArmorTypeEnum.FERRO_FIBROUS_IS);
        
        expect(ferroWeight).toBeLessThan(standardWeight);
      });
    });
  });

  // ============================================================================
  // calculateArmorPoints
  // ============================================================================
  describe('calculateArmorPoints', () => {
    describe('Standard Armor (16 pts/ton)', () => {
      it.each([
        [1, 16],     // 1 ton = 16 points
        [5, 80],     // 5 tons = 80 points
        [10, 160],   // 10 tons = 160 points
        [0.5, 8],    // 0.5 tons = 8 points
      ])('%s tons = %d points', (tons, expected) => {
        expect(calculateArmorPoints(tons, ArmorTypeEnum.STANDARD)).toBe(expected);
      });
    });

    describe('Ferro-Fibrous (more pts/ton)', () => {
      it('should give more points per ton than standard', () => {
        const tons = 5;
        const standardPoints = calculateArmorPoints(tons, ArmorTypeEnum.STANDARD);
        const ferroPoints = calculateArmorPoints(tons, ArmorTypeEnum.FERRO_FIBROUS_IS);
        
        expect(ferroPoints).toBeGreaterThan(standardPoints);
      });
    });
  });

  // ============================================================================
  // getArmorCriticalSlots
  // ============================================================================
  describe('getArmorCriticalSlots', () => {
    // From armor-system/spec.md:
    // - Standard: 0 slots
    // - Ferro-Fibrous IS: 14 slots
    // - Ferro-Fibrous Clan: 7 slots
    it.each([
      [ArmorTypeEnum.STANDARD, 0],
      [ArmorTypeEnum.FERRO_FIBROUS_IS, 14],
      [ArmorTypeEnum.FERRO_FIBROUS_CLAN, 7],
      [ArmorTypeEnum.LIGHT_FERRO, 7],
      [ArmorTypeEnum.HEAVY_FERRO, 21],
    ])('%s uses %d critical slots', (armorType, expected) => {
      expect(getArmorCriticalSlots(armorType)).toBe(expected);
    });
  });

  // ============================================================================
  // validateLocationArmor
  // ============================================================================
  describe('validateLocationArmor', () => {
    describe('valid allocations', () => {
      it('should accept armor within limits', () => {
        const result = validateLocationArmor(50, 'centerTorso', 20, 8);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should accept max armor for head', () => {
        const result = validateLocationArmor(50, 'head', 9, 0);
        expect(result.isValid).toBe(true);
      });

      it('should accept torso rear armor', () => {
        const result = validateLocationArmor(50, 'leftTorso', 16, 8);
        expect(result.isValid).toBe(true);
      });
    });

    describe('invalid allocations', () => {
      it('should reject armor exceeding maximum', () => {
        const result = validateLocationArmor(50, 'head', 12, 0);
        expect(result.isValid).toBe(false);
        expect(result.errors[0]).toContain('exceeds maximum');
      });

      it('should reject negative front armor', () => {
        const result = validateLocationArmor(50, 'centerTorso', -5, 0);
        expect(result.isValid).toBe(false);
        expect(result.errors[0]).toContain('cannot be negative');
      });

      it('should reject rear armor on non-torso locations', () => {
        const result = validateLocationArmor(50, 'leftArm', 10, 5);
        expect(result.isValid).toBe(false);
        expect(result.errors[0]).toContain('does not support rear armor');
      });
    });
  });

  // ============================================================================
  // getRecommendedArmorDistribution
  // ============================================================================
  describe('getRecommendedArmorDistribution', () => {
    it('should return distribution totaling 100%', () => {
      const distribution = getRecommendedArmorDistribution();
      const total = Object.values(distribution).reduce((sum, val) => sum + val, 0);
      expect(total).toBeCloseTo(1.0, 2);
    });

    it('should prioritize center torso', () => {
      const distribution = getRecommendedArmorDistribution();
      expect(distribution.centerTorso).toBeGreaterThan(distribution.leftArm);
      expect(distribution.centerTorso).toBeGreaterThan(distribution.head);
    });
  });

  // ============================================================================
  // calculateArmorCost
  // ============================================================================
  describe('calculateArmorCost', () => {
    it('should calculate base cost for standard armor', () => {
      const points = 100;
      const cost = calculateArmorCost(points, ArmorTypeEnum.STANDARD);
      // Base cost is 10,000 C-Bills per point
      expect(cost).toBe(1000000); // 100 × 10000
    });

    it('advanced armor should cost more', () => {
      const points = 100;
      const standardCost = calculateArmorCost(points, ArmorTypeEnum.STANDARD);
      const ferroCost = calculateArmorCost(points, ArmorTypeEnum.FERRO_FIBROUS_IS);
      
      expect(ferroCost).toBeGreaterThanOrEqual(standardCost);
    });
  });
});

