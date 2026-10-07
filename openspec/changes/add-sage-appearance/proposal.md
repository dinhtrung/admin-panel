## Why

The registry, the switcher and the measurement rule now exist, and they have been exercised exactly
twice — by the two changes that created them. A fifth appearance is the first test of the registry that
does not also build a mechanism: if registering an appearance really is a token set and a registry
entry, adding one should touch no component, screen or shell file.

The set also has a gap. The four appearances answer four lights — a cool daylight, the dark, a dim cool
room, a warm light — but every one of their grounds is either a near-neutral white, a mid mist or a
tanned surface. None of them is a **tinted form paper**, which is what the direction's printed board is
made of, and none is quiet enough to read a long list on without the tint doing work.

The screening that produced the candidate found a second, sharper reason. Fifty archived palettes were
fetched and measured with the recipe the shipped tokens already use; twenty cleared the contrast bar
and nine of those were quiet enough in tone, but three otherwise-passing palettes had to be refused
because their ink or their tint sat in the same colour family as a semantic hue. The panel reserves
`#903078` (attention) and `#483048` (plum) in every appearance, on the stated principle that a state
which changes colour with the lighting is a state the operator cannot learn — and today the only thing
stopping an appearance from drowning those two hues in its own purple is a paragraph in
`docs/design/palette.md`. By the bridge rule, a rule that lives only in a document is behaviour nobody
approved.

## What Changes

- **`theme-system` gains one requirement** (it keeps all ten it has): an appearance keeps the semantic
  vocabulary recognisable — attention and plum stay distinguishable from that appearance's own surfaces,
  ink and tint, and a candidate whose own colours sit in the family of a semantic hue is refused and the
  refusal recorded. Two scenarios: the semantic fills stay distinct in every appearance, and a refused
  candidate is recorded with its reason.
- **A fifth appearance ships through the registry**: **Sage** — the first tinted-paper appearance,
  seeded by a fourth pinned COLOURlovers palette (`1077213` "Limelicious" by `gracefulNothing`, archive
  snapshot `20100122015359`, recorded with its swatches and its refused neighbours in
  `docs/design/palette.md`). It is composed, not inverted: a sage ground, a violet ink, and a rail that
  owns the appearance's one saturated region.
- **The appearance's token set**, expressed in the same semantic roles the other appearances define
  (no role added, none removed):

  | Role | Value | Comes from |
  |---|---|---|
  | `palette-sage` | `#ADB08B` | the palette's pale sage — the ground and panel are mixed from it |
  | `palette-sage-olive` | `#535735` | the palette's dark olive — the focus ring on the board |
  | `palette-sage-leaf` | `#729478` | the palette's leaf green |
  | `palette-sage-violet` | `#31114D` | the palette's violet — ink, rail and the selected band |
  | board ground | `#E6E7DC` | sage mixed 30% toward the paper |
  | panel | `#F5F6F1` | sage mixed 12% toward the paper |
  | rail | `#31114D` | the violet — **the one region owning a saturated ground** |
  | ink | `#31114D` | the violet |
  | ink-muted | `#49423C` | the olive mixed 70/30 with the violet |
  | selected band | `#BBB4BA` | the violet mixed 24% into the ground |
  | focus (board) | `#535735` | the olive |
  | focus (rail) | `#ADB08B` | the sage |
  | attention / plum | `#903078` / `#483048` | unchanged, as in every appearance |
  | `#EB4123` | **not used** | the palette's red-orange; at any structural size it competes with the attention fill, so the exclusion is a decision rather than an omission |
- **Its measured pairs, recorded with the definition** (WCAG 2.1 relative luminance, computed with the
  same recipe that reproduces the three published rows for Ember — 6.23 vs 6.24 body on the ground,
  4.90 vs 4.92 muted on the ground, 6.23 vs 6.24 rail label, 4.60 vs 4.61 focus on a panel, 3.73 vs
  3.74 focus on the ground):

  | Pair | Minimum | Sage |
  |---|---|---|
  | body text on the ground | 4.5:1 | 12.77 |
  | body text on a panel | 4.5:1 | 14.67 |
  | muted text on the ground | 4.5:1 | 7.91 |
  | muted text on a panel | 4.5:1 | 9.09 |
  | body text on a selected row | 4.5:1 | 7.85 |
  | rail label on the rail | 4.5:1 | 12.77 |
  | text on a plum fill | 4.5:1 | 10.28 |
  | text on an attention fill | 4.5:1 | 7.29 |
  | focus ring on a panel | 3:1 | 6.95 |
  | focus ring on the ground | 3:1 | 6.05 |
  | focus ring **on the rail** | 3:1 | 7.10 |
  | hairline rule on a panel *(informational)* | — | 1.65 |
  | strong rule on a panel *(informational)* | — | 3.04 |

- **The four appearances already shipping keep their tokens**, byte for byte; this change must not
  repaint them, and the semantic hues do not move.
- No other capability's behaviour changes.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `theme-system`: adds the requirement that the semantic vocabulary stays recognisable in every
  appearance, with the refusal-and-record behaviour. The existing requirements — the registry, the
  composition rule, the committed-rail rule, the measurement bar — already cover the *addition* of a
  fifth appearance, which is why this change adds no requirement about adding one.

## Impact

- **Code**: `src/index.css` (the fifth appearance's token block — the only place its colours should
  appear), `src/lib/appearance.ts` (the registry entry with its preview pair), `index.html` (the
  first-paint id list, which mirrors the registry because it runs before paint).
- **Data**: the stored appearance preference gains a fifth valid value; an unrecognised value still
  resolves to the machine's preference.
- **Docs**: `docs/design/palette.md` records the fourth pinned palette — its archive snapshot, the role
  each swatch took, the swatch deliberately unused, the refused candidate palettes with their reasons,
  and the measured pairs — plus the fourth row in its measured table; `DESIGN.md` gains the appearance.
- **Gates**: unchanged — typecheck, lint, `openspec validate --all --strict`, build, `impeccable detect`.
  The detector runs over the shipped CSS, so the new tokens are inside its scope.
- **Not affected**: every screen, the switcher and its previews, the mock layer, routing, permissions,
  the semantic hues, and the tokens of the four appearances already shipping.
