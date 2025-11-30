/**
 * Service Layer Registry
 * 
 * Central access point for all application services.
 * Services are instantiated as singletons.
 * 
 * @spec openspec/specs/unit-services/spec.md
 * @spec openspec/specs/equipment-services/spec.md
 * @spec openspec/specs/construction-services/spec.md
 * @spec openspec/specs/persistence-services/spec.md
 */

// Re-export common types and errors
export * from './common';

// Re-export persistence services
export * from './persistence';

// Re-export equipment services
export * from './equipment';

// Re-export unit services
export * from './units';

// Re-export construction services
export * from './construction';

// ============================================================================
// SERVICE REGISTRY
// ============================================================================

import { indexedDBService, fileService } from './persistence';
import { equipmentLookupService, equipmentCalculatorService } from './equipment';
import { canonicalUnitService, customUnitService, unitSearchService } from './units';
import { mechBuilderService, validationService, calculationService } from './construction';

/**
 * Centralized service registry for singleton access
 */
export const services = {
  // Persistence
  persistence: {
    db: indexedDBService,
    file: fileService,
  },

  // Equipment
  equipment: {
    lookup: equipmentLookupService,
    calculator: equipmentCalculatorService,
  },

  // Units
  units: {
    canonical: canonicalUnitService,
    custom: customUnitService,
    search: unitSearchService,
  },

  // Construction
  construction: {
    builder: mechBuilderService,
    validation: validationService,
    calculation: calculationService,
  },
} as const;

/**
 * Initialize all services that require async setup
 */
export async function initializeServices(): Promise<void> {
  // Initialize IndexedDB
  await services.persistence.db.initialize();
  
  // Initialize search index
  await services.units.search.initialize();
}

/**
 * Shutdown all services
 */
export function shutdownServices(): void {
  services.persistence.db.close();
}

