/**
 * Critical Slot Color System
 * 
 * Colors for system components in critical slot displays.
 * 
 * @spec openspec/changes/add-customizer-ui-components/specs/color-system/spec.md
 */

/**
 * System component types that occupy critical slots
 */
export type SystemComponentType = 
  | 'engine'
  | 'gyro'
  | 'actuator'
  | 'cockpit'
  | 'lifesupport'
  | 'sensors'
  | 'structure'
  | 'armor'
  | 'empty';

/**
 * Color definitions for system components
 */
export interface SlotColorDefinition {
  readonly bg: string;
  readonly border: string;
  readonly text: string;
  readonly hoverBg: string;
}

/**
 * System component slot colors
 * 
 * - Engine: orange (bg-orange-600)
 * - Gyro: purple (bg-purple-600)
 * - Actuator: blue (bg-blue-600)
 * - Cockpit/Life Support/Sensors: yellow (bg-yellow-600)
 * - Empty: gray with dashed border (bg-gray-600)
 */
export const SLOT_COLORS: Record<SystemComponentType, SlotColorDefinition> = {
  engine: {
    bg: 'bg-orange-600',
    border: 'border-orange-700',
    text: 'text-white',
    hoverBg: 'hover:bg-orange-500',
  },
  gyro: {
    bg: 'bg-purple-600',
    border: 'border-purple-700',
    text: 'text-white',
    hoverBg: 'hover:bg-purple-500',
  },
  actuator: {
    bg: 'bg-blue-600',
    border: 'border-blue-700',
    text: 'text-white',
    hoverBg: 'hover:bg-blue-500',
  },
  cockpit: {
    bg: 'bg-yellow-600',
    border: 'border-yellow-700',
    text: 'text-black',
    hoverBg: 'hover:bg-yellow-500',
  },
  lifesupport: {
    bg: 'bg-yellow-600',
    border: 'border-yellow-700',
    text: 'text-black',
    hoverBg: 'hover:bg-yellow-500',
  },
  sensors: {
    bg: 'bg-yellow-600',
    border: 'border-yellow-700',
    text: 'text-black',
    hoverBg: 'hover:bg-yellow-500',
  },
  structure: {
    bg: 'bg-slate-600',
    border: 'border-slate-700',
    text: 'text-slate-200',
    hoverBg: 'hover:bg-slate-500',
  },
  armor: {
    bg: 'bg-slate-600',
    border: 'border-slate-700',
    text: 'text-slate-200',
    hoverBg: 'hover:bg-slate-500',
  },
  empty: {
    bg: 'bg-gray-700',
    border: 'border-gray-600 border-dashed',
    text: 'text-gray-400',
    hoverBg: 'hover:bg-gray-600',
  },
};

/**
 * Get color classes for a system component type
 */
export function getSlotColors(componentType: SystemComponentType): SlotColorDefinition {
  return SLOT_COLORS[componentType] || SLOT_COLORS.empty;
}

/**
 * Get combined Tailwind class string for a slot
 */
export function getSlotColorClasses(componentType: SystemComponentType): string {
  const colors = getSlotColors(componentType);
  return `${colors.bg} ${colors.border} ${colors.text} ${colors.hoverBg}`;
}

/**
 * Classify a slot content name into a system component type
 */
export function classifySystemComponent(name: string): SystemComponentType {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('engine') || lowerName.includes('fusion')) {
    return 'engine';
  }
  if (lowerName.includes('gyro')) {
    return 'gyro';
  }
  if (
    lowerName.includes('shoulder') ||
    lowerName.includes('upper arm') ||
    lowerName.includes('lower arm') ||
    lowerName.includes('hand') ||
    lowerName.includes('hip') ||
    lowerName.includes('upper leg') ||
    lowerName.includes('lower leg') ||
    lowerName.includes('foot')
  ) {
    return 'actuator';
  }
  if (lowerName.includes('cockpit')) {
    return 'cockpit';
  }
  if (lowerName.includes('life support')) {
    return 'lifesupport';
  }
  if (lowerName.includes('sensor')) {
    return 'sensors';
  }
  
  return 'empty';
}

