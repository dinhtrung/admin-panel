## Why

The appearance registry holds four choices — system, light, dark, dusk — and the control that presents
them is a segmented row of four buttons. That row is the last thing in the panel still sized for a
fixed number of appearances: a fifth makes the labels collide at the rail's width, a sixth would
overflow it, and the segmented row has no room for the one thing that would actually help an operator
choose — a preview of what each appearance looks like.

The registry requirement says the control SHALL offer every registered appearance "whatever its
number". A row of segments quietly contradicts that: it offers every appearance only while the count
stays small enough to fit.

## What Changes

- **`theme-system` gains two requirements** (it keeps all eight it has):
  - the appearance control is a **switcher** — one control that presents every registered appearance
    and scales with the registry rather than a row of segments sized for a fixed count;
  - each entry **previews that appearance's own colours**, so the choice can be made by looking at it,
    and the active appearance is indicated in the same list.
- **A fourth appearance ships through the registry**: a warm one for a warm light, **seeded by a third
  pinned COLOURlovers palette** (`1001576` "Clay" by `eponine`). Light, Dusk and Dark cover a cool
  daylight, a dim cool room and the dark; a warm-lit room has no appearance of its own, and the panel
  spends its one saturated region on warm brown rather than on the plum or teal the others use.
- **Each entry previews its appearance through that appearance's own scope**: the switcher renders a
  row's swatch inside an element carrying that appearance's `data-theme`, so the preview is the real
  tokens resolved in a subtree — which works for appearances that are not currently applied, the case
  this was worried about. A first draft kept a copy of each appearance's colours in the registry for
  the preview; that copy was dropped during implementation because a preview holding its own copy is a
  preview that can drift from what choosing it does, and it would have added a four-colour field that
  nothing else reads. The requirements are unaffected — they ask that a preview be the appearance's own
  colours, not how it obtains them.
- Behaviour of the existing capabilities is unchanged. The four appearances already shipping keep
  their tokens: this change must not repaint them, and the legibility bar applies to the new one on the
  same terms as the rest — including the focus ring, which is measured on the rail as well as on the
  panels.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `theme-system`: adds the switcher requirement and the preview requirement. The existing requirement
  that the control offers every registered appearance and indicates the active one is what the switcher
  is measured against; the existing legibility, persistence and first-paint requirements extend to the
  fourth appearance without amendment.

## Impact

- **Code**: `src/index.css` (the fourth appearance's token block — the only place a new appearance's
  colours should appear), `src/lib/appearance.ts` (the registry entry plus the preview pair),
  `src/shell/AppearanceControl.tsx` (the switcher, replacing the segmented row), `index.html` (the
  first-paint id list, which mirrors the registry because it runs before paint).
- **Data**: the stored preference gains a fourth valid value; an unrecognised value still resolves to
  the machine's preference.
- **Docs**: `docs/design/palette.md` records the third pinned palette, its archive snapshot, the role
  each swatch took, and the measured pairs for the new appearance including its rail focus ring;
  `DESIGN.md` gains the fourth row in the appearances table.
- **Gates**: unchanged — typecheck, lint, `openspec validate --all --strict`, build, `impeccable detect`.
- **Not affected**: every screen, the mock layer, routing, permissions, the semantic hues (attention
  and plum stay `#903078` and `#483048` in every appearance), and the tokens of the three appearances
  already shipping.
