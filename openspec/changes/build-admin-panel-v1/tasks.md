# Tasks

Implementation of the frozen baseline. No spec deltas — behaviour comes from `openspec/specs/**`;
this file is the build plan and the audit trail, so every ticked task carries its evidence.

## 0. Prerequisites and integrity

- [ ] 0.1 Record palette provenance (`docs/design/palette.md`): COLOURlovers palette id `1004609`
  "Yoko Hanako 1109" by `_Mac_DyE_`, its five swatches, the archival snapshot used, and the
  light/dark role translation. EVIDENCE: file present and `grep -c 1004609 docs/design/palette.md` ≥ 1.
- [ ] 0.2 Add `LICENSE` (MIT, `Trung Nguyen`) and the release-gate scripts
  (`typecheck`, `lint`, `gate:spec`, `gate:design`, `gate`). EVIDENCE: `npm run gate` output.

## 1. Design system foundation (design-system, theme-system)

- [ ] 1.1 Token layer in one place — colour roles, type scale, spacing rhythm, rules, one elevation
  for overlays only. EVIDENCE: single `@theme` block; every colour in `src/` resolves to a token
  (`grep -rE "#[0-9a-fA-F]{3,6}" src/ --include=*.tsx | grep -v index.css | wc -l` → 0).
- [ ] 1.2 Self-hosted type faces (no hosted stylesheet, no CDN), tabular numerals for data, mono
  restricted to identifiers/measurements. EVIDENCE: `dist/assets/*.woff2` present after build.
- [ ] 1.3 Theme resolution `system | light | dark`, persisted, applied before first paint.
  EVIDENCE: reload on a deep link in both themes shows no flash of the wrong theme in two captures.
- [ ] 1.4 Component primitives with their required states (hover, focus-visible, disabled, busy,
  invalid) and accessible names: button, input, select, field, chip/status magnet, badge, dialog,
  menu, toast, table shell, empty/error/loading states. EVIDENCE: `npm run typecheck` clean.
- [ ] 1.5 Contrast audit in both themes for every text/ground pair actually shipped. EVIDENCE:
  computed ratios pasted here; body ≥ 4.5:1, large ≥ 3:1, no failures.

## 2. Mock API layer (mock-api-layer)

- [ ] 2.1 Deterministic seed dataset (users, roles, organizations, sessions, audit events) with a
  stored schema version, reseed-on-empty, and a visible reset affordance.
- [ ] 2.2 Typed contract: list/read/create/update/delete per object + audit append, simulated
  latency, opt-in failure responses distinguishable from empty results.
- [ ] 2.3 Exactly one audit event per state-changing operation, with field-level before/after.
  EVIDENCE: probe script output `events after N mutations = N`.
- [ ] 2.4 Mutations persist across reload. EVIDENCE: two reload captures showing the same change.

## 3. Authentication and access control

- [ ] 3.1 Mock sign-in/sign-out, session persistence, idle expiry with explicit re-auth.
- [ ] 3.2 Protected-route redirect preserving the requested location, returning there after sign-in,
  with a safe fallback when the target is absent.
- [ ] 3.3 Role→permission model with gated routes, withheld affordances, and a real denied surface.
  EVIDENCE: probe of each permission state with the resulting visible-action counts.

## 4. App shell and data grid

- [ ] 4.1 Persistent chrome: navigation with active marking, page header, breadcrumbs, scope
  switcher, and loading/error/empty/not-found/denied route states.
- [ ] 4.2 Narrow-viewport behaviour: navigation collapses to an overlay, focus returns on close, no
  horizontal page overflow at 390 px.
- [ ] 4.3 Data grid: sorting with announced state, pagination, page size, column visibility,
  selection with a bulk bar that appears only with a selection, and list state in the URL.
  EVIDENCE: `aria-sort` asserted after clicking a header both ways, first row compared each time.

## 5. Admin surfaces

- [ ] 5.1 `dashboard-overview` — headline counts with period comparison, explicit no-data state,
  recent activity linking into audit detail, quick actions, scoped to the current organization.
- [ ] 5.2 `user-management` — search/filters, zero-results vs empty-directory, detail view,
  create/edit with duplicate-email refusal, suspend/deactivate/reactivate, bulk operations with
  summary, self-deactivation refusal.
- [ ] 5.3 `role-management` — custom roles, grouped permission matrix, blast-radius preview before
  saving, system-role protection, last-administration-role rule.
- [ ] 5.4 `organization-management` — organizations list/detail, member management, current-org
  scope, last-owner protection, zero-member state.
- [ ] 5.5 `session-management` — workspace and per-user session inventory with device/location/
  recency, current-session marker, single and bulk revocation with confirmation.
- [ ] 5.6 `audit-log` — filters with "no matching events", detail with field-level before/after, and
  no edit or delete affordance anywhere.
- [ ] 5.7 `settings` — workspace/profile/preferences including appearance, unsaved-change
  protection, slug validation, typed-confirmation destructive zone.

## 6. Design gates (impeccable)

- [ ] 6.1 Direction contract recorded before UI code (six blocks + seed key). EVIDENCE:
  `impeccable surface-brief read <entry>` output.
- [ ] 6.2 One batched screenshot round at 1440 and 390 over the shipped screens, inspected, then
  one confirmation round — and stop. EVIDENCE: `.impeccable/review/{desktop,mobile}.png` plus the
  list of defects the round found and the fixes it produced.
- [ ] 6.3 `impeccable detect` over the changed UI, findings before → after, exit 0. EVIDENCE: the
  command, its exit code, and each finding named with its fix.
- [ ] 6.4 Finish review of the built surface against the direction contract (fresh context), with
  the verdict quoted and the substitution disclosed if it is not the shipped reviewer.
- [ ] 6.5 `DESIGN.md` + `.impeccable/design.json` generated **from** the built code.

## 7. Delivery

- [ ] 7.1 Production build from a clean checkout; output reproducible and committed nowhere.
  EVIDENCE: `npm run build` output plus `ls dist/assets | head`.
- [ ] 7.2 Deep links resolve to the app shell rather than a 404 (SPA fallback documented and, if
  the host needs one, the fallback file shipped). EVIDENCE: hard reload on a nested route.
- [ ] 7.3 `README.md` with real captures of the deployed build, the stack, how to run, and the
  provenance/palette note; license and attribution present in repository **and** build.
- [ ] 7.4 Push to the private GitHub repository, then read back: default branch, file tree, and that
  ignored artifacts are absent. EVIDENCE: the read-back command output.

## 8. Verify and close

- [ ] 8.1 Walk every `#### Scenario` of the frozen baseline against the running build and record the
  result per capability. EVIDENCE: `openspec/specs/*/spec.md` scenario count vs the recorded pass
  count; any scenario that cannot be demonstrated is reported, not ticked.
- [ ] 8.2 All four gates green in one run. EVIDENCE: `npm run gate` output.
- [ ] 8.3 Archive this change (`openspec archive build-admin-panel-v1 -y`) and confirm
  `openspec validate --all --strict` still passes with `openspec/specs/**` unchanged
  (`git diff --stat -- openspec/specs` empty).
