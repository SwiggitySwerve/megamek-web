import {
  clientSafeStorage,
  getLatestStorageWriteReceipt,
} from '../clientSafeStorage';

describe('clientSafeStorage write receipts', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    localStorage.clear();
  });

  it('keeps the latest completed write per key', () => {
    clientSafeStorage.setItem('megamek-unit-receipt-latest', '{"a":1}');
    expect(getLatestStorageWriteReceipt('megamek-unit-receipt-latest')).toEqual(
      {
        key: 'megamek-unit-receipt-latest',
        status: 'saved',
      },
    );
    const storage = jest
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('full');
      });
    expect(() =>
      clientSafeStorage.setItem('megamek-unit-receipt-latest', '{"a":2}'),
    ).toThrow('full');
    storage.mockRestore();
    expect(getLatestStorageWriteReceipt('megamek-unit-receipt-latest')).toEqual(
      {
        error: expect.any(Error),
        key: 'megamek-unit-receipt-latest',
        status: 'failed',
      },
    );
  });
});
