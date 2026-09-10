import { render, screen } from '@testing-library/react';
import React from 'react';

import type { IBattle } from '@/components/simulation-viewer/pages/encounter-history/types';

import { EventTimelineSection } from '../EventTimelineSection';

function makeBattle(id: string, unitName: string): IBattle {
  return {
    id,
    missionId: 'm1',
    missionName: 'Name lookup',
    timestamp: '2025-01-01T00:00:00Z',
    duration: 60,
    outcome: 'victory',
    forces: {
      player: {
        units: [
          {
            id: 'u1',
            name: unitName,
            pilot: 'Test Pilot',
            status: 'operational',
          },
        ],
        totalBV: 1000,
      },
      enemy: {
        units: [
          {
            id: 'e1',
            name: 'OpFor',
            pilot: 'Enemy',
            status: 'destroyed',
          },
        ],
        totalBV: 1000,
      },
    },
    damageMatrix: {
      attackers: ['u1'],
      targets: ['e1'],
      cells: [],
    },
    keyMoments: [],
    events: [
      {
        id: `ev-${id}`,
        turn: 1,
        phase: 'Movement',
        timestamp: 1,
        type: 'movement',
        description: 'Unit advances',
        involvedUnits: ['u1'],
      },
    ],
    stats: { totalKills: 0, totalDamage: 0, unitsLost: 0 },
  };
}

describe('EventTimelineSection', () => {
  it('resolves unit display names from the currently selected battle', () => {
    const onTurnChange = jest.fn();
    const firstBattle = makeBattle('battle-a', 'Atlas AS7-D');
    const secondBattle = makeBattle('battle-b', 'Locust LCT-1V');

    const { rerender } = render(
      <EventTimelineSection
        battle={firstBattle}
        currentTurn={1}
        onTurnChange={onTurnChange}
      />,
    );

    expect(
      screen.getByTestId('virtualized-event-ev-battle-a'),
    ).toHaveTextContent('Atlas AS7-D');
    expect(
      screen.queryByTestId('virtualized-event-ev-battle-b'),
    ).not.toBeInTheDocument();

    rerender(
      <EventTimelineSection
        battle={secondBattle}
        currentTurn={1}
        onTurnChange={onTurnChange}
      />,
    );

    expect(
      screen.getByTestId('virtualized-event-ev-battle-b'),
    ).toHaveTextContent('Locust LCT-1V');
    expect(screen.queryByText('Atlas AS7-D')).not.toBeInTheDocument();
  });
});
