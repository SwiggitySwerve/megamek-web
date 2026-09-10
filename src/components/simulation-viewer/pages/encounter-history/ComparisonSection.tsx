import React, { useMemo, useState, useCallback } from 'react';

import { DrillDownLink } from '@/components/simulation-viewer/DrillDownLink';
import { FOCUS_RING_CLASSES } from '@/utils/accessibility';

import type { IBattle, ComparisonMode } from './types';

import { ViewerSection } from '../SectionFrame';
import { BAR_SEGMENTS, computeCampaignAverage, formatDuration } from './types';

export interface IComparisonSectionProps {
  readonly battle: IBattle;
  readonly battles: IBattle[];
  readonly onDrillDown: (
    targetTab: string,
    filter?: Record<string, unknown>,
  ) => void;
}

export const ComparisonSection: React.FC<IComparisonSectionProps> = ({
  battle,
  battles,
  onDrillDown,
}) => {
  const [comparisonMode, setComparisonMode] =
    useState<ComparisonMode>('campaign-average');
  const [comparisonBattleId, setComparisonBattleId] = useState<string | null>(
    null,
  );

  const campaignAverage = useMemo(
    () => computeCampaignAverage(battles),
    [battles],
  );

  const comparisonTarget = useMemo(() => {
    if (comparisonMode === 'campaign-average') return campaignAverage;
    const target = battles.find((b) => b.id === comparisonBattleId);
    if (!target) return null;
    return {
      duration: target.duration,
      kills: target.stats.totalKills,
      damage: target.stats.totalDamage,
      unitsLost: target.stats.unitsLost,
    };
  }, [comparisonMode, campaignAverage, battles, comparisonBattleId]);

  const handleComparisonModeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setComparisonMode(e.target.value as ComparisonMode);
    },
    [],
  );

  const handleComparisonBattleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setComparisonBattleId(e.target.value || null);
    },
    [],
  );

  const handleDrillDown = useCallback(
    (targetTab: string, filter?: Record<string, unknown>) => {
      onDrillDown(targetTab, filter);
    },
    [onDrillDown],
  );

  return (
    <ViewerSection
      ariaLabel="Comparison view"
      testId="comparison-section"
      title="Comparison"
    >
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <select
          value={comparisonMode}
          onChange={handleComparisonModeChange}
          className={`border-border-theme-subtle bg-surface-base text-text-theme-secondary min-h-[44px] rounded-md border px-3 py-2 text-sm md:min-h-0 md:py-1.5 ${FOCUS_RING_CLASSES}`}
          aria-label="Comparison mode"
          data-testid="comparison-mode-toggle"
        >
          <option value="campaign-average">vs Campaign Average</option>
          <option value="specific-battle">vs Specific Battle</option>
        </select>
        {comparisonMode === 'specific-battle' && (
          <select
            value={comparisonBattleId ?? ''}
            onChange={handleComparisonBattleChange}
            className={`border-border-theme-subtle bg-surface-base text-text-theme-secondary min-h-[44px] rounded-md border px-3 py-2 text-sm md:min-h-0 md:py-1.5 ${FOCUS_RING_CLASSES}`}
            aria-label="Select battle for comparison"
            data-testid="comparison-battle-select"
          >
            <option value="">Select a battle</option>
            {battles
              .filter((b) => b.id !== battle.id)
              .map((b) => (
                <option key={b.id} value={b.id}>
                  {b.missionName} — {new Date(b.timestamp).toLocaleDateString()}
                </option>
              ))}
          </select>
        )}
      </div>

      {comparisonTarget ? (
        <div
          className="border-border-theme-subtle bg-surface-base space-y-4 rounded-lg border p-4"
          data-testid="comparison-metrics"
        >
          {(
            [
              {
                key: 'duration',
                label: 'Duration',
                current: battle.duration,
                baseline: comparisonTarget.duration,
                fmt: (v: number) => formatDuration(Math.round(v)),
              },
              {
                key: 'kills',
                label: 'Kills',
                current: battle.stats.totalKills,
                baseline: comparisonTarget.kills,
                fmt: (v: number) => String(v),
              },
              {
                key: 'damage',
                label: 'Damage',
                current: battle.stats.totalDamage,
                baseline: comparisonTarget.damage,
                fmt: (v: number) => String(v),
              },
              {
                key: 'unitsLost',
                label: 'Units Lost',
                current: battle.stats.unitsLost,
                baseline: comparisonTarget.unitsLost,
                fmt: (v: number) => String(v),
              },
            ] as const
          ).map((metric) => {
            const maxVal = Math.max(metric.current, metric.baseline, 1);
            const currentFilled = Math.round(
              (metric.current / maxVal) * BAR_SEGMENTS,
            );
            const baselineFilled = Math.round(
              (metric.baseline / maxVal) * BAR_SEGMENTS,
            );
            return (
              <div
                key={metric.key}
                data-testid={`comparison-metric-${metric.key}`}
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-text-theme-secondary text-sm font-medium">
                    {metric.label}
                  </span>
                  <span className="text-text-theme-muted text-sm">
                    {metric.fmt(metric.current)} vs{' '}
                    {metric.fmt(metric.baseline)}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-16 text-xs text-blue-600 dark:text-blue-400">
                      Current
                    </span>
                    <div
                      className="flex gap-0.5"
                      data-testid={`comparison-bar-current-${metric.key}`}
                    >
                      {Array.from({ length: BAR_SEGMENTS }, (_, i) => (
                        <div
                          key={i}
                          className={`h-3 w-1.5 rounded-sm ${
                            i < currentFilled
                              ? 'bg-blue-500 dark:bg-blue-400'
                              : 'bg-surface-raised '
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-16 text-xs text-emerald-600 dark:text-emerald-400">
                      Baseline
                    </span>
                    <div
                      className="flex gap-0.5"
                      data-testid={`comparison-bar-baseline-${metric.key}`}
                    >
                      {Array.from({ length: BAR_SEGMENTS }, (_, i) => (
                        <div
                          key={i}
                          className={`h-3 w-1.5 rounded-sm ${
                            i < baselineFilled
                              ? 'bg-emerald-500 dark:bg-emerald-400'
                              : 'bg-surface-raised '
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="border-border-theme-subtle border-t pt-2">
            <DrillDownLink
              label="View Detailed Comparison"
              targetTab="analysis-bugs"
              filter={{
                battleId: battle.id,
                comparisonMode,
                comparisonBattleId,
              }}
              icon="arrow-right"
              onClick={handleDrillDown}
            />
          </div>
        </div>
      ) : (
        <p
          className="text-text-theme-muted text-sm italic"
          data-testid="no-comparison-target"
        >
          Select a battle to compare against.
        </p>
      )}
    </ViewerSection>
  );
};
