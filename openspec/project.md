# OpenSpec conventions — admin-panel

## What this repository is

An MIT-licensed admin panel showcase. React 19 + Vite + TypeScript single-page application, Tailwind
CSS v4, TanStack Router/Query/Table. **No backend**: every read and write goes through an in-browser
mock API layer that simulates latency and failures. All displayed data is synthetic.

## Sources of truth

| Question | Single source | Lifecycle |
|---|---|---|
| What must the system do | `openspec/specs/**` | Frozen. Changes only through a new change, merged by `openspec archive` |
| What the product is | `PRODUCT.md` | Written once; updated when product truth changes |
| What a surface looks like | `.impeccable/surfaces/<slug>.md` | One direction contract per surface, written before code |
| Which tokens shipped | `DESIGN.md` + `.impeccable/design.json` | Generated from the built code, never written up front |

Bridge rule: a design decision that changes observable behaviour goes back into a change's delta spec.
A rule that exists only in `DESIGN.md` is behaviour nobody approved. A spec never dictates layout,
colour, or component structure.

## The frozen baseline rule

`openspec/specs/**` is the frozen baseline (archived from `2026-10-07-baseline-admin-panel-v1`).
Never hand-edit it. Every later behaviour change is a new change whose deltas the CLI merges on
archive. A change that changes no behaviour (implementation, tooling, docs) declares
`skip_specs: true` in its `.openspec.yaml` instead of inventing a requirement.

## Spec language

- English, normative `SHALL` / `MUST` in the first sentence of every requirement.
- `#### Scenario:` needs **four** hashes — three fails validation silently.
- Observable behaviour only: no file paths, component names, library names, or CSS.
- Every new capability needs a `## Purpose` paragraph of at least 50 characters.

## Gates (both must pass before anything is called done)

```bash
export PATH="$HOME/.hermes/node/bin:$PATH"
npm run typecheck                                        # tsc -b
npm run lint                                             # oxlint
openspec validate --all --strict                         # behavioural gate
npm run gate:design                                      # impeccable detect, exit 0
```

`openspec validate --changes` means "validate ALL changes" — it is a boolean, not a name filter. To
validate one change put the name first: `openspec validate "<name>" --type change --strict`.
Bare `openspec validate --strict` validates nothing and exits clean; always pass a scope.

## Working agreements

- Planning artifacts are committed before implementation, so the reviewed contract is in history.
- `tasks.md` is the audit trail: tick a task only with evidence on the same line (probe counts, byte
  sizes, commit SHAs, live markers, the exact command).
- Never commit the vendored agent bundles (`~/develop/admin-panel/.hermes/skills/**`), the
  per-machine `.impeccable/cache/**`, or anything under `dist/`.
- No real person, employer, client or telemetry data may enter this repository — the mock dataset is
  authored and labelled synthetic.

## Current state

- Baseline: 15 capabilities, 73 requirements, 179 scenarios — `openspec validate --specs --strict`
  → `15 passed, 0 failed`.
- Product truth: `PRODUCT.md`. Direction: `Handover` (ward handover board tradition lending type,
  palette, density and one signature move to a standard web admin shell).
- Palette: COLOURlovers palette `1004609` "Yoko Hanako 1109" by `_Mac_DyE_`, provenance recorded in
  `docs/design/palette.md`.

## Named follow-up changes (not created until they start)

- `build-admin-panel-v1` — implement the frozen baseline.
- `add-real-backend-api` — replace the mock layer with HTTP; must not change the frozen specs.
- `add-pwa-offline` — optional installable/offline support.
