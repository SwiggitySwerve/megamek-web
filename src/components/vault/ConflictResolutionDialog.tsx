/**
 * Conflict Resolution Dialog Component
 *
 * Dialog for resolving sync conflicts between local and remote versions
 * of vault items. Supports three resolution strategies:
 * - Keep Local: Use the local version, discard remote changes
 * - Accept Remote: Use the remote version, discard local changes
 * - Fork: Keep both versions by creating a copy
 *
 * @spec openspec/changes/add-vault-sharing/specs/vault-sharing/spec.md
 */

import React, { useState, useCallback } from 'react';

import type { ISyncConflict } from '@/types/vault';

import { InlineErrorMessage } from '@/components/common/InlineErrorMessage';
import { runBusyErrorOperation } from '@/components/common/runUiOperation';
import { SvgIcon } from '@/components/ui/SvgIcon';

import {
  WarningIcon,
  CheckIcon,
  getContentTypeLabel,
  getContentTypeIcon,
  formatConflictDate,
} from './ConflictResolution.icons';
import { buildResponseError } from './vaultDialogApi';
import { VaultDialogFrame } from './VaultDialogFrame';

// =============================================================================
// Types
// =============================================================================

export interface ConflictResolutionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  conflict: ISyncConflict | null;
  onResolved?: (
    conflictId: string,
    resolution: 'local' | 'remote' | 'forked',
  ) => void;
}

type ResolutionChoice = 'local' | 'remote' | 'fork';

async function resolveSyncConflict(
  conflictId: string,
  resolution: 'local' | 'remote' | 'forked',
): Promise<void> {
  const response = await fetch(`/api/vault/conflicts/${conflictId}/resolve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resolution }),
  });

  if (!response.ok) {
    throw await buildResponseError(
      response,
      'Response not JSON when resolving conflict',
      'Failed to resolve conflict',
    );
  }
}

// =============================================================================
// Resolution Option Component
// =============================================================================

interface ResolutionOptionProps {
  selected: boolean;
  onSelect: () => void;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

function ResolutionOption({
  selected,
  onSelect,
  title,
  description,
  icon,
  color,
}: ResolutionOptionProps): React.ReactElement {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
        selected
          ? `${color} border-current bg-current/10`
          : 'border-border-theme-strong bg-surface-raised/50 hover:border-border-theme-strong'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex-shrink-0 ${selected ? '' : 'text-text-theme-secondary'}`}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h4
              className={`font-medium ${selected ? '' : 'text-text-theme-primary'}`}
            >
              {title}
            </h4>
            {selected && (
              <CheckIcon className={`h-5 w-5 flex-shrink-0 ${color}`} />
            )}
          </div>
          <p
            className={`mt-1 text-sm ${selected ? 'opacity-90' : 'text-text-theme-secondary'}`}
          >
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}

// =============================================================================
// Component
// =============================================================================

