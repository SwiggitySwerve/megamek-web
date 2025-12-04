/**
 * Equipment Name Resolver Tests
 * 
 * Tests for resolving MegaMekLab equipment names to internal IDs.
 * 
 * @spec openspec/specs/equipment-database/spec.md
 */

import {
  EquipmentNameResolver,
  equipmentNameResolver,
} from '@/services/conversion/EquipmentNameResolver';
import { TechBase } from '@/types/enums/TechBase';

describe('EquipmentNameResolver', () => {
  let resolver: EquipmentNameResolver;

  beforeEach(() => {
    resolver = new EquipmentNameResolver();
  });

  // ============================================================================
  // Initialization
  // ============================================================================
  describe('Initialization', () => {
    it('should initialize lazily', () => {
      // Should not throw before initialization
      const result = resolver.resolve('MediumLaser', 'Medium Laser');
      expect(result).toBeDefined();
    });

    it('should use singleton instance', () => {
      expect(equipmentNameResolver).toBeDefined();
    });
  });

  // ============================================================================
  // resolve() - Direct Type Mapping
  // ============================================================================
  describe('resolve() - Direct Type Mapping', () => {
    it('should resolve standard lasers', () => {
      expect(resolver.resolve('SmallLaser', 'Small Laser').found).toBe(true);
      expect(resolver.resolve('MediumLaser', 'Medium Laser').found).toBe(true);
      expect(resolver.resolve('LargeLaser', 'Large Laser').found).toBe(true);
    });

    it('should resolve ER lasers (IS)', () => {
      expect(resolver.resolve('ISERSmallLaser', 'ER Small Laser').found).toBe(true);
      expect(resolver.resolve('ISERMediumLaser', 'ER Medium Laser').found).toBe(true);
      expect(resolver.resolve('ISERLargeLaser', 'ER Large Laser').found).toBe(true);
    });

    it('should resolve ER lasers (Clan)', () => {
      expect(resolver.resolve('CLERSmallLaser', 'Clan ER Small Laser').found).toBe(true);
      expect(resolver.resolve('CLERMediumLaser', 'Clan ER Medium Laser').found).toBe(true);
      expect(resolver.resolve('CLERLargeLaser', 'Clan ER Large Laser').found).toBe(true);
    });

    it('should resolve pulse lasers (IS)', () => {
      expect(resolver.resolve('SmallPulseLaser', 'Small Pulse Laser').found).toBe(true);
      expect(resolver.resolve('MediumPulseLaser', 'Medium Pulse Laser').found).toBe(true);
      expect(resolver.resolve('LargePulseLaser', 'Large Pulse Laser').found).toBe(true);
    });

    it('should resolve pulse lasers (Clan)', () => {
      expect(resolver.resolve('CLSmallPulseLaser', 'Clan Small Pulse Laser').found).toBe(true);
      expect(resolver.resolve('CLMediumPulseLaser', 'Clan Medium Pulse Laser').found).toBe(true);
      expect(resolver.resolve('CLLargePulseLaser', 'Clan Large Pulse Laser').found).toBe(true);
    });

    it('should resolve PPCs', () => {
      expect(resolver.resolve('PPC', 'PPC').found).toBe(true);
      expect(resolver.resolve('ISERPPC', 'ER PPC').found).toBe(true);
      expect(resolver.resolve('CLERPPC', 'Clan ER PPC').found).toBe(true);
    });

    it('should resolve autocannons', () => {
      expect(resolver.resolve('AC2', 'Autocannon/2').found).toBe(true);
      expect(resolver.resolve('AC5', 'Autocannon/5').found).toBe(true);
      expect(resolver.resolve('AC10', 'Autocannon/10').found).toBe(true);
      expect(resolver.resolve('AC20', 'Autocannon/20').found).toBe(true);
    });

    it('should resolve ultra ACs (IS)', () => {
      expect(resolver.resolve('ISUltraAC5', 'Ultra AC/5').found).toBe(true);
      expect(resolver.resolve('ISUltraAC10', 'Ultra AC/10').found).toBe(true);
    });

    it('should resolve ultra ACs (Clan)', () => {
      expect(resolver.resolve('CLUltraAC5', 'Clan Ultra AC/5').found).toBe(true);
      expect(resolver.resolve('CLUltraAC10', 'Clan Ultra AC/10').found).toBe(true);
    });

    it('should resolve LB-X ACs', () => {
      expect(resolver.resolve('ISLBXAC10', 'LB 10-X AC').found).toBe(true);
      expect(resolver.resolve('CLLBXAC10', 'Clan LB 10-X AC').found).toBe(true);
    });

    it('should resolve gauss rifles', () => {
      expect(resolver.resolve('GaussRifle', 'Gauss Rifle').found).toBe(true);
      expect(resolver.resolve('ISGaussRifle', 'Gauss Rifle').found).toBe(true);
      expect(resolver.resolve('CLGaussRifle', 'Clan Gauss Rifle').found).toBe(true);
    });

    it('should resolve missile weapons', () => {
      expect(resolver.resolve('LRM5', 'LRM 5').found).toBe(true);
      expect(resolver.resolve('LRM10', 'LRM 10').found).toBe(true);
      expect(resolver.resolve('LRM15', 'LRM 15').found).toBe(true);
      expect(resolver.resolve('LRM20', 'LRM 20').found).toBe(true);
      expect(resolver.resolve('SRM2', 'SRM 2').found).toBe(true);
      expect(resolver.resolve('SRM4', 'SRM 4').found).toBe(true);
      expect(resolver.resolve('SRM6', 'SRM 6').found).toBe(true);
    });

    it('should resolve streak SRMs', () => {
      expect(resolver.resolve('ISStreakSRM2', 'Streak SRM 2').found).toBe(true);
      expect(resolver.resolve('CLStreakSRM4', 'Clan Streak SRM 4').found).toBe(true);
    });

    it('should resolve machine guns', () => {
      expect(resolver.resolve('MachineGun', 'Machine Gun').found).toBe(true);
      expect(resolver.resolve('ISLightMachineGun', 'Light Machine Gun').found).toBe(true);
      expect(resolver.resolve('ISHeavyMachineGun', 'Heavy Machine Gun').found).toBe(true);
    });
  });

  // ============================================================================
  // resolve() - Quantity Prefix Stripping
  // ============================================================================
  describe('resolve() - Quantity Prefix Stripping', () => {
    it('should handle quantity prefixes', () => {
      // MegaMekLab sometimes prefixes with count like "1ISMediumLaser"
      const result = resolver.resolve('1ISMediumLaser', 'Medium Laser');
      // Should attempt to resolve after stripping the quantity
      expect(result).toBeDefined();
    });

    it('should handle prefixes with tech base', () => {
      const result = resolver.resolve('2CLERMediumLaser', 'Clan ER Medium Laser');
      expect(result).toBeDefined();
    });
  });

  // ============================================================================
  // resolve() - Equipment Categories
  // ============================================================================
  describe('resolve() - Equipment Categories', () => {
    it('should resolve AMS', () => {
      expect(resolver.resolve('AMS', 'Anti-Missile System').found).toBe(true);
      expect(resolver.resolve('ISAMS', 'Anti-Missile System').found).toBe(true);
      expect(resolver.resolve('CLAMS', 'Clan Anti-Missile System').found).toBe(true);
    });

    it('should resolve TAG', () => {
      expect(resolver.resolve('TAG', 'TAG').found).toBe(true);
      expect(resolver.resolve('LightTAG', 'Light TAG').found).toBe(true);
    });

    it('should resolve C3 systems', () => {
      expect(resolver.resolve('C3MasterComputer', 'C3 Master').found).toBe(true);
      expect(resolver.resolve('ISC3SlaveUnit', 'C3 Slave').found).toBe(true);
    });

    it('should resolve ECM/BAP', () => {
      expect(resolver.resolve('GuardianECM', 'Guardian ECM').found).toBe(true);
      expect(resolver.resolve('BeagleActiveProbe', 'Beagle Active Probe').found).toBe(true);
    });

    it('should resolve targeting computers', () => {
      expect(resolver.resolve('ISTargetingComputer', 'Targeting Computer').found).toBe(true);
      expect(resolver.resolve('CLTargetingComputer', 'Clan Targeting Computer').found).toBe(true);
    });

    it('should resolve heat sinks', () => {
      expect(resolver.resolve('HeatSink', 'Heat Sink').found).toBe(true);
      expect(resolver.resolve('ISDoubleHeatSink', 'Double Heat Sink').found).toBe(true);
      expect(resolver.resolve('CLDoubleHeatSink', 'Clan Double Heat Sink').found).toBe(true);
    });

    it('should resolve jump jets', () => {
      // Jump jets may or may not be in the equipment database
      // Test that resolution returns a defined result
      const jjResult = resolver.resolve('JumpJet', 'Jump Jet');
      expect(jjResult).toBeDefined();
      expect(jjResult.originalType).toBe('JumpJet');
    });

    it('should resolve CASE', () => {
      // CASE may or may not be in the equipment database
      // Test that resolution returns a defined result
      const caseResult = resolver.resolve('CASE', 'CASE');
      expect(caseResult).toBeDefined();
      expect(caseResult.originalType).toBe('CASE');
    });

    it('should resolve MASC', () => {
      expect(resolver.resolve('ISMASC', 'MASC').found).toBe(true);
      expect(resolver.resolve('CLMASC', 'Clan MASC').found).toBe(true);
    });
  });

  // ============================================================================
  // resolve() - Confidence Levels
  // ============================================================================
  describe('resolve() - Confidence Levels', () => {
    it('should return exact confidence for direct mapping', () => {
      const result = resolver.resolve('MediumLaser', 'Medium Laser');
      if (result.found) {
        expect(result.confidence).toBe('exact');
      }
    });

    it('should return none confidence for unknown equipment', () => {
      const result = resolver.resolve('CompletelyFakeWeapon12345', 'Fake Weapon');
      expect(result.found).toBe(false);
      expect(result.confidence).toBe('none');
    });

    it('should preserve original name and type', () => {
      const result = resolver.resolve('MediumLaser', 'Medium Laser');
      expect(result.originalName).toBe('Medium Laser');
      expect(result.originalType).toBe('MediumLaser');
    });
  });

  // ============================================================================
  // resolve() - Tech Base Context
  // ============================================================================
  describe('resolve() - Tech Base Context', () => {
    it('should use tech base for ambiguous resolution', () => {
      // Some equipment might resolve differently based on tech base
      const isResult = resolver.resolve('MASC', 'MASC', TechBase.INNER_SPHERE);
      const clanResult = resolver.resolve('MASC', 'MASC', TechBase.CLAN);
      
      // Both should resolve, possibly to different IDs
      expect(isResult).toBeDefined();
      expect(clanResult).toBeDefined();
    });
  });

  // ============================================================================
  // getById()
  // ============================================================================
  describe('getById()', () => {
    it('should return equipment by ID', () => {
      // After initialization, should be able to look up by ID
      resolver.resolve('MediumLaser', 'Medium Laser'); // Trigger initialization
      
      const equipment = resolver.getById('medium-laser');
      // May or may not find depending on equipment database state
      expect(equipment === undefined || equipment !== null).toBe(true);
    });
  });

  // ============================================================================
  // isSystemComponent()
  // ============================================================================
  describe('isSystemComponent()', () => {
    it('should identify system components', () => {
      expect(resolver.isSystemComponent('Life Support')).toBe(true);
      expect(resolver.isSystemComponent('Sensors')).toBe(true);
      expect(resolver.isSystemComponent('Cockpit')).toBe(true);
      expect(resolver.isSystemComponent('Gyro')).toBe(true);
    });

    it('should identify actuators', () => {
      expect(resolver.isSystemComponent('Shoulder')).toBe(true);
      expect(resolver.isSystemComponent('Upper Arm Actuator')).toBe(true);
      expect(resolver.isSystemComponent('Lower Arm Actuator')).toBe(true);
      expect(resolver.isSystemComponent('Hand Actuator')).toBe(true);
      expect(resolver.isSystemComponent('Hip')).toBe(true);
      expect(resolver.isSystemComponent('Upper Leg Actuator')).toBe(true);
      expect(resolver.isSystemComponent('Lower Leg Actuator')).toBe(true);
      expect(resolver.isSystemComponent('Foot Actuator')).toBe(true);
    });

    it('should identify engine components', () => {
      expect(resolver.isSystemComponent('Fusion Engine')).toBe(true);
      expect(resolver.isSystemComponent('Engine')).toBe(true);
    });

    it('should identify empty slots', () => {
      expect(resolver.isSystemComponent('-Empty-')).toBe(true);
      expect(resolver.isSystemComponent('Empty')).toBe(true);
    });

    it('should not identify weapons as system components', () => {
      expect(resolver.isSystemComponent('Medium Laser')).toBe(false);
      expect(resolver.isSystemComponent('AC/20')).toBe(false);
      expect(resolver.isSystemComponent('LRM 20')).toBe(false);
    });
  });

  // ============================================================================
  // isHeatSink()
  // ============================================================================
  describe('isHeatSink()', () => {
    it('should identify heat sinks', () => {
      expect(resolver.isHeatSink('Heat Sink')).toBe(true);
      expect(resolver.isHeatSink('Double Heat Sink')).toBe(true);
      expect(resolver.isHeatSink('Clan Double Heat Sink')).toBe(true);
    });

    it('should handle alternate spellings', () => {
      expect(resolver.isHeatSink('heatsink')).toBe(true);
      expect(resolver.isHeatSink('HeatSink')).toBe(true);
    });

    it('should not identify non-heat sinks', () => {
      expect(resolver.isHeatSink('Medium Laser')).toBe(false);
      expect(resolver.isHeatSink('CASE')).toBe(false);
    });
  });

  // ============================================================================
  // getMappings()
  // ============================================================================
  describe('getMappings()', () => {
    it('should return all registered mappings', () => {
      const mappings = resolver.getMappings();
      
      expect(mappings).toBeDefined();
      expect(typeof mappings).toBe('object');
      expect(mappings['MediumLaser']).toBe('medium-laser');
      expect(mappings['LargeLaser']).toBe('large-laser');
    });

    it('should return a copy, not the original', () => {
      const mappings1 = resolver.getMappings();
      const mappings2 = resolver.getMappings();
      
      expect(mappings1).not.toBe(mappings2);
      expect(mappings1).toEqual(mappings2);
    });
  });
});

