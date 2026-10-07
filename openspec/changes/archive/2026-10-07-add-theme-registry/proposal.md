## Why

The panel's appearance is a pair wired into the stylesheet: `:root` *is* the light appearance and
`[data-theme="dark"]` overrides it. The `theme-system` capability is satisfied by that arrangement, but
the arrangement itself cannot grow. A third appearance today means either touching the file that
defines the design system, or adding branches where the appearance is consumed — and nothing anywhere
checks that a new appearance is legible, or that it was composed rather than inverted out of another
one.

That matters because the light and dark pair does not cover how the board is actually read. A bright
clinical white is right for a workstation in daylight and punishing in a dim room; the dark appearance
answers that by going all the way to ink, which loses the printed-board feel that is the whole point of
the direction. There is a real middle: a low-glare appearance for dim light. Shipping it is the test of
whether appearance is genuinely a registry or just two hard-coded cases.

## What Changes

- **`theme-system` gains three requirements** (it keeps all five it has):
  - an appearance is a **registered set of semantic role tokens**, and the control offers every
    registered appearance rather than a fixed pair — registering one is a token set and an entry in
    the registry, never a change to a component, screen or shell file;
  - every registered appearance is **composed**, not an inversion of another one, and each names the
    region that owns its saturated ground;
  - every registered appearance is **measured against the legibility bar**, with its computed pairs
    recorded next to its definition.
- **A third appearance ships through the registry**: a low-glare appearance for dim light, **seeded by
  a second pinned COLOURlovers palette** (100429 "Stormy Dusk" by `junyr`, recorded with its archive
  snapshot in `docs/design/palette.md`). It defines its own surfaces, ink and rules from that palette;
  the semantic hues — attention and plum — stay the colours they are in every appearance, because a
  state that changes colour when the lighting changes is a state the operator cannot learn.
- **The appearance control lists the registry** instead of two hand-written options, and an unknown or
  stale stored appearance falls back to following the machine rather than rendering nothing.
- **The first-paint resolution covers every registered appearance**, deep links included.
- Behaviour of the existing capabilities is unchanged: no requirement of the frozen baseline is
  modified, only added to. In particular the light and dark appearances keep their current tokens and
  their current behaviour — this change must not repaint them.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `theme-system`: adds the registry, composition, and measurement requirements above. The five existing
  requirements (both appearances offered, system preference by default, explicit choice remembered,
  correct appearance from the first paint, legibility in both appearances) are extended in scope by
  these additions rather than rewritten: "both appearances" now means "every registered appearance",
  which is why the third appearance can exist without editing them.

## Impact

- **Code**: `src/index.css` (the registry and the third appearance's token set — the only file that
  should need to change for a new appearance), `src/shell/AppearanceControl.tsx` (renders the registry),
  `index.html` (first-paint resolution for any registered appearance), and one new module holding the
  registry itself so the control, the pre-paint script and any future consumer read the same list.
- **Data**: the stored appearance preference gains a third valid value; an unrecognised value resolves
  to the system preference instead of leaving the board unstyled.
- **Docs**: `docs/design/palette.md` records the third appearance's derivation and its computed
  contrast pairs; `DESIGN.md` names the registry and the rule that an appearance is composed.
- **Gates**: unchanged — typecheck, lint, `openspec validate --all --strict`, build, `impeccable detect`.
  The detector runs over the shipped CSS, so the third appearance's tokens are inside its scope.
- **Not affected**: every screen, the mock layer, routing, permissions, and the light/dark token values
  themselves.
