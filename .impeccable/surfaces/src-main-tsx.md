---
version: 1
slug: "src-main-tsx"
primary_target: "src/main.tsx"
related_targets: []
---

## Direction contract

**THESIS.** This is a working board that is read at a glance, not a set of dashboards stacked in a
scrolling column. It refuses the category default outright: no grid of identical rounded KPI cards,
no icon-per-navigation-item rail, no coloured status pill invented per screen. What it keeps from
the world is one idea — state is a physical token that sits in a fixed slot, and it stays where it
was put until you acknowledge it.

**OWN-WORLD.** Five colours, one source palette (COLOURlovers `1004609`, "Yoko Hanako 1109" by
`_Mac_DyE_`: `#181818`, `#F0F0F0`, `#D5DEF0`, `#903078`, `#483048`), each doing a job: near-black
rail and ink, off-white board ground, lavender for selection and the invited state, magenta for
attention and the suspended state, plum for the strongest fill and dark-theme surfaces. Type is
Archivo (institutional grotesk, tabular numerals) with Azeret Mono reserved for identifiers, IPs,
timestamps and event codes — never for prose. Surfaces are **ruled, not shadowed**: separation is a
1px rule, rounding stops at a 2px chip radius, there are no gradients, no blur, no glow, and the one
elevation in the system belongs to overlays. The state carrier is the magnet: a fixed-width chip
carrying a three-letter code, a fill weight and a hue, sitting in a dedicated column.

**STORY.** Someone opening the panel should know, before reading a word, what state the board is in
and where the loud things are. Then: find the account, change the thing, watch the row's token move,
and find the entry that proves it happened. The interface never claims; it shows the record.

**FIRST VIEWPORT.** A dark rail on the left, full height, with the wordmark, the scope selector and
plain navigation; a ruled top bar carrying page title and breadcrumbs at 20px; below it the tally
strip — one wide panel divided by rules into counts with their period comparison underneath, in
tabular numerals, not four cards; then the recent-activity list where each row's actor and action
sit in fixed columns and link to the audit detail. Density is high and identical row to row; the
mouth of the page is the board itself.

**FORM.** Ward handover board (identical slots, magnetic state carriers, an identity column at the
left, read at arm's length) — position **4** of my ordered list, assigned by the roll; seed key
`c8ed147f`. Losing challengers donated discipline, not clothes: the transit diagram's targeted
recomputation (one permission edit recomputes only the affected rows), the cassette J-card's hard
capacity rule (a long value truncates inside its slot instead of breaking the column), and the metro
tiles' refusal of gradients and bevels (depth comes only from the magnet's offset and one shadow).

**FINISH.** unreviewed and undocumented is unfinished; this build ends with the finish review, the
verdict, DESIGN.md, and every shipping raster carrying its provenance
