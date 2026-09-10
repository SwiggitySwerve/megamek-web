import React, { useState } from 'react';

import { AppIcon } from '@/components/ui/AppIcon';

export interface ArmorLocationProps {
  location: string;
  currentArmor: number;
  maxArmor: number;
  onArmorChange: (value: number) => void;
  className?: string;
}

export function ArmorLocation({
  location,
  currentArmor,
  maxArmor,
  onArmorChange,
  className = '',
}: ArmorLocationProps): React.ReactElement {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleIncrement = () => {
    if (currentArmor < maxArmor) {
      onArmorChange(currentArmor + 1);
    }
  };

  const handleDecrement = () => {
    if (currentArmor > 0) {
      onArmorChange(currentArmor - 1);
    }
  };

  const handleQuickAdd = (amount: number) => {
    const newValue = Math.min(currentArmor + amount, maxArmor);
    onArmorChange(newValue);
  };

  const percentage = maxArmor > 0 ? (currentArmor / maxArmor) * 100 : 0;
  const progressColor = percentage === 100 ? 'bg-green-500' : 'bg-amber-500';

  return (
    <section
      className={`armor-location bg-surface-base rounded-lg shadow-md ${className}`.trim()}
      aria-label={`${location} armor allocation`}
    >
      {/* Location Header - Always Visible */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
        aria-expanded={isExpanded}
        aria-controls={`${location.toLowerCase()}-details`}
      >
        <div className="flex-1">
          <h3 className="text-text-theme-primary text-lg font-semibold">
            {location}
          </h3>
          <div className="mt-1 flex items-center gap-2">
            <div className="bg-surface-raised h-2 flex-1 overflow-hidden rounded-full">
              <div
                className={`h-full ${progressColor} transition-all duration-200`}
                style={{ width: `${percentage}%` }}
                role="progressbar"
                aria-valuenow={currentArmor}
                aria-valuemin={0}
                aria-valuemax={maxArmor}
                aria-label={`${location} armor: ${currentArmor} of ${maxArmor}`}
              />
            </div>
            <span className="text-text-theme-muted text-sm tabular-nums">
              {currentArmor} / {maxArmor}
            </span>
          </div>
        </div>
        <AppIcon
          name="chevron-down"
          size="control"
          className={isExpanded ? 'rotate-180' : ' '}
          aria-hidden="true"
        />
      </button>

      {/* Expanded Controls */}
      {isExpanded && (
        <div
          id={`${location.toLowerCase()}-details`}
          className="border-border-theme border-t px-4 pb-4"
        >
          {/* Quick Add Buttons */}
          <div className="mt-4 grid grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => handleQuickAdd(5)}
              className="bg-accent text-on-accent hover:bg-accent-hover min-h-[44px] rounded-md px-3 py-2 text-sm font-medium transition-colors"
              aria-label={`Add 5 armor to ${location}`}
              disabled={currentArmor >= maxArmor}
            >
              +5
            </button>
            <button
              type="button"
              onClick={() => handleQuickAdd(10)}
              className="bg-accent text-on-accent hover:bg-accent-hover min-h-[44px] rounded-md px-3 py-2 text-sm font-medium transition-colors"
              aria-label={`Add 10 armor to ${location}`}
              disabled={currentArmor >= maxArmor}
            >
              +10
            </button>
            <button
              type="button"
              onClick={() => handleQuickAdd(20)}
              className="bg-accent text-on-accent hover:bg-accent-hover min-h-[44px] rounded-md px-3 py-2 text-sm font-medium transition-colors"
              aria-label={`Add 20 armor to ${location}`}
              disabled={currentArmor >= maxArmor}
            >
              +20
            </button>
            <button
              type="button"
              onClick={() => onArmorChange(maxArmor)}
              className="min-h-[44px] rounded-md bg-green-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600"
              aria-label={`Maximize ${location} armor`}
              disabled={currentArmor >= maxArmor}
            >
              Max
            </button>
          </div>

          {/* Fine-Tune Stepper Controls */}
          <div className="mt-3 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleDecrement}
              className="bg-surface-raised flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full p-2 transition-colors"
              aria-label={`Remove 1 armor from ${location}`}
              disabled={currentArmor <= 0}
            >
              <AppIcon name="remove" size="toolbar" aria-hidden="true" />
            </button>
            <div className="w-20 text-center">
              <span className="text-text-theme-primary text-2xl font-bold tabular-nums">
                {currentArmor}
              </span>
            </div>
            <button
              type="button"
              onClick={handleIncrement}
              className="bg-surface-raised flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full p-2 transition-colors"
              aria-label={`Add 1 armor to ${location}`}
              disabled={currentArmor >= maxArmor}
            >
              <AppIcon name="add" size="toolbar" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
