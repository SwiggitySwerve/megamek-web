import { createStore } from 'zustand/vanilla';

import type { TabInfo } from '@/stores/useTabManagerStore';

import { getAerospaceStore } from '@/stores/aerospaceStoreRegistry';
import { getUnitStore } from '@/stores/unitStoreRegistry';
import { getVehicleStore } from '@/stores/vehicleStoreRegistry';
import { TechBaseMode } from '@/types/construction/TechBaseConfiguration';
import { TechBase } from '@/types/enums/TechBase';
import { UnitType } from '@/types/unit/BattleMechInterfaces';

import {
  getTabDisplayState,
  subscribeToTabDisplayState,
} from '../MultiUnitTabsUnitState';

jest.mock('@/stores/aerospaceStoreRegistry', () => ({
  getAerospaceStore: jest.fn(),
}));
jest.mock('@/stores/battleArmorStoreRegistry', () => ({
  getBattleArmorStore: jest.fn(),
}));
jest.mock('@/stores/infantryStoreRegistry', () => ({
  getInfantryStore: jest.fn(),
}));
jest.mock('@/stores/protoMechStoreRegistry', () => ({
  getProtoMechStore: jest.fn(),
}));
jest.mock('@/stores/unitStoreRegistry', () => ({ getUnitStore: jest.fn() }));
jest.mock('@/stores/vehicleStoreRegistry', () => ({
  getVehicleStore: jest.fn(),
}));

const UNIT_ID = 'alias-unit';
const runtimeStore = {
  getState: () => ({ name: 'Runtime Unit', isModified: true }),
};

function tab(unitType: UnitType): TabInfo {
  return {
    id: UNIT_ID,
    name: 'Cached Unit',
    tonnage: 50,
    techBase: TechBase.INNER_SPHERE,
    unitType,
  };
}

beforeEach(() => jest.clearAllMocks());

describe('MultiUnitTabsUnitState family dispatch', () => {
  it('reads support vehicles from the vehicle store registry', () => {
    (getVehicleStore as jest.Mock).mockReturnValue(runtimeStore);

    expect(getTabDisplayState(tab(UnitType.SUPPORT_VEHICLE))).toEqual({
      id: UNIT_ID,
      name: 'Runtime Unit',
      isModified: true,
      techBaseMode: TechBaseMode.INNER_SPHERE,
    });
    expect(getVehicleStore).toHaveBeenCalledWith(UNIT_ID);
    expect(getUnitStore).not.toHaveBeenCalled();
  });

  it.each([
    UnitType.SMALL_CRAFT,
    UnitType.DROPSHIP,
    UnitType.JUMPSHIP,
    UnitType.WARSHIP,
    UnitType.SPACE_STATION,
  ])('reads %s from the aerospace store registry', (unitType) => {
    (getAerospaceStore as jest.Mock).mockReturnValue(runtimeStore);

    expect(getTabDisplayState(tab(unitType)).isModified).toBe(true);
    expect(getAerospaceStore).toHaveBeenCalledWith(UNIT_ID);
    expect(getUnitStore).not.toHaveBeenCalled();
  });
});

it('updates open-unit identity for edits and releases its subscription', () => {
  const store = createStore(() => ({
    name: 'Atlas',
    isModified: false,
    techBaseMode: TechBaseMode.INNER_SPHERE,
    tonnage: 100,
  }));
  (getUnitStore as jest.Mock).mockReturnValue(store);
  const changed = jest.fn();
  const stop = subscribeToTabDisplayState(tab(UnitType.BATTLEMECH), changed);
  store.setState({ tonnage: 95 });
  expect(changed).not.toHaveBeenCalled();
  store.setState({ techBaseMode: TechBaseMode.CLAN, isModified: true });
  expect(changed).toHaveBeenCalledTimes(1);
  expect(getTabDisplayState(tab(UnitType.BATTLEMECH))).toMatchObject({
    techBaseMode: TechBaseMode.CLAN,
    isModified: true,
  });
  stop();
  store.setState({ name: 'Unobserved edit' });
  expect(changed).toHaveBeenCalledTimes(1);
});
