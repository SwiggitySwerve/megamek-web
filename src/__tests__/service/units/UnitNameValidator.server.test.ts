import { customUnitApiService } from '@/services/units/CustomUnitApiService';
import { unitNameValidator } from '@/services/units/UnitNameValidator';

jest.mock('@/services/units/CanonicalUnitService', () => ({
  getCanonicalUnitService: () => ({ getIndex: async () => [] }),
}));
jest.mock('@/services/units/CustomUnitService', () => ({
  getCustomUnitService: () => ({ list: async () => [] }),
}));
jest.mock('@/services/units/CustomUnitApiService', () => ({
  customUnitApiService: { list: jest.fn() },
}));

it('uses the server library identity when browser storage has no matching custom unit', async () => {
  jest
    .mocked(customUnitApiService.list)
    .mockResolvedValue([
      { id: 'saved-on-server', chassis: 'Own', variant: 'OWN-1' },
    ] as never);
  await expect(
    unitNameValidator.validateUnitName('Own', 'OWN-1'),
  ).resolves.toMatchObject({
    isCustomConflict: true,
    conflictingUnitId: 'saved-on-server',
  });
});

it('does not declare a name available when the library cannot be checked', async () => {
  jest
    .mocked(customUnitApiService.list)
    .mockRejectedValue(new Error('Library unavailable'));
  await expect(
    unitNameValidator.validateUnitName('Own', 'OWN-1'),
  ).rejects.toThrow('Library unavailable');
});
