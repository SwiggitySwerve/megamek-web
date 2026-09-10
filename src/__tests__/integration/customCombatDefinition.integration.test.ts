import type { NextApiRequest, NextApiResponse } from 'next';

import { createMocks } from 'node-mocks-http';

import type { IGameEvent } from '@/types/gameplay';

import { adaptUnit } from '@/engine/adapters/CompendiumAdapter';
import { deriveCombatSeededGameUnits } from '@/engine/combatSeedDerivation';
import { deriveAdaptedUnitsFromSession } from '@/engine/InteractiveSession.recovery';
import {
  admitRosterUnitSource,
  readyCanonicalCatalog,
  fetchCanonicalCatalogSnapshot,
} from '@/lib/campaign/readiness/canonicalCatalogAdmission';
import { VALID_COMBAT_LIFECYCLE_EVENT_PAYLOADS } from '@/lib/events/replay/__fixtures__/CombatLifecycleBaselineSchemaPack.fixture';
import { gateReplaySurfaceHistory } from '@/lib/events/replay/ReplaySurfaceGate';
import catalogHandler from '@/pages/api/units/custom/combat-catalog';
import {
  getSQLiteService,
  resetSQLiteService,
} from '@/services/persistence/SQLiteService';
import { parseCustomCombatDefinition } from '@/services/units/customCombatDefinition';
import {
  readServerCustomCombatDefinition,
  listServerCustomCombatRefs,
} from '@/services/units/serverCustomCombatDefinition';
import {
  getUnitRepository,
  resetUnitRepository,
} from '@/services/units/UnitRepository';
import {
  GameSide,
  type IGameUnit,
  type IGameSession,
} from '@/types/gameplay/GameSessionInterfaces';

import atlas from '../../../public/data/units/battlemechs/2-star-league/standard/Atlas AS7-D.json';

beforeEach(() => {
  resetUnitRepository();
  resetSQLiteService();
  getSQLiteService({ path: ':memory:' }).initialize();
});
afterEach(() => {
  resetUnitRepository();
  resetSQLiteService();
});

function save(data: Record<string, unknown>, variant = 'Workbench') {
  const result = getUnitRepository().create({
    chassis: 'Atlas',
    variant,
    data,
  });
  if (!result.success || !result.data) throw new Error('Save failed');
  return result.data.id;
}

