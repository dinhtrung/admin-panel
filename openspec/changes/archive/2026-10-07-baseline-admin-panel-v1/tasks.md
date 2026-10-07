# Tasks

Baseline scope only: establish the frozen behavioural contract and the tooling that makes it
enforceable. Implementation of the panel is a named follow-up change (`build-admin-panel-v1`), not
part of this change.

## 1. Repository and tooling baseline

- [x] 1.1 Initialise the repository and scaffold the application (Vite + React + TypeScript).
  EVIDENCE: `~/develop/admin-panel`, `git init -q` ok; `create-vite@9.2.1 --template react-ts`;
  `package.json` present with `vite ^8.3.0`, `react ^19.2.8`, `typescript ~6.0.2`.
- [x] 1.2 Install the pinned stack. EVIDENCE: `@tanstack/react-router`, `@tanstack/react-query`,
  `@tanstack/react-table`, `clsx`, `tailwind-merge`, `tailwindcss 4.3.3`,
  `@tailwindcss/vite ^4.3.3`; `npm install` → `found 0 vulnerabilities`.
- [x] 1.3 Verify the router version is clear of the flagged advisories. EVIDENCE: installed
  `@tanstack/react-router ^1.170.41`; the OSSF-flagged versions are `1.169.5` and `1.169.8`, so the
  resolved range excludes both.
- [x] 1.4 Initialise OpenSpec for this repository. EVIDENCE: `openspec --version` → `1.8.0`;
  `openspec init --tools hermes --no-animation` → `openspec/config.yaml` (schema `spec-driven`) +
  6 skills in `.hermes/`; `openspec doctor` reports `OpenSpec root: ok`, no config errors.
- [x] 1.5 Add the MIT license and the repository integrity files. EVIDENCE: `LICENSE` (MIT,
  `Trung Nguyen`), `.gitignore` covering build output, the vendored agent bundles under `.hermes/`
  and `.impeccable/cache`.
- [ ] 1.6 Add the release-gate scripts to `package.json`: `typecheck`, `lint`, `gate:spec`
  (`openspec validate --all --strict`), `gate:design` (`impeccable detect`), `gate` (all four).
  EVIDENCE: `npm run gate` output pasted into the commit that adds them.

## 2. Freeze the behavioural baseline

- [x] 2.1 Scaffold the change through the CLI. EVIDENCE: `openspec new change
  "baseline-admin-panel-v1"` (never a hand-made directory).
- [x] 2.2 Write `proposal.md` with the capability contract. EVIDENCE: 15 new capabilities listed,
  15 spec directories on disk, zero missing and zero extra (`/tmp/verify_specs.py`).
- [x] 2.3 Write the 15 capability deltas. EVIDENCE: 73 `### Requirement:` and 179
  `#### Scenario:` lines; every scenario header uses four hashes; every requirement's first
  normative sentence carries SHALL/MUST; no three-hash header anywhere.
- [x] 2.4 Write `design.md` (decisions, rejected alternatives, risks, migration, open questions).
  EVIDENCE: `design.md` in the change directory, 8 numbered decisions each naming what was rejected.
- [ ] 2.5 Validate the change strictly. EVIDENCE: `openspec validate "baseline-admin-panel-v1"
  --type change --strict` → `Change 'baseline-admin-panel-v1' is valid` (name first as the
  positional argument; `--changes` alone means "validate all").
- [ ] 2.6 Archive the baseline so the deltas merge into `openspec/specs/**`.
  EVIDENCE: `openspec archive "baseline-admin-panel-v1" -y` output showing the spec totals and the
  `YYYY-MM-DD-baseline-admin-panel-v1` archive path; then `openspec validate --specs --strict`
  reporting one `✓ spec/<capability>` line per capability, and `openspec list` reporting no active
  changes.
- [ ] 2.7 Write `openspec/project.md` as the conventions file: spec language rules, the frozen
  baseline rule (later changes go through a new change; never edit `openspec/specs/**` directly),
  the two gates, and the current project state.
- [ ] 2.8 Commit the planning artifacts alone, so the reviewed baseline is the first commit.

## 3. Product and design authority (prerequisites for the build change)

- [x] 3.1 Write `PRODUCT.md` with product truth. EVIDENCE: `PRODUCT.md` present, `impeccable
  context` no longer reports `NO_PRODUCT_MD`; every inferred fact labelled as inferred.
- [ ] 3.2 Record the direction contract (`.impeccable/surfaces/<entry>.md`, six blocks +
  seed key) before any UI code. EVIDENCE: `impeccable surface-brief read <entry>` output showing
  THESIS / OWN-WORLD / STORY / FIRST VIEWPORT / FORM / FINISH.
- [ ] 3.3 Record palette provenance with the tokens (palette title, author, source URL, archival
  snapshot, hexes) so the choice is auditable without the live site.

## 4. Named follow-up changes (not created here)

Listing them keeps `openspec list` honest: an empty change directory would claim work that is not
in progress.

- `build-admin-panel-v1` — implement every capability of the frozen baseline (design system, mock
  API layer, shell, auth, access control, grid, the seven admin surfaces), plus the design gates
  (screenshots at 1440/390, contrast audit, `impeccable detect`), `README` with real captures, and
  the first push to the private repository.
- `add-real-backend-api` — replace the mock layer with an HTTP implementation of the same typed
  contract. Requires no screen change by construction; must not alter the frozen specs.
- `add-pwa-offline` — optional, only if the panel needs to be installable on the user's phone;
  deliberately out of scope for the baseline.
