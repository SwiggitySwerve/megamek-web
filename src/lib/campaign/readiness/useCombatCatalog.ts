import { useEffect, useState } from 'react';

import {
  type CanonicalCombatCatalogSnapshot,
  fetchCanonicalCatalogSnapshot,
} from './canonicalCatalogAdmission';

/**
 * Browser combat-catalog snapshot for campaign readiness surfaces.
 *
 * Launch actions that already call `fetchCanonicalCatalogSnapshot` keep
 * that second fetch so eligibility is revalidated against authority.
 */
export function useCombatCatalog(
  refreshKey: string | undefined,
): CanonicalCombatCatalogSnapshot {
  const [catalog, setCatalog] = useState<CanonicalCombatCatalogSnapshot>({
    status: 'loading',
  });
  useEffect(() => {
    let cancelled = false;
    setCatalog({ status: 'loading' });
    void fetchCanonicalCatalogSnapshot().then((snapshot) => {
      if (!cancelled) setCatalog(snapshot);
    });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);
  return catalog;
}
