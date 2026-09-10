import React, { useEffect, useState } from 'react';

import { getUnitStore } from '@/stores/unitStoreRegistry';
import {
  getLatestStorageWriteReceipt,
  subscribeToStorageWriteReceipts,
} from '@/stores/utils/clientSafeStorage';

function draftStorageKey(unitId: string): string {
  return `megamek-unit-${unitId}`;
}

function receiptForUnit(
  unitId: string,
): { unitId: string; failed: boolean } | null {
  const latest = getLatestStorageWriteReceipt(draftStorageKey(unitId));
  if (!latest) return null;
  return { unitId, failed: latest.status === 'failed' };
}

/** Show only completed writes for the active draft, separately from library save. */
export function BrowserDraftStatus({
  unitId,
  compact = false,
}: {
  unitId: string;
  compact?: boolean;
}): React.ReactElement {
  const [receipt, setReceipt] = useState<{
    unitId: string;
    failed: boolean;
  } | null>(() => receiptForUnit(unitId));

  useEffect(() => {
    setReceipt(receiptForUnit(unitId));
    return subscribeToStorageWriteReceipts((next) => {
      if (next.key === draftStorageKey(unitId)) {
        setReceipt({ unitId, failed: next.status === 'failed' });
      }
    });
  }, [unitId]);

  const current = receipt?.unitId === unitId ? receipt : null;
  const failed = Boolean(current?.failed);
  const label = failed
    ? 'Draft save failed'
    : current
      ? 'Draft saved'
      : 'Browser draft';
  return (
    <span
      role="status"
      aria-live={failed ? 'polite' : 'off'}
      data-state={failed ? 'failed' : current ? 'saved' : 'pending'}
      className={`inline-flex min-w-0 shrink-0 items-center gap-1 text-xs whitespace-nowrap ${failed ? 'text-red-400' : 'text-text-theme-secondary'}`}
      title={`${label}. Browser drafts are separate from units saved to your library.`}
    >
      {compact && (
        <span
          aria-hidden="true"
          className={`h-2 w-2 rounded-full border ${failed ? 'border-red-400 bg-red-400' : current ? 'border-green-400 bg-green-400' : 'border-text-theme-muted bg-surface-base'}`}
        />
      )}
      <span>{label}</span>
      {failed && getUnitStore(unitId) && (
        <button
          type="button"
          className="min-h-11 px-2 underline"
          onClick={() => {
            try {
              getUnitStore(unitId)?.setState({});
            } catch {
              /* The failed write receipt keeps the error visible. */
            }
          }}
        >
          Retry browser draft
        </button>
      )}
    </span>
  );
}
