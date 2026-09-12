import type { NextApiRequest, NextApiResponse } from 'next';

import type { IChassisIndex } from '@/types/unit/ChassisIndex';

import handler from '@/pages/api/chassis';
import { loadChassisIndex } from '@/services/units/chassis/chassisIndex.server';

jest.mock('@/services/units/chassis/chassisIndex.server');
jest.mock('@/services/forces/ForceRepository.helpers.server', () => ({
  installNodeCanonicalUnitStatsResolver: jest.fn(),
}));
jest.mock('@/services/persistence/SQLiteService', () => ({
  getSQLiteService: jest.fn(),
}));

const load = jest.mocked(loadChassisIndex);
const index: IChassisIndex = {
  schemaVersion: 1,
  source: {
    path: '/data/units/battlemechs/index.json',
    version: '1',
    generatedAt: '2026-09-10',
  },
  totalVariants: 1,
  chassis: [
    {
      id: 'battlemech:atlas',
      name: 'Atlas',
      aliases: [],
      weights: [100],
      weightClasses: [],
      techBases: ['INNER_SPHERE'],
      introductionYear: 2755,
      variants: [
        {
          unitId: 'atlas-as7-d',
          name: 'AS7-D',
          weight: 100,
          techBase: 'INNER_SPHERE',
          introductionYear: 2755,
          rulesLevel: 'STANDARD',
          role: null,
        },
      ],
    },
  ],
};

async function request(method = 'GET', query: NextApiRequest['query'] = {}) {
  const status = jest.fn().mockReturnThis();
  const json = jest.fn().mockReturnThis();
  const setHeader = jest.fn();
  await handler(
    { method, query } as NextApiRequest,
    { status, json, setHeader } as unknown as NextApiResponse,
  );
  return { status, json, setHeader };
}

beforeEach(() => {
  jest.clearAllMocks();
  load.mockResolvedValue(index);
});

it('returns the versioned index and exact chassis variant references', async () => {
  expect((await request()).json).toHaveBeenCalledWith(index);
  expect(
    (await request('GET', { id: 'battlemech:atlas' })).json,
  ).toHaveBeenCalledWith(index.chassis[0]);
});

it('rejects writes before reading the source', async () => {
  const response = await request('POST');
  expect(response.status).toHaveBeenCalledWith(405);
  expect(response.setHeader).toHaveBeenCalledWith('Allow', ['GET']);
  expect(load).not.toHaveBeenCalled();
});

it.each([
  { id: ['battlemech:atlas', 'battlemech:atlas'] },
  { id: '' },
  { id: '../index.json' },
])('rejects malformed IDs %j', async ({ id }) => {
  expect((await request('GET', { id })).status).toHaveBeenCalledWith(400);
  expect(load).not.toHaveBeenCalled();
});

it('reports unknown chassis', async () => {
  expect(
    (await request('GET', { id: 'battlemech:missing' })).status,
  ).toHaveBeenCalledWith(404);
});

it('does not disguise a source failure as an empty index or leak filesystem diagnostics', async () => {
  load.mockRejectedValue(new Error('ENOENT /private/source/path'));
  const response = await request();
  expect(response.status).toHaveBeenCalledWith(500);
  expect(response.json).toHaveBeenCalledWith({
    error: 'The chassis catalog is unavailable. Please try again.',
  });
});
