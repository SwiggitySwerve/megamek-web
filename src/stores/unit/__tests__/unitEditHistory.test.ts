import { MechLocation } from '@/types/construction/CriticalSlotAllocation';
import { EngineType } from '@/types/construction/EngineType';
import { RulesLevel } from '@/types/enums/RulesLevel';
import { TechBase } from '@/types/enums/TechBase';
import { EquipmentCategory, type IEquipmentItem } from '@/types/equipment';
import { Era } from '@/types/temporal/Era';
import { serializeCustomUnitState } from '@/utils/serialization/CustomUnitSerializer';

import { getUnitEditHistory, runUnitEditTransaction } from '../unitEditHistory';
import {
  getEditableUnitSnapshot,
  getUnitLibraryFingerprint,
  recordUnitLibrarySave,
} from '../unitEditSnapshot';
import { createNewUnitStore, createUnitStore } from '../useUnitStore';

const makeStore = () => {
  const store = createNewUnitStore({
    name: 'Test Mech',
    tonnage: 75,
    techBase: TechBase.INNER_SPHERE,
  });
  store.getState().markModified(false);
  return store;
};
const laser: IEquipmentItem = {
  id: 'medium-laser',
  name: 'Medium Laser',
  category: EquipmentCategory.ENERGY_WEAPON,
  techBase: TechBase.INNER_SPHERE,
  rulesLevel: RulesLevel.STANDARD,
  weight: 1,
  criticalSlots: 1,
  costCBills: 40000,
  battleValue: 46,
  introductionYear: 2300,
};
const serialized = (store: ReturnType<typeof makeStore>) =>
  serializeCustomUnitState(store.getState(), {
    id: store.getState().id,
    chassis: store.getState().chassis,
    variant: store.getState().model,
    era: Era.LATE_SUCCESSION_WARS,
  });

beforeEach(() => localStorage.clear());

it('undoes and redoes engine cascades and compound armor operations with complete serialized construction', () => {
  const store = makeStore();
  const history = getUnitEditHistory(store);
  const baseline = serialized(store);
  store.getState().setEngineType(EngineType.XL_IS);
  const engine = serialized(store);
  store.getState().clearAllArmor();
  const cleared = serialized(store);
  store.getState().autoAllocateArmor();
  const allocated = serialized(store);
  expect(allocated).not.toEqual(cleared);
  expect(history.getState().undoLabel).toBe('Auto-allocate armor');
  history.getState().undo();
  expect(serialized(store)).toEqual(cleared);
  history.getState().undo();
  expect(serialized(store)).toEqual(engine);
  history.getState().undo();
  expect(serialized(store)).toEqual(baseline);
  expect(store.getState().isModified).toBe(false);
  expect(history.getState().canUndo).toBe(false);
  history.getState().redo();
  history.getState().redo();
  history.getState().redo();
  expect(serialized(store)).toEqual(allocated);
});

it('preserves equipment instance IDs, mount slots, derived item data and independent unit histories', () => {
  const one = makeStore(),
    two = makeStore(),
    history = getUnitEditHistory(one);
  const id = one.getState().addEquipment(laser);
  expect(typeof id).toBe('string');
  one.getState().updateEquipmentLocation(id, MechLocation.LEFT_ARM, [4]);
  const mounted = serialized(one),
    equipment = one.getState().equipment;
  one.getState().removeEquipment(id);
  two.getState().setEngineRating(375);
  history.getState().undo();
  expect(serialized(one)).toEqual(mounted);
  expect(one.getState().equipment).toEqual(equipment);
  history.getState().undo();
  expect(one.getState().equipment[0].location).toBeUndefined();
  history.getState().redo();
  expect(serialized(one)).toEqual(mounted);
  expect(two.getState().engineRating).toBe(375);
  expect(getUnitEditHistory(two).getState().canUndo).toBe(true);
});

it('restores optional fields and nested changes once while preserving draft identity and library receipt', () => {
  const store = makeStore(),
    history = getUnitEditHistory(store),
    original = store.getState();
  recordUnitLibrarySave(store, { id: 'saved-1', version: 2 }, original);
  runUnitEditTransaction(store, 'Restore v1', () => {
    store.getState().setRole('Scout');
    store.getState().updateFluff({ overview: 'Changed' });
    store.getState().setEngineRating(375);
  });
  history.getState().undo();
  expect(store.getState().role).toBe(original.role);
  expect(store.getState().fluff).toEqual(original.fluff);
  expect(store.getState().id).toBe(original.id);
  expect(store.getState().librarySave?.version).toBe(2);
  expect(store.getState().isModified).toBe(false);
  expect(history.getState().canUndo).toBe(false);
});