export function ConflictResolutionDialog({
  isOpen,
  onClose,
  conflict,
  onResolved,
}: ConflictResolutionDialogProps): React.ReactElement | null {
  const [selectedResolution, setSelectedResolution] =
    useState<ResolutionChoice>('local');
  const [resolving, setResolving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetState = useCallback(() => {
    setSelectedResolution('local');
    setResolving(false);
    setError(null);
  }, []);

  const handleResolve = useCallback(async () => {
    if (!conflict) return;

    await runBusyErrorOperation(
      setResolving,
      setError,
      'Failed to resolve conflict',
      async () => {
        const resolution =
          selectedResolution === 'fork' ? 'forked' : selectedResolution;

        await resolveSyncConflict(conflict.id, resolution);

        onResolved?.(conflict.id, resolution as 'local' | 'remote' | 'forked');
        resetState();
        onClose();
      },
    );
  }, [conflict, selectedResolution, onResolved, resetState, onClose]);

  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [resetState, onClose]);

  if (!isOpen || !conflict) return null;

  return (
    <VaultDialogFrame
      overlayClassName="bg-black/50"
      panelClassName="mx-4 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-surface-base p-6"
    >
      {/* Header */}
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
          <WarningIcon />
        </div>
        <div>
          <h2 className="text-text-theme-primary text-xl font-bold">
            Sync Conflict
          </h2>
          <p className="text-text-theme-secondary mt-1 text-sm">
            This item was modified both locally and remotely. Choose how to
            resolve.
          </p>
        </div>
      </div>

      <InlineErrorMessage message={error} variant="dialog" />

      {/* Conflict Details */}
      <div className="bg-surface-raised/50 mb-6 rounded-lg p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="text-cyan-400">
            {getContentTypeIcon(conflict.contentType)}
          </div>
          <div>
            <h3 className="text-text-theme-primary font-medium">
              {conflict.itemName}
            </h3>
            <p className="text-text-theme-secondary text-xs">
              {getContentTypeLabel(conflict.contentType)}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          {/* Local Version */}
          <div className="bg-surface-base/50 rounded p-3">
            <div className="mb-2 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-sm font-medium text-emerald-400">
                Local Version
              </span>
            </div>
            <dl className="space-y-1 text-xs">
              <div className="flex justify-between">
                <dt className="text-text-theme-secondary">Version:</dt>
                <dd className="text-text-theme-primary">
                  {conflict.localVersion}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-theme-secondary">Hash:</dt>
                <dd
                  className="text-text-theme-primary max-w-[80px] truncate font-mono"
                  title={conflict.localHash}
                >
                  {conflict.localHash.slice(0, 8)}...
                </dd>
              </div>
            </dl>
          </div>

          {/* Remote Version */}
          <div className="bg-surface-base/50 rounded p-3">
            <div className="mb-2 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-violet-500" />
              <span className="text-sm font-medium text-violet-400">
                Remote Version
              </span>
            </div>
            <dl className="space-y-1 text-xs">
              <div className="flex justify-between">
                <dt className="text-text-theme-secondary">Version:</dt>
                <dd className="text-text-theme-primary">
                  {conflict.remoteVersion}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-theme-secondary">Hash:</dt>
                <dd
                  className="text-text-theme-primary max-w-[80px] truncate font-mono"
                  title={conflict.remoteHash}
                >
                  {conflict.remoteHash.slice(0, 8)}...
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-theme-secondary">From:</dt>
                <dd
                  className="text-text-theme-primary max-w-[80px] truncate"
                  title={conflict.remotePeerId}
                >
                  {conflict.remotePeerId.slice(0, 8)}...
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <p className="text-text-theme-muted mt-3 text-xs">
          Detected: {formatConflictDate(conflict.detectedAt)}
        </p>
      </div>

      {/* Resolution Options */}
      <div className="mb-6 space-y-3">
        <h3 className="text-text-theme-secondary text-sm font-medium">
          Resolution Options
        </h3>

        <ResolutionOption
          selected={selectedResolution === 'local'}
          onSelect={() => setSelectedResolution('local')}
          title="Keep Local"
          description="Use your local version and discard the remote changes."
          icon={
            <SvgIcon
              size="toolbar"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859"
              />
            </SvgIcon>
          }
          color="text-emerald-400"
        />

        <ResolutionOption
          selected={selectedResolution === 'remote'}
          onSelect={() => setSelectedResolution('remote')}
          title="Accept Remote"
          description="Use the remote version and discard your local changes."
          icon={
            <SvgIcon
              size="toolbar"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
              />
            </SvgIcon>
          }
          color="text-violet-400"
        />

        <ResolutionOption
          selected={selectedResolution === 'fork'}
          onSelect={() => setSelectedResolution('fork')}
          title="Fork (Keep Both)"
          description="Create a copy of the remote version while keeping your local version."
          icon={
            <SvgIcon
              size="toolbar"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
              />
            </SvgIcon>
          }
          color="text-amber-400"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          onClick={handleClose}
          disabled={resolving}
          className="bg-surface-raised text-text-theme-primary hover:bg-surface-raised rounded px-4 py-2 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleResolve}
          disabled={resolving}
          className="bg-accent text-on-accent hover:bg-accent-hover flex items-center gap-2 rounded px-4 py-2 disabled:opacity-50"
        >
          {resolving ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Resolving...
            </>
          ) : (
            <>
              <CheckIcon className="h-4 w-4" />
              Resolve Conflict
            </>
          )}
        </button>
      </div>
    </VaultDialogFrame>
  );
}

export default ConflictResolutionDialog;
