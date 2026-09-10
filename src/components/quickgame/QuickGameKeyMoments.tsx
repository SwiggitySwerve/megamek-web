import { useState } from 'react';

import type { IKeyMoment } from '@/types/simulation-viewer/IKeyMoment';

import { Card } from '@/components/ui';

export function KeyMomentsCard({
  keyMoments,
  emptyStateDetail,
}: {
  readonly keyMoments: readonly IKeyMoment[];
  readonly emptyStateDetail?: string;
}): React.ReactElement {
  const [showLowerTiers, setShowLowerTiers] = useState(false);
  const tier1Moments = keyMoments.filter((moment) => moment.tier === 1);
  const tier2Moments = keyMoments.filter((moment) => moment.tier === 2);
  const tier3Moments = keyMoments.filter((moment) => moment.tier === 3);
  const initialMoments =
    tier1Moments.length > 0 ? tier1Moments : keyMoments.slice(0, 2);
  const initialMomentIds = new Set(initialMoments.map((moment) => moment.id));
  const hiddenMoments = [...tier2Moments, ...tier3Moments].filter(
    (moment) => !initialMomentIds.has(moment.id),
  );

  return (
    <Card>
      <div className="border-border-theme border-b p-4">
        <h3 className="text-text-theme-primary font-medium">Key Moments</h3>
      </div>
      <div className="space-y-2 p-4">
        {keyMoments.length === 0 ? (
          <div className="space-y-2">
            <p className="text-text-theme-muted text-sm">
              No key moments recorded.
            </p>
            {emptyStateDetail ? (
              <div className="border-border-theme/50 bg-surface-base/30 rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <span className="bg-surface-raised text-text-theme-secondary rounded px-1.5 py-0.5 text-xs font-bold">
                    End
                  </span>
                  <span className="text-text-theme-muted text-xs">
                    Outcome event
                  </span>
                </div>
                <p className="text-text-theme-secondary mt-1 text-sm">
                  {emptyStateDetail}
                </p>
              </div>
            ) : null}
          </div>
        ) : (
          <>
            {initialMoments.map((moment) => (
              <KeyMomentRow key={moment.id} moment={moment} />
            ))}
            {hiddenMoments.length > 0 && (
              <>
                {showLowerTiers ? (
                  hiddenMoments.map((moment) => (
                    <KeyMomentRow key={moment.id} moment={moment} />
                  ))
                ) : (
                  <button
                    onClick={() => setShowLowerTiers(true)}
                    className="text-text-theme-muted hover:text-text-theme-secondary text-xs underline"
                  >
                    Show {hiddenMoments.length} more moments
                  </button>
                )}
              </>
            )}
          </>
        )}
      </div>
    </Card>
  );
}

function KeyMomentRow({
  moment,
}: {
  readonly moment: IKeyMoment;
}): React.ReactElement {
  const tierStyles = {
    1: {
      container: 'border-amber-700/40 bg-amber-900/20',
      badge: 'bg-amber-600 text-on-accent font-bold',
      text: 'text-text-theme-primary',
    },
    2: {
      container: 'border-border-theme/50 bg-surface-base/30',
      badge: 'bg-surface-raised text-text-theme-primary font-bold',
      text: 'text-text-theme-secondary',
    },
    3: {
      container: 'border-border-theme/30 bg-surface-base/20',
      badge: 'bg-surface-raised text-text-theme-secondary',
      text: 'text-text-theme-muted',
    },
  }[moment.tier];

  return (
    <div className={`rounded-lg border p-3 ${tierStyles.container}`}>
      <div className="flex items-center gap-2">
        <span className={`rounded px-1.5 py-0.5 text-xs ${tierStyles.badge}`}>
          T{moment.tier}
        </span>
        <span className="text-text-theme-muted text-xs">
          Turn {moment.turn}
        </span>
      </div>
      <p className={`mt-1 text-sm ${tierStyles.text}`}>{moment.description}</p>
    </div>
  );
}
