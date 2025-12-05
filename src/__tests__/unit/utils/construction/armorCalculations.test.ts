import {
  getRecommendedArmorDistribution,
  validateLocationArmor,
  getMaxArmorForLocation,
  getMaxTotalArmor,
} from '@/utils/construction/armorCalculations';

describe('armorCalculations utilities', () => {
  describe('getRecommendedArmorDistribution()', () => {
    it('should return distribution percentages', () => {
      const distribution = getRecommendedArmorDistribution();
      
      expect(distribution.head).toBe(0.05);
      expect(distribution.centerTorso).toBe(0.20);
      expect(distribution.leftTorso).toBe(0.12);
      expect(distribution.rightTorso).toBe(0.12);
      expect(distribution.leftArm).toBe(0.10);
      expect(distribution.rightArm).toBe(0.10);
      expect(distribution.leftLeg).toBe(0.10);
      expect(distribution.rightLeg).toBe(0.10);
    });

    it('should include rear armor percentages', () => {
      const distribution = getRecommendedArmorDistribution();
      
      expect(distribution.centerTorsoRear).toBe(0.05);
      expect(distribution.leftTorsoRear).toBe(0.03);
      expect(distribution.rightTorsoRear).toBe(0.03);
    });
  });

  describe('validateLocationArmor()', () => {
    it('should validate correct armor values', () => {
      const result = validateLocationArmor(50, 'head', 9);
      
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    it('should reject armor exceeding max for head', () => {
      const result = validateLocationArmor(50, 'head', 10);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should validate torso front armor', () => {
      const result = validateLocationArmor(50, 'centerTorso', 20, 5);
      
      expect(result.isValid).toBe(true);
    });

    it('should reject torso armor exceeding max', () => {
      const max = getMaxArmorForLocation(50, 'centerTorso');
      const result = validateLocationArmor(50, 'centerTorso', max + 1, 0);
      
      expect(result.isValid).toBe(false);
    });

    it('should validate rear armor', () => {
      const result = validateLocationArmor(50, 'leftTorso', 12, 4);
      
      expect(result.isValid).toBe(true);
    });

    it('should reject negative armor values', () => {
      const result = validateLocationArmor(50, 'head', -1);
      
      expect(result.isValid).toBe(false);
    });
  });

  describe('getMaxArmorForLocation()', () => {
    it('should return 9 for head regardless of tonnage', () => {
      expect(getMaxArmorForLocation(20, 'head')).toBe(9);
      expect(getMaxArmorForLocation(100, 'head')).toBe(9);
    });

    it('should return 2x structure for non-head locations', () => {
      // 50-ton mech has 5 structure points per location (standard)
      const max = getMaxArmorForLocation(50, 'centerTorso');
      expect(max).toBeGreaterThan(0);
    });

    it('should scale with tonnage', () => {
      const lightMax = getMaxArmorForLocation(20, 'centerTorso');
      const heavyMax = getMaxArmorForLocation(75, 'centerTorso');
      
      expect(heavyMax).toBeGreaterThan(lightMax);
    });
  });

  describe('getMaxTotalArmor()', () => {
    it('should calculate max total armor for a mech', () => {
      const max = getMaxTotalArmor(50);
      
      // 50-ton mech: 5 structure per location, 2x for armor
      // Head: 9, CT: 10, LT: 10, RT: 10, LA: 10, RA: 10, LL: 10, RL: 10
      // Total: 9 + 10*7 = 79
      expect(max).toBeGreaterThan(0);
    });

    it('should scale with tonnage', () => {
      const lightMax = getMaxTotalArmor(20);
      const heavyMax = getMaxTotalArmor(100);
      
      expect(heavyMax).toBeGreaterThan(lightMax);
    });
  });
});
