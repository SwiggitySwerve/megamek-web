/**
 * Unit API Adapter
 * 
 * Provides conversion between API format (FullUnit with snake_case) and
 * internal format (ICompleteUnitConfiguration with camelCase).
 * 
 * This adapter layer ensures that:
 * - API boundaries use snake_case (for external compatibility)
 * - Internal code uses camelCase (for consistency)
 * - Conversions are type-safe and validated
 */

import { FullUnit } from '../../../types';
import { ICompleteUnitConfiguration, TechBase, RulesLevel } from '../../../types/core/UnitInterfaces';
import { convertApiToInternal, convertInternalToApi } from '../propertyMappers';
import { 
  stringToTechBaseWithDefault, 
  stringToRulesLevelWithDefault,
  techBaseToString,
  rulesLevelToString 
} from '../enumConverters';
import { validateFullUnit } from '../validators';

/**
 * Interface for unit API adapter
 */
export interface IUnitApiAdapter {
  /**
   * Convert API response (snake_case) to internal format (camelCase)
   * 
   * @param apiUnit - FullUnit from API
   * @returns ICompleteUnitConfiguration for internal use
   */
  fromApiResponse(apiUnit: FullUnit): ICompleteUnitConfiguration;
  
  /**
   * Convert internal format (camelCase) to API request format (snake_case)
   * 
   * @param unit - ICompleteUnitConfiguration from internal code
   * @returns FullUnit for API
   */
  toApiRequest(unit: ICompleteUnitConfiguration): FullUnit;
  
  /**
   * Validate API response before conversion
   * 
   * @param apiUnit - FullUnit to validate
   * @returns Validation result
   */
  validateApiResponse(apiUnit: FullUnit): { isValid: boolean; errors: string[]; warnings: string[] };
}

/**
 * Unit API Adapter implementation
 */
export class UnitApiAdapter implements IUnitApiAdapter {
  /**
   * Convert API response to internal format
   */
  fromApiResponse(apiUnit: FullUnit): ICompleteUnitConfiguration {
    // Validate first
    const validation = this.validateApiResponse(apiUnit);
    if (!validation.isValid) {
      throw new Error(`Invalid API response: ${validation.errors.join(', ')}`);
    }
    
    // Convert tech_base and rules_level using enum converters
    const techBase = stringToTechBaseWithDefault(
      apiUnit.tech_base || apiUnit.data?.tech_base,
      TechBase.INNER_SPHERE
    );
    
    const rulesLevel = stringToRulesLevelWithDefault(
      apiUnit.rules_level || apiUnit.data?.rules_level,
      RulesLevel.STANDARD
    );
    
    // Convert property names from snake_case to camelCase
    const convertedData = convertApiToInternal(apiUnit.data || {});
    
    // Build the internal configuration
    // Note: This is a simplified conversion - full implementation would
    // need to handle all the complex nested structures
    const config: Partial<ICompleteUnitConfiguration> = {
      id: apiUnit.id,
      name: `${apiUnit.chassis} ${apiUnit.model}`,
      chassis: apiUnit.chassis,
      model: apiUnit.model,
      techBase,
      rulesLevel,
      era: apiUnit.era || apiUnit.data?.era || 'Unknown',
      tonnage: apiUnit.mass || apiUnit.data?.mass || 50,
      
      // These would need full conversion logic based on the actual structure
      // For now, we're providing a basic structure
      structure: this.convertStructure(convertedData),
      engine: this.convertEngine(convertedData),
      gyro: this.convertGyro(convertedData),
      cockpit: this.convertCockpit(convertedData),
      armor: this.convertArmor(convertedData),
      heatSinks: this.convertHeatSinks(convertedData),
      jumpJets: this.convertJumpJets(convertedData),
      equipment: this.convertEquipment(convertedData),
      fixedAllocations: [],
      groups: [],
      metadata: {
        source: apiUnit.source || 'Unknown',
        mulId: apiUnit.mul_id,
        role: apiUnit.role || convertedData.role,
      },
    };
    
    return config as ICompleteUnitConfiguration;
  }
  
