/**
 * PeerItemList Component
 * Displays items shared by peers with options to import (one-time copy).
 *
 * @spec openspec/changes/add-p2p-vault-sync/specs/vault-sync/spec.md
 */
import React, { useState, useCallback } from 'react';

import type { ISyncableVaultItem, SyncableItemType } from '@/lib/p2p/types';

import { AppIcon } from '@/components/ui/AppIcon';
import { Button } from '@/components/ui/Button';
import { SvgIcon } from '@/components/ui/SvgIcon';

// =============================================================================
// Types
// =============================================================================

interface PeerItemListProps {
  /** Items shared by peers (from Y.Map) */
  items: readonly ISyncableVaultItem[];
  /** Local peer ID to filter out own items */
  localPeerId: string | null;
  /** Callback when user imports an item */
  onImport: (item: ISyncableVaultItem) => void;
  /** Filter by item type */
  typeFilter?: SyncableItemType | 'all';
  /** Additional CSS classes */
  className?: string;
}

interface PeerItemCardProps {
  item: ISyncableVaultItem;
  onImport: () => void;
  isImporting: boolean;
}

// =============================================================================
// Helper Components
// =============================================================================

const typeIcons: Record<SyncableItemType, React.ReactElement> = {
  unit: <AppIcon name="mech" size="inline" />,
  pilot: <AppIcon name="pilot" size="inline" />,
  force: <AppIcon name="force" size="inline" />,
};

const typeLabels: Record<SyncableItemType, string> = {
  unit: 'Unit',
  pilot: 'Pilot',
  force: 'Force',
};

function PeerItemCard({
  item,
  onImport,
  isImporting,
}: PeerItemCardProps): React.ReactElement {
  const lastModified = new Date(item.lastModified).toLocaleDateString();

  return (
    <div className="bg-surface-base/30 border-border-theme-subtle/50 hover:border-border-theme-subtle flex items-center gap-3 rounded-lg border p-3 transition-colors">
      {/* Type icon */}
      <div className="bg-surface-raised text-text-theme-secondary border-border-theme-subtle flex h-8 w-8 items-center justify-center rounded border">
        {typeIcons[item.type]}
      </div>

      {/* Item info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-text-theme-primary truncate text-sm font-medium">
            {item.name}
          </span>
          <span className="bg-surface-raised text-text-theme-muted border-border-theme-subtle rounded border px-1.5 py-0.5 text-xs">
            {typeLabels[item.type]}
          </span>
        </div>
        <div className="text-text-theme-muted mt-0.5 text-xs">
          Modified {lastModified}
          {item.lastModifiedBy && (
            <span className="text-text-theme-muted/70 ml-1">
              by {item.lastModifiedBy.slice(0, 6)}...
            </span>
          )}
        </div>
      </div>

      {/* Import button */}
      <Button
        variant="secondary"
        size="sm"
        onClick={onImport}
        disabled={isImporting}
        isLoading={isImporting}
        leftIcon={!isImporting && <AppIcon name="download" size="inline" />}
      >
        Import
      </Button>
    </div>
  );
}

// =============================================================================
// Type Filter
// =============================================================================

interface TypeFilterProps {
  value: SyncableItemType | 'all';
  onChange: (value: SyncableItemType | 'all') => void;
  counts: Record<SyncableItemType | 'all', number>;
}

function TypeFilter({
  value,
  onChange,
  counts,
}: TypeFilterProps): React.ReactElement {
  const options: Array<{ key: SyncableItemType | 'all'; label: string }> = [
    { key: 'all', label: 'All' },
    { key: 'unit', label: 'Units' },
    { key: 'pilot', label: 'Pilots' },
    { key: 'force', label: 'Forces' },
  ];

  return (
    <div className="bg-surface-base/50 border-border-theme-subtle/50 flex gap-1 rounded-lg border p-1">
      {options.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
            value === key
              ? 'bg-accent-hover text-text-theme-primary'
              : 'text-text-theme-secondary hover:text-text-theme-primary hover:bg-surface-raised/50'
          } `}
        >
          {label}
          {counts[key] > 0 && (
            <span className="bg-surface-raised ml-1.5 rounded-full px-1.5 py-0.5 text-[10px]">
              {counts[key]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// =============================================================================
// Component
// =============================================================================

export function PeerItemList({
  items,
  localPeerId,
  onImport,
  typeFilter: initialTypeFilter = 'all',
  className = '',
}: PeerItemListProps): React.ReactElement {
  const [typeFilter, setTypeFilter] = useState<SyncableItemType | 'all'>(
    initialTypeFilter,
  );
  const [importingIds, setImportingIds] = useState<Set<string>>(new Set());

  // Filter out local items (items we own)
  const peerItems = items.filter(
    (item) => item.lastModifiedBy && item.lastModifiedBy !== localPeerId,
  );

  // Filter by type
  const filteredItems =
    typeFilter === 'all'
      ? peerItems
      : peerItems.filter((item) => item.type === typeFilter);

  // Calculate counts
  const counts: Record<SyncableItemType | 'all', number> = {
    all: peerItems.length,
    unit: peerItems.filter((i) => i.type === 'unit').length,
    pilot: peerItems.filter((i) => i.type === 'pilot').length,
    force: peerItems.filter((i) => i.type === 'force').length,
  };

  const handleImport = useCallback(
    async (item: ISyncableVaultItem) => {
      setImportingIds((prev) => new Set(prev).add(item.id));
      try {
        await onImport(item);
      } finally {
        setImportingIds((prev) => {
          const next = new Set(prev);
          next.delete(item.id);
          return next;
        });
      }
    },
    [onImport],
  );

  return (
    <div className={className}>
      {/* Header with filter */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-text-theme-primary text-sm font-medium">
          Shared by Peers
        </h3>
        <TypeFilter
          value={typeFilter}
          onChange={setTypeFilter}
          counts={counts}
        />
      </div>

      {/* Items list */}
      {filteredItems.length === 0 ? (
        <div className="py-8 text-center">
          <SvgIcon
            size="feature"
            className="text-text-theme-muted/50 mx-auto mb-3"
          >
            <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </SvgIcon>
          <p className="text-text-theme-muted text-sm">
            {peerItems.length === 0
              ? 'No items shared by peers yet'
              : `No ${typeFilter}s shared by peers`}
          </p>
          <p className="text-text-theme-muted/70 mt-1 text-xs">
            Items will appear here when peers enable sync
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {filteredItems.map((item) => (
            <li key={item.id}>
              <PeerItemCard
                item={item}
                onImport={() => handleImport(item)}
                isImporting={importingIds.has(item.id)}
              />
            </li>
          ))}
        </ul>
      )}

      {/* Import info */}
      {filteredItems.length > 0 && (
        <p className="text-text-theme-muted mt-4 text-center text-xs">
          Importing creates a local copy. Changes won&apos;t sync back to the
          peer.
        </p>
      )}
    </div>
  );
}

export default PeerItemList;
