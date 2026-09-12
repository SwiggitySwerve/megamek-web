import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { useRouter } from 'next/router';
import React from 'react';

import CustomizerWithRouter from '@/components/customizer/CustomizerWithRouter';
import { type CampaignCustomizerRouteState } from '@/lib/campaign/customizer/campaignCustomizerRoute';
import { useTabManagerStore } from '@/stores/useTabManagerStore';
import { RulesLevel } from '@/types/enums/RulesLevel';

const UNIT_ID = '1d1f3290-748c-469c-a534-79e9dd09a115';

const mockTabManagerState = {
  tabs: [{ id: UNIT_ID, unitType: 'BattleMech' }],
  activeTabId: UNIT_ID,
  isLoading: false,
  selectTab: jest.fn(),
  addTab: jest.fn(),
  setLastSubTab: jest.fn(),
  getLastSubTab: jest.fn(() => 'preview'),
};

const mockCampaignRoutingState = {
  campaignRoute: null as CampaignCustomizerRouteState | null,
  campaignSession: null as unknown,
  isCampaignLoading: false,
  isCampaignSyncPending: false,
  returnToCampaign: jest.fn(),
  unavailableUnitId: null as string | null,
};

jest.mock('next/router', () => ({ useRouter: jest.fn() }));

jest.mock('@/stores/useTabManagerStore', () => ({
  useTabManagerStore: Object.assign(jest.fn(), {
    persist: { rehydrate: jest.fn(() => Promise.resolve()) },
  }),
}));

jest.mock('@/components/common', () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

jest.mock(
  '@/components/customizer/campaign/CampaignCustomizerSessionContext',
  () => ({
    CampaignCustomizerSessionProvider: ({
      children,
    }: {
      children: React.ReactNode;
    }) => <>{children}</>,
  }),
);

jest.mock(
  '@/components/customizer/campaign/useCampaignCustomizerRouting',
  () => ({
    useCampaignCustomizerRouting: () => mockCampaignRoutingState,
  }),
);

jest.mock('@/components/customizer/tabs', () => ({
  MultiUnitTabs: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

jest.mock('react-dnd', () => ({
  DndProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('react-dnd-html5-backend', () => ({
  HTML5Backend: {},
}));

jest.mock('@/hooks/useAutoSaveIndicator', () => ({
  useAutoSaveIndicator: jest.fn(),
}));

jest.mock('@/components/customizer/UnitTypeRouter', () => ({
  UnitTypeRouter: ({ activeTabId }: { activeTabId: string }) => (
    <div data-testid="unit-type-router" data-active-tab={activeTabId} />
  ),
}));

function mockCustomizerRoute(slug: string[]) {
  const router = {
    query: { slug },
    asPath: '/customizer/' + slug.join('/'),
    pathname: '/customizer/[[...slug]]',
    isReady: true,
    push: jest.fn(),
    replace: jest.fn(),
  } as unknown as ReturnType<typeof useRouter>;
  jest.mocked(useRouter).mockReturnValue(router);
  return router;
}

describe('CustomizerWithRouter route and persisted-tab composition', () => {
  beforeEach(() => {
    Object.assign(mockCampaignRoutingState, {
      campaignRoute: null,
      campaignSession: null,
      isCampaignLoading: false,
      isCampaignSyncPending: false,
      unavailableUnitId: null,
    });
    (useTabManagerStore as unknown as jest.Mock).mockImplementation(
      (selector: (state: typeof mockTabManagerState) => unknown) =>
        selector(mockTabManagerState),
    );
    (useTabManagerStore.persist.rehydrate as jest.Mock).mockResolvedValue(
      undefined,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('keeps explicit Structure selected when persisted state says Preview', async () => {
    mockCustomizerRoute([UNIT_ID, 'structure']);
    render(<CustomizerWithRouter />);

    await waitFor(() => {
      expect(screen.getByTestId('unit-type-router')).toHaveAttribute(
        'data-active-tab',
        'structure',
      );
    });
  });

  it('restores persisted Preview when the URL omits its tab', async () => {
    mockCustomizerRoute([UNIT_ID]);
    render(<CustomizerWithRouter />);

    await waitFor(() => {
      expect(screen.getByTestId('unit-type-router')).toHaveAttribute(
        'data-active-tab',
        'preview',
      );
    });
  });
  it('keeps campaign Structure after hydration and wires unavailable-unit return', async () => {
    const router = mockCustomizerRoute([UNIT_ID, 'structure']);
    const campaignRoute: CampaignCustomizerRouteState = {
      mode: 'campaign-refit',
      campaignId: 'campaign-1',
      unitId: 'roster-unit-1',
      missionId: 'mission-1',
      returnTo: 'mission-readiness',
      campaignDate: '3025-01-01',
      budget: 1000,
      rulesLevel: RulesLevel.STANDARD,
      refitConstraints: 'field',
      editorUnitId: UNIT_ID,
    };
    router.query = {
      ...router.query,
      mode: campaignRoute.mode,
      campaignId: campaignRoute.campaignId,
      unitId: campaignRoute.unitId,
    };
    mockCampaignRoutingState.campaignRoute = campaignRoute;
    let finishHydration!: () => void;
    (useTabManagerStore.persist.rehydrate as jest.Mock).mockReturnValue(
      new Promise<void>((resolve) => {
        finishHydration = resolve;
      }),
    );
    const view = render(<CustomizerWithRouter />);
    expect(screen.queryByTestId('unit-type-router')).not.toBeInTheDocument();
    await act(async () => {
      finishHydration();
    });
    expect(screen.getByTestId('unit-type-router')).toHaveAttribute(
      'data-active-tab',
      'structure',
    );
    expect(router.replace).not.toHaveBeenCalled();
    mockCampaignRoutingState.unavailableUnitId = campaignRoute.unitId;
    view.rerender(<CustomizerWithRouter />);
    expect(screen.queryByTestId('unit-type-router')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Return to campaign' }));
    expect(mockCampaignRoutingState.returnToCampaign).toHaveBeenCalledTimes(1);
  });
});
