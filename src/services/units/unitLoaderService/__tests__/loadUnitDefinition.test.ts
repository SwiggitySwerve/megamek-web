import atlas from '../../../../../public/data/units/battlemechs/2-star-league/standard/Atlas AS7-D.json';
import { loadUnitDefinition } from '../loadUnitDefinition';

it('returns a validated definition with its source identity and custom revision', async () => {
  const read = jest.fn().mockResolvedValue({ ...atlas, currentVersion: 7 });
  const result = await loadUnitDefinition(
    { read },
    { source: 'custom', id: 'saved-atlas' },
  );
  expect(read).toHaveBeenCalledWith({ source: 'custom', id: 'saved-atlas' });
  expect(result).toMatchObject({
    success: true,
    reference: { source: 'custom', id: 'saved-atlas', version: 7 },
    definition: { id: 'atlas-as7-d', chassis: 'Atlas' },
  });
});

it('does not infer source revisions from canonical payload metadata', async () => {
  const result = await loadUnitDefinition(
    { read: async () => ({ ...atlas, currentVersion: 7 }) },
    { source: 'canonical', id: atlas.id },
  );
  expect(result.reference).toEqual({ source: 'canonical', id: atlas.id });
});

it('distinguishes unavailable sources from absent definitions and allows retry', async () => {
  const read = jest
    .fn()
    .mockRejectedValueOnce(new Error('offline'))
    .mockResolvedValueOnce(null)
    .mockResolvedValueOnce(atlas);
  const reference = { source: 'canonical' as const, id: atlas.id };
  expect(await loadUnitDefinition({ read }, reference)).toMatchObject({
    success: false,
    code: 'read-failed',
    error: 'offline',
  });
  expect(await loadUnitDefinition({ read }, reference)).toMatchObject({
    success: false,
    code: 'not-found',
  });
  expect(await loadUnitDefinition({ read }, reference)).toMatchObject({
    success: true,
    reference,
  });
});

it('reports invalid fields without handing malformed data to an editor', async () => {
  const result = await loadUnitDefinition(
    { read: async () => ({ ...atlas, tonnage: -50 }) },
    { source: 'canonical', id: atlas.id },
  );
  expect(result).toMatchObject({
    success: false,
    code: 'invalid-definition',
    issues: expect.arrayContaining([
      expect.objectContaining({ path: 'tonnage' }),
    ]),
  });
  expect(result).not.toHaveProperty('definition');
});

it('loads a non-mech definition without pretending it is BattleMech configuration', async () => {
  const definition = { id: 'infantry-squad', unitType: 'Infantry' };
  expect(
    await loadUnitDefinition(
      { read: async () => definition },
      { source: 'canonical', id: definition.id },
    ),
  ).toMatchObject({ success: true, definition });
});

it.each([
  'chassis',
  'configuration',
  'tonnage',
  'engine',
  'armor',
  'criticalSlots',
])('rejects a BattleMech definition missing required %s', async (field) => {
  const incomplete: Record<string, unknown> = { ...atlas };
  delete incomplete[field];
  expect(
    await loadUnitDefinition(
      { read: async () => incomplete },
      { source: 'canonical', id: atlas.id },
    ),
  ).toMatchObject({ success: false, code: 'invalid-definition' });
});

it('requires both movement values for a BattleMech', async () => {
  expect(
    await loadUnitDefinition(
      { read: async () => ({ ...atlas, movement: { walk: 3 } }) },
      { source: 'canonical', id: atlas.id },
    ),
  ).toMatchObject({ success: false, code: 'invalid-definition' });
});
