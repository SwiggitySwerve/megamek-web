import { DEFAULT_MECH_STATE, IMechLabState } from '../../features/mech-lab/store/MechLabState';
import { WEAPONS_DB } from '../../data/weapons';
import { CriticalSlotMechanics, MechLocation } from '../CriticalSlots';
import { TechBase } from '../../types/TechBase';
import { EngineType, GyroType, CockpitType } from '../../types/SystemComponents';

const cloneState = (): IMechLabState =>
  JSON.parse(JSON.stringify(DEFAULT_MECH_STATE)) as IMechLabState;

describe('CriticalSlotMechanics', () => {
  it('reserves the correct number of system slots for XL engines', () => {
    const layout = CriticalSlotMechanics.generateBaseLayout(
      TechBase.INNER_SPHERE,
      EngineType.XL,
      GyroType.STANDARD,
      CockpitType.STANDARD,
      []
    );

    expect(layout[MechLocation.CENTER_TORSO].systemSlots).toBe(10); // 6 engine + 4 gyro
    expect(layout[MechLocation.RIGHT_TORSO].systemSlots).toBe(3);
    expect(layout[MechLocation.LEFT_TORSO].systemSlots).toBe(3);
  });

  it('counts allocated equipment when computing slot usage', () => {
    const weapon = WEAPONS_DB[0];
    const baseUsage = CriticalSlotMechanics.getSlotUsage(cloneState());

    const equippedState = cloneState();
    equippedState.equipment = [
      {
        id: 'eq-1',
        equipmentId: weapon.id,
        location: 'RT',
        slotIndex: 1,
        count: 1,
        slotsAllocated: weapon.criticalSlots,
      },
    ];

    const usageWithEquipment = CriticalSlotMechanics.getSlotUsage(equippedState);
    expect(usageWithEquipment.used).toBe(baseUsage.used + weapon.criticalSlots);
    expect(usageWithEquipment.remaining).toBe(baseUsage.remaining - weapon.criticalSlots);
  });
});

