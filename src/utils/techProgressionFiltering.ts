import { ComponentConfiguration, TechBase } from '../types';
import { TechProgression, TechBranch } from './techProgression';
import {
  getAvailableStructureTypes,
  getAvailableArmorTypes,
  getAvailableEngineTypes,
  getAvailableGyroTypes,
  getAvailableHeatSinkTypes,
} from './componentOptionFiltering';
import { UnitConfiguration } from './criticalSlots/UnitCriticalManagerTypes';

const DEFAULT_INTRO_YEAR = 3068;

const enhancementOptions: Record<TechBranch, string[]> = {
  [TechBase.INNER_SPHERE]: ['None', 'MASC', 'Triple Strength Myomer'],
  [TechBase.CLAN]: ['None', 'MASC'],
};

const jumpJetOptions: Record<TechBranch, string[]> = {
  [TechBase.INNER_SPHERE]: ['Standard Jump Jet', 'Improved Jump Jet'],
  [TechBase.CLAN]: ['Standard Jump Jet', 'Improved Jump Jet'],
};

export interface FilteredComponentOptions {
  structure: string[];
  gyro: string[];
  engine: string[];
  heatSink: string[];
  enhancement: string[];
  armor: string[];
  jumpJet: string[];
}

export function getFilteredComponentOptions(
  techProgression: TechProgression,
  config?: Partial<UnitConfiguration>,
): FilteredComponentOptions {
  const mockConfig: Partial<UnitConfiguration> = {
    techBase: techProgression.chassis,
    techProgression,
    introductionYear: config?.introductionYear ?? DEFAULT_INTRO_YEAR,
    rulesLevel: config?.rulesLevel ?? 'Standard',
  };

  return {
    structure: getAvailableStructureTypes(mockConfig, techProgression.chassis).map((option) => option.type),
    gyro: getAvailableGyroTypes(mockConfig, techProgression.gyro).map((option) => option.type),
    engine: getAvailableEngineTypes(mockConfig, techProgression.engine).map((option) => option.type),
    heatSink: getAvailableHeatSinkTypes(mockConfig, techProgression.heatsink).map((option) => option.type),
    enhancement: enhancementOptions[techProgression.myomer],
    armor: getAvailableArmorTypes(mockConfig, techProgression.armor).map((option) => option.type),
    jumpJet: jumpJetOptions[techProgression.movement],
  };
}

export function validateComponentSelection(
  techProgression: TechProgression,
  currentSelections: {
    structureType?: string;
    gyroType?: string;
    engineType?: string;
    heatSinkType?: string;
    enhancements?: ComponentConfiguration[];
    armorType?: string;
    jumpJetType?: string;
  },
): {
  isValid: boolean;
  invalidSelections: string[];
  suggestedReplacements: Record<string, string | ComponentConfiguration[]>;
} {
  const filteredOptions = getFilteredComponentOptions(techProgression);
  const invalidSelections: string[] = [];
  const suggestedReplacements: Record<string, string | ComponentConfiguration[]> = {};

  if (currentSelections.structureType && !filteredOptions.structure.includes(currentSelections.structureType)) {
    invalidSelections.push('structure');
    suggestedReplacements.structureType = 'Standard';
  }

  if (currentSelections.gyroType && !filteredOptions.gyro.includes(currentSelections.gyroType)) {
    invalidSelections.push('gyro');
    suggestedReplacements.gyroType = 'Standard';
  }

  if (currentSelections.engineType && !filteredOptions.engine.includes(currentSelections.engineType)) {
    invalidSelections.push('engine');
    suggestedReplacements.engineType = 'Standard';
  }

  if (currentSelections.heatSinkType && !filteredOptions.heatSink.includes(currentSelections.heatSinkType)) {
    invalidSelections.push('heatSink');
    suggestedReplacements.heatSinkType = 'Single';
  }

  if (
    currentSelections.enhancements &&
    currentSelections.enhancements.length > 0 &&
    !filteredOptions.enhancement.includes(currentSelections.enhancements[0].type)
  ) {
    invalidSelections.push('enhancement');
    suggestedReplacements.enhancements = [];
  }

  if (currentSelections.armorType && !filteredOptions.armor.includes(currentSelections.armorType)) {
    invalidSelections.push('armor');
    suggestedReplacements.armorType = 'Standard';
  }

  if (currentSelections.jumpJetType && !filteredOptions.jumpJet.includes(currentSelections.jumpJetType)) {
    invalidSelections.push('jumpJet');
    suggestedReplacements.jumpJetType = 'Standard Jump Jet';
  }

  return {
    isValid: invalidSelections.length === 0,
    invalidSelections,
    suggestedReplacements,
  };
}

export function autoCorrectComponentSelections(
  techProgression: TechProgression,
  currentConfig: Record<string, any>,
): Record<string, any> {
  const validation = validateComponentSelection(techProgression, {
    structureType: currentConfig.structureType,
    gyroType: currentConfig.gyroType,
    engineType: currentConfig.engineType,
    heatSinkType: currentConfig.heatSinkType,
    enhancements: currentConfig.enhancements,
    armorType: currentConfig.armorType,
    jumpJetType: currentConfig.jumpJetType,
  });

  if (validation.isValid) {
    return currentConfig;
  }

  const corrected = { ...currentConfig };
  Object.entries(validation.suggestedReplacements).forEach(([key, value]) => {
    corrected[key] = value;
  });
  return corrected;
}

export function formatTechBaseForDisplay(
  optionName: string,
  techBase: TechBranch,
  componentType: string,
): string {
  if (componentType === 'heatSink' && optionName === 'Double' && techBase === TechBase.INNER_SPHERE) {
    return 'IS Double';
  }
  if (componentType === 'heatSink' && optionName === 'Double' && techBase === TechBase.CLAN) {
    return 'Clan Double';
  }
  return optionName;
}

