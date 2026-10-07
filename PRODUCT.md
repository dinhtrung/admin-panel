# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated + user-pinned: the user pinned **React + Tailwind CSS + Vite**; the concrete selection is
Vite 8, React 19, TypeScript, Tailwind CSS v4, TanStack Router / Query / Table, `clsx` +
`tailwind-merge`. No backend: all data is served by a deterministic in-browser mock API layer.
*(Inferred from the user's stack instruction and the frozen spec baseline, not from an interview.)*

## Users

Two audiences, one surface:

1. **The evaluator** — a developer or hiring reviewer who opens the deployed build with no account
   and no instructions. Their job in the first two minutes is to decide whether this person can
   build a real admin product: does it work, is every state designed, does it read as a tool an
   operator would trust. They will click before they read.
2. **The operator (persona)** — the administrator the panel is nominally for: manages users, roles,
   organizations, active sessions and the audit record. Their job is a repeated task done under
   pressure: find the account, change the thing, know it took effect, be able to prove later who
   changed it. They sit at a desktop for the heavy work and check sessions/alerts on a phone.

*(Audience 2 is the designed-for persona; audience 1 is why the artifact exists. Both inferred from
"showcase with mock data" + the frozen capability list.)*

## Product Purpose

An admin panel that is operable end to end on synthetic data: sign in, administer users, roles,
organizations, sessions and settings, and read back the audit trail of everything you just did —
with no server, no account and no setup. It exists to demonstrate that the full behaviour contract
(15 capabilities, frozen in OpenSpec) survives contact with a real interface, and that the interface
is produced under a design authority rather than improvised screen by screen.

Success means: a cold clone runs with one command; every list works empty and full; a destructive
action is confirmed and then provably recorded in the audit log; the panel is fully keyboard
operable and readable at 390 px as well as 1440 px.

## Positioning

The claim a neighbouring admin template cannot copy without doing the work: **the behaviour is
specified before it is built and the design is measured after it is built.** Two machine-checked
gates sit on the repository — an OpenSpec baseline that fails validation when behaviour drifts, and
a deterministic design detector that fails on the 61 antipatterns every generated dashboard ships.
A UI kit gives you screens; this gives you a contract, the screens that satisfy it, and the evidence
for both.

## Operating Context

- Developed and demoed from a static production build; deep links must survive a hard reload.
- The seed dataset is loaded into the browser on first run; every mutation is local and persists
  across a reload. There is no server to be unavailable, but the mock layer deliberately simulates
  latency and failures so those paths are real.
- Evaluation is comparative and fast: the reviewer has seen many admin templates and will judge the
  first viewport, the empty states and the error handling before reading any README.

## Capabilities and Constraints

Frozen baseline (15 capabilities): `app-shell`, `theme-system`, `design-system`, `mock-api-layer`,
`data-grid`, `authentication`, `access-control`, `user-management`, `role-management`,
`organization-management`, `session-management`, `audit-log`, `dashboard-overview`, `settings`,
`static-delivery`.

Constraints: no backend, no real identity provider, no server-side rendering, no i18n, no e-mail
delivery. Storage is browser-local. Everything the panel displays is synthetic and must be
labelled synthetic — no real people, companies, or telemetry.

## Brand Commitments

- **MIT licensed.** License and attribution files ship in the repository and in the build.
- Repository name `admin-panel`; author `Trung Nguyen` (GitHub `dinhtrung`).
- Published as a private repository that doubles as a portfolio piece — a reviewer may be given
  access, so nothing client-specific, internal or confidential may ever appear in it.

## Evidence on Hand

None real, and none may be fabricated: no customers, no testimonials, no benchmarks, no production
telemetry. All names, organizations, sessions, IP addresses and audit events are authored synthetic
data and are labelled as such in the interface. Screenshots in the README are captures of the
deployed build, not mockups.

## Product Principles

1. **Operable before ornamental.** Every screen must complete its task with the styling removed;
   the visual system then earns the trust the task requires.
2. **Every state is designed, or the screen is unfinished.** Empty, loading, error, denied, expired
   and overlong-content states are part of the screen, not cleanup afterwards.
3. **The contract outranks the interface.** Behaviour that is not in the frozen spec is a bug in the
   spec first; a design decision that changes behaviour goes back through a change, not into code.
4. **Prove it, don't claim it.** Numbers, counts, diffs and revocations are shown where they happen;
   "it works" is demonstrated by the audit entry the action produced.
5. **Accessibility and keyboard operation are the floor, not a feature.** Contrast, focus, target
   size and announced state are release criteria.

## Accessibility & Inclusion

Target WCAG 2.2 AA: body text contrast ≥ 4.5:1 in both themes (verified by computing every shipped
text/ground pair, not by eye), interactive targets at least 24×24 px with standalone controls
growing a 44 px hit area, complete keyboard operation with a visible focus ring, no information
carried by colour alone, and table sort/filter/selection state announced to assistive technology.
