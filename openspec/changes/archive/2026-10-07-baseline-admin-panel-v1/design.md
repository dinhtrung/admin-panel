# Design

## Context

Greenfield: an MIT-licensed admin panel showcase, no backend, no existing users. The previous
attempt at an ops console (`~/develop/wip-admin-dashboard`, Ory Kratos + FastAPI + React) is left
untouched and is treated only as evidence of what goes wrong without a frozen contract: its
behaviour grew screen by screen, nothing states what the panel must do, and there is no automated
definition of done.

Two constraints shape every decision below. First, the artifact exists to be *evaluated*, so a
reviewer must be able to run it, deep-link into it and inspect its states without credentials or
setup. Second, the behaviour must be reviewable as a document, so the specification has to be the
thing the code is checked against rather than a description written afterwards.

The design authority is split deliberately, so that no question has two answers:

| Question | Single source of truth | Lifecycle |
|---|---|---|
| What must the system do (scope, behaviour, acceptance) | `openspec/specs/**` (frozen) + deltas in `openspec/changes/<name>/` | changes only through a new change; the archive merges |
| What the product is, for whom, what it may never claim | `PRODUCT.md` | written once, updated when product truth changes |
| What this surface looks like and how it is organised | `.impeccable/surfaces/<slug>.md` (direction contract) | one brief per surface, written **before** code |
| Which tokens, components, type and colour shipped | `DESIGN.md` + `.impeccable/design.json` | generated **from** the built code at the finish |

The bridge rule between the two authorities: a design decision that changes behaviour goes back
into the change's delta spec (a rule that lives only in `DESIGN.md` is behaviour nobody approved),
and a spec never dictates layout or visual treatment.

## Goals / Non-Goals

**Goals**

- A frozen baseline of 15 capabilities, validated strictly, archived, and unreachable by
  implementation drift.
- A single-page admin panel that is fully operable on synthetic data: sign-in, users, roles,
  organizations, sessions, audit, dashboard, settings.
- Every capability demonstrable in the browser, including its empty, loading, error, denied and
  expired states.
- Two machine-checked gates on the repository: behavioural (`openspec validate --all --strict`) and
  design (`impeccable detect`), both release-blocking.
- Complete keyboard operation and WCAG 2.2 AA contrast as acceptance criteria, not aspirations.

**Non-Goals**

- A real backend, real identity provider, database, e-mail delivery or multi-tenancy.
- Server-side rendering, i18n, offline/PWA installation, or native packaging.
- Any change to `wip-admin-dashboard`; any client, employer or real-person data anywhere in the
  repository.

## Decisions

### D1 — Freeze the baseline through one archived change, not by hand-writing `openspec/specs/`

The 15 capability specs are written as deltas in `baseline-admin-panel-v1` and merged into
`openspec/specs/**` by `openspec archive`, so the freeze carries an archive trail and passes the
same strict validation as every later change.

*Rejected:* writing `openspec/specs/*/spec.md` directly — no delta to review, no validation gate on
the freeze itself, and the first later change would have nothing to diff against.

### D2 — The only data source is an in-browser mock layer behind a typed contract

All reads and writes go through one module boundary with the shape of a real API (list/read/
create/update/delete over the seeded objects, simulated latency, simulated failures). Seeded data is
deterministic; mutations persist across reload; every mutation appends exactly one audit event. A
future backend replaces this module without touching a screen.

*Rejected:* MSW (a service-worker layer adds a second runtime to debug and hides the boundary the
contract is meant to make explicit); a FastAPI backend now (doubles the surface to build and deploy
before a single screen is reviewable, and the contract is better proven by one implementation).

### D3 — The seed is deterministic and the failures are opt-in

Every generated page of data, screenshot and manual test depends on the same seed, so a defect is
reproducible; failure responses are requested explicitly (a dev affordance) rather than injected at
random.

*Rejected:* randomized demo data — irreproducible screenshots and unreviewable diffs; random
failure injection — makes "the list is empty" indistinguishable from "the request failed".

### D4 — TanStack Router + Query + Table; Tailwind v4 with CSS-first tokens

Typed search-param state is what makes the data-grid requirement (shareable, reload-surviving list
state) cheap and correct, and Query's cache is what makes the "recompute only what changed"
behaviour of a permission edit honest. Tokens live in one CSS layer via Tailwind v4's `@theme`, so
the palette has exactly one home.

