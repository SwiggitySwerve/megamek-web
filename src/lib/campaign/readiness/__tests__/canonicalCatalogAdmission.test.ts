import {
  admitCampaignLaunch,
  admitCanonicalExactReference,
  admitRosterUnitSource,
  fetchCanonicalCatalogSnapshot,
  readyCanonicalCatalog,
  snapshotFromUnitsApiPayload,
  UNAVAILABLE_CANONICAL_CATALOG,
} from '@/lib/campaign/readiness/canonicalCatalogAdmission';
import { parseRosterUnitSource } from '@/types/campaign/RosterUnitSource';

const CANONICAL_ID = 'atlas-as7-d';
const CUSTOM_ID = 'custom-workbench-atlas';
const readyCatalog = readyCanonicalCatalog([CANONICAL_ID], [CUSTOM_ID]);

function jsonResponse(ok: boolean, body: unknown): Response {
  return {
    ok,
    status: ok ? 200 : 500,
    json: async () => body,
  } as Response;
}

type FetchHandler = {
  readonly ok: boolean;
  readonly body: unknown;
};

function fetchByUrl(
  handlers: Readonly<Record<string, FetchHandler>>,
): typeof fetch {
  return jest.fn(async (input: RequestInfo | URL) => {
    const url = typeof input === 'string' ? input : String(input);
    const handler = handlers[url];
    if (!handler) {
      return jsonResponse(false, { error: url });
    }
    return jsonResponse(handler.ok, handler.body);
  }) as typeof fetch;
}

function admit(input: {
  readonly source?: unknown;
  readonly unitRef?: string;
  readonly catalog?: typeof readyCatalog | { readonly status: 'loading' };
}) {
  return admitCanonicalExactReference({
    parsed: parseRosterUnitSource(input.source),
    unitRef: input.unitRef,
    catalog: input.catalog ?? readyCatalog,
    unitId: 'u1',
    unitName: 'Atlas',
  });
}

describe('canonical catalog admission with custom combat refs', () => {
  it('admits an exact custom-* membership and refuses nonadmission cases', () => {
    expect(admit({ source: 'custom', unitRef: CUSTOM_ID })).toEqual({
      admitted: true,
    });
    expect(
      admitRosterUnitSource({
        unitSource: 'custom',
        unitRef: CUSTOM_ID,
        catalog: readyCatalog,
        unitId: 'u1',
        unitName: 'Atlas',
      }),
    ).toEqual({ admitted: true });

    const localOnly = admit({
      source: 'custom',
      unitRef: 'custom-local-only',
    });
    expect(localOnly).toMatchObject({
      admitted: false,
      blocker: { code: 'roster_source_custom' },
    });
    expect(!localOnly.admitted && localOnly.blocker.message).toContain(
      'cannot launch yet',
    );

    const customOnCanonicalId = admit({
      source: 'custom',
      unitRef: CANONICAL_ID,
    });
    expect(customOnCanonicalId).toMatchObject({
      admitted: false,
      blocker: { code: 'roster_source_custom' },
    });

    const canonicalCustomId = admit({
      source: 'canonical',
      unitRef: CUSTOM_ID,
    });
    expect(canonicalCustomId).toMatchObject({
      admitted: false,
      blocker: { code: 'source_ref_mismatch' },
    });

    const missingCustomCatalog = admit({
      source: 'custom',
      unitRef: CUSTOM_ID,
      catalog: readyCanonicalCatalog([CANONICAL_ID]),
    });
    expect(missingCustomCatalog).toMatchObject({
      admitted: false,
      blocker: { code: 'roster_source_custom' },
    });

    expect(admit({ source: 'canonical', unitRef: CANONICAL_ID })).toEqual({
      admitted: true,
    });
  });

  it('keeps a ready canonical snapshot when the custom catalog fails or is malformed', async () => {
    const canonicalBody = {
      success: true,
      data: [{ id: CANONICAL_ID }],
    };

    const failed = await fetchCanonicalCatalogSnapshot(
      fetchByUrl({
        '/api/units': { ok: true, body: canonicalBody },
        '/api/units/custom/combat-catalog': {
          ok: false,
          body: { error: 'down' },
        },
      }),
    );
    expect(failed).toMatchObject({ status: 'ready' });
    expect(failed.status === 'ready' && failed.unitRefs.has(CANONICAL_ID)).toBe(
      true,
    );
    expect(failed.status === 'ready' && failed.customCombatRefs).toBe(
      undefined,
    );

    const malformed = await fetchCanonicalCatalogSnapshot(
      fetchByUrl({
        '/api/units': { ok: true, body: canonicalBody },
        '/api/units/custom/combat-catalog': {
          ok: true,
          body: { customCombatRefs: [CANONICAL_ID, CUSTOM_ID] },
        },
      }),
    );
    expect(malformed.status === 'ready' && malformed.customCombatRefs).toBe(
      undefined,
    );
    expect(
      malformed.status === 'ready' && malformed.unitRefs.has(CANONICAL_ID),
    ).toBe(true);

    const thrown = await fetchCanonicalCatalogSnapshot(
      jest.fn(async (input: RequestInfo | URL) => {
        const url = typeof input === 'string' ? input : String(input);
        if (url === '/api/units') {
          return jsonResponse(true, canonicalBody);
        }
        throw new Error('custom catalog network');
      }) as typeof fetch,
    );
    expect(thrown.status === 'ready' && thrown.customCombatRefs).toBe(
      undefined,
    );

    const readyCustom = await fetchCanonicalCatalogSnapshot(
      fetchByUrl({
        '/api/units': { ok: true, body: canonicalBody },
        '/api/units/custom/combat-catalog': {
          ok: true,
          body: { customCombatRefs: [CUSTOM_ID] },
        },
      }),
    );
    expect(
      readyCustom.status === 'ready' &&
        readyCustom.customCombatRefs?.has(CUSTOM_ID),
    ).toBe(true);

    expect(
      snapshotFromUnitsApiPayload({
        success: true,
        data: [{ id: CANONICAL_ID }],
      }),
    ).toMatchObject({ status: 'ready' });
    expect(snapshotFromUnitsApiPayload({ success: true, data: [] })).toBe(
      UNAVAILABLE_CANONICAL_CATALOG,
    );
  });

  it('refuses a mixed launch before later work when a custom row is not in the authority catalog', () => {
    const denied = admitCampaignLaunch({
      snapshot: {
        campaignId: 'c1',
        catalog: readyCanonicalCatalog([CANONICAL_ID]),
      },
      expected: { campaignId: 'c1' },
      selectedUnits: [
        {
          unitId: 'u-canonical',
          unitName: 'Atlas',
          unitRef: CANONICAL_ID,
          unitSource: 'canonical',
        },
        {
          unitId: 'u-custom',
          unitName: 'Custom Atlas',
          unitRef: CUSTOM_ID,
          unitSource: 'custom',
        },
      ],
    });
    expect(denied).toMatchObject({
      admitted: false,
      blocker: { code: 'roster_source_custom', subjectId: 'u-custom' },
    });

    const admitted = admitCampaignLaunch({
      snapshot: { campaignId: 'c1', catalog: readyCatalog },
      expected: { campaignId: 'c1' },
      selectedUnits: [
        {
          unitId: 'u-canonical',
          unitName: 'Atlas',
          unitRef: CANONICAL_ID,
          unitSource: 'canonical',
        },
        {
          unitId: 'u-custom',
          unitName: 'Custom Atlas',
          unitRef: CUSTOM_ID,
          unitSource: 'custom',
        },
      ],
    });
    expect(admitted).toEqual({ admitted: true });
  });
});
