# access-control Specification

## Purpose
Define how the admin panel derives the effective permissions of a signed-in identity, how it
withholds or gates the routes and actions that identity is not permitted to use, and how it
communicates denial, so that every reviewed screen is permission-correct and never breaks when
access is refused.
## Requirements
### Requirement: Effective permission resolution
The panel SHALL resolve the effective permissions of an identity as the union of the permission
grants of every role assigned to that identity.

#### Scenario: Identity assigned several roles
- **WHEN** an identity is assigned more than one role whose grants overlap
- **THEN** the panel offers every action permitted by any of those roles, counting each permission once

#### Scenario: Permission lost by reassignment
- **WHEN** the assignment that carried a permission is removed from an identity
- **THEN** the panel no longer offers the actions that required that permission

### Requirement: Permission-aware affordances
The panel SHALL present a control for an action only when the current identity is permitted to
perform that action, and SHALL withhold it otherwise.

#### Scenario: Action withheld
- **WHEN** the current identity is not permitted to perform an action
- **THEN** the panel presents no control that triggers that action

#### Scenario: Action offered
- **WHEN** the current identity is permitted to perform an action
- **THEN** the panel presents the control for that action where the screen expects it

### Requirement: Route gating and denied state
The panel MUST refuse access to any route whose required permission the current identity lacks,
SHALL show an explicit denied state instead of rendering the protected content, and SHALL announce
that state and offer a way back to an accessible route.

#### Scenario: Navigation refused
- **WHEN** the current identity navigates to a route whose permission it lacks
- **THEN** the panel shows the denied state and does not render the route's content

#### Scenario: Deep link refused
- **WHEN** the current identity opens a deep link to a route whose permission it lacks
- **THEN** the panel shows the denied state rather than a blank, broken or fallback screen

#### Scenario: Denied state is recoverable and announced
- **WHEN** the denied state is shown
- **THEN** it explains that access is not available, offers a control to return to an accessible route, and announces its message to assistive technology

### Requirement: Destructive action gating
For a destructive action the panel MUST require explicit confirmation before performing it, and
MUST refuse the action, with a visible refusal, when the current identity lacks the corresponding
permission.

#### Scenario: Permitted and confirmed
- **WHEN** a permitted identity confirms a destructive action
- **THEN** the panel performs the action once and reports the outcome

#### Scenario: Refused for lack of permission
- **WHEN** an identity without the corresponding permission attempts a destructive action
- **THEN** the panel does not perform it and states why it was refused

### Requirement: Identity without any role
The panel SHALL treat an identity with no role assigned as permitted to nothing except signing out,
and SHALL show the denied state on every administered surface rather than an error.

#### Scenario: No-role identity opens an administered surface
- **WHEN** an identity with no role opens any administered surface
- **THEN** the panel shows the denied state and presents no administered data

#### Scenario: No-role identity can still sign out
- **WHEN** an identity with no role is signed in
- **THEN** the panel continues to offer signing out

