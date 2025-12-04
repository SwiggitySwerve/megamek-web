import {
  calculateRunMP,
  calculateSprintMP,
  calculateCombinedSprintMP,
  getMaxJumpMP,
  calculateEnhancedMaxRunMP,
  JumpJetType,
  JUMP_JET_DEFINITIONS,
} from '@/utils/construction/movementCalculations';

describe('movementCalculations', () => {
  describe('calculateRunMP()', () => {
    it('should calculate run MP from walk MP', () => {
      expect(calculateRunMP(4)).toBe(6); // ceil(4 * 1.5) = 6
      expect(calculateRunMP(5)).toBe(8); // ceil(5 * 1.5) = 8
      expect(calculateRunMP(6)).toBe(9); // ceil(6 * 1.5) = 9
    });

    it('should return 0 for zero or negative walk MP', () => {
      expect(calculateRunMP(0)).toBe(0);
      expect(calculateRunMP(-1)).toBe(0);
    });
  });

  describe('calculateSprintMP()', () => {
    it('should calculate sprint MP from walk MP', () => {
      expect(calculateSprintMP(4)).toBe(8); // floor(4 * 2) = 8
      expect(calculateSprintMP(5)).toBe(10); // floor(5 * 2) = 10
    });

    it('should return 0 for zero or negative walk MP', () => {
      expect(calculateSprintMP(0)).toBe(0);
      expect(calculateSprintMP(-1)).toBe(0);
    });
  });

  describe('calculateCombinedSprintMP()', () => {
    it('should calculate combined sprint MP', () => {
      expect(calculateCombinedSprintMP(4)).toBe(10); // floor(4 * 2.5) = 10
      expect(calculateCombinedSprintMP(5)).toBe(12); // floor(5 * 2.5) = 12
    });

    it('should return 0 for zero or negative walk MP', () => {
      expect(calculateCombinedSprintMP(0)).toBe(0);
      expect(calculateCombinedSprintMP(-1)).toBe(0);
    });
  });

  describe('getMaxJumpMP()', () => {
    it('should return max jump MP for tonnage', () => {
      const maxJump = getMaxJumpMP(50);
      expect(maxJump).toBeGreaterThan(0);
    });

    it('should scale with tonnage', () => {
      const lightMax = getMaxJumpMP(20);
      const heavyMax = getMaxJumpMP(100);
      
      expect(heavyMax).toBeGreaterThan(lightMax);
    });
  });

  describe('calculateEnhancedMaxRunMP()', () => {
    it('should calculate enhanced max run MP with MASC', () => {
      const enhanced = calculateEnhancedMaxRunMP(5, true, false);
      expect(enhanced).toBeGreaterThan(5);
    });

    it('should calculate enhanced max run MP with Supercharger', () => {
      const enhanced = calculateEnhancedMaxRunMP(5, false, true);
      expect(enhanced).toBeGreaterThan(5);
    });

    it('should calculate enhanced max run MP with both', () => {
      const enhanced = calculateEnhancedMaxRunMP(5, true, true);
      expect(enhanced).toBeGreaterThan(5);
    });
  });

  describe('JUMP_JET_DEFINITIONS', () => {
    it('should have jump jet definitions', () => {
      expect(JUMP_JET_DEFINITIONS.length).toBeGreaterThan(0);
    });

    it('should include standard jump jets', () => {
      const standard = JUMP_JET_DEFINITIONS.find(j => j.type === JumpJetType.STANDARD);
      expect(standard).toBeDefined();
    });
  });
});
