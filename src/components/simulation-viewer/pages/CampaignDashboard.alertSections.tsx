import React from 'react';

import type { IPerformerSummary } from '@/types/simulation-viewer';

import { DrillDownLink } from '@/components/simulation-viewer/DrillDownLink';
import { AppIcon } from '@/components/ui/AppIcon';
import { FOCUS_RING_CLASSES, announce } from '@/utils/accessibility';

import type { CampaignDrillDownHandler } from './CampaignDashboard.overviewSections';

import {
  type IDerivedWarning,
  type PerformerSortKey,
  SEVERITY_BADGE,
  SEVERITY_CLASSES,
  SORT_OPTIONS,
  formatCompactNumber,
} from './CampaignDashboard.utils';

interface TopPerformersSectionProps {
  sortedPerformers: IPerformerSummary[];
  performerSortKey: PerformerSortKey;
  onSortChange: (sortKey: PerformerSortKey) => void;
  onDrillDown: CampaignDrillDownHandler;
}

export const TopPerformersSection: React.FC<TopPerformersSectionProps> = ({
  sortedPerformers,
  performerSortKey,
  onSortChange,
  onDrillDown,
}) => (
  <section
    className="col-span-1 space-y-3 md:col-span-2 lg:col-span-3"
    aria-label="Top performers"
    data-testid="top-performers-section"
  >
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h2
        className="text-text-theme-primary text-lg font-semibold"
        data-testid="section-heading"
      >
        Top Performers
      </h2>

      <div
        className="bg-surface-raised flex gap-1 rounded-lg p-1"
        role="group"
        aria-label="Sort performers by"
        data-testid="performer-sort-controls"
      >
        {SORT_OPTIONS.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => {
              onSortChange(option.key);
              announce(`Sorted by ${option.label}`);
            }}
            className={[
              `min-h-[44px] rounded-md px-3 py-2 text-sm transition-colors md:min-h-0 md:py-1 ${FOCUS_RING_CLASSES}`,
              performerSortKey === option.key
                ? 'bg-surface-raised text-text-theme-primary  shadow-sm font-medium'
                : 'text-text-theme-muted hover:text-text-theme-primary ',
            ].join(' ')}
            aria-pressed={performerSortKey === option.key}
            data-testid={`sort-button-${option.key}`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>

    {sortedPerformers.length === 0 ? (
      <p
        className="text-text-theme-muted text-sm italic"
        data-testid="performers-empty"
      >
        No performance data available yet.
      </p>
    ) : (
      <div
        className="flex gap-3 overflow-x-auto pb-2"
        data-testid="performers-list"
      >
        {sortedPerformers.map((performer) => (
          <PerformerCard
            key={performer.personId}
            performer={performer}
            activeSortKey={performerSortKey}
            onDrillDown={onDrillDown}
          />
        ))}
      </div>
    )}
  </section>
);

interface WarningsSectionProps {
  activeWarnings: IDerivedWarning[];
  onDismissWarning: (warningId: string) => void;
  onDrillDown: CampaignDrillDownHandler;
}

export const WarningsSection: React.FC<WarningsSectionProps> = ({
  activeWarnings,
  onDismissWarning,
  onDrillDown,
}) => (
  <section
    className="col-span-1 space-y-3 md:col-span-2 lg:col-span-4"
    aria-label="Campaign warnings"
    data-testid="warnings-section"
  >
    <h2
      className="text-text-theme-primary text-lg font-semibold"
      data-testid="section-heading"
    >
      Warnings
    </h2>

    <div aria-live="polite" aria-atomic="true" className="sr-only">
      {activeWarnings.length === 0
        ? 'No active warnings'
        : `${activeWarnings.length} active warning${activeWarnings.length !== 1 ? 's' : ''}`}
    </div>

    {activeWarnings.length === 0 ? (
      <p
        className="text-text-theme-muted text-sm italic"
        data-testid="warnings-empty"
      >
        No active warnings — all systems nominal.
      </p>
    ) : (
      <ul className="space-y-2" data-testid="warnings-list">
        {activeWarnings.map((warning) => (
          <WarningItem
            key={warning.id}
            warning={warning}
            onDismiss={onDismissWarning}
            onDrillDown={onDrillDown}
          />
        ))}
      </ul>
    )}
  </section>
);

interface PerformerCardProps {
  performer: IPerformerSummary;
  activeSortKey: PerformerSortKey;
  onDrillDown: CampaignDrillDownHandler;
}

const PerformerCard: React.FC<PerformerCardProps> = ({
  performer,
  activeSortKey,
  onDrillDown,
}) => (
  <div
    className={[
      'flex-shrink-0 w-40 md:w-48 p-3 md:p-4 rounded-lg',
      'bg-surface-base ',
      'border border-border-theme',
      'shadow-sm hover:shadow-md transition-shadow',
    ].join(' ')}
    data-testid="performer-card"
  >
    <p
      className="text-text-theme-primary truncate font-semibold"
      data-testid="performer-name"
      title={performer.name}
    >
      {performer.name}
    </p>
    <p
      className="text-text-theme-muted mb-2 text-xs"
      data-testid="performer-rank"
    >
      {performer.rank}
    </p>

    <dl className="space-y-1 text-sm">
      <div className="flex justify-between">
        <dt className="text-text-theme-muted">Kills</dt>
        <dd
          className={[
            'font-medium',
            activeSortKey === 'kills'
              ? 'text-accent'
              : 'text-text-theme-primary ',
          ].join(' ')}
          data-testid="performer-kills"
        >
          {performer.kills}
        </dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-text-theme-muted">XP</dt>
        <dd
          className={[
            'font-medium',
            activeSortKey === 'xp' ? 'text-accent' : 'text-text-theme-primary ',
          ].join(' ')}
          data-testid="performer-xp"
        >
          {formatCompactNumber(performer.xp)}
        </dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-text-theme-muted">Missions</dt>
        <dd
          className={[
            'font-medium',
            activeSortKey === 'missionsCompleted'
              ? 'text-accent'
              : 'text-text-theme-primary ',
          ].join(' ')}
          data-testid="performer-missions"
        >
          {performer.missionsCompleted}
        </dd>
      </div>
    </dl>

    <div className="mt-3">
      <DrillDownLink
        label="View Pilot"
        targetTab="encounter-history"
        filter={{ personId: performer.personId }}
        icon="chevron-right"
        onClick={onDrillDown}
      />
    </div>
  </div>
);

interface WarningItemProps {
  warning: IDerivedWarning;
  onDismiss: (id: string) => void;
  onDrillDown: CampaignDrillDownHandler;
}

const WarningItem: React.FC<WarningItemProps> = ({
  warning,
  onDismiss,
  onDrillDown,
}) => (
  <li
    className={[
      'flex items-start gap-3 p-3 rounded-lg border',
      SEVERITY_CLASSES[warning.severity],
    ].join(' ')}
    role="alert"
    data-testid="warning-item"
    data-severity={warning.severity}
  >
    <span
      className={[
        'inline-flex items-center justify-center',
        'text-xs font-bold uppercase px-2 py-0.5 rounded',
        SEVERITY_BADGE[warning.severity],
      ].join(' ')}
      data-testid="warning-severity-badge"
    >
      {warning.severity}
    </span>

    <span className="flex-1" data-testid="warning-message">
      {warning.message}
    </span>

    <DrillDownLink
      label="Details"
      targetTab="encounter-history"
      filter={{ warningTarget: warning.target }}
      icon="arrow-right"
      onClick={onDrillDown}
    />

    <button
      type="button"
      onClick={() => onDismiss(warning.id)}
      className={[
        `ml-2 min-h-[44px] min-w-[44px] rounded p-2 hover:bg-black/10 md:min-h-0 md:min-w-0 md:p-1 ${FOCUS_RING_CLASSES}`,
        'transition-colors text-current opacity-60 hover:opacity-100 flex items-center justify-center',
      ].join(' ')}
      aria-label={`Dismiss warning: ${warning.message}`}
      data-testid="warning-dismiss"
    >
      <AppIcon name="close" size="inline" aria-hidden="true" />
    </button>
  </li>
);
