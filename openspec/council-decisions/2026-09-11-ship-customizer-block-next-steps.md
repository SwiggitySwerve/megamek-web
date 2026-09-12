# OMO Council — Ship the customizer block, then what

**Headline:** The "BREAKING" record-sheet delta is not a reason to split PRs: this repo never supersedes canonical specs in the feature PR, so all three changes ship as one PR with three file-disjoint commits, and the spec supersession lands in the follow-up archive PR together with the already-merged `add-customizer-edit-recovery` change.

**Brief:** Resolve the mechanical shipping question for the three implemented, audited, uncommitted OpenSpec changes on `main` (`repair-equipment-catalog`, `repair-record-sheet-rendering`, `establish-battlemech-chassis-index`), then say what comes next.
**Option space:** (A) one PR + canonical spec supersession inline; (B) three PRs; (C) two PRs, non-breaking pair first; (D) one PR delta-only, archive later; (E) split by separability with archive-time merge.
**Variant:** Lean++ thin (Phase 0 Metis + Oracle + Explore-Deep + Momus). Phase 3 skipped: consensus held; adversary surfaced no live objection after live gate runs.

## Phase 0 — Metis reframe
- qc-registry failure reproduced live (10/11, `/compendium/chassis` missing from app-shell coverage manifest). Narrow, already diagnosed.
- "One PR" smuggles a scoping question: the record-sheet proposal is BREAKING against canonical `record-sheet-export` and its own non-goals exclude canonical edits. Who supersedes the spec, and when, gates the PR-count choice.
- Checkbox staleness is bookkeeping: equipment 0/11, record-sheet 0/13, chassis 6/6, and `add-customizer-edit-recovery` 0/5 despite shipping in #1635.
- `AGENTS.md` diff is empty (line endings). `git checkout -- AGENTS.md`.
- "Baseline-design comparison" is Codex's recommendation, not the user's ask. Source: the Codex assistant turn at 2026-09-10T20:41Z in rollout `~/.codex/sessions/2026/09/08/rollout-2026-09-08T13-36-45-01a08285-d9c0-71e3-a26e-f8b5b916a3b2.jsonl` ("Next, I recommend Add and place … After that, add comparison against the original design"), drawing on `docs/audits/2026-09-09-customizer-functionality-review.md`; no user turn in that thread requests it. Hold it as a candidate.
- Width: collapses to narrow internal → Lean++ thin.

## Phase 1 — Assignments
- **Oracle:** pick A–E with the crux fact; supersession timing; ordered pre-PR checklist; what-next candidates.
- **Explore-Deep:** diff separability per file; archive convention from git history; canonical-vs-delta text and validator behaviour; exact qc-registry fix; ignore/hook hygiene; state of `add-customizer-edit-recovery`.
- **Momus (kill mandate):** re-run every claimed gate on the current tree; commit-hook and CI enforcement; e2e wiring; anything that blocks a PR today.

