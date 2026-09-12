# BattleMech chassis index foundation

Implemented in the current MekStation checkout for the model-library foundation request. This is a read-only chassis catalog; no model files have been acquired, imported, or approved for hosting.

## Available now

- Compendium links to `/compendium/chassis`.
- The bundled catalog produces **732 chassis entries and 4,225 variant references**. These are catalog groups, not a claim about the total number of designs in BattleTech.
- Search covers chassis names, nine curated alternate-name pairs, and variant names/IDs. Weight filtering includes ultralight and superheavy entries and preserves chassis with variants in multiple weight classes.
- Chassis selection is shareable, for example `/compendium/chassis?chassis=battlemech%3Amad-cat`.
- Each variant links to its existing Compendium unit page and retains weight, technology base, introduction year, role, and rules level. Mixed technology and unofficial records remain visible.
- The model section explicitly says no preview has been added.

## Data and integration contract

`src/types/unit/ChassisIndex.ts` owns the versioned public contract. The server reads the existing generated `public/data/units/battlemechs/index.json`; the generated source is not edited or duplicated. Source version and generation date accompany the derived index.

| Request                                | Result                                                      |
| -------------------------------------- | ----------------------------------------------------------- |
| `GET /api/chassis`                     | `IChassisIndex` with source metadata and all chassis        |
| `GET /api/chassis?id=battlemech:atlas` | One `IChassisEntry`, including canonical variant references |
| Unknown well-formed ID                 | 404                                                         |
| Invalid or repeated ID                 | 400                                                         |
| Unsupported method                     | 405 with `Allow: GET`                                       |
| Invalid or unavailable source          | 500 with a recoverable public error                         |

`buildChassisIndex` is a pure validated transformation. The `.server.ts` loader owns filesystem access. No browser bundle imports that loader, no user input selects a file path, and no database migration is required. Duplicate unit IDs, ambiguous normalized chassis IDs, alias collisions, and declared-count mismatches fail explicitly.

IDs use the exact catalog chassis name as their identity source, such as `battlemech:mad-cat`. Adding variants or changing their weight does not change that chassis ID. Alternate names only improve discovery. Marauder, Marauder II, and Marauder IIC remain separate entries. A future catalog rename needs an explicit identity migration/override before externally referenced IDs change.

## Model-library extension boundary

Future source records should reference `IChassisEntry.id`; retain canonical `unitId` references separately when a model depicts a specific variant. Do not infer geometry compatibility from a chassis name, weight, or alias. The prior research uses its own `battletech:` candidate slugs and must be deliberately mapped to these `battlemech:` IDs.

Keep source listings, creator/provenance, reuse-rights evidence, visual review, and acquired mesh review in a separate catalog. A listing reference or purchase is not permission to host a mesh or creator image. Public preview assets should enter a separate servable manifest only after the applicable rights and mesh checks have evidence. This foundation does not create that manifest or claim any models are cleared.

## Verification

- Focused Jest checks: 18 passing tests across the real-catalog builder and API boundary suites.
- Scoped lint: no warnings or errors in the feature files.
- Scoped formatting: passed.
- Strict validation of `establish-battlemech-chassis-index`: passed.
- OpenSpec CI inventory/contract gate: passed, all active changes accounted for.
- Live browser and HTTP evidence: **all nine checks passed** in `browser-verification.json`, including full catalog access, Compendium navigation, alias search, keyboard selection, reload, canonical unit detail, filtering, mobile overflow, and retry recovery. The normal journey had no page exceptions or console errors. Fault injection used a separate browser context with its service worker blocked so requests reached the page error handler; the existing registration hook logged a warning in that deliberately restricted context.

The final repository-wide typecheck passed after removal of the temporary preview copy. Repository-wide lint completed with zero errors and existing warnings. The concurrent combat-code diagnostics seen earlier were absent from the final check; those files were not changed by this task. A production build and the entire repository test suite are not claimed by this scoped proof.

The live development checkout initially returned incomplete JavaScript and a malformed build manifest while other source work was active. Final browser proof used a fixed source snapshot; `source-fidelity.json` verifies every feature file matched the shared checkout byte for byte. The temporary server and snapshot were removed afterward, and the generated shared configuration change was restored. Earlier failed attempts are retained separately from the successful final report.

To reproduce, start MekStation normally, open `/compendium/chassis`, and set `CHASSIS_BASE_URL` to the running address when invoking `node docs/audits/2026-09-10-chassis-index/verify-browser.mjs`. The script defaults to the former verification address `http://127.0.0.1:4187`; that temporary server is no longer running.

The implementation remains uncommitted. The OpenSpec package remains active and has not been archived.