it('reads server construction, seeds the exact runtime unit, recovers it, remains stable after library editing and deletion', async () => {
  const id = save({
    ...atlas,
    id: 'custom-forged-inner-id',
    armor: {
      ...atlas.armor,
      allocation: { ...atlas.armor.allocation, LEFT_ARM: 30 },
    },
    equipment: [...atlas.equipment, { id: 'medium-laser', location: 'HEAD' }],
  });
  expect(id.startsWith('custom-')).toBe(true);
  expect(id).not.toBe('custom-forged-inner-id');
  const definition = readServerCustomCombatDefinition(id);
  expect(definition).toMatchObject({ id, variant: 'Workbench' });
  expect(definition?.id).not.toBe('custom-forged-inner-id');
  expect(
    parseCustomCombatDefinition({ ...atlas, id }, 'custom-other'),
  ).toBeNull();
  expect(listServerCustomCombatRefs()).toEqual([id]);
  expect(
    listServerCustomCombatRefs().every((ref) => ref.startsWith('custom-')),
  ).toBe(true);

  const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
    method: 'GET',
  });
  catalogHandler(req, res);
  expect(res._getStatusCode()).toBe(200);
  expect(JSON.parse(res._getData())).toEqual({ customCombatRefs: [id] });

  const catalog = {
    ...readyCanonicalCatalog([atlas.id]),
    status: 'ready' as const,
    unitRefs: new Set([atlas.id]),
    customCombatRefs: new Set([id]),
  };
  expect(
    admitRosterUnitSource({
      unitId: 'roster-1',
      unitName: 'Atlas',
      unitSource: 'custom',
      unitRef: id,
      catalog,
    }),
  ).toEqual({ admitted: true });
  expect(
    admitRosterUnitSource({
      unitId: 'roster-1',
      unitName: 'Atlas',
      unitSource: 'canonical',
      unitRef: id,
      catalog,
    }),
  ).toMatchObject({ admitted: false });
  const runtime = {
    id: 'battle-instance',
    unitRef: id,
    side: GameSide.Player,
  } as IGameUnit;
  const units = await deriveCombatSeededGameUnits(
    [runtime],
    readServerCustomCombatDefinition,
  );
  expect(units[0]).toMatchObject({
    id: 'battle-instance',
    unitRef: id,
    armorByLocation: { left_arm: 30 },
    heatSinks: 20,
  });
  const created = {
    id: 'custom-created',
    gameId: 'custom-match',
    sequence: 0,
    timestamp: '2026-09-09T00:00:00.000Z',
    type: 'game_created',
    turn: 0,
    phase: 'initiative',
    payload: {
      ...(VALID_COMBAT_LIFECYCLE_EVENT_PAYLOADS.game_created as Record<
        string,
        unknown
      >),
      units: units.map((unit) => ({
        ...unit,
        name: 'Atlas',
        pilotRef: 'pilot',
        gunnery: 4,
        piloting: 5,
      })),
    },
  } as unknown as IGameEvent;
  const gate = (event: IGameEvent) =>
    gateReplaySurfaceHistory([event], {
      surfaceId: 'cold-recovery',
      streamId: 'custom-match',
      formatId: 'match-log-idb',
      formatVersion: 2,
    });
  expect(gate(created).kind).toBe('accepted');
  for (const patch of [
    { unrecorded: true },
    { movement: { walk: 3, jump: 0, unrecorded: true } },
    {
      armor: {
        type: 'STANDARD',
        allocation: { LEFT_ARM: { front: 30, rear: 0, unrecorded: true } },
      },
    },
  ]) {
    const malformed = JSON.parse(JSON.stringify(created));
    Object.assign(malformed.payload.units[0].customUnitDefinition, patch);
    expect(gate(malformed).kind).toBe('blocked');
  }
  const recovered = await deriveAdaptedUnitsFromSession(
    { units } as IGameSession,
    readServerCustomCombatDefinition,
  );
  expect(recovered[0]).toMatchObject({
    id: 'battle-instance',
    armor: { left_arm: 30 },
    walkMP: 3,
    runMP: 5,
    heatSinks: 20,
  });
  expect(recovered[0].weapons.length).toBeGreaterThan(atlas.equipment.length);
  expect(
    getUnitRepository().update(id, {
      data: {
        ...atlas,
        movement: { walk: 6, jump: 0 },
        heatSinks: { type: 'SINGLE', count: 10 },
        equipment: [],
      },
    }).success,
  ).toBe(true);
  expect(
    await deriveAdaptedUnitsFromSession(
      { units } as IGameSession,
      readServerCustomCombatDefinition,
    ),
  ).toEqual(recovered);
  getUnitRepository().delete(id);
  expect(listServerCustomCombatRefs()).toEqual([]);
  await expect(
    deriveCombatSeededGameUnits([runtime], readServerCustomCombatDefinition),
  ).rejects.toThrow(/Saved custom/);
  await expect(
    deriveAdaptedUnitsFromSession(
      { units } as IGameSession,
      readServerCustomCombatDefinition,
    ),
  ).resolves.toEqual(recovered);
});

it('does not grant eligibility from saved metadata with missing construction or unsupported chassis topology', async () => {
  const invalid = save({ ...atlas, movement: undefined }, 'Incomplete');
  const unsupported = save({ ...atlas, configuration: 'Quad' }, 'Quad');
  expect(listServerCustomCombatRefs()).toEqual([]);
  for (const id of [invalid, unsupported]) {
    await expect(
      adaptUnit(id, {}, readServerCustomCombatDefinition),
    ).rejects.toThrow(/Saved custom/);
  }
});

it('keeps custom eligibility unavailable when the API is malformed or offline without losing canonical entries', async () => {
  for (const customResponse of [
    { ok: false },
    { ok: true, json: async () => ({ customCombatRefs: ['atlas-as7-d'] }) },
  ]) {
    const fetchImpl = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: [{ id: atlas.id }] }),
      })
      .mockResolvedValueOnce(customResponse);
    const catalog = await fetchCanonicalCatalogSnapshot(
      fetchImpl as typeof fetch,
    );
    expect(catalog).toMatchObject({
      status: 'ready',
      unitRefs: new Set([atlas.id]),
    });
    expect(
      admitRosterUnitSource({
        unitId: 'r',
        unitName: 'Saved',
        unitRef: 'custom-missing',
        unitSource: 'custom',
        catalog,
      }),
    ).toMatchObject({ admitted: false });
  }
});
