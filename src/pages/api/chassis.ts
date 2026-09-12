import type { NextApiRequest, NextApiResponse } from 'next';

import { rejectUnexpectedMethod } from '@/pages-modules/api/routeHelpers';
import { loadChassisIndex } from '@/services/units/chassis/chassisIndex.server';
import { logger } from '@/utils/logger';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (rejectUnexpectedMethod(req, res, ['GET'])) return;
  const { id } = req.query;
  if (
    id !== undefined &&
    (typeof id !== 'string' ||
      !/^battlemech:[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id))
  ) {
    res.status(400).json({ error: 'Provide one valid chassis ID' });
    return;
  }
  try {
    const index = await loadChassisIndex();
    if (id !== undefined) {
      const chassis = index.chassis.find((entry) => entry.id === id);
      if (!chassis) {
        res.status(404).json({ error: 'Chassis not found' });
        return;
      }
      res.status(200).json(chassis);
      return;
    }
    res.status(200).json(index);
  } catch (error) {
    logger.error('Failed to load chassis index', error);
    res
      .status(500)
      .json({ error: 'The chassis catalog is unavailable. Please try again.' });
  }
}
