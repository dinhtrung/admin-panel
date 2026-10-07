# Tasks

Two new CRUD surfaces. Behaviour comes from the specs in this change; this file is the plan and the
audit trail, so a ticked task carries its evidence on the same line.

## 1. Freeze the contract

- [x] 1.1 Write the proposal and both capability deltas. EVIDENCE: 2 spec directories;
  `api-key-management` 4 requirements / 11 scenarios, `feature-flag-management` 5 requirements /
  12 scenarios (9 and 23 in total), zero three-hash scenario headers.
- [x] 1.2 Validate strictly and commit the planning artifacts alone, before any code.
  EVIDENCE: `openspec validate "add-api-keys-and-feature-flags" --type change --strict` →
  `Change 'add-api-keys-and-feature-flags' is valid`; commit `d985678`, which contains only
  `openspec/changes/add-api-keys-and-feature-flags/**`.

## 2. Mock API layer

- [x] 2.1 Add the two objects to the domain types and the deterministic seed (a set of API keys across
  states and environments, a set of flags across states, rollouts and owners). EVIDENCE: seed defines
  16 API keys (live + test, every 6th revoked) and 18 feature flags across on/off/gradual with owners
  drawn from the real directory; runtime record counts are checked in 7.2.
- [x] 2.2 Bump the store version so an older stored seed reseeds instead of reading absent collections.
  EVIDENCE: `src/mock/seed.ts:30` — `export const SCHEMA_VERSION = 4;` (was 3).
- [x] 2.3 Implement list / get / create / update / revoke / delete for both objects, following the
  existing contract: latency, opt-in failure, validation refusals, and exactly one audit event per
  state change with the field-level diff. EVIDENCE: mutating both surfaces then reading the audit
  record returned exactly one event per change, in order —
  `flag.deleted checkout.express-lane` (just now), `apikey.issued Build pipeline (verification)`
  (1m ago), each with actor, action, target and IP; the list counts moved 18 → 17 and 16 → 17 → 17
  with nothing created by a refused submit.
- [x] 2.4 Refusals that matter: duplicate key name, zero scopes, editing or revoking an already revoked
  key, invalid flag key format, duplicate flag key, rollout outside 0–100. EVIDENCE: `src/mock/api.ts` —
  `validateApiKeyName`, `validateScopes`, the revoked guard in `updateApiKey`/`revokeApiKey`,
  `validateFlagKey`, `validateRollout`, plus the no-environment and unknown-owner guards in
  `createFlag`/`updateFlag`.
- [x] 2.5 Defect found while verifying, fixed in the shared layer rather than worked around: `listApiKeys`
  resolved its default sort direction twice, so an explicit `dir=desc` on `createdAt` was reversed
  back and returned **oldest-first**. EVIDENCE: the direction is now resolved once inside the
  `sortRows` call and the trailing `reverse()` is gone; against the running build,
  `?sort=createdAt&dir=desc` → `07 Oct 2026, 30 Aug 2026, 21 Aug 2026, 06 Jul 2026` with
  `aria-sort="descending"`, `?sort=createdAt&dir=asc` → `21 Nov 2025` first, and the default (no
  `dir`) → newest-first. The screen-side workaround that omitted the direction is removed, so the
  route state and the request now agree.

## 3. Side-panel primitive

- [x] 3.1 One reusable panel in `src/components/ui/` that enters from the right edge, covers at most
  half the viewport at desktop sizes and the full width when narrow, with `role="dialog"`,
  containment when modal, Escape to dismiss and focus returned to the trigger. EVIDENCE:
  `src/components/ui/SidePanel.tsx` — `sm:w-1/2 sm:max-w-[44rem]`, non-modal above the narrow
  breakpoint by design (the capability requires the directory to stay usable), `aria-modal` + focus
  loop + backdrop below it; exported from `src/components/ui/index.ts`.
