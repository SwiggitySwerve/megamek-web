/**
 * UnitManager.ts
 * Interface definitions for unit management classes used across the BattleTech editor.
 * Provides type-safe interfaces for UnitCriticalManager and related classes.
 */

import { UnitConfiguration } from '../utils/criticalSlots/UnitCriticalManagerTypes';
import { ArmorAnalysis } from '../utils/criticalSlots/UnitCalculationManager';

/**
 * Interface for unit critical manager - provides type-safe access to unit management methods
 * This interface represents the public API of UnitCriticalManager used by UI components
 */
export interface IUnitCriticalManager {
  /**
   * Get the current unit configuration
   */
  getConfiguration(): UnitConfiguration;

  /**
   * Get armor waste analysis
   */
  getArmorWasteAnalysis(): ArmorAnalysis;

  /**
   * Get maximum armor tonnage allowed
   */
  getMaxArmorTonnage(): number;
}

/**
 * Type guard to check if an object implements IUnitCriticalManager
 */
export function isUnitCriticalManager(value: unknown): value is IUnitCriticalManager {
  if (!value || typeof value !== 'object') {
    return false;
  }
  
  const obj = value as Record<string, unknown>;
  return typeof obj.getConfiguration === 'function' &&
         typeof obj.getArmorWasteAnalysis === 'function' &&
         typeof obj.getMaxArmorTonnage === 'function';
}

