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
