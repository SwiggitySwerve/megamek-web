import { projectCustomCombatSnapshot } from '@/types/contracts/CustomCombatSnapshot';

import atlas from '../../../../../public/data/units/battlemechs/2-star-league/standard/Atlas AS7-D.json';
import { VALID_COMBAT_LIFECYCLE_EVENT_PAYLOADS } from '../__fixtures__/CombatLifecycleBaselineSchemaPack.fixture';
import { COMBAT_LIFECYCLE_BASELINE_SCHEMA_PACK } from '../CombatLifecycleBaselineSchemaPack';
import { ReplaySchemaRegistry } from '../ReplaySchemaRegistry';

type RecordValue = Record<string, unknown>;
const registry = new ReplaySchemaRegistry({
  events: COMBAT_LIFECYCLE_BASELINE_SCHEMA_PACK,
});
function fixture() {
  const payload = JSON.parse(
    JSON.stringify(VALID_COMBAT_LIFECYCLE_EVENT_PAYLOADS.game_created),
  ) as RecordValue;
  const snapshot = projectCustomCombatSnapshot({
    ...atlas,
    id: 'custom-recorded-atlas',
  });
  if (!snapshot)
    throw new Error('Expected a supported Atlas construction fixture');
  const unit = (payload.units as RecordValue[])[0];
  unit.unitRef = snapshot.id;
  unit.customUnitDefinition = snapshot;
  return { payload, unit, snapshot };
}

describe('recorded custom construction replay', () => {
  it('accepts recorded construction and preserves the distinct game identity', () => {
    const { payload, unit, snapshot } = fixture();
    expect(unit.id).not.toBe(snapshot.id);
    expect(registry.upcast('game_created', 1, payload).payload).toEqual(
      payload,
    );
  });

  it.each([
    'root',
    'engine',
    'gyro',
    'structure',
    'heatSinks',
    'armor',
    'movement',
    'equipment',
  ])('rejects unrecorded keys on %s', (location) => {
    const { payload, snapshot } = fixture();
    const record = snapshot as RecordValue;
    const target =
      location === 'root'
        ? record
        : location === 'equipment'
          ? (record.equipment as RecordValue[])[0]
          : (record[location] as RecordValue);
    target.unrecorded = true;
    expect(() => registry.upcast('game_created', 1, payload)).toThrow();
  });

  it.each(['custom-other-design', 'atlas-as7-d'])(
    'refuses a snapshot paired with source %s',
    (unitRef) => {
      const { payload, unit } = fixture();
      unit.unitRef = unitRef;
      expect(() => registry.upcast('game_created', 1, payload)).toThrow();
    },
  );

  it('keeps canonical history readable while invalidating its older parser fingerprint', () => {
    const legacy = VALID_COMBAT_LIFECYCLE_EVENT_PAYLOADS.game_created;
    expect(registry.upcast('game_created', 1, legacy).payload).toEqual(legacy);
    const oldIdentity = new ReplaySchemaRegistry({
      events: COMBAT_LIFECYCLE_BASELINE_SCHEMA_PACK.map((event) => ({
        ...event,
        schemas: event.schemas.map((schema) => ({
          ...schema,
          schemaId: `combat.${event.eventType}.v1`,
        })),
      })),
    });
    const history = [{ eventType: 'game_created', schemaVersion: 1 }];
    expect(registry.fingerprintPipeline(history)).not.toBe(
      oldIdentity.fingerprintPipeline(history),
    );
  });
});
