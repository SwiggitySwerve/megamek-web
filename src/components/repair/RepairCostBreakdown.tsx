/**
 * Repair Cost Breakdown Component
 * Itemized cost display with resource comparison.
 *
 * @spec openspec/changes/add-repair-system/specs/repair/spec.md
 */
import React, { useMemo } from 'react';

import { Card, Badge } from '@/components/ui';
import { AppIcon } from '@/components/ui/AppIcon';
import { IRepairJob, IRepairItem, RepairType } from '@/types/repair';

// =============================================================================
// Cost Row Component
// =============================================================================

interface CostRowProps {
  label: string;
  count: number;
  cost: number;
  time: number;
  variant?: 'cyan' | 'amber' | 'orange' | 'red';
}

function CostRow({
  label,
  count,
  cost,
  time,
  variant = 'cyan',
}: CostRowProps): React.ReactElement {
  if (count === 0) return <></>;

  const badgeVariants = {
    cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <div className="border-border-theme-subtle/50 flex items-center gap-3 border-b py-2.5 last:border-b-0">
      <div
        className={`h-2 w-2 rounded-full ${badgeVariants[variant].split(' ')[0]}`}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-text-theme-primary text-sm font-medium">
            {label}
          </span>
          <span className="text-text-theme-muted text-xs">x{count}</span>
        </div>
      </div>
      <div className="text-right">
        <div className="text-text-theme-primary text-sm font-semibold tabular-nums">
          {cost.toLocaleString()}
        </div>
        <div className="text-text-theme-muted text-xs tabular-nums">
          {time}h
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Resource Meter Component
// =============================================================================

interface ResourceMeterProps {
  label: string;
  current: number;
  needed: number;
  unit?: string;
}

function ResourceMeter({
  label,
  current,
  needed,
  unit = '',
}: ResourceMeterProps): React.ReactElement {
  const percent = Math.min((current / needed) * 100, 100);
  const isInsufficient = current < needed;

  const barColor = isInsufficient
    ? 'bg-gradient-to-r from-red-600 to-red-500'
    : 'bg-gradient-to-r from-emerald-600 to-emerald-400';

  const textColor = isInsufficient ? 'text-red-400' : 'text-emerald-400';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-text-theme-secondary">{label}</span>
        <span className={`font-medium tabular-nums ${textColor}`}>
          {current.toLocaleString()} / {needed.toLocaleString()} {unit}
        </span>
      </div>
      <div className="bg-surface-deep relative h-3 overflow-hidden rounded-full">
        {/* Track marks */}
        <div className="absolute inset-0 flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="border-surface-base/20 flex-1 border-r last:border-r-0"
            />
          ))}
        </div>
        {/* Fill */}
        <div
          className={`h-full transition-all duration-500 ease-out ${barColor}`}
          style={{ width: `${percent}%` }}
        />
        {/* Threshold marker at 100% */}
        {isInsufficient && (
          <div
            className="bg-text-theme-muted absolute top-0 bottom-0 w-0.5"
            style={{ left: `${percent}%` }}
          />
        )}
      </div>
      {isInsufficient && (
        <div className="flex items-center gap-1.5 text-xs text-red-400">
          <AppIcon name="warning" size="inline" />
          Short by {(needed - current).toLocaleString()} {unit}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

interface RepairCostBreakdownProps {
  job: IRepairJob;
  availableCBills?: number;
  className?: string;
}

export function RepairCostBreakdown({
  job,
  availableCBills = 0,
  className = '',
}: RepairCostBreakdownProps): React.ReactElement {
  // Calculate breakdown by type
  const breakdown = useMemo(() => {
    const selected = job.items.filter((i) => i.selected);

    const armor = selected.filter((i) => i.type === RepairType.Armor);
    const structure = selected.filter((i) => i.type === RepairType.Structure);
    const componentRepair = selected.filter(
      (i) => i.type === RepairType.ComponentRepair,
    );
    const componentReplace = selected.filter(
      (i) => i.type === RepairType.ComponentReplace,
    );

    const sumCost = (items: IRepairItem[]) =>
      items.reduce((sum, i) => sum + i.cost, 0);
    const sumTime = (items: IRepairItem[]) =>
      items.reduce((sum, i) => sum + i.timeHours, 0);

    return {
      armor: {
        count: armor.length,
        cost: sumCost(armor),
        time: sumTime(armor),
      },
      structure: {
        count: structure.length,
        cost: sumCost(structure),
        time: sumTime(structure),
      },
      componentRepair: {
        count: componentRepair.length,
        cost: sumCost(componentRepair),
        time: sumTime(componentRepair),
      },
      componentReplace: {
        count: componentReplace.length,
        cost: sumCost(componentReplace),
        time: sumTime(componentReplace),
      },
      total: {
        cost: job.totalCost,
        time: job.totalTimeHours,
        items: selected.length,
      },
    };
  }, [job]);

  const canAfford = availableCBills >= breakdown.total.cost;
  const hasTimeWarning = breakdown.total.time > 48;

  return (
    <Card data-testid="repair-cost-breakdown" className={className}>
      {/* Header */}
      <div className="border-border-theme-subtle mb-4 flex items-center justify-between border-b pb-4">
        <div>
          <h3 className="text-text-theme-primary text-lg font-bold">
            Cost Breakdown
          </h3>
          <p className="text-text-theme-secondary text-sm">{job.unitName}</p>
        </div>
        {!canAfford && (
          <Badge variant="red" size="sm">
            INSUFFICIENT FUNDS
          </Badge>
        )}
      </div>

      {/* Itemized Costs */}
      <div className="mb-6" data-testid="repair-cost-items">
        <CostRow
          label="Armor Repairs"
          count={breakdown.armor.count}
          cost={breakdown.armor.cost}
          time={breakdown.armor.time}
          variant="cyan"
        />
        <CostRow
          label="Structure Repairs"
          count={breakdown.structure.count}
          cost={breakdown.structure.cost}
          time={breakdown.structure.time}
          variant="amber"
        />
        <CostRow
          label="Component Repairs"
          count={breakdown.componentRepair.count}
          cost={breakdown.componentRepair.cost}
          time={breakdown.componentRepair.time}
          variant="orange"
        />
        <CostRow
          label="Component Replacements"
          count={breakdown.componentReplace.count}
          cost={breakdown.componentReplace.cost}
          time={breakdown.componentReplace.time}
          variant="red"
        />
      </div>

      {/* Total Summary */}
      <div className="bg-surface-deep border-border-theme-subtle mb-6 rounded-xl border p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-text-theme-muted mb-1 block text-xs tracking-wider uppercase">
              Total Cost
            </span>
            <span
              className={`text-2xl font-bold tabular-nums ${canAfford ? 'text-accent' : 'text-red-400'}`}
            >
              {breakdown.total.cost.toLocaleString()}
            </span>
            <span className="text-text-theme-secondary ml-1 text-sm">
              C-Bills
            </span>
          </div>
          <div>
            <span className="text-text-theme-muted mb-1 block text-xs tracking-wider uppercase">
              Est. Time
            </span>
            <span
              className={`text-2xl font-bold tabular-nums ${hasTimeWarning ? 'text-amber-400' : 'text-text-theme-primary'}`}
            >
              {breakdown.total.time}
            </span>
            <span className="text-text-theme-secondary ml-1 text-sm">
              hours
            </span>
          </div>
        </div>
        {hasTimeWarning && (
          <div className="border-border-theme-subtle mt-3 flex items-center gap-2 border-t pt-3 text-xs text-amber-400">
            <AppIcon name="warning" size="inline" />
            Unit will be unavailable for 2+ days
          </div>
        )}
      </div>

      {/* Resource Comparison */}
      <div className="space-y-4">
        <h4 className="text-text-theme-primary text-sm font-semibold">
          Resource Check
        </h4>
        <ResourceMeter
          label="C-Bills"
          current={availableCBills}
          needed={breakdown.total.cost}
          unit=""
        />
      </div>

      {/* Cost Efficiency Tips */}
      {breakdown.componentReplace.count > 0 && (
        <div className="mt-6 rounded-lg border border-blue-600/30 bg-blue-900/20 p-3">
          <div className="flex items-start gap-2">
            <AppIcon
              name="info"
              size="inline"
              className="mt-0.5 flex-shrink-0 text-blue-400"
            />
            <div>
              <p className="text-xs font-medium text-blue-400">
                Salvage Available
              </p>
              <p className="text-text-theme-secondary mt-0.5 text-xs">
                Check salvage inventory for matching components to reduce
                replacement costs.
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

export default RepairCostBreakdown;
