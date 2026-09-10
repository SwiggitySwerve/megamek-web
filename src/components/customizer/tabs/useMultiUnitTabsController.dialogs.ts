import { useCallback, useState } from 'react';

import type { TabInfo } from '@/stores/useTabManagerStore';

import { useToast } from '@/components/shared/Toast';
import { customUnitApiService } from '@/services/units/CustomUnitApiService';
import { getUnitStore } from '@/stores/unitStoreRegistry';
import { Era } from '@/types/temporal/Era';
import { logger } from '@/utils/logger';
import { serializeCustomUnitState } from '@/utils/serialization/CustomUnitSerializer';
import { getEraForYear } from '@/utils/temporal/eraUtils';

import { getLibrarySaveDisabledReason } from './MultiUnitTabsUnitState';

export interface CloseDialogState {
  isOpen: boolean;
  tabId: string | null;
  tabName: string;
}

export interface SaveDialogState {
  isOpen: boolean;
  tabId: string | null;
  chassis: string;
  variant: string;
  closeAfterSave: boolean;
}

const INITIAL_CLOSE_DIALOG: CloseDialogState = {
  isOpen: false,
  tabId: null,
  tabName: '',
};

const INITIAL_SAVE_DIALOG: SaveDialogState = {
  isOpen: false,
  tabId: null,
  chassis: '',
  variant: '',
  closeAfterSave: false,
};

type GetTabById = (tabId: string) => TabInfo | undefined;

export function useDialogHandlers(
  performCloseTab: (tabId: string) => void,
  renameTab: (tabId: string, name: string) => void,
  getTabById: GetTabById,
): {
  closeDialog: CloseDialogState;
  saveDialog: SaveDialogState;
  handleCloseDialogCancel: () => void;
  handleCloseDialogDiscard: () => void;
  handleCloseDialogSave: () => void;
  handleSaveDialogCancel: () => void;
  handleSaveDialogSave: (
    chassis: string,
    variant: string,
    overwriteId?: string,
  ) => Promise<void>;
  openCloseDialog: (tabId: string, tabName: string) => void;
  openSaveDialog: (tabId: string) => void;
} {
  const { showToast } = useToast();

  const [closeDialog, setCloseDialog] =
    useState<CloseDialogState>(INITIAL_CLOSE_DIALOG);
  const [saveDialog, setSaveDialog] =
    useState<SaveDialogState>(INITIAL_SAVE_DIALOG);

  const handleCloseDialogCancel = useCallback(() => {
    setCloseDialog(INITIAL_CLOSE_DIALOG);
  }, []);

  const handleCloseDialogDiscard = useCallback(() => {
    if (closeDialog.tabId) {
      performCloseTab(closeDialog.tabId);
    }
    setCloseDialog(INITIAL_CLOSE_DIALOG);
  }, [closeDialog.tabId, performCloseTab]);

  const openSaveDialogForTab = useCallback(
    (tabId: string, closeAfterSave: boolean) => {
      const disabledReason = getLibrarySaveDisabledReason(getTabById(tabId));
      if (disabledReason) {
        showToast({ message: disabledReason, variant: 'error' });
        return;
      }

      const unitStore = getUnitStore(tabId);
      if (!unitStore) {
        showToast({
          message: 'This unit is no longer available to save.',
          variant: 'error',
        });
        return;
      }

      const state = unitStore.getState();
      setSaveDialog({
        isOpen: true,
        tabId,
        chassis: state.chassis || state.name || 'New Mech',
        variant: state.model || '',
        closeAfterSave,
      });

      if (closeAfterSave) {
        setCloseDialog(INITIAL_CLOSE_DIALOG);
      }
    },
    [getTabById, showToast],
  );

  const handleCloseDialogSave = useCallback(() => {
    if (closeDialog.tabId) {
      openSaveDialogForTab(closeDialog.tabId, true);
    }
  }, [closeDialog.tabId, openSaveDialogForTab]);

  const openSaveDialog = useCallback(
    (tabId: string) => {
      openSaveDialogForTab(tabId, false);
    },
    [openSaveDialogForTab],
  );

  const handleSaveDialogCancel = useCallback(() => {
    setSaveDialog(INITIAL_SAVE_DIALOG);
  }, []);

  const handleSaveDialogSave = useCallback(
    async (chassis: string, variant: string, overwriteId?: string) => {
      if (!saveDialog.tabId) {
        return;
      }

      const disabledReason = getLibrarySaveDisabledReason(
        getTabById(saveDialog.tabId),
      );
      if (disabledReason) {
        showToast({ message: disabledReason, variant: 'error' });
        return;
      }

      const unitStore = getUnitStore(saveDialog.tabId);
      if (!unitStore) {
        showToast({
          message: 'This unit is no longer available to save.',
          variant: 'error',
        });
        return;
      }

      const state = unitStore.getState();

      try {
        const era = getEraForYear(state.year) ?? Era.LATE_SUCCESSION_WARS;
        const unitData = serializeCustomUnitState(state, {
          id: overwriteId ?? saveDialog.tabId,
          chassis,
          variant,
          era,
        });

        // The legacy API type names persisted data as IFullUnit even though
        // this path writes the canonical ISerializedUnit contract.
        let result;
        if (overwriteId) {
          result = await customUnitApiService.save(
            overwriteId,
            unitData as never,
          );
        } else {
          result = await customUnitApiService.create(
            unitData as never,
            chassis,
            variant,
          );
        }

        if (!result.success) {
          logger.error('Failed to save unit:', result.error);
          showToast({
            message: `Failed to save unit: ${result.error}`,
            variant: 'error',
          });
          return;
        }

        const unitName = [chassis, variant].filter(Boolean).join(' ');
        if (!getTabById(saveDialog.tabId)) {
          showToast({
            message: `Unit "${unitName}" saved, but its source tab is no longer open.`,
            variant: 'warning',
          });
          setSaveDialog(INITIAL_SAVE_DIALOG);
          return;
        }

        if (unitStore.getState() !== state) {
          showToast({
            message: `Unit "${unitName}" saved, but newer browser draft changes remain.`,
            variant: 'warning',
          });
          setSaveDialog(INITIAL_SAVE_DIALOG);
          return;
        }

        unitStore.setState({
          chassis,
          model: variant,
          name: unitName,
          isModified: false,
          lastModifiedAt: Date.now(),
        });
        renameTab(saveDialog.tabId, unitName);

        showToast({
          message: `Unit "${unitName}" saved successfully!`,
          variant: 'success',
        });

        const shouldClose = saveDialog.closeAfterSave;
        const tabIdToClose = saveDialog.tabId;
        setSaveDialog(INITIAL_SAVE_DIALOG);

        if (shouldClose) {
          performCloseTab(tabIdToClose);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown save error';
        logger.error('Failed to save unit:', errorMessage);
        showToast({
          message: 'Failed to save unit. Please try again.',
          variant: 'error',
        });
      }
    },
    [
      saveDialog.tabId,
      saveDialog.closeAfterSave,
      getTabById,
      renameTab,
      performCloseTab,
      showToast,
    ],
  );

  const openCloseDialog = useCallback((tabId: string, tabName: string) => {
    setCloseDialog({
      isOpen: true,
      tabId,
      tabName,
    });
  }, []);

  return {
    closeDialog,
    saveDialog,
    handleCloseDialogCancel,
    handleCloseDialogDiscard,
    handleCloseDialogSave,
    handleSaveDialogCancel,
    handleSaveDialogSave,
    openCloseDialog,
    openSaveDialog,
  };
}
