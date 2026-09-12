import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import type { IChassisIndex } from '@/types/unit/ChassisIndex';

import { buildChassisIndex } from './chassisIndex';

export async function loadChassisIndex(): Promise<IChassisIndex> {
  const file = join(
    process.cwd(),
    'public',
    'data',
    'units',
    'battlemechs',
    'index.json',
  );
  const source: unknown = JSON.parse(await readFile(file, 'utf8'));
  return buildChassisIndex(source);
}
