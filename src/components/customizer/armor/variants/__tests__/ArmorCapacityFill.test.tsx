import { render } from '@testing-library/react';
import React from 'react';

import { MechLocation } from '@/types/construction';
import { getSampleArmorData } from '@/utils/armor/armorDataRegistry';

import {
  CleanTechDiagram,
  NeonOperatorDiagram,
  TacticalHUDDiagram,
  PremiumMaterialDiagram,
} from '..';
import { clampArmorFillRatio } from '../../shared/ArmorCapacityFill';
import { resolveLayoutById, getLayoutIdForConfig } from '../../shared/layout';

const styles = [
  CleanTechDiagram,
  NeonOperatorDiagram,
  TacticalHUDDiagram,
  PremiumMaterialDiagram,
];

for (const configuration of [
  'biped',
  'quad',
  'tripod',
  'lam',
  'quadvee',
] as const) {
  it.each(styles)(
    '%p renders a real half-filled head for ' + configuration,
    (Diagram) => {
      const armorData = getSampleArmorData(configuration).map((data) =>
        data.location === MechLocation.HEAD
          ? { ...data, current: 5, maximum: 10 }
          : data,
      );
      const view = render(
        <Diagram
          armorData={armorData}
          mechConfigType={configuration}
          selectedLocation={null}
          onLocationClick={jest.fn()}
          unallocatedPoints={12}
        />,
      );
      const region = view.getByRole('button', { name: /^Head armor:/ });
      const fill = region.querySelector('[data-armor-fill]')!;
      expect(fill).not.toBeNull();
      expect(fill.getAttribute('data-armor-fill-ratio')).toBe('0.5');
      expect(fill.getAttribute('fill')).not.toBe('none');
      const clip = fill.getAttribute('clip-path');
      const paint = fill.getAttribute('fill')!;
      if (clip) {
        const rect = view.container.querySelector(
          '[id="' + clip.slice(5, -1) + '"] rect',
        )!;
        const pathPosition =
          fill.tagName === 'path'
            ? resolveLayoutById(
                getLayoutIdForConfig(configuration, 'battlemech'),
              )!.positions[MechLocation.HEAD]
            : undefined;
        const height =
          pathPosition?.height ?? Number(fill.getAttribute('height'));
        const top = pathPosition?.y ?? Number(fill.getAttribute('y'));
        expect(Number(rect.getAttribute('height'))).toBeCloseTo(height / 2);
        expect(Number(rect.getAttribute('y'))).toBeCloseTo(top + height / 2);
      } else if (paint.startsWith('url(#')) {
        const gradient = view.container.querySelector(
          '[id="' + paint.slice(5, -1) + '"]',
        )!;
        const stops = gradient.querySelectorAll('stop');
        expect(stops[1].getAttribute('offset')).toBe('0.5');
        expect(stops[2].getAttribute('offset')).toBe('0.5');
      } else {
        const background = Array.from(region.querySelectorAll('rect')).find(
          (rect) =>
            rect.getAttribute('x') === fill.getAttribute('x') &&
            Number(rect.getAttribute('height')) ===
              Number(fill.getAttribute('height')) * 2,
        )!;
        expect(background).toBeDefined();
        expect(Number(fill.getAttribute('y'))).toBeCloseTo(
          Number(background.getAttribute('y')) +
            Number(fill.getAttribute('height')),
        );
      }
      expect(
        view.container.querySelectorAll('[data-armor-fill]').length,
      ).toBeGreaterThanOrEqual(8);
      view.unmount();
    },
  );
}

it.each([
  [0, 10, 0],
  [5, 10, 0.5],
  [20, 10, 1],
  [-5, 10, 0],
  [5, 0, 0],
  [Number.NaN, 10, 0],
  [5, Number.POSITIVE_INFINITY, 0],
])(
  'clamps invalid and out-of-range capacities (%s/%s)',
  (current, maximum, expected) => {
    expect(clampArmorFillRatio(current, maximum)).toBe(expected);
  },
);
