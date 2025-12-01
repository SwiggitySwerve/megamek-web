/**
 * Unsaved Changes Dialog Component
 * 
 * Confirmation dialog for closing tabs with unsaved changes.
 * Matches MegaMekLab's "Save Unit Before Proceeding?" dialog style.
 * 
 * @spec openspec/specs/multi-unit-tabs/spec.md
 */

import React from 'react';
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
}: UnsavedChangesDialogProps) {
  return (
    <ModalOverlay
      isOpen={isOpen}
      onClose={onClose}
      className="w-full max-w-md mx-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
        <h3 className="text-lg font-medium text-white">Save Unit Before Proceeding?</h3>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Warning icon */}
          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-amber-500/20 rounded-full">
            <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          {/* Message */}
          <div className="flex-1">
            <p className="text-slate-300">
              All unsaved changes in the current unit will be discarded.
            </p>
            <p className="text-slate-400 mt-1">
              Save the unit first?
            </p>
            {unitName && (
              <p className="text-slate-500 text-sm mt-2 font-mono">
                Unit: {unitName}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer - Yes/No/Cancel buttons like MegaMekLab */}
      <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-slate-700 bg-slate-800/50">
        {onSave && (
          <button
            onClick={onSave}
            className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors min-w-[80px]"
          >
            Yes
          </button>
        )}
        <button
          onClick={onDiscard}
          className="px-4 py-2 text-sm font-medium bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors min-w-[80px]"
        >
          No
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium bg-slate-700 hover:bg-slate-600 text-slate-300 rounded transition-colors min-w-[80px]"
        >
          Cancel
        </button>
      </div>
    </ModalOverlay>
  );
}

