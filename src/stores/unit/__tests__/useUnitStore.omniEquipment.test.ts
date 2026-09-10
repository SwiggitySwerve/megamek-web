import type { IMountedEquipmentInstance } from '@/types/equipment/MountedEquipment';

import { createNewUnitStore } from '@/stores/unit/useUnitStore';
import { MechLocation } from '@/types/construction';
import { TechBase } from '@/types/enums/TechBase';
import { EquipmentCategory } from '@/types/equipment';
import { compactEquipmentSlots } from '@/utils/construction/slotOperations';

const mounted: IMountedEquipmentInstance = {
  instanceId: 'fixed-laser',
  equipmentId: 'medium-laser',
  name: 'Medium Laser',
  category: EquipmentCategory.ENERGY_WEAPON,
  weight: 1,
  criticalSlots: 1,
  heat: 3,
  techBase: TechBase.INNER_SPHERE,
  location: MechLocation.LEFT_ARM,
  slots: [5],
  isRearMounted: false,
  isRemovable: true,
  isOmniPodMounted: false,
};

function createStore(isOmni = true, item = mounted) {
  const store = createNewUnitStore({
    name: 'Omni boundary',
    tonnage: 50,
    techBase: TechBase.INNER_SPHERE,
  });
  store.setState({ isOmni, equipment: [item], isModified: false });
  return store;
}

describe('fixed OmniMech equipment mutation boundary', () => {
  it.each(['unassign', 'relocate', 'bulk', 'remove', 'clear'] as const)(
    'rejects %s without dirtying a fixed mount',
    (command) => {
      const store = createStore();
      const before = store.getState();
      if (command === 'unassign')
        before.clearEquipmentLocation(mounted.instanceId);
      if (command === 'relocate') {
        before.updateEquipmentLocation(
          mounted.instanceId,
          MechLocation.RIGHT_ARM,
          [4],
        );
      }
      if (command === 'bulk') {
        before.bulkUpdateEquipmentLocations([
          {
            instanceId: mounted.instanceId,
            location: MechLocation.RIGHT_ARM,
            slots: [4],
          },
        ]);
      }
      if (command === 'remove') before.removeEquipment(mounted.instanceId);
      if (command === 'clear') before.clearAllEquipment();
      expect(store.getState().equipment).toEqual([mounted]);
      expect(store.getState().isModified).toBe(false);
      expect(store.getState().lastModifiedAt).toBe(before.lastModifiedAt);
    },
  );

  it.each([
    { isOmni: false, isOmniPodMounted: false },
    { isOmni: true, isOmniPodMounted: true },
  ])('preserves movable behavior for %o', ({ isOmni, isOmniPodMounted }) => {
    const store = createStore(isOmni, { ...mounted, isOmniPodMounted });
    store
      .getState()
      .updateEquipmentLocation(mounted.instanceId, MechLocation.RIGHT_ARM, [4]);
    expect(store.getState().equipment[0]).toMatchObject({
      location: MechLocation.RIGHT_ARM,
      slots: [4],
    });
    store.getState().clearEquipmentLocation(mounted.instanceId);
    expect(store.getState().equipment[0].location).toBeUndefined();
    expect(store.getState().equipment[0].slots).toBeUndefined();
    expect(store.getState().isModified).toBe(true);
  });

  it('allows initial placement of an unassigned fixed item', () => {
    const store = createStore(true, {
      ...mounted,
      location: undefined,
      slots: undefined,
    });
    store
      .getState()
      .updateEquipmentLocation(mounted.instanceId, MechLocation.LEFT_ARM, [5]);
    expect(store.getState().equipment[0]).toEqual(mounted);
  });

  it('keeps fixed mounts while a bulk action updates pod equipment', () => {
    const store = createStore();
    const pod = { ...mounted, instanceId: 'pod-laser', isOmniPodMounted: true };
    store.setState({ equipment: [mounted, pod] });
    store.getState().bulkUpdateEquipmentLocations([
      {
        instanceId: mounted.instanceId,
        location: MechLocation.RIGHT_ARM,
        slots: [4],
      },
      {
        instanceId: pod.instanceId,
        location: MechLocation.RIGHT_ARM,
        slots: [5],
      },
    ]);
    expect(store.getState().equipment[0]).toEqual(mounted);
    expect(store.getState().equipment[1]).toMatchObject({
      location: MechLocation.RIGHT_ARM,
      slots: [5],
    });
  });
});

it('does not place pod equipment into a preserved fixed mount during compaction', () => {
  const store = createStore();
  const pod = {
    ...mounted,
    instanceId: 'pod',
    slots: [6],
    isOmniPodMounted: true,
  };
  store.setState({ equipment: [mounted, pod] });
  const before = store.getState();
  const result = compactEquipmentSlots(
    before.equipment,
    before.engineType,
    before.gyroType,
    before.configuration,
  );
  before.bulkUpdateEquipmentLocations(result.assignments);
  const [fixed, updatedPod] = store.getState().equipment;
  expect(fixed).toEqual(mounted);
  expect(updatedPod.slots?.some((slot) => fixed.slots?.includes(slot))).toBe(
    false,
  );
});
