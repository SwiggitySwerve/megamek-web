import { getEquipmentLookupService } from '@/services/equipment/EquipmentLookupService';
import { getEquipmentRegistry } from '@/services/equipment/EquipmentRegistry';
import { customUnitApiService } from '@/services/units/CustomUnitApiService';
import {
  parseUnit,
  unitLoaderService,
} from '@/services/units/unitLoaderService';
import { createLibrarySaveReceipt } from '@/stores/unit/unitEditSnapshot';
import { getUnitStore } from '@/stores/unitStoreRegistry';
import { createNewUnitStore } from '@/stores/useUnitStore';
import { TechBase } from '@/types/enums/TechBase';

import {
  restoreLibraryVersionToDraft,
  StaleLibraryRestoreError,
} from '../restoreLibraryVersionToDraft';

jest.mock('@/services/equipment/EquipmentLookupService', () => ({
  getEquipmentLookupService: jest.fn(),
}));
jest.mock('@/services/equipment/EquipmentRegistry', () => ({
  getEquipmentRegistry: jest.fn(),
}));
jest.mock('@/services/units/CustomUnitApiService', () => ({
  customUnitApiService: { getVersion: jest.fn() },
}));
jest.mock('@/services/units/unitLoaderService', () => ({
  parseUnit: jest.fn(),
  unitLoaderService: { mapToUnitState: jest.fn() },
}));
jest.mock('@/stores/unitStoreRegistry', () => ({
  getUnitStore: jest.fn(),
}));

const mockGetUnitStore = getUnitStore as jest.MockedFunction<
  typeof getUnitStore
>;
const mockGetVersion = customUnitApiService.getVersion as jest.MockedFunction<
  typeof customUnitApiService.getVersion
>;
const mockParseUnit = parseUnit as jest.MockedFunction<typeof parseUnit>;
const mockMapToUnitState =
  unitLoaderService.mapToUnitState as jest.MockedFunction<
    typeof unitLoaderService.mapToUnitState
  >;

function makeStore() {
  const store = createNewUnitStore({
    id: 'draft-1',
    name: 'Current Draft',
    tonnage: 100,
    techBase: TechBase.INNER_SPHERE,
  });
  store.setState({
    chassis: 'Atlas',
    model: 'AS7-D',
    sourceDefinition: { source: 'canonical', id: 'atlas-as7-d' },
    librarySave: createLibrarySaveReceipt(store.getState(), {
      id: 'library-atlas',
      version: 3,
    }),
  });
  return store;
}

beforeEach(() => {
  jest.clearAllMocks();
  (getEquipmentLookupService as jest.Mock).mockReturnValue({
    initialize: jest.fn().mockResolvedValue(undefined),
  });
  (getEquipmentRegistry as jest.Mock).mockReturnValue({
    initialize: jest.fn().mockResolvedValue(undefined),
  });
  mockParseUnit.mockImplementation(
    (data) => data as ReturnType<typeof parseUnit>,
  );
});

describe('restoreLibraryVersionToDraft', () => {
  it('applies the historical snapshot without changing draft identity or provenance', async () => {
    const store = makeStore();
    const historic = createNewUnitStore({
      id: 'should-not-apply',
      name: 'Historic Atlas',
      tonnage: 100,
      techBase: TechBase.INNER_SPHERE,
    });
    historic.setState({ chassis: 'Historic', model: 'H-1' });
    mockGetUnitStore.mockReturnValue(store);
    mockGetVersion.mockResolvedValue({
      version: 1,
      savedAt: '2024-01-01T00:00:00.000Z',
      notes: null,
      revertSource: null,
      data: { chassis: 'Historic' },
    } as Awaited<ReturnType<typeof customUnitApiService.getVersion>>);
    mockMapToUnitState.mockReturnValue(historic.getState());
    const librarySave = store.getState().librarySave;
    const sourceDefinition = store.getState().sourceDefinition;

    await restoreLibraryVersionToDraft({
      store,
      draftId: store.getState().id,
      libraryId: 'library-atlas',
      version: 1,
    });

    expect(mockGetVersion).toHaveBeenCalledWith('library-atlas', 1);
    expect(store.getState().id).toBe('draft-1');
    expect(store.getState().chassis).toBe('Historic');
    expect(store.getState().model).toBe('H-1');
    expect(store.getState().sourceDefinition).toEqual(sourceDefinition);
    expect(store.getState().librarySave).toEqual(librarySave);
    expect(store.getState().isModified).toBe(true);
  });

  it('ignores a late response after the draft was edited', async () => {
    const store = makeStore();
    mockGetUnitStore.mockReturnValue(store);
    let resolveVersion!: (
      value: Awaited<ReturnType<typeof customUnitApiService.getVersion>>,
    ) => void;
    mockGetVersion.mockReturnValue(
      new Promise((resolve) => {
        resolveVersion = resolve;
      }),
    );
    const restorePromise = restoreLibraryVersionToDraft({
      store,
      draftId: store.getState().id,
      libraryId: 'library-atlas',
      version: 1,
    });
    store.setState({ name: 'Edited during fetch' });
    resolveVersion({
      version: 1,
      savedAt: '2024-01-01T00:00:00.000Z',
      notes: null,
      revertSource: null,
      data: { chassis: 'Historic' },
    } as Awaited<ReturnType<typeof customUnitApiService.getVersion>>);

    await expect(restorePromise).rejects.toBeInstanceOf(
      StaleLibraryRestoreError,
    );
    expect(store.getState().name).toBe('Edited during fetch');
    expect(store.getState().chassis).toBe('Atlas');
    expect(mockMapToUnitState).not.toHaveBeenCalled();
  });

  it('ignores a late response after the store was replaced', async () => {
    const store = makeStore();
    const replacement = makeStore();
    mockGetUnitStore.mockReturnValue(store);
    let resolveVersion!: (
      value: Awaited<ReturnType<typeof customUnitApiService.getVersion>>,
    ) => void;
    mockGetVersion.mockReturnValue(
      new Promise((resolve) => {
        resolveVersion = resolve;
      }),
    );
    const restorePromise = restoreLibraryVersionToDraft({
      store,
      draftId: store.getState().id,
      libraryId: 'library-atlas',
      version: 1,
    });
    mockGetUnitStore.mockReturnValue(replacement);
    resolveVersion({
      version: 1,
      savedAt: '2024-01-01T00:00:00.000Z',
      notes: null,
      revertSource: null,
      data: { chassis: 'Historic' },
    } as Awaited<ReturnType<typeof customUnitApiService.getVersion>>);

    await expect(restorePromise).rejects.toBeInstanceOf(
      StaleLibraryRestoreError,
    );
    expect(store.getState().chassis).toBe('Atlas');
    expect(replacement.getState().chassis).toBe('Atlas');
  });
});
