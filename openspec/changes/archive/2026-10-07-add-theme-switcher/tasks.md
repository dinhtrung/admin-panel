# Tasks — add-theme-switcher

Ordered. Each line is a task and its evidence, and the four gates must be green in one run at the end.

## 1. Freeze the contract

- [x] 1.1 Write the proposal and the `theme-system` delta; every `#### Scenario:` header uses four
  hashes. EVIDENCE: **2 requirements / 6 scenarios**, and zero three-hash scenario headers.
- [x] 1.2 Validate strictly and commit the planning artifacts alone, before any code. EVIDENCE:
  `openspec validate "add-theme-switcher" --type change --strict` → `Change 'add-theme-switcher' is
  valid`; commit `4146b5f`, containing only `openspec/changes/add-theme-switcher/**`.

## 2. The fourth appearance

- [x] 2.1 Record the third pinned palette's provenance (`docs/design/palette.md`): site, title, id,
  author, original URL, the Internet Archive snapshot used, and the five swatches verbatim.
  EVIDENCE: COLOURlovers `1001576` "Clay" by `eponine`, snapshot `20100326071244`, swatches read from
  the archived page in document order: `#AD5207 #F77D19 #BF7436 #8C5223 #703E14`. Each swatch's role
  is recorded, **including the one deliberately not used** (`#F77D19`) with the reason, so the
  exclusion reads as a decision rather than an omission.
- [x] 2.2 Define the appearance's token set in `src/index.css` against the same semantic role names as
  the others — every role defined, no role added, semantic hues untouched. EVIDENCE: the
  `[data-theme="ember"]` block defines every role `:root` defines (ground, panel, rail, rail-ink, hover,
  selected, ink, ink-muted, rule, rule-strong, attention, on-attention, plum, on-plum, focus,
  focus-rail, overlay shadow). `--attention` and `--plum` still resolve to `#903078` and `#483048`:
  the semantic hues did not move.
- [x] 2.3 Give the appearance its own rail focus ring, because the ring is drawn on the surface behind
  the control and this appearance's rail is its own colour. EVIDENCE: `--focus: #AD5207` for panels,
  `--focus-rail` = the appearance's own pale surface. Measured: ring on a panel **4.61:1**, on the
  ground **3.74:1**, **on the rail 6.24:1** — all above their minimums, and in particular not the
  1.00:1 the finish review caught in the appearance shipped before this one.
- [x] 2.4 The first-paint resolution covers it, so a deep link opens in it with no frame of another
  appearance. EVIDENCE: with `ember` stored, a deep link read `data-theme="ember"` in the first moments
  of load and was still `ember` after the app mounted.

## 3. The switcher

- [x] 3.1 Replace the segmented row with a switcher driven by the registry: one control, every
  registered appearance, the active one indicated. EVIDENCE: the switcher lists
  `System · Light · Dark · Dusk · Ember` — five entries with no control change beyond this one, and
  the active one carries `aria-checked="true"`. The entries are built by mapping `APPEARANCES`, so a
  fifth appearance is a registry entry and nothing else.
- [x] 3.2 Each entry previews that appearance's own colours, including appearances that are not
  currently applied. EVIDENCE: each row's swatch carries that appearance's `data-theme`, and the
  rendered halves were compared against each appearance's own tokens — ground and rail **match for all
  four** (light `#F0F0F0`/`#181818`, dark `#181818`/`#483048`, dusk `#ABC5C9`/`#083A52`, ember
  `#ECD5C3`/`#703E14`), while the applied appearance was Light. The first design kept a copy of the
  colours in the registry; that copy was dropped once the scoped approach worked, because a preview
  holding its own copy can drift from what choosing it does.
