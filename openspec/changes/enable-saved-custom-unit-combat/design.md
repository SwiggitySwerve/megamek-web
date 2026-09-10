## Decisions

1. Keep canonical and custom identities distinct. A ready catalog retains canonical `unitRefs` and may add validated `customCombatRefs`. Explicit `custom` source plus exact membership is required; a `custom-*` reference under a canonical source remains invalid. A missing custom catalog blocks custom launch without discarding a valid canonical catalog.
2. Parse supported saved construction through one strict projection based on the generated unit schema. Strip library-only metadata at initial projection; recorded snapshots reject unknown nested construction fields. Do not edit generated schemas or silently broaden support beyond biped BattleMechs.
3. Inject the SQLite reader at server adaptation and recovery boundaries. Browser consumers may use the existing HTTP service. Never import SQLite into browser components or rely on a relative HTTP fetch from the server.
4. Copy the validated construction onto the initial game-unit event. Recovery prefers this snapshot and validates its exact reference and supported shape before adapting. A present corrupt snapshot fails closed; it must not fall back to the current library. Launch without a valid saved definition fails without substituting a canonical unit.
5. Extend the strict GameCreated nested unit schema with the optional construction snapshot and give the changed parser a deterministic schema identity. Existing canonical payloads remain accepted. Derived replay fingerprints/checkpoints may invalidate; persisted event bytes and schema versions are not rewritten.
6. Project private construction through the existing server visibility filter. Opponents and spectators must not receive a hidden construction snapshot through live events, reconnect, or replay. Public unit metadata follows the existing visibility contract.
7. Restore only reviewed non-presentation fragments from backups. Campaign picker changes are limited to data loading; existing theme/icon work stays intact. Browser readiness and server launch boundaries share admission semantics, with each source resolving data through its own authority.

## Verification

Test supported adaptation and refusal; preserve canonical adaptation; persist an actual GameCreated-bearing session to SQLite and recover after closing/reopening storage and editing/deleting the library; compare construction-dependent armor, movement, weapons, ammunition, and heat data; reject tampered snapshots and verify strict replay gating. Exercise server bootstrap and fog projections. Prove the browser save-to-campaign/readiness path against disposable databases and read back authoritative data.

The parent owns executions, production builds, test-server lifecycle, and final integration. Workers edit disjoint paths and return concrete candidates. No passing claim is made while required authority or recovery checks remain outstanding.
