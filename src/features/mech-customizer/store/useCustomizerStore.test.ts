import { webcrypto } from 'crypto';
import { DEFAULT_MECH_STATE, IMechLabState } from '../../mech-lab/store/MechLabState';
import { WEAPONS_DB } from '../../../data/weapons';
import { useCustomizerStore } from './useCustomizerStore';

// Ensure crypto.randomUUID exists in the Jest environment
if (typeof globalThis.crypto === 'undefined') {
  Object.defineProperty(globalThis, 'crypto', {
    value: webcrypto,
    configurable: false,
    writable: false,
  });
}

const freshState = (): IMechLabState =>
  JSON.parse(JSON.stringify(DEFAULT_MECH_STATE)) as IMechLabState;

describe('useCustomizerStore', () => {
  afterEach(() => {
    const { loadUnit } = useCustomizerStore.getState();
    loadUnit(freshState());
    useCustomizerStore.setState({
      activeTab: 'overview',
      isEquipmentTrayExpanded: false,
      isDebugVisible: false,
    });
  });

  it('updates tonnage and derived metrics when setters run', () => {
    const store = useCustomizerStore.getState();
    store.setTonnage(55);

    const nextState = useCustomizerStore.getState();
    expect(nextState.unit.tonnage).toBe(55);
    expect(nextState.metrics.structureWeight).toBeCloseTo(5.5);
  });

  it('adds equipment and reflects the new weight in metrics', () => {
    const weapon = WEAPONS_DB[0];
    const store = useCustomizerStore.getState();
    store.addEquipment(weapon.id);

    const nextState = useCustomizerStore.getState();
    expect(nextState.unit.equipment).toHaveLength(1);
    expect(nextState.metrics.equipmentWeight).toBeCloseTo(weapon.weight);
  });

  it('resets only the equipment when requested', () => {
    const weapon = WEAPONS_DB[0];
    const store = useCustomizerStore.getState();
    store.addEquipment(weapon.id);

    const result = store.resetUnit('equipment');
    expect(result.removedEquipment).toBe(1);
    expect(useCustomizerStore.getState().unit.equipment).toHaveLength(0);
    expect(useCustomizerStore.getState().unit.structureType).toBe(DEFAULT_MECH_STATE.structureType);
  });

  it('updates armor allocation segments', () => {
    const store = useCustomizerStore.getState();
    store.setArmorAllocation('CT', { front: 10, rear: 5 });
    const segment = useCustomizerStore.getState().unit.armorAllocation.CT;
    expect(segment.front).toBe(10);
    expect(segment.rear).toBe(5);
  });
});

