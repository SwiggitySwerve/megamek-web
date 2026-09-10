/**
 * GET /api/units/custom/combat-catalog
 *
 * Authoritative list of custom-* references whose persisted construction is
 * eligible for combat. No auth is added here.
 *
 * @spec openspec/changes/enable-saved-custom-unit-combat/specs/custom-unit-combat/spec.md
 */

import type { NextApiRequest, NextApiResponse } from 'next';

import {
  initializeApiDatabase,
  sendCaughtApiError,
  type ApiErrorResponse,
} from '@/pages-modules/api/routeHelpers';
import { listServerCustomCombatRefs } from '@/services/units/serverCustomCombatDefinition';

type CombatCatalogResponse = {
  customCombatRefs: string[];
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<CombatCatalogResponse | ApiErrorResponse>,
): void {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    return;
  }
  if (!initializeApiDatabase(res)) return;
  try {
    res.status(200).json({ customCombatRefs: listServerCustomCombatRefs() });
  } catch (error) {
    sendCaughtApiError(res, error, 'Saved combat definitions unavailable');
  }
}
