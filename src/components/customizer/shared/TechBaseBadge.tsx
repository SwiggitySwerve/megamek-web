/**
 * Tech Base Badge Component
 * 
 * Displays tech base with appropriate color coding.
 * 
 * @spec openspec/specs/color-system/spec.md
 */

import React from 'react';
import { TechBase } from '@/types/enums/TechBase';
import { getTechBaseBadgeClass, getTechBaseShortName } from '@/utils/colors/techBaseColors';

interface TechBaseBadgeProps {
  /** Tech base to display */
  techBase: TechBase;
  /** Use short name (IS/Clan) instead of full name */
  short?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Tech base badge with color coding
 */
export function TechBaseBadge({
  techBase,
  short = true,
  className = '',
}: TechBaseBadgeProps) {
  const badgeClass = getTechBaseBadgeClass(techBase);
  const displayText = short ? getTechBaseShortName(techBase) : techBase;
  
  return (
    <span className={`${badgeClass} ${className}`}>
      {displayText}
    </span>
  );
}

