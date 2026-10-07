## Why

The board administers people, access and sessions, but every write it offers happens on a detail page
or a bulk bar. Two table surfaces are missing: the kinds of record an operator creates and edits
constantly, and the two interaction patterns those tasks actually need — a compact **modal dialog** for
a few fields, and a **side panel** for a record with enough fields that covering the table would lose
the context you are editing against. Both are asked for as data-table pages with full CRUD.

## What Changes

- **New capability `api-key-management`** — a directory of issued API keys with CRUD performed in a
  modal dialog: issue, edit and revoke; the generated secret is shown exactly once and is never
  recoverable afterwards; revocation requires a typed confirmation.
- **New capability `feature-flag-management`** — a directory of feature flags with create and edit in a
  panel that slides in from the right edge at up to half the viewport width (the directory stays
  visible beside it), dirty-state protection on dismissal, and deletion confirmed in a dialog against
  the flag's own key.
- **Mock API layer**: two new administered objects with their own list/read/create/update/delete
  operations, validation refusals and audit events, following the existing contract in `src/mock/api.ts`.
- **Permission catalogue**: four new permissions (`apikeys.read`, `apikeys.write`, `flags.read`,
  `flags.write`) granted to the existing system roles on the same principle already in force —
  read-only roles read, administration roles write.
- **Navigation**: two new destinations — API keys under *Access*, Feature flags under *Workspace*.
- Behaviour of the existing capabilities is unchanged: no requirement of the frozen baseline is
  modified by this change.

## Capabilities

### New Capabilities

- `api-key-management`: the issued-key directory and its dialog-based create/edit/revoke lifecycle,
  including the once-only secret and the refusal to act on a revoked key.
- `feature-flag-management`: the flag directory and its side-panel create/edit lifecycle with
  dirty-state protection, plus deletion confirmed in a dialog.

### Modified Capabilities

- None. `access-control` already specifies how a permission gates a route and an action; adding
  permission identifiers to the catalogue exercises those requirements rather than changing them.

## Impact

- **Code**: `src/mock/api.ts` + `src/mock/types.ts` (two objects and their operations),
  `src/mock/permissions.ts` (four permission ids and the role grants), `src/screens/*` (two new
  screens plus a reusable side-panel primitive in `src/components/ui/`), `src/router.tsx` and
  `src/shell/AppShell.tsx` (two routes and two navigation entries).
- **Data**: the seed gains a deterministic set of API keys and feature flags, so both surfaces have
  content on first load and can also be emptied by the existing reset control.
- **Gates**: unchanged — typecheck, lint, `openspec validate --all --strict`, build, `impeccable detect`.
  This change must leave `openspec/specs/**` for the existing 15 capabilities byte-identical.
- **Not affected**: the deployment (`vercel.json`), the design system's tokens, and the mock layer's
  contract shape, which the new operations follow rather than extend.
