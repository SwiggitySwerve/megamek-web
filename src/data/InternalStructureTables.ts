/**
 * InternalStructureTables.ts
 * Official BattleTech Internal Structure Point Allocation Table.
 * Source: TechManual
 */

export interface IInternalStructurePoints {
  readonly HD: number; // Head
  readonly CT: number; // Center Torso
  readonly LT: number; // Left Torso
  readonly RT: number; // Right Torso
  readonly LA: number; // Left Arm
  readonly RA: number; // Right Arm
  readonly LL: number; // Left Leg
  readonly RL: number; // Right Leg
}

export const INTERNAL_STRUCTURE_PER_TONNAGE: Record<number, IInternalStructurePoints> = {
  20: { HD: 3, CT: 7, LT: 5, RT: 5, LA: 4, RA: 4, LL: 5, RL: 5 },
  25: { HD: 3, CT: 8, LT: 6, RT: 6, LA: 4, RA: 4, LL: 6, RL: 6 },
  30: { HD: 3, CT: 10, LT: 7, RT: 7, LA: 5, RA: 5, LL: 7, RL: 7 },
  35: { HD: 3, CT: 11, LT: 8, RT: 8, LA: 6, RA: 6, LL: 8, RL: 8 },
  40: { HD: 3, CT: 12, LT: 10, RT: 10, LA: 6, RA: 6, LL: 10, RL: 10 },
  45: { HD: 3, CT: 14, LT: 11, RT: 11, LA: 7, RA: 7, LL: 11, RL: 11 },
  50: { HD: 3, CT: 16, LT: 11, RT: 11, LA: 9, RA: 9, LL: 11, RL: 11 },
  55: { HD: 3, CT: 18, LT: 13, RT: 13, LA: 9, RA: 9, LL: 13, RL: 13 },
  60: { HD: 3, CT: 20, LT: 14, RT: 14, LA: 10, RA: 10, LL: 14, RL: 14 },
  65: { HD: 3, CT: 21, LT: 15, RT: 15, LA: 10, RA: 10, LL: 15, RL: 15 },
  70: { HD: 3, CT: 22, LT: 15, RT: 15, LA: 11, RA: 11, LL: 15, RL: 15 },
  75: { HD: 3, CT: 24, LT: 17, RT: 17, LA: 13, RA: 13, LL: 17, RL: 17 },
  80: { HD: 3, CT: 25, LT: 17, RT: 17, LA: 13, RA: 13, LL: 17, RL: 17 },
  85: { HD: 3, CT: 27, LT: 18, RT: 18, LA: 14, RA: 14, LL: 18, RL: 18 },
  90: { HD: 3, CT: 29, LT: 19, RT: 19, LA: 15, RA: 15, LL: 19, RL: 19 },
  95: { HD: 3, CT: 31, LT: 20, RT: 20, LA: 17, RA: 17, LL: 20, RL: 20 },
  100: { HD: 3, CT: 32, LT: 21, RT: 21, LA: 17, RA: 17, LL: 21, RL: 21 },
};

