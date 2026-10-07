# Tasks

Implementation of the frozen baseline. No spec deltas — behaviour comes from `openspec/specs/**`;
this file is the build plan and the audit trail, so every ticked task carries its evidence.

Ledger state: **33 of 36 ticked**, and the three open ones are 6.4 (a fresh-context review
commissioned for the shipped build), 8.1 (the whole-baseline scenario sweep) and 8.3 (the archive
that waits on 8.1). The rest of the ledger was brought up to date in one pass at the end of the
build, which is exactly the gap that let this file drift behind the code it describes.

## 0. Prerequisites and integrity

- [x] 0.1 Record palette provenance (`docs/design/palette.md`): COLOURlovers palette id `1004609`
  "Yoko Hanako 1109" by `_Mac_DyE_`, its five swatches, the archival snapshot used, and the
  light/dark role translation. EVIDENCE: file present; `grep -c 1004609 docs/design/palette.md` → 3.
  The file now also records a **second** pinned palette (id `100429` "Stormy Dusk" by `junyr`, archive
  snapshot `20130622165810`) added by the theme-registry change, plus the measured contrast table.
- [x] 0.2 Add `LICENSE` (MIT, `Trung Nguyen`) and the release-gate scripts
  (`typecheck`, `lint`, `gate:spec`, `gate:design`, `gate`). EVIDENCE: `LICENSE` line 1 = "MIT
  License", line 3 = "Copyright (c) 2026 Trung Nguyen"; `package.json` scripts = dev, build, lint,
  typecheck, gate:spec, gate:design, gate, preview; `npm run gate` → exit 0.

## 1. Design system foundation (design-system, theme-system)

- [x] 1.1 Token layer in one place — colour roles, type scale, spacing rhythm, rules, one elevation
  for overlays only. EVIDENCE: single `@theme` block in `src/index.css`;
  `grep -rE "#[0-9a-fA-F]{3,6}" src/ --include=*.tsx | grep -v index.css | wc -l` → **0**.
- [x] 1.2 Self-hosted type faces (no hosted stylesheet, no CDN), tabular numerals for data, mono
  restricted to identifiers/measurements. EVIDENCE: `dist/assets/*.woff2` → 5 files after build;
  faces come from `@fontsource-variable/archivo` + `@fontsource-variable/azeret-mono`, both in
  `dependencies`, neither fetched at runtime.
- [x] 1.3 Theme resolution `system | light | dark`, persisted, applied before first paint.
  EVIDENCE: the inline script in `index.html` sets `data-theme` before paint; measured on the deployed
  build, a deep link (`/organizations/org_001?sort=name`) came up with `data-theme="dusk"` — a
  registered appearance — in the first moments of load. The registry now carries **four** choices
  (system + light + dark + dusk), which is a superset of what this task asked for.
- [x] 1.4 Component primitives with their required states (hover, focus-visible, disabled, busy,
  invalid) and accessible names: button, input, select, field, chip/status magnet, badge, dialog,
  menu, toast, table shell, empty/error/loading states. EVIDENCE: `npm run typecheck` clean; all
  primitives live in `src/components/ui/` and are re-exported from its `index.ts`.
- [x] 1.5 Contrast audit in both themes for every text/ground pair actually shipped. EVIDENCE: twelve
  pairs computed from the tokens as the browser resolves them, across all three appearances, in
  `docs/design/palette.md`. Every appearance passes every minimum; the tightest pairs are light
  **6.40:1** (focus ring on ground), dark **8.10:1** (body on a selected row) and dusk **4.69:1**
  (body on a selected row). No failures.

## 2. Mock API layer (mock-api-layer)

- [x] 2.1 Deterministic seed dataset (users, roles, organizations, sessions, audit events) with a
  stored schema version, reseed-on-empty, and a visible reset affordance. EVIDENCE: `SCHEMA_VERSION`
  in `src/mock/seed.ts` (currently 4, bumped by the CRUD change), imported and enforced by
  `src/mock/api.ts`; the reset affordance is the destructive zone in `SettingsScreen`.
- [x] 2.2 Typed contract: list/read/create/update/delete per object + audit append, simulated
  latency, opt-in failure responses distinguishable from empty results. EVIDENCE: `src/mock/api.ts`
  implements the contract over `src/mock/types.ts`; latency and failure are switches on the store, and
  a failure surfaces as an `ApiError` with a code (e.g. `conflict`) rather than as an empty list.
- [x] 2.3 Exactly one audit event per state-changing operation, with field-level before/after.
  EVIDENCE: live probe during the CRUD verification — one event per mutation, observed as
  `flag.deleted checkout.express-lane` and `apikey.issued "Build pipeline (verification)"`, with the
  audit detail screen showing field-level before/after.
- [x] 2.4 Mutations persist across reload. EVIDENCE: live, on the deployed build — issued a key
  through the dialog (16 rows → 17 rows, "persistence check" present), then reloaded the route: still
  **17 rows with the row present**. The same probe re-confirmed the once-only secret step
  ("This is the only time the secret is shown…").

