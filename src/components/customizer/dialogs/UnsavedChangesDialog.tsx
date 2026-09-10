/**
 * Unsaved Changes Dialog Component
 *
 * Confirmation dialog for closing tabs with unsaved changes.
 * Matches MegaMekLab's "Save Unit Before Proceeding?" dialog style.
 *
 * @spec openspec/specs/multi-unit-tabs/spec.md
 */

import React from 'react';

import { AppIcon } from '@/components/ui/AppIcon';

import { customizerStyles as cs } from '../styles';
import { ModalOverlay } from './ModalOverlay';

interface UnsavedChangesDialogProps {
  /** Whether dialog is open */
  isOpen: boolean;
  /** Unit name */
  unitName: string;
  /** Called when dialog is closed (Cancel) */
  onClose: () => void;
  /** Called when user confirms discard (No - don't save) */
  onDiscard: () => void;
  /** Called when user chooses to save (Yes - save first) */
  onSave?: () => void;
}

/**
 * Unsaved changes warning dialog
 *
 * Three options like MegaMekLab:
 * - Yes: Save the unit first, then proceed
 * - No: Discard changes and proceed
 * - Cancel: Go back, don't close
 */
export function UnsavedChangesDialog({
  isOpen,
  unitName,
  onClose,
  onDiscard,
  onSave,
}: UnsavedChangesDialogProps): React.ReactElement {
  return (
    <ModalOverlay
      isOpen={isOpen}
      onClose={onClose}
      className="mx-4 w-full max-w-md"
    >
      {/* Header */}
      <div className={cs.dialog.header}>
        <h3 className={cs.dialog.headerTitle}>Save Unit Before Proceeding?</h3>
        <button onClick={onClose} className={cs.dialog.closeBtn}>
          <AppIcon name="close" size="control" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Warning icon */}
          <div className={cs.dialog.warningIcon}>
            <AppIcon name="warning" size="toolbar" className="text-accent" />
          </div>

          {/* Message */}
          <div className="flex-1">
            <p className="text-text-theme-secondary">
              All unsaved changes in the current unit will be discarded.
            </p>
            <p className="text-text-theme-secondary mt-1">
              Save the unit first?
            </p>
            {unitName && (
              <p className="text-text-theme-muted mt-2 font-mono text-sm">
                Unit: {unitName}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer - Yes/No/Cancel buttons like MegaMekLab */}
      <div className={cs.dialog.footer}>
        {onSave && (
          <button
            onClick={onSave}
            className={`min-w-[80px] ${cs.dialog.btnPrimary}`}
          >
            Yes
          </button>
        )}
        <button
          onClick={onDiscard}
          className={`min-w-[80px] ${cs.dialog.btnSecondary}`}
        >
          No
        </button>
        <button
          onClick={onClose}
          className={`min-w-[80px] ${cs.dialog.btnGhost} bg-surface-raised hover:bg-surface-base rounded`}
        >
          Cancel
        </button>
      </div>
    </ModalOverlay>
  );
}
