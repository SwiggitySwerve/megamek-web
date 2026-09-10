import React from 'react';

import type { IShareLink, PermissionLevel } from '@/types/vault';

import { InlineErrorMessage } from '@/components/common/InlineErrorMessage';

export type ExpiryOption =
  | 'none'
  | '1hour'
  | '1day'
  | '1week'
  | '1month'
  | 'custom';
export type MaxUsesOption = 'unlimited' | '1' | '5' | '10' | 'custom';

export interface ShareLinkResult {
  link: IShareLink;
  url: string;
}

interface ShareDialogSuccessProps {
  result: ShareLinkResult;
  copied: boolean;
  onCopy: () => void | Promise<void>;
  onCreateAnother: () => void;
  onClose: () => void;
}

export function ShareDialogSuccess({
  result,
  copied,
  onCopy,
  onCreateAnother,
  onClose,
}: ShareDialogSuccessProps): React.ReactElement {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-surface-base mx-4 w-full max-w-md rounded-lg p-6">
        <h2 className="mb-4 text-xl font-bold text-green-400">
          Share Link Created
        </h2>

        <div className="space-y-4">
          <div>
            <label className="text-text-theme-secondary mb-1 block text-sm">
              Share Link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={result.url}
                className="border-border-theme-strong bg-surface-raised text-text-theme-primary flex-1 rounded border px-3 py-2 font-mono text-sm"
              />
              <button
                onClick={onCopy}
                className="bg-accent text-on-accent hover:bg-accent-hover rounded px-4 py-2 whitespace-nowrap"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="bg-surface-raised rounded-lg p-4">
            <h3 className="text-text-theme-primary mb-2 font-medium">
              Link Settings
            </h3>
            <dl className="space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-text-theme-secondary">Permission:</dt>
                <dd className="text-text-theme-primary capitalize">
                  {result.link.level}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-theme-secondary">Expires:</dt>
                <dd className="text-text-theme-primary">
                  {result.link.expiresAt
                    ? new Date(result.link.expiresAt).toLocaleString()
                    : 'Never'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-theme-secondary">Max Uses:</dt>
                <dd className="text-text-theme-primary">
                  {result.link.maxUses ?? 'Unlimited'}
                </dd>
              </div>
              {result.link.label && (
                <div className="flex justify-between">
                  <dt className="text-text-theme-secondary">Label:</dt>
                  <dd className="text-text-theme-primary">
                    {result.link.label}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={onCreateAnother}
              className="bg-surface-raised text-text-theme-primary hover:bg-surface-raised w-full rounded px-4 py-2"
            >
              Create Another Link
            </button>
            <button
              onClick={onClose}
              className="bg-surface-raised text-text-theme-primary hover:bg-surface-raised w-full rounded px-4 py-2"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ShareDialogFormProps {
  itemName: string;
  level: PermissionLevel;
  expiryOption: ExpiryOption;
  customExpiry: string;
  maxUsesOption: MaxUsesOption;
  customMaxUses: number;
  label: string;
  creating: boolean;
  error: string | null;
  onLevelChange: (level: PermissionLevel) => void;
  onExpiryOptionChange: (option: ExpiryOption) => void;
  onCustomExpiryChange: (value: string) => void;
  onMaxUsesOptionChange: (option: MaxUsesOption) => void;
  onCustomMaxUsesChange: (value: number) => void;
  onLabelChange: (value: string) => void;
  onClose: () => void;
  onCreate: () => void | Promise<void>;
}

export function ShareDialogForm({
  itemName,
  level,
  expiryOption,
  customExpiry,
  maxUsesOption,
  customMaxUses,
  label,
  creating,
  error,
  onLevelChange,
  onExpiryOptionChange,
  onCustomExpiryChange,
  onMaxUsesOptionChange,
  onCustomMaxUsesChange,
  onLabelChange,
  onClose,
  onCreate,
}: ShareDialogFormProps): React.ReactElement {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-surface-base mx-4 w-full max-w-md rounded-lg p-6">
        <h2 className="text-text-theme-primary mb-4 text-xl font-bold">
          Share {itemName}
        </h2>

        <InlineErrorMessage message={error} variant="dialog" />

        <div className="space-y-4">
          {/* Permission Level */}
          <div>
            <label className="text-text-theme-secondary mb-1 block text-sm">
              Permission Level
            </label>
            <select
              value={level}
              onChange={(event) =>
                onLevelChange(event.target.value as PermissionLevel)
              }
              className="border-border-theme-strong bg-surface-raised text-text-theme-primary w-full rounded border px-3 py-2"
            >
              <option value="read">Read - View and copy content</option>
              <option value="write">Write - View, copy, and edit</option>
              <option value="admin">
                Admin - Full access including re-share
              </option>
            </select>
          </div>

          {/* Expiration */}
          <div>
            <label className="text-text-theme-secondary mb-1 block text-sm">
              Link Expiration
            </label>
            <select
              value={expiryOption}
              onChange={(event) =>
                onExpiryOptionChange(event.target.value as ExpiryOption)
              }
              className="border-border-theme-strong bg-surface-raised text-text-theme-primary w-full rounded border px-3 py-2"
            >
              <option value="none">Never expires</option>
              <option value="1hour">1 hour</option>
              <option value="1day">1 day</option>
              <option value="1week">1 week</option>
              <option value="1month">1 month</option>
              <option value="custom">Custom date</option>
            </select>
            {expiryOption === 'custom' && (
              <input
                type="datetime-local"
                value={customExpiry}
                onChange={(event) => onCustomExpiryChange(event.target.value)}
                className="border-border-theme-strong bg-surface-raised text-text-theme-primary mt-2 w-full rounded border px-3 py-2"
              />
            )}
          </div>

          {/* Max Uses */}
          <div>
            <label className="text-text-theme-secondary mb-1 block text-sm">
              Maximum Uses
            </label>
            <select
              value={maxUsesOption}
              onChange={(event) =>
                onMaxUsesOptionChange(event.target.value as MaxUsesOption)
              }
              className="border-border-theme-strong bg-surface-raised text-text-theme-primary w-full rounded border px-3 py-2"
            >
              <option value="unlimited">Unlimited</option>
              <option value="1">1 use</option>
              <option value="5">5 uses</option>
              <option value="10">10 uses</option>
              <option value="custom">Custom</option>
            </select>
            {maxUsesOption === 'custom' && (
              <input
                type="number"
                min="1"
                value={customMaxUses}
                onChange={(event) =>
                  onCustomMaxUsesChange(parseInt(event.target.value, 10) || 1)
                }
                className="border-border-theme-strong bg-surface-raised text-text-theme-primary mt-2 w-full rounded border px-3 py-2"
                placeholder="Enter max uses"
              />
            )}
          </div>

          {/* Label */}
          <div>
            <label className="text-text-theme-secondary mb-1 block text-sm">
              Label (optional)
            </label>
            <input
              type="text"
              value={label}
              onChange={(event) => onLabelChange(event.target.value)}
              placeholder="e.g., For Discord server"
              className="border-border-theme-strong bg-surface-raised text-text-theme-primary w-full rounded border px-3 py-2"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={creating}
            className="bg-surface-raised text-text-theme-primary hover:bg-surface-raised rounded px-4 py-2 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onCreate}
            disabled={creating || (expiryOption === 'custom' && !customExpiry)}
            className="bg-accent text-on-accent hover:bg-accent-hover rounded px-4 py-2 disabled:opacity-50"
          >
            {creating ? 'Creating...' : 'Create Link'}
          </button>
        </div>
      </div>
    </div>
  );
}
