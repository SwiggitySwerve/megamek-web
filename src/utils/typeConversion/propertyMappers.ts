/**
 * Property Mapping Utilities
 * 
 * Provides bidirectional mapping between API format (snake_case) and
 * internal format (camelCase) for property names.
 * 
 * This ensures consistent property naming throughout the codebase while
 * maintaining compatibility with external APIs that use snake_case.
 */

/**
 * Maps snake_case API properties to camelCase internal properties
 */
export const API_TO_INTERNAL_PROPERTY_MAP: Record<string, string> = {
  // Top-level unit properties
  'tech_base': 'techBase',
  'rules_level': 'rulesLevel',
  'armor_allocation': 'armorAllocation',
  'equipment_placements': 'equipmentPlacements',
  'critical_slots': 'criticalSlots',
  'mul_id': 'mulId',
  'source_era': 'sourceEra',
  'base_type': 'baseType',
  'manual_bv': 'manualBv',
  'clan_name': 'clanName',
  
  // Movement properties
  'walk_mp': 'walkMp',
  'jump_mp': 'jumpMp',
  'cruise_mp': 'cruiseMp',
  'flank_mp': 'flankMp',
  'run_mp': 'runMp',
  'thrust_mp': 'thrustMp',
  'safe_thrust_mp': 'safeThrustMp',
  'dive_mp': 'diveMp',
  'jump_type': 'jumpType',
  'mech_jump_booster_mp': 'mechJumpBoosterMp',
  
  // Armor properties
  'armor_points': 'armorPoints',
  'rear_armor_points': 'rearArmorPoints',
  'armor_tech_base': 'armorTechBase',
  
  // Equipment properties
  'item_name': 'itemName',
  'item_type': 'itemType',
  'tech_base': 'techBase',
  'is_omnipod': 'isOmnipod',
  'rear_facing': 'rearFacing',
  'turret_mounted': 'turretMounted',
  'ammo_per_shot': 'ammoPerShot',
  'related_ammo': 'relatedAmmo',
  'ammo_per_ton': 'ammoPerTon',
  'weapon_class': 'weaponClass',
  'weapons_and_equipment': 'weaponsAndEquipment',
  
  // System component properties
  'gyro_type': 'gyroType',
  'heat_sinks': 'heatSinks',
  'dissipation_per_sink': 'dissipationPerSink',
  
  // Structure properties
  'is_omnimech': 'isOmnimech',
  'omnimech_base_chassis': 'omnimechBaseChassis',
  'omnimech_configuration': 'omnimechConfiguration',
  'config_LAM': 'configLam',
  'landing_gear': 'landingGear',
  
  // Fluff properties
  'fluff_text': 'fluffText',
  
  // Equipment data properties
  'battle_value': 'battleValue',
  'battlevalue': 'battleValue', // alias
  'weapon_type': 'weaponType',
  'tech_rating': 'techRating',
  'source_book': 'sourceBook',
  'cost_cbills': 'costCbills',
  'introduction_year': 'introductionYear',
  'extinction_year': 'extinctionYear',
  'book_reference': 'bookReference',
  
  // Critical slot properties
  'isFixed': 'isFixed', // Already camelCase, keep as is
  'isConditionallyRemovable': 'isConditionallyRemovable',
  'isManuallyPlaced': 'isManuallyPlaced',
  'equipmentId': 'equipmentId',
  'linkedSlots': 'linkedSlots',
  
  // Validation/error properties
  'tech_base_mismatch': 'techBaseMismatch',
  'era_violation': 'eraViolation',
  'availability_violation': 'availabilityViolation',
  'mixed_tech_violation': 'mixedTechViolation',
  'tech_base_change': 'techBaseChange',
  'era_adjustment': 'eraAdjustment',
  'component_replacement': 'componentReplacement',
  'mixed_tech_optimization': 'mixedTechOptimization',
  'rules_level_change': 'rulesLevelChange',
} as const;

/**
 * Maps camelCase internal properties to snake_case API properties
 * (Reverse of API_TO_INTERNAL_PROPERTY_MAP)
 */
