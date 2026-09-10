import React from 'react';
import { useStore, type StoreApi } from 'zustand';

import type { UnitStore } from '@/stores/unitState';

import { getUnitLibraryFingerprint } from '@/stores/unit/unitEditSnapshot';
import { getUnitStore } from '@/stores/unitStoreRegistry';

function librarySaveLabel(
  librarySave: UnitStore['librarySave'],
  isModified: boolean,
): string {
  if (!librarySave) return 'No library save yet';
  const match = isModified
    ? 'Changes since library save'
    : 'Matches library save';
  return `Last library save v${librarySave.version} · ${match}`;
}

function BoundUnitSaveStatus({
  store,
}: {
  store: StoreApi<UnitStore>;
}): React.ReactElement {
  const librarySave = useStore(store, (state) => state.librarySave);
  const isModified = useStore(store, (state) =>
    Boolean(
      state.librarySave &&
      getUnitLibraryFingerprint(state) !== state.librarySave.fingerprint,
    ),
  );
  const label = librarySaveLabel(librarySave, isModified);
  return (
    <span
      role="status"
      aria-live="off"
      data-state={librarySave ? (isModified ? 'changed' : 'matched') : 'none'}
      className="text-text-theme-secondary inline-flex min-w-0 items-center text-xs"
      title={`${label}. This is the last known library save for this draft, not a claim that it is the server latest.`}
    >
      <span className="min-w-0">{label}</span>
    </span>
  );
}

/** Visible last-known library receipt, never an invented server-latest claim. */
export function UnitSaveStatus({
  unitId,
}: {
  unitId: string;
}): React.ReactElement {
  const store = getUnitStore(unitId);
  if (!store) {
    return (
      <span
        role="status"
        aria-live="off"
        data-state="none"
        className="text-text-theme-secondary inline-flex min-w-0 items-center text-xs"
        title="No library save yet. This is the last known library save for this draft, not a claim that it is the server latest."
      >
        No library save yet
      </span>
    );
  }
  return <BoundUnitSaveStatus key={unitId} store={store} />;
}
