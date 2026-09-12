## 1. Characterize

- [x] 1.1 Reproduce explicit Structure being replaced by a stored tab and add regression coverage at the router/composition boundary.

## 2. Implement

- [x] 2.1 Distinguish an explicitly supplied valid tab from an omitted route segment, preserve existing invalid-route and campaign behavior, and make explicit Structure authoritative.

## 3. Verify

- [x] 3.1 Run focused route/hydration tests and production browser direct-link/reload proof.
- [x] 3.2 Run type, lint, formatting and strict OpenSpec checks, then synchronize canonical routing/tab requirements and record evidence.

Acceptance 2026-09-12: the pre-fix production run failed explicit Structure precedence; the fixed hook/composition and affected preview/router suites passed (40 tests / 12 suites). Type checking and lint passed, strict OpenSpec passed 233 items, and all 12 production Chromium cases passed with zero retries. See `docs/audits/2026-09-12-customizer-spec-reconciliation/followup-verification.json`. Local completion does not claim a remote PR run.
