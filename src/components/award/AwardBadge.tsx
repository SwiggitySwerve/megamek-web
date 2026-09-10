/**
 * AwardBadge Component
 * Single award display with icon, name, and rarity-based styling.
 *
 * @spec openspec/changes/add-awards-system/specs/awards/spec.md
 */
import React from 'react';

import { AppIcon } from '@/components/ui/AppIcon';
import {
  IAward,
  AwardRarity,
  getRarityColor,
  getRarityBackground,
} from '@/types/award';

import { getAwardIcon, getRarityStrokeWidth } from './awardIcons';
import { getRarityBorder, getRarityGlow } from './awardRarityStyles';

// =============================================================================
// Types
// =============================================================================

interface AwardBadgeProps {
  award: IAward;
  earned?: boolean;
  onClick?: (award: IAward) => void;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  className?: string;
}

// =============================================================================
// Icon Size Constants
// =============================================================================

const AWARD_ICON_SIZES = {
  sm: 20,
  md: 28,
  lg: 40,
} as const;

// =============================================================================
// Size Configurations
// =============================================================================

const sizeConfig = {
  sm: {
    container: 'w-10 h-10',
    icon: 'w-10 h-10 text-sm',
    name: 'text-xs',
    gap: 'gap-1.5',
  },
  md: {
    container: 'w-14 h-14',
    icon: 'w-14 h-14 text-base',
    name: 'text-sm',
    gap: 'gap-2',
  },
  lg: {
    container: 'w-20 h-20',
    icon: 'w-20 h-20 text-xl',
    name: 'text-base',
    gap: 'gap-3',
  },
};

// =============================================================================
// Component
// =============================================================================

export function AwardBadge({
  award,
  earned = true,
  onClick,
  size = 'md',
  showName = true,
  className = '',
}: AwardBadgeProps): React.ReactElement {
  const config = sizeConfig[size];
  const rarityColor = getRarityColor(award.rarity);
  const rarityBg = getRarityBackground(award.rarity);
  const rarityBorder = getRarityBorder(award.rarity);
  const rarityGlow = getRarityGlow(award.rarity);

  const isClickable = onClick !== undefined;
  const isLegendary = award.rarity === AwardRarity.Legendary;

  // Get icon component and stroke width based on rarity
  const IconComponent = getAwardIcon(award.icon);
  const strokeWidth = getRarityStrokeWidth(award.rarity);

  // Icon size based on container size (approximately 50% of container)
  const iconSize = AWARD_ICON_SIZES[size];
  const unearnedIconSize =
    size === 'lg' ? 'feature' : size === 'md' ? 'control' : 'inline';

  return (
    <div
      className={`flex flex-col items-center ${config.gap} ${isClickable ? 'group cursor-pointer' : ''} ${className} `}
      onClick={isClickable ? () => onClick(award) : undefined}
    >
      {/* Icon Circle */}
      <div
        className={` ${config.icon} flex items-center justify-center rounded-full border-2 font-bold tracking-wide uppercase transition-all duration-300 ${rarityBg} ${rarityBorder} ${earned ? rarityColor : 'text-text-theme-muted opacity-40'} ${earned && rarityGlow ? `shadow-lg ${rarityGlow}` : ''} ${isClickable ? 'group-hover:scale-110' : ''} ${isLegendary && earned ? 'ring-offset-surface-base ring-1 ring-amber-400/30 ring-offset-1' : ''} `}
      >
        {earned ? (
          <IconComponent size={iconSize} strokeWidth={strokeWidth} />
        ) : (
          <AppIcon name="lock" size={unearnedIconSize} className="opacity-50" />
        )}
      </div>

      {/* Award Name */}
      {showName && (
        <span
          className={` ${config.name} text-center leading-tight font-medium ${earned ? 'text-text-theme-secondary' : 'text-text-theme-muted opacity-60'} ${isClickable ? 'group-hover:text-text-theme-primary transition-colors' : ''} `}
        >
          {earned ? award.name : '???'}
        </span>
      )}
    </div>
  );
}

export default AwardBadge;