## 3. Authentication and access control

- [x] 3.1 Mock sign-in/sign-out, session persistence, idle expiry with explicit re-auth.
  EVIDENCE: `src/auth/session.tsx` — `DEFAULT_IDLE_MS = 30 * 60 * 1000`, session states
  `restoring | anonymous | signed_in | expired`, `signOut(reason)` covering `user | revoked |
  expired`; the session survives a reload (probed repeatedly across the build).
- [x] 3.2 Protected-route redirect preserving the requested location, returning there after sign-in,
  with a safe fallback when the target is absent. EVIDENCE: live — anonymous request to `/api-keys`
  showed the sign-in surface with `location.pathname` still `/api-keys`; after signing in as
  `mara.ilesanmi` the app was on `/api-keys` with h1 "API keys". Absent targets fall to the not-found
  route state (`src/router.tsx` carries 6 route-state bindings).
- [x] 3.3 Role→permission model with gated routes, withheld affordances, and a real denied surface.
  EVIDENCE: `src/mock/permissions.ts` + `RequirePermission`; probes during the build showed
  no-scope refusals (the action is withheld rather than failing after the fact) and role-gated routes
  rendering the denied surface.

## 4. App shell and data grid

- [x] 4.1 Persistent chrome: navigation with active marking, page header, breadcrumbs, scope
  switcher, and loading/error/empty/not-found/denied route states. EVIDENCE: `src/shell/AppShell.tsx`
  (rail, active marking, scope switcher), `PageHeader.tsx` (with the `mark` slot), breadcrumbs; route
  states in `src/router.tsx` (6 bindings) with the state components in `src/components/ui/States.tsx`.
- [x] 4.2 Narrow-viewport behaviour: navigation collapses to an overlay, focus returns on close, no
  horizontal page overflow at 390 px. EVIDENCE: deployed build at 390×844 —
  `scrollWidth - clientWidth = 0` (no overflow), all 8 organization marks still load; the appearance
  and feature-flag panel both go full-width with `aria-modal="true"` when narrow.
- [x] 4.3 Data grid: sorting with announced state, pagination, page size, column visibility,
  selection with a bulk bar that appears only with a selection, and list state in the URL.
  EVIDENCE: `aria-sort` asserted after clicking a header each way — `?sort=createdAt&dir=desc` put
  "07 Oct 2026" first with `aria-sort="descending"`, `dir=asc` put "21 Nov 2025" first; page size,
  column visibility and selection-with-bulk-bar all exercised, and list state round-trips through the
  URL.

## 5. Admin surfaces

- [x] 5.1 `dashboard-overview` — headline counts with period comparison, explicit no-data state,
  recent activity linking into audit detail, quick actions, scoped to the current organization.
  EVIDENCE: `src/screens/DashboardScreen.tsx`; verified live including the scope switch changing the
  headline numbers.
- [x] 5.2 `user-management` — search/filters, zero-results vs empty-directory, detail view,
  create/edit with duplicate-email refusal, suspend/deactivate/reactivate, bulk operations with
  summary, self-deactivation refusal. EVIDENCE: `UserListScreen.tsx` + `UserDetailScreen.tsx` present
  and exercised; the duplicate-email and self-deactivation refusals surface as an `ApiError` code, not
  a silent no-op.
- [x] 5.3 `role-management` — custom roles, grouped permission matrix, blast-radius preview before
  saving, system-role protection, last-administration-role rule. EVIDENCE: `RoleListScreen.tsx` +
  `RoleDetailScreen.tsx`; the last-administration-role rule was exercised live during the CRUD
  verification (its conflict message is shown on the action that failed, not swallowed).
- [x] 5.4 `organization-management` — organizations list/detail, member management, current-org
  scope, last-owner protection, zero-member state. EVIDENCE: `OrganizationListScreen.tsx` +
  `OrganizationDetailScreen.tsx`, now carrying the generated org marks; the last-owner and
  zero-member states were verified live.
- [x] 5.5 `session-management` — workspace and per-user session inventory with device/location/
  recency, current-session marker, single and bulk revocation with confirmation. EVIDENCE:
  `SessionListScreen.tsx` present; the current-session marker and the revoke confirmation were
  exercised live.
- [x] 5.6 `audit-log` — filters with "no matching events", detail with field-level before/after, and
  no edit or delete affordance anywhere. EVIDENCE: `AuditListScreen.tsx` + `AuditDetailScreen.tsx`;
  the detail view shows before/after per field, and the surface offers no mutation affordance at all.
- [x] 5.7 `settings` — workspace/profile/preferences including appearance, unsaved-change
  protection, slug validation, typed-confirmation destructive zone. EVIDENCE: `SettingsScreen.tsx`
  with the panel-tone appearance control (now listing the registry), unsaved-change protection, and a
  typed-confirmation destructive zone.

## 6. Design gates (impeccable)

