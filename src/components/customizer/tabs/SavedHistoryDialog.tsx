import React from 'react';

import { VersionHistoryDialog } from '@/components/customizer/dialogs/VersionHistoryDialog';

interface SavedHistoryDialogProps {
  isOpen: boolean;
  libraryId: string;
  unitName: string;
  currentVersion: number;
  onClose: () => void;
  onRestoreDraft: (version: number) => Promise<void>;
}

/** Draft-restore history: library versions stay immutable. */
export function SavedHistoryDialog({
  isOpen,
  libraryId,
  unitName,
  currentVersion,
  onClose,
  onRestoreDraft,
}: SavedHistoryDialogProps): React.ReactElement {
  return (
    <VersionHistoryDialog
      isOpen={isOpen}
      unitId={libraryId}
      unitName={unitName}
      currentVersion={currentVersion}
      onRevert={() => undefined}
      onRestoreDraft={onRestoreDraft}
      onClose={onClose}
    />
  );
}
