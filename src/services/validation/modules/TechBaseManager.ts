/**
 * Tech Base Management Module
 * 
 * Handles tech base compatibility, validation, and conflict resolution.
 * Extracted from TechLevelRulesValidator.ts for better modularity and testability.
 */

import {
  TechBaseCompliance,
  ComponentTechBase,
  TechBaseConflict,
  CompatibilityMatrix,
  ComponentInfo,
  TechLevelValidationContext
} from '../types/TechLevelTypes';
import { UnitConfiguration } from '../../../utils/criticalSlots/UnitCriticalManagerTypes';
import { TechBase, TechBaseFilter } from '@/types';

export class TechBaseManager {
  // Tech base compatibility matrix
  private static readonly TECH_COMPATIBILITY: CompatibilityMatrix = {
    [TechBase.INNER_SPHERE]: {
      compatible: [TechBase.INNER_SPHERE, 'Star League'],
      restricted: [TechBase.CLAN],
      forbidden: ['Alien', 'Prototype']
    },
    [TechBase.CLAN]: {
      compatible: [TechBase.CLAN, 'Star League'],
      restricted: [TechBase.INNER_SPHERE],
      forbidden: ['Alien', 'Prototype']
    },
    [TechBaseFilter.MIXED]: {
      compatible: [TechBase.INNER_SPHERE, TechBase.CLAN, 'Star League', TechBaseFilter.MIXED],
      restricted: [],
      forbidden: ['Alien']
    },
    'Star League': {
      compatible: [TechBase.INNER_SPHERE, TechBase.CLAN, 'Star League'],
      restricted: [],
      forbidden: ['Alien', 'Prototype']
    }
  };

  /**
   * Validate tech base compliance for all components
   */
  static validateTechBaseCompliance(
    config: UnitConfiguration, 
    components: ComponentInfo[],
    context: TechLevelValidationContext
  ): TechBaseCompliance {
    const unitTechBase = (config.techBase || TechBaseFilter.INNER_SPHERE) as TechBaseFilter;
    const componentTechBases: ComponentTechBase[] = [];
    const conflicts: TechBaseConflict[] = [];
    
    for (const component of components) {
      const componentTechBase = component.techBase || TechBase.INNER_SPHERE;
      const isCompliant = this.isTechBaseCompatible(unitTechBase, componentTechBase, context);
      
      componentTechBases.push({
        component: component.name,
        techBase: componentTechBase,
        category: component.category || 'equipment',
        isCompliant,
        notes: isCompliant ? 'Compatible' : 'Tech base conflict'
      });
      
      if (!isCompliant) {
        conflicts.push({
          component: component.name,
          unitTechBase,
          componentTechBase,
          conflictType: this.getConflictType(unitTechBase, componentTechBase),
          resolution: this.getConflictResolution(unitTechBase, componentTechBase),
          severity: this.getConflictSeverity(unitTechBase, componentTechBase)
        });
      }
    }
    
    const complianceScore = this.calculateComplianceScore(componentTechBases);
    
    return {
      isValid: conflicts.length === 0,
      unitTechBase,
      componentTechBases,
      conflicts,
      complianceScore
    };
  }

  /**
   * Get the tech compatibility matrix
   */
  static getTechCompatibility(): CompatibilityMatrix {
    return { ...this.TECH_COMPATIBILITY };
  }

  /**
   * Check if a component tech base is compatible with unit tech base
   */
  static isTechBaseCompatible(unitTechBase: string, componentTechBase: string, context: TechLevelValidationContext): boolean {
    if (componentTechBase === 'Both' || componentTechBase === 'Mixed') {
      return true;
    }
    if (unitTechBase === TechBaseFilter.MIXED || context.allowMixedTech) {
      return true; // Mixed tech allows everything
    }
    
    const compatibility = this.TECH_COMPATIBILITY[unitTechBase];
    if (!compatibility) return false;
    
    return compatibility.compatible.includes(componentTechBase) && 
           !compatibility.forbidden.includes(componentTechBase);
  }

  /**
   * Get the type of conflict between tech bases
   */
  static getConflictType(unitTechBase: string, componentTechBase: string): 'incompatible' | 'restricted' | 'requires_mixed' {
    const compatibility = this.TECH_COMPATIBILITY[unitTechBase];
    if (!compatibility) return 'incompatible';
    
    if (compatibility.forbidden.includes(componentTechBase)) {
      return 'incompatible';
    }
    
    if (compatibility.restricted.includes(componentTechBase)) {
      return 'requires_mixed';
    }
    
    return 'restricted';
  }

  /**
   * Get suggested resolution for a tech base conflict
   */
  static getConflictResolution(unitTechBase: string, componentTechBase: string): string {
    if (unitTechBase === TechBaseFilter.INNER_SPHERE && componentTechBase === TechBase.CLAN) {
      return 'Replace with Inner Sphere equivalent or enable mixed tech';
    }
    
    if (unitTechBase === TechBaseFilter.CLAN && componentTechBase === TechBase.INNER_SPHERE) {
      return 'Replace with Clan equivalent or enable mixed tech';
    }
    
    return `Select compatible component for ${unitTechBase} tech base`;
  }

  /**
   * Get severity of a tech base conflict
   */
  static getConflictSeverity(unitTechBase: string, componentTechBase: string): 'critical' | 'major' | 'minor' {
    const compatibility = this.TECH_COMPATIBILITY[unitTechBase];
    if (!compatibility) return 'critical';
    
    if (compatibility.forbidden.includes(componentTechBase)) {
      return 'critical';
    }
    
    if (compatibility.restricted.includes(componentTechBase)) {
      return 'major';
    }
    
    return 'minor';
  }

  /**
   * Calculate compliance score (0-100)
   */
  static calculateComplianceScore(componentTechBases: ComponentTechBase[]): number {
    if (componentTechBases.length === 0) return 100;
    
    const compliantComponents = componentTechBases.filter(ctb => ctb.isCompliant).length;
    return Math.round((compliantComponents / componentTechBases.length) * 100);
  }

  /**
   * Get restricted tech base combinations
   */
  static getRestrictedCombinations(): string[] {
    return [
      'Clan weapons with Inner Sphere targeting computers',
      'Inner Sphere ammunition with Clan weapons',
      'Mixed heat sink types',
      'Clan XL engines with Inner Sphere components'
    ];
  }

  /**
   * Check for restricted tech base combinations
   */
  static checkRestrictedCombinations(components: ComponentInfo[]): string[] {
    const violations: string[] = [];
    
    // Check for common incompatible combinations
    const clanWeapons = components.filter(c => c.category === 'weapon' && c.techBase === TechBase.CLAN);
    const isTargetingComputer = components.some(c => c.name.toLowerCase().includes('targeting computer') && c.techBase === TechBase.INNER_SPHERE);
    
    if (clanWeapons.length > 0 && isTargetingComputer) {
      violations.push('Clan weapons with Inner Sphere targeting computer detected');
    }
    
    return violations;
  }

  /**
   * Get available tech bases
   */
  static getAvailableTechBases(): string[] {
    return Object.keys(this.TECH_COMPATIBILITY);
  }

  /**
   * Validate if tech base is supported
   */
  static isValidTechBase(techBase: string): boolean {
    return this.getAvailableTechBases().includes(techBase);
  }
}




