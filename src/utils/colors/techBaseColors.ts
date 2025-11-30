/**
 * Tech Base Color System
 * 
 * Colors to distinguish Inner Sphere and Clan technology.
 * 
 * @spec openspec/changes/add-customizer-ui-components/specs/color-system/spec.md
 */

import { TechBase } from '@/types/enums/TechBase';

/**
 * Tech base color definitions
 */
export interface TechBaseColorDefinition {
  readonly text: string;
  readonly bg: string;
  readonly border: string;
  readonly badge: string;
  readonly accent: string;
}

/**
 * Tech base colors
 * 
 * - Inner Sphere: blue (text-blue-400)
 * - Clan: green (text-green-400)
 * - Mixed: purple (text-purple-400)
 */
export const TECH_BASE_COLORS: Record<string, TechBaseColorDefinition> = {
  [TechBase.INNER_SPHERE]: {
    text: 'text-blue-400',
    bg: 'bg-blue-900/50',
    border: 'border-blue-700',
    badge: 'bg-blue-700 text-blue-100',
    accent: '#60a5fa', // blue-400
  },
  [TechBase.CLAN]: {
    text: 'text-green-400',
    bg: 'bg-green-900/50',
    border: 'border-green-700',
    badge: 'bg-green-700 text-green-100',
    accent: '#4ade80', // green-400
  },
  [TechBase.MIXED]: {
    text: 'text-purple-400',
    bg: 'bg-purple-900/50',
    border: 'border-purple-700',
    badge: 'bg-purple-700 text-purple-100',
    accent: '#c084fc', // purple-400
  },
  [TechBase.MIXED_IS_CHASSIS]: {
    text: 'text-blue-400',
    bg: 'bg-blue-900/50',
    border: 'border-blue-700',
    badge: 'bg-blue-700 text-blue-100',
    accent: '#60a5fa',
  },
  [TechBase.MIXED_CLAN_CHASSIS]: {
    text: 'text-green-400',
    bg: 'bg-green-900/50',
    border: 'border-green-700',
    badge: 'bg-green-700 text-green-100',
    accent: '#4ade80',
  },
};

/**
 * Default colors for unknown tech base
 */
const DEFAULT_TECH_COLORS: TechBaseColorDefinition = {
  text: 'text-slate-400',
  bg: 'bg-slate-900/50',
  border: 'border-slate-700',
  badge: 'bg-slate-700 text-slate-100',
  accent: '#94a3b8', // slate-400
};

/**
 * Get colors for a tech base
 */
export function getTechBaseColors(techBase: TechBase | string): TechBaseColorDefinition {
  return TECH_BASE_COLORS[techBase] || DEFAULT_TECH_COLORS;
}

/**
 * Get the badge class string for a tech base
 */
export function getTechBaseBadgeClass(techBase: TechBase | string): string {
  const colors = getTechBaseColors(techBase);
  return `${colors.badge} px-2 py-0.5 rounded text-xs font-medium`;
}

/**
 * Get short display name for tech base
 */
export function getTechBaseShortName(techBase: TechBase | string): string {
  switch (techBase) {
    case TechBase.INNER_SPHERE:
      return 'IS';
    case TechBase.CLAN:
      return 'Clan';
    case TechBase.MIXED:
      return 'Mixed';
    case TechBase.MIXED_IS_CHASSIS:
      return 'IS/Mixed';
    case TechBase.MIXED_CLAN_CHASSIS:
      return 'Clan/Mixed';
    default:
      return String(techBase);
  }
}