## Phase 2 — Positions
### Oracle
Option **(D)**: one PR, three file-disjoint commits, delta-only; archive in a follow-up PR. Crux: `openspec/AGENTS.md:27` ("Synchronize canonical specs after implementation lands, then archive only after required verification is recorded") plus the archive-PR history (#1054, #1052, #1300, #1464 all separate from their impl PRs). The BREAKING flag therefore never touches this PR. Gate cost decides against three PRs: each would pay the 8 GB typecheck + build + 35k-test cycle and only the last proves the combined tree. Supersede canonical `record-sheet-export/spec.md` (lines 97–98, 121 carry 20x/JPEG) at archive time. Checklist: revert AGENTS.md; stage explicitly, never `git add -A` (`output/` is untracked and unignored); manifest fix with a warning that `qc-registry.test.ts:132–151` also asserts the inverse direction (manifest → navigation registry); tick 11 + 13 boxes citing the `docs/audits/2026-09-10-*` evidence; tick edit-recovery's 5 boxes, leave it active; keep ledger additions; rerun all gates on the current tree; drop `docs/audits/2026-09-09-printable-model-library/` from this PR. Next: archive PR for four changes (mandatory), then baseline comparison or game-screens redesign as a goals call for the user.

### Explore-Deep
- **Separability:** all 71 dirty paths assign cleanly: equipment-catalog 24, record-sheet ~24, chassis-index 7. `unitState.ts`, `unitEditHistory.ts`, `useUnitEquipmentStore.ts`, `EquipmentItem.ts`, `CustomizerWorkbench.module.css` are equipment-only by diff content; `pages/compendium/index.tsx` is chassis-only. The only shared file is `openspec/active-change-ledger.json`, additive, hunk-stageable.
- **Convention:** archives are separate PRs titled `docs(openspec): archive <name>` (`d03a0059d` #1464, `fb3ccd16d` #1312, `8f084e4be` #1300, `fe3e6d786` #1278, `0f22565c8` #1251). #1635 (`c8780618e`) created `add-customizer-edit-recovery` and archived nothing. No `--skip-specs` usage exists in this repo.
- **Canonical vs delta:** canonical lines 97, 98, 121 say 20x/JPEG; the delta is `## MODIFIED Requirements` only and states the supersession in prose. Strict validation checks delta structure, not semantic reconciliation.
- **qc-registry:** `scripts/__tests__/qc-registry.test.ts:288-291` spawns `scripts/qc/validate-qc-registry.mjs --app-shell-routes-only`. Fix: add `{ "path": "/compendium/chassis", "label": "compendium chassis" }` to `primaryRoutes` in `e2e/app-shell-route-manifest.json` (siblings at lines 18–21). `e2e/app-shell-route-proof.spec.ts:488-503` derives from the manifest, no second edit.
- **Hygiene:** `output/` not ignored; `.sisyphus/*` ignored with evidence carve-outs; `.husky/pre-commit` runs lint-staged then `npm run build` when `.ts/.tsx` are staged; lint-staged oxfmt-writes `*.{json,md,css}`.

### Momus (kill mandate)
**NO KILL FOUND.** Reproduced on the current tree: `openspec validate --all --strict` 231/0; `tsc --noEmit` exit 0 with 8 GB heap; oxlint 85 warnings / 0 errors (exact match); focused jest over all 21 new/modified test files 20 suites / 168 tests / 0 failures; qc-registry 10/11 with the disclosed failure. `format:check` fails on 48 files, all under untracked `docs/audits/**`; lint-staged self-heals `.md/.json` at commit, leaving only `printable-model-library/{index.html,verify-catalog.mjs}` outside the glob. `pr-checks.yml` `unit-test-shards` runs the `unit` jest project that includes `scripts/`, so the qc-registry failure would fail CI today. `format-check` is unconditional in CI. The two new Playwright specs are self-contained (`loadAtlas` is local) but wired into no CI job. Unused import `IMountedEquipmentInstance` at `src/stores/unit/useUnitEquipmentStore.ts:8` is cosmetic.

## Synthesis
**Decision:** Ship all three changes in **one PR with three per-change commits** (equipment-catalog, record-sheet-rendering, chassis-index; ledger hunks staged per commit), delta-only. Do not touch the canonical `record-sheet-export` spec in this PR. Immediately after merge, open a **second PR that archives all four changes** (the three plus `add-customizer-edit-recovery`), merging the record-sheet delta into canonical and dropping the four ledger entries. Only then choose the next feature.

**Why:** The one fact that seemed to force a split, the BREAKING delta, is neutralised by the repo's own rule that canonical specs are synchronised at archive time in a separate PR (`openspec/AGENTS.md:27`, five prior archive PRs). With that gone, zero file overlap gives clean per-commit rollback inside one PR, and one PR pays the expensive gate cycle once instead of three times. Momus reproduced every claimed gate on the current tree, so the block is shippable today with one known, one-line fix.

**Pre-PR checklist (ordered):**
1. `git checkout -- AGENTS.md` (S).
2. Add `/compendium/chassis` to `primaryRoutes` in `e2e/app-shell-route-manifest.json`; re-run `scripts/__tests__/qc-registry.test.ts` and confirm the inverse-direction assertion at lines 132–151 also passes (add the route to the `app-shell-navigation` registry if it does not) (S/M).
3. Tick task boxes with audit citations: `repair-equipment-catalog` 11, `repair-record-sheet-rendering` 13, `add-customizer-edit-recovery` 5 (M).
4. Stage explicitly by path. Exclude `output/`, `docs/audits/2026-09-09-printable-model-library/`, and `AGENTS.md`. Consider adding `output/` to `.gitignore` in the same PR (S).
5. Drop the unused `IMountedEquipmentInstance` import (S).
6. Rerun gates on the final tree before push: typecheck (8 GB heap), lint, `openspec validate --all --strict`, full jest, `next build` (L; the pre-commit hook runs the build anyway, so commit via background shell).
7. Branch off freshly fetched `origin/main`, PR, CI, merge, cleanup.

**Survival Score:** Intact. The sole proposer's option survived unmodified. Momus attacked executability with live gate runs rather than speculation and returned no kill; Explore-Deep's separability and convention evidence reinforced rather than contradicted. Pressure on the option choice itself was low because Lean++ seats one proposer.

**Trade-offs accepted:** One larger review surface (~71 paths) instead of three small ones; per-commit structure is the mitigation. Canonical spec stays textually wrong (20x/JPEG) until the archive PR lands. Two new e2e specs ride along unwired to CI.

**Second-order consequences:** The archive PR becomes a standing obligation; if it slips, the ledger carries four stale in-progress entries and the canonical spec lies. Establishing "one impl PR, one archive PR" as the cadence for this customizer thread keeps future waves from accumulating the same debt.

**Open risks:** The qc-registry inverse assertion may require a navigation-registry entry that makes `/compendium/chassis` user-reachable in the shell nav, which is a small product decision. The 48 unformatted audit files rely on lint-staged self-healing; verify `format:check` is clean on the final tree, not assumed. Full 35k-test suite and `next build` were not re-run by the council on the current tree.

**Dissent on record:** None. No live objections after the adversary round.

**Captain verification (same turn, `sed`/`git` output read directly):** canonical `openspec/specs/record-sheet-export/spec.md` lines 97, 98, 121 read "use 20x DPI multiplier for print quality" / "use JPEG format for canvas-to-PDF embedding" / "use 20x DPI multiplier for crisp text at all zoom levels"; `e2e/app-shell-route-manifest.json` lines 18–21 are the four `/compendium*` sibling entries; `scripts/__tests__/qc-registry.test.ts:288-291` is the `--app-shell-routes-only` test asserting status 0, and lines 132–151 open `rejects app-shell browser proof routes missing from the registry` reading `docs/qc/mekstation-qc-registry.json` surface `app-shell-navigation`; `openspec/AGENTS.md:27` reads "Synchronize canonical specs after implementation lands, then archive only after required verification is recorded"; archive commits `d03a0059d` (#1464), `fb3ccd16d` (#1312), `8f084e4be` (#1300) resolve with the quoted subjects. `git status --short` reports 77 lines before this file was added (untracked directories count as one line each; Explore-Deep's per-file assignment covered 71 leaf paths). Momus's gate counts (231/0 strict validate, tsc exit 0, 85/0 lint, 168/0 focused jest, qc-registry 10/11) are the adversary's own reproduced runs, not the Codex-era claims.

**What next after the archive PR (goals call for the user, not a technical one):**
- Baseline-design comparison: closes the last open item of `docs/audits/2026-09-09-customizer-functionality-review.md` and completes the customizer thread. Pick this for closure.
- Game-screens redesign: the untouched half of the original "Revamp unit customizer and game UI" brief. Pick this for breadth.
- Wire the two new Playwright specs into `pr-checks.yml` as a small hygiene follow-up either way.

---
*Appendix*
**Decision crux:** Canonical spec supersession happens in the archive PR, not the feature PR (`openspec/AGENTS.md:27` + archive-PR history).
**Context factors:** Whether the user values a small review surface over gate cost (would flip to B); whether the archive PR is guaranteed to follow promptly (if not, A becomes safer).
**Missing information:** Whether `/compendium/chassis` should appear in shell navigation.
**Token cost:** ~440K subagent tokens (Metis 61K, Oracle 72K, Explore-Deep 109K, Momus 98K, two judges 97K) plus captain overhead.

Synthesis verified by omo-judge (2-pass, parallel). Both passes returned REVISE on non-load-bearing grounding gaps with no overlap and no verdict divergence: pass A flagged the unsourced "Codex's recommendation" claim, pass B flagged file:line citations lacking visible verification. Both were closed in this revision (source citation added to Phase 0; Captain verification block added under Synthesis). Decision, dissent, and Survival Score were confirmed by both passes.
