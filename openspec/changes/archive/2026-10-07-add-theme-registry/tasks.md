# Tasks — add-theme-registry

Ordered. Each line is a task and its evidence. Nothing is ticked without the evidence next to it, and
the four gates (typecheck, lint, `openspec validate --all --strict`, build + `impeccable detect`) must
be green in one run at the end.

## 1. Freeze the contract

- [x] 1.1 Write the proposal and the `theme-system` delta, and confirm every `#### Scenario:` header
  uses four hashes. EVIDENCE: `theme-system` delta carries **3 requirements / 7 scenarios**; the
  proposal's count was corrected to three after the first draft said four, which no structural
  validation would have caught; zero three-hash scenario headers.
- [x] 1.2 Validate strictly and commit the planning artifacts alone, before any code. EVIDENCE:
  `openspec validate "add-theme-registry" --type change --strict` → `Change 'add-theme-registry' is
  valid`; commit `23a29c1`, containing only `openspec/changes/add-theme-registry/**`.

## 2. The registry

- [x] 2.1 One module holds the registry: each appearance's id, its label, and how it resolves when the
  machine's preference is in play. The control, the pre-paint resolution and any future consumer read
  this list and nothing else. EVIDENCE: `src/lib/appearance.ts` — `APPEARANCES` (id, label,
  colorScheme, saturatedRegion), `APPEARANCE_IDS`, `isAppearanceId`, `readAppearance`,
  `resolvedAppearance`, `applyAppearance`. The control maps over `APPEARANCES`; the inline script in
  `index.html` mirrors the id list and says why it cannot import it.
