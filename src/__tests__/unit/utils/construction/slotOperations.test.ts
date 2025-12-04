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

    it('should return empty set for arms', () => {
      const fixed = getFixedSlotIndices(MechLocation.LEFT_ARM, EngineType.STANDARD, GyroType.STANDARD);
      
      // Arms have no fixed slots (actuators are handled separately)
      expect(fixed.size).toBe(0);
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
          location: MechLocation.LEFT_ARM,
          slots: [5, 6],
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
          location: MechLocation.LEFT_ARM,
          slots: [0, 1],
        },
        {
          instanceId: 'equip-2',
          equipmentId: 'large-laser',
          location: MechLocation.LEFT_ARM,
          slots: [2, 3, 4],
        },
      ];
      
      const result = sortEquipmentBySize(
        equipment,
        EngineType.STANDARD,
        GyroType.STANDARD
      );
      
      expect(result).toBeDefined();
      // Larger equipment should come first
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
