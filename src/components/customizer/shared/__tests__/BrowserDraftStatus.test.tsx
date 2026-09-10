import { act, render, screen } from '@testing-library/react';

import { clientSafeStorage } from '@/stores/utils/clientSafeStorage';

import { BrowserDraftStatus } from '../BrowserDraftStatus';

describe('BrowserDraftStatus', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    localStorage.clear();
  });

  it('reports only successful writes for the active draft', () => {
    const { rerender } = render(<BrowserDraftStatus unitId="visible-first" />);
    expect(screen.getByRole('status')).toHaveTextContent('Browser draft');
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'off');
    act(() => clientSafeStorage.setItem('megamek-unit-other', '{}'));
    expect(screen.getByRole('status')).toHaveTextContent('Browser draft');
    act(() => clientSafeStorage.setItem('megamek-unit-visible-first', '{}'));
    expect(screen.getByRole('status')).toHaveTextContent('Draft saved');
    rerender(<BrowserDraftStatus unitId="visible-second" />);
    expect(screen.getByRole('status')).toHaveTextContent('Browser draft');
    rerender(<BrowserDraftStatus unitId="visible-first" />);
    expect(screen.getByRole('status')).toHaveTextContent('Draft saved');
  });

  it('retains the failed state until the draft is successfully written', () => {
    render(<BrowserDraftStatus unitId="visible-failed" />);
    const storage = jest
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementationOnce(() => {
        throw new Error('full');
      });
    act(() => {
      expect(() =>
        clientSafeStorage.setItem('megamek-unit-visible-failed', '{}'),
      ).toThrow('full');
    });
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByRole('status')).toHaveTextContent('Draft save failed');
    storage.mockRestore();
    act(() => clientSafeStorage.setItem('megamek-unit-visible-failed', '{}'));
    expect(screen.getByRole('status')).toHaveTextContent('Draft saved');
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'off');
  });
});