- [x] 3.3 Keyboard operation: open, move, choose, dismiss-without-choosing, with focus returned to the
  switcher. EVIDENCE: tabbing reaches the trigger; **Enter and Space both open** the list with focus on
  the first entry (`role="menuitemradio"`); ArrowDown → Light, ArrowDown → Dark, ArrowUp → Light,
  Home → System, End → Ember; **Escape closes without changing the appearance and returns focus to the
  trigger**; Enter on an entry applies it, closes the list and returns focus to the trigger. The
  behaviour comes from the shared `Menu` primitive, which this change extended rather than duplicated.
- [x] 3.4 Both tones still work where the control is used — the rail and the Settings panel — and it
  fits the rail's width at 1440 and 390. EVIDENCE: at 390px in the drawer (rail tone) the trigger is
  85×31 and the list is 224×168, opens **upward** (it sits at the bottom of the viewport), fully inside
  the viewport, with `scrollWidth === clientWidth` (no horizontal overflow); the Settings panel tone
  opens downward. The list uses `w-max min-w-56`, so it is sized by its content rather than by the
  narrow trigger.

## 4. Legibility, measured, for all four

- [x] 4.1 Measure the contrast pairs for the new appearance, including its rail ring, and record them
  beside the other appearances. EVIDENCE: **11 of 11 pairs pass** — body on ground 6.24, on panel 7.70,
  muted on ground 4.92, on panel 6.07, body on a selected row 4.68, rail label on rail 6.24, text on an
  attention fill 7.29, text on a plum fill 10.28, focus ring 4.61 / 3.74 / 6.24 (panel / ground /
  rail). Rules are 1.48 and 2.32, recorded as information. All of it is in `docs/design/palette.md`,
  whose table now carries an Ember column, and the four Clay tokens are in `DESIGN.md`'s frontmatter so
  the design detector can account for them.
- [x] 4.2 The three existing appearances are not repainted. EVIDENCE: `git diff -- src/index.css` →
  **45 insertions, 0 deletions**, so no line of the `:root`, `dark` or `dusk` blocks was touched; their
  measured pairs are unchanged from the numbers already recorded. `impeccable detect` reports the same
  two dependency advisories and no new colour advisories.

## 5. Verify

- [x] 5.1 All four gates green in one run. EVIDENCE: `npm run gate` → exit 0 (typecheck → lint →
  `openspec validate --all --strict` → build → `impeccable detect`); detect → 2 advisories, both
  TanStack Router's own fallback-component constants.
- [x] 5.2 Walk every scenario of this change against the running build; anything that cannot be
  demonstrated is reported, not ticked. EVIDENCE: **6 of 6 demonstrated.** Every registered appearance
  offered in one list with the active one indicated; a new registry entry appears without the control
  being rewritten (that is how Ember arrived); choosing applies without a reload; keyboard operation
  including a dismiss that leaves the appearance unchanged; a non-active appearance previews its own
  colours; and the previews match the appearances' tokens. Nothing in this change is left
  undemonstrated.
- [x] 5.3 Live check on the deployment: the switcher opens, previews every appearance, applies and
  persists a choice, and the new appearance is legible at 1440 and 390. EVIDENCE: on the deployed build
  (bundle `index-BdaJKTbO.js`, matching local) the switcher lists all five with the active one marked;
  choosing Ember set `data-theme="ember"`, `localStorage["admin-panel.appearance"] = "ember"` and the
  trigger read "Ember"; a deep link to `/feature-flags` came up in Ember at first paint; all 8
  organization marks load on the warm ground; at 390px the switcher and its list stay inside the
  viewport with no page overflow.

## 6. Close

- [x] 6.1 Archive the change, confirm strict validation of the merged baseline, and push. EVIDENCE:
  archived as `2026-10-07-add-theme-switcher`, merging 2 requirements and 6 scenarios into
  `openspec/specs/theme-system/` (now 10 requirements / 23 scenarios); `openspec validate --all
  --strict` → **18 items, 0 failed** (17 capability specs plus the one in-flight build change), and the
  baseline now carries **87 requirements / 215 scenarios**; pushed and verified against `git ls-remote`.
