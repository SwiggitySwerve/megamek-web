import React, { useState } from 'react';

import { AppIcon } from '@/components/ui/AppIcon';

export type BlockingActionType =
  | 'assign_pilots'
  | 'resolve_repair'
  | 'select_contract'
  | 'other';

export interface BlockingAction {
  type: BlockingActionType;
  message: string;
  count?: number;
}

export interface AdvanceDayButtonProps {
  blockers?: BlockingAction[];
  onAdvance?: () => void;
  onBlockerClick?: (blocker: BlockingAction) => void;
  disabled?: boolean;
  className?: string;
}

export function AdvanceDayButton({
  blockers = [],
  onAdvance,
  onBlockerClick,
  disabled = false,
  className = '',
}: AdvanceDayButtonProps): React.ReactElement {
  const [showTooltip, setShowTooltip] = useState(false);

  const hasBlockers = blockers.length > 0;
  const firstBlocker = blockers[0];
  const hasMultipleBlockers = blockers.length > 1;

  const formatBlockerMessage = (blocker: BlockingAction): string => {
    if (blocker.count && blocker.count > 0) {
      return `${blocker.message} (${blocker.count})`;
    }
    return blocker.message;
  };

  const handleClick = () => {
    if (disabled) return;

    if (hasBlockers && firstBlocker) {
      onBlockerClick?.(firstBlocker);
    } else {
      onAdvance?.();
    }
  };

  const baseStyles = `
    relative
    min-w-[160px] min-h-[60px]
    px-8 py-4
    rounded-xl
    font-bold text-lg
    uppercase tracking-wide
    transition-all duration-200
    select-none
    cursor-pointer
    border-2
    shadow-lg
    focus:outline-none focus:ring-4
  `;

  const readyStyles = `
    bg-gradient-to-b from-emerald-400 to-emerald-600
    border-emerald-300
    text-white
    shadow-emerald-500/40
    hover:from-emerald-300 hover:to-emerald-500
    hover:shadow-emerald-400/50 hover:shadow-xl
    hover:scale-[1.02]
    focus:ring-emerald-400/50
    animate-advance-pulse
  `;

  const blockedStyles = `
    bg-gradient-to-b from-amber-400 to-amber-600
    border-amber-300
    text-amber-950
    shadow-amber-500/30
    hover:from-amber-300 hover:to-amber-500
    hover:shadow-amber-400/40 hover:shadow-xl
    hover:scale-[1.02]
    focus:ring-amber-400/50
  `;

  const disabledStyles = `
    bg-gradient-to-b from-slate-500 to-slate-600
    border-border-theme
    text-text-theme-secondary
    shadow-slate-500/20
    cursor-not-allowed
    opacity-60
  `;

  const currentStyles = disabled
    ? disabledStyles
    : hasBlockers
      ? blockedStyles
      : readyStyles;

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        data-testid="advance-day-button"
        onClick={handleClick}
        disabled={disabled}
        onMouseEnter={() => hasMultipleBlockers && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`${baseStyles} ${currentStyles}`}
        style={{
          textShadow: hasBlockers ? 'none' : '0 1px 2px rgba(0,0,0,0.3)',
        }}
      >
        {!disabled && !hasBlockers && (
          <span
            className="animate-advance-glow absolute inset-0 rounded-xl bg-emerald-400/20 blur-md"
            aria-hidden="true"
          />
        )}

        <span className="relative flex items-center justify-center gap-3">
          {hasBlockers ? (
            <>
              <AppIcon name="warning" size="control" />
              <span>{firstBlocker && formatBlockerMessage(firstBlocker)}</span>
              {hasMultipleBlockers && (
                <span className="text-sm opacity-75">
                  +{blockers.length - 1}
                </span>
              )}
            </>
          ) : (
            <>
              <span>Advance Day</span>
              <AppIcon name="arrow-right" size="control" />
            </>
          )}
        </span>
      </button>

      {showTooltip && hasMultipleBlockers && (
        <div
          className="border-border-theme bg-surface-deep text-text-theme-primary absolute bottom-full left-1/2 z-50 mb-3 -translate-x-1/2 rounded-lg border px-4 py-3 text-sm whitespace-nowrap shadow-xl"
          role="tooltip"
        >
          <div className="mb-2 font-semibold text-amber-400">
            Blocking Actions ({blockers.length})
          </div>
          <ul className="space-y-1">
            {blockers.map((blocker, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                {formatBlockerMessage(blocker)}
              </li>
            ))}
          </ul>
          <div className="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 border-t-8 border-r-8 border-l-8 border-t-slate-900 border-r-transparent border-l-transparent" />
        </div>
      )}

      <style>{`
        @keyframes advance-pulse {
          0%, 100% {
            box-shadow: 
              0 10px 15px -3px rgba(16, 185, 129, 0.4),
              0 4px 6px -4px rgba(16, 185, 129, 0.3),
              0 0 0 0 rgba(52, 211, 153, 0.4);
          }
          50% {
            box-shadow: 
              0 10px 15px -3px rgba(16, 185, 129, 0.4),
              0 4px 6px -4px rgba(16, 185, 129, 0.3),
              0 0 0 6px rgba(52, 211, 153, 0);
          }
        }
        
        @keyframes advance-glow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.02);
          }
        }
        
        .animate-advance-pulse {
          animation: advance-pulse 2s ease-in-out infinite;
        }
        
        .animate-advance-glow {
          animation: advance-glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default AdvanceDayButton;
