/**
 * SyncBadge Component
 * Small icon badge indicating sync state for vault items.
 * Shows visual state with tooltip for detailed description.
 *
 * @spec openspec/changes/add-p2p-vault-sync/specs/vault-sync/spec.md
 */
import React, { useState, useCallback } from 'react';

import { AppIcon } from '@/components/ui/AppIcon';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { SyncState } from '@/lib/p2p/types';

// =============================================================================
// Types
// =============================================================================

interface SyncBadgeProps {
  /** Current sync state of the item */
  state: SyncState;
  /** Size variant */
  size?: 'sm' | 'md';
  /** Additional CSS classes */
  className?: string;
}

// =============================================================================
// State Configuration
// =============================================================================

interface StateConfig {
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
  borderColor: string;
  tooltip: string;
  animate: boolean;
}

function getSyncedIcon(size: 'inline' | 'control'): React.ReactNode {
  return <AppIcon name="check" size={size} />;
}

function getPendingIcon(size: 'inline' | 'control'): React.ReactNode {
  return (
    <SvgIcon size={size} fill="currentColor">
      <circle cx="12" cy="12" r="4" />
    </SvgIcon>
  );
}

function getSyncingIcon(size: 'inline' | 'control'): React.ReactNode {
  return <AppIcon name="refresh" size={size} className="animate-spin" />;
}

function getConflictIcon(size: 'inline' | 'control'): React.ReactNode {
  return <AppIcon name="warning" size={size} />;
}

function getDisabledIcon(size: 'inline' | 'control'): React.ReactNode {
  return (
    <SvgIcon size={size}>
      <path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
    </SvgIcon>
  );
}

function getStateConfig(
  state: SyncState,
  iconSize: 'inline' | 'control',
): StateConfig {
  switch (state) {
    case SyncState.Synced:
      return {
        icon: getSyncedIcon(iconSize),
        bgColor: 'bg-emerald-600/20',
        iconColor: 'text-emerald-400',
        borderColor: 'border-emerald-500/40',
        tooltip: 'Synced with all peers',
        animate: false,
      };
    case SyncState.Pending:
      return {
        icon: getPendingIcon(iconSize),
        bgColor: 'bg-amber-600/20',
        iconColor: 'text-amber-400',
        borderColor: 'border-amber-500/40',
        tooltip: 'Changes pending sync',
        animate: false,
      };
    case SyncState.Syncing:
      return {
        icon: getSyncingIcon(iconSize),
        bgColor: 'bg-cyan-600/20',
        iconColor: 'text-cyan-400',
        borderColor: 'border-cyan-500/40',
        tooltip: 'Syncing...',
        animate: true,
      };
    case SyncState.Conflict:
      return {
        icon: getConflictIcon(iconSize),
        bgColor: 'bg-red-600/20',
        iconColor: 'text-red-400',
        borderColor: 'border-red-500/40',
        tooltip: 'Sync conflict - needs resolution',
        animate: false,
      };
    case SyncState.Disabled:
    default:
      return {
        icon: getDisabledIcon(iconSize),
        bgColor: 'bg-surface-raised/20',
        iconColor: 'text-text-theme-muted',
        borderColor: 'border-border-theme-strong/30',
        tooltip: 'Sync disabled',
        animate: false,
      };
  }
}

// =============================================================================
// Size Configuration
// =============================================================================

const sizeConfig = {
  sm: {
    container: 'w-5 h-5',
    icon: 'inline' as const,
  },
  md: {
    container: 'w-6 h-6',
    icon: 'control' as const,
  },
};

// =============================================================================
// Component
// =============================================================================

export function SyncBadge({
  state,
  size = 'sm',
  className = '',
}: SyncBadgeProps): React.ReactElement {
  const [showTooltip, setShowTooltip] = useState(false);
  const sizes = sizeConfig[size];
  const config = getStateConfig(state, sizes.icon);

  const handleMouseEnter = useCallback(() => setShowTooltip(true), []);
  const handleMouseLeave = useCallback(() => setShowTooltip(false), []);

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Badge */}
      <div
        className={` ${sizes.container} flex items-center justify-center rounded-full border ${config.bgColor} ${config.iconColor} ${config.borderColor} transition-colors`}
        aria-label={config.tooltip}
      >
        {config.icon}
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="bg-surface-raised border-border-theme absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 rounded-lg border px-2.5 py-1.5 whitespace-nowrap shadow-lg shadow-black/30">
          <p className="text-text-theme-primary text-xs font-medium">
            {config.tooltip}
          </p>
          {/* Tooltip arrow */}
          <div className="border-t-surface-raised absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent" />
        </div>
      )}
    </div>
  );
}

export default SyncBadge;
