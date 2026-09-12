# Layout worker report

## Changes

- `CustomizerWorkbench.module.css`: shared six-column catalog grid (`name` / `category` / `weight` / `criticalSlots` / `heat` / `actions`), actions track `44px`, sticky header in the same `catalogScroll` region with `scrollbar-gutter: stable` and matching 1px side inset. Add hit target `44px` with `30px` translucent glyph. **Parent-review repair:** `.catalogSortButton` tracks are `minmax(0, 1fr) auto minmax(0, 1fr)` so the arrow-bearing side cannot keep an automatic minimum and un-center the label.
- `EquipmentBrowser.tsx`: header moved inside the scroll container; `data-catalog-column` on each header grid child; sort label/arrow split so the label sits on the value center; mobile Sort popover unchanged.
- `EquipmentCatalogCard.tsx`: collapsed Add is `AppIcon add` (`aria-label` / `title` still `Add <name>`); Add and place only in expanded details; row grid children tagged; desktop name truncated/centered; `lg:grid` uses the shared columns.
- `design.md` / `specs/equipment-browser/spec.md`: existing presentation and Add/place prose only. No checkboxes.

## Checks

- `npx oxfmt --write` on owned files: pass.
- `npx jest src/__tests__/components/customizer/equipment/EquipmentBrowser.test.tsx --no-coverage`: **13 passed, 1 failed**. Failure is `getAllByText('Add')` after the plus-only visible Add. Accessible name `Add <name>` is retained (`getByRole` read-only case still passed).

## Pending peer work

- Proof worker owns the selector migration (literal `Add` text → `Add <name>` role name) in e2e / card tests. Not edited here.
- Parent owns Chromium acceptance of the `minmax(0, 1fr)` sort-label centering (prior measured error: Tons `-7.32px`, Slots `-2.66px`).
