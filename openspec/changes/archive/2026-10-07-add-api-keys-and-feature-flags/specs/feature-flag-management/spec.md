## Purpose

The directory of feature flags and the lifecycle of a flag: creating one, editing its rollout and
environments, and deleting it — with creation and editing performed in a panel that slides in from the
right edge so the directory stays readable beside the record being changed, and deletion confirmed in
a dialog.

## ADDED Requirements

### Requirement: The flag directory

The panel SHALL present every feature flag with its name and key, its state, its rollout percentage,
its environments, its owner and when it last changed, and SHALL allow the directory to be searched by
name or key and narrowed by state and environment.

#### Scenario: The directory shows each flag with its state
- **WHEN** the operator opens the feature flags surface
- **THEN** each row shows the flag's name, its key, its state as a state token, its rollout
  percentage, its environments, its owner and its last change

#### Scenario: Empty and no-match states are distinct
- **WHEN** no flag exists, or the current search matches none
- **THEN** the surface says which of the two it is, and offers the action that creates a flag or the
  action that clears the filters

### Requirement: Creating and editing in a side panel

The panel SHALL create and edit a flag in a panel that enters from the right edge and occupies at
most half of the viewport width at desktop sizes, leaving the directory visible and usable beside it.

#### Scenario: The panel opens for a new flag
- **WHEN** the operator asks to create a flag
- **THEN** the panel enters from the right with empty fields, the directory remains visible beside it,
  and focus moves into the panel

#### Scenario: The panel opens prefilled for an existing flag
- **WHEN** the operator selects a flag to edit
- **THEN** the panel enters with that flag's current values and saving records only the changed fields

#### Scenario: The panel is dismissed
- **WHEN** the operator closes the panel, presses Escape, or activates the control that opened it again
- **THEN** the panel is dismissed and focus returns to the control that opened it

### Requirement: Unsaved changes are protected

The panel SHALL warn before discarding unsaved edits and SHALL keep the operator's input until they
choose to discard it or continue editing.

#### Scenario: Dismissing with unsaved edits
- **WHEN** the operator dismisses the panel after changing a field without saving
- **THEN** the panel asks whether to discard the edits, and choosing to continue editing returns to the
  panel with the input intact

#### Scenario: Saving resolves the warning
- **WHEN** the operator saves the flag
- **THEN** the panel closes without a discard prompt and the directory shows the new values

### Requirement: Flag validation

The panel SHALL require a key of lowercase words separated by single hyphens or dots, SHALL refuse a
key already in use, and SHALL require a rollout percentage that is a whole number between zero and
one hundred.

#### Scenario: An invalid key is refused
- **WHEN** the operator submits a key containing spaces, uppercase letters or a trailing separator
- **THEN** the field shows what is wrong and the flag is not saved

#### Scenario: A duplicate key is refused
- **WHEN** the operator submits a key another flag already uses
- **THEN** the panel reports the clash against the key field and keeps the entered values

#### Scenario: A rollout outside the range is refused
- **WHEN** the operator enters a rollout below zero, above one hundred or fractional
- **THEN** the field refuses the value and states the accepted range

### Requirement: Deletion is confirmed against the flag itself

The panel SHALL require a typed confirmation of the flag's key before deleting it, and SHALL record
exactly one audit event for the deletion.

#### Scenario: Deleting requires the key to be typed
- **WHEN** the operator asks to delete a flag
- **THEN** a dialog requires the flag's key to be typed before the destructive action becomes
  available, and cancelling leaves the flag untouched

#### Scenario: A deleted flag leaves the directory
- **WHEN** the deletion is confirmed
- **THEN** the flag is removed from the directory, the directory reports the new count, and one audit
  event records who deleted it
