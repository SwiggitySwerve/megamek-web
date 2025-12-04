import {
  getEquipmentColors,
  getEquipmentColorClasses,
  categoryToColorType,
  classifyEquipment,
  getBattleTechEquipmentClasses,
  EquipmentColorType,
  EQUIPMENT_COLORS,
} from '@/utils/colors/equipmentColors';
import { EquipmentCategory } from '@/types/equipment';

describe('equipmentColors', () => {
  describe('getEquipmentColors', () => {
    it('should return colors for valid color types', () => {
      expect(getEquipmentColors('weapon')).toEqual(EQUIPMENT_COLORS.weapon);
      expect(getEquipmentColors('ammunition')).toEqual(EQUIPMENT_COLORS.ammunition);
      expect(getEquipmentColors('heatsink')).toEqual(EQUIPMENT_COLORS.heatsink);
      expect(getEquipmentColors('electronics')).toEqual(EQUIPMENT_COLORS.electronics);
      expect(getEquipmentColors('physical')).toEqual(EQUIPMENT_COLORS.physical);
      expect(getEquipmentColors('movement')).toEqual(EQUIPMENT_COLORS.movement);
      expect(getEquipmentColors('structural')).toEqual(EQUIPMENT_COLORS.structural);
      expect(getEquipmentColors('misc')).toEqual(EQUIPMENT_COLORS.misc);
    });
  });

  describe('getEquipmentColorClasses', () => {
    it('should return combined class string for color types', () => {
      const weaponClasses = getEquipmentColorClasses('weapon');
      expect(weaponClasses).toContain('bg-red-700');
      expect(weaponClasses).toContain('border-red-800');
      expect(weaponClasses).toContain('text-white');
      expect(weaponClasses).toContain('hover:bg-red-600');
    });

    it('should return correct classes for all color types', () => {
      const types: EquipmentColorType[] = [
        'weapon',
        'ammunition',
        'heatsink',
        'electronics',
        'physical',
        'movement',
        'structural',
        'misc',
      ];

      types.forEach((type) => {
        const classes = getEquipmentColorClasses(type);
        expect(classes).toBeTruthy();
        expect(typeof classes).toBe('string');
      });
    });
  });

  describe('categoryToColorType', () => {
    it('should map weapon categories to weapon color type', () => {
      expect(categoryToColorType(EquipmentCategory.ENERGY_WEAPON)).toBe('weapon');
      expect(categoryToColorType(EquipmentCategory.BALLISTIC_WEAPON)).toBe('weapon');
      expect(categoryToColorType(EquipmentCategory.MISSILE_WEAPON)).toBe('weapon');
      expect(categoryToColorType(EquipmentCategory.ARTILLERY)).toBe('weapon');
      expect(categoryToColorType(EquipmentCategory.CAPITAL_WEAPON)).toBe('weapon');
    });

    it('should map ammunition category to ammunition color type', () => {
      expect(categoryToColorType(EquipmentCategory.AMMUNITION)).toBe('ammunition');
    });

    it('should map electronics category to electronics color type', () => {
      expect(categoryToColorType(EquipmentCategory.ELECTRONICS)).toBe('electronics');
    });

    it('should map physical weapon category to physical color type', () => {
      expect(categoryToColorType(EquipmentCategory.PHYSICAL_WEAPON)).toBe('physical');
    });

    it('should map movement category to movement color type', () => {
      expect(categoryToColorType(EquipmentCategory.MOVEMENT)).toBe('movement');
    });

    it('should map structural category to structural color type', () => {
      expect(categoryToColorType(EquipmentCategory.STRUCTURAL)).toBe('structural');
    });

    it('should map misc category to misc color type', () => {
      expect(categoryToColorType(EquipmentCategory.MISC_EQUIPMENT)).toBe('misc');
    });
  });

  describe('classifyEquipment', () => {
    describe('heat sink classification', () => {
      it('should classify heat sink names', () => {
        expect(classifyEquipment('Heat Sink')).toBe('heatsink');
        expect(classifyEquipment('Double Heat Sink')).toBe('heatsink');
        expect(classifyEquipment('Heatsink')).toBe('heatsink');
      });
    });

    describe('ammunition classification', () => {
      it('should classify ammunition names', () => {
        expect(classifyEquipment('AC/20 Ammo')).toBe('ammunition');
        expect(classifyEquipment('LRM Ammunition')).toBe('ammunition');
        expect(classifyEquipment('SRM Ammo')).toBe('ammunition');
      });

      it('should classify names ending with " rounds"', () => {
        // Note: "AC/20 rounds" matches weapon pattern first, so use names without weapon patterns
        expect(classifyEquipment('Standard rounds')).toBe('ammunition');
        expect(classifyEquipment('LRM 20 rounds')).toBe('ammunition');
      });
    });

    describe('weapon classification', () => {
      it('should classify laser weapons', () => {
        expect(classifyEquipment('Medium Laser')).toBe('weapon');
        expect(classifyEquipment('Large Laser')).toBe('weapon');
        expect(classifyEquipment('ER PPC')).toBe('weapon');
      });

      it('should classify autocannon weapons', () => {
        expect(classifyEquipment('Autocannon/20')).toBe('weapon');
        expect(classifyEquipment('AC/20')).toBe('weapon');
      });

      it('should classify gauss weapons', () => {
        expect(classifyEquipment('Gauss Rifle')).toBe('weapon');
        expect(classifyEquipment('Heavy Gauss')).toBe('weapon');
      });

      it('should classify missile weapons', () => {
        expect(classifyEquipment('LRM 20')).toBe('weapon');
        expect(classifyEquipment('SRM 6')).toBe('weapon');
        expect(classifyEquipment('MRM 40')).toBe('weapon');
      });

      it('should classify machine gun weapons', () => {
        expect(classifyEquipment('Machine Gun')).toBe('weapon');
      });

      it('should classify flamer weapons', () => {
        expect(classifyEquipment('Flamer')).toBe('weapon');
      });

      it('should classify NARC weapons', () => {
        expect(classifyEquipment('NARC')).toBe('weapon');
      });

      it('should classify TAG weapons', () => {
        expect(classifyEquipment('TAG')).toBe('weapon');
      });
    });

    describe('electronics classification', () => {
      it('should classify computer equipment', () => {
        expect(classifyEquipment('Targeting Computer')).toBe('electronics');
        expect(classifyEquipment('Command Console')).toBe('electronics');
      });

      it('should classify ECM equipment', () => {
        expect(classifyEquipment('ECM Suite')).toBe('electronics');
      });

      it('should classify BAP equipment', () => {
        expect(classifyEquipment('Beagle Active Probe')).toBe('electronics');
      });

      it('should classify probe equipment', () => {
        expect(classifyEquipment('Probe')).toBe('electronics');
      });

      it('should classify C3 equipment', () => {
        expect(classifyEquipment('C3 Master')).toBe('electronics');
        expect(classifyEquipment('C3 Slave')).toBe('electronics');
      });
    });

    describe('physical weapon classification', () => {
      it('should classify physical weapons', () => {
        expect(classifyEquipment('Hatchet')).toBe('physical');
        expect(classifyEquipment('Sword')).toBe('physical');
        expect(classifyEquipment('Claw')).toBe('physical');
        expect(classifyEquipment('Mace')).toBe('physical');
        expect(classifyEquipment('Lance')).toBe('physical');
        expect(classifyEquipment('Talons')).toBe('physical');
      });
    });

    describe('movement equipment classification', () => {
      it('should classify jump jets', () => {
        expect(classifyEquipment('Jump Jet')).toBe('movement');
        expect(classifyEquipment('Improved Jump Jet')).toBe('movement');
      });

      it('should classify MASC', () => {
        expect(classifyEquipment('MASC')).toBe('movement');
      });

      it('should classify supercharger', () => {
        expect(classifyEquipment('Supercharger')).toBe('movement');
      });

      it('should classify partial wing', () => {
        expect(classifyEquipment('Partial Wing')).toBe('movement');
      });
    });

    describe('structural equipment classification', () => {
      it('should classify endo steel', () => {
        expect(classifyEquipment('Endo Steel')).toBe('structural');
        expect(classifyEquipment('Endo-Steel')).toBe('structural');
      });

      it('should classify ferro-fibrous armor', () => {
        expect(classifyEquipment('Ferro-Fibrous')).toBe('structural');
        expect(classifyEquipment('Ferro Fibrous')).toBe('structural');
      });

      it('should classify light ferro', () => {
        expect(classifyEquipment('Light Ferro')).toBe('structural');
      });

      it('should classify heavy ferro', () => {
        expect(classifyEquipment('Heavy Ferro')).toBe('structural');
      });

      it('should classify stealth armor', () => {
        expect(classifyEquipment('Stealth Armor')).toBe('structural');
      });

      it('should classify reactive armor', () => {
        expect(classifyEquipment('Reactive Armor')).toBe('structural');
      });
    });

    describe('misc classification', () => {
      it('should return misc for unknown equipment', () => {
        expect(classifyEquipment('Unknown Equipment')).toBe('misc');
        expect(classifyEquipment('')).toBe('misc');
      });
    });

    describe('priority order', () => {
      it('should prioritize heat sink over weapon', () => {
        // If something matches both, heat sink should win
        expect(classifyEquipment('Heat Sink Laser')).toBe('heatsink');
      });

      it('should prioritize ammunition over weapon', () => {
        expect(classifyEquipment('AC/20 Ammo')).toBe('ammunition');
      });
    });
  });

  describe('getBattleTechEquipmentClasses', () => {
    it('should return classes for equipment', () => {
      const classes = getBattleTechEquipmentClasses('Medium Laser');
      expect(classes).toContain('bg-red-700');
      expect(classes).toContain('border');
      expect(classes).toContain('rounded');
      expect(classes).toContain('transition-colors');
    });

    it('should include hover classes when not selected', () => {
      const classes = getBattleTechEquipmentClasses('Medium Laser', false);
      expect(classes).toContain('hover:bg-red-600');
    });

    it('should include selection ring when selected', () => {
      const classes = getBattleTechEquipmentClasses('Medium Laser', true);
      expect(classes).toContain('ring-2');
      expect(classes).toContain('ring-yellow-400');
      expect(classes).toContain('ring-offset-1');
    });

    it('should not include hover when selected', () => {
      const classes = getBattleTechEquipmentClasses('Medium Laser', true);
      expect(classes).not.toContain('hover:bg-red-600');
    });
  });
});

