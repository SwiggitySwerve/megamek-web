import { ArmorType as ArmorEnum } from '../types/SystemComponents';
import { RulesLevel, TechBase } from '../types/TechBase';

export type ArmorTechBase = TechBase | 'Both';

export interface ArmorProfile {
  readonly id: string;
  readonly name: string;
  readonly armorEnum?: ArmorEnum;
  readonly pointsPerTon: number;
  readonly criticalSlots: number;
  readonly techBase: ArmorTechBase;
  readonly minTechLevel: number;
  readonly minRulesLevel: RulesLevel;
  readonly costMultiplier: number;
  readonly weightMultiplier?: number;
  readonly hasRearArmor: boolean;
  readonly specialRules?: string[];
}

const enumOrName = (armorEnum: ArmorEnum): string => armorEnum;

export const ARMOR_TYPES: ArmorProfile[] = [
  {
    id: 'standard',
    name: enumOrName(ArmorEnum.STANDARD),
    armorEnum: ArmorEnum.STANDARD,
    pointsPerTon: 16,
    criticalSlots: 0,
    techBase: 'Both',
    minTechLevel: 1,
    minRulesLevel: RulesLevel.INTRODUCTORY,
    costMultiplier: 1.0,
    weightMultiplier: 1.0,
    hasRearArmor: true,
  },
  {
    id: 'ferro_fibrous',
    name: enumOrName(ArmorEnum.FERRO_FIBROUS),
    armorEnum: ArmorEnum.FERRO_FIBROUS,
    pointsPerTon: 17.92,
    criticalSlots: 14,
    techBase: TechBase.INNER_SPHERE,
    minTechLevel: 2,
    minRulesLevel: RulesLevel.ADVANCED,
    costMultiplier: 2.0,
    weightMultiplier: 1.0,
    hasRearArmor: true,
  },
  {
    id: 'ferro_fibrous_clan',
    name: enumOrName(ArmorEnum.FERRO_FIBROUS_CLAN),
    armorEnum: ArmorEnum.FERRO_FIBROUS_CLAN,
    pointsPerTon: 19.2,
    criticalSlots: 7,
    techBase: TechBase.CLAN,
    minTechLevel: 2,
    minRulesLevel: RulesLevel.ADVANCED,
    costMultiplier: 2.0,
    weightMultiplier: 1.0,
    hasRearArmor: true,
  },
  {
    id: 'light_ferro_fibrous',
    name: enumOrName(ArmorEnum.LIGHT_FERRO),
    armorEnum: ArmorEnum.LIGHT_FERRO,
    pointsPerTon: 16.8,
    criticalSlots: 7,
    techBase: TechBase.INNER_SPHERE,
    minTechLevel: 3,
    minRulesLevel: RulesLevel.ADVANCED,
    costMultiplier: 1.5,
    weightMultiplier: 1.0,
    hasRearArmor: true,
  },
  {
    id: 'heavy_ferro_fibrous',
    name: enumOrName(ArmorEnum.HEAVY_FERRO),
    armorEnum: ArmorEnum.HEAVY_FERRO,
    pointsPerTon: 19.2,
    criticalSlots: 21,
    techBase: TechBase.INNER_SPHERE,
    minTechLevel: 3,
    minRulesLevel: RulesLevel.ADVANCED,
    costMultiplier: 3.0,
    weightMultiplier: 1.0,
    hasRearArmor: true,
  },
  {
    id: 'stealth',
    name: enumOrName(ArmorEnum.STEALTH),
    armorEnum: ArmorEnum.STEALTH,
    pointsPerTon: 16,
    criticalSlots: 12,
    techBase: TechBase.INNER_SPHERE,
    minTechLevel: 3,
    minRulesLevel: RulesLevel.ADVANCED,
    costMultiplier: 5.0,
    weightMultiplier: 1.0,
    hasRearArmor: true,
    specialRules: ['Requires ECM', 'Requires Double Heat Sinks'],
  },
  {
    id: 'reactive',
    name: enumOrName(ArmorEnum.REACTIVE),
    armorEnum: ArmorEnum.REACTIVE,
    pointsPerTon: 14,
    criticalSlots: 14,
    techBase: 'Both',
    minTechLevel: 3,
    minRulesLevel: RulesLevel.ADVANCED,
    costMultiplier: 3.0,
    weightMultiplier: 1.0,
    hasRearArmor: true,
    specialRules: ['Half damage from Ballistic and Missile weapons'],
  },
  {
    id: 'reflective',
    name: enumOrName(ArmorEnum.REFLECTIVE),
    armorEnum: ArmorEnum.REFLECTIVE,
    pointsPerTon: 16,
    criticalSlots: 10,
    techBase: 'Both',
    minTechLevel: 3,
    minRulesLevel: RulesLevel.ADVANCED,
    costMultiplier: 3.0,
    weightMultiplier: 1.0,
    hasRearArmor: true,
    specialRules: ['Half damage from Energy weapons', 'Double damage from Ballistic weapons'],
  },
  {
    id: 'hardened',
    name: enumOrName(ArmorEnum.HARDENED),
    armorEnum: ArmorEnum.HARDENED,
    pointsPerTon: 8,
    criticalSlots: 0,
    techBase: 'Both',
    minTechLevel: 3,
    minRulesLevel: RulesLevel.ADVANCED,
    costMultiplier: 2.0,
    weightMultiplier: 2.0,
    hasRearArmor: true,
    specialRules: ['Reduces damage by 1 point per hit', 'No critical hits through armor'],
  },
];

export const getArmorType = (id?: string): ArmorProfile => {
  if (!id) {
    return ARMOR_TYPES[0];
  }

  return (
    ARMOR_TYPES.find(type => type.id === id || type.name === id) ?? ARMOR_TYPES[0]
  );
};

