/**
 * Critical Slot Allocation Types
 * 
 * Defines critical slot counts and allocation rules.
 * 
 * @spec openspec/specs/critical-slot-allocation/spec.md
 */

/**
 * Mech locations for critical slot allocation
 */
export enum MechLocation {
  HEAD = 'Head',
  CENTER_TORSO = 'Center Torso',
  LEFT_TORSO = 'Left Torso',
  RIGHT_TORSO = 'Right Torso',
  LEFT_ARM = 'Left Arm',
  RIGHT_ARM = 'Right Arm',
  LEFT_LEG = 'Left Leg',
  RIGHT_LEG = 'Right Leg',
}

/**
 * Critical slot counts per location
 */
export const LOCATION_SLOT_COUNTS: Readonly<Record<MechLocation, number>> = {
  [MechLocation.HEAD]: 6,
  [MechLocation.CENTER_TORSO]: 12,
  [MechLocation.LEFT_TORSO]: 12,
  [MechLocation.RIGHT_TORSO]: 12,
  [MechLocation.LEFT_ARM]: 12,
  [MechLocation.RIGHT_ARM]: 12,
  [MechLocation.LEFT_LEG]: 6,
  [MechLocation.RIGHT_LEG]: 6,
};

/**
 * Total critical slots available on a mech
 */
export const TOTAL_CRITICAL_SLOTS = 78;

/**
 * Fixed component placement in locations
 */
export interface FixedSlotAllocation {
  readonly location: MechLocation;
  readonly slotStart: number;
  readonly slotCount: number;
  readonly componentType: string;
  readonly isRequired: boolean;
}

/**
 * Standard fixed allocations for biped mechs
 */
export const STANDARD_FIXED_ALLOCATIONS: readonly FixedSlotAllocation[] = [
  // Head
  { location: MechLocation.HEAD, slotStart: 0, slotCount: 1, componentType: 'Life Support', isRequired: true },
  { location: MechLocation.HEAD, slotStart: 1, slotCount: 1, componentType: 'Sensors', isRequired: true },
  { location: MechLocation.HEAD, slotStart: 2, slotCount: 1, componentType: 'Cockpit', isRequired: true },
  { location: MechLocation.HEAD, slotStart: 4, slotCount: 1, componentType: 'Sensors', isRequired: true },
  { location: MechLocation.HEAD, slotStart: 5, slotCount: 1, componentType: 'Life Support', isRequired: true },

  // Left Arm (standard biped)
  { location: MechLocation.LEFT_ARM, slotStart: 0, slotCount: 1, componentType: 'Shoulder', isRequired: true },
  { location: MechLocation.LEFT_ARM, slotStart: 1, slotCount: 1, componentType: 'Upper Arm Actuator', isRequired: true },
  { location: MechLocation.LEFT_ARM, slotStart: 2, slotCount: 1, componentType: 'Lower Arm Actuator', isRequired: false },
  { location: MechLocation.LEFT_ARM, slotStart: 3, slotCount: 1, componentType: 'Hand Actuator', isRequired: false },

  // Right Arm (standard biped)
  { location: MechLocation.RIGHT_ARM, slotStart: 0, slotCount: 1, componentType: 'Shoulder', isRequired: true },
  { location: MechLocation.RIGHT_ARM, slotStart: 1, slotCount: 1, componentType: 'Upper Arm Actuator', isRequired: true },
  { location: MechLocation.RIGHT_ARM, slotStart: 2, slotCount: 1, componentType: 'Lower Arm Actuator', isRequired: false },
  { location: MechLocation.RIGHT_ARM, slotStart: 3, slotCount: 1, componentType: 'Hand Actuator', isRequired: false },

  // Left Leg
  { location: MechLocation.LEFT_LEG, slotStart: 0, slotCount: 1, componentType: 'Hip', isRequired: true },
  { location: MechLocation.LEFT_LEG, slotStart: 1, slotCount: 1, componentType: 'Upper Leg Actuator', isRequired: true },
  { location: MechLocation.LEFT_LEG, slotStart: 2, slotCount: 1, componentType: 'Lower Leg Actuator', isRequired: true },
  { location: MechLocation.LEFT_LEG, slotStart: 3, slotCount: 1, componentType: 'Foot Actuator', isRequired: true },

  // Right Leg
  { location: MechLocation.RIGHT_LEG, slotStart: 0, slotCount: 1, componentType: 'Hip', isRequired: true },
  { location: MechLocation.RIGHT_LEG, slotStart: 1, slotCount: 1, componentType: 'Upper Leg Actuator', isRequired: true },
  { location: MechLocation.RIGHT_LEG, slotStart: 2, slotCount: 1, componentType: 'Lower Leg Actuator', isRequired: true },
  { location: MechLocation.RIGHT_LEG, slotStart: 3, slotCount: 1, componentType: 'Foot Actuator', isRequired: true },
];

