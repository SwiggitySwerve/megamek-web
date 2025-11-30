/**
 * Tests for Equipment Registry
 * 
 * Tests the registry's singleton pattern and lookup functionality.
 */

import { EquipmentRegistry, getEquipmentRegistry } from '@/services/equipment/EquipmentRegistry';
import { TechBase } from '@/types/enums/TechBase';
import { RulesLevel } from '@/types/enums/RulesLevel';

// Mock data with required properties
const mockWeapons = [
  { id: 'medium-laser', name: 'Medium Laser', techBase: TechBase.INNER_SPHERE, rulesLevel: RulesLevel.STANDARD },
  { id: 'ppc', name: 'PPC', techBase: TechBase.INNER_SPHERE, rulesLevel: RulesLevel.STANDARD },
];

const mockAmmo = [
  { id: 'ac-10-ammo', name: 'AC/10 Ammo', techBase: TechBase.INNER_SPHERE, rulesLevel: RulesLevel.STANDARD },
];

const mockElectronics = [
  { id: 'guardian-ecm', name: 'Guardian ECM Suite', techBase: TechBase.INNER_SPHERE, rulesLevel: RulesLevel.STANDARD },
];

const mockMisc = [
  { id: 'single-heat-sink', name: 'Heat Sink', techBase: TechBase.INNER_SPHERE, rulesLevel: RulesLevel.INTRODUCTORY },
  { id: 'double-heat-sink', name: 'Double Heat Sink', techBase: TechBase.INNER_SPHERE, rulesLevel: RulesLevel.STANDARD },
];

const allEquipment = [...mockWeapons, ...mockAmmo, ...mockElectronics, ...mockMisc];

jest.mock('@/services/equipment/EquipmentLoaderService', () => ({
  getEquipmentLoader: jest.fn(() => ({
    getIsLoaded: jest.fn().mockReturnValue(true),
    loadOfficialEquipment: jest.fn().mockResolvedValue(undefined),
    getAllWeapons: jest.fn().mockReturnValue([
      { id: 'medium-laser', name: 'Medium Laser', techBase: 'INNER_SPHERE', rulesLevel: 'STANDARD' },
      { id: 'ppc', name: 'PPC', techBase: 'INNER_SPHERE', rulesLevel: 'STANDARD' },
    ]),
    getAllAmmunition: jest.fn().mockReturnValue([
      { id: 'ac-10-ammo', name: 'AC/10 Ammo', techBase: 'INNER_SPHERE', rulesLevel: 'STANDARD' },
    ]),
    getAllElectronics: jest.fn().mockReturnValue([
      { id: 'guardian-ecm', name: 'Guardian ECM Suite', techBase: 'INNER_SPHERE', rulesLevel: 'STANDARD' },
    ]),
    getAllMiscEquipment: jest.fn().mockReturnValue([
      { id: 'single-heat-sink', name: 'Heat Sink', techBase: 'INNER_SPHERE', rulesLevel: 'INTRODUCTORY' },
      { id: 'double-heat-sink', name: 'Double Heat Sink', techBase: 'INNER_SPHERE', rulesLevel: 'STANDARD' },
    ]),
    getById: jest.fn((id: string) => {
      const all = [
        { id: 'medium-laser', name: 'Medium Laser', techBase: 'INNER_SPHERE', rulesLevel: 'STANDARD' },
        { id: 'ppc', name: 'PPC', techBase: 'INNER_SPHERE', rulesLevel: 'STANDARD' },
        { id: 'ac-10-ammo', name: 'AC/10 Ammo', techBase: 'INNER_SPHERE', rulesLevel: 'STANDARD' },
        { id: 'guardian-ecm', name: 'Guardian ECM Suite', techBase: 'INNER_SPHERE', rulesLevel: 'STANDARD' },
        { id: 'single-heat-sink', name: 'Heat Sink', techBase: 'INNER_SPHERE', rulesLevel: 'INTRODUCTORY' },
        { id: 'double-heat-sink', name: 'Double Heat Sink', techBase: 'INNER_SPHERE', rulesLevel: 'STANDARD' },
      ];
      return all.find(e => e.id === id) || null;
    }),
    getWeaponById: jest.fn((id: string) => mockWeapons.find(w => w.id === id) || null),
    getAmmunitionById: jest.fn((id: string) => mockAmmo.find(a => a.id === id) || null),
    getElectronicsById: jest.fn((id: string) => mockElectronics.find(e => e.id === id) || null),
    getMiscEquipmentById: jest.fn((id: string) => mockMisc.find(m => m.id === id) || null),
  })),
}));

