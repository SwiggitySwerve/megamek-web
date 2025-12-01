/**
 * Equipment Type Color System
 * 
 * Colors for equipment types in critical slot and equipment displays.
 * 
 * @spec openspec/specs/color-system/spec.md
 */

import { EquipmentCategory } from '@/types/equipment';

/**
 * Equipment color type for styling
 */
export type EquipmentColorType = 
  | 'weapon'
  | 'ammunition'
  | 'heatsink'
  | 'electronics'
  | 'physical'
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

/**
 * Equipment type colors
 * 
 * - Weapons: red (bg-red-700)
 * - Ammunition: orange (bg-orange-700)
 * - Heat sinks: cyan (bg-cyan-700)
 * - Other equipment: blue (bg-blue-700)
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
  misc: {
    bg: 'bg-slate-700',
    border: 'border-slate-800',
    text: 'text-white',
    hoverBg: 'hover:bg-slate-600',
    badge: 'bg-slate-600 text-white',
  },
};

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
  switch (category) {
    case EquipmentCategory.ENERGY_WEAPON:
    case EquipmentCategory.BALLISTIC_WEAPON:
    case EquipmentCategory.MISSILE_WEAPON:
    case EquipmentCategory.ARTILLERY:
    case EquipmentCategory.CAPITAL_WEAPON:
      return 'weapon';
    case EquipmentCategory.AMMUNITION:
      return 'ammunition';
    case EquipmentCategory.ELECTRONICS:
      return 'electronics';
    case EquipmentCategory.PHYSICAL_WEAPON:
      return 'physical';
    case EquipmentCategory.MISC_EQUIPMENT:
    default:
      return 'misc';
  }
}

/**
 * Classify equipment by name into a color type
 */
export function classifyEquipment(name: string): EquipmentColorType {
  const lowerName = name.toLowerCase();
  
  // Heat sinks
  if (lowerName.includes('heat sink') || lowerName.includes('heatsink')) {
    return 'heatsink';
  }
  
  // Ammunition
  if (
    lowerName.includes('ammo') ||
    lowerName.includes('ammunition') ||
    lowerName.endsWith(' rounds')
  ) {
    return 'ammunition';
  }
  
  // Weapons (common patterns)
  if (
    lowerName.includes('laser') ||
    lowerName.includes('ppc') ||
    lowerName.includes('autocannon') ||
    lowerName.includes('ac/') ||
    lowerName.includes('gauss') ||
    lowerName.includes('lrm') ||
    lowerName.includes('srm') ||
    lowerName.includes('mrm') ||
    lowerName.includes('machine gun') ||
    lowerName.includes('flamer') ||
    lowerName.includes('narc') ||
    lowerName.includes('tag')
  ) {
    return 'weapon';
  }
  
  // Electronics
  if (
    lowerName.includes('computer') ||
    lowerName.includes('ecm') ||
    lowerName.includes('bap') ||
    lowerName.includes('probe') ||
    lowerName.includes('c3') ||
    lowerName.includes('command console')
  ) {
    return 'electronics';
  }
  
  // Physical weapons
  if (
    lowerName.includes('hatchet') ||
    lowerName.includes('sword') ||
    lowerName.includes('claw') ||
    lowerName.includes('mace') ||
    lowerName.includes('lance') ||
    lowerName.includes('talons')
  ) {
    return 'physical';
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

