import { act, renderHook, waitFor } from '@testing-library/react';

import { readyCanonicalCatalog } from '@/lib/campaign/readiness/canonicalCatalogAdmission';
import { useCombatCatalog } from '@/lib/campaign/readiness/useCombatCatalog';

const fetchCanonicalCatalogSnapshot = jest.fn();

jest.mock('@/lib/campaign/readiness/canonicalCatalogAdmission', () => {
  const actual = jest.requireActual<
    typeof import('@/lib/campaign/readiness/canonicalCatalogAdmission')
  >('@/lib/campaign/readiness/canonicalCatalogAdmission');
  return {
    ...actual,
    fetchCanonicalCatalogSnapshot: (...args: unknown[]) =>
      fetchCanonicalCatalogSnapshot(...args),
  };
});

describe('useCombatCatalog', () => {
  beforeEach(() => {
    fetchCanonicalCatalogSnapshot.mockReset();
  });

  it('loads the dual catalog snapshot once per refresh key', async () => {
    const snapshot = readyCanonicalCatalog(
      ['atlas-as7-d'],
      ['custom-workbench-atlas'],
    );
    fetchCanonicalCatalogSnapshot.mockResolvedValue(snapshot);

    const { result, rerender } = renderHook(
      ({ refreshKey }: { refreshKey: string | undefined }) =>
        useCombatCatalog(refreshKey),
      { initialProps: { refreshKey: 'campaign-1' } },
    );

    expect(result.current).toEqual({ status: 'loading' });
    await waitFor(() => {
      expect(result.current).toBe(snapshot);
    });
    expect(fetchCanonicalCatalogSnapshot).toHaveBeenCalledTimes(1);

    rerender({ refreshKey: 'campaign-1' });
    expect(fetchCanonicalCatalogSnapshot).toHaveBeenCalledTimes(1);

    fetchCanonicalCatalogSnapshot.mockResolvedValue(
      readyCanonicalCatalog(['locust-lct-1v']),
    );
    rerender({ refreshKey: 'campaign-2' });
    await waitFor(() => {
      expect(result.current.status === 'ready').toBe(true);
    });
    expect(fetchCanonicalCatalogSnapshot).toHaveBeenCalledTimes(2);
  });

  it('does not apply a stale snapshot after unmount', async () => {
    let resolveSnapshot:
      | ((value: ReturnType<typeof readyCanonicalCatalog>) => void)
      | undefined;
    fetchCanonicalCatalogSnapshot.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSnapshot = resolve;
        }),
    );

    const { result, unmount } = renderHook(() =>
      useCombatCatalog('campaign-1'),
    );
    expect(result.current.status).toBe('loading');
    unmount();
    await act(async () => {
      resolveSnapshot?.(readyCanonicalCatalog(['atlas-as7-d']));
    });
    expect(fetchCanonicalCatalogSnapshot).toHaveBeenCalledTimes(1);
  });
});
