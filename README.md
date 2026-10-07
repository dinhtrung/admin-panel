# admin-panel

An operable admin surface for **users, roles, organizations, active sessions and the audit record** —
running end to end on synthetic data, with no server, no account and no setup.

**Live:** https://handover-admin-teal.vercel.app · **License:** MIT

It exists to demonstrate one claim: **the behaviour is specified before it is built, and the design is
measured after it is built.** Two machine-checked gates sit on this repository — a frozen OpenSpec
baseline (15 capabilities, 73 requirements, 179 scenarios) and a deterministic design detector.
A UI kit gives you screens; this gives you the contract, the screens that satisfy it, and the evidence
for both.

![The board at 1440](docs/screenshots/desktop.png)
![The board at 390](docs/screenshots/mobile.png)

## What you can actually do

Sign in as any of four demo accounts — each demonstrates a different permission state, including a role
that can see the board but change nothing.

- **Overview** — headline counts with a period-over-period comparison, an explicit *"no prior period to
  compare"* instead of a fake zero, recent activity linking into the audit record, and quick actions
  that disappear when your roles do not grant them.
- **Users** — search and filters, sortable columns with announced sort state, row selection with a bulk
  action bar, invite/edit with duplicate-email refusal, suspend/deactivate/reactivate, and a refusal to
  deactivate your own account.
- **Roles** — a grouped permission matrix where edits are staged, with the **blast radius** (how many
  members the pending grants would affect) shown *before* you save, protection for system roles, and a
  rule that refuses to leave the workspace with no administrator.
- **Organizations** — members, per-organization roles, last-owner protection, and a scope control that
  re-scopes the entire board.
- **Sessions** — every active session with device, location, IP and recency, your own session marked,
  and revocation of one or all others (revoking your own ends your session, as it should).
- **Audit record** — append-only, filterable by actor/action/target/date, with a field-level
  before → after detail view, and **no edit or delete affordance anywhere**.
- **Settings** — workspace and personal preferences, slug validation, unsaved-change protection, and a
  destructive zone that requires a typed confirmation.

Every list works **empty** as well as full, distinguishes *no matches* from *failed request*, and has a
retry path. The board controls (top of the rail) can **fail the next request** on purpose, so you can
see the failure state rather than take my word for it.

## Run it

```bash
git clone git@github.com:dinhtrung/admin-panel.git && cd admin-panel
npm install
npm run dev          # http://localhost:5173
```

No environment variable, no secret, no database. `npm run build` writes a static `dist/`.

## The gates

```bash
npm run gate
# typecheck (tsc -b) → lint (oxlint) → openspec validate --all --strict
# → build → impeccable detect (exit 0)
```

Measured on the current commit: `openspec validate --specs --strict` → **15 passed, 0 failed**;
`impeccable detect` → **`[]`** (0 findings, exit 0); typecheck clean; lint clean apart from
fast-refresh advisories. The design detector runs over `dist/`, where it can actually read the shipped
CSS — pointed at `src/` alone it sees nothing and always reports zero, which is worth knowing before
trusting a green design gate in someone else's repository.

## How it is put together

| Question | Single source of truth |
|---|---|
| What must the system do | `openspec/specs/**` — frozen; changes only through a new change |
| What the product is | `PRODUCT.md` |
| What a surface looks like | `.impeccable/surfaces/*.md` (direction contract, written before code) |
| Which tokens shipped | `DESIGN.md` + `.impeccable/design.json` (generated *from* the built code) |

- **Stack:** React 19 + TypeScript, Vite 8, Tailwind CSS v4 (CSS-first tokens), TanStack Router + Query.
  Fonts self-hosted from `@fontsource-variable` (Archivo + Azeret Mono) — no CDN, no hosted stylesheet.
- **Data:** `src/mock/api.ts` is the only data source — deterministic seed, CRUD, simulated latency,
  opt-in failures, browser-local persistence, and **exactly one audit event per state change**. A real
  backend replaces that one module; no screen imports the seed or the store.
- **Design direction — "Handover":** a working board whose type, palette, density and one signature move
  come from the ward handover board tradition, while navigation, layout and controls stay ordinary web
  ones. Status is a **magnet** — a fixed-width chip carrying a three-letter code, a fill weight and a
  hue in a dedicated column — so state survives greyscale, colour blindness and a screenshot. The
  palette is a real COLOURlovers palette, not an invention: provenance, the five swatches and the
  dark-theme role translation are in [`docs/design/palette.md`](docs/design/palette.md).
- **Deployment:** static SPA with deep-link fallback (`vercel.json` rewrites, `public/_redirects`).
  Steps, plus the checks that matter: [`docs/deploy.md`](docs/deploy.md).

## Accessibility, measured rather than asserted

- **Contrast:** every rendered text/ground pair is computed (WCAG 2.1 relative luminance) in **both
  themes** — 249 elements checked in dark, 0 failures; the lowest shipped pair is 6.40:1.
- **Keyboard:** the shell, both dialogs, the menus and the grid are keyboard operable; the collapsed
  navigation opens over the content and returns focus to the control that opened it.
- **Narrow viewport (390px):** no page-level horizontal overflow, the bulk action bar does not obscure
  rows, and the grid scrolls inside its own container.
- **Sort state:** `aria-sort` follows the comparator — clicking a header both ways flips both the
  announcement and the first row (verified by clicking, not by reading the code).

## What is *not* real

- **No backend.** Everything runs in your browser; the store is `localStorage`. Nothing you do leaves
  the machine.
- **No real identity.** Sign-in is a mock: any seeded account, any non-empty password. The four demo
  accounts exist so every permission state is reachable without an administrator ceremony.
- **All data is authored and synthetic** — every person, organization, IP address and audit event.
  There are no customers, benchmarks, prices or testimonials here, and none may be invented.
- Screenshots in this README are captures of the deployed build, not mockups.

## License

MIT — see [`LICENSE`](LICENSE), also served at `/LICENSE.txt` by the deployment.
