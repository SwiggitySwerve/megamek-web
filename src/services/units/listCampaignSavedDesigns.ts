import { customUnitApiService } from './CustomUnitApiService';
import { getCustomUnitService } from './CustomUnitService';

export interface ICampaignSavedDesign {
  readonly id: string;
  readonly name: string;
  readonly tonnage: number;
  readonly unitType?: string;
  readonly currentVersion?: number;
  readonly bv?: number;
}

/**
 * Server records win identity collisions; local-only designs remain visible
 * without gaining combat eligibility.
 *
 * @spec openspec/changes/enable-saved-custom-unit-combat/specs/custom-unit-combat/spec.md
 */
export async function listCampaignSavedDesigns(): Promise<
  readonly ICampaignSavedDesign[]
> {
  const [server, local] = await Promise.allSettled([
    customUnitApiService.list(),
    getCustomUnitService().list(),
  ]);
  const rows = new Map<string, ICampaignSavedDesign>();
  if (local.status === 'fulfilled') {
    for (const row of local.value) rows.set(row.id, row);
  }
  if (server.status === 'fulfilled') {
    for (const row of server.value) {
      rows.set(row.id, {
        id: row.id,
        name: `${row.chassis} ${row.variant}`,
        tonnage: row.tonnage,
        unitType: row.unitType,
        currentVersion: row.currentVersion,
      });
    }
  }
  if (server.status === 'rejected' && rows.size === 0) {
    throw server.reason;
  }
  return Array.from(rows.values());
}
