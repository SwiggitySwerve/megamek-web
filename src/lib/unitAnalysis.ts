import {
  CustomizableUnit,
  EquipmentItem,
  FullUnit,
  IArmorInfo,
  IBuildRecommendation,
  ICriticalSlotSummary,
  IEquipmentSummary,
  IHeatManagementInfo,
  IStructureInfo,
  ITechnicalSpecs,
  UnitAnalysisContext,
  UnitDisplayData,
  UnitEquipmentItem,
  CriticalLocation,
} from '../types';

const DEFAULT_CONTEXT: UnitAnalysisContext = {
  includeHeatAnalysis: true,
  includeArmorAnalysis: true,
  includeEquipmentAnalysis: true,
  includeBuildRecommendations: true,
  unitType: 'BattleMech',
};

const DEFAULT_UNIT: FullUnit = {
  id: 'unknown',
  chassis: 'Unknown',
  model: 'Variant',
  tonnage: 50,
  tech_base: 'Inner Sphere',
  rules_level: 'Standard',
  data: {},
};

const asFullUnit = (unit: CustomizableUnit | null | undefined): FullUnit =>
  (unit as unknown as FullUnit) ?? DEFAULT_UNIT;

const sum = (values: Array<number | undefined>): number =>
  values.reduce<number>((acc, value) => acc + (value ?? 0), 0);

const determineHeatRisk = (balance: number): IHeatManagementInfo['overheatingRisk'] => {
  if (balance >= 0) return 'none';
  if (balance >= -2) return 'low';
  if (balance >= -5) return 'medium';
  if (balance >= -10) return 'high';
  return 'critical';
};

const buildEquipmentLookup = (availableEquipment: EquipmentItem[]): Map<string, EquipmentItem> => {
  const map = new Map<string, EquipmentItem>();
  availableEquipment.forEach(item => {
    if (item.internal_id) {
      map.set(item.internal_id, item);
    }
    if (item.name) {
      map.set(item.name.toLowerCase(), item);
    }
  });
  return map;
};

export class UnitAnalyzer {
  static analyzeUnit(
    unitInput: CustomizableUnit | null,
    loadout: UnitEquipmentItem[] = [],
    availableEquipment: EquipmentItem[] = [],
    context: UnitAnalysisContext = DEFAULT_CONTEXT,
  ): UnitDisplayData {
    const unit = asFullUnit(unitInput);
    const effectiveContext = { ...DEFAULT_CONTEXT, ...context };
    let result: UnitDisplayData = {
      unit,
      loadout,
      availableEquipment,
    };

    if (effectiveContext.includeHeatAnalysis) {
      result = {
        ...result,
        heatManagement: this.analyzeHeat(unit, loadout, availableEquipment),
      };
    }

    if (effectiveContext.includeArmorAnalysis) {
      result = {
        ...result,
        armorInfo: this.analyzeArmor(unit),
      };
    }

    result = {
      ...result,
      structureInfo: this.analyzeStructure(unit),
    };

    if (effectiveContext.includeEquipmentAnalysis) {
      result = {
        ...result,
        equipmentSummary: this.analyzeEquipment(loadout, availableEquipment),
      };
    }

    if (effectiveContext.unitType === 'BattleMech') {
      result = {
        ...result,
        criticalSlotSummary: this.analyzeCriticalSlots(unit),
      };
    }

    if (effectiveContext.includeBuildRecommendations) {
      result = {
        ...result,
        buildRecommendations: this.generateRecommendations(result),
      };
    }

    result = {
      ...result,
      technicalSpecs: this.analyzeTechnicalSpecs(unit, loadout),
    };

    return result;
  }

  private static analyzeHeat(
    unit: FullUnit,
    loadout: UnitEquipmentItem[],
    availableEquipment: EquipmentItem[],
  ): IHeatManagementInfo {
    const equipmentLookup = buildEquipmentLookup(availableEquipment);

    const totalHeatGeneration = loadout.reduce((total, item) => {
      if (typeof item.heat === 'number') {
        return total + item.heat;
      }

      const equipment =
        equipmentLookup.get(item.item_name?.toLowerCase?.() ?? '') ??
        equipmentLookup.get(item.item_name ?? '');

      const weaponHeat =
        equipment && 'weapon_details' in equipment && 
        typeof (equipment.weapon_details as { heat?: number })?.heat === 'number'
          ? (equipment.weapon_details as { heat: number }).heat
          : 0;
      return total + weaponHeat;
    }, 0);

    const heatSinkData = unit.data?.heat_sinks;
    const totalHeatSinks = heatSinkData?.count ?? 10;
    const heatSinkType = heatSinkData?.type ?? 'Single';
    const dissipationPerSink = heatSinkType.toLowerCase().includes('double') ? 2 : 1;
    const totalHeatDissipation = totalHeatSinks * dissipationPerSink;

    const engineRating = unit.data?.engine?.rating ?? unit.data?.movement?.walk_mp ?? 0;
    const engineHeatSinkCapacity = Math.max(10, Math.floor(engineRating / 25));
    const engineIntegratedHeatSinks = Math.min(engineHeatSinkCapacity, totalHeatSinks);
    const externalHeatSinks = Math.max(0, totalHeatSinks - engineIntegratedHeatSinks);

    const heatBalance = totalHeatDissipation - totalHeatGeneration;

    return {
      totalHeatGeneration,
      totalHeatDissipation,
      heatBalance,
      totalHeatSinks,
      engineIntegratedHeatSinks,
      externalHeatSinks,
      engineHeatSinkCapacity,
      heatSinkType,
      overheatingRisk: determineHeatRisk(heatBalance),
    };
  }

