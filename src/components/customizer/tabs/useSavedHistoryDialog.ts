import type { StoreApi } from 'zustand';

import { useCallback, useEffect, useRef, useState } from 'react';

import type { UnitStore } from '@/stores/unitState';
import type { TabInfo } from '@/stores/useTabManagerStore';

import { useToast } from '@/components/shared/Toast';
import { getUnitStore } from '@/stores/unitStoreRegistry';

import { restoreLibraryVersionToDraft } from './restoreLibraryVersionToDraft';
import { getSavedHistoryDisabledReason } from './savedHistoryAccess';

export interface HistoryDialogState {
  isOpen: boolean;
  libraryId: string;
  unitName: string;
  currentVersion: number;
}

interface ISavedHistoryBinding {
  readonly store: StoreApi<UnitStore>;
  readonly draftId: string;
  readonly libraryId: string;
}

const INITIAL_HISTORY_DIALOG: HistoryDialogState = {
  isOpen: false,
  libraryId: '',
  unitName: '',
  currentVersion: 0,
};

type GetTabById = (tabId: string) => TabInfo | undefined;

export function useSavedHistoryDialog(
  getTabById: GetTabById,
  activeTabId?: string | null,
): {
  historyDialog: HistoryDialogState;
  openHistoryDialog: (tabId: string) => void;
  closeHistoryDialog: () => void;
  restoreHistoryVersion: (version: number) => Promise<void>;
} {
  const { showToast } = useToast();
  const bindingRef = useRef<ISavedHistoryBinding | null>(null);
  const activeRef = useRef(activeTabId);
  activeRef.current = activeTabId;
  useEffect(
    () => () => {
      bindingRef.current = null;
    },
    [],
  );
  const [historyDialog, setHistoryDialog] = useState<HistoryDialogState>(
    INITIAL_HISTORY_DIALOG,
  );

  const closeHistoryDialog = useCallback(() => {
    bindingRef.current = null;
    setHistoryDialog(INITIAL_HISTORY_DIALOG);
  }, []);

  const openHistoryDialog = useCallback(
    (tabId: string) => {
      const reason = getSavedHistoryDisabledReason(getTabById(tabId));
      if (reason) {
        showToast({ message: reason, variant: 'error' });
        return;
      }

      const store = getUnitStore(tabId);
      const librarySave = store?.getState().librarySave;
      if (!store || !librarySave) {
        showToast({
          message: 'Save this unit to the library before viewing history.',
          variant: 'error',
        });
        return;
      }

      bindingRef.current = {
        store,
        draftId: tabId,
        libraryId: librarySave.id,
      };
      setHistoryDialog({
        isOpen: true,
        libraryId: librarySave.id,
        unitName: store.getState().name,
        currentVersion: librarySave.version,
      });
    },
    [getTabById, showToast],
  );

  const restoreHistoryVersion = useCallback(
    async (version: number) => {
      const binding = bindingRef.current;
      if (!binding) {
        throw new Error('Saved history is no longer bound to this draft.');
      }
      await restoreLibraryVersionToDraft({
        ...binding,
        version,
        isCurrent: () =>
          bindingRef.current === binding &&
          Boolean(getTabById(binding.draftId)) &&
          (activeRef.current === undefined ||
            activeRef.current === binding.draftId),
      });
    },
    [getTabById],
  );

  return {
    historyDialog,
    openHistoryDialog,
    closeHistoryDialog,
    restoreHistoryVersion,
  };
}
