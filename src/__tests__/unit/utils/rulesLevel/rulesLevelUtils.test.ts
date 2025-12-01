/**
 * Tests for Rules Level Utilities
 * 
 * @spec openspec/specs/rules-level-system/spec.md
 */

import {
  RULES_LEVEL_ORDER,
  getRulesLevelIndex,
  compareRulesLevels,
  isWithinRulesLevel,
  getAllowedRulesLevels,
  getMostRestrictiveLevel,
  getLeastRestrictiveLevel,
  filterByRulesLevel,
  getRulesLevelDisplayName,
  getRulesLevelDescription,
} from '@/utils/rulesLevel/rulesLevelUtils';
import { RulesLevel } from '@/types/enums/RulesLevel';

describe('Rules Level Utilities', () => {
  // ============================================================================
  // RULES_LEVEL_ORDER
  // ============================================================================
  describe('RULES_LEVEL_ORDER', () => {
    it('should be ordered from least to most restrictive', () => {
      expect(RULES_LEVEL_ORDER).toEqual([
        RulesLevel.INTRODUCTORY,
        RulesLevel.STANDARD,
        RulesLevel.ADVANCED,
        RulesLevel.EXPERIMENTAL,
      ]);
    });

    it('should contain all rules levels', () => {
      expect(RULES_LEVEL_ORDER).toHaveLength(4);
    });
  });

  // ============================================================================
  // getRulesLevelIndex
  // ============================================================================
  describe('getRulesLevelIndex', () => {
    it('should return 0 for INTRODUCTORY', () => {
      expect(getRulesLevelIndex(RulesLevel.INTRODUCTORY)).toBe(0);
    });

    it('should return 1 for STANDARD', () => {
      expect(getRulesLevelIndex(RulesLevel.STANDARD)).toBe(1);
    });

    it('should return 2 for ADVANCED', () => {
      expect(getRulesLevelIndex(RulesLevel.ADVANCED)).toBe(2);
    });

    it('should return 3 for EXPERIMENTAL', () => {
      expect(getRulesLevelIndex(RulesLevel.EXPERIMENTAL)).toBe(3);
    });
  });

  // ============================================================================
  // compareRulesLevels
  // ============================================================================
  describe('compareRulesLevels', () => {
    it('should return negative when first is less restrictive', () => {
      expect(compareRulesLevels(RulesLevel.INTRODUCTORY, RulesLevel.STANDARD)).toBeLessThan(0);
      expect(compareRulesLevels(RulesLevel.STANDARD, RulesLevel.ADVANCED)).toBeLessThan(0);
    });

    it('should return positive when first is more restrictive', () => {
      expect(compareRulesLevels(RulesLevel.EXPERIMENTAL, RulesLevel.ADVANCED)).toBeGreaterThan(0);
      expect(compareRulesLevels(RulesLevel.ADVANCED, RulesLevel.STANDARD)).toBeGreaterThan(0);
    });

    it('should return 0 when equal', () => {
      expect(compareRulesLevels(RulesLevel.STANDARD, RulesLevel.STANDARD)).toBe(0);
      expect(compareRulesLevels(RulesLevel.EXPERIMENTAL, RulesLevel.EXPERIMENTAL)).toBe(0);
    });
  });

  // ============================================================================
  // isWithinRulesLevel
  // ============================================================================
  describe('isWithinRulesLevel', () => {
    it('should return true when level equals max level', () => {
      expect(isWithinRulesLevel(RulesLevel.STANDARD, RulesLevel.STANDARD)).toBe(true);
    });

    it('should return true when level is below max level', () => {
      expect(isWithinRulesLevel(RulesLevel.INTRODUCTORY, RulesLevel.STANDARD)).toBe(true);
      expect(isWithinRulesLevel(RulesLevel.STANDARD, RulesLevel.ADVANCED)).toBe(true);
    });

    it('should return false when level exceeds max level', () => {
      expect(isWithinRulesLevel(RulesLevel.EXPERIMENTAL, RulesLevel.STANDARD)).toBe(false);
      expect(isWithinRulesLevel(RulesLevel.ADVANCED, RulesLevel.INTRODUCTORY)).toBe(false);
    });
  });

  // ============================================================================
  // getAllowedRulesLevels
  // ============================================================================
  describe('getAllowedRulesLevels', () => {
    it('should return only INTRODUCTORY for max INTRODUCTORY', () => {
      expect(getAllowedRulesLevels(RulesLevel.INTRODUCTORY)).toEqual([RulesLevel.INTRODUCTORY]);
    });

    it('should return INTRODUCTORY and STANDARD for max STANDARD', () => {
      expect(getAllowedRulesLevels(RulesLevel.STANDARD)).toEqual([
        RulesLevel.INTRODUCTORY,
        RulesLevel.STANDARD,
      ]);
    });

    it('should return all levels for max EXPERIMENTAL', () => {
      expect(getAllowedRulesLevels(RulesLevel.EXPERIMENTAL)).toEqual([
        RulesLevel.INTRODUCTORY,
        RulesLevel.STANDARD,
        RulesLevel.ADVANCED,
        RulesLevel.EXPERIMENTAL,
      ]);
    });
  });

  // ============================================================================
  // getMostRestrictiveLevel
  // ============================================================================
  describe('getMostRestrictiveLevel', () => {
    it('should return INTRODUCTORY for empty array', () => {
      expect(getMostRestrictiveLevel([])).toBe(RulesLevel.INTRODUCTORY);
    });

    it('should return the only level for single-element array', () => {
      expect(getMostRestrictiveLevel([RulesLevel.STANDARD])).toBe(RulesLevel.STANDARD);
    });

    it('should return most restrictive from mixed levels', () => {
      expect(getMostRestrictiveLevel([
        RulesLevel.INTRODUCTORY,
        RulesLevel.ADVANCED,
        RulesLevel.STANDARD,
      ])).toBe(RulesLevel.ADVANCED);
    });

    it('should return EXPERIMENTAL when present', () => {
      expect(getMostRestrictiveLevel([
        RulesLevel.STANDARD,
        RulesLevel.EXPERIMENTAL,
        RulesLevel.INTRODUCTORY,
      ])).toBe(RulesLevel.EXPERIMENTAL);
    });
  });

  // ============================================================================
  // getLeastRestrictiveLevel
  // ============================================================================
  describe('getLeastRestrictiveLevel', () => {
    it('should return EXPERIMENTAL for empty array', () => {
      expect(getLeastRestrictiveLevel([])).toBe(RulesLevel.EXPERIMENTAL);
    });

    it('should return the only level for single-element array', () => {
      expect(getLeastRestrictiveLevel([RulesLevel.ADVANCED])).toBe(RulesLevel.ADVANCED);
    });

    it('should return least restrictive from mixed levels', () => {
      expect(getLeastRestrictiveLevel([
        RulesLevel.EXPERIMENTAL,
        RulesLevel.ADVANCED,
        RulesLevel.STANDARD,
      ])).toBe(RulesLevel.STANDARD);
    });

    it('should return INTRODUCTORY when present', () => {
      expect(getLeastRestrictiveLevel([
        RulesLevel.STANDARD,
        RulesLevel.INTRODUCTORY,
        RulesLevel.ADVANCED,
      ])).toBe(RulesLevel.INTRODUCTORY);
    });
  });

  // ============================================================================
  // filterByRulesLevel
  // ============================================================================
  describe('filterByRulesLevel', () => {
    const entities = [
      { id: '1', rulesLevel: RulesLevel.INTRODUCTORY },
      { id: '2', rulesLevel: RulesLevel.STANDARD },
      { id: '3', rulesLevel: RulesLevel.ADVANCED },
      { id: '4', rulesLevel: RulesLevel.EXPERIMENTAL },
    ];

    it('should filter to only INTRODUCTORY', () => {
      const result = filterByRulesLevel(entities, RulesLevel.INTRODUCTORY);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('should filter to INTRODUCTORY and STANDARD', () => {
      const result = filterByRulesLevel(entities, RulesLevel.STANDARD);
      expect(result).toHaveLength(2);
      expect(result.map(e => e.id)).toEqual(['1', '2']);
    });

    it('should include all for EXPERIMENTAL', () => {
      const result = filterByRulesLevel(entities, RulesLevel.EXPERIMENTAL);
      expect(result).toHaveLength(4);
    });

    it('should return empty array for empty input', () => {
      expect(filterByRulesLevel([], RulesLevel.STANDARD)).toHaveLength(0);
    });
  });

  // ============================================================================
  // getRulesLevelDisplayName
  // ============================================================================
  describe('getRulesLevelDisplayName', () => {
    it('should return the enum value as display name', () => {
      expect(getRulesLevelDisplayName(RulesLevel.INTRODUCTORY)).toBe(RulesLevel.INTRODUCTORY);
      expect(getRulesLevelDisplayName(RulesLevel.STANDARD)).toBe(RulesLevel.STANDARD);
      expect(getRulesLevelDisplayName(RulesLevel.ADVANCED)).toBe(RulesLevel.ADVANCED);
      expect(getRulesLevelDisplayName(RulesLevel.EXPERIMENTAL)).toBe(RulesLevel.EXPERIMENTAL);
    });
  });

  // ============================================================================
  // getRulesLevelDescription
  // ============================================================================
  describe('getRulesLevelDescription', () => {
    it('should return description for INTRODUCTORY', () => {
      const description = getRulesLevelDescription(RulesLevel.INTRODUCTORY);
      expect(description).toContain('new players');
    });

    it('should return description for STANDARD', () => {
      const description = getRulesLevelDescription(RulesLevel.STANDARD);
      expect(description).toContain('Full BattleTech');
    });

    it('should return description for ADVANCED', () => {
      const description = getRulesLevelDescription(RulesLevel.ADVANCED);
      expect(description).toContain('Complex');
    });

    it('should return description for EXPERIMENTAL', () => {
      const description = getRulesLevelDescription(RulesLevel.EXPERIMENTAL);
      expect(description).toContain('prototype');
    });
  });
});

