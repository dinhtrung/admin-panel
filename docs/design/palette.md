# Palette provenance — "Yoko Hanako 1109"

The palette is a **pinned choice**, not an invention: the brief required it to come from a real
COLOURlovers palette. It is recorded here with its source and the exact colour set, so the choice
stays auditable even if the source site disappears.

## Source

| Field | Value |
|---|---|
| Site | COLOURlovers |
| Palette | **Yoko Hanako 1109** |
| Palette id | 1004609 |
| Author | `_Mac_DyE_` |
| Original URL | https://www.colourlovers.com/palette/1004609/Yoko_Hanako_1109 |
| Retrieved from | Internet Archive snapshot `20190724012746` — https://web.archive.org/web/20190724012746id_/https://www.colourlovers.com/palette/1004609/Yoko_Hanako_1109 |

Why the archive: `colourlovers.com` answers every automated request (headless Chromium with a real
UA, and the extraction backend) with a Cloudflare bot challenge, and its JSON API was retired —
`GET /api/palettes/top` returns `{"error":"gone","message":"The COLOURlovers API closed when the site
was rebuilt in 2026."}`. The archived palette page carries the palette's own five swatches in
document order and its title, which is what is recorded above.

## The palette, verbatim

| Swatch | Role in the system |
|---|---|
| `#181818` | ink (light theme) / board ground (dark theme) |
| `#F0F0F0` | board ground (light theme) / ink (dark theme) |
| `#D5DEF0` | pale tint: selected row band, invited state, dark-theme accent text |
| `#903078` | attention: suspended state fill, focus ring, destructive confirm |
| `#483048` | plum: secondary text, rail and panel surfaces in dark theme, strongest chip fill |

## What the palette could not do, and the translation used

Light theme passes contrast everywhere it is used (lowest pair 6.40:1). In the dark theme
`#903078` is only **2.44:1** against `#181818` and 1.61:1 against `#483048`, so it can never be text
there. The roles are therefore preserved while the carrier changes:

- `#903078` is a **fill only** in both themes (white ink on it: 7.29:1).
- Where the light theme uses `#903078` as *text or a ring*, the dark theme uses `#D5DEF0`
  (13.14:1 on `#181818`).
- `#FFFFFF` and the rule/overlay opacities are derived neutrals, not palette members; no sixth hue
  is introduced.

## State vocabulary (the signature move)

Status is a **magnet**: a fixed-width chip in a fixed column slot, carrying a short code, a fill
weight and a hue — never colour alone.

| State | Code | Fill | Ink | Contrast |
|---|---|---|---|---|
| Active | `ACT` | plum `#483048` solid | `#F0F0F0` | 10.28:1 |
| Invited | `INV` | lavender `#D5DEF0` | plum `#483048` | 8.67:1 |
| Suspended | `SUS` | magenta `#903078` solid | `#FFFFFF` | 7.29:1 |
| Deactivated | `DEA` | none (ghost, 1px plum rule) | plum on ground | 10.28:1 |

All ratios computed with WCAG 2.1 relative luminance. The audit of every shipped text/ground pair
lives in `tasks.md` (build change) and `DESIGN.md`.

## Second seed palette — the third appearance ("Dusk")

The board's appearance is a registry, and an appearance may be seeded by its own pinned palette. The
third appearance is seeded by a second one, recorded here on the same terms as the first: a real
COLOURlovers palette, pinned, with its source and the exact colour set.

| Field | Value |
|---|---|
| Site | COLOURlovers |
| Palette | **Stormy Dusk** |
| Palette id | 100429 |
| Author | `junyr` |
| Original URL | https://www.colourlovers.com/palette/100429/Stormy_Dusk |
| Retrieved from | Internet Archive snapshot `20130622165810` — https://web.archive.org/web/20130622165810id_/http://www.colourlovers.com/palette/100429/Stormy_Dusk |

Same retrieval route as the first palette, for the same reason: `colourlovers.com` answers automated
requests with a Cloudflare challenge, so the record comes from the archived page, which carries the
palette's five swatches in document order and its title.

### The palette, verbatim, and the roles it took

| Swatch | Role in the third appearance |
|---|---|
| `#ABC5C9` | board ground (mist) and the rail's label ink |
| `#0E7583` | teal — the selected-row band, laid over the mist so it reads at 4.69:1 |
| `#4A4B4B` | slate — secondary text on the ground (4.82:1) and on a panel (7.33:1) |
| `#083A52` | deep — the rail, the one region owning a saturated ground, and the focus ring |
| `#1A3E42` | charcoal — primary text and the rules |

Two decisions worth stating rather than hiding:

- **The semantic hues do not move.** `attention` stays `#903078` and `plum` stays `#483048` in every
  appearance, taken from the first palette. A state that changes colour when the lighting changes is a
  state the operator cannot learn; the appearance changes the board, not the vocabulary.
- **Focus changes carrier, as it already did between light and dark.** `#903078` measures below the
  3:1 ring threshold on the mist ground, so focus is carried by the deep swatch (10.12:1 on a panel),
  exactly as the dark appearance hands focus to the tint rather than to the attention colour.

## Measured contrast, every appearance

Computed from the tokens as the browser resolves them (custom properties are not resolved by
`getComputedStyle`, so each value is painted onto a probe element and read back), with alpha
composited before the ratio is taken.

| Pair | Minimum | Light | Dark | Dusk |
|---|---|---|---|---|
| body text on the ground | 4.5:1 | 15.58 | 15.58 | **6.38** |
| body text on a panel | 4.5:1 | 17.76 | 14.38 | **9.71** |
| muted text on the ground | 4.5:1 | 10.28 | 13.14 | **4.82** |
| muted text on a panel | 4.5:1 | 11.72 | 12.12 | **7.33** |
| body text on a selected row | 4.5:1 | 13.14 | 8.10 | **4.69** |
| rail label on the rail | 4.5:1 | 15.58 | 10.28 | **6.65** |
| text on a plum fill | 4.5:1 | 10.28 | 10.28 | **10.28** |
| text on an attention fill | 4.5:1 | 7.29 | 7.29 | **7.29** |
| focus ring on a panel | 3:1 | 7.29 | 12.12 | **10.12** |
| focus ring on the ground | 3:1 | 6.40 | 13.14 | **6.65** |
| focus ring **on the rail** | 3:1 | 13.14 | 8.67 | **6.65** |
| hairline rule on a panel *(informational)* | — | 1.40 | 1.71 | 1.52 |
| strong rule on a panel *(informational)* | — | 2.17 | 2.86 | 2.51 |

Every appearance passes every minimum; the light column reproduces the 6.40:1 the first palette's
record already claimed, which is what makes these numbers comparable rather than new. Rules are listed
as information, not as a pass/fail: a row is identified by its content and its slot, and the hairline
is a separator rather than the only thing distinguishing one row from the next.
