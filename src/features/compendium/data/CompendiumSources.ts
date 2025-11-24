import { WEAPONS_DB } from '../../../data/weapons';
import {
  STRUCTURE_WEIGHT_MULTIPLIERS,
  STRUCTURE_SLOTS_REQUIRED,
} from '../../../data/StructureTables';
import { ARMOR_POINTS_PER_TON, ARMOR_SLOTS_REQUIRED } from '../../../data/ArmorTables';
import {
  ENGINE_WEIGHT_MULTIPLIERS,
  ENGINE_SLOTS,
  IEngineSlotConfiguration,
} from '../../../data/EngineTables';
import { GYRO_WEIGHT_MULTIPLIERS, GYRO_SLOTS } from '../../../data/GyroTables';
import { COCKPIT_PROFILES } from '../../../data/CockpitTables';
import { HEAT_SINK_PROFILES } from '../../../data/HeatSinkTables';
import {
  IEquipmentCompendiumEntry,
  IComponentCompendiumEntry,
  IUnitCompendiumEntry,
} from '../types';
import {
  ArmorLocation,
  IArmorSegmentAllocation,
  IMechLabState,
  ISlotState,
  DEFAULT_MECH_STATE,
} from '../../mech-lab/store/MechLabState';
import { calculateMechLabMetrics } from '../../mech-lab/store/MechLabMetrics';
import { MechValidator } from '../../../mechanics/Validation';
import { TechBase, RulesLevel } from '../../../types/TechBase';
import { ComponentType } from '../../../types/ComponentType';
import {
  StructureType,
  ArmorType,
  EngineType,
  GyroType,
  CockpitType,
  HeatSinkType,
} from '../../../types/SystemComponents';

const formatSlotMap = (map: Record<TechBase, number>): string =>
  `IS ${map[TechBase.INNER_SPHERE]}, Clan ${map[TechBase.CLAN]}, Mixed ${map[TechBase.MIXED]}`;

const formatEngineSlotFootprint = (
  slotMap: Record<TechBase, IEngineSlotConfiguration>
): string => {
  const segments = Object.entries(slotMap).map(([tech, footprint]) => {
    return `${tech}: CT ${footprint.ct} / ST ${footprint.sideTorso}`;
  });
  return segments.join(' • ');
};

const toPercent = (multiplier: number): string =>
  `${(multiplier * 100).toFixed(1).replace(/\.0$/, '')}%`;

const createEquipmentEntries = (): IEquipmentCompendiumEntry[] =>
  WEAPONS_DB.map(weapon => ({
    id: `equipment-${weapon.id}`,
    category: 'equipment',
    name: weapon.name,
    summary: `${weapon.type} weapon`,
    source: 'src/data/weapons',
    techBase: weapon.techBase,
    rulesLevel: weapon.rulesLevel,
    tags: [weapon.type, `${weapon.damage} dmg`, `${weapon.range.long} hex long`],
    stats: [
      { id: 'weight', label: 'Weight', value: `${weapon.weight.toFixed(2)}t` },
      { id: 'slots', label: 'Critical Slots', value: `${weapon.criticalSlots}` },
      { id: 'heat', label: 'Heat', value: `${weapon.heat}` },
      {
        id: 'range',
        label: 'Range (Min/S/M/L)',
        value: `${weapon.range.min ?? 0}/${weapon.range.short}/${weapon.range.medium}/${weapon.range.long}`,
      },
    ],
    payload: weapon,
  }));

const structureEntries = Object.values(StructureType).map<IComponentCompendiumEntry>(type => {
  const multiplier = STRUCTURE_WEIGHT_MULTIPLIERS[type];
  const slotCost = STRUCTURE_SLOTS_REQUIRED[type];
  const summary =
    type === StructureType.REINFORCED
      ? 'Doubles durability at the cost of weight.'
      : type === StructureType.ENDO_STEEL || type === StructureType.ENDO_STEEL_CLAN
        ? 'Halves structure weight using internal bracing.'
        : 'Baseline internal structure option.';

  const rulesLevel =
    type === StructureType.COMPOSITE || type === StructureType.REINFORCED
      ? RulesLevel.ADVANCED
      : RulesLevel.STANDARD;

  return {
    id: `component-structure-${type}`,
    category: 'component',
    name: `${type} Structure`,
    source: 'src/data/StructureTables.ts',
    techBase: TechBase.MIXED,
    rulesLevel,
    summary,
    tags: ['Structure'],
    stats: [
      {
        id: 'weight',
        label: 'Weight',
        value: `${toPercent(multiplier)} of chassis tonnage`,
        description: 'Rounded up to the nearest 0.5 tons per TechManual.',
      },
      {
        id: 'slots',
        label: 'Critical Slots',
        value: formatSlotMap(slotCost),
      },
    ],
    payload: {
      componentType: ComponentType.STRUCTURE,
      structureType: type,
      weightMultiplier: multiplier,
      slotCost,
    },
  };
});

