import Link from 'next/link';
import React from 'react';

import type { InteractiveSession } from '@/engine/GameEngine';

import { Button } from '@/components/ui';
import { AppIcon } from '@/components/ui/AppIcon';
import { GamePhase, GameSide, IGameSession } from '@/types/gameplay';

// =============================================================================
// Helpers
// =============================================================================

/**
 * Re-export of the unified `unitStateToToken` adapter (lives in
 * `src/lib/gameplay/unitStateToToken.ts`). Kept as a re-export so existing
 * callers (`SpectatorView`) keep their `import { unitStateToToken } from
 * './SpectatorViewPanels'` line working without churn.
 *
 * Per `wire-combat-behavior-dispatch` (Council #1 PR7), there's only one
 * adapter implementation now — the prior local copy diverged from the
 * GameplayLayout copy and was the immediate cause of per-type token fields
 * never reaching the renderer in spectator view.
 */
export { unitStateToToken } from '@/lib/gameplay/unitStateToToken';

export function speedToInterval(speed: 1 | 2 | 4): number {
  return 1200 / speed;
}

// =============================================================================
// Playback Controls
// =============================================================================

interface PlaybackControlsProps {
  playing: boolean;
  speed: 1 | 2 | 4;
  turn: number;
  phase: GamePhase;
  gameOver: boolean;
  onTogglePlay: () => void;
  onSetSpeed: (speed: 1 | 2 | 4) => void;
  onStepForward: () => void;
}

export function PlaybackControls({
  playing,
  speed,
  turn,
  phase,
  gameOver,
  onTogglePlay,
  onSetSpeed,
  onStepForward,
}: PlaybackControlsProps): React.ReactElement {
  const speeds: (1 | 2 | 4)[] = [1, 2, 4];

  return (
    <div
      className="border-border-theme bg-surface-base/90 flex items-center gap-4 rounded-lg border px-5 py-3 shadow-lg backdrop-blur-sm"
      data-testid="spectator-controls"
    >
      <div className="border-border-theme mr-2 border-r pr-4">
        <div className="text-text-theme-muted text-xs font-medium tracking-wider uppercase">
          Turn {turn}
        </div>
        <div className="text-sm font-semibold text-cyan-400 capitalize">
          {phase.replace('_', ' ')}
        </div>
      </div>

      <button
        onClick={onTogglePlay}
        disabled={gameOver}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-600 text-white transition-colors hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-40"
        data-testid="spectator-play-pause"
        aria-label={playing ? 'Pause' : 'Play'}
      >
        {playing ? (
          <AppIcon name="pause" size="control" />
        ) : (
          <AppIcon name="play" size="control" />
        )}
      </button>

      <button
        onClick={onStepForward}
        disabled={playing || gameOver}
        className="border-border-theme text-text-theme-secondary hover:border-border-theme flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        data-testid="spectator-step"
        aria-label="Step Forward"
      >
        <AppIcon name="skip-forward" size="inline" />
      </button>

      <div className="border-border-theme flex items-center gap-1 rounded-md border p-0.5">
        {speeds.map((s) => (
          <button
            key={s}
            onClick={() => onSetSpeed(s)}
            className={`rounded px-2.5 py-1 text-xs font-bold transition-colors ${
              speed === s
                ? 'bg-cyan-600 text-white'
                : 'text-text-theme-secondary hover:text-white'
            }`}
            data-testid={`spectator-speed-${s}`}
          >
            {s}×
          </button>
        ))}
      </div>

      {gameOver && (
        <span className="ml-2 text-sm font-semibold text-amber-400">
          Battle Complete
        </span>
      )}
    </div>
  );
}

// =============================================================================
// Unit Roster Panel
// =============================================================================

export function UnitRoster({
  session,
}: {
  session: IGameSession;
}): React.ReactElement {
  const { units, currentState } = session;

  const playerUnits = units.filter((u) => u.side === GameSide.Player);
  const opponentUnits = units.filter((u) => u.side === GameSide.Opponent);

  const getStatus = (unitId: string) => {
    const state = currentState.units[unitId];
    if (!state) return 'unknown';
    if (state.destroyed) return 'destroyed';
    return 'active';
  };

  return (
    <div className="flex flex-col gap-3 p-3" data-testid="spectator-roster">
      <div>
        <h3 className="mb-2 text-xs font-bold tracking-wider text-cyan-400 uppercase">
          Player Force
        </h3>
        <div className="space-y-1">
          {playerUnits.map((u) => {
            const status = getStatus(u.id);
            return (
              <div
                key={u.id}
                className={`flex items-center justify-between rounded px-2 py-1.5 text-xs ${
                  status === 'destroyed'
                    ? 'text-text-theme-muted bg-red-900/30 line-through'
                    : 'bg-surface-base text-text-theme-primary'
                }`}
              >
                <span>{u.name}</span>
                <span className="text-text-theme-muted">
                  {u.gunnery}/{u.piloting}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-xs font-bold tracking-wider text-red-400 uppercase">
          Opponent Force
        </h3>
        <div className="space-y-1">
          {opponentUnits.map((u) => {
            const status = getStatus(u.id);
            return (
              <div
                key={u.id}
                className={`flex items-center justify-between rounded px-2 py-1.5 text-xs ${
                  status === 'destroyed'
                    ? 'text-text-theme-muted bg-red-900/30 line-through'
                    : 'bg-surface-base text-text-theme-primary'
                }`}
              >
                <span>{u.name}</span>
                <span className="text-text-theme-muted">
                  {u.gunnery}/{u.piloting}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Results Overlay
// =============================================================================

export function ResultsOverlay({
  interactiveSession,
  sessionId,
}: {
  interactiveSession: InteractiveSession;
  sessionId: string;
}): React.ReactElement {
  const result = interactiveSession.getResult();
  const rawWinner = result?.winner ?? 'draw';

  const winnerText =
    rawWinner === 'draw'
      ? 'Draw'
      : rawWinner === 'player'
        ? 'Player Victory'
        : 'Opponent Victory';

  const winnerColor =
    rawWinner === 'draw'
      ? 'text-amber-400'
      : rawWinner === 'player'
        ? 'text-emerald-400'
        : 'text-red-400';

  return (
    <div
      className="bg-surface-deep/80 absolute inset-0 z-20 flex items-center justify-center backdrop-blur-sm"
      data-testid="spectator-results"
    >
      <div className="border-border-theme bg-surface-base max-w-md rounded-xl border p-8 text-center shadow-2xl">
        <div className={`mb-3 text-4xl font-black ${winnerColor}`}>
          {winnerText}
        </div>
        <p className="text-text-theme-secondary mb-6 capitalize">
          {(result?.reason ?? 'unknown').replace(/_/g, ' ')}
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href={`/gameplay/games/${sessionId}/replay`}>
            <Button variant="primary" data-testid="spectator-replay-btn">
              Watch Replay
            </Button>
          </Link>
          <Link href="/gameplay/games">
            <Button variant="secondary" data-testid="spectator-back-btn">
              Back to Games
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
