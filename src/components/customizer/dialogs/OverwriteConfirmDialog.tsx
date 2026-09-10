/**
 * Overwrite Confirmation Dialog Component
 *
 * Confirms whether the user wants to overwrite an existing custom unit
 * or save with a new name instead.
 *
 * @spec openspec/specs/unit-services/spec.md
 */

import React from 'react';

import { AppIcon } from '@/components/ui/AppIcon';

import { customizerStyles as cs } from '../styles';
import { ModalOverlay } from './ModalOverlay';

// =============================================================================
// Types
// =============================================================================

export interface OverwriteConfirmDialogProps {
  /** Whether dialog is open */
  isOpen: boolean;
  /** Name of the unit being saved */
  newUnitName: string;
  /** Name of the existing unit that would be overwritten */
  existingUnitName: string;
  /** Called when user chooses to overwrite */
  onOverwrite: () => void;
  /** Called when user chooses to save as new (different name) */
  onSaveAsNew: () => void;
  /** Called when user cancels */
  onCancel: () => void;
}

// =============================================================================
// Component
// =============================================================================

export function OverwriteConfirmDialog({
  isOpen,
  newUnitName: _newUnitName,
  existingUnitName,
  onOverwrite,
  onSaveAsNew,
  onCancel,
}: OverwriteConfirmDialogProps): React.ReactElement {
  return (
    <ModalOverlay
      isOpen={isOpen}
      onClose={onCancel}
      className="mx-4 w-full max-w-md"
    >
      {/* Header */}
      <div className={cs.dialog.header}>
        <h3 className={cs.dialog.headerTitle}>Unit Already Exists</h3>
        <button onClick={onCancel} className={cs.dialog.closeBtn}>
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
              A custom unit with this name already exists:
            </p>
            <p className="bg-surface-raised/50 text-text-theme-primary mt-2 rounded p-2 font-medium">
              {existingUnitName}
            </p>
            <p className="text-text-theme-secondary mt-3 text-sm">
              Would you like to overwrite the existing unit or save with a
              different name?
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={cs.dialog.footer}>
        <button onClick={onCancel} className={cs.dialog.btnGhost}>
          Cancel
        </button>
        <button onClick={onSaveAsNew} className={cs.dialog.btnSecondary}>
          Save As New
        </button>
        <button onClick={onOverwrite} className={cs.dialog.btnWarning}>
          Overwrite
        </button>
      </div>
    </ModalOverlay>
  );
}
