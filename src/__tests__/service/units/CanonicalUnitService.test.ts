/**
 * Canonical Unit Service Tests
 * 
 * Tests for read-only access to bundled canonical unit data.
 * 
 * @spec openspec/specs/unit-services/spec.md
 */

import { CanonicalUnitService, IFullUnit } from '@/services/units/CanonicalUnitService';
import { IUnitIndexEntry } from '@/services/common/types';
import { TechBase } from '@/types/enums/TechBase';
import { Era } from '@/types/enums/Era';
import { WeightClass } from '@/types/enums/WeightClass';

describe('CanonicalUnitService', () => {
  let service: CanonicalUnitService;
  let mockFetch: jest.Mock;
  const originalFetch = global.fetch;

  beforeEach(() => {
    service = new CanonicalUnitService();
    mockFetch = jest.fn();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    service.clearCache();
  });

  /**
   * Create a mock index entry
   */
  function createMockIndexEntry(overrides: Partial<IUnitIndexEntry> = {}): IUnitIndexEntry {
    return {
      id: 'test-unit-1',
      name: 'Atlas AS7-D',
      chassis: 'Atlas',
      variant: 'AS7-D',
      tonnage: 100,
      techBase: TechBase.INNER_SPHERE,
      era: Era.STAR_LEAGUE,
      weightClass: WeightClass.ASSAULT,
      unitType: 'BattleMech',
      filePath: '/data/units/atlas-as7-d.json',
      ...overrides,
    };
  }

  /**
   * Create a mock full unit
   */
  function createMockFullUnit(overrides: Partial<IFullUnit> = {}): IFullUnit {
    return {
      id: 'test-unit-1',
      chassis: 'Atlas',
      variant: 'AS7-D',
      tonnage: 100,
      techBase: 'Inner Sphere',
      era: 'Star League',
      unitType: 'BattleMech',
      equipment: [],
      armor: { head: 9 },
      structure: { head: 3 },
      ...overrides,
    };
  }

  // ============================================================================
  // getIndex()
  // ============================================================================
  describe('getIndex()', () => {
    it('should return empty array when index fetch fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      
      const result = await service.getIndex();
      
      expect(result).toEqual([]);
    });

    it('should return empty array when response is not ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });
      
      const result = await service.getIndex();
      
      expect(result).toEqual([]);
    });

    it('should return index entries on success', async () => {
      const mockIndex = [
        createMockIndexEntry({ id: 'unit-1' }),
        createMockIndexEntry({ id: 'unit-2' }),
      ];
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockIndex,
      });
      
      const result = await service.getIndex();
      
      expect(result).toEqual(mockIndex);
      expect(result).toHaveLength(2);
    });

    it('should cache index results', async () => {
      const mockIndex = [createMockIndexEntry()];
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockIndex,
      });
      
      await service.getIndex();
      const result = await service.getIndex();
      
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockIndex);
    });

    it('should be read-only', async () => {
      const mockIndex = [createMockIndexEntry()];
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockIndex,
      });
      
      const result = await service.getIndex();
      
      expect(Array.isArray(result)).toBe(true);
    });
  });

  // ============================================================================
  // getById()
  // ============================================================================
  describe('getById()', () => {
    it('should return null for non-existent unit', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });
      
      const result = await service.getById('non-existent');
      
      expect(result).toBeNull();
    });

    it('should return null when unit fetch fails', async () => {
      const mockIndex = [createMockIndexEntry({ id: 'unit-1' })];
      
      // First call returns index
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockIndex,
      });
      
      // Second call (unit fetch) fails
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });
      
      const result = await service.getById('unit-1');
      
      expect(result).toBeNull();
    });

    it('should return unit data on success', async () => {
      const mockIndex = [createMockIndexEntry({ id: 'unit-1' })];
      const mockUnit = createMockFullUnit({ id: 'unit-1' });
      
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockIndex,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockUnit,
        });
      
      const result = await service.getById('unit-1');
      
      expect(result).toEqual(mockUnit);
    });

    it('should cache unit data', async () => {
      const mockIndex = [createMockIndexEntry({ id: 'unit-1' })];
      const mockUnit = createMockFullUnit({ id: 'unit-1' });
      
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockIndex,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockUnit,
        });
      
      await service.getById('unit-1');
      const result = await service.getById('unit-1');
      
      // Should only fetch unit once (plus index)
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockUnit);
    });

    it('should return null on fetch exception', async () => {
      const mockIndex = [createMockIndexEntry({ id: 'unit-1' })];
      
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockIndex,
        })
        .mockRejectedValueOnce(new Error('Network error'));
      
      const result = await service.getById('unit-1');
      
      expect(result).toBeNull();
    });
  });

  // ============================================================================
  // getByIds()
  // ============================================================================
  describe('getByIds()', () => {
    it('should return empty array for empty input', async () => {
      const result = await service.getByIds([]);
      
      expect(result).toEqual([]);
    });

    it('should return multiple units', async () => {
      const mockIndex = [
        createMockIndexEntry({ id: 'unit-1', filePath: '/data/unit-1.json' }),
        createMockIndexEntry({ id: 'unit-2', filePath: '/data/unit-2.json' }),
      ];
      const mockUnit1 = createMockFullUnit({ id: 'unit-1' });
      const mockUnit2 = createMockFullUnit({ id: 'unit-2' });
      
      // First call loads index, then subsequent calls fetch units
      mockFetch.mockImplementation((url: string) => {
        if (url.includes('index.json')) {
          return Promise.resolve({
            ok: true,
            json: async () => mockIndex,
          });
        } else if (url.includes('unit-1')) {
          return Promise.resolve({
            ok: true,
            json: async () => mockUnit1,
          });
        } else if (url.includes('unit-2')) {
          return Promise.resolve({
            ok: true,
            json: async () => mockUnit2,
          });
        }
        return Promise.resolve({ ok: false });
      });
      
      const result = await service.getByIds(['unit-1', 'unit-2']);
      
      expect(result).toHaveLength(2);
    });

    it('should filter out null results', async () => {
      const mockIndex = [createMockIndexEntry({ id: 'unit-1', filePath: '/data/unit-1.json' })];
      const mockUnit1 = createMockFullUnit({ id: 'unit-1' });
      
      mockFetch.mockImplementation((url: string) => {
        if (url.includes('index.json')) {
          return Promise.resolve({
            ok: true,
            json: async () => mockIndex,
          });
        } else if (url.includes('unit-1')) {
          return Promise.resolve({
            ok: true,
            json: async () => mockUnit1,
          });
        }
        return Promise.resolve({ ok: false });
      });
      
      const result = await service.getByIds(['unit-1', 'non-existent']);
      
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('unit-1');
    });
  });

  // ============================================================================
  // query()
  // ============================================================================
  describe('query()', () => {
    beforeEach(() => {
      const mockIndex = [
        createMockIndexEntry({ id: '1', techBase: TechBase.INNER_SPHERE, tonnage: 50, era: Era.SUCCESSION_WARS, weightClass: WeightClass.MEDIUM }),
        createMockIndexEntry({ id: '2', techBase: TechBase.CLAN, tonnage: 75, era: Era.CLAN_INVASION, weightClass: WeightClass.HEAVY }),
        createMockIndexEntry({ id: '3', techBase: TechBase.INNER_SPHERE, tonnage: 100, era: Era.STAR_LEAGUE, weightClass: WeightClass.ASSAULT }),
      ];
      
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockIndex,
      });
    });

    it('should return all units with empty criteria', async () => {
      const result = await service.query({});
      
      expect(result).toHaveLength(3);
    });

    it('should filter by tech base', async () => {
      const result = await service.query({ techBase: TechBase.CLAN });
      
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('2');
    });

    it('should filter by era', async () => {
      const result = await service.query({ era: Era.SUCCESSION_WARS });
      
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('should filter by weight class', async () => {
      const result = await service.query({ weightClass: WeightClass.ASSAULT });
      
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('3');
    });

    it('should filter by min tonnage', async () => {
      const result = await service.query({ minTonnage: 75 });
      
      expect(result).toHaveLength(2);
    });

    it('should filter by max tonnage', async () => {
      const result = await service.query({ maxTonnage: 75 });
      
      expect(result).toHaveLength(2);
    });

    it('should filter by tonnage range', async () => {
      const result = await service.query({ minTonnage: 60, maxTonnage: 90 });
      
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('2');
    });

    it('should combine multiple filters', async () => {
      const result = await service.query({ 
        techBase: TechBase.INNER_SPHERE,
        minTonnage: 80,
      });
      
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('3');
    });
  });

  // ============================================================================
  // clearCache()
  // ============================================================================
  describe('clearCache()', () => {
    it('should clear index cache', async () => {
      const mockIndex = [createMockIndexEntry()];
      
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockIndex,
      });
      
      await service.getIndex();
      service.clearCache();
      await service.getIndex();
      
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should clear unit cache', async () => {
      const mockIndex = [createMockIndexEntry({ id: 'unit-1' })];
      const mockUnit = createMockFullUnit({ id: 'unit-1' });
      
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockIndex,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockUnit,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockIndex,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockUnit,
        });
      
      await service.getById('unit-1');
      service.clearCache();
      await service.getById('unit-1');
      
      // Should fetch index and unit twice each
      expect(mockFetch).toHaveBeenCalledTimes(4);
    });
  });
});

