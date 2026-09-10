/**
 * Unit Info Banner Component
 *
 * Unit identity and grouped movement, capacity, and combat readouts.
 * Detailed mobile readouts can be expanded without displacing the editor.
 *
 * @spec openspec/specs/unit-info-banner/spec.md
 */

import React, { useId, useState } from 'react';

import { AppIcon } from '@/components/ui/AppIcon';
import { CustomizerTabId } from '@/hooks/useCustomizerRouter';
import { UnitValidationState } from '@/hooks/useUnitValidation';
import { TechBaseMode } from '@/types/construction/TechBaseConfiguration';
import { ValidationStatus } from '@/utils/colors/statusColors';

import workbenchStyles from '../CustomizerWorkbench.module.css';
import { TechBaseBadge } from './TechBaseBadge';
import { ValidationSummary } from './ValidationSummary';

// =============================================================================
// Types
// =============================================================================

export interface UnitStats {
  name: string;
  tonnage: number;
  techBaseMode: TechBaseMode;
  engineRating: number;
  walkMP: number;
  runMP: number;
  jumpMP: number;
  maxRunMP?: number;
  weightUsed: number;
  weightRemaining: number;
  armorPoints: number;
  maxArmorPoints: number;
  criticalSlotsUsed: number;
  criticalSlotsTotal: number;
  heatGenerated: number;
  heatDissipation: number;
  battleValue?: number;
  validationStatus: ValidationStatus;
  errorCount: number;
  warningCount: number;
}

interface UnitInfoBannerProps {
  stats: UnitStats;
  validation?: UnitValidationState;
  onValidationNavigate?: (tabId: CustomizerTabId) => void;
  className?: string;
  actions?: React.ReactNode;
  compact?: boolean;
}

// =============================================================================
// Styles
// =============================================================================

const styles = {
  label:
    'text-[10px] font-medium text-text-theme-secondary uppercase tracking-wider',
  value: {
    normal: 'text-text-theme-primary',
    warning: 'text-amber-400',
    error: 'text-red-400',
    success: 'text-text-theme-primary',
    engine: 'text-text-theme-primary',
    bv: 'text-text-theme-primary',
  },
  muted: 'text-text-theme-secondary',
  box: 'flex min-w-0 flex-col gap-0.5 tabular-nums',
} as const;

function statTestId(label: string): string {
  const normalized = label
    .toLowerCase()
    .replace(/\+/g, 'plus')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `unit-info-stat-${normalized}`;
}

// =============================================================================
// Stat Box Components
// =============================================================================

interface SimpleStatProps {
  label: string;
  value: number | string;
  status?: keyof typeof styles.value;
}

function SimpleStat({ label, value, status = 'normal' }: SimpleStatProps) {
  return (
    <div className={styles.box} data-testid={statTestId(label)}>
      <span className={styles.label}>{label}</span>
      <span
        className={`text-sm font-bold sm:text-base ${styles.value[status]}`}
      >
        {value}
      </span>
    </div>
  );
}

interface CapacityStatProps {
  label: string;
  current: number | string;
  max: number | string;
  unit?: string;
  status?: 'normal' | 'warning' | 'error' | 'success';
}

