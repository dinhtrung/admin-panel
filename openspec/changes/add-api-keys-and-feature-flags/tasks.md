# Tasks

Two new CRUD surfaces. Behaviour comes from the specs in this change; this file is the plan and the
audit trail, so a ticked task carries its evidence on the same line.

## 1. Freeze the contract

- [ ] 1.1 Write the proposal and both capability deltas. EVIDENCE: 2 spec directories, requirement and
  scenario counts, every `#### Scenario:` header using four hashes.
- [ ] 1.2 Validate strictly and commit the planning artifacts alone, before any code.
  EVIDENCE: `openspec validate "add-api-keys-and-feature-flags" --type change --strict` output and the
  commit SHA.

## 2. Mock API layer

- [ ] 2.1 Add the two objects to the domain types and the deterministic seed (a set of API keys across
  states and environments, a set of flags across states, rollouts and owners). EVIDENCE: seed counts
  printed from the store.
- [ ] 2.2 Bump the store version so an older stored seed reseeds instead of reading absent collections.
- [ ] 2.3 Implement list / get / create / update / revoke / delete for both objects, following the
  existing contract: latency, opt-in failure, validation refusals, and exactly one audit event per
  state change with the field-level diff. EVIDENCE: probe output — events after N mutations = N.
- [ ] 2.4 Refusals that matter: duplicate key name, zero scopes, editing or revoking an already revoked
  key, invalid flag key format, duplicate flag key, rollout outside 0–100.

## 3. Side-panel primitive

- [ ] 3.1 One reusable panel in `src/components/ui/` that enters from the right edge, covers at most
  half the viewport at desktop sizes and the full width when narrow, with `role="dialog"`,
  `aria-modal`, a contained focus loop, Escape to dismiss and focus returned to the trigger.
- [ ] 3.2 Dirty-state protection with a three-way choice: continue editing, discard, or cancel the
  dismissal. EVIDENCE: keyboard walkthrough notes.

## 4. API keys surface (dialog CRUD)

- [ ] 4.1 The directory: shared grid, search plus state and environment filters, distinct empty and
  no-match states, an issue action.
- [ ] 4.2 The dialog: create and edit in the same modal, prefilled on edit, refusals shown against the
  offending field.
- [ ] 4.3 The secret is displayed once at issue time with a copy affordance and is unrecoverable
  afterwards; revoked keys render inert with no reactivation path.
- [ ] 4.4 Revocation requires the typed confirmation of the key's name.

## 5. Feature flags surface (panel CRUD)

- [ ] 5.1 The directory: shared grid with key, state magnet, rollout, environments, owner, last change.
- [ ] 5.2 Create and edit in the side panel, with the directory visible and usable beside it.
- [ ] 5.3 Validation for key format, duplicate key and rollout range, shown against the field.
- [ ] 5.4 Deletion through the confirmation dialog against the flag's own key, reporting the new count.

## 6. Wiring

- [ ] 6.1 Four permission ids in the catalogue, granted to the system roles; both screens behind
  `RequirePermission` and their writes behind `Gate`.
- [ ] 6.2 Two routes and two navigation entries (API keys under Access, Feature flags under Workspace).

## 7. Verify

- [ ] 7.1 All four gates green in one run. EVIDENCE: `npm run gate` output.
- [ ] 7.2 Walk every scenario in both deltas against the running build and record the count that
  passed; anything that cannot be demonstrated is reported, not ticked. EVIDENCE: per-capability counts.
- [ ] 7.3 Live check on the deployment: both routes deep-link, the panel and the dialog behave on a
  390px viewport, and contrast is audited in both themes for the new surfaces. EVIDENCE: the command
  or probe output and the numbers.
- [ ] 7.4 Deploy and re-verify the live URLs; `openspec/specs/**` for the existing 15 capabilities
  unchanged (`git diff --stat` empty).

## 8. Close

- [ ] 8.1 Archive the change, confirm strict validation of the merged baseline, and push.
