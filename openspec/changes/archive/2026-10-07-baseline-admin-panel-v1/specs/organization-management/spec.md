## Purpose

Defines how an operator browses the directory of organizations, inspects a single organization and
its membership, manages members and their roles, and selects the organization that scopes the rest
of the admin surface.

## ADDED Requirements

### Requirement: Organization directory

The panel SHALL present a directory of organizations, each showing its name, plan, status, member
count and created date, and SHALL present an explicit empty state when no organizations exist.

#### Scenario: Listing organizations with their attributes

- **WHEN** the operator opens the organizations directory
- **THEN** each organization is shown with its name, plan, status, member count and created date and, when no organizations exist, an explanatory empty state is shown instead of an empty list

### Requirement: Organization detail

The panel SHALL show a detail view for a selected organization containing its plan, status, member
count and created date, together with the roster of its members and the role each member holds.

#### Scenario: Inspecting an organization

- **WHEN** the operator selects an organization from the directory
- **THEN** the detail view shows its plan, status, member count, created date and member roster

#### Scenario: Organization has no members

- **WHEN** the selected organization has zero members
- **THEN** the member roster shows an empty state while the organization still reports a member count of zero and lists no members

### Requirement: Member management

The panel SHALL let the operator add a member to an organization, change an existing member's role,
and remove a member, and SHALL require confirmation before a member is removed.

#### Scenario: Adding a member

- **WHEN** the operator adds a user to the organization with a chosen role
- **THEN** the member appears in the roster with that role and the member count increases by one

#### Scenario: Changing a member's role

- **WHEN** the operator changes a member's role to a different role
- **THEN** the roster shows the member with the new role and the member count is unchanged

#### Scenario: Removing a member

- **WHEN** the operator confirms the removal of a member
- **THEN** the member disappears from the roster and the member count decreases by one

### Requirement: Last owner protection

The panel SHALL prevent any action that would leave an organization without at least one member
holding the owner role, and SHALL explain why the action is unavailable.

#### Scenario: Removing the last owner

- **WHEN** the operator attempts to remove the only member holding the owner role
- **THEN** the removal does not proceed and the panel explains that an organization must retain an owner

#### Scenario: Demoting the last owner

- **WHEN** the operator attempts to change the only owner's role to a non-owner role
- **THEN** the change does not proceed and the panel explains that an organization must retain an owner

### Requirement: Current organization selection

The panel SHALL provide a selector for the current organization, SHALL apply that selection as the
scope of every other admin surface that is organization-scoped, and SHALL persist the selection
across reloads; the selector MUST be operable by keyboard and announce the active organization.

#### Scenario: Changing the current organization

- **WHEN** the operator selects a different organization as the current one
- **THEN** the organization-scoped surfaces reflect the newly selected organization

#### Scenario: Operating the selector by keyboard

- **WHEN** the operator reaches the selector using only the keyboard and changes the selection
- **THEN** the selection changes and the active organization is announced to assistive technology
