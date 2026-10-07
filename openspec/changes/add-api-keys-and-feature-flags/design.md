# Design

## Context

The frozen baseline already specifies the shell, the shared data grid, the mock layer and seven admin
surfaces. This change adds two more surfaces that the same operator needs and that the baseline does
not cover, and it is deliberately the place where the **two CRUD interaction patterns** get settled:
a compact record is edited in a modal dialog, and a record with enough fields to need context is edited
in a panel that slides in from the right while the directory stays visible.

## Goals / Non-Goals

**Goals**

- Two data-table surfaces with full create / read / update / delete, each using the pattern the task
  actually calls for rather than one pattern bent to fit both.
- Both surfaces obey the design system already in force: ruled panels, the shared grid, magnets for
  state, one overlay elevation, tokens only.
- Every write produces exactly one audit event, and the two refusals that matter (duplicate name, last
  one standing) are surfaced on the field that caused them.
- Keyboard and contrast parity with the existing surfaces: focus enters the overlay, is contained,
  returns on dismiss, and Escape closes.

**Non-Goals**

- No change to any requirement of the frozen baseline, and no edit to `openspec/specs/**`.
- No real key material: the panel stores a fingerprint, never a usable secret.
- No relationship between a flag and the users it rolls out to; rollout is a number the operator sets.

## Decisions

### D1 — The entity follows the pattern, and each entity earns its page

`api-key-management` gets the **dialog**: four fields, a decision that takes seconds, and no value in
seeing the directory while you make it. `feature-flag-management` gets the **side panel**: seven
fields plus a scope list, and the operator is editing *against* the directory — which flag is already
on, what the neighbouring rollout values are — so the table must stay visible.

*Rejected:* one pattern for both. It would have been less work and would have demonstrated nothing;
the point of the request is the two patterns. Also rejected: bolting CRUD onto the existing users and
roles pages instead of adding objects, which would modify frozen capabilities and put two different
editing patterns behind the same page.

### D2 — The side panel is an overlay, not a layout push

The panel enters from the right edge and covers at most half the viewport at desktop sizes, full width
on a narrow viewport. It is an overlay with `role="dialog"` and `aria-modal`, containing focus while
open and returning it to the trigger on dismiss.

*Rejected:* a push layout that shrinks the board while the panel is open — the grid's column widths
would reflow mid-edit, and a table that moves under the operator's cursor is worse than one that is
partly covered. Also rejected: an inline expanded row (too few fields fit) and a full route (loses the
directory, which is the entire reason this pattern exists).

### D3 — The secret is shown once and is never stored

Issuing a key generates a secret, shows it exactly once with a copy affordance, and states plainly that
it will not be shown again. The store keeps only a fingerprint and the last four characters.

*Rejected:* persisting the secret so the edit dialog can re-display it. It would be easier and it
would teach the opposite of the correct habit — this is a showcase, and the honest behaviour is the
one a reviewer should copy.

### D4 — Two new permission pairs, granted on the principle already in force

`apikeys.read` / `apikeys.write` and `flags.read` / `flags.write` join the catalogue; Owner and
Administrator get the writes, Support and Viewer get the reads, and the custom Billing role gets the
reads because it is a read-only role by construction.

*Rejected:* reusing an existing permission such as `users.write` — a grant that means "can edit users"
should not be the thing that unlocks revoking credentials.

### D5 — The store version moves, so existing local data reseeds

The two objects are new collections in the stored database, so `SCHEMA_VERSION` is bumped. A browser
holding the previous seed discards it and reseeds deterministically rather than reading a store that
has no `apiKeys` array.

*Rejected:* defending every read against absent collections. The store is a demo seed with a visible
reset; a version bump is the honest mechanism and it is already in place.

## Risks

| Risk | Mitigation |
|---|---|
| The side panel and the confirm dialog fight over focus, or Escape closes the wrong layer | One layering order: the panel is the outer overlay, a confirmation opened from it renders above and closes first; both are covered by a keyboard walkthrough before the change is archived |
| Dirty-state protection becomes a trap (no way out without saving) | The prompt offers three routes: continue editing, discard and leave; and the panel's own close control is always available |
| The slide-in animation is caught by the design detector or ignores reduced motion | Motion is a single transform/opacity transition inside the existing reduced-motion guard, and the detector runs over the built output before the change closes |
| A key or flag written into the seed makes the surfaces look like real infrastructure | Every value is authored and synthetic, consistent with the rest of the board, and the footer notice already says so |

## Migration Plan

No consumer migrates. The store version bump reseeds any browser holding an older seed; the reset
control in the board controls does the same on demand. No deployment configuration changes.

## Open Questions

- Whether flags should later bind to organizations (rollout per organization) is deliberately left
  open: it would change the flag's contract, so it belongs in its own change rather than here.
