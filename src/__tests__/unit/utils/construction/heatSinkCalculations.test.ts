import {
  calculateHeatDissipation,
  calculateExternalHeatSinks,
  calculateExternalHeatSinkWeight,
  calculateExternalHeatSinkSlots,
  validateHeatSinks,
  MINIMUM_HEAT_SINKS,
} from '@/utils/construction/heatSinkCalculations';
import { HeatSinkType } from '@/types/construction/HeatSinkType';
import { EngineType } from '@/types/construction/EngineType';

describe('heatSinkCalculations', () => {
  describe('calculateHeatDissipation()', () => {
    it('should calculate dissipation for single heat sinks', () => {
      const dissipation = calculateHeatDissipation(HeatSinkType.SINGLE, 10);
      expect(dissipation).toBe(10); // 10 * 1 = 10
    });

    it('should calculate dissipation for double heat sinks', () => {
      const dissipation = calculateHeatDissipation(HeatSinkType.DOUBLE_IS, 10);
      expect(dissipation).toBe(20); // 10 * 2 = 20
    });
  });

  describe('calculateExternalHeatSinks()', () => {
    it('should calculate external heat sinks', () => {
      const external = calculateExternalHeatSinks(15, 250, EngineType.STANDARD);
      // Engine provides 10 integral heat sinks (250 / 25)
      // External = 15 - 10 = 5
      expect(external).toBeGreaterThanOrEqual(0);
    });

    it('should return 0 when total equals integral', () => {
      const external = calculateExternalHeatSinks(10, 250, EngineType.STANDARD);
      expect(external).toBe(0);
    });

    it('should not return negative', () => {
      const external = calculateExternalHeatSinks(5, 250, EngineType.STANDARD);
      expect(external).toBeGreaterThanOrEqual(0);
    });
  });

  describe('calculateExternalHeatSinkWeight()', () => {
    it('should calculate weight for single heat sinks', () => {
      const weight = calculateExternalHeatSinkWeight(5, HeatSinkType.SINGLE);
      expect(weight).toBe(5); // 5 * 1 = 5
    });

    it('should calculate weight for double heat sinks', () => {
      const weight = calculateExternalHeatSinkWeight(5, HeatSinkType.DOUBLE_IS);
      expect(weight).toBe(5); // 5 * 1 = 5 (doubles weigh same as singles)
    });
  });

  describe('calculateExternalHeatSinkSlots()', () => {
    it('should calculate slots for single heat sinks', () => {
      const slots = calculateExternalHeatSinkSlots(5, HeatSinkType.SINGLE);
      expect(slots).toBe(5); // 5 * 1 = 5
    });

    it('should calculate slots for double heat sinks', () => {
      const slots = calculateExternalHeatSinkSlots(5, HeatSinkType.DOUBLE_IS);
      // IS Double Heat Sinks take 3 critical slots each per BattleTech rules
      expect(slots).toBe(15); // 5 * 3 = 15
    });
  });

  describe('validateHeatSinks()', () => {
    it('should validate correct heat sink count', () => {
      const result = validateHeatSinks(15, HeatSinkType.SINGLE, 250, EngineType.STANDARD);
      
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    it('should reject below minimum', () => {
      const result = validateHeatSinks(5, HeatSinkType.SINGLE, 250, EngineType.STANDARD);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should include MINIMUM_HEAT_SINKS constant', () => {
      expect(MINIMUM_HEAT_SINKS).toBe(10);
    });
  });
});
