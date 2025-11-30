/**
 * Movement Calculations Tests
 * 
 * Tests for movement point calculations and jump jet mechanics.
 * 
 * @spec openspec/specs/movement-system/spec.md
 */

import {
  calculateWalkMP,
} from '@/utils/construction/engineCalculations';

import {
  calculateRunMP,
  calculateSprintMP,
  calculateCombinedSprintMP,
  JumpJetType,
  getJumpJetDefinition,
  calculateJumpJetWeight,
  calculateJumpJetSlots,
  getMaxJumpMP,
  validateJumpConfiguration,
} from '@/utils/construction/movementCalculations';

// Import custom assertions
import '@/__tests__/helpers/assertions';

describe('Movement Calculations', () => {
  // ============================================================================
  // calculateWalkMP (from engineCalculations, re-exported)
  // ============================================================================
  describe('calculateWalkMP', () => {
    // From movement-system/spec.md:
    // Walk MP = floor(rating / tonnage)
    it.each([
      [160, 20, 8],   // Locust
      [200, 50, 4],   // Hunchback
      [300, 75, 4],   // Marauder
      [300, 100, 3],  // Atlas
      [375, 75, 5],   // Timber Wolf
      [400, 100, 4],  // Dire Wolf
    ])('rating %d / %d tons = %d walk MP', (rating, tonnage, expected) => {
      expect(calculateWalkMP(rating, tonnage)).toBe(expected);
    });
  });

  // ============================================================================
  // calculateRunMP
  // ============================================================================
  describe('calculateRunMP', () => {
    // From movement-system/spec.md:
    // Run MP = ceil(walk × 1.5)
    it.each([
      [1, 2],    // ceil(1.5) = 2
      [2, 3],    // ceil(3) = 3
      [3, 5],    // ceil(4.5) = 5
      [4, 6],    // ceil(6) = 6
      [5, 8],    // ceil(7.5) = 8
      [6, 9],    // ceil(9) = 9
      [8, 12],   // ceil(12) = 12
      [10, 15],  // ceil(15) = 15
    ])('walk %d = run %d', (walk, expected) => {
      expect(calculateRunMP(walk)).toBe(expected);
    });

    it('should return 0 for zero walk', () => {
      expect(calculateRunMP(0)).toBe(0);
    });

    it('should return 0 for negative walk', () => {
      expect(calculateRunMP(-1)).toBe(0);
    });
  });

  // ============================================================================
  // calculateSprintMP (MASC/Supercharger)
  // ============================================================================
  describe('calculateSprintMP', () => {
    // sprint = floor(walk × 2)
    it.each([
      [1, 2],
      [2, 4],
      [3, 6],
      [4, 8],
      [5, 10],
      [8, 16],
    ])('walk %d = sprint %d', (walk, expected) => {
      expect(calculateSprintMP(walk)).toBe(expected);
    });

    it('should return 0 for zero or negative walk', () => {
      expect(calculateSprintMP(0)).toBe(0);
      expect(calculateSprintMP(-1)).toBe(0);
    });
  });

  // ============================================================================
  // calculateCombinedSprintMP (MASC + Supercharger)
  // ============================================================================
  describe('calculateCombinedSprintMP', () => {
    // combined sprint = floor(walk × 2.5)
    it.each([
      [1, 2],    // floor(2.5) = 2
      [2, 5],    // floor(5) = 5
      [4, 10],   // floor(10) = 10
      [6, 15],   // floor(15) = 15
      [8, 20],   // floor(20) = 20
    ])('walk %d = combined sprint %d', (walk, expected) => {
      expect(calculateCombinedSprintMP(walk)).toBe(expected);
    });
  });

  // ============================================================================
  // Jump Jet Definitions
  // ============================================================================
  describe('getJumpJetDefinition', () => {
    it('should return definition for Standard jump jets', () => {
      const def = getJumpJetDefinition(JumpJetType.STANDARD);
      expect(def).toBeDefined();
      expect(def?.slotsPerJump).toBe(1);
    });

    it('should return definition for Improved jump jets', () => {
      const def = getJumpJetDefinition(JumpJetType.IMPROVED);
      expect(def).toBeDefined();
      expect(def?.slotsPerJump).toBe(2);
    });
  });

  // ============================================================================
  // calculateJumpJetWeight
  // ============================================================================
  describe('calculateJumpJetWeight', () => {
    describe('Standard Jump Jets', () => {
      // Weight varies by tonnage class:
      // <= 55 tons: 0.5 tons each
      // 56-85 tons: 1.0 tons each
      // > 85 tons: 2.0 tons each
      
      it.each([
        [20, 4, 2],    // Light: 4 × 0.5 = 2 tons
        [35, 6, 3],    // Light: 6 × 0.5 = 3 tons
        [50, 4, 2],    // Medium: 4 × 0.5 = 2 tons
        [55, 4, 2],    // Medium (boundary): 4 × 0.5 = 2 tons
        [60, 4, 4],    // Heavy: 4 × 1.0 = 4 tons
        [75, 5, 5],    // Heavy: 5 × 1.0 = 5 tons
        [85, 4, 4],    // Heavy (boundary): 4 × 1.0 = 4 tons
        [90, 4, 8],    // Assault: 4 × 2.0 = 8 tons
        [100, 3, 6],   // Assault: 3 × 2.0 = 6 tons
      ])('%d ton mech with %d jump = %d tons', (tonnage, jumpMP, expected) => {
        expect(calculateJumpJetWeight(tonnage, jumpMP, JumpJetType.STANDARD)).toBe(expected);
      });
    });

    describe('Improved Jump Jets', () => {
      // Weight is double standard
      it('Heavy mech with improved jets weighs more', () => {
        const tonnage = 75;
        const jumpMP = 4;
        const standardWeight = calculateJumpJetWeight(tonnage, jumpMP, JumpJetType.STANDARD);
        const improvedWeight = calculateJumpJetWeight(tonnage, jumpMP, JumpJetType.IMPROVED);
        
        expect(improvedWeight).toBeGreaterThan(standardWeight);
      });
    });
  });

  // ============================================================================
  // calculateJumpJetSlots
  // ============================================================================
  describe('calculateJumpJetSlots', () => {
    describe('Standard Jump Jets', () => {
      it.each([
        [1, 1],
        [4, 4],
        [6, 6],
      ])('%d jump = %d slots', (jumpMP, expected) => {
        expect(calculateJumpJetSlots(jumpMP, JumpJetType.STANDARD)).toBe(expected);
      });
    });

    describe('Improved Jump Jets', () => {
      // Improved uses 2 slots per jump
      it.each([
        [1, 2],
        [4, 8],
        [6, 12],
      ])('%d jump = %d slots', (jumpMP, expected) => {
        expect(calculateJumpJetSlots(jumpMP, JumpJetType.IMPROVED)).toBe(expected);
      });
    });
  });

  // ============================================================================
  // getMaxJumpMP
  // ============================================================================
  describe('getMaxJumpMP', () => {
    describe('Standard Jump Jets', () => {
      // Max jump = walk MP
      it.each([
        [4, 4],
        [6, 6],
        [8, 8],
      ])('walk %d = max jump %d', (walk, expected) => {
        expect(getMaxJumpMP(walk, JumpJetType.STANDARD)).toBe(expected);
      });
    });

    describe('Improved Jump Jets', () => {
      // Max jump = floor(walk × 1.5)
      it.each([
        [4, 6],    // floor(6) = 6
        [6, 9],    // floor(9) = 9
        [8, 12],   // floor(12) = 12
      ])('walk %d = max improved jump %d', (walk, expected) => {
        expect(getMaxJumpMP(walk, JumpJetType.IMPROVED)).toBe(expected);
      });
    });
  });

  // ============================================================================
  // validateJumpConfiguration
  // ============================================================================
  describe('validateJumpConfiguration', () => {
    describe('valid configurations', () => {
      it('should accept jump equal to walk', () => {
        const result = validateJumpConfiguration(4, 4, JumpJetType.STANDARD);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should accept jump less than walk', () => {
        const result = validateJumpConfiguration(4, 2, JumpJetType.STANDARD);
        expect(result.isValid).toBe(true);
      });

      it('should accept improved jump exceeding walk', () => {
        const result = validateJumpConfiguration(4, 6, JumpJetType.IMPROVED);
        expect(result.isValid).toBe(true);
      });
    });

    describe('invalid configurations', () => {
      it('should reject negative jump MP', () => {
        const result = validateJumpConfiguration(4, -1, JumpJetType.STANDARD);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Jump MP cannot be negative');
      });

      it('should reject jump exceeding maximum', () => {
        const result = validateJumpConfiguration(4, 5, JumpJetType.STANDARD);
        expect(result.isValid).toBe(false);
        expect(result.errors[0]).toContain('exceeds maximum');
      });
    });
  });

  // ============================================================================
  // Movement Profile Scenarios
  // ============================================================================
  describe('Movement Profiles', () => {
    it('should calculate correct profile for Locust (20 tons, rating 160)', () => {
      const walk = calculateWalkMP(160, 20);
      const run = calculateRunMP(walk);
      
      expect(walk).toBe(8);
      expect(run).toBe(12);
    });

    it('should calculate correct profile for Atlas (100 tons, rating 300)', () => {
      const walk = calculateWalkMP(300, 100);
      const run = calculateRunMP(walk);
      
      expect(walk).toBe(3);
      expect(run).toBe(5);
    });

    it('should calculate correct profile for Timber Wolf (75 tons, rating 375)', () => {
      const walk = calculateWalkMP(375, 75);
      const run = calculateRunMP(walk);
      
      expect(walk).toBe(5);
      expect(run).toBe(8);
    });
  });
});

