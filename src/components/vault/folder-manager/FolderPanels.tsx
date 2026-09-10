/**
 * Folder Panel Components
 *
 * FolderSharePanel and FolderItemsPanel for sharing and item management.
 */

import React, { useState, useCallback, useMemo } from 'react';

import type { ShareableContentType, PermissionLevel } from '@/types/vault';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

import type {
  FolderSharePanelProps,
  FolderItemsPanelProps,
} from './FolderManagerTypes';

import {
  FolderIcon,
  FolderOpenIcon,
  ShareIcon,
  PlusIcon,
  TrashIcon,
  UserIcon,
  MechIcon,
  PilotIcon,
  ForceIcon,
  EncounterIcon,
  SpinnerIcon,
} from './FolderManagerIcons';

// =============================================================================
// Helpers
// =============================================================================

function getItemTypeIcon(type: ShareableContentType): React.ReactNode {
  switch (type) {
    case 'unit':
      return <MechIcon className="h-4 w-4" />;
    case 'pilot':
      return <PilotIcon className="h-4 w-4" />;
    case 'force':
      return <ForceIcon className="h-4 w-4" />;
    case 'encounter':
      return <EncounterIcon className="h-4 w-4" />;
    default:
      return <MechIcon className="h-4 w-4" />;
  }
}

function getPermissionBadgeVariant(
  level: PermissionLevel,
): 'emerald' | 'amber' | 'violet' {
  switch (level) {
    case 'read':
      return 'emerald';
    case 'write':
      return 'amber';
    case 'admin':
      return 'violet';
    default:
      return 'emerald';
  }
}

// =============================================================================
// FolderSharePanel Component
// =============================================================================

