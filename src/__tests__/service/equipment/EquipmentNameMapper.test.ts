/**
 * Tests for Equipment Name Mapper
 */

import { EquipmentNameMapper } from '@/services/equipment/EquipmentNameMapper';
import { TechBase } from '@/types/enums/TechBase';

// Mock the equipment registry
jest.mock('@/services/equipment/EquipmentRegistry', () => ({
  getEquipmentRegistry: jest.fn().mockReturnValue({
    isInitialized: () => true,
    lookup: jest.fn().mockReturnValue({ found: false, equipment: null, category: null }),
  }),
}));

describe('EquipmentNameMapper', () => {
  let mapper: EquipmentNameMapper;

  beforeEach(() => {
    // Reset singleton for each test
    // @ts-expect-error Accessing private static for testing
    EquipmentNameMapper.instance = null;
    mapper = EquipmentNameMapper.getInstance();
  });

  describe('Singleton', () => {
    it('should return the same instance', () => {
      const mapper1 = EquipmentNameMapper.getInstance();
      const mapper2 = EquipmentNameMapper.getInstance();
      expect(mapper1).toBe(mapper2);
    });
  });

  describe('mapName', () => {
    it('should map well-known weapon names', () => {
      const result = mapper.mapName('Medium Laser');
      expect(result.equipmentId).toBe('medium-laser');
      expect(result.confidence).toBe('exact');
    });

    it('should map AC variants', () => {
      expect(mapper.mapName('Autocannon/5').equipmentId).toBe('ac-5');
      expect(mapper.mapName('AC/5').equipmentId).toBe('ac-5');
    });

    it('should map PPC', () => {
      const result = mapper.mapName('PPC');
      expect(result.equipmentId).toBe('ppc');
    });

    it('should map missile weapons', () => {
      expect(mapper.mapName('LRM 10').equipmentId).toBe('lrm-10');
      expect(mapper.mapName('SRM 4').equipmentId).toBe('srm-4');
    });

    it('should map Clan weapons', () => {
      const result = mapper.mapName('Clan ER Large Laser');
      expect(result.equipmentId).toBe('clan-er-large-laser');
    });

    it('should map electronics', () => {
      expect(mapper.mapName('Guardian ECM Suite').equipmentId).toBe('guardian-ecm');
      expect(mapper.mapName('Beagle Active Probe').equipmentId).toBe('beagle-active-probe');
    });

    it('should map heat sinks', () => {
      const singleResult = mapper.mapName('Heat Sink');
      expect(singleResult.equipmentId).toBe('single-heat-sink');
      
      const doubleResult = mapper.mapName('Double Heat Sink');
      expect(doubleResult.equipmentId).toBe('double-heat-sink');
    });

    it('should map jump jets', () => {
      const result = mapper.mapName('Jump Jet');
      expect(result.equipmentId).toBe('jump-jet-medium');
    });

    it('should handle unknown equipment', () => {
      const result = mapper.mapName('Unknown Equipment XYZ');
      expect(result.success).toBe(false);
      expect(result.confidence).toBe('unknown');
    });
  });

  describe('mapName with tech base', () => {
    it('should prefer IS variants for IS tech base', () => {
      const result = mapper.mapName('ER Medium Laser', TechBase.INNER_SPHERE);
      expect(result.equipmentId).toBe('er-medium-laser');
    });

    it('should handle Clan tech base', () => {
      const result = mapper.mapName('ER Medium Laser', TechBase.CLAN);
      expect(result.success).toBe(true);
    });
  });

  describe('normalization', () => {
    it('should handle case variations', () => {
      const result = mapper.mapName('MEDIUM LASER');
      expect(result.success).toBe(true);
    });

    it('should handle extra whitespace', () => {
      const result = mapper.mapName('  Medium   Laser  ');
      expect(result.success).toBe(true);
    });
  });

  describe('getStats', () => {
    it('should track mapping statistics', () => {
      mapper.mapName('Medium Laser');
      mapper.mapName('Unknown Item');
      
      const stats = mapper.getStats();
      expect(stats.totalMappings).toBeDefined();
    });

    it('should track unknown items', () => {
      mapper.mapName('Unknown Equipment ABC');
      mapper.mapName('Unknown Equipment DEF');
      
      const stats = mapper.getStats();
      expect(stats.unknownItems.length).toBeGreaterThan(0);
    });
  });
});