  /**
   * Convert internal format to API request format
   */
  toApiRequest(unit: ICompleteUnitConfiguration): FullUnit {
    // Convert property names from camelCase to snake_case
    const apiData = convertInternalToApi({
      chassis: unit.chassis,
      model: unit.model,
      tech_base: techBaseToString(unit.techBase),
      rules_level: rulesLevelToString(unit.rulesLevel),
      era: unit.era,
      mass: unit.tonnage,
      // Add other converted fields
      structure: this.convertStructureToApi(unit.structure),
      engine: this.convertEngineToApi(unit.engine),
      gyro: this.convertGyroToApi(unit.gyro),
      cockpit: this.convertCockpitToApi(unit.cockpit),
      armor: this.convertArmorToApi(unit.armor),
      heat_sinks: this.convertHeatSinksToApi(unit.heatSinks),
      jumpJets: this.convertJumpJetsToApi(unit.jumpJets),
      weapons_and_equipment: this.convertEquipmentToApi(unit.equipment),
    });
    
    return {
      id: unit.id,
      chassis: unit.chassis,
      model: unit.model,
      mass: unit.tonnage,
      era: unit.era,
      tech_base: techBaseToString(unit.techBase),
      rules_level: rulesLevelToString(unit.rulesLevel),
      source: unit.metadata.source,
      mul_id: unit.metadata.mulId,
      role: unit.metadata.role,
      data: apiData,
    };
  }
  
  /**
   * Validate API response
   */
  validateApiResponse(apiUnit: FullUnit): { isValid: boolean; errors: string[]; warnings: string[] } {
    return validateFullUnit(apiUnit);
  }
  
  // Helper methods for converting nested structures
  // These are simplified - full implementation would handle all cases
  
  private convertStructure(data: any): any {
    // Placeholder - would need full structure conversion logic
    return data.structure || {};
  }
  
  private convertEngine(data: any): any {
    // Placeholder - would need full engine conversion logic
    return data.engine || {};
  }
  
  private convertGyro(data: any): any {
    // Placeholder - would need full gyro conversion logic
    return data.gyro || {};
  }
  
  private convertCockpit(data: any): any {
    // Placeholder - would need full cockpit conversion logic
    return data.cockpit || {};
  }
  
  private convertArmor(data: any): any {
    // Placeholder - would need full armor conversion logic
    return data.armor || {};
  }
  
  private convertHeatSinks(data: any): any {
    // Placeholder - would need full heat sink conversion logic
    return data.heatSinks || {};
  }
  
  private convertJumpJets(data: any): any {
    // Placeholder - would need full jump jet conversion logic
    return data.jumpJets || {};
  }
  
  private convertEquipment(data: any): any[] {
    // Placeholder - would need full equipment conversion logic
    return data.weaponsAndEquipment || data.weapons_and_equipment || [];
  }
  
  // Reverse conversion methods
  
  private convertStructureToApi(structure: any): any {
    return convertInternalToApi(structure);
  }
  
  private convertEngineToApi(engine: any): any {
    return convertInternalToApi(engine);
  }
  
  private convertGyroToApi(gyro: any): any {
    return convertInternalToApi(gyro);
  }
  
  private convertCockpitToApi(cockpit: any): any {
    return convertInternalToApi(cockpit);
  }
  
  private convertArmorToApi(armor: any): any {
    return convertInternalToApi(armor);
  }
  
  private convertHeatSinksToApi(heatSinks: any): any {
    return convertInternalToApi(heatSinks);
  }
  
  private convertJumpJetsToApi(jumpJets: any): any {
    return convertInternalToApi(jumpJets);
  }
  
  private convertEquipmentToApi(equipment: any[]): any[] {
    return equipment.map(item => convertInternalToApi(item));
  }
}

/**
 * Default adapter instance
 */
export const unitApiAdapter = new UnitApiAdapter();
