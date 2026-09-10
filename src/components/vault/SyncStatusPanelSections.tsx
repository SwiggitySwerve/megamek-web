import React from 'react';

import type {
  IQueueStats,
  IPeerQueueSummary,
  P2PConnectionState,
} from '@/types/vault';

import { Button } from '@/components/ui/Button';
import { formatBytes, formatNumber } from '@/utils/formatting';

import { ArrowPathIcon, TrashIcon, UserIcon } from './SyncStatus.icons';
import { PeerSyncRow } from './SyncStatusPeerRow';

interface QueueStatsGridProps {
  totalPending: number;
  totalFailed: number;
  totalExpired: number;
  expiringSoon: number;
}

export function QueueStatsGrid({
  totalPending,
  totalFailed,
  totalExpired,
  expiringSoon,
}: QueueStatsGridProps): React.ReactElement {
  return (
    <div className="bg-surface-raised/30 grid flex-shrink-0 grid-cols-4 gap-px">
      <QueueStat
        value={totalPending}
        label="Pending"
        colorClass="text-amber-400"
      />
      <QueueStat value={totalFailed} label="Failed" colorClass="text-red-400" />
      <QueueStat
        value={totalExpired}
        label="Expired"
        colorClass="text-text-theme-secondary"
      />
      <QueueStat
        value={expiringSoon}
        label="Expiring"
        colorClass="text-orange-400"
      />
    </div>
  );
}

interface QueueStatProps {
  value: number;
  label: string;
  colorClass: string;
}

function QueueStat({
  value,
  label,
  colorClass,
}: QueueStatProps): React.ReactElement {
  return (
    <div className="bg-surface-base/80 p-4 text-center">
      <div className={`text-2xl font-bold tabular-nums ${colorClass}`}>
        {formatNumber(value)}
      </div>
      <div className="text-text-theme-muted mt-1 text-xs tracking-wider uppercase">
        {label}
      </div>
    </div>
  );
}

interface QueueStorageInfoProps {
  stats?: IQueueStats | null;
}

export function QueueStorageInfo({
  stats,
}: QueueStorageInfoProps): React.ReactElement | null {
  if (!stats || stats.totalSizeBytes <= 0) {
    return null;
  }

  return (
    <div className="border-border-theme/50 bg-surface-base/50 flex items-center justify-between border-b px-5 py-3 text-sm">
      <span className="text-text-theme-secondary">Queue storage used</span>
      <span className="text-text-theme-primary font-medium tabular-nums">
        {formatBytes(stats.totalSizeBytes)}
      </span>
    </div>
  );
}

interface GlobalQueueActionsProps {
  onFlushAll?: () => Promise<void>;
  onClearExpired?: () => Promise<void>;
  onFlushAllClick: () => void | Promise<void>;
  onClearExpiredClick: () => void | Promise<void>;
  isFlushingAll: boolean;
  isClearingExpired: boolean;
  totalPending: number;
  totalExpired: number;
}

export function GlobalQueueActions({
  onFlushAll,
  onClearExpired,
  onFlushAllClick,
  onClearExpiredClick,
  isFlushingAll,
  isClearingExpired,
  totalPending,
  totalExpired,
}: GlobalQueueActionsProps): React.ReactElement | null {
  if (!onFlushAll && !onClearExpired) {
    return null;
  }

  return (
    <div className="border-border-theme/50 bg-surface-base/30 flex items-center gap-3 border-b px-5 py-3">
      {onFlushAll && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onFlushAllClick}
          isLoading={isFlushingAll}
          disabled={isFlushingAll || totalPending === 0}
          leftIcon={<ArrowPathIcon className="h-4 w-4" />}
        >
          Flush All
        </Button>
      )}
      {onClearExpired && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearExpiredClick}
          isLoading={isClearingExpired}
          disabled={isClearingExpired || totalExpired === 0}
          leftIcon={<TrashIcon className="h-4 w-4" />}
        >
          Clear Expired
        </Button>
      )}
    </div>
  );
}

interface PeerListProps {
  peerSummaries: IPeerQueueSummary[];
  peerStates: Record<string, P2PConnectionState>;
  peerNames: Record<string, string>;
  onFlushPeer?: (peerId: string) => Promise<void>;
}

export function PeerList({
  peerSummaries,
  peerStates,
  peerNames,
  onFlushPeer,
}: PeerListProps): React.ReactElement {
  if (peerSummaries.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="bg-surface-raised/50 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
          <UserIcon size="feature" className="text-text-theme-muted" />
        </div>
        <p className="text-text-theme-secondary font-medium">
          No peers connected
        </p>
        <p className="text-text-theme-muted mt-1 text-sm">
          Peer sync status will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="divide-border-theme/50 divide-y">
        {peerSummaries.map((summary) => (
          <PeerSyncRow
            key={summary.peerId}
            peerId={summary.peerId}
            peerName={peerNames[summary.peerId]}
            connectionState={peerStates[summary.peerId] ?? 'disconnected'}
            pendingCount={summary.pendingCount}
            pendingSizeBytes={summary.pendingSizeBytes}
            failedCount={summary.failedCount}
            lastSuccessAt={summary.lastSuccessAt}
            onFlush={
              onFlushPeer
                ? async () => {
                    await onFlushPeer(summary.peerId);
                  }
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
}
