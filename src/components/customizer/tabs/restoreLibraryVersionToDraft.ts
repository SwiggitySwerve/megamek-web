import type { StoreApi } from 'zustand';

import type { UnitStore } from '@/stores/unitState';

import { getEquipmentLookupService } from '@/services/equipment/EquipmentLookupService';
import { getEquipmentRegistry } from '@/services/equipment/EquipmentRegistry';
import { customUnitApiService } from '@/services/units/CustomUnitApiService';
import {
  parseUnit,
  unitLoaderService,
} from '@/services/units/unitLoaderService';
import { runUnitEditTransaction } from '@/stores/unit/unitEditHistory';
import {
  getEditableUnitSnapshot,
  getUnitEditFingerprint,
} from '@/stores/unit/unitEditSnapshot';
import { getUnitStore } from '@/stores/unitStoreRegistry';

export class StaleLibraryRestoreError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StaleLibraryRestoreError';
  }
}

export interface ILibraryRestoreRequest {
  readonly store: StoreApi<UnitStore>;
  readonly draftId: string;
  readonly libraryId: string;
  readonly version: number;
  readonly isCurrent?: () => boolean;
}

function assertRestoreStillCurrent(
  request: ILibraryRestoreRequest,
  fingerprintAtStart: string,
): void {
  if (
    request.isCurrent?.() === false ||
    request.store.getState().librarySave?.id !== request.libraryId
  ) {
    throw new StaleLibraryRestoreError(
      'This restore request is no longer current.',
    );
  }
  if (getUnitStore(request.draftId) !== request.store) {
    throw new StaleLibraryRestoreError('This unit is no longer open.');
  }
  if (getUnitEditFingerprint(request.store.getState()) !== fingerprintAtStart) {
    throw new StaleLibraryRestoreError(
      'The draft changed while this version was loading. Restore was not applied.',
    );
  }
}

/** Fetch a library version and apply it as one undoable draft edit. */
export async function restoreLibraryVersionToDraft(
  request: ILibraryRestoreRequest,
): Promise<void> {
  const fingerprintAtStart = getUnitEditFingerprint(request.store.getState());
  const sourceDefinition = request.store.getState().sourceDefinition;
  assertRestoreStillCurrent(request, fingerprintAtStart);

  const versionData = await customUnitApiService.getVersion(
    request.libraryId,
    request.version,
  );
  if (!versionData?.data || versionData.version !== request.version) {
    throw new Error(`Failed to load library version ${request.version}.`);
  }

  assertRestoreStillCurrent(request, fingerprintAtStart);

  await getEquipmentLookupService().initialize();
  await getEquipmentRegistry().initialize();
  const serialized = parseUnit(
    versionData.data,
    `library ${request.libraryId} v${request.version}`,
  );
  const normalized = unitLoaderService.mapToUnitState(
    serialized,
    false,
    sourceDefinition,
  );

  assertRestoreStillCurrent(request, fingerprintAtStart);

  runUnitEditTransaction(
    request.store,
    `Restore library v${request.version}`,
    () => {
      request.store.setState({
        ...getEditableUnitSnapshot(normalized),
        lastModifiedAt: Date.now(),
      });
    },
  );
}