*Rejected:* React Router (weaker typed URL state); a heavyweight data grid library (licensing and
bundle weight for behaviour this project specifies itself); JS-config Tailwind tokens (a second
place for colour to be defined, which is how a design system drifts).

### D5 — Theme: system by default, explicit override, applied before first paint

Appearance resolves as `system | light | dark`; the choice persists; an inline pre-paint script
reads the stored choice and the OS preference so the first paint is already correct — including on
a deep link. Both themes are first-class, and contrast is verified in both.

*Rejected:* defaulting to dark because admin panels "look like that" (the use scene decides, not the
category); theme applied after hydration (a flash of the wrong theme is a defect a reviewer sees
immediately).

### D6 — Palette pinned to a real COLOURlovers palette, recorded with provenance

The palette is taken from a real COLOURlovers palette (the user's instruction), not invented, and
the exact palette title, author, palette URL and an archival snapshot are recorded alongside the
tokens. The palette is committed to: it owns the shell rail, the board ground and the state
colours, each doing a real job, instead of a grey screen with one accent.

*Rejected:* an invented palette (the fastest route back to the generic generated-dashboard look);
also rejected: sourcing from live COLOURlovers.com, which is behind a hard bot wall with its API
closed — the archive is the tractable source and is recorded as such.

### D7 — Design authority is a written contract plus a deterministic detector

The visual direction (`Handover`: a working board whose type, palette, density and one signature
move come from the ward handover board tradition, while navigation and controls stay standard) is
recorded as a six-block direction contract **before** UI code, then audited: one batched screenshot
round at 1440 and 390, one `impeccable detect` run, and `DESIGN.md` generated from what shipped.

*Rejected:* writing `DESIGN.md` up front (a rulebook defended against reality instead of describing
it); comp-led build with this box's current image model (`fal-ai/flux-2/klein/9b` garbles UI text,
so comps would be a pretty lie rather than a fidelity reference).

### D8 — Static delivery with explicit release gates

The deliverable is a production build of the static SPA with SPA deep-link fallback, `LICENSE` and
attribution both in the repository and in the published build, and no credential required to build
or run. Release gates, all of which must pass: type check, lint, `openspec validate --all --strict`,
`impeccable detect` exit 0.

*Rejected:* a runtime server (nothing to serve); deployment to a host the user has not chosen — the
build is produced and made deployable, and the host choice stays the user's.

## Risks

| Risk | Mitigation |
|---|---|
| Spec and surface drift apart: `DESIGN.md` describing screens the spec forbids, or code adding behaviour no spec covers | Bridge rule (behaviour changes go back through a change) + verify the running build scenario by scenario before archiving, with the probe recorded in `tasks.md` |
| Browser storage cleared or schema changed between sessions, so the demo looks broken to a reviewer | Mock layer detects an empty or stale store and reseeds deterministically; a visible reset affordance exists; schema version is stored with the data |
| Simulated latency and failure injection making the UI flaky in tests or screenshots | Latency is deterministic and small, failures are opt-in, and the gates disable latency |
| Accessibility asserted rather than tested | Contrast computed numerically for every text/ground pair in both themes; keyboard walkthrough per screen; target sizes measured |
| The palette source (COLOURlovers) being unreachable later, losing its provenance | Palette identity, author, original URL and archival snapshot recorded in the repository with the tokens, so the choice is auditable without the live site |
| Scope creep from "showcase" into "product" (real auth, real API) | The non-goals are stated in `PRODUCT.md` and in this document; a real backend is a named follow-up change, not a silent addition |

## Migration Plan

Nothing to migrate: this is the initial baseline for a new repository. The existing
`wip-admin-dashboard` repository is explicitly untouched, and no consumer depends on anything here.
Because the mock layer is one module behind a typed boundary, the single migration this design
anticipates is replacing it with a real HTTP implementation — a named follow-up change, and one
that requires no screen changes by construction.

## Open Questions

- **Deployment host** — the build is host-agnostic (static output plus SPA fallback); which host
  serves it (and whether the repository publishing it is private) is the user's call and does not
  change any requirement.
- **Naming** — the repository is `admin-panel` and the interface uses that wordmark; whether the
  panel gets its own name and mark is open and deliberately not invented here.
