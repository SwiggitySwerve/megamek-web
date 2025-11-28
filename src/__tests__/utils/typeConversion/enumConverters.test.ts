/**
 * Tests for enum conversion utilities
 */

import {
  stringToTechBase,
  techBaseToString,
  stringToRulesLevel,
  rulesLevelToString,
  stringToTechBaseWithDefault,
  stringToRulesLevelWithDefault,
  stringToTechBaseFilter,
  stringToTechBaseFilterWithDefault,
  techBaseFilterToString,
} from '../../../utils/typeConversion/enumConverters';
import { TechBase, TechBaseFilter, RulesLevel } from '../../../types/core/BaseTypes';

describe('enumConverters', () => {
  describe('stringToTechBase', () => {
    it('should convert valid tech base strings', () => {
      expect(stringToTechBase('Inner Sphere')).toBe(TechBase.INNER_SPHERE);
      expect(stringToTechBase('Clan')).toBe(TechBase.CLAN);
    });

    it('should handle whitespace', () => {
      expect(stringToTechBase('  Inner Sphere  ')).toBe(TechBase.INNER_SPHERE);
      expect(stringToTechBase('  Clan  ')).toBe(TechBase.CLAN);
    });

    it('should return null for invalid values', () => {
      expect(stringToTechBase('Invalid')).toBeNull();
      expect(stringToTechBase('')).toBeNull();
      expect(stringToTechBase('inner sphere')).toBeNull(); // Case sensitive
    });

    it('should return null for null/undefined', () => {
      expect(stringToTechBase(null)).toBeNull();
      expect(stringToTechBase(undefined)).toBeNull();
    });
  });

  describe('techBaseToString', () => {
    it('should convert enum to string', () => {
      expect(techBaseToString(TechBase.INNER_SPHERE)).toBe('Inner Sphere');
      expect(techBaseToString(TechBase.CLAN)).toBe('Clan');
    });
  });

  describe('stringToTechBaseFilter', () => {
    it('should convert valid filter strings', () => {
      expect(stringToTechBaseFilter('Inner Sphere')).toBe(TechBaseFilter.INNER_SPHERE);
      expect(stringToTechBaseFilter('Clan')).toBe(TechBaseFilter.CLAN);
      expect(stringToTechBaseFilter('Mixed')).toBe(TechBaseFilter.MIXED);
    });

    it('should return null for invalid values', () => {
      expect(stringToTechBaseFilter('Unknown')).toBeNull();
    });

    it('should return null for null/undefined', () => {
      expect(stringToTechBaseFilter(null)).toBeNull();
      expect(stringToTechBaseFilter(undefined)).toBeNull();
    });
  });

  describe('techBaseFilterToString', () => {
    it('should convert filter enum to string', () => {
      expect(techBaseFilterToString(TechBaseFilter.INNER_SPHERE)).toBe('Inner Sphere');
      expect(techBaseFilterToString(TechBaseFilter.CLAN)).toBe('Clan');
      expect(techBaseFilterToString(TechBaseFilter.MIXED)).toBe('Mixed');
    });
  });

  describe('stringToRulesLevel', () => {
    it('should convert valid rules level strings', () => {
      expect(stringToRulesLevel('Introductory')).toBe(RulesLevel.INTRODUCTORY);
      expect(stringToRulesLevel('Standard')).toBe(RulesLevel.STANDARD);
      expect(stringToRulesLevel('Advanced')).toBe(RulesLevel.ADVANCED);
      expect(stringToRulesLevel('Experimental')).toBe(RulesLevel.EXPERIMENTAL);
    });

    it('should convert numeric rules levels', () => {
      expect(stringToRulesLevel(0)).toBe(RulesLevel.INTRODUCTORY);
      expect(stringToRulesLevel(1)).toBe(RulesLevel.STANDARD);
      expect(stringToRulesLevel(2)).toBe(RulesLevel.ADVANCED);
      expect(stringToRulesLevel(3)).toBe(RulesLevel.EXPERIMENTAL);
    });

    it('should handle whitespace', () => {
      expect(stringToRulesLevel('  Standard  ')).toBe(RulesLevel.STANDARD);
    });

    it('should return null for invalid values', () => {
      expect(stringToRulesLevel('Invalid')).toBeNull();
      expect(stringToRulesLevel('')).toBeNull();
      expect(stringToRulesLevel(99)).toBeNull();
      expect(stringToRulesLevel(-1)).toBeNull();
    });

    it('should return null for null/undefined', () => {
      expect(stringToRulesLevel(null)).toBeNull();
      expect(stringToRulesLevel(undefined)).toBeNull();
    });
  });

  describe('rulesLevelToString', () => {
    it('should convert enum to string', () => {
      expect(rulesLevelToString(RulesLevel.INTRODUCTORY)).toBe('Introductory');
      expect(rulesLevelToString(RulesLevel.STANDARD)).toBe('Standard');
      expect(rulesLevelToString(RulesLevel.ADVANCED)).toBe('Advanced');
      expect(rulesLevelToString(RulesLevel.EXPERIMENTAL)).toBe('Experimental');
    });
  });

  describe('stringToTechBaseWithDefault', () => {
    it('should return converted value for valid input', () => {
      expect(stringToTechBaseWithDefault('Clan')).toBe(TechBase.CLAN);
    });

    it('should return default for invalid input', () => {
      expect(stringToTechBaseWithDefault('Invalid')).toBe(TechBase.INNER_SPHERE);
      expect(stringToTechBaseWithDefault(null)).toBe(TechBase.INNER_SPHERE);
    });

    it('should use custom default', () => {
      expect(stringToTechBaseWithDefault('Invalid', TechBase.CLAN)).toBe(TechBase.CLAN);
    });
  });

  describe('stringToTechBaseFilterWithDefault', () => {
    it('should return converted value for valid input', () => {
      expect(stringToTechBaseFilterWithDefault('Mixed')).toBe(TechBaseFilter.MIXED);
    });

    it('should return default for invalid input', () => {
      expect(stringToTechBaseFilterWithDefault('Invalid')).toBe(TechBaseFilter.INNER_SPHERE);
      expect(stringToTechBaseFilterWithDefault(null)).toBe(TechBaseFilter.INNER_SPHERE);
    });

    it('should use custom default', () => {
      expect(stringToTechBaseFilterWithDefault('Invalid', TechBaseFilter.CLAN)).toBe(TechBaseFilter.CLAN);
    });
  });

  describe('stringToRulesLevelWithDefault', () => {
    it('should return converted value for valid input', () => {
      expect(stringToRulesLevelWithDefault('Advanced')).toBe(RulesLevel.ADVANCED);
      expect(stringToRulesLevelWithDefault(2)).toBe(RulesLevel.ADVANCED);
    });

    it('should return default for invalid input', () => {
      expect(stringToRulesLevelWithDefault('Invalid')).toBe(RulesLevel.STANDARD);
      expect(stringToRulesLevelWithDefault(null)).toBe(RulesLevel.STANDARD);
    });

    it('should use custom default', () => {
      expect(stringToRulesLevelWithDefault('Invalid', RulesLevel.ADVANCED)).toBe(RulesLevel.ADVANCED);
    });
  });
});
