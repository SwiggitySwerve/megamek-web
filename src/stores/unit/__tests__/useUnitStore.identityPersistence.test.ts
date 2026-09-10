import { createNewUnitStore } from '@/stores/unit/useUnitStore';
import { hydrateOrCreateUnit } from '@/stores/unitStoreRegistry';
import { TechBase } from '@/types/enums/TechBase';

const UNIT_ID = '33333333-3333-4333-8333-333333333333';
const STORAGE_KEY = `megamek-unit-${UNIT_ID}`;

describe('unit identity draft persistence', () => {
  beforeEach(() => localStorage.clear());

  it('writes identity and source provenance into the browser draft and rehydrates them', () => {
    const store = createNewUnitStore({
      id: UNIT_ID,
      name: 'Timber Wolf Prime',
      tonnage: 75,
      techBase: TechBase.CLAN,
    });

    store.setState({
      sourceDefinition: { source: 'canonical', id: 'timber-wolf-prime' },
      clanName: 'Mad Cat',
      mulId: '2401',
      role: 'Skirmisher',
      fluff: {
        overview: 'A fast Clan heavy OmniMech.',
        capabilities: 'High mobility and flexible pod space.',
      },
    });

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as {
      state?: Record<string, unknown>;
    };
    const coldStore = hydrateOrCreateUnit(UNIT_ID, {
      id: UNIT_ID,
      name: 'Placeholder',
      tonnage: 20,
      techBase: TechBase.INNER_SPHERE,
    });
    expect(coldStore.getState().sourceDefinition).toEqual({
      source: 'canonical',
      id: 'timber-wolf-prime',
    });
    expect(stored.state).toMatchObject({
      sourceDefinition: { source: 'canonical', id: 'timber-wolf-prime' },
      clanName: 'Mad Cat',
      mulId: '2401',
      role: 'Skirmisher',
      fluff: {
        overview: 'A fast Clan heavy OmniMech.',
        capabilities: 'High mobility and flexible pod space.',
      },
    });
  });
});
