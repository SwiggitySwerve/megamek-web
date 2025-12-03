/**
 * Heat Sink Calculations Tests
 * 
 * Tests for heat dissipation and heat sink placement.
 * 
 * @spec openspec/specs/heat-sink-system/spec.md
 */

import {
  MINIMUM_HEAT_SINKS,
  calculateHeatDissipation,
  calculateExternalHeatSinks,
  calculateExternalHeatSinkWeight,
  calculateExternalHeatSinkSlots,
  validateHeatSinks,
  getHeatSinkSummary,
} from '@/utils/construction/heatSinkCalculations';
import { HeatSinkType } from '@/types/construction/HeatSinkType';
import { EngineType } from '@/types/construction/EngineType';

// Import custom assertions
import '@/__tests__/helpers/assertions';

describe('Heat Sink Calculations', () => {
  // ============================================================================
  // Constants
  // ============================================================================
  describe('Constants', () => {
    it('MINIMUM_HEAT_SINKS should be 10', () => {
      expect(MINIMUM_HEAT_SINKS).toBe(10);
    });
  });

  // ============================================================================
  // calculateHeatDissipation
  // ============================================================================
  describe('calculateHeatDissipation', () => {
    // From heat-sink-system/spec.md:
    // - Single (1 heat/turn)
    // - Double IS (2 heat/turn)
    // - Double Clan (2 heat/turn)
    
    describe('Single Heat Sinks', () => {
      it.each([
        [10, 10],
        [12, 12],
        [15, 15],
        [20, 20],
      ])('%d single heat sinks = %d dissipation', (count, expected) => {
        expect(calculateHeatDissipation(HeatSinkType.SINGLE, count)).toBe(expected);
      });
    });

    describe('Double Heat Sinks', () => {
      it.each([
        [10, 20],   // 10 × 2 = 20
        [12, 24],
        [15, 30],
      ])('%d double heat sinks = %d dissipation', (count, expected) => {
        expect(calculateHeatDissipation(HeatSinkType.DOUBLE_IS, count)).toBe(expected);
        expect(calculateHeatDissipation(HeatSinkType.DOUBLE_CLAN, count)).toBe(expected);
      });
    });
  });

  // ============================================================================
  // calculateExternalHeatSinks
  // ============================================================================
  describe('calculateExternalHeatSinks', () => {
    // External = total - integrated
    // Integrated = min(10, floor(rating/25))
    
    describe('with Standard Fusion engine', () => {
      it.each([
        [10, 250, 0],    // 10 - 10 = 0 (all integrated)
        [12, 250, 2],    // 12 - 10 = 2 external
        [15, 250, 5],    // 15 - 10 = 5 external
        [10, 100, 6],    // 10 - 4 = 6 external (rating 100 = 4 integrated)
        [10, 200, 2],    // 10 - 8 = 2 external (rating 200 = 8 integrated)
      ])('%d total with rating %d = %d external', (total, rating, expected) => {
        expect(calculateExternalHeatSinks(total, rating, EngineType.STANDARD)).toBe(expected);
      });
    });

    describe('with non-fusion engine', () => {
      it('ICE engine has no integrated heat sinks', () => {
        // ICE doesn't support integral heat sinks
        expect(calculateExternalHeatSinks(10, 200, EngineType.ICE)).toBe(10);
      });
    });

    describe('edge cases', () => {
      it('should never return negative', () => {
        // If total is less than integrated (shouldn't happen, but edge case)
        expect(calculateExternalHeatSinks(5, 300, EngineType.STANDARD)).toBe(0);
      });
    });
  });

  // ============================================================================
  // calculateExternalHeatSinkWeight
  // ============================================================================
  describe('calculateExternalHeatSinkWeight', () => {
    describe('Single Heat Sinks', () => {
      // Single heat sinks weigh 1 ton each
      it.each([
        [1, 1],
        [5, 5],
        [10, 10],
      ])('%d external = %d tons', (count, expected) => {
        expect(calculateExternalHeatSinkWeight(count, HeatSinkType.SINGLE)).toBe(expected);
      });
    });

    describe('Double Heat Sinks', () => {
      // Double heat sinks also weigh 1 ton each
      it.each([
        [1, 1],
        [5, 5],
        [10, 10],
      ])('%d external = %d tons', (count, expected) => {
        expect(calculateExternalHeatSinkWeight(count, HeatSinkType.DOUBLE_IS)).toBe(expected);
      });
    });
  });

  // ============================================================================
  // calculateExternalHeatSinkSlots
  // ============================================================================
  describe('calculateExternalHeatSinkSlots', () => {
    // From heat-sink-system/spec.md:
    // - Single: 1 slot each
    // - Double IS: 3 slots each (external)
    // - Double Clan: 2 slots each (external)
    
    describe('Single Heat Sinks', () => {
      it.each([
        [1, 1],
        [5, 5],
        [10, 10],
      ])('%d external = %d slots', (count, expected) => {
        expect(calculateExternalHeatSinkSlots(count, HeatSinkType.SINGLE)).toBe(expected);
      });
    });

    describe('Double Heat Sinks IS', () => {
      it.each([
        [1, 3],    // 1 × 3 = 3 slots
        [5, 15],   // 5 × 3 = 15 slots
        [10, 30],  // 10 × 3 = 30 slots
      ])('%d external = %d slots', (count, expected) => {
        expect(calculateExternalHeatSinkSlots(count, HeatSinkType.DOUBLE_IS)).toBe(expected);
      });
    });

    describe('Double Heat Sinks Clan', () => {
      it.each([
        [1, 2],    // 1 × 2 = 2 slots
        [5, 10],   // 5 × 2 = 10 slots
        [10, 20],  // 10 × 2 = 20 slots
      ])('%d external = %d slots', (count, expected) => {
        expect(calculateExternalHeatSinkSlots(count, HeatSinkType.DOUBLE_CLAN)).toBe(expected);
      });
    });
  });

  // ============================================================================
  // validateHeatSinks
  // ============================================================================
  describe('validateHeatSinks', () => {
    describe('valid configurations', () => {
      it('should accept minimum 10 heat sinks', () => {
        const result = validateHeatSinks(10, HeatSinkType.SINGLE, 200, EngineType.STANDARD);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should accept more than minimum', () => {
        const result = validateHeatSinks(15, HeatSinkType.DOUBLE_IS, 300, EngineType.STANDARD);
        expect(result.isValid).toBe(true);
      });
    });

    describe('invalid configurations', () => {
      it('should reject fewer than 10 heat sinks', () => {
        const result = validateHeatSinks(8, HeatSinkType.SINGLE, 200, EngineType.STANDARD);
        expect(result.isValid).toBe(false);
        expect(result.errors[0]).toContain('Minimum 10 heat sinks required');
      });
    });

    describe('warnings', () => {
      it('should warn about excessive external heat sinks', () => {
        const result = validateHeatSinks(35, HeatSinkType.SINGLE, 100, EngineType.STANDARD);
        // 35 - 4 integrated = 31 external (over 20 threshold)
        expect(result.warnings.length).toBeGreaterThan(0);
        expect(result.warnings[0]).toContain('Large number of external heat sinks');
      });
    });
  });

  // ============================================================================
  // getHeatSinkSummary
  // ============================================================================
  describe('getHeatSinkSummary', () => {
    it('should calculate complete heat sink summary', () => {
      const summary = getHeatSinkSummary(12, HeatSinkType.DOUBLE_IS, 200, EngineType.STANDARD);
      
      // Rating 200: floor(200/25) = 8 integrated
      expect(summary.integrated).toBe(8);
      expect(summary.external).toBe(4);  // 12 - 8 = 4
      expect(summary.weight).toBe(4);     // 4 × 1 ton
      expect(summary.slots).toBe(12);     // 4 × 3 slots (Double IS)
      expect(summary.dissipation).toBe(24); // 12 × 2
    });

    it('should handle all integrated heat sinks', () => {
      const summary = getHeatSinkSummary(10, HeatSinkType.SINGLE, 300, EngineType.STANDARD);
      
      // Rating 300: floor(300/25) = 12 integrated (no cap)
      // 10 total HS, 12 capacity, so all 10 are integrated
      expect(summary.integrated).toBe(12);
      expect(summary.external).toBe(0); // 10 - 12 = -2, clamped to 0
      expect(summary.weight).toBe(0);
      expect(summary.slots).toBe(0);
      expect(summary.dissipation).toBe(10);
    });

    it('should handle non-fusion engine', () => {
      const summary = getHeatSinkSummary(10, HeatSinkType.SINGLE, 200, EngineType.ICE);
      
      // ICE: 0 integrated
      expect(summary.integrated).toBe(0);
      expect(summary.external).toBe(10);
      expect(summary.weight).toBe(10);
      expect(summary.slots).toBe(10);
    });
  });

  // ============================================================================
  // Heat Sink Comparison
  // ============================================================================
  describe('Heat Sink Comparison', () => {
    it('Double heat sinks provide more dissipation for same count', () => {
      const count = 10;
      const singleDissipation = calculateHeatDissipation(HeatSinkType.SINGLE, count);
      const doubleDissipation = calculateHeatDissipation(HeatSinkType.DOUBLE_IS, count);
      
      expect(doubleDissipation).toBe(singleDissipation * 2);
    });

    it('Clan double heat sinks use fewer slots than IS double', () => {
      const count = 5;
      const isSlots = calculateExternalHeatSinkSlots(count, HeatSinkType.DOUBLE_IS);
      const clanSlots = calculateExternalHeatSinkSlots(count, HeatSinkType.DOUBLE_CLAN);
      
      expect(clanSlots).toBeLessThan(isSlots);
    });
  });
});

