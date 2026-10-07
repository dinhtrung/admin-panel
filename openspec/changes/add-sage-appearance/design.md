## Context

See `proposal.md` — Why. The constraints that shape the approach:

- The registry, the switcher and the preview mechanism are built; an appearance is a token set plus a
  registry entry, and the pre-paint script in `index.html` mirrors the registry id list because it runs
  before paint.
- The shipped appearances are composed from pinned COLOURlovers palettes with recorded provenance
  (`docs/design/palette.md`), and the semantic hues `#903078` and `#483048` are identical in all of them.
- Candidate palettes are only reachable through the Internet Archive: `colourlovers.com` answers
  automated requests with a Cloudflare challenge and its JSON API was retired, so a seed palette is
  fetched from an archived snapshot and pinned with its timestamp.
- Screening used the recipe the shipped tokens already use — ground = lightest swatch mixed 30% toward
  paper, panel = 12%, rail = the darkest swatch, ink = the darkest swatch, selection = the board ring
  mixed 24% into the ground, the ring split between a board carrier and a rail carrier. The recipe was
  calibrated before it was trusted: re-derived, it reproduces the published Ember rows (body on the
  ground 6.23 vs 6.24, muted on the ground 4.90 vs 4.92, rail label 6.23 vs 6.24, focus on a panel 4.60
  vs 4.61, focus on the ground 3.73 vs 3.74).

## Goals / Non-Goals

**Goals:**

- Add the fifth appearance as a token set and a registry entry alone — no component, screen or shell
  file touched — and prove that by keeping this change's code surface to `src/index.css`,
  `src/lib/appearance.ts` and the first-paint id list in `index.html`.
- Add the first tinted-paper appearance, so the registry covers a light the other four do not.
- State the semantic-vocabulary rule as a requirement instead of leaving it in palette prose.

**Non-Goals:**

- Not a repaint: the four shipped appearances keep their tokens byte for byte.
- No new token role, no change to the switcher, its previews, or their behaviour.
- Not a palette-sourcing tool: the screening script used to pick the seed lives in the scratch area and
  is not part of the deliverable.

## Decisions

**D1 — the seed palette: `1077213` "Limelicious" by `gracefulNothing` (snapshot `20100122015359`).**
Fifty archived palettes were fetched and screened: twenty cleared the contrast bar, nine were also
quiet enough in tone (core saturation ≤ 0.50 against Ember's 0.695), and the shortlist below was
refused for these reasons:

- `1077208` "Blue Cake" — the quietest of all (saturation 0.135), but its ground is a near-neutral cool
  white and its rail a desaturated slate blue, i.e. a fifth reading of colours the set already shows in
  Light (near-neutral) and Dusk (cool).
- `1188389` "Standard Camo" — the ground is a new khaki, but the ink and rail are a brown in the same
  family as Ember's `#703E14`, so the set would gain a second brown-rail appearance.
- `1077234` "transfusion" — ink `#7C3249`, a plum-red: refused under the new requirement.
- `1007174` "Warmer Tones" — the muted colour `#735C84` is an orchid in the plum family: refused under
  the new requirement.
- `100713` "The Happy Widow" — its pale swatch is a high-chroma mint used as the ground tint *and* the
  rail ring, so the loud swatch would do structural work: refused.
- `1007149` "slap my face twice" — the largest contrast margin of the set (7.82), but its ink and muted
  colours are plum-blacks sitting next to the semantic plum, and its rail is near-black, leaving the
  appearance without the one saturated region the composition rule asks it to name: refused.
- Limelicious, by contrast, brings a hue family nothing else uses (olive/sage paper), keeps its violet
  in the rail where the rule wants the saturated region, and leaves exactly one swatch for the
  deliberate-exclusion slot.

**D2 — the appearance is composed, not inverted.** Ground `#E6E7DC` (sage 30% toward paper), panel
`#F5F6F1` (12%), ink and rail `#31114D` (the violet), rail label ink = the ground tone, ink-muted
`#49423C` (olive 70/30 with the violet), selection band `#BBB4BA` (violet 24% into the ground). The rail
is the region that owns the saturated ground — the violet is the palette's one high-chroma member and it
is spent there, not on the board.

**D3 — the focus ring changes carrier between the board and the rail**, as it already does in Ember and
Dusk: olive `#535735` on the board (6.05:1 on the ground, 6.95:1 on a panel) and sage `#ADB08B` on the
rail (7.10:1 against the violet). *Alternative refused:* reusing the ink as the ring — it measures
highest on the board, but it draws the ring in the same colour as all body text, and on the rail it
would be the rail colour itself, 1.00:1, the exact defect the finish review caught in Ember's
predecessor.

**D4 — one swatch is deliberately unused:** `#EB4123`, the palette's red-orange. At any structural size
it competes with the attention fill, which has to remain the one thing that shouts. Recorded with its
reason, as `#F77D19` was for Ember, so the exclusion reads as a decision rather than an omission.

**D5 — the appearance is named for the material, not the palette's title** (Sage), following Ember:
appearances are named for the light or the surface they answer, and Dusk is the exception that took its
palette's own word.

**D6 — the semantic-vocabulary rule goes into `theme-system` rather than staying in `palette.md`.** The
bridge rule in `openspec/project.md` is explicit that a rule living only in a document is behaviour
nobody approved; the screening produced three real refusals, which is the evidence that the rule binds.

## Risks / Trade-offs

- [The violet ink and rail sit in the wider purple family that also holds the semantic plum] →
  Mitigation: the two differ in lightness (18% vs 24%), chroma (64% vs 24%) and hue (270° vs 305°); the
  plum is only ever a chip fill carrying `#F0F0F0` text (10.28:1) and never a ring or an ink, and the
  rail carries no plum chip. The task list keeps an explicit eyeball check of a plum chip and a
  suspended-state magnet on the sage board before the appearance is called done.
- [A tinted ground lowers the contrast of the rules] → the rules stay informational (hairline 1.65:1,
  strong rule 3.04:1 against a panel, both inside the range the four shipped appearances already sit
  in: 1.40–1.71 and 2.17–2.86) and every text and focus pair clears its minimum.
- [A fifth appearance adds a fifth id to the first-paint list] → the list mirrors the registry and the
  existing first-paint requirement covers the new id; the verification tasks re-check both a deep link
  and a reload with `sage` stored.
- [The screening sample was fifty palettes from a much larger archive] → the conclusion recorded in
  `palette.md` is scoped to the sample, and the refused candidates are listed by id so the next
  appearance does not re-screen them.

## Migration Plan

None needed: the change adds a registry entry and a token block. Storage already tolerates an
unrecognised appearance id, so a build carrying `sage` and a build without it are both safe in either
direction, and the rollback is reverting the three touched files.
