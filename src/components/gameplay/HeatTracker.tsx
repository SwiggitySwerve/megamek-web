import React from 'react';

import { AppIcon } from '@/components/ui/AppIcon';
import { SvgIcon } from '@/components/ui/SvgIcon';

export type HeatScale = 'Single' | 'Double' | 'Triple';

const HEAT_SCALE_MAX: Record<HeatScale, number> = {
  Single: 30,
  Double: 50,
  Triple: 70,
};

export interface HeatTrackerProps {
  currentHeat: number;
  heatScale: HeatScale;
  onScaleChange: (scale: HeatScale) => void;
  className?: string;
  isCooling?: boolean;
  coolingTurns?: number;
}

export function HeatTracker({
  currentHeat,
  heatScale,
  onScaleChange,
  className = '',
  isCooling = false,
  coolingTurns = 0,
}: HeatTrackerProps): React.ReactElement {
  const maxHeat = HEAT_SCALE_MAX[heatScale];
  const heatPercentage = (currentHeat / maxHeat) * 100;

  const getWarningState = () => {
    if (currentHeat >= maxHeat) {
      return {
        level: 'max' as const,
        color: 'bg-red-600',
        textColor: 'text-red-600',
        message: 'MAX HEAT - SHUTDOWN',
        showAmmoRisk: true,
      };
    } else if (heatPercentage >= 75) {
      return {
        level: 'critical' as const,
        color: 'bg-red-500',
        textColor: 'text-red-500',
        message: 'WARNING: NEAR MAX HEAT',
        showAmmoRisk: false,
      };
    } else if (heatPercentage >= 50) {
      return {
        level: 'warning' as const,
        color: 'bg-amber-500',
        textColor: 'text-amber-500',
        message: 'CAUTION: HEAT BUILDUP',
        showAmmoRisk: false,
      };
    }
    return {
      level: 'normal' as const,
      color: 'bg-green-500',
      textColor: 'text-green-500',
      message: '',
      showAmmoRisk: false,
    };
  };

  const warning = getWarningState();

  return (
    <div
      className={`heat-tracker bg-surface-base dark:bg-surface-base rounded-lg p-4 ${className}`.trim()}
      data-testid="heat-tracker"
    >
      {/* Header with scale selector */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-text-theme-primary text-sm font-semibold dark:text-white">
          Heat
        </h3>
        <select
          value={heatScale}
          onChange={(e) => onScaleChange(e.target.value as HeatScale)}
          className="border-border-theme-subtle bg-surface-base dark:border-border-theme dark:bg-surface-raised min-h-[44px] rounded-md border px-3 py-2 text-sm"
          aria-label="Heat scale"
          data-testid="heat-scale-select"
        >
          <option value="Single">Single Heat</option>
          <option value="Double">Double Heat</option>
          <option value="Triple">Triple Heat</option>
        </select>
      </div>

      {/* Current heat display */}
      <div className="mb-3">
        <div className="mb-2 flex items-baseline justify-center">
          <span
            className={`text-4xl font-bold ${warning.textColor} tabular-nums`}
            data-testid="heat-tracker-current"
          >
            {currentHeat}
          </span>
          <span className="text-text-theme-muted dark:text-text-theme-secondary mx-1 text-xl">
            /
          </span>
          <span
            className="text-text-theme-muted dark:text-text-theme-secondary text-xl tabular-nums"
            data-testid="heat-tracker-max"
          >
            {maxHeat}
          </span>
        </div>

        {/* Progress bar */}
        <div className="bg-surface-raised dark:bg-surface-raised h-4 w-full overflow-hidden rounded-full">
          <div
            className={`h-full ${warning.color} transition-all duration-300`}
            style={{ width: `${Math.min(heatPercentage, 100)}%` }}
            role="progressbar"
            aria-valuenow={currentHeat}
            aria-valuemin={0}
            aria-valuemax={maxHeat}
            aria-label={`Current heat: ${currentHeat} of ${maxHeat}`}
            data-testid="heat-tracker-bar"
          />
        </div>
      </div>

      {/* Warning message */}
      {warning.message && (
        <div
          className={`mb-3 rounded-md p-3 ${warning.color} bg-opacity-10 border-opacity-30 border-2 ${warning.textColor} border-${warning.color.replace('bg-', '')}`}
          data-testid="heat-tracker-warning"
          data-warning-level={warning.level}
        >
          <p className="text-center text-sm font-semibold">{warning.message}</p>
          {warning.showAmmoRisk && (
            <p
              className="mt-1 text-center text-xs"
              data-testid="heat-tracker-ammo-risk"
            >
              <AppIcon name="warning" size="inline" aria-hidden="true" /> Ammo
              explosion risk
            </p>
          )}
        </div>
      )}

      {/* Cooling indicator */}
      {isCooling && (
        <div
          className="flex items-center justify-center gap-2 rounded-md bg-blue-100 p-2 dark:bg-blue-900/30"
          data-testid="heat-tracker-cooling"
        >
          <SvgIcon
            size="control"
            className="h-5 w-5 animate-pulse text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </SvgIcon>
          <span className="text-sm text-blue-700 dark:text-blue-300">
            Cooling: {coolingTurns} turn{coolingTurns !== 1 ? 's' : ''}{' '}
            remaining
          </span>
        </div>
      )}

      {/* Overflow indicator */}
      {currentHeat > maxHeat && (
        <div
          className="mt-3 rounded-md border-2 border-red-500 bg-red-100 p-3 dark:bg-red-900/30"
          data-testid="heat-tracker-overflow"
        >
          <p className="text-center text-sm font-semibold text-red-700 dark:text-red-300">
            <AppIcon name="warning" size="inline" aria-hidden="true" /> HEAT
            OVERFLOW: {currentHeat - maxHeat} over limit
          </p>
        </div>
      )}
    </div>
  );
}
