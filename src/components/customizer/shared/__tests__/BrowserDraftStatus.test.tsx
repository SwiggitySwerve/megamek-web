import { act, render, screen } from '@testing-library/react';

import { clientSafeStorage } from '@/stores/utils/clientSafeStorage';

import { BrowserDraftStatus } from '../BrowserDraftStatus';

describe('BrowserDraftStatus', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    localStorage.clear();
  });

  it('reports only successful writes for the active draft', () => {
    const { rerender } = render(<BrowserDraftStatus unitId="first" />);
    expect(screen.getByRole('status')).toHaveTextContent('Browser draft');
    act(() => clientSafeStorage.setItem('megamek-unit-other', '{}'));
    expect(screen.getByRole('status')).toHaveTextContent('Browser draft');
    act(() => clientSafeStorage.setItem('megamek-unit-first', '{}'));
    expect(screen.getByRole('status')).toHaveTextContent('Draft saved');
    rerender(<BrowserDraftStatus unitId="second" />);
    expect(screen.getByRole('status')).toHaveTextContent('Browser draft');
  });

  it('retains the failed state until the draft is successfully written', () => {
    render(<BrowserDraftStatus unitId="first" />);
    const storage = jest
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementationOnce(() => {
        throw new Error('full');
      });
    act(() => {
      expect(() =>
        clientSafeStorage.setItem('megamek-unit-first', '{}'),
      ).toThrow('full');
    });
    expect(screen.getByRole('status')).toHaveTextContent('Draft save failed');
    storage.mockRestore();
    act(() => clientSafeStorage.setItem('megamek-unit-first', '{}'));
    expect(screen.getByRole('status')).toHaveTextContent('Draft saved');
  });
});
