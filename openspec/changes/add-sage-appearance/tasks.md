# Tasks — add-sage-appearance

Ordered. Planning froze the contract; the implementation below is complete except for the defect
recorded as 5.5, which is outside this change's scope. Each line is a task and its evidence, and the four
gates must be green in one run at the end.

## 1. Freeze the contract

- [x] 1.1 Write the proposal, the `theme-system` delta and the design. EVIDENCE: 1 ADDED requirement /
  3 scenarios, every `#### Scenario:` header uses four hashes and there are zero three-hash headers.
- [x] 1.2 Validate strictly before any code exists. EVIDENCE: `openspec validate "add-sage-appearance"
  --type change --strict` → `Change 'add-sage-appearance' is valid` (exit 0); `openspec validate --all
  --strict` → `Totals: 19 passed, 0 failed (19 items)` (exit 0).

## 2. Record the fourth pinned palette

- [x] 2.1 Confirm the palette from its archived snapshot and record the five swatches in document order.
  EVIDENCE: COLOURlovers `1077213` "Limelicious" by `gracefulNothing`, snapshot `20100122015359`, the
  page's own `<title>` and `/lover/` link read back from
  `web.archive.org/web/20100122015359id_/http://www.colourlovers.com/palette/1077213/Limelicious`;
  swatches in document order `#535735 #ADB08B #729478 #EB4123 #31114D`.
