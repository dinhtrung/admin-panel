## Why

The behaviour is frozen (`openspec/specs/**`, 15 capabilities, 73 requirements, 179 scenarios) and
nothing implements it. This change builds the panel against that contract, so the contract stops
being a document and becomes a running artifact a reviewer can open and operate.

## What Changes

- Implement the design system: palette tokens (from the pinned COLOURlovers palette, provenance
  recorded), type scale, the ruled-board surface language, and every component primitive with its
  required states.
- Implement the mock API layer: deterministic seed, CRUD over users/roles/organizations/sessions,
  one audit event per state change, simulated latency, opt-in failures, browser-local persistence.
- Implement the app shell, theme system (system/light/dark, applied before first paint), mock
  authentication with idle expiry, and the role→permission gate with a real denied state.
- Implement the shared data grid (sorting, pagination, column control, selection, bulk bar,
  URL-addressable list state) and the seven admin surfaces: dashboard, users, roles, organizations,
  sessions, audit log, settings.
- Deliver the static production build with SPA deep-link fallback, MIT license and attribution in
  repository and build, a README built from real captures, and the release gates.
- No spec deltas: this change implements behaviour the frozen baseline already specifies. Any
  behaviour the build reveals as unspecified becomes its own change rather than a silent addition.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- None. This change adds no requirement and changes none: `skip_specs: true` records that
  deliberately. It is the implementation of the frozen baseline, verified against it scenario by
  scenario, not a redefinition of it.

## Impact

- **Code**: the whole application under `src/` — tokens and primitives, mock layer, shell, screens;
  plus `openspec/` (this change), `.impeccable/` (direction contract, captures, design record),
  `docs/design/palette.md` (palette provenance), `LICENSE`, `README.md`.
- **Dependencies**: no new runtime dependency beyond the pinned stack; fonts self-hosted from
  `@fontsource-variable` packages, bundled at build time (no hosted font stylesheet, no CDN).
  **Deviation from the baseline design note**: `@tanstack/react-table` was dropped. Version 9 is a
  rewritten API (no `useReactTable`, no `getCoreRowModel`, a feature/`constructTable` model) and
  building the shared grid on an API that new would be guessing rather than engineering. The grid is
  implemented directly against the frozen `data-grid` requirements — sorting with announced state,
  pagination, column control, selection and the bulk bar, four distinct presentations — and the
  dependency was removed rather than left unused. The behaviour contract is unchanged; only the
  implementation route differs.
- **Not touched**: `openspec/specs/**` (frozen), `PRODUCT.md` (product truth), the existing
  `wip-admin-dashboard` repository.
- **Release gates**: typecheck, lint, `openspec validate --all --strict`, `impeccable detect` exit 0.
