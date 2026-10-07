## Purpose

Defines the append-only record of administrative activity: how each state-changing action becomes an
event, how events are filtered and inspected field by field, and why an event can never be altered or
removed.

## ADDED Requirements

### Requirement: Event capture

The panel SHALL record every state-changing action as exactly one audit event, and each event SHALL
identify the actor, the action, the target, the timestamp and the originating IP address.

#### Scenario: A state-changing action is recorded once

- **WHEN** an operator performs a state-changing action such as creating, updating or removing a record
- **THEN** exactly one audit event is produced for that action

#### Scenario: Event carries its context

- **WHEN** the operator inspects a recorded event
- **THEN** the event shows its actor, action, target, timestamp and IP address

### Requirement: Event filtering

The panel SHALL let the operator filter the event list by actor, by action, by target and by date
range, and SHALL show an explicit "no matching events" state when a filter matches nothing.

#### Scenario: Filtering narrows the list

- **WHEN** the operator applies a filter by actor, action, target or date range
- **THEN** only the events matching every applied filter remain in the list

#### Scenario: Filter matches no events

- **WHEN** the applied filters match no events
- **THEN** the panel shows an explicit "no matching events" state instead of an empty list

#### Scenario: Clearing the filters

- **WHEN** the operator removes the applied filters
- **THEN** the full event list is shown again

### Requirement: Event detail

The panel SHALL open a detail view for a selected event that shows the field-level change, with the
value before the action and the value after it for each affected field, and SHALL clearly indicate
added, removed and changed values.

#### Scenario: Inspecting a changed field

- **WHEN** the operator opens the detail view of an event that changed fields
- **THEN** each affected field is shown with its previous value and its new value

#### Scenario: Field added or removed

- **WHEN** the event added a field that did not previously exist or removed an existing one
- **THEN** the detail view marks that field as an addition or a removal rather than a change

### Requirement: Immutability

The audit log SHALL be append-only: the panel MUST NOT offer any affordance to edit or delete an
event, and no recorded event may be modified or removed from within the panel.

#### Scenario: No edit or delete affordance

- **WHEN** the operator views the event list or an event's detail
- **THEN** no control to edit or delete an event is presented anywhere

#### Scenario: Recorded events survive navigation

- **WHEN** the operator leaves the audit log and returns, or reloads the panel
- **THEN** previously recorded events are still present and unchanged
