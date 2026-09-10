export function WaitingForOpponentBanner(): React.ReactElement {
  return (
    <div
      className="rounded border border-amber-300 bg-amber-50 p-2 text-center text-sm font-semibold text-amber-800"
      role="status"
      aria-live="polite"
      data-testid="waiting-for-opponent-banner"
    >
      Waiting for Opponent...
    </div>
  );
}

export function AttackerLockedBanner(): React.ReactElement {
  return (
    <div
      className="border-border-theme-subtle bg-surface-base text-text-theme-primary rounded border p-2 text-center text-sm font-semibold"
      data-testid="attacker-locked-banner"
    >
      Attacks locked. Awaiting phase resolution.
    </div>
  );
}

export function ZeroAmmoBlockMessage(): React.ReactElement {
  return (
    <p
      className="text-xs font-semibold text-red-700"
      data-testid="zero-ammo-block-message"
    >
      One or more selected weapons have no ammo remaining.
    </p>
  );
}
