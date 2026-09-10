import { VALID_COMBAT_LIFECYCLE_EVENT_PAYLOADS } from '@/lib/events/replay/__fixtures__/CombatLifecycleBaselineSchemaPack.fixture';
import {
  GameEventType,
  GamePhase,
  GameSide,
  type IGameCreatedPayload,
  type IGameEvent,
} from '@/types/gameplay';
import { deriveState } from '@/utils/gameplay/gameState';

import { filterEventForPlayer, filterEventForSpectator } from '../fogOfWar';

function fixture() {
  const baseline = JSON.parse(
    JSON.stringify(VALID_COMBAT_LIFECYCLE_EVENT_PAYLOADS.game_created),
  ) as IGameCreatedPayload;
  const event = {
    id: 'creation',
    gameId: 'custom-fog',
    sequence: 0,
    timestamp: '2026-09-09T00:00:00.000Z',
    type: GameEventType.GameCreated,
    turn: 0,
    phase: GamePhase.Initiative,
    payload: {
      ...baseline,
      units: [
        {
          ...baseline.units[0],
          id: 'owner-unit',
          side: GameSide.Player,
          unitRef: 'custom-owner',
          customUnitDefinition: {
            id: 'custom-owner',
            privateMarker: 'owner-construction',
          },
        },
        {
          ...baseline.units[0],
          id: 'opponent-unit',
          side: GameSide.Opponent,
          unitRef: 'custom-opponent',
          customUnitDefinition: {
            id: 'custom-opponent',
            privateMarker: 'opponent-construction',
          },
        },
      ],
    },
  } as unknown as IGameEvent;
  const state = {
    ...deriveState(event.gameId, [event]),
    sideOwners: { [GameSide.Player]: 'owner', [GameSide.Opponent]: 'opponent' },
  };
  return { event, state };
}

describe('custom construction visibility', () => {
  it.each(['owner', 'opponent'])(
    'reveals only %s construction even when the other unit is visible',
    (viewer) => {
      const { event, state } = fixture();
      const original = JSON.stringify(event);
      const filtered = filterEventForPlayer(event, viewer, state, {
        fogOfWar: true,
        canSeeUnit: () => true,
      });
      expect(JSON.stringify(filtered)).toContain(`${viewer}-construction`);
      expect(JSON.stringify(filtered)).not.toContain(
        `${viewer === 'owner' ? 'opponent' : 'owner'}-construction`,
      );
      expect(
        (filtered?.payload as IGameCreatedPayload).units.map((unit) => unit.id),
      ).toEqual(['owner-unit', 'opponent-unit']);
      expect(JSON.stringify(event)).toBe(original);
    },
  );

  it('redacts both snapshots for spectator and unknown audiences', () => {
    const { event, state } = fixture();
    const spectator = filterEventForSpectator(event, state, { fogOfWar: true });
    const unknown = filterEventForPlayer(event, 'unknown', state, {
      fogOfWar: true,
    });
    for (const projected of [spectator, unknown]) {
      expect(projected).not.toBeNull();
      expect(JSON.stringify(projected)).not.toContain('customUnitDefinition');
      expect((projected?.payload as IGameCreatedPayload).units).toHaveLength(2);
    }
  });

  it('preserves the existing full-visibility contract when fog is off', () => {
    const { event, state } = fixture();
    expect(
      filterEventForPlayer(event, 'owner', state, { fogOfWar: false }),
    ).toBe(event);
    expect(filterEventForSpectator(event, state, { fogOfWar: false })).toBe(
      event,
    );
  });
});
