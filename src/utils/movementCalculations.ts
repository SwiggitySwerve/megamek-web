/**
 * Movement Calculations - Type definitions and implementations
 * Provides movement enhancement calculations for BattleTech units
 */

import { UnitConfiguration } from './criticalSlots/UnitCriticalManagerTypes';
import { ComponentConfiguration } from '../types';

/**
 * Movement enhancement interface
 */
export interface MovementEnhancement {
  readonly type: string;
  readonly name: string;
  readonly description: string;
  readonly walkModifier: number;
  readonly runModifier: number | 'multiplier' | 'recalculate';
  readonly jumpModifier: number;
  readonly priority: number;
  readonly condition?: string;
}

/**
 * Movement display result
 */
export interface MovementDisplay {
  readonly walkValue: number;
  readonly runValue: number;
  readonly jumpValue: number;
  readonly walkDisplay: string;
  readonly runDisplay: string;
  readonly jumpDisplay: string;
  readonly enhancementNotes: string[];
  readonly bracketedRun: number | null;
  readonly bracketedLabel: string | null;
}

/**
 * Movement enhancements database
 */
export const MOVEMENT_ENHANCEMENTS: Record<string, MovementEnhancement> = {
  'Supercharger': {
    type: 'Supercharger',
    name: 'Supercharger',
    description: 'Doubles run speed',
    walkModifier: 0,
    runModifier: 'multiplier',
    jumpModifier: 0,
    priority: 1
  },
  'MASC': {
    type: 'MASC',
    name: 'MASC',
    description: 'Doubles run speed',
    walkModifier: 0,
    runModifier: 'multiplier',
    jumpModifier: 0,
    priority: 2
  },
  'Triple Strength Myomer': {
    type: 'Triple Strength Myomer',
    name: 'Triple Strength Myomer',
    description: 'Increases walk and recalculates run',
    walkModifier: 2,
    runModifier: 'recalculate',
    jumpModifier: 0,
    priority: 3,
    condition: 'Heat 9+'
  }
};

/**
 * Get all available movement enhancement types
 */
export function getAvailableMovementEnhancements(): MovementEnhancement[] {
  return Object.values(MOVEMENT_ENHANCEMENTS);
}

/**
 * Calculate enhanced movement with proper display formatting
 */
export function calculateEnhancedMovement(config: UnitConfiguration): MovementDisplay {
  const baseWalkMP = config.walkMP;
  const baseRunMP = Math.floor(baseWalkMP * 1.5);
  const jumpMP = config.jumpMP || 0;

  // Get active enhancements
  const enhancements = config.enhancements || [];
  const activeEnhancements: MovementEnhancement[] = [];
  
  for (const enh of enhancements) {
    const enhancementType = typeof enh === 'string' ? enh : enh.type;
    const enhancement = MOVEMENT_ENHANCEMENTS[enhancementType];
    if (enhancement) {
      activeEnhancements.push(enhancement);
    }
  }
  
  activeEnhancements.sort((a, b) => a.priority - b.priority);

  // Apply enhancements
  let walkValue = baseWalkMP;
  let runValue = baseRunMP;
  let jumpValue = jumpMP;
  const enhancementNotes: string[] = [];
  let bracketedRun: number | null = null;
  let bracketedLabel: string | null = null;

  const hasSupercharger = activeEnhancements.some(e => e.type === 'Supercharger');
  const hasMASC = activeEnhancements.some(e => e.type === 'MASC');
  const hasBothRunEnhancements = hasSupercharger && hasMASC;

  for (const enhancement of activeEnhancements) {
    walkValue += enhancement.walkModifier;
    
    if (bracketedRun === null) {
      if (enhancement.runModifier === 'multiplier') {
        if (hasBothRunEnhancements) {
          const enhancedRun = Math.floor(walkValue * 2.5);
          bracketedRun = enhancedRun;
          runValue = enhancedRun;
          bracketedLabel = 'Supercharger+MASC';
        } else {
          const enhancedRun = walkValue * 2;
          bracketedRun = enhancedRun;
          runValue = enhancedRun;
          bracketedLabel = enhancement.name;
        }
      } else if (enhancement.runModifier === 'recalculate') {
        runValue = Math.ceil(walkValue * 1.5);
        bracketedRun = runValue;
        bracketedLabel = enhancement.name;
      } else if (typeof enhancement.runModifier === 'number') {
        runValue += enhancement.runModifier;
        bracketedRun = runValue;
        bracketedLabel = enhancement.name;
      }
    } else {
      if (enhancement.runModifier === 'recalculate') {
        runValue = Math.ceil(walkValue * 1.5);
      } else if (typeof enhancement.runModifier === 'number') {
        runValue += enhancement.runModifier;
      }
    }
    
    jumpValue += enhancement.jumpModifier;
    
    if (enhancement.walkModifier > 0) {
      enhancementNotes.push(`${enhancement.name}+${enhancement.walkModifier}`);
    }
  }

  return {
    walkValue,
    runValue,
    jumpValue,
    walkDisplay: walkValue.toString(),
    runDisplay: bracketedRun !== null && bracketedRun !== baseRunMP 
      ? `${baseRunMP} [${bracketedRun}]` 
      : runValue.toString(),
    jumpDisplay: jumpValue.toString(),
    enhancementNotes,
    bracketedRun,
    bracketedLabel
  };
}

/**
 * Format engine movement info (stub - implement as needed)
 */
export function formatEngineMovementInfo(config: UnitConfiguration, tonnage: number): string {
  return `${config.walkMP}/${Math.floor(config.walkMP * 1.5)}`;
}

/**
 * Format condensed movement (stub - implement as needed)
 */
export function formatCondensedMovement(config: UnitConfiguration, tonnage: number): string {
  return `${config.walkMP}/${Math.floor(config.walkMP * 1.5)}`;
}

