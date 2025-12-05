import {
  validateEngineRating,
  getBaseEngineWeight,
  calculateEngineWeight,
  calculateEngineRating,
  calculateIntegralHeatSinks,
  getEngineCTSlots,
} from '@/utils/construction/engineCalculations';
import { EngineType } from '@/types/construction/EngineType';

describe('engineCalculations', () => {
  describe('validateEngineRating()', () => {
    it('should validate correct engine rating', () => {
      const result = validateEngineRating(250);
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    it('should reject non-integer ratings', () => {
      const result = validateEngineRating(250.5);
      expect(result.isValid).toBe(false);
    });

    it('should reject ratings below 10', () => {
      const result = validateEngineRating(5);
      expect(result.isValid).toBe(false);
    });

    it('should reject ratings above 500', () => {
      const result = validateEngineRating(505);
      expect(result.isValid).toBe(false);
    });

    it('should reject ratings not multiple of 5', () => {
      const result = validateEngineRating(251);
      expect(result.isValid).toBe(false);
    });
  });

  describe('getBaseEngineWeight()', () => {
    it('should return weight from table', () => {
      const weight = getBaseEngineWeight(250);
      expect(weight).toBe(12.5); // From table
    });

    it('should calculate weight for non-table values', () => {
      const weight = getBaseEngineWeight(255);
      expect(weight).toBeGreaterThan(0);
    });

    it('should return 0 for invalid rating', () => {
      const weight = getBaseEngineWeight(251);
      expect(weight).toBe(0);
    });
  });

  describe('calculateEngineWeight()', () => {
    it('should calculate standard engine weight', () => {
      const weight = calculateEngineWeight(250, EngineType.STANDARD);
      expect(weight).toBeGreaterThan(0);
    });

    it('should apply XL multiplier', () => {
      const standardWeight = calculateEngineWeight(250, EngineType.STANDARD);
      const xlWeight = calculateEngineWeight(250, EngineType.XL_IS);
      
      expect(xlWeight).toBeLessThan(standardWeight);
    });
  });

  describe('calculateEngineRating()', () => {
    it('should calculate engine rating from tonnage and walk MP', () => {
      const rating = calculateEngineRating(50, 5);
      expect(rating).toBe(250); // 50 * 5 = 250, rounded to nearest 5
    });

    it('should round to nearest multiple of 5', () => {
      const rating = calculateEngineRating(50, 4.7);
      expect(rating % 5).toBe(0);
    });
  });

  describe('calculateIntegralHeatSinks()', () => {
    it('should calculate integral heat sinks', () => {
      const sinks = calculateIntegralHeatSinks(250, EngineType.STANDARD);
      expect(sinks).toBe(10); // 250 / 25 = 10
    });

    it('should handle different engine types', () => {
      const standardSinks = calculateIntegralHeatSinks(250, EngineType.STANDARD);
      const xlSinks = calculateIntegralHeatSinks(250, EngineType.XL_IS);
      
      expect(xlSinks).toBeGreaterThanOrEqual(standardSinks);
    });
  });

  describe('getEngineCTSlots()', () => {
    it('should return CT slots for standard engine', () => {
      const slots = getEngineCTSlots(250, EngineType.STANDARD);
      expect(slots).toBeGreaterThan(0);
      expect(slots).toBeLessThanOrEqual(6);
    });

    it('should return CT slots based on rating', () => {
      const lowRatingSlots = getEngineCTSlots(100, EngineType.STANDARD);
      const highRatingSlots = getEngineCTSlots(400, EngineType.STANDARD);
      expect(highRatingSlots).toBeGreaterThanOrEqual(lowRatingSlots);
    });
  });
});