  private static analyzeArmor(unit: FullUnit): IArmorInfo {
    const armorData = unit.data?.armor;
    if (!armorData) {
      return {
        type: 'Unknown',
        totalArmorPoints: 0,
        maxArmorPoints: 0,
        armorEfficiency: 0,
        locationBreakdown: [],
        armorTonnage: 0,
      };
    }

    const locationBreakdown =
      armorData.locations?.map(loc => ({
        location: loc.location,
        armorPoints: loc.armor_points ?? 0,
        maxArmorPoints: (loc.armor_points ?? 0) * 1.1,
        rearArmorPoints: loc.rear_armor_points,
        maxRearArmorPoints: loc.rear_armor_points ? (loc.rear_armor_points ?? 0) * 1.1 : undefined,
      })) ?? [];

    const totalArmorPoints = sum(
      locationBreakdown.map(loc => loc.armorPoints + (loc.rearArmorPoints ?? 0)),
    );
    const unitMass = unit.data?.mass ?? unit.tonnage ?? 0;
    const theoreticalMax = Math.floor(unitMass * 2.5);
    const armorEfficiency =
      theoreticalMax > 0 ? (totalArmorPoints / theoreticalMax) * 100 : 0;
    const armorTonnage = Math.ceil((totalArmorPoints / 16) * 2) / 2;

    return {
      type: armorData.type ?? 'Standard',
      totalArmorPoints,
      maxArmorPoints: theoreticalMax,
      armorEfficiency,
      locationBreakdown,
      armorTonnage,
    };
  }

  private static analyzeStructure(unit: FullUnit): IStructureInfo {
    const structureType = unit.data?.structure?.type ?? 'Standard';
    const unitMass = unit.data?.mass ?? unit.tonnage ?? 0;
    const totalInternalStructure = Math.floor((unitMass / 5) * 5);
    const baseStructureTonnage = unitMass * 0.1;
    const structureTonnage = structureType.toLowerCase().includes('endo')
      ? baseStructureTonnage * 0.5
      : baseStructureTonnage;

    return {
      type: structureType,
      totalInternalStructure,
      structureTonnage,
      structureEfficiency: 100,
    };
  }

  private static analyzeEquipment(
    loadout: UnitEquipmentItem[],
    availableEquipment: EquipmentItem[],
  ): IEquipmentSummary {
    const equipmentLookup = buildEquipmentLookup(availableEquipment);
    const equipmentByCategory = new Map<
      string,
      { count: number; tonnage: number; items: string[] }
    >();
    const weaponSummary = {
      totalWeapons: 0,
      energyWeapons: 0,
      ballisticWeapons: 0,
      missileWeapons: 0,
      physicalWeapons: 0,
    };

    loadout.forEach(item => {
      const equipment =
        equipmentLookup.get(item.item_name?.toLowerCase?.() ?? '') ??
        equipmentLookup.get(item.item_name ?? '');

      const tonnage = equipment?.tonnage ?? item.tons ?? 0;
      const category =
        equipment?.category ??
        item.item_type ??
        equipment?.type ??
        'Equipment';

      if (!equipmentByCategory.has(category)) {
        equipmentByCategory.set(category, { count: 0, tonnage: 0, items: [] });
      }
      const entry = equipmentByCategory.get(category)!;
      entry.count += 1;
      entry.tonnage += tonnage;
      entry.items.push(item.item_name ?? equipment?.name ?? 'Unknown Equipment');

      if ((item.item_type ?? '').toLowerCase() === 'weapon') {
        weaponSummary.totalWeapons += 1;
        const cat = category.toLowerCase();
        if (cat.includes('energy')) weaponSummary.energyWeapons += 1;
        else if (cat.includes('ballistic')) weaponSummary.ballisticWeapons += 1;
        else if (cat.includes('missile')) weaponSummary.missileWeapons += 1;
        else if (cat.includes('physical')) weaponSummary.physicalWeapons += 1;
      }
    });

    const totalEquipmentTonnage = Array.from(equipmentByCategory.values()).reduce(
      (acc, entry) => acc + entry.tonnage,
      0,
    );

    return {
      totalEquipmentCount: loadout.length,
      totalEquipmentTonnage,
      equipmentByCategory: Array.from(equipmentByCategory.entries()).map(
        ([category, data]) => ({
          category,
          ...data,
        }),
      ),
      weaponSummary,
    };
  }

