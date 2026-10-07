# Tasks — add-theme-switcher

Ordered. Each line is a task and its evidence, and the four gates must be green in one run at the end.

## 1. Freeze the contract

- [ ] 1.1 Write the proposal and the `theme-system` delta; every `#### Scenario:` header uses four
  hashes. EVIDENCE: requirement and scenario counts.
- [ ] 1.2 Validate strictly and commit the planning artifacts alone, before any code. EVIDENCE:
  `openspec validate "add-theme-switcher" --type change --strict` and the commit SHA.

## 2. The fourth appearance

- [ ] 2.1 Record the third pinned palette's provenance (`docs/design/palette.md`): site, title, id,
  author, original URL, the Internet Archive snapshot used, and the five swatches verbatim.
  EVIDENCE: the table, and the role each swatch took.
- [ ] 2.2 Define the appearance's token set in `src/index.css` against the same semantic role names as
  the others — every role defined, no role added, semantic hues untouched. EVIDENCE: the token block
  and the role list it covers.
- [ ] 2.3 Give the appearance its own rail focus ring, because the ring is drawn on the surface behind
  the control and this appearance's rail is its own colour. EVIDENCE: the ring's measured contrast on
  the rail, and on a panel.
- [ ] 2.4 The first-paint resolution covers it, so a deep link opens in it with no frame of another
  appearance. EVIDENCE: the document's theme attribute read at load with this appearance stored.

## 3. The switcher

- [ ] 3.1 Replace the segmented row with a switcher driven by the registry: one control, every
  registered appearance, the active one indicated. EVIDENCE: the control's entries and the active
  marker, and that a further registry entry needs no control change.
- [ ] 3.2 Each entry previews that appearance's own colours, including appearances that are not
  currently applied. EVIDENCE: the preview colours read from the entries, compared with the
  appearances' token values.
- [ ] 3.3 Keyboard operation: open, move, choose, dismiss-without-choosing, with focus returned to the
  switcher. EVIDENCE: a keyboard walkthrough recording each step and the focus location.
- [ ] 3.4 Both tones still work where the control is used — the rail and the Settings panel — and it
  fits the rail's width at 1440 and 390. EVIDENCE: rendered widths and no overflow.

## 4. Legibility, measured, for all four

- [ ] 4.1 Measure the contrast pairs for the new appearance, including its rail ring, and record them
  beside the other appearances. EVIDENCE: the numbers and the file.
- [ ] 4.2 The three existing appearances are not repainted. EVIDENCE: `git diff <freeze> -- src/index.css`
  removing nothing from their blocks, and their measured pairs matching the recorded ones.

## 5. Verify

- [ ] 5.1 All four gates green in one run. EVIDENCE: `npm run gate` exit code and the detector output.
- [ ] 5.2 Walk every scenario of this change against the running build; anything that cannot be
  demonstrated is reported, not ticked. EVIDENCE: per-scenario results.
- [ ] 5.3 Live check on the deployment: the switcher opens, previews every appearance, applies and
  persists a choice, and the new appearance is legible at 1440 and 390. EVIDENCE: the probes and their
  numbers.

## 6. Close

- [ ] 6.1 Archive the change, confirm strict validation of the merged baseline, and push. EVIDENCE:
  archive output, `validate --all --strict` totals, `git ls-remote` against local HEAD.
