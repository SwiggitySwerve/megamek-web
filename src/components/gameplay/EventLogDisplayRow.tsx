import React from 'react';

import { AppIcon, type AppIconName } from '@/components/ui/AppIcon';

import {
  getIconColor,
  getPhaseLabel,
  type IFormattedEventWithGrouping,
} from './EventLogDisplay.helpers';

interface EventRowProps {
  readonly event: IFormattedEventWithGrouping;
  readonly actorLookup?: Record<string, string>;
  /**
   * Called when the user clicks this row to focus the map on the
   * relevant unit or hex.
   *
   * @spec openspec/changes/add-tactical-map-lenses-feed-replay/specs/tactical-map-interface/spec.md
   *   "Feed row focuses event participants" scenario
   */
  readonly onRowFocus?: (eventId: string, unitId?: string) => void;
}

const EVENT_ICON_NAMES: Readonly<
  Record<IFormattedEventWithGrouping['icon'], AppIconName>
> = {
  movement: 'arrow-right',
  attack: 'swords',
  damage: 'impact',
  heat: 'flame',
  critical: 'warning',
  phase: 'encounter',
  status: 'info',
};

function eventRowInteractionProps(
  event: IFormattedEventWithGrouping,
  onRowFocus?: (eventId: string, unitId?: string) => void,
): Pick<
  React.HTMLAttributes<HTMLDivElement>,
  'onClick' | 'onKeyDown' | 'role' | 'tabIndex'
> {
  if (!onRowFocus) {
    return {};
  }

  return {
    onClick: () => onRowFocus(event.id, event.unitId),
    role: 'button',
    tabIndex: 0,
    onKeyDown: (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') {
        return;
      }
      e.preventDefault();
      onRowFocus(event.id, event.unitId);
    },
  };
}

export function EventRow({
  event,
  actorLookup,
  onRowFocus,
}: EventRowProps): React.ReactElement {
  const iconColor = getIconColor(event.icon);
  const actor = event.unitId
    ? (actorLookup?.[event.unitId] ?? event.unitId)
    : undefined;
  const isNested = event.indentLevel === 1;

  return (
    <div
      className={`hover:bg-surface-base flex items-start gap-2 px-2 py-1 text-sm ${
        isNested ? 'text-text-theme-muted pl-8 italic' : ''
      } ${onRowFocus ? 'cursor-pointer' : ''}`}
      data-testid="event-row"
      data-event-id={event.id}
      data-indent-level={event.indentLevel ?? 0}
      {...eventRowInteractionProps(event, onRowFocus)}
    >
      <span
        className={`${iconColor} w-4 font-bold`}
        data-testid="event-icon"
        data-icon-type={event.icon}
      >
        <AppIcon
          name={EVENT_ICON_NAMES[event.icon]}
          size="inline"
          aria-hidden="true"
        />
      </span>
      <span
        className="text-text-theme-muted w-8 text-xs"
        data-testid="event-turn"
      >
        T{event.turn}
      </span>
      <span
        className="bg-surface-base text-text-theme-muted w-12 rounded px-1 text-center text-[10px] font-semibold tracking-wide uppercase"
        data-testid="event-phase"
        data-phase={event.phase}
      >
        {getPhaseLabel(event.phase)}
      </span>
      {actor && (
        <span
          className="text-text-theme-primary w-20 truncate text-xs font-medium"
          data-testid="event-actor"
          data-unit-id={event.unitId}
          title={actor}
        >
          {actor}
        </span>
      )}
      <span className="flex-1" data-testid="event-text">
        {event.transferPrefix && (
          <span
            className="text-text-theme-muted mr-1"
            data-testid="event-transfer-prefix"
          >
            {event.transferPrefix}
          </span>
        )}
        {event.text}
      </span>
    </div>
  );
}
