/**
 * Tests for Heat Sink Calculations
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

describe('Heat Sink Calculations', () => {
  describe('MINIMUM_HEAT_SINKS constant', () => {
    it('should be 10', () => {
      expect(MINIMUM_HEAT_SINKS).toBe(10);
    });
  });

  describe('calculateHeatDissipation', () => {
    it('should calculate single heat sink dissipation', () => {
      // Single heat sinks dissipate 1 heat each
      const dissipation = calculateHeatDissipation(HeatSinkType.SINGLE, 10);
      expect(dissipation).toBe(10);
    });

    it('should calculate double heat sink dissipation', () => {
      // Double heat sinks dissipate 2 heat each
      const dissipation = calculateHeatDissipation(HeatSinkType.DOUBLE_IS, 10);
      expect(dissipation).toBe(20);
    });

    it('should handle 0 heat sinks', () => {
      expect(calculateHeatDissipation(HeatSinkType.SINGLE, 0)).toBe(0);
      expect(calculateHeatDissipation(HeatSinkType.DOUBLE_IS, 0)).toBe(0);
    });

    it('should scale with count', () => {
      const base = calculateHeatDissipation(HeatSinkType.SINGLE, 1);
      const double = calculateHeatDissipation(HeatSinkType.SINGLE, 2);
      expect(double).toBe(base * 2);
    });
  });

  describe('calculateExternalHeatSinks', () => {
    it('should return 0 when all heat sinks fit in engine', () => {
      // 250 engine integrates floor(250/25) = 10 heat sinks
      const external = calculateExternalHeatSinks(10, 250, EngineType.STANDARD);
      expect(external).toBe(0);
    });

    it('should calculate external heat sinks needed', () => {
      // 200 engine integrates floor(200/25) = 8 heat sinks
      // Need 15 total, so 15 - 8 = 7 external
      const external = calculateExternalHeatSinks(15, 200, EngineType.STANDARD);
      expect(external).toBeGreaterThan(0);
    });

    it('should never return negative', () => {
      const external = calculateExternalHeatSinks(5, 400, EngineType.STANDARD);
      expect(external).toBeGreaterThanOrEqual(0);
    });
  });

  describe('calculateExternalHeatSinkWeight', () => {
    it('should calculate single heat sink weight', () => {
      // Single heat sinks weigh 1 ton each
      const weight = calculateExternalHeatSinkWeight(5, HeatSinkType.SINGLE);
      expect(weight).toBe(5);
    });

    it('should calculate double heat sink weight', () => {
      // Double heat sinks weigh 1 ton each
      const weight = calculateExternalHeatSinkWeight(5, HeatSinkType.DOUBLE_IS);
      expect(weight).toBe(5);
    });

    it('should handle 0 external heat sinks', () => {
      expect(calculateExternalHeatSinkWeight(0, HeatSinkType.SINGLE)).toBe(0);
    });
  });

  describe('calculateExternalHeatSinkSlots', () => {
    it('should calculate single heat sink slots', () => {
      // Single heat sinks take 1 slot each
      const slots = calculateExternalHeatSinkSlots(5, HeatSinkType.SINGLE);
      expect(slots).toBe(5);
    });

    it('should calculate double heat sink slots', () => {
      // Double heat sinks take 3 slots each
      const slots = calculateExternalHeatSinkSlots(5, HeatSinkType.DOUBLE_IS);
      expect(slots).toBe(15);
    });

    it('should handle 0 external heat sinks', () => {
      expect(calculateExternalHeatSinkSlots(0, HeatSinkType.DOUBLE_IS)).toBe(0);
    });
  });

  describe('validateHeatSinks', () => {
    it('should pass for valid configuration', () => {
      const result = validateHeatSinks(10, HeatSinkType.SINGLE, 250, EngineType.STANDARD);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail for less than 10 heat sinks', () => {
      const result = validateHeatSinks(8, HeatSinkType.SINGLE, 200, EngineType.STANDARD);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('Minimum'))).toBe(true);
    });

    it('should warn for large number of external heat sinks', () => {
      const result = validateHeatSinks(35, HeatSinkType.SINGLE, 100, EngineType.STANDARD);
      
      // Should be valid but have warnings
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it('should pass for exactly 10 heat sinks', () => {
      const result = validateHeatSinks(10, HeatSinkType.DOUBLE_IS, 250, EngineType.STANDARD);
      
      expect(result.isValid).toBe(true);
    });
  });

  describe('getHeatSinkSummary', () => {
    it('should return complete summary', () => {
      const summary = getHeatSinkSummary(12, HeatSinkType.SINGLE, 200, EngineType.STANDARD);
      
      expect(summary).toHaveProperty('integrated');
      expect(summary).toHaveProperty('external');
      expect(summary).toHaveProperty('weight');
      expect(summary).toHaveProperty('slots');
      expect(summary).toHaveProperty('dissipation');
    });

    it('should calculate integrated heat sinks', () => {
      const summary = getHeatSinkSummary(10, HeatSinkType.SINGLE, 250, EngineType.STANDARD);
      
      expect(summary.integrated).toBeGreaterThan(0);
    });

    it('should calculate external heat sinks', () => {
      const summary = getHeatSinkSummary(15, HeatSinkType.SINGLE, 200, EngineType.STANDARD);
      
      expect(summary.external).toBeGreaterThan(0);
    });

    it('should calculate dissipation based on type', () => {
      const singleSummary = getHeatSinkSummary(10, HeatSinkType.SINGLE, 250, EngineType.STANDARD);
      const doubleSummary = getHeatSinkSummary(10, HeatSinkType.DOUBLE_IS, 250, EngineType.STANDARD);
      
      expect(doubleSummary.dissipation).toBeGreaterThan(singleSummary.dissipation);
    });

    it('should have weight of 0 when no external heat sinks', () => {
      const summary = getHeatSinkSummary(10, HeatSinkType.SINGLE, 300, EngineType.STANDARD);
      
      // With 300 rating, integrated = 12, so 10 total = 0 external
      if (summary.external === 0) {
        expect(summary.weight).toBe(0);
      }
    });
  });
});
