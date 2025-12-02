/**
 * Overwrite Confirmation Dialog Component
 * 
 * Confirms whether the user wants to overwrite an existing custom unit
 * or save with a new name instead.
 * 
 * @spec openspec/specs/unit-services/spec.md
 */

import React from 'react';
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
  newUnitName,
  existingUnitName,
  onOverwrite,
  onSaveAsNew,
  onCancel,
}: OverwriteConfirmDialogProps) {
  return (
    <ModalOverlay
      isOpen={isOpen}
      onClose={onCancel}
      className="w-full max-w-md mx-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
        <h3 className="text-lg font-medium text-white">Unit Already Exists</h3>
        <button
          onClick={onCancel}
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
              A custom unit with this name already exists:
            </p>
            <p className="text-white font-medium mt-2 p-2 bg-slate-700/50 rounded">
              {existingUnitName}
            </p>
            <p className="text-slate-400 mt-3 text-sm">
              Would you like to overwrite the existing unit or save with a different name?
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-slate-700 bg-slate-800/50">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onSaveAsNew}
          className="px-4 py-2 text-sm font-medium bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
        >
          Save As New
        </button>
        <button
          onClick={onOverwrite}
          className="px-4 py-2 text-sm font-medium bg-amber-600 hover:bg-amber-500 text-white rounded transition-colors"
        >
          Overwrite
        </button>
      </div>
    </ModalOverlay>
  );
}

