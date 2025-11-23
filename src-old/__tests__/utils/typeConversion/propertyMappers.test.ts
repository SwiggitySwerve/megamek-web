/**
 * Property Mappers Tests
 * 
 * Tests for property name conversion between API format (snake_case)
 * and internal format (camelCase).
 */

import {
  convertApiToInternal,
  convertInternalToApi,
  mapApiPropertyToInternal,
  mapInternalPropertyToApi,
  isApiPropertyFormat,
  isInternalPropertyFormat,
} from '../../../utils/typeConversion/propertyMappers';

describe('Property Mappers', () => {
  describe('convertApiToInternal', () => {
    it('should convert top-level snake_case properties to camelCase', () => {
      const apiObject = {
        tech_base: 'Inner Sphere',
        rules_level: 'Standard',
        mul_id: '12345',
      };
      
      const result = convertApiToInternal(apiObject);
      
      expect(result).toEqual({
        techBase: 'Inner Sphere',
        rulesLevel: 'Standard',
        mulId: '12345',
      });
    });
    
    it('should convert nested objects', () => {
      const apiObject = {
        movement: {
          walk_mp: 4,
          jump_mp: 3,
          jump_type: 'Jump Jet',
        },
        armor: {
          armor_points: 10,
          rear_armor_points: 5,
        },
      };
      
      const result = convertApiToInternal(apiObject);
      
      expect(result).toEqual({
        movement: {
          walkMp: 4,
          jumpMp: 3,
          jumpType: 'Jump Jet',
        },
        armor: {
          armorPoints: 10,
          rearArmorPoints: 5,
        },
      });
    });
    
    it('should convert arrays of objects', () => {
      const apiObject = {
        weapons_and_equipment: [
          {
            item_name: 'Medium Laser',
            item_type: 'weapon',
            tech_base: 'IS',
          },
          {
            item_name: 'SRM 6',
            item_type: 'weapon',
            tech_base: 'Clan',
          },
        ],
      };
      
      const result = convertApiToInternal(apiObject);
      
      expect(result).toEqual({
        weaponsAndEquipment: [
          {
            itemName: 'Medium Laser',
            itemType: 'weapon',
            techBase: 'IS',
          },
          {
            itemName: 'SRM 6',
            itemType: 'weapon',
            techBase: 'Clan',
          },
        ],
      });
    });
    
    it('should preserve unmapped properties', () => {
      const apiObject = {
        tech_base: 'Inner Sphere',
        customField: 'value',
        another_custom_field: 'value2',
      };
      
      const result = convertApiToInternal(apiObject);
      
      expect(result).toEqual({
        techBase: 'Inner Sphere',
        customField: 'value',
        another_custom_field: 'value2', // Not in map, preserved as-is
      });
    });
    
    it('should handle null and undefined', () => {
      expect(convertApiToInternal(null)).toBeNull();
      expect(convertApiToInternal(undefined)).toBeUndefined();
    });
    
    it('should handle arrays of primitives', () => {
      const apiObject = {
        tags: ['tag1', 'tag2', 'tag3'],
      };
      
      const result = convertApiToInternal(apiObject);
      
      expect(result).toEqual({
        tags: ['tag1', 'tag2', 'tag3'],
      });
    });
  });
  
  describe('convertInternalToApi', () => {
    it('should convert top-level camelCase properties to snake_case', () => {
      const internalObject = {
        techBase: 'Inner Sphere',
        rulesLevel: 'Standard',
        mulId: '12345',
      };
      
      const result = convertInternalToApi(internalObject);
      
      expect(result).toEqual({
        tech_base: 'Inner Sphere',
        rules_level: 'Standard',
        mul_id: '12345',
      });
    });
    
    it('should convert nested objects', () => {
      const internalObject = {
        movement: {
          walkMp: 4,
          jumpMp: 3,
          jumpType: 'Jump Jet',
        },
        armor: {
          armorPoints: 10,
          rearArmorPoints: 5,
        },
      };
      
      const result = convertInternalToApi(internalObject);
      
      expect(result).toEqual({
        movement: {
          walk_mp: 4,
          jump_mp: 3,
          jump_type: 'Jump Jet',
        },
        armor: {
          armor_points: 10,
          rear_armor_points: 5,
        },
      });
    });
    
    it('should convert arrays of objects', () => {
      const internalObject = {
        weaponsAndEquipment: [
          {
            itemName: 'Medium Laser',
            itemType: 'weapon',
            techBase: 'IS',
          },
          {
            itemName: 'SRM 6',
            itemType: 'weapon',
            techBase: 'Clan',
          },
        ],
      };
      
      const result = convertInternalToApi(internalObject);
      
      expect(result).toEqual({
        weapons_and_equipment: [
          {
            item_name: 'Medium Laser',
            item_type: 'weapon',
            tech_base: 'IS',
          },
          {
            item_name: 'SRM 6',
            item_type: 'weapon',
            tech_base: 'Clan',
          },
        ],
      });
    });
    
    it('should preserve unmapped properties', () => {
      const internalObject = {
        techBase: 'Inner Sphere',
        customField: 'value',
        anotherCustomField: 'value2',
      };
      
      const result = convertInternalToApi(internalObject);
      
      expect(result).toEqual({
        tech_base: 'Inner Sphere',
        customField: 'value', // Not in map, preserved as-is
        anotherCustomField: 'value2', // Not in map, preserved as-is
      });
    });
  });
  
  describe('mapApiPropertyToInternal', () => {
    it('should map known API properties', () => {
      expect(mapApiPropertyToInternal('tech_base')).toBe('techBase');
      expect(mapApiPropertyToInternal('rules_level')).toBe('rulesLevel');
      expect(mapApiPropertyToInternal('walk_mp')).toBe('walkMp');
    });
    
    it('should return original property if not mapped', () => {
      expect(mapApiPropertyToInternal('unknownProperty')).toBe('unknownProperty');
      expect(mapApiPropertyToInternal('custom_field')).toBe('custom_field');
    });
  });
  
  describe('mapInternalPropertyToApi', () => {
    it('should map known internal properties', () => {
      expect(mapInternalPropertyToApi('techBase')).toBe('tech_base');
      expect(mapInternalPropertyToApi('rulesLevel')).toBe('rules_level');
      expect(mapInternalPropertyToApi('walkMp')).toBe('walk_mp');
    });
    
    it('should return original property if not mapped', () => {
      expect(mapInternalPropertyToApi('unknownProperty')).toBe('unknownProperty');
      expect(mapInternalPropertyToApi('customField')).toBe('customField');
    });
  });
  
  describe('isApiPropertyFormat', () => {
    it('should identify API format properties', () => {
      expect(isApiPropertyFormat('tech_base')).toBe(true);
      expect(isApiPropertyFormat('rules_level')).toBe(true);
      expect(isApiPropertyFormat('walk_mp')).toBe(true);
    });
    
    it('should reject non-API format properties', () => {
      expect(isApiPropertyFormat('techBase')).toBe(false);
      expect(isApiPropertyFormat('unknown_property')).toBe(false);
      expect(isApiPropertyFormat('customField')).toBe(false);
    });
  });
  
  describe('isInternalPropertyFormat', () => {
    it('should identify internal format properties', () => {
      expect(isInternalPropertyFormat('techBase')).toBe(true);
      expect(isInternalPropertyFormat('rulesLevel')).toBe(true);
      expect(isInternalPropertyFormat('walkMp')).toBe(true);
    });
    
    it('should reject non-internal format properties', () => {
      expect(isInternalPropertyFormat('tech_base')).toBe(false);
      expect(isInternalPropertyFormat('unknownProperty')).toBe(false);
      expect(isInternalPropertyFormat('custom_field')).toBe(false);
    });
  });
  
  describe('Round-trip conversion', () => {
    it('should convert API to internal and back to API', () => {
      const apiObject = {
        tech_base: 'Inner Sphere',
        rules_level: 'Standard',
        movement: {
          walk_mp: 4,
          jump_mp: 3,
        },
        weapons_and_equipment: [
          {
            item_name: 'Medium Laser',
            tech_base: 'IS',
          },
        ],
      };
      
      const internal = convertApiToInternal(apiObject);
      const backToApi = convertInternalToApi(internal);
      
      expect(backToApi).toEqual(apiObject);
    });
    
    it('should convert internal to API and back to internal', () => {
      const internalObject = {
        techBase: 'Inner Sphere',
        rulesLevel: 'Standard',
        movement: {
          walkMp: 4,
          jumpMp: 3,
        },
        weaponsAndEquipment: [
          {
            itemName: 'Medium Laser',
            techBase: 'IS',
          },
        ],
      };
      
      const api = convertInternalToApi(internalObject);
      const backToInternal = convertApiToInternal(api);
      
      expect(backToInternal).toEqual(internalObject);
    });
  });
});