- [x] 3.2 Dirty-state protection: the panel warns before discarding unsaved edits and keeps the
  operator's input until they choose to discard it or continue editing. EVIDENCE: this line's own
  wording — "a three-way choice: continue editing, discard, or cancel the dismissal" — overstates the
  contract it was written against. The frozen spec (`feature-flag-management`, "Unsaved changes are
  protected") requires **two** options, and the implementation matches the spec, not the plan:
  `FeatureFlagsScreen.tsx` computes `isDirty` against a serialised baseline, routes every dismissal
  (close, Escape, re-activating the opener) through `confirmDiscard`, and renders a `ConfirmDialog`
  titled "Discard your edits?" with `confirmLabel="Discard edits"` — so choosing to continue editing
  is the dialog's cancel path and returns with the input intact. A third, distinct "cancel the
  dismissal" option would be the same action as "continue editing" under a second name. The spec is
  the authority when the two disagree, so the task is closed against the spec and the discrepancy is
  recorded here rather than quietly rewritten.

## 4. API keys surface (dialog CRUD)

- [x] 4.1 The directory: shared grid, search plus state and environment filters, distinct empty and
  no-match states, an issue action. EVIDENCE: 16 seeded keys listed with the count line
  `Records 1–16 of 16`, magnets `ACT`/`REV`, fingerprints and dates; the empty and no-match
  presentations are the shared grid states (demonstration of the empty one is blocked by the seed —
  see 7.2).
- [x] 4.2 The dialog: create and edit in the same modal, prefilled on edit, refusals shown against the
  offending field. EVIDENCE: one dialog renders as `Issue an API key` and as
  `Edit Build pipeline (verification)` with the name prefilled; refusals observed on the field:
  `A key called “CI pipeline” already exists.`, `A key needs at least one scope — a key that may do
  nothing is not useful.`
- [x] 4.3 The secret is displayed once at issue time with a copy affordance and is unrecoverable
  afterwards; revoked keys render inert with no reactivation path. EVIDENCE: after issuing, the dialog
  became `Key issued — copy the secret` with the `sk_test_…` value and a Copy control; once closed,
  `document.body.innerText.includes('sk_test_')` was `false` and reopening the same key for edit showed
  no secret; a revoked key's row menu offered only `View key — Read-only`.
- [x] 4.4 Revocation requires the typed confirmation of the key's name. EVIDENCE: `Revoke Mobile app?`
  with the destructive control disabled until `Mobile app` was typed; after confirming, the row's
  magnet became `REV` and the revoked count went from 2 to 3.

## 5. Feature flags surface (panel CRUD)

- [x] 5.1 The directory: shared grid with key, state magnet, rollout, environments, owner, last change.
  EVIDENCE: 18 flags with magnets `ON`/`OFF`/`GRD`, rollout percentages, environment chips, owners and
  last-change times.
- [x] 5.2 Create and edit in the side panel, with the directory visible and usable beside it.
  EVIDENCE: the panel measured `x=726, width=704` in a 1440 viewport (**49%**), reported
  `aria-modal: null`, moved focus inside, and rendered no backdrop; selecting a flag opened it
  prefilled (`checkout.express-lane`, rollout 25, Production checked, owner Camila Nwosu).
- [x] 5.3 Validation for key format, duplicate key and rollout range, shown against the field.
  EVIDENCE: three refusals observed live on the panel, with the entered values kept and the list
  count unchanged at 18 —
  `“Bad Key With Spaces” is not a valid key. Use lowercase words separated by single hyphens or dots…`,
  `Rollout must be a whole number between 0 and 100.`,
  `A flag with the key “checkout.express-lane” already exists.`
- [x] 5.4 Deletion through the confirmation dialog against the flag's own key, reporting the new count.
  EVIDENCE: `Delete the flag “checkout.express-lane”?` with the destructive control disabled until the
  key was typed; after confirming, rows went 18 → 17 and the count line to `Records 1–17 of 17`.

## 6. Wiring

- [x] 6.1 Four permission ids in the catalogue, granted to the system roles; both screens behind
  `RequirePermission` and their writes behind `Gate`. EVIDENCE: `src/screens/ApiKeysScreen.tsx` and
  `FeatureFlagsScreen.tsx` each import both and wrap the surface (`permission="apikeys.read"` /
  `"flags.read"`) and every write (`permission="apikeys.write"` / `"flags.write"`); the catalogue and
  the role grants reference the four new ids eight times.
- [x] 6.2 Two routes and two navigation entries (API keys under Access, Feature flags under Workspace).
  EVIDENCE: `src/router.tsx` — `/api-keys` and `/feature-flags` registered in the route tree;
  `src/shell/AppShell.tsx` — both entries present with their read permissions.

## 7. Verify

- [x] 7.1 All four gates green in one run. EVIDENCE: `npm run gate` → **GATE EXIT=0**
  (typecheck → lint → `openspec validate --all --strict` → build → detect exit 0). Lint is clean apart
  from fast-refresh advisories and one documented heuristic false positive (an `async` call inside an
  effect that cannot set state synchronously); `impeccable detect` reports 2 advisories that belong to
  TanStack Router's built-in error component, which the panel overrides and never renders.
- [x] 7.2 Walk every scenario in both deltas against the running build and record the count that
  passed; anything that cannot be demonstrated is reported, not ticked. EVIDENCE: **19 of 23 scenarios
  demonstrated against the running build** — `api-key-management` 9/11, `feature-flag-management`
  10/12. The four not demonstrated, and why:
  * *No keys on the board* and *A filter matches nothing* (keys) — the seed always contains keys, so
    the empty and no-match presentations could not be reached without emptying the store; both are the
    shared grid states, whose behaviour was demonstrated on the users directory.
  * *Empty and no-match states are distinct* (flags) — same reason: 18 seeded flags.
  * *Saving resolves the warning* (flags) — an edit was staged and discarded, but a save-with-pending-
    edit sequence was not exercised end to end.
- [x] 7.3 Live check on the deployment: both routes deep-link, the panel and the dialog behave on a
  390px viewport, and contrast is audited in both themes for the new surfaces. EVIDENCE on the
  deployed build (alias `handover-admin-teal.vercel.app`, serving `index-V6JPBBwx.js`, matching local):
  `/api-keys`, `/feature-flags`, `/organizations`, `/organizations/org_001`, `/users/usr_001` and
  `/audit` all return **200**; the 8 organization marks return **200 with `content-type: image/png`**
  (the catch-all SPA rewrite does not swallow static files) and render 8/8 at 128×128;
  at **390px** the key dialog renders 358px wide with `scrollWidth === clientWidth` (no horizontal
  overflow) and the flag panel goes full-width 390px with `aria-modal="true"`; the dark-theme select
  chevron measures **10.28:1** (rgb(240,240,240) on plum) against the 1.39:1 it shipped with; and the
  sign-in screen's first element is now the `h1` — the banned kicker is gone.
- [x] 7.4 The frozen baseline is untouched. EVIDENCE: `git diff <freeze-commit> -- openspec/specs`
  returns empty; the change only adds to it. Both CRUD screens' scenarios are covered in code, and
  `npm run gate` is exit 0 with `openspec validate --all --strict` passing.

## 8. Close

- [x] 8.1 Archive the change, confirm strict validation of the merged baseline, and push. EVIDENCE:
  archived with the merged baseline validating strictly; pushed to
  `github.com/dinhtrung/admin-panel` and verified by read-back against `git ls-remote`.
