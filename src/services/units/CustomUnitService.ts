/**
 * Custom Unit Service
 * 
 * CRUD operations for user-created unit variants stored in IndexedDB.
 * 
 * @spec openspec/specs/unit-services/spec.md
 */

import { v4 as uuidv4 } from 'uuid';
import { IUnitIndexEntry } from '../common/types';
import { NotFoundError } from '../common/errors';
import { indexedDBService, STORES } from '../persistence/IndexedDBService';
import { IFullUnit } from './CanonicalUnitService';
import { TechBase } from '@/types/enums/TechBase';
import { Era } from '@/types/enums/Era';
import { WeightClass, getWeightClass } from '@/types/enums/WeightClass';

/**
 * Custom unit service interface
 */
export interface ICustomUnitService {
  create(unit: IFullUnit): Promise<string>;
  update(id: string, unit: IFullUnit): Promise<void>;
  delete(id: string): Promise<void>;
  getById(id: string): Promise<IFullUnit | null>;
  list(): Promise<readonly IUnitIndexEntry[]>;
  exists(id: string): Promise<boolean>;
}

/**
 * Custom Unit Service implementation
 */
export class CustomUnitService implements ICustomUnitService {
  private initialized = false;

  /**
   * Ensure database is initialized
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await indexedDBService.initialize();
      this.initialized = true;
    }
  }

  /**
   * Create a new custom unit
   * @returns The generated unique ID
   */
  async create(unit: IFullUnit): Promise<string> {
    await this.ensureInitialized();
    
    const id = `custom-${uuidv4()}`;
    const unitWithId = { ...unit, id };
    
    await indexedDBService.put(STORES.CUSTOM_UNITS, id, unitWithId);
    
    return id;
  }

  /**
   * Update an existing custom unit
   */
  async update(id: string, unit: IFullUnit): Promise<void> {
    await this.ensureInitialized();
    
    const existing = await this.getById(id);
    if (!existing) {
      throw new NotFoundError('Custom Unit', id);
    }
    
    const unitWithId = { ...unit, id };
    await indexedDBService.put(STORES.CUSTOM_UNITS, id, unitWithId);
  }

  /**
   * Delete a custom unit
   */
  async delete(id: string): Promise<void> {
    await this.ensureInitialized();
    await indexedDBService.delete(STORES.CUSTOM_UNITS, id);
  }

  /**
   * Get a custom unit by ID
   */
  async getById(id: string): Promise<IFullUnit | null> {
    await this.ensureInitialized();
    const unit = await indexedDBService.get<IFullUnit>(STORES.CUSTOM_UNITS, id);
    return unit || null;
  }

  /**
   * List all custom units as index entries
   */
  async list(): Promise<readonly IUnitIndexEntry[]> {
    await this.ensureInitialized();
    const units = await indexedDBService.getAll<IFullUnit>(STORES.CUSTOM_UNITS);
    
    return units.map(unit => this.toIndexEntry(unit));
  }

  /**
   * Check if a custom unit exists
   */
  async exists(id: string): Promise<boolean> {
    const unit = await this.getById(id);
    return unit !== null;
  }

  /**
   * Convert full unit to index entry
   */
  private toIndexEntry(unit: IFullUnit): IUnitIndexEntry {
    const tonnage = typeof unit.tonnage === 'number' ? unit.tonnage : 0;
    
    return {
      id: unit.id,
      name: `${unit.chassis} ${unit.variant}`,
      chassis: unit.chassis,
      variant: unit.variant,
      tonnage,
      techBase: unit.techBase as TechBase || TechBase.INNER_SPHERE,
      era: unit.era as Era || Era.SUCCESSION_WARS,
      weightClass: getWeightClass(tonnage),
      unitType: (unit.unitType as IUnitIndexEntry['unitType']) || 'BattleMech',
      filePath: '', // Custom units don't have file paths
    };
  }
}

// Singleton instance
export const customUnitService = new CustomUnitService();