  private static analyzeCriticalSlots(unit: FullUnit): ICriticalSlotSummary {
    const criticals = unit.data?.criticals ?? [];
    if (criticals.length > 0) {
      const locationBreakdown = criticals.map(location => {
        const slots = 'slots' in location && Array.isArray(location.slots)
          ? location.slots
          : [];
        const totalSlots = slots.length;
        const usedSlots = slots.filter(slot => Boolean(slot)).length;
        return {
          location: location.location,
          totalSlots,
          usedSlots,
          availableSlots: totalSlots - usedSlots,
          utilizationPercentage: totalSlots
            ? (usedSlots / totalSlots) * 100
            : 0,
        };
      });

      const totals = locationBreakdown.reduce(
        (acc, loc) => {
          acc.totalSlots += loc.totalSlots;
          acc.usedSlots += loc.usedSlots;
          acc.availableSlots += loc.availableSlots;
          return acc;
        },
        { totalSlots: 0, usedSlots: 0, availableSlots: 0 },
      );

      return {
        totalSlots: totals.totalSlots,
        usedSlots: totals.usedSlots,
        availableSlots: totals.availableSlots,
        locationBreakdown,
      };
    }

    const standardLocations = [
      { location: 'Head', slots: 6 },
      { location: 'Center Torso', slots: 12 },
      { location: 'Left Torso', slots: 12 },
      { location: 'Right Torso', slots: 12 },
      { location: 'Left Arm', slots: 12 },
      { location: 'Right Arm', slots: 12 },
      { location: 'Left Leg', slots: 6 },
      { location: 'Right Leg', slots: 6 },
    ];

    return {
      totalSlots: 78,
      usedSlots: 0,
      availableSlots: 78,
      locationBreakdown: standardLocations.map(loc => ({
        location: loc.location,
        totalSlots: loc.slots,
        usedSlots: 0,
        availableSlots: loc.slots,
        utilizationPercentage: 0,
      })),
    };
  }

  private static generateRecommendations(data: UnitDisplayData): IBuildRecommendation[] {
    const recommendations: IBuildRecommendation[] = [];

    if (data.heatManagement && data.heatManagement.heatBalance < 0) {
      recommendations.push({
        id: 'heat-balance',
        type: 'heat_management',
        priority: 'high',
        title: 'Improve Heat Dissipation',
        description: 'Current heat dissipation is lower than generation.',
        suggestedActions: [
          'Add additional heat sinks',
          'Replace weapons with lower-heat variants',
          'Consider movement penalties to reduce heat build-up',
        ],
        autoApplyable: false,
      });
    }

    if (data.armorInfo && data.armorInfo.armorEfficiency < 80) {
      recommendations.push({
        id: 'armor-coverage',
        type: 'protection',
        priority: 'medium',
        title: 'Increase Armor Coverage',
        description: 'Armor efficiency is below recommended thresholds.',
        suggestedActions: [
          'Allocate more armor tonnage to critical locations',
          'Evaluate advanced armor types for efficiency gains',
        ],
        autoApplyable: false,
      });
    }

    return recommendations;
  }

  private static analyzeTechnicalSpecs(
    unit: FullUnit,
    loadout: UnitEquipmentItem[],
  ): ITechnicalSpecs {
    const tonnage = unit.tonnage ?? unit.data?.mass ?? 0;
    const walkSpeed = unit.data?.movement?.walk_mp ?? 0;
    const runSpeed = unit.data?.movement?.run_mp ?? 0;
    const jumpSpeed = unit.data?.movement?.jump_mp ?? 0;

    const tonnageBreakdown = {
      chassis: tonnage * 0.3,
      engine: tonnage * 0.2,
      heatSinks: (unit.data?.heat_sinks?.count ?? 10) * 0.1,
      armor: tonnage * 0.2,
      structure: tonnage * 0.1,
      equipment: tonnage * 0.1,
      weapons: loadout.length * 0.5,
      ammunition: loadout.filter(item => item.item_type === 'ammo').length * 0.1,
    };

    return {
      battleValue: unit.data?.battle_value ?? 0,
      costCBills: unit.data?.cost_cbills ?? 0,
      techLevel: unit.rules_level ?? 'Standard',
      rulesLevel: unit.rules_level ?? 'Standard',
      walkSpeed,
      runSpeed,
      jumpSpeed,
      tonnageBreakdown,
    };
  }
}

