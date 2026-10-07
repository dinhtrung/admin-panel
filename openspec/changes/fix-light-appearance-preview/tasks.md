# Tasks — fix-light-appearance-preview

One selector, verified on the running build. The four gates must be green in one run at the end.

## 1. Record the defect

- [x] 1.1 Reproduce it on a build that predates this change. EVIDENCE: the deployed build (commit
  `4146b5f`) with `ember` stored — the switcher's `System` and `Light` rows both preview `#ECD5C3`,
  Ember's ground, where Light's ground is `#F0F0F0`; the other four rows preview their own
  (`#181818`, `#ABC5C9`, `#ECD5C3`). Reproduced again with `sage` stored on the current build, where the
  same two rows preview `#E6E7DC`.
- [x] 1.2 Name the cause and the fix. EVIDENCE: the light tokens are selected by `:root` alone, so a
  nested `data-theme="light"` scope has no block of its own and inherits the root element's tokens; the
  fix is to select the block with `:root, [data-theme="light"]`.

## 2. Apply it

- [ ] 2.1 Change the selector and record why the second one exists, so the next appearance does not copy
  the `:root`-only form. EVIDENCE: the diff touches the selector line and its comment and no token line.
- [ ] 2.2 Verify the preview row by row with a non-light appearance active. EVIDENCE: with `ember`
  stored, the five rows preview `#F0F0F0`, `#181818`, `#ABC5C9`, `#ECD5C3`, `#E6E7DC` respectively.
- [ ] 2.3 Verify nothing else moved. EVIDENCE: the resolved tokens of all five appearances read back
  unchanged (light ground `#F0F0F0`, rail `#181818`; dark ground `#181818`; dusk ground `#ABC5C9`; ember
  ground `#ECD5C3`; sage ground `#E6E7DC`), and a nested dark scope inside a light document still
  resolves the dark tokens.

## 3. Gates

- [ ] 3.1 The four gates green in one run. EVIDENCE: `npm run gate` → exit 0.

## 4. Ledger

- [ ] 4.1 Close the defect recorded as 5.5 of `add-sage-appearance`. EVIDENCE: that change's 5.5 can be
  ticked with a pointer to this change.
