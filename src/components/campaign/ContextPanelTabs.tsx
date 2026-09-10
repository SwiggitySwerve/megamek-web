import React from 'react';

import type {
  SystemData,
  ContractData,
  MechData,
  PilotData,
} from './ContextPanel.types';

import {
  formatPopulation,
  formatCBills,
  getArmorColor,
  getArmorTextColor,
  getStatusBadgeStyle,
} from './ContextPanelHelpers';
import {
  GlobeIcon,
  DocumentIcon,
  MechIcon,
  PilotIcon,
  CrosshairIcon,
  getContractTypeIcon,
} from './ContextPanelIcons';

export function EmptyPanel(): React.ReactElement {
  return (
    <div
      className="text-text-theme-muted flex h-full items-center justify-center"
      data-testid="context-panel-empty"
    >
      <div className="flex items-center gap-3">
        <CrosshairIcon className="h-5 w-5 opacity-50" />
        <span className="text-sm">Select a system, contract, or unit</span>
      </div>
    </div>
  );
}

export function SystemDetailsPanel({
  data,
}: {
  data: SystemData;
}): React.ReactElement {
  return (
    <div
      className="flex h-full items-center gap-6 p-4"
      data-testid="context-panel-system"
    >
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-sky-700/30 bg-sky-900/30">
        <GlobeIcon className="h-6 w-6 text-sky-400" />
      </div>

      <div className="min-w-0">
        <div className="text-text-theme-secondary mb-0.5 text-xs tracking-wider uppercase">
          System
        </div>
        <div className="text-text-theme-primary truncate text-lg font-semibold">
          {data.name}
        </div>
      </div>

      <div className="bg-surface-raised h-8 w-px flex-shrink-0" />

      <div>
        <div className="text-text-theme-secondary mb-1 text-xs tracking-wider uppercase">
          Faction
        </div>
        <span className="inline-flex items-center rounded border border-sky-700/40 bg-sky-900/40 px-2.5 py-1 text-sm font-medium text-sky-400">
          {data.faction}
        </span>
      </div>

      {data.population !== undefined && (
        <>
          <div className="bg-surface-raised h-8 w-px flex-shrink-0" />
          <div>
            <div className="text-text-theme-secondary mb-0.5 text-xs tracking-wider uppercase">
              Population
            </div>
            <div className="text-text-theme-primary font-mono text-sm">
              {formatPopulation(data.population)}
            </div>
          </div>
        </>
      )}

      {data.industrialRating && (
        <>
          <div className="bg-surface-raised h-8 w-px flex-shrink-0" />
          <div>
            <div className="text-text-theme-secondary mb-0.5 text-xs tracking-wider uppercase">
              Industry
            </div>
            <div className="text-sm font-medium text-amber-400">
              {data.industrialRating}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function ContractDetailsPanel({
  data,
}: {
  data: ContractData;
}): React.ReactElement {
  return (
    <div
      className="flex h-full items-center gap-6 p-4"
      data-testid="context-panel-contract"
    >
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-amber-700/30 bg-amber-900/30">
        <DocumentIcon className="h-6 w-6 text-amber-400" />
      </div>

      <div className="min-w-0">
        <div className="mb-0.5 flex items-center gap-2">
          <span className="text-text-theme-secondary text-xs tracking-wider uppercase">
            Contract
          </span>
          <span className="border-border-theme/50 bg-surface-raised/50 text-text-theme-secondary inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-xs">
            {getContractTypeIcon(data.type)}
            {data.type}
          </span>
        </div>
        <div className="text-text-theme-primary truncate text-lg font-semibold">
          {data.name}
        </div>
      </div>

      <div className="bg-surface-raised h-8 w-px flex-shrink-0" />

      <div>
        <div className="text-text-theme-secondary mb-0.5 text-xs tracking-wider uppercase">
          Employer
        </div>
        <div className="text-text-theme-primary text-sm">{data.employer}</div>
      </div>

      <div className="bg-surface-raised h-8 w-px flex-shrink-0" />

      <div>
        <div className="text-text-theme-secondary mb-0.5 text-xs tracking-wider uppercase">
          Payment
        </div>
        <div className="font-mono text-sm font-semibold text-amber-400">
          {formatCBills(data.payment)} C-Bills
        </div>
      </div>

      <div className="bg-surface-raised h-8 w-px flex-shrink-0" />

      <div>
        <div className="text-text-theme-secondary mb-0.5 text-xs tracking-wider uppercase">
          Deadline
        </div>
        <div className="text-text-theme-primary font-mono text-sm">
          {data.deadline}
        </div>
      </div>
    </div>
  );
}

export function MechStatusPanel({
  data,
}: {
  data: MechData;
}): React.ReactElement {
  return (
    <div
      className="flex h-full items-center gap-6 p-4"
      data-testid="context-panel-mech"
    >
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-violet-700/30 bg-violet-900/30">
        <MechIcon className="h-6 w-6 text-violet-400" />
      </div>

      <div className="min-w-0">
        <div className="text-text-theme-secondary mb-0.5 text-xs tracking-wider uppercase">
          Mech
        </div>
        <div className="text-text-theme-primary text-lg font-semibold">
          {data.name}{' '}
          <span className="text-text-theme-secondary font-mono text-sm">
            {data.variant}
          </span>
        </div>
      </div>

      <div className="bg-surface-raised h-8 w-px flex-shrink-0" />

      <div>
        <div className="text-text-theme-secondary mb-0.5 text-xs tracking-wider uppercase">
          Tonnage
        </div>
        <div className="text-text-theme-primary font-mono text-sm">
          {data.tonnage}t
        </div>
      </div>

      <div className="bg-surface-raised h-8 w-px flex-shrink-0" />

      <div className="w-40">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-text-theme-secondary text-xs tracking-wider uppercase">
            Armor
          </span>
          <span
            className={`font-mono text-xs ${getArmorTextColor(data.armorPercent)}`}
          >
            {data.armorPercent}%
          </span>
        </div>
        <div className="bg-surface-raised h-2 overflow-hidden rounded-full">
          <div
            className={`h-full ${getArmorColor(data.armorPercent)} transition-all duration-300`}
            style={{ width: `${data.armorPercent}%` }}
          />
        </div>
      </div>

      <div className="bg-surface-raised h-8 w-px flex-shrink-0" />

      <div>
        <div className="text-text-theme-secondary mb-1 text-xs tracking-wider uppercase">
          Status
        </div>
        <span
          className={`inline-flex items-center rounded border px-2.5 py-1 text-sm font-medium ${getStatusBadgeStyle(data.status)}`}
        >
          {data.status}
        </span>
      </div>
    </div>
  );
}

export function PilotStatusPanel({
  data,
}: {
  data: PilotData;
}): React.ReactElement {
  const maxWounds = 5;

  return (
    <div
      className="flex h-full items-center gap-6 p-4"
      data-testid="context-panel-pilot"
    >
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-emerald-700/30 bg-emerald-900/30">
        <PilotIcon className="h-6 w-6 text-emerald-400" />
      </div>

      <div className="min-w-0">
        <div className="text-text-theme-secondary mb-0.5 text-xs tracking-wider uppercase">
          Pilot
        </div>
        <div className="text-text-theme-primary truncate text-lg font-semibold">
          {data.name}
          <span className="ml-2 text-sm font-normal text-emerald-400">
            &ldquo;{data.callsign}&rdquo;
          </span>
        </div>
      </div>

      <div className="bg-surface-raised h-8 w-px flex-shrink-0" />

      <div>
        <div className="text-text-theme-secondary mb-0.5 text-xs tracking-wider uppercase">
          Gunnery
        </div>
        <div className="font-mono text-xl font-bold text-cyan-400">
          {data.gunnery}
        </div>
      </div>

      <div className="bg-surface-raised h-8 w-px flex-shrink-0" />

      <div>
        <div className="text-text-theme-secondary mb-0.5 text-xs tracking-wider uppercase">
          Piloting
        </div>
        <div className="font-mono text-xl font-bold text-amber-400">
          {data.piloting}
        </div>
      </div>

      <div className="bg-surface-raised h-8 w-px flex-shrink-0" />

      <div>
        <div className="text-text-theme-secondary mb-1 text-xs tracking-wider uppercase">
          Wounds
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: maxWounds }).map((_, i) => (
            <div
              key={i}
              className={`h-3 w-3 rounded-full border ${
                i < data.wounds
                  ? 'border-red-400 bg-red-500'
                  : 'border-border-theme bg-surface-raised'
              }`}
            />
          ))}
          {data.wounds > 0 && (
            <span className="ml-1 text-xs text-red-400">
              ({data.wounds}/{maxWounds})
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