- [x] 6.1 Direction contract recorded before UI code (six blocks + seed key). EVIDENCE:
  `.impeccable/surfaces/src-main-tsx.md` (2.9 KB) present, holding the six blocks and the seed key;
  the direction is "Handover".
- [x] 6.2 One batched screenshot round at 1440 and 390 over the shipped screens, inspected, then
  one confirmation round — and stop. EVIDENCE: `.impeccable/review/desktop.png` +
  `.impeccable/review/mobile.png`, plus the defects that round found and the fixes it produced: the
  banned kicker/eyebrow above the sign-in heading (removed), the dark-theme select chevron at
  **1.39:1** (replaced with a token-drawn chevron at **10.28:1**), the density control that persisted
  but was consumed by nothing (wired through `--density-row-pad-y` / `--density-control-h`), and the
  rail dropdown painting white-on-white (fixed in the base layer).
- [x] 6.3 `impeccable detect` over the changed UI, findings before → after, exit 0. EVIDENCE:
  advisories went **12 → 4 → 2** and then back to **2** after the theme registry's five new swatches
  were documented in `DESIGN.md`; exit 0. The two that remain are TanStack Router's own fallback
  error-component constants (`fontSize: 1rem`, `borderRadius: .25rem`), which the panel's styles
  override — dependency code, not panel code.
- [ ] 6.4 Finish review of the built surface against the direction contract (fresh context), with
  the verdict quoted and the substitution disclosed if it is not the shipped reviewer. STATUS: a
  fresh-context reviewer has been commissioned for the shipped build; this line closes when its
  verdict is quoted here. It is **not** ticked on the strength of the in-thread inspection the build
  already had.
- [x] 6.5 `DESIGN.md` + `.impeccable/design.json` generated **from** the built code. EVIDENCE: both
  present; `DESIGN.md` carries the frontmatter colour/type tokens the detectors read and now also the
  appearances table; `design.json` carries `colorMeta` for every token including the five dusk
  swatches with their tonal ramps.

## 7. Delivery

- [x] 7.1 Production build from a clean checkout; output reproducible and committed nowhere.
  EVIDENCE: `npm run build` → exit 0; `dist/assets/index-*.js` + `.css` + woff2 emitted;
  `git check-ignore dist` confirms `dist` is ignored, and the repo tree carries no build output.
- [x] 7.2 Deep links resolve to the app shell rather than a 404 (SPA fallback documented and, if
  the host needs one, the fallback file shipped). EVIDENCE: on the deployed build every deep link
  probed returns 200 (`/api-keys`, `/feature-flags`, `/organizations/org_001`, `/users/usr_001`,
  `/audit`), with `public/_redirects` and the `vercel.json` rewrite in place; the marks under
  `/mock/*.png` still resolve as static files (200, `image/png`).
- [x] 7.3 `README.md` with real captures of the deployed build, the stack, how to run, and the
  provenance/palette note; license and attribution present in repository **and** build. EVIDENCE:
  README embeds **5** captures from `docs/screenshots/` (all verified rendering on GitHub, 0 broken);
  `LICENSE` (MIT) in the repository and `dist/LICENSE.txt` in the build; asset provenance in
  `docs/design/mock-assets.md`.
- [x] 7.4 Push to the private GitHub repository, then read back: default branch, file tree, and that
  ignored artifacts are absent. EVIDENCE: pushed to `github.com/dinhtrung/admin-panel` and verified
  by read-back against `git ls-remote` (local HEAD == remote main). NOTE: the repository was made
  **public** at the operator's request afterwards ("This is just a demo"), after a value-only secret
  sweep — so this task's premise (a private repository) was superseded by an explicit decision.

## 8. Verify and close

- [ ] 8.1 Walk every `#### Scenario` of the frozen baseline against the running build and record the
  result per capability. EVIDENCE: `openspec/specs/*/spec.md` scenario count vs the recorded pass
  count; any scenario that cannot be demonstrated is reported, not ticked. STATUS: **open.** The
  baseline holds 17 capabilities / **85 requirements / 209 scenarios**; the build verified the
  highest-risk paths live (grid sorting and aria state, 390 px behaviour, contrast in all three
  appearances, the auth redirect, mutation persistence, the once-only secret, one audit event per
  mutation, role-gated refusals, the CRUD change's 19 of 23 scenarios) but there is **no recorded
  per-scenario pass/fail list** for the whole baseline. Claiming the sweep without one would be
  exactly the kind of unevidenced tick this file exists to prevent.
- [x] 8.2 All four gates green in one run. EVIDENCE: `npm run gate` → exit 0 (typecheck → lint →
  `openspec validate --all --strict` → build → `impeccable detect`); `validate --all --strict` → 18
  items, 0 failed.
- [ ] 8.3 Archive this change (`openspec archive build-admin-panel-v1 -y`) and confirm
  `openspec validate --all --strict` still passes with `openspec/specs/**` unchanged
  (`git diff --stat -- openspec/specs` empty). STATUS: pending 8.1 — archiving a change whose own
  verification sweep is unfinished would close the ledger on work that is not shown to be verified.
