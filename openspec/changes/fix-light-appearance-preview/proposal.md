## Why

`theme-system` already requires that every entry in the appearance switcher previews **its own**
appearance's colours, including when it is not the active one. Five of the six rows satisfy that. The
**Light** row does not: it previews whatever appearance is currently applied.

Measured on the deployed build **before** any of this work: with Ember active, both the `System` and
`Light` rows preview `#ECD5C3` — Ember's ground — instead of Light's `#F0F0F0`. Reproduced again with
Sage active on the current build, where the same two rows preview `#E6E7DC`.

The cause is where the light appearance lives. The registry's other four appearances each have a
`[data-theme="…"]` block that a subtree can resolve; the light tokens sit on `:root`, and a preview is a
subtree carrying its appearance's `data-theme`. A nested `data-theme="light"` scope therefore has
nothing of its own to resolve and inherits the root element's tokens. The row misrepresents Light
exactly when the operator is looking at it to decide whether to switch back.

## What Changes

- The light appearance's token block is selected by `:root, [data-theme="light"]` rather than `:root`
  alone, so a subtree that declares the light appearance resolves the light tokens instead of inheriting
  the active ones. **One selector; no token value changes.**
- The comment above the block records why the second selector exists, so the next appearance does not
  reintroduce the defect by copying the `:root`-only form.
- Nothing else moves: no token added or removed, no other appearance touched, the registry, the switcher
  and the preview mechanism unchanged, and the stored preference unchanged.
- No requirement is added or amended. "A non-active appearance previews its own colours" is an existing
  requirement of `theme-system` (added by `add-theme-switcher`), and this change makes the stylesheet
  satisfy it — so the change declares `skip_specs: true` rather than inventing a requirement to describe
  a defect fix.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- None. `theme-system` is already correct; the stylesheet was not. `.openspec.yaml` declares
  `skip_specs: true` for that reason.

## Impact

- **Code**: `src/index.css` — one selector, plus the comment above it.
- **Data**: none. The stored choice, its fallback to the machine's preference, and the first-paint
  script are untouched.
- **Docs**: none required. `DESIGN.md`'s registry paragraph ("each row previews its own appearance")
  becomes accurate rather than staying aspirational.
- **Gates**: unchanged — typecheck, lint, `openspec validate --all --strict`, build, `impeccable detect`.
- **Not affected**: every appearance's own look (the tokens are byte-identical), screens, routing, the
  mock layer, and the switcher's keyboard and dismissal behaviour.
