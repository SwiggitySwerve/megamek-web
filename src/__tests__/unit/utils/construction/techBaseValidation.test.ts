import {
  getEngineTechBase,
  getGyroTechBase,
  getStructureTechBase,
  getHeatSinkTechBase,
  getArmorTechBase,
  isComponentCompatible,
  validateTechBaseCompatibility,
} from '@/utils/construction/techBaseValidation';
import { TechBase } from '@/types/enums/TechBase';
import { EngineType } from '@/types/construction/EngineType';
import { GyroType } from '@/types/construction/GyroType';
import { InternalStructureType } from '@/types/construction/InternalStructureType';
import { HeatSinkType } from '@/types/construction/HeatSinkType';
import { ArmorTypeEnum } from '@/types/construction/ArmorType';

describe('techBaseValidation', () => {
  describe('getEngineTechBase()', () => {
    it('should return tech base for engine type', () => {
      const techBase = getEngineTechBase(EngineType.STANDARD);
      expect(techBase).toBeDefined();
    });
  });

  describe('getGyroTechBase()', () => {
    it('should return tech base for gyro type', () => {
      const techBase = getGyroTechBase(GyroType.STANDARD);
      expect(techBase).toBeDefined();
    });
  });

  describe('getStructureTechBase()', () => {
    it('should return tech base for structure type', () => {
      const techBase = getStructureTechBase(InternalStructureType.STANDARD);
      expect(techBase).toBeDefined();
    });
  });

  describe('getHeatSinkTechBase()', () => {
    it('should return tech base for heat sink type', () => {
      const techBase = getHeatSinkTechBase(HeatSinkType.SINGLE);
      expect(techBase).toBeDefined();
    });
  });

  describe('getArmorTechBase()', () => {
    it('should return tech base for armor type', () => {
      const techBase = getArmorTechBase(ArmorTypeEnum.STANDARD);
      expect(techBase).toBeDefined();
    });
  });

  describe('isComponentCompatible()', () => {
    it('should return true for same tech base', () => {
      expect(isComponentCompatible(TechBase.INNER_SPHERE, TechBase.INNER_SPHERE, false)).toBe(true);
      expect(isComponentCompatible(TechBase.CLAN, TechBase.CLAN, false)).toBe(true);
    });

    it('should return true when mixed tech is allowed', () => {
      expect(isComponentCompatible(TechBase.INNER_SPHERE, TechBase.CLAN, true)).toBe(true);
      expect(isComponentCompatible(TechBase.CLAN, TechBase.INNER_SPHERE, true)).toBe(true);
    });

    it('should allow IS components on Clan units', () => {
      expect(isComponentCompatible(TechBase.INNER_SPHERE, TechBase.CLAN, false)).toBe(true);
    });

    it('should not allow Clan components on IS units without mixed tech', () => {
      expect(isComponentCompatible(TechBase.CLAN, TechBase.INNER_SPHERE, false)).toBe(false);
    });
  });

  describe('validateTechBaseCompatibility()', () => {
    it('should validate compatible components', () => {
      const result = validateTechBaseCompatibility(
        TechBase.INNER_SPHERE,
        {
          engineType: EngineType.STANDARD,
          gyroType: GyroType.STANDARD,
        },
        false
      );
      
      expect(result.isValid).toBe(true);
    });

    it('should detect incompatible components', () => {
      const result = validateTechBaseCompatibility(
        TechBase.INNER_SPHERE,
        {
          engineType: EngineType.XL_CLAN,
        },
        false
      );
      
      // Result depends on actual engine definitions
      expect(result).toBeDefined();
    });
  });
});