const armorEntries = Object.values(ArmorType).map<IComponentCompendiumEntry>(type => {
  const points = ARMOR_POINTS_PER_TON[type];
  const slotCost = ARMOR_SLOTS_REQUIRED[type];
  const summary =
    type === ArmorType.STANDARD
      ? 'Standard 16 points per ton armor plating.'
      : `${type} armor configuration`;
  const rulesLevel =
    type === ArmorType.STANDARD ? RulesLevel.INTRODUCTORY : RulesLevel.ADVANCED;

  return {
    id: `component-armor-${type}`,
    category: 'component',
    name: `${type} Armor`,
    source: 'src/data/ArmorTables.ts',
    techBase: TechBase.MIXED,
    rulesLevel,
    summary,
    tags: ['Armor'],
    stats: [
      {
        id: 'efficiency',
        label: 'Armor Points / Ton',
        value: points.toFixed(2).replace(/\.00$/, ''),
      },
      {
        id: 'slots',
        label: 'Critical Slots',
        value: formatSlotMap(slotCost),
      },
    ],
    payload: {
      componentType: ComponentType.ARMOR,
      armorType: type,
      pointsPerTon: points,
      slotCost,
    },
  };
});

const engineEntries = Object.values(EngineType).map<IComponentCompendiumEntry>(type => {
  const multiplier = ENGINE_WEIGHT_MULTIPLIERS[type];
  const slotFootprint = ENGINE_SLOTS[type];
  const summary =
    type === EngineType.STANDARD
      ? 'Baseline fusion engine.'
      : `${type} engine footprint`;
  const rulesLevel =
    type === EngineType.STANDARD || type === EngineType.LIGHT || type === EngineType.XL
      ? RulesLevel.STANDARD
      : RulesLevel.ADVANCED;

  return {
    id: `component-engine-${type}`,
    category: 'component',
    name: `${type} Engine`,
    source: 'src/data/EngineTables.ts',
    techBase: TechBase.MIXED,
    rulesLevel,
    summary,
    tags: ['Engine'],
    stats: [
      {
        id: 'weight',
        label: 'Weight Multiplier',
        value: `${toPercent(multiplier)} of standard fusion weight`,
      },
      {
        id: 'slots',
        label: 'Critical Slots',
        value: formatEngineSlotFootprint(slotFootprint),
      },
    ],
    payload: {
      componentType: ComponentType.ENGINE,
      engineType: type,
      weightMultiplier: multiplier,
      slotFootprint,
    },
  };
});

const gyroEntries = Object.values(GyroType).map<IComponentCompendiumEntry>(type => {
  const multiplier = GYRO_WEIGHT_MULTIPLIERS[type];
  const slots = GYRO_SLOTS[type];
  const summary =
    type === GyroType.STANDARD ? 'Standard gyro assembly.' : `${type} gyro configuration`;
  const rulesLevel =
    type === GyroType.STANDARD ? RulesLevel.INTRODUCTORY : RulesLevel.ADVANCED;

  return {
    id: `component-gyro-${type}`,
    category: 'component',
    name: `${type} Gyro`,
    source: 'src/data/GyroTables.ts',
    techBase: TechBase.MIXED,
    rulesLevel,
    summary,
    tags: ['Gyro'],
    stats: [
      { id: 'weight', label: 'Weight Multiplier', value: `${toPercent(multiplier)} of standard` },
      { id: 'slots', label: 'Critical Slots', value: `${slots}` },
    ],
    payload: {
      componentType: ComponentType.GYRO,
      gyroType: type,
      weightMultiplier: multiplier,
      slots,
    },
  };
});

const cockpitEntries = Object.values(CockpitType).map<IComponentCompendiumEntry>(type => {
  const profile = COCKPIT_PROFILES[type];
  return {
    id: `component-cockpit-${type}`,
    category: 'component',
    name: `${type} Cockpit`,
    source: 'src/data/CockpitTables.ts',
    techBase: TechBase.MIXED,
    rulesLevel: profile.minRulesLevel,
    summary: `${type} cockpit profile`,
    tags: ['Cockpit'],
    stats: [
      { id: 'weight', label: 'Weight', value: `${profile.weight}t` },
      {
        id: 'slots',
        label: 'Critical Slots',
        value: `Head ${profile.slotDistribution.head}, CT ${profile.slotDistribution.centerTorso}`,
      },
    ],
    payload: {
      componentType: ComponentType.COCKPIT,
      cockpitType: type,
      weight: profile.weight,
      slotDistribution: profile.slotDistribution,
      allowedTechBases: profile.allowedTechBases,
      minRulesLevel: profile.minRulesLevel,
      notes: profile.notes,
    },
  };
});

