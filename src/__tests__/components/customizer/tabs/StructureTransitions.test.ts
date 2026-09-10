import { createNewUnitStore } from '@/stores/useUnitStore';
import { MechLocation } from '@/types/construction';
import { CockpitType } from '@/types/construction/CockpitType';
import { GyroType } from '@/types/construction/GyroType';
import { MechConfiguration } from '@/types/construction/MechConfigurationSystem';
import { TechBase, RulesLevel } from '@/types/enums';
import { EquipmentCategory } from '@/types/equipment';

const laser = {
  id: 'small-laser',
  name: 'Small Laser',
  category: EquipmentCategory.ENERGY_WEAPON,
  techBase: TechBase.INNER_SPHERE,
  rulesLevel: RulesLevel.STANDARD,
  weight: 0.5,
  criticalSlots: 1,
  costCBills: 11250,
  battleValue: 9,
  introductionYear: 2300,
};

test('configuration changes atomically unassign removed limbs and clear their armor', () => {
  const store = createNewUnitStore({
    name: 'Configuration test',
    tonnage: 50,
    techBase: TechBase.INNER_SPHERE,
  });
  const id = store.getState().addEquipment(laser);
  store.getState().updateEquipmentLocation(id, MechLocation.LEFT_ARM, [4]);
  store.getState().setLocationArmor(MechLocation.LEFT_ARM, 10);
  store.getState().setLocationArmor(MechLocation.CENTER_TORSO, 20, 5);
  store.getState().setConfiguration(MechConfiguration.QUAD);
  expect(store.getState().equipment[0].location).toBeUndefined();
  expect(store.getState().equipment[0].slots).toEqual([]);
  expect(store.getState().armorAllocation[MechLocation.LEFT_ARM]).toBe(0);
  expect(store.getState().armorAllocation[MechLocation.CENTER_TORSO]).toBe(20);
  expect(store.getState().armorAllocation.centerTorsoRear).toBe(5);
  store.getState().setConfiguration(MechConfiguration.TRIPOD);
  expect(store.getState().equipment).toHaveLength(1);
});

test('tonnage crosses the superheavy boundary in both directions at the store boundary', () => {
  const store = createNewUnitStore({
    name: 'Tonnage test',
    tonnage: 100,
    techBase: TechBase.INNER_SPHERE,
  });
  store.getState().setTonnage(105);
  expect(store.getState().cockpitType).toBe(CockpitType.SUPER_HEAVY);
  expect(store.getState().gyroType).toBe(GyroType.SUPERHEAVY);
  store.getState().setTonnage(100);
  expect(store.getState().cockpitType).toBe(CockpitType.STANDARD);
  expect(store.getState().gyroType).toBe(GyroType.STANDARD);
});
