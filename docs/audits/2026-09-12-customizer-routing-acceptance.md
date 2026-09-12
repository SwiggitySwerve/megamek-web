# Customizer routing acceptance

PR [#1637](https://github.com/SwiggitySwerve/MekStation/pull/1637) fixes explicit editor tab selection after stored state hydrates. Explicit valid tabs win; omitted tabs preserve existing restoration.

Verified main commit: `47c4464840eaa7c62044533621eb265a4ab71215`. Reviewed PR head: `aff3a051a0f52e0b35005ea1b3b7406381f577dc`. The squash merge has an identical Git tree.

All four protected checks passed: Lint and Test; Build Test / win, mac and linux. No unresolved review threads or changes-requested review existed at merge. Required GitHub approval count was zero; an independent Luna engineering review and parent review were recorded locally. The extra combat job reported all steps successful while its final job state still lagged. No check was bypassed.

## Fresh main proof

| Check            | Result | Output SHA-256                                                     |
| ---------------- | ------ | ------------------------------------------------------------------ |
| focused-main-1   | Passed | `df88742e0589b4754e5693b19869b545be1d1e327a48f7c7215ccba93238d568` |
| typecheck-main-1 | Passed | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| lint-main-1      | Passed | `e2a9c2c3f00d740e9b4e63d07d3d475f9f9fdc1f9b1872916a639d3712985e53` |
| format-main-1    | Passed | `344803162ecae29176d2a2fa03b6d6c4f9a95fd1bb7dd6828f064825c4e57d51` |
| spec-main-1      | Passed | `749c0403cd63049e2a19c1b3d26d389e4476ef4afac7ec2aa473501a5179076f` |
| build-main-1     | Passed | `57540873863cdc2f599f10dc0d65e4d16189e0abc52920e18dd9233d75c31cf8` |
| hydrate-main-1   | Passed | `440b61a33c9099385a826c2e28f12f7729dc1535a21e2e81aad6bfca0b427c85` |
| browser-main-1   | Passed | `07dedce188366a5b04efd304874c678214e08438d7842c821a2c6dd022e41398` |

The focused run passed 12 tests in four suites: router parsing, router recovery, actual customizer composition, and campaign return-route helpers. The browser run passed one production Chromium case with zero retries on isolated port 3637. It checks an explicit Structure link, cold reload, retained edits, and omitted-tab Preview restoration.

Commands use the repository Jest runner, nonincremental TypeScript check, npm lint and format checks, strict all-item OpenSpec validation, the production Next webpack build, standalone hydration, and the repository Playwright wrapper. Browser selection: `e2e/customizer-edit-recovery.spec.ts --project=chromium --grep "explicit Structure" --retries=0 --workers=1 --trace=retain-on-failure`. Build flags: `NEXT_PUBLIC_E2E_MODE=true` and `NEXT_PUBLIC_E2E_TEST=true`.

## Scope and specification closure

The campaign characterization covers hydration timing and the unavailable-unit return callback; helper tests cover the return URL. Full campaign loader persistence and browser hard navigation remain governed by the journey package. This receipt does not activate the later customizer CI job or prove other combat/campaign requirements.

The complete explicit-tab delta already matches canonical customizer-routing byte for byte. Canonical customizer-tabs also preserves omitted-tab restoration and explicit-tab precedence. Archive skips duplicate specification writes only; normal archive and strict validators remain enabled.

Earlier combined-tree counts in the archived tasks are historical local receipts. The checks above are the acceptance evidence for the merged routing slice. Detailed raw local logs remain in the completion program evidence directory with the hashes recorded here.
