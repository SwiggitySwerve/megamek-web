/**
 * Unsaved Changes Dialog Component
 * 
 * Confirmation dialog for closing tabs with unsaved changes.
 * 
 * @spec openspec/changes/add-customizer-ui-components/specs/multi-unit-tabs/spec.md
 */

import React from 'react';
import { ModalOverlay } from './ModalOverlay';

interface UnsavedChangesDialogProps {
  /** Whether dialog is open */
  isOpen: boolean;
  /** Unit name */
  unitName: string;
  /** Called when dialog is closed */
  onClose: () => void;
  /** Called when user confirms discard */
  onDiscard: () => void;
  /** Called when user chooses to save */
  onSave?: () => void;
}

/**
 * Unsaved changes warning dialog
 */
export function UnsavedChangesDialog({
  isOpen,
  unitName,
  onClose,
  onDiscard,
  onSave,
}: UnsavedChangesDialogProps) {
  return (
    <ModalOverlay
      isOpen={isOpen}
      onClose={onClose}
      className="w-full max-w-sm mx-4"
    >
      {/* Content */}
      <div className="p-4">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-white mb-2">Unsaved Changes</h3>
          <p className="text-slate-400">
            &quot;{unitName}&quot; has unsaved changes. Do you want to discard them?
          </p>
        </div>
      </div>
      
      {/* Footer */}
      <div className="flex flex-col gap-2 px-4 py-3 border-t border-slate-700">
        {onSave && (
          <button
            onClick={onSave}
            className="w-full px-4 py-2 text-sm font-medium bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors"
          >
            Save Changes
          </button>
        )}
        <button
          onClick={onDiscard}
          className="w-full px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
        >
          Discard Changes
        </button>
        <button
          onClick={onClose}
          className="w-full px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>
    </ModalOverlay>
  );
}

