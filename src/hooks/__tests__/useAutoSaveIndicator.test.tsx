import { act, renderHook } from '@testing-library/react';

import { useAutoSaveIndicator } from '@/hooks/useAutoSaveIndicator';
import { clientSafeStorage } from '@/stores/utils/clientSafeStorage';
import { UnitType } from '@/types/unit/BattleMechInterfaces';

const showToastMock = jest.fn();
jest.mock('@/components/shared/Toast', () => ({
  useToast: () => ({ showToast: showToastMock }),
}));

const MECH_ID = '11111111-1111-4111-8111-111111111111';
const VEHICLE_ID = '22222222-2222-4222-8222-222222222222';
const MECH_TARGET = { unitId: MECH_ID, unitType: UnitType.BATTLEMECH };

beforeEach(() => {
  showToastMock.mockClear();
  localStorage.clear();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe('useAutoSaveIndicator', () => {
  it('does not report a save without an active customizer unit', () => {
    renderHook(() => useAutoSaveIndicator(null));

    act(() => {
      clientSafeStorage.setItem(`megamek-unit-${MECH_ID}`, '{}');
      jest.advanceTimersByTime(500);
    });

    expect(showToastMock).not.toHaveBeenCalled();
  });

  it('reports draft success only after the active unit write succeeds', () => {
    renderHook(() => useAutoSaveIndicator(MECH_TARGET));

    act(() => {
      clientSafeStorage.setItem(`megamek-unit-${MECH_ID}`, '{"state":{}}');
    });
    expect(showToastMock).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(localStorage.getItem(`megamek-unit-${MECH_ID}`)).toBe(
      '{"state":{}}',
    );
    expect(showToastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Draft saved in this browser',
        variant: 'success',
      }),
    );
  });

  it('reports a failed active-unit write and never reports success', () => {
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded');
    });
    renderHook(() => useAutoSaveIndicator(MECH_TARGET));

    act(() => {
      expect(() =>
        clientSafeStorage.setItem(`megamek-unit-${MECH_ID}`, '{}'),
      ).toThrow('quota exceeded');
      jest.advanceTimersByTime(500);
    });

    expect(showToastMock).toHaveBeenCalledTimes(1);
    expect(showToastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Draft could not be saved in this browser',
        variant: 'error',
      }),
    );
  });

  it('ignores a receipt for a different unit family', () => {
    renderHook(() => useAutoSaveIndicator(MECH_TARGET));

    act(() => {
      clientSafeStorage.setItem(`megamek-vehicle-${MECH_ID}`, '{}');
      jest.advanceTimersByTime(500);
    });

    expect(showToastMock).not.toHaveBeenCalled();
  });

  it('cancels a pending receipt when the active unit switches', () => {
    const { rerender } = renderHook(
      ({ target }) => useAutoSaveIndicator(target),
      { initialProps: { target: MECH_TARGET } },
    );

    act(() => {
      clientSafeStorage.setItem(`megamek-unit-${MECH_ID}`, '{}');
    });
    rerender({
      target: { unitId: VEHICLE_ID, unitType: UnitType.VEHICLE },
    });
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(showToastMock).not.toHaveBeenCalled();
  });
});
