/**
 * Canonical Unit Service
 * 
 * Provides read-only access to bundled canonical unit data.
 * Uses lazy loading for full unit data.
 * 
 * @spec openspec/specs/unit-services/spec.md
 */

import { IUnitIndexEntry, IUnitQueryCriteria } from '../common/types';
import { NotFoundError } from '../common/errors';

/**
 * Full unit data structure (placeholder - will be defined in types)
 */
export interface IFullUnit {
  readonly id: string;
  readonly chassis: string;
  readonly variant: string;
  readonly tonnage: number;
  readonly techBase: string;
  readonly era: string;
  readonly unitType: string;
  // Additional fields for complete unit data
  readonly equipment?: unknown[];
  readonly armor?: Record<string, number>;
  readonly structure?: Record<string, number>;
  [key: string]: unknown;
}

/**
 * Canonical unit service interface
 */
export interface ICanonicalUnitService {
  getIndex(): Promise<readonly IUnitIndexEntry[]>;
  getById(id: string): Promise<IFullUnit | null>;
  getByIds(ids: string[]): Promise<IFullUnit[]>;
  query(criteria: IUnitQueryCriteria): Promise<readonly IUnitIndexEntry[]>;
}

/**
 * Canonical Unit Service implementation
 */
export class CanonicalUnitService implements ICanonicalUnitService {
  private indexCache: IUnitIndexEntry[] | null = null;
  private unitCache: Map<string, IFullUnit> = new Map();
  private indexPath = '/data/units/index.json';

  /**
   * Load the lightweight unit index
   */
  async getIndex(): Promise<readonly IUnitIndexEntry[]> {
    if (this.indexCache) {
      return this.indexCache;
    }

    try {
      const response = await fetch(this.indexPath);
      if (!response.ok) {
        // Index doesn't exist yet - return empty array
        this.indexCache = [];
        return this.indexCache;
      }
      
      this.indexCache = await response.json();
      return this.indexCache || [];
    } catch {
      // Index not available - return empty array
      this.indexCache = [];
      return this.indexCache;
    }
  }

  /**
   * Get full unit data by ID (lazy loads from static JSON)
   */
  async getById(id: string): Promise<IFullUnit | null> {
    // Check cache first
    if (this.unitCache.has(id)) {
      return this.unitCache.get(id)!;
    }

    // Find in index to get file path
    const index = await this.getIndex();
    const entry = index.find(e => e.id === id);
    
    if (!entry) {
      return null;
    }

    try {
      const response = await fetch(entry.filePath);
      if (!response.ok) {
        return null;
      }
      
      const unit: IFullUnit = await response.json();
      this.unitCache.set(id, unit);
      return unit;
    } catch {
      return null;
    }
  }

  /**
   * Get multiple units by ID (parallel loading)
   */
  async getByIds(ids: string[]): Promise<IFullUnit[]> {
    const results = await Promise.all(
      ids.map(id => this.getById(id))
    );
    return results.filter((unit): unit is IFullUnit => unit !== null);
  }

  /**
   * Query units by criteria (filters index in memory)
   */
  async query(criteria: IUnitQueryCriteria): Promise<readonly IUnitIndexEntry[]> {
    let results = await this.getIndex();

    if (criteria.techBase !== undefined) {
      results = results.filter(e => e.techBase === criteria.techBase);
    }

    if (criteria.era !== undefined) {
      results = results.filter(e => e.era === criteria.era);
    }

    if (criteria.weightClass !== undefined) {
      results = results.filter(e => e.weightClass === criteria.weightClass);
    }

    if (criteria.unitType !== undefined) {
      results = results.filter(e => e.unitType === criteria.unitType);
    }

    if (criteria.minTonnage !== undefined) {
      results = results.filter(e => e.tonnage >= criteria.minTonnage!);
    }

    if (criteria.maxTonnage !== undefined) {
      results = results.filter(e => e.tonnage <= criteria.maxTonnage!);
    }

    return results;
  }

  /**
   * Clear caches (for testing)
   */
  clearCache(): void {
    this.indexCache = null;
    this.unitCache.clear();
  }
}

// Singleton instance
export const canonicalUnitService = new CanonicalUnitService();

