import { renderHook } from '@testing-library/react';

import { useUnitStore } from '@/stores/useUnitStore';

import { useWeightValidation } from '../useWeightValidation';

// Mock the unit store
jest.mock('@/stores/useUnitStore');

describe('useWeightValidation', () => {
  beforeEach(() => {
    // Reset mock
    jest.clearAllMocks();
  });

  it('should calculate structural and equipment weight correctly', () => {
    // Mock store values for a 50-ton mech
    (useUnitStore as unknown as jest.Mock).mockImplementation(
      (selector: (state: unknown) => unknown) =>
        selector({
          tonnage: 50,
          engineType: 'Standard',
          engineRating: 200,
          gyroType: 'Standard',
          internalStructureType: 'Standard',
          cockpitType: 'Standard',
          heatSinkType: 'Single',
          heatSinkCount: 10,
          armorTonnage: 8,
          equipment: [],
        }),
    );

    const { result } = renderHook(() => useWeightValidation());

    expect(result.current.maxWeight).toBe(50);
    expect(result.current.structuralWeight).toBeGreaterThan(0);
    expect(result.current.equipmentWeight).toBe(0); // No equipment
    expect(result.current.allocatedWeight).toBe(
      result.current.structuralWeight,
    );
    expect(result.current.remainingWeight).toBeGreaterThan(0);
    expect(result.current.isValid).toBe(true);
  });

  it('should detect weight overflow', () => {
    // Mock store with excessive weight
    (useUnitStore as unknown as jest.Mock).mockImplementation(
      (selector: (state: unknown) => unknown) =>
        selector({
          tonnage: 20,
          engineType: 'XL',
          engineRating: 400,
          gyroType: 'Heavy-Duty',
          internalStructureType: 'Standard',
          cockpitType: 'Standard',
          heatSinkType: 'Double',
          heatSinkCount: 20,
          armorTonnage: 10,
          equipment: [
            { equipmentId: 'payload-a', weight: 5, isRemovable: true },
            { equipmentId: 'payload-b', weight: 10, isRemovable: true },
          ],
        }),
    );

    const { result } = renderHook(() => useWeightValidation());

    expect(result.current.maxWeight).toBe(20);
    expect(result.current.allocatedWeight).toBeGreaterThan(20);
    expect(result.current.remainingWeight).toBeLessThan(0);
    expect(result.current.isValid).toBe(false);
  });

  it('should handle missing tonnage with default value', () => {
    (useUnitStore as unknown as jest.Mock).mockImplementation(
      (selector: (state: unknown) => unknown) =>
        selector({
          tonnage: 0,
          engineType: 'Standard',
          engineRating: 100,
          gyroType: 'Standard',
          internalStructureType: 'Standard',
          cockpitType: 'Standard',
          heatSinkType: 'Single',
          heatSinkCount: 10,
          armorTonnage: 2,
          equipment: [],
        }),
    );

    const { result } = renderHook(() => useWeightValidation());

    // Should default to 20 tons
    expect(result.current.maxWeight).toBe(20);
  });

  it('should calculate equipment weight from equipment array', () => {
    (useUnitStore as unknown as jest.Mock).mockImplementation(
      (selector: (state: unknown) => unknown) =>
        selector({
          tonnage: 50,
          engineType: 'Standard',
          engineRating: 200,
          gyroType: 'Standard',
          internalStructureType: 'Standard',
          cockpitType: 'Standard',
          heatSinkType: 'Single',
          heatSinkCount: 10,
          armorTonnage: 5,
          equipment: [
            { equipmentId: 'payload-a', weight: 2, isRemovable: true },
            { equipmentId: 'payload-b', weight: 3, isRemovable: true },
            { equipmentId: 'payload-c', weight: 1.5, isRemovable: true },
          ],
        }),
    );

    const { result } = renderHook(() => useWeightValidation());

    expect(result.current.equipmentWeight).toBe(6.5);
    expect(result.current.allocatedWeight).toBe(
      result.current.structuralWeight + 6.5,
    );
  });

  it('keeps managed heat-sink and jump-jet records out of payload across edits', () => {
    const managed = (equipmentId: string, weight: number) => ({
      equipmentId,
      weight,
      isRemovable: false,
    });
    const payload = {
      equipmentId: 'medium-laser',
      weight: 1,
      isRemovable: true,
    };
    const removableHeatSink = {
      equipmentId: 'single-heat-sink',
      weight: 1,
      isRemovable: true,
    };
    let state = {
      tonnage: 50,
      engineType: 'Standard',
      engineRating: 200,
      gyroType: 'Standard',
      internalStructureType: 'Standard',
      cockpitType: 'Standard',
      heatSinkType: 'Single',
      heatSinkCount: 11,
      armorType: 'Standard',
      armorTonnage: 5,
      configuration: 'Biped',
      jumpMP: 2,
      jumpJetType: 'Standard',
      equipment: [
        managed('single-heat-sink', 1),
        managed('jump-jet-light', 0.5),
        managed('jump-jet-light', 0.5),
        removableHeatSink,
        payload,
      ],
    };
    (useUnitStore as unknown as jest.Mock).mockImplementation(
      (selector: (value: unknown) => unknown) => selector(state),
    );

    const { result, rerender } = renderHook(() => useWeightValidation());
    const initialWeight = result.current.allocatedWeight;
    expect(result.current.equipmentWeight).toBe(2);

    state = {
      ...state,
      heatSinkCount: 12,
      equipment: [...state.equipment, managed('single-heat-sink', 1)],
    };
    rerender();
    expect(result.current.equipmentWeight).toBe(2);
    expect(result.current.allocatedWeight).toBe(initialWeight + 1);

    const withExtraHeatSink = result.current.allocatedWeight;
    state = {
      ...state,
      jumpMP: 3,
      equipment: [...state.equipment, managed('jump-jet-light', 0.5)],
    };
    rerender();
    expect(result.current.equipmentWeight).toBe(2);
    expect(result.current.allocatedWeight).toBe(withExtraHeatSink + 0.5);
  });
});
