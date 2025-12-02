/**
 * Equipment Type Color System
 * 
 * Colors for equipment types in critical slot and equipment displays.
 * 
 * @spec openspec/specs/color-system/spec.md
 */

import { EquipmentCategory } from '@/types/equipment';

// =============================================================================
// Types
// =============================================================================

/**
 * Equipment color type for styling
 */
export type EquipmentColorType = 
  | 'weapon'
  | 'ammunition'
  | 'heatsink'
  | 'electronics'
  | 'physical'
  | 'movement'
  | 'misc';

/**
 * Color definitions for equipment types
 */
export interface EquipmentColorDefinition {
  readonly bg: string;
  readonly border: string;
  readonly text: string;
  readonly hoverBg: string;
  readonly badge: string;
}

// =============================================================================
// Name Classification Patterns
// =============================================================================

/**
 * Patterns for classifying equipment by name.
 * Each array contains substrings to match (case-insensitive).
 */
const EQUIPMENT_NAME_PATTERNS: Record<EquipmentColorType, readonly string[]> = {
  heatsink: [
    'heat sink',
    'heatsink',
  ],
  ammunition: [
    'ammo',
    'ammunition',
  ],
  weapon: [
    'laser',
    'ppc',
    'autocannon',
    'ac/',
    'gauss',
    'lrm',
    'srm',
    'mrm',
    'machine gun',
    'flamer',
    'narc',
    'tag',
  ],
  electronics: [
    'computer',
    'ecm',
    'bap',
    'probe',
    'c3',
    'command console',
  ],
  physical: [
    'hatchet',
    'sword',
    'claw',
    'mace',
    'lance',
    'talons',
  ],
  movement: [
    'jump jet',
    'masc',
    'supercharger',
    'partial wing',
  ],
  misc: [], // Fallback - no specific patterns
} as const;

/**
 * Suffix patterns that indicate ammunition
 */
const AMMUNITION_SUFFIXES: readonly string[] = [
  ' rounds',
] as const;

/**
 * Priority order for pattern matching.
 * Earlier entries take precedence over later ones.
 */
const CLASSIFICATION_PRIORITY: readonly EquipmentColorType[] = [
  'heatsink',
  'ammunition',
  'weapon',
  'electronics',
  'physical',
  'movement',
] as const;

// =============================================================================
// Color Definitions
// =============================================================================

/**
 * Equipment type colors
 * 
 * - Weapons: red (bg-red-700)
 * - Ammunition: orange (bg-orange-700)
 * - Heat sinks: cyan (bg-cyan-700)
 * - Electronics: blue (bg-blue-700)
 * - Physical: amber (bg-amber-700)
 * - Movement: green (bg-green-700)
 * - Misc: slate (bg-slate-700)
 */
export const EQUIPMENT_COLORS: Record<EquipmentColorType, EquipmentColorDefinition> = {
  weapon: {
    bg: 'bg-red-700',
    border: 'border-red-800',
    text: 'text-white',
    hoverBg: 'hover:bg-red-600',
    badge: 'bg-red-600 text-white',
  },
  ammunition: {
    bg: 'bg-orange-700',
    border: 'border-orange-800',
    text: 'text-white',
    hoverBg: 'hover:bg-orange-600',
    badge: 'bg-orange-600 text-white',
  },
  heatsink: {
    bg: 'bg-cyan-700',
    border: 'border-cyan-800',
    text: 'text-white',
    hoverBg: 'hover:bg-cyan-600',
    badge: 'bg-cyan-600 text-white',
  },
  electronics: {
    bg: 'bg-blue-700',
    border: 'border-blue-800',
    text: 'text-white',
    hoverBg: 'hover:bg-blue-600',
    badge: 'bg-blue-600 text-white',
  },
  physical: {
    bg: 'bg-amber-700',
    border: 'border-amber-800',
    text: 'text-white',
    hoverBg: 'hover:bg-amber-600',
    badge: 'bg-amber-600 text-white',
  },
  movement: {
    bg: 'bg-green-700',
    border: 'border-green-800',
    text: 'text-white',
    hoverBg: 'hover:bg-green-600',
    badge: 'bg-green-600 text-white',
  },
  misc: {
    bg: 'bg-slate-700',
    border: 'border-slate-800',
    text: 'text-white',
    hoverBg: 'hover:bg-slate-600',
    badge: 'bg-slate-600 text-white',
  },
};

// =============================================================================
// Category to Color Type Mapping
// =============================================================================

/**
 * Mapping from EquipmentCategory to EquipmentColorType
 */
const CATEGORY_TO_COLOR_MAP: Record<EquipmentCategory, EquipmentColorType> = {
  [EquipmentCategory.ENERGY_WEAPON]: 'weapon',
  [EquipmentCategory.BALLISTIC_WEAPON]: 'weapon',
  [EquipmentCategory.MISSILE_WEAPON]: 'weapon',
  [EquipmentCategory.ARTILLERY]: 'weapon',
  [EquipmentCategory.CAPITAL_WEAPON]: 'weapon',
  [EquipmentCategory.AMMUNITION]: 'ammunition',
  [EquipmentCategory.ELECTRONICS]: 'electronics',
  [EquipmentCategory.PHYSICAL_WEAPON]: 'physical',
  [EquipmentCategory.MOVEMENT]: 'movement',
  [EquipmentCategory.MISC_EQUIPMENT]: 'misc',
};

// =============================================================================
// Public Functions
// =============================================================================

/**
 * Get color classes for an equipment type
 */
export function getEquipmentColors(colorType: EquipmentColorType): EquipmentColorDefinition {
  return EQUIPMENT_COLORS[colorType];
}

/**
 * Get combined Tailwind class string for equipment
 */
export function getEquipmentColorClasses(colorType: EquipmentColorType): string {
  const colors = getEquipmentColors(colorType);
  return `${colors.bg} ${colors.border} ${colors.text} ${colors.hoverBg}`;
}

/**
 * Map EquipmentCategory to color type
 */
export function categoryToColorType(category: EquipmentCategory): EquipmentColorType {
  return CATEGORY_TO_COLOR_MAP[category] ?? 'misc';
}

/**
 * Classify equipment by name into a color type.
 * Uses pattern matching against known equipment name patterns.
 */
export function classifyEquipment(name: string): EquipmentColorType {
  const lowerName = name.toLowerCase();
  
  // Check each category in priority order
  for (const colorType of CLASSIFICATION_PRIORITY) {
    const patterns = EQUIPMENT_NAME_PATTERNS[colorType];
    
    // Check if name includes any pattern
    if (patterns.some(pattern => lowerName.includes(pattern))) {
      return colorType;
    }
  }
  
  // Special case: ammunition suffix patterns
  if (AMMUNITION_SUFFIXES.some(suffix => lowerName.endsWith(suffix))) {
    return 'ammunition';
  }
  
  return 'misc';
}

/**
 * Get classes for equipment in critical slots display
 */
export function getBattleTechEquipmentClasses(
  equipmentName: string,
  isSelected: boolean = false
): string {
  const colorType = classifyEquipment(equipmentName);
  const colors = getEquipmentColors(colorType);
  
  const baseClasses = `${colors.bg} ${colors.border} ${colors.text} border rounded transition-colors`;
  
  if (isSelected) {
    return `${baseClasses} ring-2 ring-yellow-400 ring-offset-1 ring-offset-slate-900`;
  }
  
  return `${baseClasses} ${colors.hoverBg}`;
}