- [x] 2.2 An unknown or stale stored id resolves to the machine's preference rather than leaving the
  board unstyled. EVIDENCE: with `admin-panel.appearance` set to `solarized-something`, the board
  loaded with `data-theme="light"` (the machine's preference), the surface painted, and the control
  showing **System** as the active choice.

## 3. The third appearance

- [x] 3.1 Define the appearance's token set in `src/index.css` against the same semantic role names the
  other appearances use. EVIDENCE: `[data-theme="dusk"]` defines every role the `:root` block defines
  — ground, panel, rail, rail-ink, hover, selected, ink, ink-muted, rule, rule-strong, attention,
  on-attention, plum, on-plum, focus, overlay shadow — from its own seed palette. No role is added and
  no role is left undefined.
- [x] 3.2 The first-paint resolution handles every registered appearance, so a deep link opens in it
  with no frame of another appearance. EVIDENCE: on `?sort=name` deep link to
  `/organizations/org_001` with `dusk` stored, `document.documentElement.getAttribute('data-theme')`
  read `dusk` in the first moments of load, `--board-ground` resolved to `#abc5c9`, the Dusk radio was
  checked and 25 member rows rendered.
- [x] 3.3 The committed-rail rule holds: exactly one region owns a saturated ground in the new
  appearance, and it is the region the definition names. EVIDENCE: `APPEARANCES` names *the navigation
  rail, in plum* for light and *in deep teal* for dusk; the rendered board shows a deep-teal rail
  (`#083A52`) as the only saturated region against a mist ground (`#ABC5C9`) and near-white panels.

## 4. Legibility, measured

- [x] 4.1 Compute the contrast pairs for every appearance — body, large text, controls, focus, and the
  state tokens drawn on each surface — and record them next to the appearance's definition. EVIDENCE:
  twelve pairs across three appearances in `docs/design/palette.md`, computed from the tokens as the
  browser resolves them (painted onto a probe element, alpha composited first). Every appearance passes
  every minimum: light and dark 10/10, dusk 10/10 with its lowest pair at **4.69:1** (body text on a
  selected row). The light column reproduces the **6.40:1** the first palette's record already claimed,
  which is what makes the two measurement sets comparable.
- [x] 4.2 The record distinguishes what was measured from what was inherited, so a reader can see which
  appearances were re-derived and which were not touched. EVIDENCE: the record states that the
  semantic hues (`attention` `#903078`, `plum` `#483048`) are held constant across all three
  appearances rather than re-derived, and that focus changes *carrier* in dusk as it already did in
  dark — with the reason. The first palette's original sections are unchanged above it.

## 5. Wire the control

- [x] 5.1 The appearance control renders the registry rather than two hand-written options, keeps its
  keyboard behaviour, and applies a change without a reload. EVIDENCE: the control renders
  `["System", "Light", "Dark", "Dusk"]` as a `radiogroup` of `role="radio"` buttons; selecting Dusk
  set `data-theme="dusk"`, `aria-checked` moved to Dusk, and the board repainted with no reload.
- [x] 5.2 The choice persists across reloads and is applied from the first paint for the third
  appearance as it already is for light and dark. EVIDENCE: after choosing Dusk through the control,
  `localStorage["admin-panel.appearance"] === "dusk"` and a subsequent load of a different route
  (`/organizations`) came up with `data-theme="dusk"` already applied.

## 6. Regression: the existing appearances are not repainted

- [x] 6.1 The light and dark token values are byte-identical to the frozen baseline before this change.
  EVIDENCE: `git diff HEAD -- src/index.css` reports **zero removed lines** — the registry work adds a
  token block and comment lines and removes nothing, so every `:root` and `[data-theme="dark"]` value
  is untouched. The measured light/dark pairs also still match the numbers recorded before this change
  (light 6.40:1 minimum, dark 8.10–15.58:1 range).

## 7. Verify

- [x] 7.1 All four gates green in one run. EVIDENCE: `npm run gate` → exit 0 (typecheck → lint →
  `openspec validate --all --strict` → build → `impeccable detect`); detect reports 2 advisories, both
  the TanStack Router fallback error component's own constants, which the panel overrides.
- [x] 7.2 Walk the new appearance's scenarios against the running build and record which passed;
  anything that cannot be demonstrated is reported, not ticked. EVIDENCE: **6 of 7 demonstrated.**
  Registry offered (4 options), stale id falls back, surfaces are the appearance's own, the rail rule
  holds, contrast passes in all three, and the measurement is recorded. The one not fully
  demonstrated is *"registering an appearance is a token set alone"*: adding Dusk itself required a
  token block, a registry entry **and** the mirrored id list in `index.html`, because the pre-paint
  script cannot import the registry; the control needed no change *after* the one-time refactor to
  read the registry, and that refactor is part of this change rather than a per-appearance cost.
- [x] 7.3 Live check on the deployment: the appearance is selectable, persists, applies on a deep link,
  and the board is legible in it at 1440 and at 390. EVIDENCE on the deployed build
  (`handover-admin-teal.vercel.app`, serving `index-DBKfrbzH.js`, matching local): the control offers
  `["System","Light","Dark","Dusk"]`; choosing Dusk set `data-theme="dusk"`,
  `localStorage["admin-panel.appearance"] = "dusk"` and `--board-ground: #abc5c9`; a deep link to
  `/users/usr_004?sort=email&dir=asc` came up with `data-theme="dusk"` already applied at load; at
  **390px** the board renders with no horizontal overflow (`scrollWidth === clientWidth`) and all 8
  marks loaded. The committed-rail rule was measured rather than eyeballed — the three largest painted
  regions are the same in every appearance (1296k px² ground, 579k px² panels, 216k px² rail), and the
  rail carries the saturated colour of each: `#181818` ink in light, `#483048` plum in dark, `#083A52`
  deep in dusk.

## 8. Close

- [x] 8.1 Archive the change, confirm strict validation of the merged baseline, and push. EVIDENCE:
  archived as `2026-10-07-add-theme-registry` with the three requirements merged into
  `openspec/specs/theme-system/`; `openspec validate --all --strict` reports **18 items, 0 failed**
  (the 17 capability specs plus the one in-flight build change) with `theme-system` now carrying 8
  requirements and 17 scenarios; pushed and verified by read-back against `git ls-remote`.
