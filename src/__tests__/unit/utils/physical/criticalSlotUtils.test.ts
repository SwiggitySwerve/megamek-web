/**
 * Critical Slot Utilities Tests
 * 
 * Tests for critical slot validation and allocation.
 * 
 * @spec openspec/specs/critical-slot-allocation/spec.md
 */

import {
  isValidCriticalSlots,
  validateCriticalSlots,
  LOCATION_SLOT_CAPACITY,
  TOTAL_MECH_SLOTS,
  getLocationSlotCapacity,
  canAllocateSlots,
} from '@/utils/physical/criticalSlotUtils';

// Import custom assertions
import '@/__tests__/helpers/assertions';

describe('Critical Slot Utilities', () => {
  // ============================================================================
  // isValidCriticalSlots
  // ============================================================================
  describe('isValidCriticalSlots', () => {
    describe('valid slot counts', () => {
      it.each([
        [0, 'zero slots'],
        [1, 'one slot'],
        [6, 'head capacity'],
        [12, 'torso capacity'],
        [78, 'total mech capacity'],
      ])('should accept %d (%s)', (slots) => {
        expect(isValidCriticalSlots(slots)).toBe(true);
      });
    });

    describe('invalid slot counts', () => {
      it.each([
        [-1, 'negative'],
        [-6, 'negative head capacity'],
        [1.5, 'fractional'],
        [3.7, 'fractional'],
        [NaN, 'NaN'],
        [Infinity, 'Infinity'],
      ])('should reject %s (%s)', (slots) => {
        expect(isValidCriticalSlots(slots)).toBe(false);
      });
    });
  });

  // ============================================================================
  // validateCriticalSlots
  // ============================================================================
  describe('validateCriticalSlots', () => {
    describe('valid slots', () => {
      it('should validate zero slots', () => {
        const result = validateCriticalSlots(0);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should validate positive integer slots', () => {
        const result = validateCriticalSlots(6);
        expect(result.isValid).toBe(true);
      });
    });

    describe('invalid slots', () => {
      it('should reject negative slots', () => {
        const result = validateCriticalSlots(-3);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Critical slots cannot be negative');
      });

      it('should reject fractional slots', () => {
        const result = validateCriticalSlots(2.5);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Critical slots must be an integer');
      });
    });

    describe('context in error messages', () => {
      it('should include context', () => {
        const result = validateCriticalSlots(-1, 'Left Arm');
        expect(result.errors[0]).toContain('Left Arm:');
      });
    });
  });

  // ============================================================================
  // LOCATION_SLOT_CAPACITY
  // ============================================================================
  describe('LOCATION_SLOT_CAPACITY', () => {
    // From critical-slot-allocation/spec.md:
    // - Head: 6 slots
    // - Center Torso: 12 slots
    // - Side Torsos: 12 slots each
    // - Arms: 12 slots each
    // - Legs: 6 slots each
    
    it.each([
      ['HEAD', 6],
      ['CENTER_TORSO', 12],
      ['LEFT_TORSO', 12],
      ['RIGHT_TORSO', 12],
      ['LEFT_ARM', 12],
      ['RIGHT_ARM', 12],
      ['LEFT_LEG', 6],
      ['RIGHT_LEG', 6],
    ])('%s has %d slots', (location, expected) => {
      expect(LOCATION_SLOT_CAPACITY[location as keyof typeof LOCATION_SLOT_CAPACITY]).toBe(expected);
    });
  });

  // ============================================================================
  // TOTAL_MECH_SLOTS
  // ============================================================================
  describe('TOTAL_MECH_SLOTS', () => {
    // 6 + 12 + 12 + 12 + 12 + 12 + 6 + 6 = 78
    it('should be 78 total slots', () => {
      expect(TOTAL_MECH_SLOTS).toBe(78);
    });

    it('should equal sum of all locations', () => {
      const sum = Object.values(LOCATION_SLOT_CAPACITY).reduce((a, b) => a + b, 0);
      expect(TOTAL_MECH_SLOTS).toBe(sum);
    });
  });

  // ============================================================================
  // getLocationSlotCapacity
  // ============================================================================
  describe('getLocationSlotCapacity', () => {
    describe('with exact location names', () => {
      it.each([
        ['HEAD', 6],
        ['CENTER_TORSO', 12],
        ['LEFT_ARM', 12],
        ['LEFT_LEG', 6],
      ])('%s = %d slots', (location, expected) => {
        expect(getLocationSlotCapacity(location)).toBe(expected);
      });
    });

    describe('with normalized names', () => {
      it.each([
        ['head', 6],
        ['Head', 6],
        ['HEAD', 6],
        ['center torso', 12],
        ['Center-Torso', 12],
        ['left-arm', 12],
      ])('%s normalizes correctly', (location, expected) => {
        expect(getLocationSlotCapacity(location)).toBe(expected);
      });
    });

    describe('with invalid locations', () => {
      it('should return undefined for unknown location', () => {
        expect(getLocationSlotCapacity('unknown')).toBeUndefined();
        expect(getLocationSlotCapacity('REAR_TORSO')).toBeUndefined();
      });
    });
  });

  // ============================================================================
  // canAllocateSlots
  // ============================================================================
  describe('canAllocateSlots', () => {
    describe('valid allocations', () => {
      it('should allow allocation within capacity', () => {
        expect(canAllocateSlots(0, 6, 12)).toBe(true);
        expect(canAllocateSlots(5, 5, 12)).toBe(true);
        expect(canAllocateSlots(10, 2, 12)).toBe(true);
      });

      it('should allow exact capacity', () => {
        expect(canAllocateSlots(6, 6, 12)).toBe(true);
        expect(canAllocateSlots(0, 6, 6)).toBe(true);
      });

      it('should allow zero allocation', () => {
        expect(canAllocateSlots(6, 0, 12)).toBe(true);
      });
    });

    describe('invalid allocations', () => {
      it('should reject exceeding capacity', () => {
        expect(canAllocateSlots(6, 7, 12)).toBe(false);
        expect(canAllocateSlots(10, 5, 12)).toBe(false);
      });

      it('should reject invalid slot values', () => {
        expect(canAllocateSlots(-1, 5, 12)).toBe(false);
        expect(canAllocateSlots(5, -1, 12)).toBe(false);
        expect(canAllocateSlots(5, 5, -12)).toBe(false);
      });

      it('should reject fractional slots', () => {
        expect(canAllocateSlots(5.5, 5, 12)).toBe(false);
        expect(canAllocateSlots(5, 5.5, 12)).toBe(false);
      });
    });
  });

  // ============================================================================
  // Critical Slot Allocation Scenarios
  // ============================================================================
  describe('Allocation Scenarios', () => {
    describe('Head allocation', () => {
      const headCapacity = LOCATION_SLOT_CAPACITY.HEAD; // 6

      it('can fit cockpit (3) + life support (2) + sensors (1)', () => {
        let allocated = 0;
        expect(canAllocateSlots(allocated, 3, headCapacity)).toBe(true);
        allocated += 3;
        expect(canAllocateSlots(allocated, 2, headCapacity)).toBe(true);
        allocated += 2;
        expect(canAllocateSlots(allocated, 1, headCapacity)).toBe(true);
        allocated += 1;
        expect(allocated).toBe(headCapacity); // Exactly full
      });
    });

    describe('Center Torso allocation', () => {
      const ctCapacity = LOCATION_SLOT_CAPACITY.CENTER_TORSO; // 12

      it('can fit engine (6) + gyro (4) with 2 remaining', () => {
        let allocated = 0;
        expect(canAllocateSlots(allocated, 6, ctCapacity)).toBe(true); // Engine
        allocated += 6;
        expect(canAllocateSlots(allocated, 4, ctCapacity)).toBe(true); // Gyro
        allocated += 4;
        expect(ctCapacity - allocated).toBe(2); // 2 slots remaining
      });
    });

    describe('Total mech allocation', () => {
      it('XL engine uses 12 total slots (6 CT + 3 LT + 3 RT)', () => {
        const xlSlots = 6 + 3 + 3;
        const remaining = TOTAL_MECH_SLOTS - xlSlots;
        expect(remaining).toBe(66);
      });

      it('Standard engine uses 6 total slots', () => {
        const standardSlots = 6;
        const remaining = TOTAL_MECH_SLOTS - standardSlots;
        expect(remaining).toBe(72);
      });
    });
  });

  // ============================================================================
  // Custom Matchers
  // ============================================================================
  describe('Custom Matchers', () => {
    describe('toBeValidSlotCount', () => {
      it('should pass for valid slot counts', () => {
        expect(0).toBeValidSlotCount();
        expect(6).toBeValidSlotCount();
        expect(12).toBeValidSlotCount();
        expect(78).toBeValidSlotCount();
      });

      it('should fail for invalid slot counts', () => {
        expect(-1).not.toBeValidSlotCount();
        expect(1.5).not.toBeValidSlotCount();
      });
    });
  });
});

