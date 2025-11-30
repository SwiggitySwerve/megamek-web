/**
 * Gyro Calculations Tests
 * 
 * Tests for gyro weight and slot calculations.
 * 
 * @spec openspec/specs/gyro-system/spec.md
 */

import {
  calculateGyroWeight,
  getGyroCriticalSlots,
  validateGyro,
  isGyroCompatibleWithCockpit,
} from '@/utils/construction/gyroCalculations';
import { GyroType } from '@/types/construction/GyroType';

// Import custom assertions
import '@/__tests__/helpers/assertions';

describe('Gyro Calculations', () => {
  // ============================================================================
  // calculateGyroWeight
  // ============================================================================
  describe('calculateGyroWeight', () => {
    // From gyro-system/spec.md:
    // - Standard (4 slots, 1.0× weight)
    // - XL (6 slots, 0.5× weight)
    // - Compact (2 slots, 1.5× weight)
    // - Heavy-Duty (4 slots, 2.0× weight)
    
    describe('Standard Gyro (1.0× weight)', () => {
      // Base weight = ceil(engineRating / 100)
      it.each([
        [100, 1],    // ceil(100/100) = 1 × 1.0 = 1
        [150, 2],    // ceil(150/100) = 2 × 1.0 = 2
        [200, 2],    // ceil(200/100) = 2 × 1.0 = 2
        [250, 3],    // ceil(250/100) = 3 × 1.0 = 3
        [300, 3],    // ceil(300/100) = 3 × 1.0 = 3
        [350, 4],    // ceil(350/100) = 4 × 1.0 = 4
        [400, 4],    // ceil(400/100) = 4 × 1.0 = 4
      ])('engine rating %d → gyro weight %s tons', (rating, expected) => {
        expect(calculateGyroWeight(rating, GyroType.STANDARD)).toBe(expected);
      });
    });

    describe('XL Gyro (0.5× weight)', () => {
      it.each([
        [100, 0.5],  // ceil(100/100) = 1 × 0.5 = 0.5
        [200, 1],    // ceil(200/100) = 2 × 0.5 = 1
        [300, 1.5],  // ceil(300/100) = 3 × 0.5 = 1.5
        [400, 2],    // ceil(400/100) = 4 × 0.5 = 2
      ])('engine rating %d → gyro weight %s tons', (rating, expected) => {
        expect(calculateGyroWeight(rating, GyroType.XL)).toBe(expected);
      });
    });

    describe('Compact Gyro (1.5× weight)', () => {
      it.each([
        [100, 1.5],  // ceil(100/100) = 1 × 1.5 = 1.5
        [200, 3],    // ceil(200/100) = 2 × 1.5 = 3
        [300, 4.5],  // ceil(300/100) = 3 × 1.5 = 4.5
      ])('engine rating %d → gyro weight %s tons', (rating, expected) => {
        expect(calculateGyroWeight(rating, GyroType.COMPACT)).toBe(expected);
      });
    });

    describe('Heavy-Duty Gyro (2.0× weight)', () => {
      it.each([
        [100, 2],    // ceil(100/100) = 1 × 2.0 = 2
        [200, 4],    // ceil(200/100) = 2 × 2.0 = 4
        [300, 6],    // ceil(300/100) = 3 × 2.0 = 6
      ])('engine rating %d → gyro weight %s tons', (rating, expected) => {
        expect(calculateGyroWeight(rating, GyroType.HEAVY_DUTY)).toBe(expected);
      });
    });

    describe('edge cases', () => {
      it('should return 0 for zero or negative engine rating', () => {
        expect(calculateGyroWeight(0, GyroType.STANDARD)).toBe(0);
        expect(calculateGyroWeight(-100, GyroType.STANDARD)).toBe(0);
      });
    });
  });

  // ============================================================================
  // getGyroCriticalSlots
  // ============================================================================
  describe('getGyroCriticalSlots', () => {
    // From gyro-system/spec.md:
    // - Standard (4 slots)
    // - XL (6 slots)
    // - Compact (2 slots)
    // - Heavy-Duty (4 slots)
    it.each([
      [GyroType.STANDARD, 4],
      [GyroType.XL, 6],
      [GyroType.COMPACT, 2],
      [GyroType.HEAVY_DUTY, 4],
    ])('%s uses %d critical slots', (gyroType, expected) => {
      expect(getGyroCriticalSlots(gyroType)).toBe(expected);
    });
  });

  // ============================================================================
  // validateGyro
  // ============================================================================
  describe('validateGyro', () => {
    describe('valid configurations', () => {
      it.each(Object.values(GyroType))('should validate %s with valid engine rating', (gyroType) => {
        const result = validateGyro(gyroType, 300);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    describe('invalid configurations', () => {
      it('should reject zero engine rating', () => {
        const result = validateGyro(GyroType.STANDARD, 0);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Engine rating must be greater than 0 for gyro calculation');
      });

      it('should reject negative engine rating', () => {
        const result = validateGyro(GyroType.STANDARD, -100);
        expect(result.isValid).toBe(false);
      });
    });
  });

  // ============================================================================
  // isGyroCompatibleWithCockpit
  // ============================================================================
  describe('isGyroCompatibleWithCockpit', () => {
    describe('compatibility checks', () => {
      it.each([
        [GyroType.STANDARD, 'Standard', true],
        [GyroType.XL, 'Standard', true],
        [GyroType.COMPACT, 'Standard', true],
        [GyroType.HEAVY_DUTY, 'Standard', true],
        [GyroType.STANDARD, 'Small', true],
        [GyroType.COMPACT, 'Small', true],
      ])('%s with %s cockpit = %s', (gyroType, cockpitType, expected) => {
        expect(isGyroCompatibleWithCockpit(gyroType, cockpitType)).toBe(expected);
      });
    });
  });

  // ============================================================================
  // Gyro weight comparison across types
  // ============================================================================
  describe('Gyro weight comparison', () => {
    it('XL gyro should be lightest', () => {
      const rating = 300;
      const standardWeight = calculateGyroWeight(rating, GyroType.STANDARD);
      const xlWeight = calculateGyroWeight(rating, GyroType.XL);
      
      expect(xlWeight).toBeLessThan(standardWeight);
    });

    it('Heavy-Duty gyro should be heaviest', () => {
      const rating = 300;
      const standardWeight = calculateGyroWeight(rating, GyroType.STANDARD);
      const heavyDutyWeight = calculateGyroWeight(rating, GyroType.HEAVY_DUTY);
      
      expect(heavyDutyWeight).toBeGreaterThan(standardWeight);
    });

    it('weight ordering: XL < Standard < Compact < Heavy-Duty', () => {
      const rating = 300;
      const weights = [
        calculateGyroWeight(rating, GyroType.XL),
        calculateGyroWeight(rating, GyroType.STANDARD),
        calculateGyroWeight(rating, GyroType.COMPACT),
        calculateGyroWeight(rating, GyroType.HEAVY_DUTY),
      ];
      
      for (let i = 1; i < weights.length; i++) {
        expect(weights[i]).toBeGreaterThanOrEqual(weights[i - 1]);
      }
    });
  });
});