export const INTERNAL_TO_API_PROPERTY_MAP: Record<string, string> = 
  Object.fromEntries(
    Object.entries(API_TO_INTERNAL_PROPERTY_MAP).map(([api, internal]) => [internal, api])
  ) as Record<string, string>;

/**
 * Converts an object from API format (snake_case) to internal format (camelCase)
 * 
 * @param apiObject - Object with snake_case properties
 * @param deep - Whether to recursively convert nested objects (default: true)
 * @returns Object with camelCase properties
 */
export function convertApiToInternal<T = any>(
  apiObject: any,
  deep: boolean = true
): T {
  if (!apiObject || typeof apiObject !== 'object') {
    return apiObject as T;
  }
  
  // Handle arrays
  if (Array.isArray(apiObject)) {
    return apiObject.map(item => 
      deep ? convertApiToInternal(item, deep) : item
    ) as T;
  }
  
  const result: any = {};
  
  for (const [apiKey, value] of Object.entries(apiObject)) {
    const internalKey = API_TO_INTERNAL_PROPERTY_MAP[apiKey] ?? apiKey;
    
    if (deep && value !== null && typeof value === 'object' && !Array.isArray(value)) {
      result[internalKey] = convertApiToInternal(value, deep);
    } else if (deep && Array.isArray(value)) {
      result[internalKey] = value.map(item => 
        typeof item === 'object' && item !== null
          ? convertApiToInternal(item, deep)
          : item
      );
    } else {
      result[internalKey] = value;
    }
  }
  
  return result as T;
}

/**
 * Converts an object from internal format (camelCase) to API format (snake_case)
 * 
 * @param internalObject - Object with camelCase properties
 * @param deep - Whether to recursively convert nested objects (default: true)
 * @returns Object with snake_case properties
 */
export function convertInternalToApi<T = any>(
  internalObject: any,
  deep: boolean = true
): T {
  if (!internalObject || typeof internalObject !== 'object') {
    return internalObject as T;
  }
  
  // Handle arrays
  if (Array.isArray(internalObject)) {
    return internalObject.map(item => 
      deep ? convertInternalToApi(item, deep) : item
    ) as T;
  }
  
  const result: any = {};
  
  for (const [internalKey, value] of Object.entries(internalObject)) {
    const apiKey = INTERNAL_TO_API_PROPERTY_MAP[internalKey] ?? internalKey;
    
    if (deep && value !== null && typeof value === 'object' && !Array.isArray(value)) {
      result[apiKey] = convertInternalToApi(value, deep);
    } else if (deep && Array.isArray(value)) {
      result[apiKey] = value.map(item => 
        typeof item === 'object' && item !== null
          ? convertInternalToApi(item, deep)
          : item
      );
    } else {
      result[apiKey] = value;
    }
  }
  
  return result as T;
}

/**
 * Converts a single property name from API format to internal format
 * 
 * @param apiPropertyName - Property name in snake_case
 * @returns Property name in camelCase
 */
export function mapApiPropertyToInternal(apiPropertyName: string): string {
  return API_TO_INTERNAL_PROPERTY_MAP[apiPropertyName] ?? apiPropertyName;
}

/**
 * Converts a single property name from internal format to API format
 * 
 * @param internalPropertyName - Property name in camelCase
 * @returns Property name in snake_case
 */
export function mapInternalPropertyToApi(internalPropertyName: string): string {
  return INTERNAL_TO_API_PROPERTY_MAP[internalPropertyName] ?? internalPropertyName;
}

/**
 * Checks if a property name is in API format (snake_case)
 * 
 * @param propertyName - Property name to check
 * @returns True if the property is in snake_case format
 */
export function isApiPropertyFormat(propertyName: string): boolean {
  return propertyName.includes('_') && API_TO_INTERNAL_PROPERTY_MAP.hasOwnProperty(propertyName);
}

/**
 * Checks if a property name is in internal format (camelCase)
 * 
 * @param propertyName - Property name to check
 * @returns True if the property is in camelCase format
 */
export function isInternalPropertyFormat(propertyName: string): boolean {
  return /^[a-z][a-zA-Z0-9]*$/.test(propertyName) && 
         !propertyName.includes('_') &&
         INTERNAL_TO_API_PROPERTY_MAP.hasOwnProperty(propertyName);
}
