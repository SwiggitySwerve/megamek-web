/**
 * Tests for Builtin Variable Equipment Formulas
 */

import {
  BUILTIN_FORMULAS,
  getBuiltinEquipmentIds,
  hasBuiltinFormulas,
  getBuiltinFormulas,
} from '@/services/equipment/builtinFormulas';

describe('Builtin Formulas', () => {
  // ============================================================================
  // BUILTIN_FORMULAS
  // ============================================================================
  describe('BUILTIN_FORMULAS', () => {
    it('should contain targeting computer formulas', () => {
      expect(BUILTIN_FORMULAS['targeting-computer-is']).toBeDefined();
      expect(BUILTIN_FORMULAS['targeting-computer-clan']).toBeDefined();
    });

    it('should contain MASC formulas', () => {
      expect(BUILTIN_FORMULAS['masc-is']).toBeDefined();
      expect(BUILTIN_FORMULAS['masc-clan']).toBeDefined();
    });

    it('should contain supercharger formula', () => {
      expect(BUILTIN_FORMULAS['supercharger']).toBeDefined();
    });

    it('should contain partial wing formula', () => {
      expect(BUILTIN_FORMULAS['partial-wing']).toBeDefined();
    });

    it('should contain TSM formula', () => {
      expect(BUILTIN_FORMULAS['tsm']).toBeDefined();
    });

    it('should contain physical weapon formulas', () => {
      expect(BUILTIN_FORMULAS['hatchet']).toBeDefined();
      expect(BUILTIN_FORMULAS['sword']).toBeDefined();
      expect(BUILTIN_FORMULAS['mace']).toBeDefined();
    });

    it('should have required formula properties', () => {
      const formula = BUILTIN_FORMULAS['targeting-computer-is'];
      expect(formula.weight).toBeDefined();
      expect(formula.criticalSlots).toBeDefined();
      expect(formula.cost).toBeDefined();
      expect(formula.requiredContext).toBeDefined();
    });

    it('should have correct required context for targeting computer', () => {
      const formula = BUILTIN_FORMULAS['targeting-computer-is'];
      expect(formula.requiredContext).toContain('directFireWeaponTonnage');
    });

    it('should have correct required context for MASC', () => {
      const formula = BUILTIN_FORMULAS['masc-is'];
      // MASC now uses tonnage-based formula (5% for IS, 4% for Clan)
      expect(formula.requiredContext).toContain('tonnage');
      expect(formula.requiredContext).not.toContain('engineRating');
    });
  });

  // ============================================================================
  // getBuiltinEquipmentIds
  // ============================================================================
  describe('getBuiltinEquipmentIds', () => {
    it('should return array of equipment IDs', () => {
      const ids = getBuiltinEquipmentIds();
      expect(Array.isArray(ids)).toBe(true);
      expect(ids.length).toBeGreaterThan(0);
    });

    it('should include known equipment IDs', () => {
      const ids = getBuiltinEquipmentIds();
      expect(ids).toContain('targeting-computer-is');
      expect(ids).toContain('masc-is');
      expect(ids).toContain('tsm');
    });

    it('should match keys of BUILTIN_FORMULAS', () => {
      const ids = getBuiltinEquipmentIds();
      const keys = Object.keys(BUILTIN_FORMULAS);
      expect(ids).toEqual(keys);
    });
  });

  // ============================================================================
  // hasBuiltinFormulas
  // ============================================================================
  describe('hasBuiltinFormulas', () => {
    it('should return true for known equipment', () => {
      expect(hasBuiltinFormulas('targeting-computer-is')).toBe(true);
      expect(hasBuiltinFormulas('masc-clan')).toBe(true);
      expect(hasBuiltinFormulas('hatchet')).toBe(true);
    });

    it('should return false for unknown equipment', () => {
      expect(hasBuiltinFormulas('unknown-equipment')).toBe(false);
      expect(hasBuiltinFormulas('medium-laser')).toBe(false);
      expect(hasBuiltinFormulas('')).toBe(false);
    });
  });

  // ============================================================================
  // getBuiltinFormulas
  // ============================================================================
  describe('getBuiltinFormulas', () => {
    it('should return formula for known equipment', () => {
      const formula = getBuiltinFormulas('tsm');
      expect(formula).toBeDefined();
      expect(formula?.weight).toBeDefined();
      expect(formula?.criticalSlots).toBeDefined();
    });

    it('should return undefined for unknown equipment', () => {
      expect(getBuiltinFormulas('unknown')).toBeUndefined();
    });

    it('should return formula matching BUILTIN_FORMULAS', () => {
      const formula = getBuiltinFormulas('supercharger');
      expect(formula).toBe(BUILTIN_FORMULAS['supercharger']);
    });
  });

  // ============================================================================
  // Formula structures
  // ============================================================================
  describe('Formula structures', () => {
    it('should have fixed slots for supercharger', () => {
      const formula = BUILTIN_FORMULAS['supercharger'];
      // Fixed(1) creates an object with value 1
      expect(formula.criticalSlots).toBeDefined();
    });

    it('should have damage formula for physical weapons', () => {
      const hatchet = BUILTIN_FORMULAS['hatchet'];
      expect(hatchet.damage).toBeDefined();
    });

    it('should have all physical weapon formulas', () => {
      const physicalWeapons = [
        'hatchet',
        'sword',
        'mace',
        'claws',
        'lance',
        'talons',
        'retractable-blade',
        'flail',
        'wrecking-ball',
      ];
      
      for (const weapon of physicalWeapons) {
        expect(BUILTIN_FORMULAS[weapon]).toBeDefined();
        expect(BUILTIN_FORMULAS[weapon].damage).toBeDefined();
      }
    });

    it('should have required context for all formulas', () => {
      for (const [id, formula] of Object.entries(BUILTIN_FORMULAS)) {
        expect(formula.requiredContext).toBeDefined();
        expect(Array.isArray(formula.requiredContext)).toBe(true);
      }
    });
  });
});

