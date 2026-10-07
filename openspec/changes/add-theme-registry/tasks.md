# Tasks — add-theme-registry

Ordered. Each line is a task and its evidence. Nothing is ticked without the evidence next to it, and
the four gates (typecheck, lint, `openspec validate --all --strict`, build + `impeccable detect`) must
be green in one run at the end.

## 1. Freeze the contract

- [ ] 1.1 Write the proposal and the `theme-system` delta, and confirm every `#### Scenario:` header
  uses four hashes. EVIDENCE: requirement and scenario counts.
- [ ] 1.2 Validate strictly and commit the planning artifacts alone, before any code. EVIDENCE:
  `openspec validate "add-theme-registry" --type change --strict` output and the commit SHA.

## 2. The registry

- [ ] 2.1 One module holds the registry: each appearance's id, its label, and how it resolves when the
  machine's preference is in play. The control, the pre-paint resolution and any future consumer read
  this list and nothing else. EVIDENCE: file path and the exported shape.
- [ ] 2.2 An unknown or stale stored id resolves to the machine's preference rather than leaving the
  board unstyled. EVIDENCE: probe with a junk stored value.

## 3. The third appearance

- [ ] 3.1 Define the appearance's token set in `src/index.css` against the same semantic role names the
  other appearances use — no new role, no new hue family, the roles remapped. EVIDENCE: the token block
  and the roles it overrides.
- [ ] 3.2 The first-paint resolution in `index.html` handles every registered appearance, so a deep
  link opens in it with no frame of another appearance. EVIDENCE: attribute read on the document
  element at load, for the third appearance and for a deep link.
- [ ] 3.3 The committed-rail rule holds: exactly one region owns a saturated ground in the new
  appearance, and it is the region the definition names. EVIDENCE: the region and its computed ground.

## 4. Legibility, measured

- [ ] 4.1 Compute the contrast pairs for every appearance — body, large text, controls, focus, and the
  state tokens drawn on each surface — and record them next to the appearance's definition. EVIDENCE:
  the numbers, and the file they are recorded in.
- [ ] 4.2 The record distinguishes what was measured from what was inherited, so a reader can see which
  appearancess were re-derived and which were not touched. EVIDENCE: the record's own structure.

## 5. Wire the control

- [ ] 5.1 The appearance control renders the registry rather than two hand-written options, keeps its
  keyboard behaviour, and applies a change without a reload. EVIDENCE: options rendered, role/aria
  state after selection.
- [ ] 5.2 The choice persists across reloads and is applied from the first paint for the third
  appearance as it already is for light and dark. EVIDENCE: reload probe — stored value, document
  attribute before the app mounts.

## 6. Regression: the existing appearances are not repainted

- [ ] 6.1 The light and dark token values are byte-identical to the frozen baseline before this change.
  EVIDENCE: `git diff <freeze-commit> -- src/index.css` restricted to those blocks, showing no change
  to their values; then the measured pairs for light and dark still matching the recorded numbers.

## 7. Verify

- [ ] 7.1 All four gates green in one run. EVIDENCE: `npm run gate` exit code and the detector output.
- [ ] 7.2 Walk the new appearance's scenarios against the running build and record which passed;
  anything that cannot be demonstrated is reported, not ticked. EVIDENCE: per-scenario results.
- [ ] 7.3 Live check on the deployment: the appearance is selectable, persists, applies on a deep link,
  and the board is legible in it at 1440 and at 390. EVIDENCE: the probes and their numbers.

## 8. Close

- [ ] 8.1 Archive the change, confirm strict validation of the merged baseline, and push. EVIDENCE:
  archive output, `validate --all --strict` totals, `git ls-remote` against local HEAD.
