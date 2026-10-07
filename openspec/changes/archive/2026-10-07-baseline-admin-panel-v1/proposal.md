## Why

There is no admin panel we can put in front of a reviewer: the previous attempt at an ops console
(`wip-admin-dashboard`, Ory Kratos + FastAPI + React) grew without a frozen contract, has no
specification, no design authority and no executable definition of "done". This change freezes the
behavioural contract for a from-scratch admin panel showcase — a single-page React application whose
whole surface is operable with mock data, so the UI can be reviewed, deployed and demonstrated
before any backend exists.

## What Changes

- New Vite + React 19 + TypeScript single-page application in `~/develop/admin-panel`, MIT licensed.
- Tailwind CSS v4 as the styling layer, TanStack Router for routing, TanStack Query for all data
  reads/writes, TanStack Table for the shared grid surface.
- A deterministic **mock API layer** replaces the backend for now: seeded dataset, simulated latency
  and failures, and typed request/response contracts a real backend can implement unchanged.
- Fifteen capabilities are specified as the frozen baseline: platform (app shell, theme, design
  system, mock API, data grid, authentication, access control) plus the administered objects
  (users, roles, organizations, sessions, audit log, dashboard, settings) plus static delivery.
- Deliverable is a static production build; no server-side runtime is introduced by this change.
- **BREAKING**: none — this is a new repository with no prior consumers.

## Capabilities

### New Capabilities

- `app-shell`: the persistent application chrome — navigation, page header and breadcrumbs, route
  level loading/error/empty states, responsive collapse, keyboard reachability of the whole shell.
- `theme-system`: light/dark appearance — token-driven, OS preference by default, user override
  persisted, and applied without a flash of the wrong theme on first paint.
- `design-system`: the tokens and component primitives every screen is assembled from, including
  their required states (hover, focus, disabled, invalid, loading) and accessibility contracts.
- `mock-api-layer`: deterministic in-browser data source — seeded records, CRUD operations,
  simulated latency and error responses, and the typed contract a real backend must satisfy.
- `data-grid`: the shared tabular surface — sorting, pagination, column control, row selection,
  bulk action bar, and loading/empty/error presentation, with state reflected in the URL.
- `authentication`: mock sign-in and sign-out, session persistence across reloads, expiry, and
  protected-route redirection that preserves the originally requested location.
- `access-control`: the role → permission model, gating of routes and actions, permission-aware
  affordances, and an explicit denied state instead of a broken screen.
- `user-management`: browsing, searching and filtering the directory, the user detail view, and the
  create/edit/deactivate lifecycle including bulk operations.
- `role-management`: defining roles, editing their permission grants, and seeing the blast radius
  (member counts, assignment) before a grant is saved.
- `organization-management`: organizations, their members and status, and the effect of the current
  organization on the rest of the admin surface.
- `session-management`: the list of active sessions per user with device/recency context, and
  revocation of one or many sessions.
- `audit-log`: the append-only record of who changed what — filtering by actor, action and time,
  and a detail view showing the field-level change.
- `dashboard-overview`: the landing surface — headline counts, trend context, recent activity and
  quick actions, scoped to the selected organization.
- `settings`: workspace/profile/preference settings, including appearance, and a clearly separated
  destructive zone with confirmation.
- `static-delivery`: the production build contract — reproducible build, SPA deep-link fallback,
  license and attribution files, and the checks that gate a release.

### Modified Capabilities

- None. This is the initial baseline for a new repository.

## Impact

- **New code**: `~/develop/admin-panel` (Vite + React 19 + TypeScript, Tailwind v4, TanStack
  Router/Query/Table), plus `openspec/` as the planning home and `PRODUCT.md` / `DESIGN.md` as the
  product and design authorities.
- **Dependencies added**: `@tanstack/react-router`, `@tanstack/react-query`, `@tanstack/react-table`,
  `tailwindcss`, `@tailwindcss/vite`, `clsx`, `tailwind-merge`.
- **No consumers to migrate**: no API, no database, no existing users. The mock API layer is the only
  data source and is deliberately behind a typed boundary so a future backend is a swap, not a rewrite.
- **Out of scope**: real authentication provider, real persistence, server-side rendering, i18n,
  and any change to the existing `wip-admin-dashboard` repository.
