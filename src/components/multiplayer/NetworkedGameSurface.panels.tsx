/**
 * Presentational panels split from `NetworkedGameSurface`: the command
 * result feed and the selection summary render read-only session facts
 * and change for display reasons, not for the surface's wiring reasons
 * (the split also keeps the surface inside the modularity budget).
 */

import React from 'react';

import type { IPlayerCommandResult } from '@/types/command-screen/CommandScreenTypes';

import { GamePhase } from '@/types/gameplay/GameSessionInterfaces';

export function NetworkedCommandResultFeed({
  results,
}: {
  readonly results: readonly {
    readonly publicSummary: string;
    readonly result: IPlayerCommandResult;
  }[];
}): React.ReactElement | null {
  if (results.length === 0) return null;
  return (
    <ul
      data-testid="network-command-result-feed"
      className="border-border-theme bg-surface-deep/50 text-text-theme-primary space-y-2 rounded-lg border p-3 text-xs"
    >
      {results.map((entry, index) => (
        <li
          key={`${entry.result.commandId}-${entry.result.previewId ?? index}`}
          data-testid="network-command-result-entry"
          className="border-border-theme bg-surface-deep/40 rounded border px-3 py-2"
        >
          <span className="font-medium">{entry.publicSummary}</span>
          <span className="text-text-theme-secondary ml-2">
            {entry.result.status}
          </span>
        </li>
      ))}
    </ul>
  );
}

// =============================================================================
// Selection summary
// =============================================================================

interface ISelectionSummaryProps {
  readonly selectedUnitId: string | null;
  readonly targetUnitId: string | null;
  readonly phase: GamePhase;
}

/**
 * Small read-out of the current map selection so the player can see
 * what their next intent will act on. Purely informational.
 */
export function SelectionSummary({
  selectedUnitId,
  targetUnitId,
  phase,
}: ISelectionSummaryProps): React.ReactElement {
  const isAttackPhase =
    phase === GamePhase.WeaponAttack || phase === GamePhase.PhysicalAttack;
  return (
    <div
      data-testid="selection-summary"
      className="text-text-theme-secondary shrink-0 text-right text-xs"
    >
      <p>
        Unit:{' '}
        <span className="text-text-theme-primary font-mono">
          {selectedUnitId ?? '—'}
        </span>
      </p>
      {isAttackPhase && (
        <p>
          Target:{' '}
          <span className="text-text-theme-primary font-mono">
            {targetUnitId ?? '—'}
          </span>
        </p>
      )}
    </div>
  );
}
