/**
 * Unit Persistence Types
 * 
 * Types for custom unit storage and version history.
 * 
 * @spec openspec/specs/unit-versioning/spec.md
 */

import { TechBase } from '../enums/TechBase';
import { Era } from '../enums/Era';
import { RulesLevel } from '../enums/RulesLevel';
import { WeightClass } from '../enums/WeightClass';

/**
 * Custom unit record as stored in database
 */
export interface ICustomUnitRecord {
  readonly id: string;
  readonly chassis: string;
  readonly variant: string;
  readonly tonnage: number;
  readonly techBase: TechBase;
  readonly era: Era;
  readonly rulesLevel: RulesLevel;
  readonly unitType: string;
  readonly data: string; // JSON string of ISerializedUnit
  readonly currentVersion: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * Custom unit index entry (lightweight for listing)
 */
export interface ICustomUnitIndexEntry {
  readonly id: string;
  readonly chassis: string;
  readonly variant: string;
  readonly tonnage: number;
  readonly techBase: TechBase;
  readonly era: Era;
  readonly rulesLevel: RulesLevel;
  readonly unitType: string;
  readonly weightClass: WeightClass;
  readonly currentVersion: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * Version history entry
 */
export interface IVersionEntry {
  readonly id: string;
  readonly unitId: string;
  readonly version: number;
  readonly savedAt: string;
  readonly notes: string | null;
  readonly revertSource: number | null;
}

/**
 * Full version record with data
 */
export interface IVersionRecord extends IVersionEntry {
  readonly data: string; // JSON string of ISerializedUnit
}

/**
 * Version metadata for listing
 */
export interface IVersionMetadata {
  readonly version: number;
  readonly savedAt: string;
  readonly notes: string | null;
  readonly revertSource: number | null;
}

/**
 * Create unit request
 */
export interface ICreateUnitRequest {
  readonly chassis: string;
  readonly variant: string;
  readonly data: Record<string, unknown>; // ISerializedUnit
  readonly notes?: string;
}

/**
 * Update unit request
 */
export interface IUpdateUnitRequest {
  readonly data: Record<string, unknown>; // ISerializedUnit
  readonly notes?: string;
}

/**
 * Revert request
 */
export interface IRevertRequest {
  readonly targetVersion: number;
  readonly notes?: string;
}

/**
 * Unit operation result
 */
export interface IUnitOperationResult {
  readonly success: boolean;
  readonly id?: string;
  readonly version?: number;
  readonly error?: string;
  readonly errorCode?: UnitErrorCode;
}

/**
 * Error codes for unit operations
 */
export enum UnitErrorCode {
  DUPLICATE_NAME = 'DUPLICATE_NAME',
  NOT_FOUND = 'NOT_FOUND',
  VERSION_NOT_FOUND = 'VERSION_NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  CANONICAL_PROTECTED = 'CANONICAL_PROTECTED',
}

/**
 * Clone name suggestion
 */
export interface ICloneNameSuggestion {
  readonly chassis: string;
  readonly variant: string;
  readonly suggestedVariant: string;
}

/**
 * Serialized unit envelope for export/import
 */
export interface ISerializedUnitEnvelope {
  readonly formatVersion: string;
  readonly savedAt: string;
  readonly application: string;
  readonly applicationVersion: string;
  readonly unit: Record<string, unknown>; // ISerializedUnit
}

/**
 * Import result
 */
export interface IImportResult {
  readonly success: boolean;
  readonly unitId?: string;
  readonly error?: string;
  readonly suggestedName?: string;
  readonly validationErrors?: readonly string[];
}

/**
 * Export result
 */
export interface IExportResult {
  readonly success: boolean;
  readonly data?: ISerializedUnitEnvelope;
  readonly filename?: string;
  readonly error?: string;
}