describe('EquipmentRegistry', () => {
  let registry: EquipmentRegistry;

  beforeEach(async () => {
    // Reset singleton
    // @ts-expect-error Accessing private static for testing
    EquipmentRegistry.instance = null;
    registry = EquipmentRegistry.getInstance();
    await registry.initialize();
  });

  describe('Singleton', () => {
    it('should return the same instance', () => {
      const registry1 = EquipmentRegistry.getInstance();
      const registry2 = EquipmentRegistry.getInstance();
      expect(registry1).toBe(registry2);
    });

    it('should be accessible via getEquipmentRegistry', () => {
      const fromHelper = getEquipmentRegistry();
      expect(fromHelper).toBe(registry);
    });
  });

  describe('initialize', () => {
    it('should initialize successfully', async () => {
      // @ts-expect-error Accessing private static for testing
      EquipmentRegistry.instance = null;
      const newRegistry = EquipmentRegistry.getInstance();
      await expect(newRegistry.initialize()).resolves.not.toThrow();
    });

    it('should not reinitialize if already initialized', async () => {
      await expect(registry.initialize()).resolves.not.toThrow();
    });
  });

  describe('lookup', () => {
    it('should find equipment by ID', () => {
      const result = registry.lookup('medium-laser');
      expect(result.found).toBe(true);
      expect(result.equipment?.id).toBe('medium-laser');
    });

    it('should return not found for unknown equipment', () => {
      const result = registry.lookup('unknown-equipment');
      expect(result.found).toBe(false);
      expect(result.equipment).toBeNull();
    });
  });

  describe('isReady', () => {
    it('should return true after initialization', () => {
      expect(registry.isReady()).toBe(true);
    });
  });

  describe('getWeapon', () => {
    it('should return weapon by ID', () => {
      const weapon = registry.getWeapon('medium-laser');
      expect(weapon).toBeDefined();
    });

    it('should return null for unknown ID', () => {
      const weapon = registry.getWeapon('unknown-weapon');
      expect(weapon).toBeNull();
    });
  });

  describe('getAmmunition', () => {
    it('should call loader for ammunition by ID', () => {
      const ammo = registry.getAmmunition('ac-10-ammo');
      expect(ammo).toBeDefined();
    });
  });

  describe('getElectronics', () => {
    it('should call loader for electronics by ID', () => {
      const elec = registry.getElectronics('guardian-ecm');
      expect(elec).toBeDefined();
    });
  });

  describe('getMiscEquipment', () => {
    it('should call loader for misc equipment by ID', () => {
      const misc = registry.getMiscEquipment('single-heat-sink');
      expect(misc).toBeDefined();
    });
  });

  describe('resolveEquipmentName', () => {
    it('should resolve known equipment names to IDs', () => {
      const id = registry.resolveEquipmentName('Medium Laser');
      expect(id).toBe('medium-laser');
    });

    it('should return null for unknown names', () => {
      const id = registry.resolveEquipmentName('Unknown Equipment XYZ');
      expect(id).toBeNull();
    });
  });

  describe('getStats', () => {
    it('should return statistics object', () => {
      const stats = registry.getStats();
      expect(stats).toBeDefined();
      expect(typeof stats.totalItems).toBe('number');
      expect(typeof stats.weapons).toBe('number');
      expect(typeof stats.ammunition).toBe('number');
      expect(typeof stats.electronics).toBe('number');
      expect(typeof stats.miscellaneous).toBe('number');
    });
  });

  describe('reset', () => {
    it('should reset the registry state', () => {
      registry.reset();
      expect(registry.isReady()).toBe(false);
    });
  });
});

