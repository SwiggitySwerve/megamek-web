import { renderHook } from '@testing-library/react';
import { useRouter } from 'next/router';

import { useCustomizerRouter } from '@/hooks/useCustomizerRouter';

jest.mock('next/router', () => ({ useRouter: jest.fn() }));

const UNIT_ID = '1d1f3290-748c-469c-a534-79e9dd09a115';

function mockRouter(overrides: Record<string, unknown> = {}) {
  jest.mocked(useRouter).mockReturnValue({
    query: {},
    asPath: '/customizer/[[...slug]]',
    pathname: '/customizer/[[...slug]]',
    isReady: false,
    push: jest.fn(),
    replace: jest.fn(),
    ...overrides,
  } as unknown as ReturnType<typeof useRouter>);
}

describe('customizer route recovery', () => {
  afterEach(() => {
    window.history.replaceState({}, '', '/');
    jest.clearAllMocks();
  });

  it('recovers the real deep link when the production router exposes its route template', () => {
    window.history.replaceState({}, '', `/customizer/${UNIT_ID}/structure`);
    mockRouter();
    const { result } = renderHook(() => useCustomizerRouter());
    expect(result.current).toMatchObject({
      unitId: UNIT_ID,
      tabId: 'structure',
      hasExplicitTab: true,
      isValid: true,
      isIndex: false,
      isReady: true,
    });
  });

  it('distinguishes an omitted tab from an explicit Structure tab', () => {
    window.history.replaceState(
      {},
      '',
      '/customizer/' + UNIT_ID + '/structure',
    );
    mockRouter({
      query: { slug: [UNIT_ID, 'structure'] },
      asPath: '/customizer/' + UNIT_ID + '/structure',
      isReady: true,
    });
    const explicit = renderHook(() => useCustomizerRouter());
    expect(explicit.result.current.hasExplicitTab).toBe(true);

    window.history.replaceState({}, '', '/customizer/' + UNIT_ID);
    mockRouter({
      query: { slug: [UNIT_ID] },
      asPath: '/customizer/' + UNIT_ID,
      isReady: true,
    });
    const omitted = renderHook(() => useCustomizerRouter());
    expect(omitted.result.current.hasExplicitTab).toBe(false);

    window.history.replaceState({}, '', '/customizer/' + UNIT_ID + '/armor');
    mockRouter({
      query: { slug: [UNIT_ID, 'armor'] },
      asPath: '/customizer/' + UNIT_ID + '/armor',
      isReady: true,
    });
    const explicitNonDefault = renderHook(() => useCustomizerRouter());
    expect(explicitNonDefault.result.current).toMatchObject({
      tabId: 'armor',
      hasExplicitTab: true,
    });

    window.history.replaceState(
      {},
      '',
      '/customizer/' + UNIT_ID + '/not-a-tab',
    );
    mockRouter({
      query: { slug: [UNIT_ID, 'not-a-tab'] },
      asPath: '/customizer/' + UNIT_ID + '/not-a-tab',
      isReady: true,
    });
    const invalid = renderHook(() => useCustomizerRouter());
    expect(invalid.result.current).toMatchObject({
      tabId: 'structure',
      hasExplicitTab: false,
      isValid: true,
    });
  });

  it('keeps the customizer index usable after missing-unit recovery', () => {
    window.history.replaceState({}, '', '/customizer');
    mockRouter();
    const { result } = renderHook(() => useCustomizerRouter());
    expect(result.current).toMatchObject({
      unitId: null,
      isValid: true,
      isIndex: true,
      isReady: true,
    });
  });

  it('ignores a template slug in favor of the concrete browser route', () => {
    window.history.replaceState({}, '', `/customizer/${UNIT_ID}/armor`);
    mockRouter({ query: { slug: ['[[...slug]]'] } });
    const { result } = renderHook(() => useCustomizerRouter());
    expect(result.current).toMatchObject({
      unitId: UNIT_ID,
      tabId: 'armor',
      isValid: true,
    });
  });

  it('continues to reject genuinely malformed unit IDs', () => {
    window.history.replaceState({}, '', '/customizer/not-a-unit/structure');
    mockRouter();
    const { result } = renderHook(() => useCustomizerRouter());
    expect(result.current).toMatchObject({
      unitId: null,
      isValid: false,
      isIndex: false,
    });
  });

  it('uses a concrete router destination during a shallow tab transition', () => {
    window.history.replaceState({}, '', `/customizer/${UNIT_ID}/structure`);
    mockRouter({
      asPath: `/customizer/${UNIT_ID}/armor`,
      query: { slug: [UNIT_ID, 'armor'] },
      isReady: true,
    });
    const { result } = renderHook(() => useCustomizerRouter());
    expect(result.current).toMatchObject({
      unitId: UNIT_ID,
      tabId: 'armor',
      isValid: true,
    });
  });
});