/**
 * Get available slots for a location (after fixed components)
 */
export function getAvailableSlots(
  location: MechLocation,
  engineCTSlots: number = 6,
  gyroSlots: number = 4,
  hasLowerArmActuator: boolean = true,
  hasHandActuator: boolean = true
): number {
  let available = LOCATION_SLOT_COUNTS[location];
  
  switch (location) {
    case MechLocation.HEAD:
      // 5 fixed (life support ×2, sensors ×2, cockpit) - varies by cockpit type
      available -= 5;
      break;
      
    case MechLocation.CENTER_TORSO:
      // Engine + Gyro
      available -= engineCTSlots;
      available -= gyroSlots;
      break;
      
    case MechLocation.LEFT_ARM:
    case MechLocation.RIGHT_ARM:
      // Shoulder + Upper Arm are required
      available -= 2;
      if (hasLowerArmActuator) available -= 1;
      if (hasHandActuator) available -= 1;
      break;
      
    case MechLocation.LEFT_LEG:
    case MechLocation.RIGHT_LEG:
      // Hip + Upper/Lower/Foot actuators are all required
      available -= 4;
      break;
      
    default:
      // Side torsos have no fixed components
      break;
  }
  
  return Math.max(0, available);
}

/**
 * Get all available slots across the mech
 */
export function getTotalAvailableSlots(
  engineCTSlots: number = 6,
  gyroSlots: number = 4,
  hasLowerArmActuators: boolean = true,
  hasHandActuators: boolean = true
): number {
  let total = 0;
  
  for (const location of Object.values(MechLocation)) {
    total += getAvailableSlots(
      location as MechLocation,
      engineCTSlots,
      gyroSlots,
      hasLowerArmActuators,
      hasHandActuators
    );
  }
  
  return total;
}

/**
 * Distributed component allocation rules
 * Components like Endo Steel and Ferro-Fibrous can be placed anywhere
 */
export interface DistributedAllocationRule {
  readonly componentType: string;
  readonly totalSlots: number;
  readonly slotsPerUnit: number;
  readonly canAllocateToHead: boolean;
  readonly preferredLocations: MechLocation[];
}

/**
 * Standard distributed allocation rules
 */
export const DISTRIBUTED_ALLOCATION_RULES: readonly DistributedAllocationRule[] = [
  {
    componentType: 'Endo Steel (IS)',
    totalSlots: 14,
    slotsPerUnit: 1,
    canAllocateToHead: true, // Technically allowed but not recommended
    preferredLocations: [
      MechLocation.LEFT_TORSO,
      MechLocation.RIGHT_TORSO,
      MechLocation.LEFT_ARM,
      MechLocation.RIGHT_ARM,
      MechLocation.LEFT_LEG,
      MechLocation.RIGHT_LEG,
    ],
  },
  {
    componentType: 'Endo Steel (Clan)',
    totalSlots: 7,
    slotsPerUnit: 1,
    canAllocateToHead: true,
    preferredLocations: [
      MechLocation.LEFT_TORSO,
      MechLocation.RIGHT_TORSO,
      MechLocation.LEFT_ARM,
      MechLocation.RIGHT_ARM,
    ],
  },
  {
    componentType: 'Ferro-Fibrous (IS)',
    totalSlots: 14,
    slotsPerUnit: 1,
    canAllocateToHead: true,
    preferredLocations: [
      MechLocation.LEFT_TORSO,
      MechLocation.RIGHT_TORSO,
      MechLocation.LEFT_ARM,
      MechLocation.RIGHT_ARM,
      MechLocation.LEFT_LEG,
      MechLocation.RIGHT_LEG,
    ],
  },
  {
    componentType: 'Ferro-Fibrous (Clan)',
    totalSlots: 7,
    slotsPerUnit: 1,
    canAllocateToHead: true,
    preferredLocations: [
      MechLocation.LEFT_TORSO,
      MechLocation.RIGHT_TORSO,
    ],
  },
];

