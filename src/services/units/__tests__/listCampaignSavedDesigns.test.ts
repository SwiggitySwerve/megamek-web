import { customUnitApiService } from '../CustomUnitApiService';
import { getCustomUnitService } from '../CustomUnitService';
import { listCampaignSavedDesigns } from '../listCampaignSavedDesigns';

jest.mock('../CustomUnitApiService', () => ({
  customUnitApiService: { list: jest.fn() },
}));

const mockList = jest.fn();
jest.mock('../CustomUnitService', () => ({
  getCustomUnitService: () => ({ list: mockList }),
}));

beforeEach(() => jest.clearAllMocks());

it('includes server-saved designs and prefers server metadata for the same exact id', async () => {
  jest.mocked(customUnitApiService.list).mockResolvedValue([
    {
      id: 'custom-shared',
      chassis: 'Atlas',
      variant: 'Saved',
      tonnage: 100,
      unitType: 'BattleMech',
      currentVersion: 3,
    },
  ] as never);
  jest.mocked(getCustomUnitService().list).mockResolvedValue([
    { id: 'custom-shared', name: 'Stale', tonnage: 50 },
    { id: 'custom-local', name: 'Offline', tonnage: 20 },
  ] as never);
  expect(await listCampaignSavedDesigns()).toEqual([
    {
      id: 'custom-shared',
      name: 'Atlas Saved',
      tonnage: 100,
      unitType: 'BattleMech',
      currentVersion: 3,
    },
    { id: 'custom-local', name: 'Offline', tonnage: 20 },
  ]);
});

it('keeps server records available without IndexedDB and exposes failure when no source is available', async () => {
  mockList.mockRejectedValue(new Error('Browser storage unavailable'));
  jest.mocked(customUnitApiService.list).mockResolvedValue([]);
  await expect(listCampaignSavedDesigns()).resolves.toEqual([]);
  jest
    .mocked(customUnitApiService.list)
    .mockRejectedValue(new Error('Server unavailable'));
  await expect(listCampaignSavedDesigns()).rejects.toThrow(
    'Server unavailable',
  );
});
