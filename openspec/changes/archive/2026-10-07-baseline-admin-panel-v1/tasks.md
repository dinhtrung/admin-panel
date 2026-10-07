# Tasks

Baseline scope only: establish the frozen behavioural contract and the tooling that makes it
enforceable. Implementation of the panel is a named follow-up change (`build-admin-panel-v1`), not
part of this change.

Ledger state: **17 of 17 ticked.** The seven that sat open longest were the ones whose work landed in
a later change (`build-admin-panel-v1` built the gates, the palette record and the direction contract);
they were ticked after the artifacts were verified to exist, not because the change was archived.

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
- [x] 1.6 Add the release-gate scripts to `package.json`: `typecheck`, `lint`, `gate:spec`
  (`openspec validate --all --strict`), `gate:design` (`impeccable detect`), `gate` (all four).
  EVIDENCE: all five scripts present (`node -e` over `package.json` scripts → dev, build, lint,
  typecheck, gate:spec, gate:design, gate, preview); `npm run gate` → exit 0.

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
- [x] 2.5 Validate the change strictly. EVIDENCE: `openspec validate "baseline-admin-panel-v1"
  --type change --strict` → `Change 'baseline-admin-panel-v1' is valid` (name first as the
  positional argument; `--changes` alone means "validate all"). Re-confirmed at archive time, and
  the merged baseline still validates: `openspec validate --all --strict` → 18 items, 0 failed.
- [x] 2.6 Archive the baseline so the deltas merge into `openspec/specs/**`.
  EVIDENCE: archived at `openspec/changes/archive/2026-10-07-baseline-admin-panel-v1/`; the merged
  specs are on disk as 15 capability directories (now 15 + the two added later = 17), and no active
  change claims those capabilities.
- [x] 2.7 Write `openspec/project.md` as the conventions file: spec language rules, the frozen
  baseline rule (later changes go through a new change; never edit `openspec/specs/**` directly),
  the two gates, and the current project state. EVIDENCE: `openspec/project.md` present (3.8 KB).
- [x] 2.8 Commit the planning artifacts alone, so the reviewed baseline is the first commit.
  EVIDENCE: the baseline landed as its own commit (`2ef5282`, "feat: implement the frozen baseline
  (15 capabilities, 73 requirements)") with the spec artifacts preceding the implementation commits.

## 3. Product and design authority (prerequisites for the build change)

- [x] 3.1 Write `PRODUCT.md` with product truth. EVIDENCE: `PRODUCT.md` present, `impeccable
  context` no longer reports `NO_PRODUCT_MD`; every inferred fact labelled as inferred.
- [x] 3.2 Record the direction contract (`.impeccable/surfaces/<entry>.md`, six blocks +
  seed key) before any UI code. EVIDENCE: `.impeccable/surfaces/src-main-tsx.md` present (2.9 KB),
  recording the six blocks and the seed key for the direction "Handover". Written before the shell
  was built, which is why the ban on an icon-per-navigation-item rail and the ruled-not-shadowed rule
  are contract text rather than retrofit.
- [x] 3.3 Record palette provenance with the tokens (palette title, author, source URL, archival
  snapshot, hexes) so the choice is auditable without the live site. EVIDENCE:
  `docs/design/palette.md` records COLOURlovers `1004609` "Yoko Hanako 1109" by `_Mac_DyE_`, its
  original URL, the Internet Archive snapshot `20190724012746` used to read it, the five swatches
  verbatim, and the light/dark role translation with its reason. The file now also records a second
  pinned palette for the third appearance (id `100429` "Stormy Dusk" by `junyr`, snapshot
  `20130622165810`) and the measured contrast pairs for all three appearances.

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