export function FolderSharePanel({
  folder,
  shares = [],
  contacts = [],
  isLoading,
  onAddShare,
  onRemoveShare,
}: FolderSharePanelProps): React.ReactElement {
  const [selectedContact, setSelectedContact] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<PermissionLevel>('read');
  const [adding, setAdding] = useState(false);

  const availableContacts = useMemo(() => {
    const sharedContactIds = new Set(shares.map((s) => s.granteeId));
    return contacts.filter((c) => !sharedContactIds.has(c.friendCode));
  }, [contacts, shares]);

  const handleAddShare = useCallback(async () => {
    if (!selectedContact || !onAddShare) return;

    setAdding(true);
    try {
      await onAddShare(selectedContact, selectedLevel);
      setSelectedContact('');
      setSelectedLevel('read');
    } finally {
      setAdding(false);
    }
  }, [selectedContact, selectedLevel, onAddShare]);

  if (!folder) {
    return (
      <Card className="p-6">
        <div className="py-8 text-center">
          <ShareIcon
            size="feature"
            className="text-text-theme-muted mx-auto mb-3"
          />
          <p className="text-text-theme-secondary">
            Select a folder to manage sharing
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="border-border-theme/50 border-b bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-4">
        <div className="flex items-center gap-3">
          <ShareIcon className="h-5 w-5 text-blue-400" />
          <div>
            <h3 className="text-text-theme-primary font-semibold">Sharing</h3>
            <p className="text-text-theme-secondary text-xs">{folder.name}</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Add Share Section */}
        {availableContacts.length > 0 && (
          <div className="border-border-theme/50 bg-surface-raised/30 mb-6 rounded-xl border p-4">
            <div className="mb-3 flex items-center gap-2">
              <PlusIcon className="text-text-theme-secondary h-4 w-4" />
              <span className="text-text-theme-secondary text-sm font-medium">
                Add Contact
              </span>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedContact}
                onChange={(e) => setSelectedContact(e.target.value)}
                className="border-border-theme-strong bg-surface-base/50 text-text-theme-primary focus:border-accent flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none"
              >
                <option value="">Select contact...</option>
                {availableContacts.map((contact) => (
                  <option key={contact.id} value={contact.friendCode}>
                    {contact.nickname || contact.displayName}
                  </option>
                ))}
              </select>
              <select
                value={selectedLevel}
                onChange={(e) =>
                  setSelectedLevel(e.target.value as PermissionLevel)
                }
                className="border-border-theme-strong bg-surface-base/50 text-text-theme-primary focus:border-accent rounded-lg border px-3 py-2 text-sm focus:outline-none"
              >
                <option value="read">Read</option>
                <option value="write">Write</option>
                <option value="admin">Admin</option>
              </select>
              <Button
                variant="primary"
                size="sm"
                onClick={handleAddShare}
                disabled={!selectedContact || adding}
                isLoading={adding}
              >
                Add
              </Button>
            </div>
          </div>
        )}

        {/* Share List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <SpinnerIcon className="h-5 w-5 text-blue-400" />
            <span className="text-text-theme-secondary ml-2 text-sm">
              Loading shares...
            </span>
          </div>
        ) : shares.length === 0 ? (
          <div className="py-8 text-center">
            <UserIcon
              size="feature"
              className="text-text-theme-muted mx-auto mb-3"
            />
            <p className="text-text-theme-secondary text-sm">
              Not shared with anyone
            </p>
            <p className="text-text-theme-muted mt-1 text-xs">
              Add contacts to share this folder
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {shares.map((share) => (
              <div
                key={share.id}
                className="border-border-theme/50 bg-surface-raised/30 hover:border-border-theme-strong/50 flex items-center justify-between rounded-lg border p-3 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/30">
                    <UserIcon className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-text-theme-primary text-sm font-medium">
                      {share.granteeName || share.granteeId}
                    </p>
                    <p className="text-text-theme-muted font-mono text-xs">
                      {share.granteeId.slice(0, 12)}...
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={getPermissionBadgeVariant(share.level)}
                    size="sm"
                  >
                    {share.level}
                  </Badge>
                  <button
                    onClick={() => onRemoveShare?.(share.id)}
                    className="text-text-theme-secondary rounded-lg p-1.5 transition-colors hover:bg-red-500/10 hover:text-red-400"
                    title="Remove share"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

// =============================================================================
// FolderItemsPanel Component
// =============================================================================

export function FolderItemsPanel({
  folder,
  items = [],
  isLoading,
  onAddItem,
  onRemoveItem,
}: FolderItemsPanelProps): React.ReactElement {
  if (!folder) {
    return (
      <Card className="p-6">
        <div className="py-8 text-center">
          <FolderIcon
            size="feature"
            className="text-text-theme-muted mx-auto mb-3"
          />
          <p className="text-text-theme-secondary">
            Select a folder to view contents
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="border-border-theme/50 border-b bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FolderOpenIcon className="h-5 w-5 text-emerald-400" />
            <div>
              <h3 className="text-text-theme-primary font-semibold">
                Contents
              </h3>
              <p className="text-text-theme-secondary text-xs">
                {folder.name} &middot; {items.length} items
              </p>
            </div>
          </div>
          {onAddItem && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onAddItem}
              leftIcon={<PlusIcon className="h-4 w-4" />}
            >
              Add Item
            </Button>
          )}
        </div>
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <SpinnerIcon className="h-5 w-5 text-emerald-400" />
            <span className="text-text-theme-secondary ml-2 text-sm">
              Loading items...
            </span>
          </div>
        ) : items.length === 0 ? (
          <div className="py-8 text-center">
            <div className="bg-surface-raised/50 mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl">
              <FolderOpenIcon className="text-text-theme-muted h-6 w-6" />
            </div>
            <p className="text-text-theme-secondary text-sm">
              This folder is empty
            </p>
            <p className="text-text-theme-muted mt-1 text-xs">
              Add units, pilots, or forces to organize them
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={`${item.itemType}-${item.itemId}`}
                className="group border-border-theme/50 bg-surface-raised/30 hover:border-border-theme-strong/50 flex items-center justify-between rounded-lg border p-3 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.itemType === 'unit' ? 'bg-amber-500/20 text-amber-400' : ''} ${item.itemType === 'pilot' ? 'bg-blue-500/20 text-blue-400' : ''} ${item.itemType === 'force' ? 'bg-violet-500/20 text-violet-400' : ''} ${item.itemType === 'encounter' ? 'bg-cyan-500/20 text-cyan-400' : ''} `}
                  >
                    {getItemTypeIcon(item.itemType)}
                  </div>
                  <div>
                    <p className="text-text-theme-primary text-sm font-medium">
                      {item.itemId}
                    </p>
                    <p className="text-text-theme-muted text-xs capitalize">
                      {item.itemType}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveItem?.(item.itemId, item.itemType)}
                  className="text-text-theme-secondary rounded-lg p-1.5 opacity-0 transition-colors group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-400"
                  title="Remove from folder"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