function CapacityStat({
  label,
  current,
  max,
  unit = '',
  status = 'normal',
}: CapacityStatProps) {
  return (
    <div className={styles.box} data-testid={statTestId(label)}>
      <span className={styles.label}>{label}</span>
      <div className="flex items-baseline gap-0.5">
        <span
          className={`text-sm font-bold sm:text-base ${styles.value[status]}`}
        >
          {current}
          {unit}
        </span>
        <span className={`text-[10px] ${styles.muted}`}>/</span>
        <span className={`text-[10px] ${styles.muted}`}>
          {max}
          {unit}
        </span>
      </div>
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function UnitInfoBanner({
  stats,
  validation,
  onValidationNavigate,
  className = '',
  actions,
  compact = false,
}: UnitInfoBannerProps): React.ReactElement {
  const [showReadouts, setShowReadouts] = useState(false);
  const readoutsId = useId();
  const weightStatus: 'normal' | 'warning' | 'error' =
    stats.weightUsed > stats.tonnage
      ? 'error'
      : stats.weightRemaining < 0.5
        ? 'warning'
        : 'normal';

  const slotsStatus: 'normal' | 'warning' | 'error' =
    stats.criticalSlotsUsed > stats.criticalSlotsTotal ? 'error' : 'normal';

  const heatStatus: 'normal' | 'warning' | 'error' | 'success' =
    stats.heatGenerated > stats.heatDissipation
      ? 'error'
      : stats.heatGenerated === stats.heatDissipation
        ? 'warning'
        : 'success';

  const hasRunPlus = stats.maxRunMP && stats.maxRunMP > stats.runMP;

  return (
    <section
      aria-label="Unit status"
      className={`${workbenchStyles.identityBanner} ${compact ? workbenchStyles.compactMetrics : ''} ${className}`}
    >
      {!compact && (
        <div className="flex min-w-0 items-center justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
            <h2
              title={stats.name}
              className="text-text-theme-primary min-w-0 truncate text-lg font-semibold tracking-tight"
            >
              {stats.name}
            </h2>
            <TechBaseBadge techBaseMode={stats.techBaseMode} />
            {validation && (
              <ValidationSummary
                validation={validation}
                onNavigate={onValidationNavigate}
              />
            )}
          </div>
          {actions}
        </div>
      )}
      {!compact && (
        <button
          type="button"
          className="text-text-theme-secondary flex min-h-11 w-full items-center justify-between gap-2 text-xs sm:hidden"
          aria-expanded={showReadouts}
          aria-controls={readoutsId}
          onClick={() => setShowReadouts((value) => !value)}
        >
          <span className="tabular-nums">
            {stats.tonnage}t · {stats.walkMP} / {stats.runMP} / {stats.jumpMP}{' '}
            MP
          </span>
          <span>
            {showReadouts ? 'Hide readouts' : 'Show readouts'}{' '}
            <AppIcon
              name="chevron-down"
              size="inline"
              aria-hidden="true"
              className={showReadouts ? 'rotate-180' : ' '}
            />
          </span>
        </button>
      )}
      <div
        id={readoutsId}
        className={`${workbenchStyles.readouts} ${showReadouts || compact ? workbenchStyles.readoutsExpanded : ''}`}
      >
        <div
          role="group"
          aria-label="Movement"
          className={workbenchStyles.readoutGroup}
        >
          <span className={workbenchStyles.readoutHeading}>Movement</span>
          <div className="grid auto-cols-fr grid-flow-col gap-4">
            <SimpleStat label="Walk" value={stats.walkMP} />
            <SimpleStat label="Run" value={stats.runMP} />
            {hasRunPlus && <SimpleStat label="Run+" value={stats.maxRunMP!} />}
            <SimpleStat label="Jump" value={stats.jumpMP} />
            <SimpleStat
              label="Engine"
              value={stats.engineRating}
              status="engine"
            />
          </div>
        </div>
        <div
          role="group"
          aria-label="Capacity"
          className={workbenchStyles.readoutGroup}
        >
          <span className={workbenchStyles.readoutHeading}>Capacity</span>
          <div className="grid auto-cols-fr grid-flow-col gap-4">
            <SimpleStat label="Tonnage" value={stats.tonnage} />
            <CapacityStat
              label="Weight"
              current={stats.weightUsed.toFixed(1)}
              max={stats.tonnage.toFixed(0)}
              unit="t"
              status={weightStatus}
            />
            <CapacityStat
              label="Slots"
              current={stats.criticalSlotsUsed}
              max={stats.criticalSlotsTotal}
              status={slotsStatus}
            />
          </div>
        </div>
        <div
          role="group"
          aria-label="Combat"
          className={workbenchStyles.readoutGroup}
        >
          <span className={workbenchStyles.readoutHeading}>Combat</span>
          <div className="grid auto-cols-fr grid-flow-col gap-4">
            <CapacityStat
              label="Armor"
              current={stats.armorPoints}
              max={stats.maxArmorPoints}
            />
            <CapacityStat
              label="Heat"
              current={stats.heatGenerated}
              max={stats.heatDissipation}
              status={heatStatus}
            />
            <SimpleStat
              label="BV"
              value={stats.battleValue?.toLocaleString() ?? '-'}
              status="bv"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