const heatSinkEntries = Object.values(HeatSinkType).map<IComponentCompendiumEntry>(type => {
  const profile = HEAT_SINK_PROFILES[type];
  return {
    id: `component-heatsink-${type}`,
    category: 'component',
    name: `${type} Heat Sink`,
    source: 'src/data/HeatSinkTables.ts',
    techBase: TechBase.MIXED,
    rulesLevel: profile.minRulesLevel,
    summary: `${type} heat sink specification`,
    tags: ['Heat Sink'],
    stats: [
      { id: 'weight', label: 'Weight per Sink', value: `${profile.weightPerSink}t` },
      { id: 'dissipation', label: 'Dissipation', value: `${profile.dissipationPerSink} heat` },
      {
        id: 'slots',
        label: 'Critical Slots per Sink',
        value: formatSlotMap(profile.slotsPerSink),
      },
    ],
    payload: {
      componentType: ComponentType.HEAT_SINK,
      heatSinkType: type,
      weightPerSink: profile.weightPerSink,
      dissipationPerSink: profile.dissipationPerSink,
      slotsPerSink: profile.slotsPerSink,
      allowedTechBases: profile.allowedTechBases,
      minRulesLevel: profile.minRulesLevel,
      notes: profile.notes,
    },
  };
});

const COMPONENT_ENTRIES: readonly IComponentCompendiumEntry[] = [
  ...structureEntries,
  ...armorEntries,
  ...engineEntries,
  ...gyroEntries,
  ...cockpitEntries,
  ...heatSinkEntries,
];

const UNIT_BLUEPRINTS: readonly IMechLabState[] = [DEFAULT_MECH_STATE];

const cloneState = (state: IMechLabState): IMechLabState => ({
  ...state,
  armorAllocation: Object.entries(state.armorAllocation).reduce(
    (allocationMap, [location, allocation]) => {
      allocationMap[location as ArmorLocation] = { ...allocation };
      return allocationMap;
    },
    {} as Record<ArmorLocation, IArmorSegmentAllocation>
  ),
  equipment: state.equipment.map(item => ({ ...item })),
  criticalSlots: Object.entries(state.criticalSlots).reduce((slotsMap, [location, slots]) => {
    slotsMap[location] = slots.map(slot => ({ ...slot }));
    return slotsMap;
  }, {} as Record<string, ISlotState[]>),
});

const createUnitEntries = (): IUnitCompendiumEntry[] =>
  UNIT_BLUEPRINTS.map(blueprint => {
    const clone = cloneState(blueprint);
    const metrics = calculateMechLabMetrics(clone);
    const validation = MechValidator.validate(clone, metrics.currentWeight);
    const enriched: IMechLabState = {
      ...clone,
      currentWeight: metrics.currentWeight,
      isValid: validation.isValid,
      validationErrors: [...validation.errors],
      validationWarnings: [...validation.warnings],
    };
    const runningMP = Math.floor(enriched.walkingMP * 1.5);

    return {
      id: `unit-${enriched.name.toLowerCase().replace(/\s+/g, '-')}`,
      category: 'unit',
      name: `${enriched.name} ${enriched.model}`,
      summary: `${enriched.tonnage}-ton ${enriched.techBase} chassis`,
      source: 'src/features/mech-lab/store/MechLabState.ts',
      techBase: enriched.techBase,
      rulesLevel: enriched.rulesLevel,
      tags: ['Unit'],
      stats: [
        { id: 'tonnage', label: 'Tonnage', value: `${enriched.tonnage}t` },
        { id: 'movement', label: 'Movement (Walk/Run)', value: `${enriched.walkingMP}/${runningMP}` },
        { id: 'structure', label: 'Structure Type', value: enriched.structureType },
        { id: 'engine', label: 'Engine Type', value: enriched.engineType },
      ],
      payload: {
        blueprint: enriched,
        metrics,
        validation,
      },
    };
  });

export const CompendiumSources = {
  getEquipmentEntries: (): IEquipmentCompendiumEntry[] => createEquipmentEntries(),
  getComponentEntries: (): IComponentCompendiumEntry[] => [...COMPONENT_ENTRIES],
  getUnitEntries: (): IUnitCompendiumEntry[] => createUnitEntries(),
};


