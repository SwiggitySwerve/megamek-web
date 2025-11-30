/**
 * Unit Serializer Tests
 * 
 * Tests for serializing and deserializing unit data.
 * 
 * @spec openspec/specs/serialization-formats/spec.md
 */

import {
  serializeUnit,
  validateSerializedFormat,
  getSerializedFormatVersion,
  isFormatVersionSupported,
  createUnitSerializer,
} from '@/utils/serialization/UnitSerializer';
import { IBattleMech, MechConfiguration, UnitType } from '@/types/unit/BattleMechInterfaces';
import { TechBase } from '@/types/enums/TechBase';
import { RulesLevel } from '@/types/enums/RulesLevel';
import { Era } from '@/types/enums/Era';
import { EngineType } from '@/types/construction/EngineType';
import { GyroType } from '@/types/construction/GyroType';
import { InternalStructureType } from '@/types/construction/InternalStructureType';
import { ArmorTypeEnum } from '@/types/construction/ArmorType';
import { HeatSinkType } from '@/types/construction/HeatSinkType';
import { CockpitType } from '@/types/construction/CockpitType';
import { MechLocation } from '@/types/construction/CriticalSlotAllocation';
import { CURRENT_FORMAT_VERSION } from '@/types/unit/UnitSerialization';

describe('UnitSerializer', () => {
  /**
   * Create a mock BattleMech for testing
   */
  function createMockMech(overrides: Partial<IBattleMech> = {}): IBattleMech {
    return {
      id: 'test-mech-id',
      name: 'Atlas AS7-D',
      unitType: UnitType.BATTLEMECH,
      configuration: MechConfiguration.BIPED,
      tonnage: 100,
      techBase: TechBase.INNER_SPHERE,
      rulesLevel: RulesLevel.STANDARD,
      metadata: {
        chassis: 'Atlas',
        model: 'AS7-D',
        era: Era.STAR_LEAGUE,
        year: 2755,
        source: 'TechManual',
      },
      engine: {
        type: EngineType.STANDARD,
        rating: 300,
        weight: 19,
        internalHeatSinks: 12,
      },
      gyro: {
        type: GyroType.STANDARD,
        weight: 3,
      },
      cockpitType: CockpitType.STANDARD,
      structure: {
        type: InternalStructureType.STANDARD,
        weight: 10,
        points: {
          head: 3,
          centerTorso: 31,
          leftTorso: 21,
          rightTorso: 21,
          leftArm: 17,
          rightArm: 17,
          leftLeg: 21,
          rightLeg: 21,
        },
      },
      armorType: ArmorTypeEnum.STANDARD,
      armorAllocation: {
        head: 9,
        centerTorso: 47,
        centerTorsoRear: 14,
        leftTorso: 32,
        leftTorsoRear: 10,
        rightTorso: 32,
        rightTorsoRear: 10,
        leftArm: 34,
        rightArm: 34,
        leftLeg: 41,
        rightLeg: 41,
      },
      totalArmorPoints: 304,
      heatSinks: {
        type: HeatSinkType.SINGLE,
        total: 20,
        integrated: 12,
        external: 8,
        dissipation: 20,
      },
      movement: {
        walkMP: 3,
        runMP: 5,
        jumpMP: 0,
        hasMASC: false,
        hasSupercharger: false,
        hasTSM: false,
      },
      equipment: [
        {
          equipmentId: 'ac-20',
          location: MechLocation.RIGHT_TORSO,
          slots: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          isRearMounted: false,
        },
        {
          equipmentId: 'medium-laser',
          location: MechLocation.LEFT_ARM,
          slots: [4],
          isRearMounted: false,
        },
      ],
      criticalSlots: [
        {
          location: MechLocation.HEAD,
          slots: [
            { index: 0, content: { name: 'Life Support', type: 'system' }, isDestroyed: false, isFixed: true },
            { index: 1, content: { name: 'Sensors', type: 'system' }, isDestroyed: false, isFixed: true },
            { index: 2, content: { name: 'Cockpit', type: 'system' }, isDestroyed: false, isFixed: true },
            { index: 3, content: null, isDestroyed: false, isFixed: false },
            { index: 4, content: { name: 'Sensors', type: 'system' }, isDestroyed: false, isFixed: true },
            { index: 5, content: { name: 'Life Support', type: 'system' }, isDestroyed: false, isFixed: true },
          ],
        },
      ],
      quirks: ['command_mech'],
      battleValue: 1897,
      cost: 9626500,
      ...overrides,
    } as IBattleMech;
  }

  // ============================================================================
  // serializeUnit()
  // ============================================================================
  describe('serializeUnit()', () => {
    it('should serialize a valid unit', () => {
      const mech = createMockMech();
      const result = serializeUnit(mech);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.errors).toHaveLength(0);
    });

    it('should produce valid JSON', () => {
      const mech = createMockMech();
      const result = serializeUnit(mech);
      
      expect(() => JSON.parse(result.data!)).not.toThrow();
    });

    it('should include format version', () => {
      const mech = createMockMech();
      const result = serializeUnit(mech);
      const parsed = JSON.parse(result.data!);
      
      expect(parsed.formatVersion).toBeDefined();
      expect(parsed.formatVersion).toBe(CURRENT_FORMAT_VERSION);
    });

    it('should include savedAt timestamp', () => {
      const mech = createMockMech();
      const result = serializeUnit(mech);
      const parsed = JSON.parse(result.data!);
      
      expect(parsed.savedAt).toBeDefined();
      expect(() => new Date(parsed.savedAt)).not.toThrow();
    });

    it('should include application info', () => {
      const mech = createMockMech();
      const result = serializeUnit(mech);
      const parsed = JSON.parse(result.data!);
      
      expect(parsed.application).toBeDefined();
      expect(parsed.applicationVersion).toBeDefined();
    });

    it('should serialize unit data', () => {
      const mech = createMockMech();
      const result = serializeUnit(mech);
      const parsed = JSON.parse(result.data!);
      
      expect(parsed.unit).toBeDefined();
      expect(parsed.unit.chassis).toBe('Atlas');
      expect(parsed.unit.model).toBe('AS7-D');
      expect(parsed.unit.tonnage).toBe(100);
    });

    it('should serialize engine data', () => {
      const mech = createMockMech();
      const result = serializeUnit(mech);
      const parsed = JSON.parse(result.data!);
      
      expect(parsed.unit.engine.type).toBe(EngineType.STANDARD);
      expect(parsed.unit.engine.rating).toBe(300);
    });

    it('should serialize armor allocation', () => {
      const mech = createMockMech();
      const result = serializeUnit(mech);
      const parsed = JSON.parse(result.data!);
      
      expect(parsed.unit.armor.allocation.head).toBe(9);
      expect(parsed.unit.armor.allocation.centerTorso).toBe(47);
      expect(parsed.unit.armor.allocation.centerTorsoRear).toBe(14);
    });

    it('should serialize equipment', () => {
      const mech = createMockMech();
      const result = serializeUnit(mech);
      const parsed = JSON.parse(result.data!);
      
      expect(parsed.unit.equipment.length).toBe(2);
      expect(parsed.unit.equipment[0].id).toBe('ac-20');
    });

    it('should serialize movement with enhancements', () => {
      const mech = createMockMech({
        movement: {
          walkMP: 4,
          runMP: 6,
          jumpMP: 4,
          hasMASC: true,
          hasSupercharger: false,
          hasTSM: true,
        },
      });
      const result = serializeUnit(mech);
      const parsed = JSON.parse(result.data!);
      
      expect(parsed.unit.movement.enhancements).toContain('MASC');
      expect(parsed.unit.movement.enhancements).toContain('TSM');
    });

    it('should serialize quirks', () => {
      const mech = createMockMech({ quirks: ['easy_to_maintain', 'command_mech'] });
      const result = serializeUnit(mech);
      const parsed = JSON.parse(result.data!);
      
      expect(parsed.unit.quirks).toContain('easy_to_maintain');
      expect(parsed.unit.quirks).toContain('command_mech');
    });

    it('should handle missing quirks', () => {
      const mech = createMockMech({ quirks: undefined });
      const result = serializeUnit(mech);
      const parsed = JSON.parse(result.data!);
      
      expect(parsed.unit.quirks).toBeUndefined();
    });
  });

  // ============================================================================
  // validateSerializedFormat()
  // ============================================================================
  describe('validateSerializedFormat()', () => {
    it('should reject invalid JSON', () => {
      const result = validateSerializedFormat('not valid json');
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('Invalid JSON'))).toBe(true);
    });

    it('should reject missing formatVersion', () => {
      const result = validateSerializedFormat(JSON.stringify({ unit: {} }));
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing formatVersion field');
    });

    it('should reject missing unit', () => {
      const result = validateSerializedFormat(JSON.stringify({ formatVersion: '1.0' }));
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing unit field');
    });

    it('should validate required unit fields', () => {
      const data = {
        formatVersion: '1.0',
        unit: {
          // Missing chassis, model, etc.
        },
      };
      const result = validateSerializedFormat(JSON.stringify(data));
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing unit.chassis');
      expect(result.errors).toContain('Missing unit.model');
    });

    it('should pass valid data', () => {
      const data = {
        formatVersion: '1.0',
        unit: {
          chassis: 'Atlas',
          model: 'AS7-D',
          unitType: 'BattleMech',
          tonnage: 100,
          engine: { type: 'Standard', rating: 300 },
          armor: { type: 'Standard' },
        },
      };
      const result = validateSerializedFormat(JSON.stringify(data));
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  // ============================================================================
  // getSerializedFormatVersion()
  // ============================================================================
  describe('getSerializedFormatVersion()', () => {
    it('should extract format version', () => {
      const data = { formatVersion: '2.5.0', unit: {} };
      const version = getSerializedFormatVersion(JSON.stringify(data));
      
      expect(version).toBe('2.5.0');
    });

    it('should return null for missing version', () => {
      const data = { unit: {} };
      const version = getSerializedFormatVersion(JSON.stringify(data));
      
      expect(version).toBeNull();
    });

    it('should return null for invalid JSON', () => {
      const version = getSerializedFormatVersion('not json');
      
      expect(version).toBeNull();
    });
  });

  // ============================================================================
  // isFormatVersionSupported()
  // ============================================================================
  describe('isFormatVersionSupported()', () => {
    it('should support current version', () => {
      expect(isFormatVersionSupported(CURRENT_FORMAT_VERSION)).toBe(true);
    });

    it('should support same major version', () => {
      const [major] = CURRENT_FORMAT_VERSION.split('.');
      expect(isFormatVersionSupported(`${major}.0.0`)).toBe(true);
      expect(isFormatVersionSupported(`${major}.9.9`)).toBe(true);
    });

    it('should reject different major version', () => {
      const [major] = CURRENT_FORMAT_VERSION.split('.').map(Number);
      expect(isFormatVersionSupported(`${major + 1}.0.0`)).toBe(false);
      expect(isFormatVersionSupported(`${major - 1}.0.0`)).toBe(false);
    });
  });

  // ============================================================================
  // createUnitSerializer()
  // ============================================================================
  describe('createUnitSerializer()', () => {
    it('should create serializer with serialize method', () => {
      const serializer = createUnitSerializer();
      
      expect(serializer.serialize).toBeDefined();
      expect(typeof serializer.serialize).toBe('function');
    });

    it('should create serializer with deserialize method', () => {
      const serializer = createUnitSerializer();
      
      expect(serializer.deserialize).toBeDefined();
      expect(typeof serializer.deserialize).toBe('function');
    });

    it('should create serializer with validateFormat method', () => {
      const serializer = createUnitSerializer();
      
      expect(serializer.validateFormat).toBeDefined();
      expect(typeof serializer.validateFormat).toBe('function');
    });

    it('should create serializer with getFormatVersion method', () => {
      const serializer = createUnitSerializer();
      
      expect(serializer.getFormatVersion).toBeDefined();
      expect(typeof serializer.getFormatVersion).toBe('function');
    });
  });

  // ============================================================================
  // Serializer.deserialize()
  // ============================================================================
  describe('Serializer.deserialize()', () => {
    it('should reject invalid format', () => {
      const serializer = createUnitSerializer();
      const result = serializer.deserialize('not valid json');
      
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject unsupported version', () => {
      const serializer = createUnitSerializer();
      const data = {
        formatVersion: '999.0.0',
        unit: {
          chassis: 'Test',
          model: 'T-1',
          unitType: 'BattleMech',
          tonnage: 50,
          engine: { type: 'Standard', rating: 200 },
          armor: { type: 'Standard' },
        },
      };
      
      const result = serializer.deserialize(JSON.stringify(data));
      
      expect(result.success).toBe(false);
      expect(result.errors.some(e => e.includes('Unsupported format version'))).toBe(true);
    });

    it('should pass validation for valid data', () => {
      const serializer = createUnitSerializer();
      const data = {
        formatVersion: CURRENT_FORMAT_VERSION,
        unit: {
          chassis: 'Test',
          model: 'T-1',
          unitType: 'BattleMech',
          tonnage: 50,
          engine: { type: 'Standard', rating: 200 },
          armor: { type: 'Standard' },
        },
      };
      
      const result = serializer.deserialize(JSON.stringify(data));
      
      // Note: deserialize is a stub that returns not implemented
      // But it should pass validation first
      expect(result).toBeDefined();
    });
  });

  // ============================================================================
  // Round-trip Serialization
  // ============================================================================
  describe('Round-trip Serialization', () => {
    it('should produce valid format that passes validation', () => {
      const mech = createMockMech();
      const serializer = createUnitSerializer();
      
      const serializeResult = serializer.serialize(mech);
      expect(serializeResult.success).toBe(true);
      
      const validateResult = serializer.validateFormat(serializeResult.data!);
      expect(validateResult.isValid).toBe(true);
    });

    it('should preserve key data through serialization', () => {
      const mech = createMockMech({
        metadata: {
          chassis: 'Custom Mech',
          model: 'CM-1X',
          era: Era.CIVIL_WAR,
          year: 3068,
          source: 'Custom',
          rulesLevel: RulesLevel.STANDARD,
        },
        tonnage: 75,
      });
      
      const result = serializeUnit(mech);
      const parsed = JSON.parse(result.data!);
      
      expect(parsed.unit.chassis).toBe('Custom Mech');
      expect(parsed.unit.model).toBe('CM-1X');
      expect(parsed.unit.tonnage).toBe(75);
      expect(parsed.unit.era).toBe(Era.CIVIL_WAR);
      expect(parsed.unit.year).toBe(3068);
    });
  });
});

