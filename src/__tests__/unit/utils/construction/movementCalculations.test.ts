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
    it('should return max jump MP equal to walk MP for standard jets', () => {
      const maxJump = getMaxJumpMP(5, JumpJetType.STANDARD);
      expect(maxJump).toBe(5);
    });

    it('should return run MP for improved jets', () => {
      // Improved jets can reach runMP = ceil(walkMP * 1.5)
      const maxJump = getMaxJumpMP(5, JumpJetType.IMPROVED);
      expect(maxJump).toBe(8); // ceil(5 * 1.5) = 8
    });

    it('should handle different walk MP values', () => {
      expect(getMaxJumpMP(4, JumpJetType.STANDARD)).toBe(4);
      expect(getMaxJumpMP(6, JumpJetType.STANDARD)).toBe(6);
      expect(getMaxJumpMP(4, JumpJetType.IMPROVED)).toBe(6); // ceil(4 * 1.5) = 6
    });
  });

  describe('calculateEnhancedMaxRunMP()', () => {
    it('should calculate enhanced max run MP with MASC', () => {
      // MASC allows sprint = walkMP * 2
      const enhanced = calculateEnhancedMaxRunMP(5, 'MASC', false);
      expect(enhanced).toBe(10); // floor(5 * 2) = 10
    });

    it('should calculate enhanced max run MP with Supercharger', () => {
      // Supercharger also allows sprint = walkMP * 2
      const enhanced = calculateEnhancedMaxRunMP(5, 'Supercharger', false);
      expect(enhanced).toBe(10); // floor(5 * 2) = 10
    });

    it('should calculate enhanced max run MP with both MASC and Supercharger', () => {
      // Combined allows sprint = walkMP * 2.5
      const enhanced = calculateEnhancedMaxRunMP(5, 'MASC', true);
      expect(enhanced).toBe(12); // floor(5 * 2.5) = 12
    });

    it('should calculate enhanced run MP with TSM', () => {
      // TSM adds +1 to run MP
      const enhanced = calculateEnhancedMaxRunMP(5, 'TSM', false);
      expect(enhanced).toBe(9); // runMP(5) + 1 = 8 + 1 = 9
    });

    it('should return undefined for no enhancement', () => {
      expect(calculateEnhancedMaxRunMP(5, null, false)).toBeUndefined();
      expect(calculateEnhancedMaxRunMP(5, undefined, false)).toBeUndefined();
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
