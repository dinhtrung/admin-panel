# Tasks — fix-light-appearance-preview

One selector, verified on the running build. The four gates must be green in one run at the end.

## 1. Record the defect

- [x] 1.1 Reproduce it on a build that predates this change. EVIDENCE: the deployed build (commit
  `4146b5f`) with `ember` stored — the switcher's `System` and `Light` rows both preview `#ECD5C3`,
  Ember's ground, where Light's ground is `#F0F0F0`; the other four rows preview their own
  (`#181818`, `#ABC5C9`, `#ECD5C3`). Reproduced again with `sage` stored on the current build, where the
  same two rows preview `#E6E7DC`.
- [x] 1.2 Name the cause and the fix. EVIDENCE: the light tokens are selected by `:root` alone, so a
  nested `data-theme="light"` scope has no block of its own and inherits the root element's tokens; the
  fix is to select the block with `:root, [data-theme="light"]`.

## 2. Apply it

- [x] 2.1 Change the selector and record why the second one exists, so the next appearance does not copy
  the `:root`-only form. EVIDENCE: `git diff` of `src/index.css` against the Sage commit → 1 file,
  8 insertions / 2 deletions, and the only changed lines are the comment above the block and the
  selector itself (`:root {` → `:root,` / `[data-theme="light"] {`); the count of changed lines that
  declare a token (`^[+-]\s*--[a-z-]+:`) is **0**.
- [x] 2.2 Verify the preview row by row with a non-light appearance active. EVIDENCE: on the dev build
  with `ember` stored, the switcher's six rows preview `#F0F0F0` (System), `#F0F0F0` (Light),
  `#181818` (Dark), `#ABC5C9` (Dusk), `#ECD5C3` (Ember), `#E6E7DC` (Sage) — the Light row was `#ECD5C3`
  before this change.
- [x] 2.3 Verify nothing else moved. EVIDENCE: resolved tokens read back per appearance — light ground
  `#F0F0F0` rail `#181818`, dark `#181818` / `#483048`, dusk `#ABC5C9` / `#083A52`, ember `#ECD5C3` /
  `#703E14`, sage `#E6E7DC` / `#31114D`, with `--attention` `#903078` and `--plum` `#483048` in all
  five — and a dark scope nested inside a light scope resolves dark (`#181818` / `#483048`).

## 3. Gates

- [x] 3.1 The four gates green in one run. EVIDENCE: `npm run gate` → `GATE_EXIT=0`: `tsc -b` no
  diagnostics, `oxlint` warnings only, `openspec validate --all --strict` → `Totals: 20 passed, 0 failed
  (20 items)`, `vite build` → `dist/assets/index-DMOjNV12.css` 39.41 kB and
  `dist/assets/index-CayGwJM2.js` 567.54 kB, `impeccable detect` exit 0 with the same two advisories.

## 4. Ledger

- [x] 4.1 Close the defect recorded as 5.5 of `add-sage-appearance`. EVIDENCE: that change's 5.5 is
  ticked with a pointer to this change.