- [x] 2.2 Record the provenance table and the role each swatch takes in `docs/design/palette.md` — sage
  `#ADB08B` (ground and panel are mixed from it, and it carries the rail's focus ring), olive `#535735`
  (the board's focus ring, and 70/30 with the violet for secondary text), leaf `#729478`, violet
  `#31114D` (ink, rail, selection band) — and the swatch deliberately not used, `#EB4123`, with its
  reason. EVIDENCE: the section "Fourth seed palette — the fifth appearance" in
  `docs/design/palette.md`, with the exclusion stated as a decision.
- [x] 2.3 Record the refused candidate palettes by id with their reasons. EVIDENCE: the table "Candidate
  palettes screened for the fifth appearance" in `docs/design/palette.md` names six refusals —
  `1077208` (near-neutral cool ground and slate rail: families the set already shows), `1188389` (brown
  ink and rail in Ember's family), `1007149` (plum-black ink beside the semantic plum, no saturated
  region), `1077234` (plum-red ink), `1007174` (orchid secondary colour), `100713` (high-chroma mint
  doing structural work) — with the screening counts (50 fetched, 20 cleared the bar, 9 also quiet).
- [x] 2.4 Record the measured pairs for the appearance next to its definition, on the same terms as the
  other four. EVIDENCE: the measured table in `docs/design/palette.md` gains a Sage column with the
  eleven text/focus pairs and the two informational rule rows.

## 3. The appearance

- [x] 3.1 Define the appearance's token set in `src/index.css` against the same semantic role names as
  the others — every role defined, no role added, semantic hues untouched. EVIDENCE: the
  `[data-theme="sage"]` block defines `color-scheme`, the four palette swatches, ground, panel,
  board-ground/panel/rail/rail-ink/hover/selected, ink, ink-muted, rule, rule-strong, attention,
  on-attention, plum, on-plum, focus, focus-rail and overlay-shadow — the same set `:root` and the other
  three blocks define; measured from the applied tokens, `--attention` = `#903078` and `--plum` =
  `#483048` in all five appearances.
- [x] 3.2 Register the appearance in `src/lib/appearance.ts` with its preview, and extend the first-paint
  id list in `index.html`. EVIDENCE: the switcher lists `System · follows light`, `Light · daylight`,
  `Dark · night`, `Dusk · dim light`, `Ember · warm light`, `Sage · tinted paper` — six entries with no
  change to the control — and the Sage row's preview resolves to its own ground `#E6E7DC`; the id list in
  `index.html` is now `["light","dark","dusk","ember","sage"]`, and with `sage` stored a deep-link load
  reads `data-theme="sage"` at t≈38 ms, before the module bundle runs, and is still `sage` at t≈776 ms.
- [x] 3.3 Verify the four shipped appearances are untouched. EVIDENCE: `git diff --stat HEAD` →
  `src/index.css | 49 +++++` with **0 deleted lines**, `index.html | 2 +-` (the id list),
  `src/lib/appearance.ts | 9 ++++++++-`; no line inside the light, dark, dusk or ember blocks changed.

## 4. The new requirement's first test

- [x] 4.1 Check the semantic fills against the appearance's own colours. EVIDENCE: on the Sage board —
  the active magnet renders `#483048` fill with `#F0F0F0` ink, the suspended magnet renders `#903078`
  with `#FFFFFF`, and the destructive confirm ("Deactivate Ada Nwosu?") renders its confirm button
  `#903078` with `#FFFFFF`; the appearance's own ink is `#31114D` and its ground `#E6E7DC`, so no fill is
  drawn in a colour of the appearance's own and no colour of the appearance's own is drawn in a semantic
  hue.
- [x] 4.2 Confirm the semantic hues did not move. EVIDENCE: the resolved `--attention` and `--plum` read
  from each appearance's own scope — light, dark, dusk, ember, sage all report `#903078` and `#483048`.

## 5. Verification

- [x] 5.1 The four gates green in one run. EVIDENCE: `npm run gate` → `GATE_EXIT=0`: `tsc -b` with no
  diagnostics; `oxlint` warnings only; `openspec validate --all --strict` → `Totals: 19 passed, 0 failed
  (19 items)`; `vite build` → `dist/assets/index-CFx1UCnI.css` 39.28 kB and
  `dist/assets/index-BfropeFi.js` 567.54 kB; `impeccable detect` exit 0 with the same two advisories as
  before, and the built CSS carries the new tokens, so the detector read them.
- [x] 5.2 Walk the new scenarios and the existing registry, composition, committed-rail, switcher and
  preview scenarios, with Sage active and with a second appearance active. EVIDENCE: pass —
  semantic hues identical in every appearance; semantic fills stay distinct on the Sage board; a refused
  candidate is recorded; every registered appearance is offered (six entries); an appearance's surfaces
  are its own (Sage's ground/panel/rail/ink measured); the committed-rail rule (the rail is the violet
  `#31114D`, the one region owning a saturated ground); the switcher follows the registry. **Fail —
  "A non-active appearance previews its own colours" for the Light row**: see 5.5.
- [x] 5.3 First paint with the appearance stored. EVIDENCE: with `sage` stored, a deep link
  (`/users/usr_030`) reads `data-theme="sage"` at t≈38 ms and after mount, with the record rendered
  (h1 "Ada Nwosu"); reload keeps it; removing the stored choice returns the board to the machine's
  preference (`light` on this machine, which does not prefer dark), and storing `sage` again applies it.
- [x] 5.4 The recorded pairs match the browser. EVIDENCE: every token painted onto a probe element and
  read back — ground `#E6E7DC`, panel `#F5F6F1`, rail and ink `#31114D`, selection band `#BBB4BA`,
  secondary text `#49423C`, board ring `#535735` (6.05:1 on the ground, 6.95:1 on a panel), rail ring
  `#ADB08B` (7.10:1 on the rail) — reproducing the Sage column in `docs/design/palette.md`. The rail's
  other controls draw their ring in the rail's own ink (7.68:1 on the violet rail), which is the
  pre-existing pattern: under Ember the same pair measures 4.26:1.
- [ ] 5.5 Out of scope, recorded so it is not lost: the **Light row of the switcher previews the active
  appearance's colours** rather than its own whenever a non-light appearance is active. Reproduced on the
  deployed build **before this change** (with Ember active, both the System and Light rows preview
  `#ECD5C3`, Ember's ground, instead of Light's `#F0F0F0`), because the light appearance is defined on
  `:root` and a nested `data-theme="light"` scope therefore inherits whatever is active. The Sage row
  previews correctly. Fixing it changes the theme-system's preview behaviour, so it needs its own change
  or an explicit scope extension — this change does not touch it.
