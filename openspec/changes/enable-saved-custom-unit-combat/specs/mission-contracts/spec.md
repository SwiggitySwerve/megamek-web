## MODIFIED Requirements

### Requirement: Mission readiness projection

Mission launch SHALL use an explicit readiness projection that includes mission constraints, eligible units, ineligible units, pilot readiness, selected roster, unresolved blockers, launch consequences, parsed unit source, and combat catalog readiness. The shared source/reference guard SHALL run before encounter diagnostics, lookup, reuse, routing, or mutation. Supported server-saved custom references MAY be eligible only through the authoritative custom combat catalog defined by `custom-unit-combat`.

#### Scenario: Launch gate blocks invalid roster

- **WHEN** the selected roster violates mission constraints, unit readiness, source identity, or exact-reference rules
- **THEN** mission launch SHALL show each blocker before materialization
- **AND** no encounter lookup, reuse result, route call, or state mutation SHALL occur

#### Scenario: Encounter receives the exact selected construction

- **WHEN** every selected source resolves exactly in its authoritative ready catalog
- **THEN** materialization SHALL receive those campaign roster identities
- **AND** canonical and supported custom references SHALL NOT be silently replaced with stock units

### Requirement: Canonical combat catalog readiness is explicit

Campaign launch SHALL consume a runtime-only catalog snapshot with canonical state `loading`, `ready`, or `unavailable`. Browser and Node consumers SHALL preserve their existing trusted canonical source. A ready snapshot MAY also contain validated server custom-combat references. Custom-catalog failure SHALL block custom admission without discarding an otherwise valid canonical catalog. A failed canonical load SHALL NOT become an empty successful snapshot.

#### Scenario: Ready catalog resolves the exact source

- **WHEN** an exact reference exists in the ready catalog for its persisted source
- **THEN** source admission SHALL mark it eligible, subject to the remaining readiness checks

#### Scenario: Custom catalog fails independently

- **GIVEN** a valid ready canonical catalog
- **WHEN** the custom catalog is unavailable or contains malformed references
- **THEN** canonical admission SHALL retain its validated membership
- **AND** custom admission SHALL remain blocked with a recoverable reason

#### Scenario: Canonical catalog failure blocks launch

- **WHEN** the canonical catalog is loading, malformed, failed, or unavailable
- **THEN** readiness SHALL preserve the roster and expose the appropriate blocker
- **AND** materialization SHALL NOT begin

### Requirement: Campaign launch requires an authoritative canonical source

Every launch boundary SHALL receive an explicit runtime catalog snapshot and SHALL admit an exact canonical reference under a canonical source, or a supported server-saved custom reference under an explicit custom source with exact custom-combat catalog membership. The historical requirement title is retained for delta compatibility; authoritative source admission now includes that bounded custom path.

Mission launch, Mech Bay readiness, fast-forward, campaign dashboard readiness, co-op launch, and materializer callers SHALL share the same admission guard. A consumer without an authoritative custom snapshot SHALL continue to block custom units rather than infer membership. Server materialization SHALL re-resolve selected saved construction before recording combat.

#### Scenario: Mixed roster admits supported selections

- **WHEN** selected canonical and supported custom rows each have an exact match in their authoritative catalog
- **THEN** they MAY launch with their selected roster identities after all other blockers clear
- **AND** unsupported or local-only custom rows SHALL remain visible but non-launchable

#### Scenario: Invalid selection is blocked without side effects

- **WHEN** a selected roster contains an invalid source, a canonical label on a custom reference, an unsupported custom design, a stale reference, or missing catalog membership
- **THEN** the shared guard SHALL return a condition-specific blocker before caller-specific work
- **AND** diagnostics, lookup, reuse, creation, route calls, session launch, and mutation SHALL remain unperformed

#### Scenario: Co-op launch revalidates authority

- **WHEN** co-op receives a missing, foreign, stale, or revision-mismatched campaign snapshot
- **THEN** launch SHALL reject before composition or encounter launch
- **AND** the client SHALL NOT synthesize source identity, force membership, construction authority, or a stock fallback
