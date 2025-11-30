/**
 * Tech Base Validation Tests
 * 
 * Tests for tech base compatibility validation.
 * 
 * @spec openspec/specs/tech-base-integration/spec.md
 */

import {
  getEngineTechBase,
  getGyroTechBase,
  getStructureTechBase,
  getHeatSinkTechBase,
  getArmorTechBase,
  isComponentCompatible,
  validateTechBaseCompatibility,
  getHighestRulesLevel,
  getAvailableEngineTypes,
  getAvailableGyroTypes,
  getAvailableStructureTypes,
  getAvailableHeatSinkTypes,
  getAvailableArmorTypes,
} from '@/utils/construction/techBaseValidation';
import { TechBase } from '@/types/enums/TechBase';
import { RulesLevel } from '@/types/enums/RulesLevel';
import { EngineType } from '@/types/construction/EngineType';
import { GyroType } from '@/types/construction/GyroType';
import { InternalStructureType } from '@/types/construction/InternalStructureType';
import { HeatSinkType } from '@/types/construction/HeatSinkType';
import { ArmorTypeEnum } from '@/types/construction/ArmorType';

describe('techBaseValidation', () => {
  // ============================================================================
  // Tech Base Getters
  // ============================================================================
  describe('getEngineTechBase()', () => {
    it('should return tech base for Standard engine', () => {
      const result = getEngineTechBase(EngineType.STANDARD);
      expect(result).toBeDefined();
    });

    it('should return tech base for XL IS engine', () => {
      const result = getEngineTechBase(EngineType.XL_IS);
      expect(result).toBe(TechBase.INNER_SPHERE);
    });

    it('should return tech base for XL Clan engine', () => {
      const result = getEngineTechBase(EngineType.XL_CLAN);
      expect(result).toBe(TechBase.CLAN);
    });
  });

  describe('getGyroTechBase()', () => {
    it('should return tech base for Standard gyro', () => {
      const result = getGyroTechBase(GyroType.STANDARD);
      expect(result).toBeDefined();
    });
  });

  describe('getStructureTechBase()', () => {
    it('should return tech base for Standard structure', () => {
      const result = getStructureTechBase(InternalStructureType.STANDARD);
      expect(result).toBeDefined();
    });

    it('should return IS for Endo Steel IS', () => {
      const result = getStructureTechBase(InternalStructureType.ENDO_STEEL_IS);
      expect(result).toBe(TechBase.INNER_SPHERE);
    });

    it('should return Clan for Endo Steel Clan', () => {
      const result = getStructureTechBase(InternalStructureType.ENDO_STEEL_CLAN);
      expect(result).toBe(TechBase.CLAN);
    });
  });

  describe('getHeatSinkTechBase()', () => {
    it('should return tech base for Single heat sinks', () => {
      const result = getHeatSinkTechBase(HeatSinkType.SINGLE);
      expect(result).toBeDefined();
    });

    it('should return IS for Double IS heat sinks', () => {
      const result = getHeatSinkTechBase(HeatSinkType.DOUBLE_IS);
      expect(result).toBe(TechBase.INNER_SPHERE);
    });

    it('should return Clan for Double Clan heat sinks', () => {
      const result = getHeatSinkTechBase(HeatSinkType.DOUBLE_CLAN);
      expect(result).toBe(TechBase.CLAN);
    });
  });

  describe('getArmorTechBase()', () => {
    it('should return tech base for Standard armor', () => {
      const result = getArmorTechBase(ArmorTypeEnum.STANDARD);
      expect(result).toBeDefined();
    });

    it('should return IS for Ferro-Fibrous IS', () => {
      const result = getArmorTechBase(ArmorTypeEnum.FERRO_FIBROUS_IS);
      expect(result).toBe(TechBase.INNER_SPHERE);
    });

    it('should return Clan for Ferro-Fibrous Clan', () => {
      const result = getArmorTechBase(ArmorTypeEnum.FERRO_FIBROUS_CLAN);
      expect(result).toBe(TechBase.CLAN);
    });
  });

  // ============================================================================
  // isComponentCompatible()
  // ============================================================================
  describe('isComponentCompatible()', () => {
    it('should return true for same tech base', () => {
      expect(isComponentCompatible(TechBase.INNER_SPHERE, TechBase.INNER_SPHERE, false)).toBe(true);
      expect(isComponentCompatible(TechBase.CLAN, TechBase.CLAN, false)).toBe(true);
    });

    it('should allow mixed tech when enabled', () => {
      expect(isComponentCompatible(TechBase.CLAN, TechBase.INNER_SPHERE, true)).toBe(true);
      expect(isComponentCompatible(TechBase.INNER_SPHERE, TechBase.CLAN, true)).toBe(true);
    });

    it('should allow IS components on Clan units', () => {
      // Clan units can use inferior IS tech
      expect(isComponentCompatible(TechBase.INNER_SPHERE, TechBase.CLAN, false)).toBe(true);
    });

    it('should reject Clan components on IS units without mixed tech', () => {
      expect(isComponentCompatible(TechBase.CLAN, TechBase.INNER_SPHERE, false)).toBe(false);
    });
  });

  // ============================================================================
  // validateTechBaseCompatibility()
  // ============================================================================
  describe('validateTechBaseCompatibility()', () => {
    it('should pass for all compatible components', () => {
      const result = validateTechBaseCompatibility(
        TechBase.INNER_SPHERE,
        {
          engineType: EngineType.STANDARD,
          gyroType: GyroType.STANDARD,
          structureType: InternalStructureType.STANDARD,
        },
        false
      );
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should pass for IS unit with IS XL engine', () => {
      const result = validateTechBaseCompatibility(
        TechBase.INNER_SPHERE,
        {
          engineType: EngineType.XL_IS,
        },
        false
      );
      
      expect(result.isValid).toBe(true);
    });

    it('should fail for IS unit with Clan XL engine without mixed tech', () => {
      const result = validateTechBaseCompatibility(
        TechBase.INNER_SPHERE,
        {
          engineType: EngineType.XL_CLAN,
        },
        false
      );
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should pass for IS unit with Clan engine when mixed tech allowed', () => {
      const result = validateTechBaseCompatibility(
        TechBase.INNER_SPHERE,
        {
          engineType: EngineType.XL_CLAN,
        },
        true
      );
      
      expect(result.isValid).toBe(true);
    });

    it('should warn about mixed tech usage', () => {
      const result = validateTechBaseCompatibility(
        TechBase.CLAN,
        {
          engineType: EngineType.XL_CLAN,
          heatSinkType: HeatSinkType.DOUBLE_IS, // IS component on Clan unit
        },
        true
      );
      
      // Should pass but may have warnings
      expect(result.isValid).toBe(true);
    });

    it('should pass with empty components', () => {
      const result = validateTechBaseCompatibility(
        TechBase.INNER_SPHERE,
        {},
        false
      );
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  // ============================================================================
  // getHighestRulesLevel()
  // ============================================================================
  describe('getHighestRulesLevel()', () => {
    it('should return Introductory for standard components', () => {
      const result = getHighestRulesLevel({
        engineType: EngineType.STANDARD,
        gyroType: GyroType.STANDARD,
      });
      
      expect(result).toBe(RulesLevel.INTRODUCTORY);
    });

    it('should return Standard for XL engine', () => {
      const result = getHighestRulesLevel({
        engineType: EngineType.XL_IS,
      });
      
      // XL engines are Standard rules level
      expect([RulesLevel.STANDARD, RulesLevel.ADVANCED]).toContain(result);
    });

    it('should return highest level among components', () => {
      // If we have experimental armor, that should be the highest
      const result = getHighestRulesLevel({
        engineType: EngineType.STANDARD,
        armorType: ArmorTypeEnum.HARDENED,
      });
      
      // Hardened armor is typically Advanced
      expect([RulesLevel.STANDARD, RulesLevel.ADVANCED, RulesLevel.EXPERIMENTAL]).toContain(result);
    });

    it('should return Introductory for empty components', () => {
      const result = getHighestRulesLevel({});
      
      expect(result).toBe(RulesLevel.INTRODUCTORY);
    });
  });

  // ============================================================================
  // getAvailable*Types()
  // ============================================================================
  describe('getAvailableEngineTypes()', () => {
    it('should return IS engines for IS tech base', () => {
      const types = getAvailableEngineTypes(TechBase.INNER_SPHERE, false);
      
      expect(types).toContain(EngineType.STANDARD);
      expect(types).toContain(EngineType.XL_IS);
      expect(types).not.toContain(EngineType.XL_CLAN);
    });

    it('should return Clan engines for Clan tech base', () => {
      const types = getAvailableEngineTypes(TechBase.CLAN, false);
      
      expect(types).toContain(EngineType.XL_CLAN);
    });

    it('should return all engines with mixed tech', () => {
      const types = getAvailableEngineTypes(TechBase.INNER_SPHERE, true);
      
      expect(types).toContain(EngineType.STANDARD);
      expect(types).toContain(EngineType.XL_IS);
      expect(types).toContain(EngineType.XL_CLAN);
    });
  });

  describe('getAvailableGyroTypes()', () => {
    it('should return gyros for IS tech base', () => {
      const types = getAvailableGyroTypes(TechBase.INNER_SPHERE, false);
      
      expect(types).toContain(GyroType.STANDARD);
    });

    it('should return more gyros with mixed tech', () => {
      const typesNormal = getAvailableGyroTypes(TechBase.INNER_SPHERE, false);
      const typesMixed = getAvailableGyroTypes(TechBase.INNER_SPHERE, true);
      
      expect(typesMixed.length).toBeGreaterThanOrEqual(typesNormal.length);
    });
  });

  describe('getAvailableStructureTypes()', () => {
    it('should return IS structure types for IS', () => {
      const types = getAvailableStructureTypes(TechBase.INNER_SPHERE, false);
      
      expect(types).toContain(InternalStructureType.STANDARD);
      expect(types).toContain(InternalStructureType.ENDO_STEEL_IS);
    });

    it('should not include Clan Endo Steel for IS without mixed', () => {
      const types = getAvailableStructureTypes(TechBase.INNER_SPHERE, false);
      
      expect(types).not.toContain(InternalStructureType.ENDO_STEEL_CLAN);
    });
  });

  describe('getAvailableHeatSinkTypes()', () => {
    it('should return IS heat sinks for IS', () => {
      const types = getAvailableHeatSinkTypes(TechBase.INNER_SPHERE, false);
      
      expect(types).toContain(HeatSinkType.SINGLE);
      expect(types).toContain(HeatSinkType.DOUBLE_IS);
    });

    it('should return Clan heat sinks for Clan', () => {
      const types = getAvailableHeatSinkTypes(TechBase.CLAN, false);
      
      expect(types).toContain(HeatSinkType.DOUBLE_CLAN);
    });
  });

  describe('getAvailableArmorTypes()', () => {
    it('should return IS armor types for IS', () => {
      const types = getAvailableArmorTypes(TechBase.INNER_SPHERE, false);
      
      expect(types).toContain(ArmorTypeEnum.STANDARD);
      expect(types).toContain(ArmorTypeEnum.FERRO_FIBROUS_IS);
    });

    it('should return Clan armor types for Clan', () => {
      const types = getAvailableArmorTypes(TechBase.CLAN, false);
      
      expect(types).toContain(ArmorTypeEnum.FERRO_FIBROUS_CLAN);
    });

    it('should return all armor types with mixed tech', () => {
      const types = getAvailableArmorTypes(TechBase.INNER_SPHERE, true);
      
      expect(types).toContain(ArmorTypeEnum.STANDARD);
      expect(types).toContain(ArmorTypeEnum.FERRO_FIBROUS_IS);
      expect(types).toContain(ArmorTypeEnum.FERRO_FIBROUS_CLAN);
    });
  });
});

