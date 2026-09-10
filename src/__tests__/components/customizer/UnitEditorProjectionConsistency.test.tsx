import { renderHook } from '@testing-library/react';

import { buildBattleMechPreviewProjection } from '@/components/customizer/preview/recordSheetPreview.logic';
import { useUnitEditorRoutingStats } from '@/components/customizer/UnitEditorWithRoutingStats';
import {
  calculateTotalArmorPoints,
  calculateTotalStructurePoints,
} from '@/services/construction/CalculationService.calculations';
import { createDefaultUnitState } from '@/stores/unitState';
import { MechLocation } from '@/types/construction/CriticalSlotAllocation';
import { getLocationsForConfig } from '@/types/construction/MechConfigurationSystem';
import { TechBase } from '@/types/enums/TechBase';
import { MechConfiguration } from '@/types/unit/BattleMechInterfaces';

jest.mock('@/hooks/useEquipmentRegistry', () => ({
  useEquipmentRegistry: () => ({ isReady: true, recheckReady: jest.fn() }),
}));

it.each([
  MechConfiguration.BIPED,
  MechConfiguration.QUAD,
  MechConfiguration.TRIPOD,
])(
  'uses the same %s armor and movement for editor budgets and record-sheet export',
  (configuration) => {
    const initial = createDefaultUnitState({
      id: '12db40bc-1d71-428a-8834-7137a2209afe',
      name: 'Projection Fixture',
      tonnage: 50,
      techBase: TechBase.INNER_SPHERE,
    });
    const state = {
      ...initial,
      configuration,
      armorAllocation: { ...initial.armorAllocation },
    };
    for (const key of Object.keys(state.armorAllocation) as Array<
      keyof typeof state.armorAllocation
    >)
      state.armorAllocation[key] = 0;
    for (const location of getLocationsForConfig(configuration))
      state.armorAllocation[location] = location === MechLocation.HEAD ? 9 : 16;
    state.armorAllocation.centerTorsoRear = 4;
    state.armorAllocation.leftTorsoRear = 4;
    state.armorAllocation.rightTorsoRear = 4;
    const { result } = renderHook(() =>
      useUnitEditorRoutingStats({
        ...state,
        unitName: state.name,
        validation: { status: 'valid', errorCount: 0, warningCount: 0 },
      }),
    );
    const preview = buildBattleMechPreviewProjection(state);
    const stats = result.current.unitStats;
    expect(preview.battleValue).toBeGreaterThan(0);
    expect(stats.battleValue).toBe(preview.battleValue);
    expect(calculateTotalArmorPoints(preview.editableMech)).toBe(
      stats.armorPoints,
    );
    expect(calculateTotalStructurePoints(preview.editableMech)).toBe(
      configuration === MechConfiguration.QUAD
        ? 91
        : configuration === MechConfiguration.TRIPOD
          ? 95
          : 83,
    );
    expect(stats.armorPoints).toBe(
      Object.values(preview.unitConfig.armor.allocation).reduce(
        (sum, value) => sum + value,
        0,
      ),
    );
    expect(preview.unitConfig.movement).toMatchObject({
      walkMP: stats.walkMP,
      runMP: stats.runMP,
      jumpMP: stats.jumpMP,
    });
    expect(result.current.mobileLoadoutStats).toMatchObject({
      battleValue: stats.battleValue,
      weightUsed: stats.weightUsed,
      slotsUsed: stats.criticalSlotsUsed,
    });
  },
);
