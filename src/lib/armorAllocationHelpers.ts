import { calculateMaxArmorPointsForLocation } from './armorCalculations';

type ArmorAllocation = Record<string, { front: number; rear?: number }>;

type ArmorWeightSource = {
  pointsPerTon: number;
};

const LOCATION_CODE_MAP: Record<string, string> = {
  head: 'HD',
  centertorso: 'CT',
  lefttorso: 'LT',
  righttorso: 'RT',
  leftarm: 'LA',
  rightarm: 'RA',
  leftleg: 'LL',
  rightleg: 'RL',
  centerleg: 'LL',
};

export function getMaxArmorForLocation(location: string, tonnage: number): number {
  const normalized = location.replace(/\s+/g, '').toLowerCase();
  const code = LOCATION_CODE_MAP[normalized];
  if (!code) {
    return 0;
  }
  return calculateMaxArmorPointsForLocation(tonnage, code);
}

export function calculateArmorWeight(totalPoints: number, armorType: ArmorWeightSource): number {
  if (!armorType.pointsPerTon) {
    return 0;
  }
  return Math.ceil(totalPoints / armorType.pointsPerTon);
}

export function getTotalArmorPoints(allocation: ArmorAllocation): number {
  return Object.values(allocation).reduce((total, armor) => total + armor.front + (armor.rear || 0), 0);
}

export function hasRearArmor(location: string): boolean {
  const normalized = location.replace(/\s+/g, '').toLowerCase();
  return normalized === 'centertorso' || normalized === 'lefttorso' || normalized === 'righttorso';
}

export interface AllocationPattern {
  readonly name: string;
  readonly description: string;
  readonly allocate: (maxPoints: Record<string, number>) => ArmorAllocation;
}

type MaxPointsRecord = Record<string, number>;

export const ALLOCATION_PATTERNS: AllocationPattern[] = [
  {
    name: 'Maximum Protection',
    description: 'Allocates maximum armor to all locations',
    allocate: (maxPoints: MaxPointsRecord): ArmorAllocation => {
      const result: ArmorAllocation = {};
      Object.entries(maxPoints).forEach(([location, max]) => {
        if (hasRearArmor(location)) {
          const front = Math.ceil(max * 0.667);
          const rear = Math.floor(max * 0.333);
          result[location] = { front, rear };
        } else {
          result[location] = { front: max };
        }
      });
      return result;
    },
  },
  {
    name: 'Balanced Front/Rear',
    description: 'Balances armor between front and rear for torsos',
    allocate: (maxPoints: MaxPointsRecord): ArmorAllocation => {
      const result: ArmorAllocation = {};
      Object.entries(maxPoints).forEach(([location, max]) => {
        if (hasRearArmor(location)) {
          const front = Math.ceil(max * 0.6);
          const rear = Math.floor(max * 0.4);
          result[location] = { front, rear };
        } else {
          result[location] = { front: max };
        }
      });
      return result;
    },
  },
  {
    name: 'Striker Pattern',
    description: 'Light armor focused on speed - minimal rear armor',
    allocate: (maxPoints: MaxPointsRecord): ArmorAllocation => {
      const result: ArmorAllocation = {};
      Object.entries(maxPoints).forEach(([location, max]) => {
        if (location === 'head') {
          result[location] = { front: Math.min(max, 6) };
        } else if (hasRearArmor(location)) {
          const front = Math.ceil(max * 0.5);
          const rear = Math.floor(max * 0.15);
          result[location] = { front, rear };
        } else {
          result[location] = { front: Math.ceil(max * 0.6) };
        }
      });
      return result;
    },
  },
  {
    name: 'Brawler Pattern',
    description: 'Heavy armor for close combat',
    allocate: (maxPoints: MaxPointsRecord): ArmorAllocation => {
      const result: ArmorAllocation = {};
      Object.entries(maxPoints).forEach(([location, max]) => {
        if (location === 'head') {
          result[location] = { front: max };
        } else if (hasRearArmor(location)) {
          const front = Math.ceil(max * 0.7);
          const rear = Math.floor(max * 0.3);
          result[location] = { front, rear };
        } else {
          result[location] = { front: Math.ceil(max * 0.9) };
        }
      });
      return result;
    },
  },
  {
    name: 'Sniper Pattern',
    description: 'Front-heavy armor for long-range combat',
    allocate: (maxPoints: MaxPointsRecord): ArmorAllocation => {
      const result: ArmorAllocation = {};
      Object.entries(maxPoints).forEach(([location, max]) => {
        if (hasRearArmor(location)) {
          const front = Math.ceil(max * 0.8);
          const rear = Math.floor(max * 0.2);
          result[location] = { front, rear };
        } else {
          result[location] = { front: Math.ceil(max * 0.7) };
        }
      });
      return result;
    },
  },
];

