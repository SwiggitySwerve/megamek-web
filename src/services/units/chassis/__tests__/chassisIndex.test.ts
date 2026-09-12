import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { WeightClass } from '@/types/enums/WeightClass';

import { buildChassisIndex, searchChassisIndex } from '../chassisIndex';

const source = JSON.parse(
  readFileSync(
    join(process.cwd(), 'public/data/units/battlemechs/index.json'),
    'utf8',
  ),
);
const index = buildChassisIndex(source);
const unit = {
  id: 'atlas-as7-d',
  chassis: 'Atlas',
  model: 'AS7-D',
  tonnage: 100,
  techBase: 'INNER_SPHERE',
  year: 2755,
  rulesLevel: 'STANDARD',
};
const catalog = (units: unknown[]) => ({
  version: '1',
  generatedAt: '2026-09-10',
  totalUnits: units.length,
  units,
});

describe('chassis identity foundation', () => {
  it('preserves every real canonical variant exactly once and groups exact chassis names', () => {
    expect(index.totalVariants).toBe(source.units.length);
    expect(index.chassis).toHaveLength(
      new Set(source.units.map((entry: { chassis: string }) => entry.chassis))
        .size,
    );
    const variants = index.chassis.flatMap((entry) => entry.variants);
    expect(new Set(variants.map((entry) => entry.unitId)).size).toBe(
      source.units.length,
    );
    for (const entry of source.units) {
      expect(
        variants.find((variant) => variant.unitId === entry.id),
      ).toMatchObject({
        name: entry.model,
        weight: entry.tonnage,
        techBase: entry.techBase,
        introductionYear: entry.year,
        rulesLevel: entry.rulesLevel ?? null,
      });
    }
  });

  it('keeps IDs and ordering independent of input order', () => {
    expect(
      buildChassisIndex({ ...source, units: [...source.units].reverse() }),
    ).toEqual(index);
  });

  it('finds alternate names and variant codes without aliasing successor chassis', () => {
    expect(
      searchChassisIndex(index.chassis, 'Timber Wolf').map(
        (entry) => entry.name,
      ),
    ).toEqual(['Mad Cat']);
    expect(
      searchChassisIndex(index.chassis, 'AS7-D').some(
        (entry) => entry.name === 'Atlas',
      ),
    ).toBe(true);
    for (const name of [
      'Marauder',
      'Marauder II',
      'Marauder IIC',
      'Mad Cat',
      'Mad Cat Mk II',
    ]) {
      expect(index.chassis.filter((entry) => entry.name === name)).toHaveLength(
        1,
      );
    }
    expect(
      new Set(
        index.chassis
          .filter((entry) => entry.name.startsWith('Marauder'))
          .map((entry) => entry.id),
      ).size,
    ).toBe(3);
  });

  it('retains multiweight chassis, mixed technology and all weight classes', () => {
    const griffin = index.chassis.find((entry) => entry.name === 'Griffin')!;
    expect(griffin.weights).toEqual([55, 60]);
    expect(griffin.weightClasses).toEqual([
      WeightClass.MEDIUM,
      WeightClass.HEAVY,
    ]);
    expect(searchChassisIndex([griffin], '', WeightClass.HEAVY)).toEqual([
      griffin,
    ]);
    expect(searchChassisIndex([griffin], '', WeightClass.ASSAULT)).toEqual([]);
    expect(
      index.chassis.some((entry) => entry.techBases.includes('MIXED')),
    ).toBe(true);
    expect(
      index.chassis.some((entry) =>
        entry.weightClasses.includes(WeightClass.SUPERHEAVY),
      ),
    ).toBe(true);
  });

  it.each([
    ['duplicate unit ID', catalog([unit, unit])],
    [
      'slug collision',
      catalog([unit, { ...unit, id: 'other', chassis: 'Atlas!' }]),
    ],
    [
      'alias collision',
      catalog([
        { ...unit, chassis: 'Mad Cat' },
        { ...unit, id: 'other', chassis: 'Timber Wolf' },
      ]),
    ],
    ['count mismatch', { ...catalog([unit]), totalUnits: 2 }],
    ['empty source', catalog([])],
    ['invalid tech base', catalog([{ ...unit, techBase: 'ALIEN' }])],
    ['missing identity', catalog([{ ...unit, chassis: '' }])],
  ])(
    'rejects %s instead of producing an incomplete index',
    (_label, invalid) => {
      expect(() => buildChassisIndex(invalid)).toThrow();
    },
  );
});
