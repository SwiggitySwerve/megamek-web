import { act, renderHook } from '@testing-library/react';

import type { TabInfo } from '@/stores/useTabManagerStore';

import { restoreLibraryVersionToDraft } from '@/components/customizer/tabs/restoreLibraryVersionToDraft';
import { getSavedHistoryDisabledReason } from '@/components/customizer/tabs/savedHistoryAccess';
import { useSavedHistoryDialog } from '@/components/customizer/tabs/useSavedHistoryDialog';
import { createLibrarySaveReceipt } from '@/stores/unit/unitEditSnapshot';
import { getUnitStore } from '@/stores/unitStoreRegistry';
import { createNewUnitStore } from '@/stores/useUnitStore';
import { TechBase } from '@/types/enums/TechBase';
import { UnitType } from '@/types/unit/BattleMechInterfaces';

const showToastMock = jest.fn();

jest.mock('@/components/shared/Toast', () => ({
  useToast: () => ({ showToast: showToastMock }),
}));

jest.mock('@/components/customizer/tabs/restoreLibraryVersionToDraft', () => ({
  restoreLibraryVersionToDraft: jest.fn(),
}));

jest.mock('@/stores/unitStoreRegistry', () => ({
  getUnitStore: jest.fn(),
}));

const UNIT_ID = '44444444-4444-4444-8444-444444444444';
const mockGetUnitStore = getUnitStore as jest.MockedFunction<
  typeof getUnitStore
>;
const mockRestore = restoreLibraryVersionToDraft as jest.MockedFunction<
  typeof restoreLibraryVersionToDraft
>;

function tab(unitType: UnitType = UnitType.BATTLEMECH): TabInfo {
  return {
    id: UNIT_ID,
    name: 'Atlas AS7-D',
    tonnage: 100,
    techBase: TechBase.INNER_SPHERE,
    unitType,
  };
}

function makeStore() {
  const store = createNewUnitStore({
    id: UNIT_ID,
    name: 'Atlas AS7-D',
    tonnage: 100,
    techBase: TechBase.INNER_SPHERE,
  });
  store.setState({
    librarySave: createLibrarySaveReceipt(store.getState(), {
      id: 'library-atlas',
      version: 2,
    }),
  });
  return store;
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('saved history access', () => {
  it('disables history until a library identity exists', () => {
    mockGetUnitStore.mockReturnValue(undefined);
    expect(getSavedHistoryDisabledReason(tab())).toMatch(/save this unit/i);
    expect(getSavedHistoryDisabledReason(tab(UnitType.VEHICLE))).toMatch(
      /not available for Vehicle/i,
    );
  });
});

describe('useSavedHistoryDialog', () => {
  it('binds restore to the library id captured at open, not the draft id', async () => {
    const store = makeStore();
    mockGetUnitStore.mockReturnValue(store);
    mockRestore.mockResolvedValue(undefined);
    const getTabById = jest.fn(() => tab());
    const { result } = renderHook(() => useSavedHistoryDialog(getTabById));

    act(() => result.current.openHistoryDialog(UNIT_ID));
    expect(result.current.historyDialog).toMatchObject({
      isOpen: true,
      libraryId: 'library-atlas',
      currentVersion: 2,
    });

    await act(async () => {
      await result.current.restoreHistoryVersion(1);
    });
    expect(mockRestore).toHaveBeenCalledWith({
      store,
      draftId: UNIT_ID,
      libraryId: 'library-atlas',
      version: 1,
      isCurrent: expect.any(Function),
    });
  });

  it('does not open history without a library receipt', () => {
    const store = createNewUnitStore({
      id: UNIT_ID,
      name: 'Untitled',
      tonnage: 50,
      techBase: TechBase.INNER_SPHERE,
    });
    mockGetUnitStore.mockReturnValue(store);
    const { result } = renderHook(() => useSavedHistoryDialog(() => tab()));

    act(() => result.current.openHistoryDialog(UNIT_ID));
    expect(result.current.historyDialog.isOpen).toBe(false);
    expect(showToastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringMatching(/save this unit/i),
        variant: 'error',
      }),
    );
  });
});
