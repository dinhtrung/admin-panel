## Purpose

Defines how an operator reviews the active sessions of a user and of the whole workspace, how the
current session is distinguished from the rest, and how one or many sessions can be revoked with the
resulting effect on the list and on future use.

## ADDED Requirements

### Requirement: Session inventory

The panel SHALL list active sessions for a chosen user and for the whole workspace, and for each
session SHALL show its device or browser, approximate location, IP address, started-at and
last-seen context, and SHALL mark the session the operator is currently using.

#### Scenario: Viewing a user's sessions

- **WHEN** the operator opens the sessions for a user
- **THEN** each active session is shown with its device or browser, approximate location, IP address, started-at and last-seen context

#### Scenario: Identifying the current session

- **WHEN** the list includes the session the operator is currently using
- **THEN** that session is marked as the current session and is visually distinguishable from the others

#### Scenario: User has no active sessions

- **WHEN** the chosen user has no active sessions
- **THEN** the panel shows an explicit empty state rather than an empty list

### Requirement: Revoking a single session

The panel SHALL let the operator revoke one listed session, and SHALL require confirmation before
the revocation takes effect.

#### Scenario: Confirming a single revocation

- **WHEN** the operator requests revocation of a single session and confirms it
- **THEN** that session is revoked

#### Scenario: Cancelling a single revocation

- **WHEN** the operator requests revocation of a session but dismisses the confirmation
- **THEN** the session remains active and unchanged

### Requirement: Revoking all other sessions

The panel SHALL let the operator revoke every session other than the current one, and SHALL require
confirmation that states the number of sessions that will be revoked.

#### Scenario: Confirming a bulk revocation

- **WHEN** the operator requests revocation of all other sessions and confirms it
- **THEN** every session except the current one is revoked and the current session remains active

#### Scenario: No other sessions to revoke

- **WHEN** the current session is the only active session
- **THEN** the bulk revocation affordance is unavailable and the panel explains that there are no other sessions

### Requirement: Effect of revocation

A revoked session SHALL disappear from the list of active sessions, and any later use of a revoked
session MUST be treated as unauthenticated and require the user to authenticate again.

#### Scenario: Revoked session leaves the list

- **WHEN** a session has been revoked
- **THEN** it no longer appears in the list of active sessions

#### Scenario: Revoked session is used again

- **WHEN** a revoked session is used after its revocation
- **THEN** the request is treated as unauthenticated and the user is required to authenticate again

#### Scenario: Revoking the current session

- **WHEN** the operator revokes the session they are currently using
- **THEN** the operator's own session ends and they are required to authenticate again
