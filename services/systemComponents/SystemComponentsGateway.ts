/**
 * System Components Gateway
 * 
 * Single entry point for all system component operations.
 * Provides a clean API for accessing engines, gyros, structures, armor, etc.
 * with dynamic calculations based on unit context.
 */

import { SystemComponentsService, ComponentQueryCriteria, ValidationResult } from './SystemComponentsService'
import { UnitContext, createDefaultUnitContext } from './calculations/UnitContext'
import { EngineVariant } from './adapters/EngineAdapter'
import { GyroVariant } from './adapters/GyroAdapter'
import { StructureVariant } from './adapters/StructureAdapter'
import { TechBase } from '../../types/core/TechBase'

/**
 * Singleton instance
 */
let serviceInstance: SystemComponentsService | null = null

/**
 * Get or create service instance
 */
function getService(): SystemComponentsService {
  if (!serviceInstance) {
    serviceInstance = new SystemComponentsService()
  }
  return serviceInstance
}

/**
 * System Components Gateway
 * Static methods for easy access throughout the application
 */
export const SystemComponentsGateway = {
  // ===== ENGINE OPERATIONS =====

  /**
   * Get engines matching criteria
   */
  getEngines(criteria: {
    techBase: TechBase
    rulesLevel?: string[]
    unitTonnage: number
    desiredRating?: number
    availableByYear?: number
    ignoreYearRestrictions?: boolean
  }): EngineVariant[] {
    const service = getService()
    const context: UnitContext = {
      ...createDefaultUnitContext(),
      tonnage: criteria.unitTonnage,
      engineRating: criteria.desiredRating || 200,
      techBase: criteria.techBase,
      constructionYear: criteria.availableByYear || 3025
    }

    return service.getEngines({
      techBase: criteria.techBase,
      rulesLevel: criteria.rulesLevel,
      availableByYear: criteria.availableByYear,
      ignoreYearRestrictions: criteria.ignoreYearRestrictions
    }, context)
  },

  /**
   * Get a specific engine by ID with calculated properties
   */
  getEngineById(id: string, context: UnitContext): EngineVariant | null {
    return getService().getEngineById(id, context)
  },

  /**
   * Calculate engine weight for specific configuration
   */
  calculateEngineWeight(engineId: string, rating: number, tonnage: number): number {
    return getService().calculateEngineWeight(engineId, rating, tonnage)
  },

  // ===== GYRO OPERATIONS =====

  /**
   * Get gyros matching criteria
   */
  getGyros(criteria: {
    techBase: TechBase
    engineRating: number
    rulesLevel?: string[]
    availableByYear?: number
    ignoreYearRestrictions?: boolean
  }): GyroVariant[] {
    const service = getService()
    const context: UnitContext = {
      ...createDefaultUnitContext(),
      engineRating: criteria.engineRating,
      techBase: criteria.techBase,
      constructionYear: criteria.availableByYear || 3025
    }

    return service.getGyros({
      techBase: criteria.techBase,
      rulesLevel: criteria.rulesLevel,
      availableByYear: criteria.availableByYear,
      ignoreYearRestrictions: criteria.ignoreYearRestrictions
    }, context)
  },

  /**
   * Get a specific gyro by ID with calculated properties
   */
  getGyroById(id: string, context: UnitContext): GyroVariant | null {
    return getService().getGyroById(id, context)
  },

  /**
   * Calculate gyro weight for specific engine rating
   */
  calculateGyroWeight(gyroId: string, engineRating: number): number {
    return getService().calculateGyroWeight(gyroId, engineRating)
  },

  // ===== STRUCTURE OPERATIONS =====

  /**
   * Get structures matching criteria
   */
  getStructures(criteria: {
    techBase: TechBase
    unitType: string
    unitTonnage: number
    rulesLevel?: string[]
    availableByYear?: number
    ignoreYearRestrictions?: boolean
  }): StructureVariant[] {
    const service = getService()
    const context: UnitContext = {
      ...createDefaultUnitContext(),
      tonnage: criteria.unitTonnage,
      techBase: criteria.techBase,
      unitType: criteria.unitType as any,
      constructionYear: criteria.availableByYear || 3025
    }

    return service.getStructures({
      techBase: criteria.techBase,
      rulesLevel: criteria.rulesLevel,
      availableByYear: criteria.availableByYear,
      ignoreYearRestrictions: criteria.ignoreYearRestrictions
    }, context)
  },

  /**
   * Get a specific structure by ID with calculated properties
   */
  getStructureById(id: string, context: UnitContext): StructureVariant | null {
    return getService().getStructureById(id, context)
  },

  /**
   * Calculate structure weight for specific tonnage
   */
  calculateStructureWeight(structureId: string, tonnage: number): number {
    return getService().calculateStructureWeight(structureId, tonnage)
  },

  // ===== VALIDATION =====

  /**
   * Validate engine for unit configuration
   */
  validateEngineForUnit(engineId: string, unitConfig: UnitContext): ValidationResult {
    return getService().validateEngineForUnit(engineId, unitConfig)
  },

  /**
   * Validate gyro compatibility with engine
   */
  validateGyroWithEngine(gyroId: string, engineId: string, context: UnitContext): ValidationResult {
    return getService().validateGyroWithEngine(gyroId, engineId, context)
  },

  // ===== UTILITY =====

  /**
   * Create a unit context with default values
   */
  createContext(overrides?: Partial<UnitContext>): UnitContext {
    return {
      ...createDefaultUnitContext(),
      ...overrides
    }
  },

  /**
   * Reset service instance (useful for testing)
   */
  resetService(): void {
    serviceInstance = null
  }
}

// Export types for consumers
export type {
  UnitContext,
  ComponentQueryCriteria,
  ValidationResult,
  EngineVariant,
  GyroVariant,
  StructureVariant
}

