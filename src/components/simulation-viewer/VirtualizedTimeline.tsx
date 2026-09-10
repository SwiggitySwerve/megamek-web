import React, { memo, useCallback } from 'react';
import { List } from 'react-window';

import type { IBattleEvent } from '@/components/simulation-viewer/pages/encounter-history/types';

import { AppIcon, type AppIconName } from '@/components/ui/AppIcon';
import { FOCUS_RING_CLASSES } from '@/utils/accessibility';

/* ========================================================================== */
/*  Types                                                                      */
/* ========================================================================== */

/**
 * Props for the VirtualizedTimeline component.
 * Uses react-window List for efficient rendering of 1000+ events.
 */
export interface IVirtualizedTimelineProps {
  /** Array of battle events to display */
  readonly events: readonly IBattleEvent[];
  /** Container height in pixels */
  readonly height?: number;
  /** Height of each row in pixels */
  readonly itemHeight?: number;
  /** Callback when an event is clicked */
  readonly onEventClick?: (event: IBattleEvent) => void;
  /** Function to resolve unit IDs to display names */
  readonly resolveUnitName?: (unitId: string) => string;
}

/* ========================================================================== */
/*  Constants                                                                  */
/* ========================================================================== */

const EVENT_TYPE_ICONS: Record<string, AppIconName> = {
  movement: 'arrow-right',
  attack: 'swords',
  damage: 'impact',
  'status-change': 'flame',
};

const DEFAULT_HEIGHT = 384; // matches max-h-96
const DEFAULT_ITEM_HEIGHT = 52;

/* ========================================================================== */
/*  Row Component                                                              */
/* ========================================================================== */

interface ITimelineRowProps {
  events: readonly IBattleEvent[];
  onEventClick?: (event: IBattleEvent) => void;
  resolveUnitName?: (unitId: string) => string;
}

const TimelineRow = ({
  index,
  style,
  events,
  onEventClick,
  resolveUnitName,
}: {
  index: number;
  style: React.CSSProperties;
  ariaAttributes: {
    'aria-posinset': number;
    'aria-setsize': number;
    role: 'listitem';
  };
} & ITimelineRowProps): React.ReactElement | null => {
  const event = events[index];
  if (!event) return null;

  const icon = EVENT_TYPE_ICONS[event.type] ?? 'list';
  const unitNames = resolveUnitName
    ? event.involvedUnits.map(resolveUnitName).join(', ')
    : event.involvedUnits.join(', ');

  return (
    <div
      style={style}
      className={`border-border-theme-subtle hover:bg-surface-base border-b px-4 py-2 transition-colors ${onEventClick ? `cursor-pointer ${FOCUS_RING_CLASSES}` : ''}`}
      onClick={() => onEventClick?.(event)}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onEventClick) {
          e.preventDefault();
          onEventClick(event);
        }
      }}
      role={onEventClick ? 'button' : undefined}
      tabIndex={onEventClick ? 0 : undefined}
      aria-label={`Turn ${event.turn}, ${event.phase}: ${event.description}`}
      data-testid={`virtualized-event-${event.id}`}
    >
      <div className="flex h-full items-center gap-3">
        <span className="flex-shrink-0 text-base" aria-hidden="true">
          <AppIcon name={icon} size="inline" />
        </span>
        <span className="text-text-theme-muted w-14 flex-shrink-0 text-xs font-medium whitespace-nowrap">
          Turn {event.turn}
        </span>
        <span className="text-text-theme-muted w-16 flex-shrink-0 text-xs whitespace-nowrap">
          {event.phase}
        </span>
        <span className="text-text-theme-primary flex-1 truncate text-sm">
          {event.description}
        </span>
        {unitNames && (
          <span className="text-text-theme-muted ml-auto max-w-32 flex-shrink-0 truncate text-xs whitespace-nowrap">
            {unitNames}
          </span>
        )}
      </div>
    </div>
  );
};

/* ========================================================================== */
/*  Component                                                                  */
/* ========================================================================== */

/**
 * Virtualized event timeline using react-window.
 * Efficiently renders 1000+ events by only mounting visible rows.
 */
export const VirtualizedTimeline = memo<IVirtualizedTimelineProps>(
  ({
    events,
    height = DEFAULT_HEIGHT,
    itemHeight = DEFAULT_ITEM_HEIGHT,
    onEventClick,
    resolveUnitName,
  }) => {
    const rowProps = useCallback(
      () => ({ events, onEventClick, resolveUnitName }),
      [events, onEventClick, resolveUnitName],
    );

    if (events.length === 0) {
      return (
        <p
          className="text-text-theme-muted py-8 text-center text-sm italic"
          data-testid="virtualized-timeline-empty"
        >
          No events recorded.
        </p>
      );
    }

    return (
      <div
        data-testid="virtualized-timeline"
        className="border-border-theme-subtle bg-surface-base overflow-hidden rounded-lg border"
      >
        <List
          rowComponent={TimelineRow}
          rowCount={events.length}
          rowHeight={itemHeight}
          rowProps={rowProps()}
          style={{ height }}
          overscanCount={5}
        />
      </div>
    );
  },
);

VirtualizedTimeline.displayName = 'VirtualizedTimeline';