it('ignores no-ops, clears redo on a new branch, and caps undo at 50 operations', () => {
  const store = makeStore(),
    history = getUnitEditHistory(store);
  store.getState().setEngineRating(store.getState().engineRating);
  expect(history.getState().canUndo).toBe(false);
  expect(store.getState().isModified).toBe(false);
  store.getState().setYear(3030);
  history.getState().undo();
  store.getState().setYear(3040);
  expect(history.getState().canRedo).toBe(false);
  for (let n = 0; n < 55; n++) store.getState().setYear(3100 + n);
  for (let n = 0; n < 50; n++) history.getState().undo();
  expect(store.getState().year).toBe(3104);
  expect(history.getState().canUndo).toBe(false);
});

it('keeps saved receipts across undo and reload, and compares against the actual submitted save during a race', () => {
  const store = makeStore(),
    history = getUnitEditHistory(store);
  store.getState().setYear(3030);
  const submitted = store.getState();
  store.getState().setYear(3040);
  recordUnitLibrarySave(store, { id: 'saved-1', version: 3 }, submitted);
  expect(store.getState().isModified).toBe(true);
  history.getState().undo();
  expect(store.getState().isModified).toBe(false);
  history.getState().undo();
  expect(store.getState().isModified).toBe(true);
  expect(store.getState().librarySave?.version).toBe(3);
  const persisted = JSON.parse(
    localStorage.getItem(`megamek-unit-${store.getState().id}`)!,
  ).state;
  const cold = createUnitStore({ ...store.getState(), ...persisted });
  expect(getUnitEditHistory(cold).getState().canUndo).toBe(false);
  expect(getEditableUnitSnapshot(cold.getState())).toEqual(
    getEditableUnitSnapshot(store.getState()),
  );
  expect(cold.getState().librarySave?.fingerprint).toBe(
    getUnitLibraryFingerprint(submitted),
  );
});

it('retains recovery after a failed draft write and does not publish unchanged controls', () => {
  const store = makeStore(),
    history = getUnitEditHistory(store),
    initialYear = store.getState().year;
  const notifications = jest.fn();
  history.subscribe(notifications);
  store.getState().setYear(initialYear);
  expect(notifications).not.toHaveBeenCalled();
  const write = jest
    .spyOn(Storage.prototype, 'setItem')
    .mockImplementation(() => {
      throw new DOMException('Full', 'QuotaExceededError');
    });
  expect(() => store.getState().setYear(3040)).toThrow('Full');
  expect(store.getState().year).toBe(3040);
  expect(history.getState().canUndo).toBe(true);
  write.mockRestore();
  history.getState().undo();
  expect(store.getState().year).toBe(initialYear);
  expect(
    JSON.parse(localStorage.getItem(`megamek-unit-${store.getState().id}`)!)
      .state.year,
  ).toBe(initialYear);
});

it('compares library construction without temporary IDs while preserving unsaved draft fields', () => {
  const store = makeStore();
  store.getState().addEquipment(laser);
  const saved = store.getState();
  recordUnitLibrarySave(store, { id: 'saved-1', version: 1 }, saved);
  expect(store.getState().isModified).toBe(false);
  const history = getUnitEditHistory(store);
  runUnitEditTransaction(store, 'Restore v1', () =>
    store.setState({
      equipment: store.getState().equipment.map((item) => ({
        ...item,
        instanceId: 'new-session-' + item.instanceId,
      })),
    }),
  );
  expect(getUnitLibraryFingerprint(store.getState())).toBe(
    getUnitLibraryFingerprint(saved),
  );
  expect(store.getState().isModified).toBe(false);
  expect(history.getState().canUndo).toBe(true);
  history.getState().undo();
  expect(store.getState().isModified).toBe(false);
  store.getState().setArmorTonnage(saved.armorTonnage + 0.5);
  expect(store.getState().isModified).toBe(true);
  history.getState().undo();
  expect(store.getState().isModified).toBe(false);
});

it('undoes a pre-save edit without wiping the designation assigned by save', () => {
  const store = makeStore(),
    history = getUnitEditHistory(store);
  const previousYear = store.getState().year;
  store.getState().setYear(3040);
  store.setState({
    chassis: 'Atlas',
    model: 'RECOVERY',
    name: 'Atlas RECOVERY',
  });
  recordUnitLibrarySave(
    store,
    { id: 'saved-variant', version: 1 },
    store.getState(),
  );
  const receipt = store.getState().librarySave;
  history.getState().undo();
  expect(store.getState()).toMatchObject({
    year: previousYear,
    chassis: 'Atlas',
    model: 'RECOVERY',
    name: 'Atlas RECOVERY',
    librarySave: receipt,
    isModified: true,
  });
  history.getState().redo();
  expect(store.getState()).toMatchObject({
    year: 3040,
    model: 'RECOVERY',
    name: 'Atlas RECOVERY',
    isModified: false,
  });
});
