/**
 * Damage Matrix Component
 * Displays a grid showing unit-to-unit damage totals from combat events.
 * Rows represent attackers, columns represent targets.
 *
 * @spec openspec/changes/add-quick-session-mode/proposal.md
 */

import { useMemo } from 'react';

import type { IGameEvent } from '@/types/gameplay';
import type { IQuickGameUnit } from '@/types/quickgame/QuickGameInterfaces';

import { SvgIcon } from '@/components/ui/SvgIcon';
import { projectDamageMatrix } from '@/utils/gameplay/combatStatistics';

export interface DamageMatrixProps {
  readonly events: readonly IGameEvent[];
  readonly units: readonly IQuickGameUnit[];
}

function getUnitName(
  unitId: string,
  unitMap: ReadonlyMap<string, IQuickGameUnit>,
): string {
  const unit = unitMap.get(unitId);
  return unit?.name ?? unitId;
}

function truncateName(name: string, maxLength: number = 14): string {
  if (name.length <= maxLength) return name;
  return name.slice(0, maxLength - 1) + '…';
}

export function DamageMatrix({
  events,
  units,
}: DamageMatrixProps): React.ReactElement {
  const unitMap = useMemo(() => {
    const map = new Map<string, IQuickGameUnit>();
    for (const unit of units) {
      map.set(unit.instanceId, unit);
    }
    return map;
  }, [units]);

  const { matrix, totalDealt, totalReceived } = useMemo(
    () => projectDamageMatrix(events),
    [events],
  );

  const attackerIds = useMemo(() => Array.from(matrix.keys()), [matrix]);
  const targetIds = useMemo(() => {
    const targets = new Set<string>();
    for (const targetMap of Array.from(matrix.values())) {
      for (const targetId of Array.from(targetMap.keys())) {
        targets.add(targetId);
      }
    }
    return Array.from(targets);
  }, [matrix]);

  const grandTotal = useMemo(() => {
    let total = 0;
    for (const dealt of Array.from(totalDealt.values())) {
      total += dealt;
    }
    return total;
  }, [totalDealt]);

  if (matrix.size === 0) {
    return (
      <div className="text-text-theme-muted py-8 text-center">
        <SvgIcon
          size="hero"
          className="mx-auto mb-3 h-12 w-12 opacity-50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </SvgIcon>
        <p className="text-lg font-medium">No damage dealt</p>
        <p className="text-text-theme-secondary mt-1 text-sm">
          No combat damage was recorded in this battle.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto" data-testid="damage-matrix">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border-border-theme bg-surface-base text-text-theme-secondary sticky left-0 z-10 border p-2 text-left font-semibold">
              Attacker ↓ / Target →
            </th>
            {targetIds.map((targetId) => (
              <th
                key={targetId}
                className="border-border-theme bg-surface-base text-text-theme-secondary min-w-[80px] border p-2 text-center font-semibold"
                title={getUnitName(targetId, unitMap)}
              >
                {truncateName(getUnitName(targetId, unitMap))}
              </th>
            ))}
            <th className="border-border-theme bg-surface-deep min-w-[80px] border p-2 text-center font-bold text-amber-400">
              Total Dealt
            </th>
          </tr>
        </thead>
        <tbody>
          {attackerIds.map((attackerId) => {
            const attackerTargets = matrix.get(attackerId);
            const attackerDealt = totalDealt.get(attackerId) ?? 0;

            return (
              <tr key={attackerId}>
                <th
                  className="border-border-theme bg-surface-base text-text-theme-secondary sticky left-0 z-10 border p-2 text-left font-semibold"
                  title={getUnitName(attackerId, unitMap)}
                >
                  {truncateName(getUnitName(attackerId, unitMap))}
                </th>
                {targetIds.map((targetId) => {
                  const damage = attackerTargets?.get(targetId) ?? 0;
                  const isSelfDamage = attackerId === targetId;

                  return (
                    <td
                      key={targetId}
                      className={`border-border-theme border p-2 text-center font-mono ${
                        isSelfDamage
                          ? 'bg-surface-raised text-text-theme-muted'
                          : damage > 0
                            ? 'bg-surface-base/50 text-text-theme-primary'
                            : 'bg-surface-base/30 text-text-theme-secondary'
                      }`}
                      data-testid={
                        isSelfDamage ? 'self-damage-cell' : undefined
                      }
                    >
                      {damage > 0 ? damage : '—'}
                    </td>
                  );
                })}
                <td className="border-border-theme bg-surface-deep border p-2 text-center font-mono font-bold text-amber-400">
                  {attackerDealt}
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <th className="border-border-theme bg-surface-deep sticky left-0 z-10 border p-2 text-left font-bold text-cyan-400">
              Total Received
            </th>
            {targetIds.map((targetId) => {
              const received = totalReceived.get(targetId) ?? 0;
              return (
                <td
                  key={targetId}
                  className="border-border-theme bg-surface-deep border p-2 text-center font-mono font-bold text-cyan-400"
                >
                  {received}
                </td>
              );
            })}
            <td className="border-border-theme bg-surface-deep text-text-theme-primary border p-2 text-center font-mono font-bold">
              {grandTotal}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default DamageMatrix;
