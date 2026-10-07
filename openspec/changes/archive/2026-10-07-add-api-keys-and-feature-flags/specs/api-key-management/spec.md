## Purpose

The directory of issued API keys and the lifecycle of a key: issuing one, editing what it may do,
and revoking it — with the whole write path performed in a modal dialog over the directory, and the
generated secret surfaced exactly once.

## ADDED Requirements

### Requirement: The key directory

The panel SHALL present every issued API key with its name, its scope set, its environment, its
state, when it was created and when it was last used, and SHALL allow that directory to be narrowed
by free-text search over name and by the key's state and environment.

#### Scenario: The directory shows each key with its state
- **WHEN** the operator opens the API keys surface
- **THEN** each row shows the key's name, its scope count, its environment, its state as a state
  token, its creation date and its last use, with the newest key first

#### Scenario: No keys on the board
- **WHEN** no key has been issued
- **THEN** the surface explains that no key exists yet, offers the action that issues one, and does
  not present the empty board as a failed request

#### Scenario: A filter matches nothing
- **WHEN** the operator's search or filters match no key
- **THEN** the surface distinguishes that from an empty directory and offers to clear the filters

### Requirement: Issuing a key in a dialog

The panel SHALL issue a key through a modal dialog that collects a name, at least one scope and an
environment, and SHALL refuse a name already in use, keeping the dialog open with the refusal shown
against the offending field.

#### Scenario: Issue a key with valid input
- **WHEN** the operator submits a name that is not in use together with at least one scope
- **THEN** the key is created, appears in the directory immediately, and one audit event records who
  issued it

#### Scenario: A duplicate name is refused
- **WHEN** the operator submits a name that another key already uses
- **THEN** the dialog stays open, the refusal is shown against the name field, and no key is created

#### Scenario: A key with no scope is refused
- **WHEN** the operator submits without selecting any scope
- **THEN** the dialog refuses the submission and says what a key needs

### Requirement: The secret is shown exactly once

The panel SHALL display a key's generated secret at the moment it is issued and SHALL never display
that secret again on any surface afterwards.

#### Scenario: The secret appears once at issue time
- **WHEN** a key is issued
- **THEN** the dialog shows the secret with a way to copy it and states plainly that it will not be
  shown again

#### Scenario: The secret cannot be recovered
- **WHEN** the operator opens the key for editing after the issue dialog has been closed
- **THEN** no secret is displayed anywhere, and the surface says the secret is not stored

### Requirement: Editing and revoking a key

The panel SHALL allow the name and the scope set of a key that has not been revoked to be edited
through the same dialog, and SHALL require an explicit typed confirmation before revoking a key.

#### Scenario: Editing opens prefilled
- **WHEN** the operator opens an unrevoked key for editing
- **THEN** the dialog opens with the key's current name, scopes and environment, and saving only the
  changed fields records one audit event naming them

#### Scenario: Revoking requires confirmation
- **WHEN** the operator asks to revoke a key
- **THEN** a confirmation requires the key's name to be typed before it proceeds, and cancelling
  leaves the key untouched

#### Scenario: A revoked key is inert
- **WHEN** the operator opens a key that has been revoked
- **THEN** it is shown as revoked, its fields are not editable, and no path to reactivate it is offered
