import React, { useEffect, useState } from 'react';

import { subscribeToStorageWriteReceipts } from '@/stores/utils/clientSafeStorage';

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
  } | null>(null);

  useEffect(
    () =>
      subscribeToStorageWriteReceipts((next) => {
        if (next.key === `megamek-unit-${unitId}`) {
          setReceipt({ unitId, failed: next.status === 'failed' });
        }
      }),
    [unitId],
  );

  const current = receipt?.unitId === unitId ? receipt : null;
  const label = current?.failed
    ? 'Draft save failed'
    : current
      ? 'Draft saved'
      : 'Browser draft';
  return (
    <span
      role="status"
      aria-live="polite"
      data-state={current?.failed ? 'failed' : current ? 'saved' : 'pending'}
      className={`inline-flex shrink-0 items-center gap-1 text-xs whitespace-nowrap ${current?.failed ? 'text-red-400' : 'text-text-theme-secondary'}`}
      title={`${label}. Browser drafts are separate from units saved to your library.`}
    >
      {compact && (
        <span
          aria-hidden="true"
          className={`h-2 w-2 rounded-full border ${current?.failed ? 'border-red-400 bg-red-400' : current ? 'border-green-400 bg-green-400' : 'border-text-theme-muted bg-surface-base'}`}
        />
      )}
      <span className={compact ? 'sr-only' : undefined}>{label}</span>
    </span>
  );
}
