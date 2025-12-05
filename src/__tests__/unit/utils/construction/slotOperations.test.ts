import {
  getFixedSlotIndices,
  fillUnhittableSlots,
  compactEquipmentSlots,
  sortEquipmentBySize,
  getUnallocatedUnhittables,
} from '@/utils/construction/slotOperations';
import { MechLocation } from '@/types/construction';
import { EngineType } from '@/types/construction/EngineType';
import { GyroType } from '@/types/construction/GyroType';
import { IMountedEquipmentInstance } from '@/stores/unitState';
import { EquipmentCategory } from '@/types/equipment';
import { TechBase } from '@/types/enums/TechBase';

describe('slotOperations', () => {
  describe('getFixedSlotIndices()', () => {
    it('should return fixed slots for head', () => {
      const fixed = getFixedSlotIndices(MechLocation.HEAD, EngineType.STANDARD, GyroType.STANDARD);
      
      // Head has 5 fixed slots (0, 1, 2, 4, 5), only slot 3 is assignable
      expect(fixed.has(0)).toBe(true);
      expect(fixed.has(1)).toBe(true);
      expect(fixed.has(2)).toBe(true);
      expect(fixed.has(4)).toBe(true);
      expect(fixed.has(5)).toBe(true);
      expect(fixed.has(3)).toBe(false);
    });

    it('should return fixed slots for center torso', () => {
      const fixed = getFixedSlotIndices(MechLocation.CENTER_TORSO, EngineType.STANDARD, GyroType.STANDARD);
      
      // CT has engine and gyro slots
      expect(fixed.size).toBeGreaterThan(0);
    });

    it('should return fixed slots for arms (actuators)', () => {
      const fixed = getFixedSlotIndices(MechLocation.LEFT_ARM, EngineType.STANDARD, GyroType.STANDARD);
      
      // Arms have 4 fixed actuator slots: Shoulder (0), Upper Arm (1), Lower Arm (2), Hand (3)
      expect(fixed.size).toBe(4);
      expect(fixed.has(0)).toBe(true); // Shoulder
      expect(fixed.has(1)).toBe(true); // Upper Arm
      expect(fixed.has(2)).toBe(true); // Lower Arm
      expect(fixed.has(3)).toBe(true); // Hand
    });
  });

  describe('fillUnhittableSlots()', () => {
    it('should fill unhittable slots', () => {
      const equipment: IMountedEquipmentInstance[] = [];
      const result = fillUnhittableSlots(
        equipment,
        EngineType.STANDARD,
        GyroType.STANDARD
      );
      
      expect(result).toBeDefined();
      expect(result.assignments).toBeDefined();
    });
  });

  describe('compactEquipmentSlots()', () => {
    it('should compact equipment to lowest slots', () => {
      const equipment: IMountedEquipmentInstance[] = [
        {
          instanceId: 'equip-1',
          equipmentId: 'medium-laser',
          name: 'Medium Laser',
          category: EquipmentCategory.ENERGY_WEAPON,
          weight: 1,
          criticalSlots: 1,
          techBase: TechBase.INNER_SPHERE,
          location: MechLocation.LEFT_ARM,
          slots: [8, 9], // Place at higher slots so there's room to compact
        },
      ];
      
      const result = compactEquipmentSlots(
        equipment,
        EngineType.STANDARD,
        GyroType.STANDARD
      );
      
      expect(result).toBeDefined();
    });
  });

  describe('sortEquipmentBySize()', () => {
    it('should sort equipment by size', () => {
      const equipment: IMountedEquipmentInstance[] = [
        {
          instanceId: 'equip-1',
          equipmentId: 'medium-laser',
          name: 'Medium Laser',
          category: EquipmentCategory.ENERGY_WEAPON,
          weight: 1,
          criticalSlots: 1,
          techBase: TechBase.INNER_SPHERE,
          location: MechLocation.LEFT_ARM,
          slots: [4, 5],
        },
        {
          instanceId: 'equip-2',
          equipmentId: 'large-laser',
          name: 'Large Laser',
          category: EquipmentCategory.ENERGY_WEAPON,
          weight: 5,
          criticalSlots: 2,
          techBase: TechBase.INNER_SPHERE,
          location: MechLocation.LEFT_ARM,
          slots: [6, 7, 8],
        },
      ];
      
      const result = sortEquipmentBySize(
        equipment,
        EngineType.STANDARD,
        GyroType.STANDARD
      );
      
      expect(result).toBeDefined();
      // Larger equipment (more critical slots) should come first
      expect(result.assignments[0].instanceId).toBe('equip-2');
    });
  });

  describe('getUnallocatedUnhittables()', () => {
    it('should return unhittable slots that are not allocated', () => {
      const equipment: IMountedEquipmentInstance[] = [];
      const result = getUnallocatedUnhittables(equipment);
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
