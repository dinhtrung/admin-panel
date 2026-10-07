# dashboard-overview Specification

## Purpose
The dashboard overview is the landing surface an operator reaches immediately after signing in; it summarises the state of the workspace through headline counts, trend context, recent activity and quick actions, all scoped to the organization that is currently selected.
## Requirements
### Requirement: Headline summary metrics

The dashboard SHALL present headline counts for users, active sessions, organizations and events within the currently selected reporting period, each accompanied by a comparison against the immediately preceding period of equal length.

#### Scenario: Metrics with a prior period
- **WHEN** the dashboard opens and the selected period and its predecessor both contain records
- **THEN** each headline count is shown together with a directional comparison to the previous period

#### Scenario: Metric without a prior baseline
- **WHEN** a headline count has no counterpart in the previous period
- **THEN** the comparison is presented as unavailable rather than as a zero, negative or unchanged value

#### Scenario: Narrow viewport
- **WHEN** the viewport is narrow
- **THEN** the headline counts remain legible without horizontal scrolling and each count stays associated with its comparison

### Requirement: Explicit no-data state

For any headline count with no records in the selected period, the dashboard SHALL show an explicit "no data for this period" state and MUST NOT present an absent value as a numeric zero.

#### Scenario: Empty period
- **WHEN** the selected period contains no events
- **THEN** the events headline shows the no-data state rather than the number zero

#### Scenario: Cold empty store
- **WHEN** the whole store is empty
- **THEN** every headline shows the no-data state and the rest of the dashboard remains operable

### Requirement: Recent activity

The dashboard SHALL list the most recent audit events newest first, and each listed entry SHALL link to the corresponding audit detail.

#### Scenario: Following an entry
- **WHEN** an operator activates a recent-activity entry
- **THEN** the audit detail for that event is opened and the entry was reachable by keyboard

#### Scenario: No recent activity
- **WHEN** there are no recent audit events
- **THEN** an empty state is shown and no activity links are offered

### Requirement: Organization scoping

The dashboard SHALL scope its headline counts and recent activity to the organization currently selected, and SHALL recompute them when that selection changes.

#### Scenario: Changing the selection
- **WHEN** the operator selects a different organization
- **THEN** the headline counts and the recent-activity list reflect only that organization

#### Scenario: No organization selected
- **WHEN** no organization is selected
- **THEN** the dashboard presents the whole-workspace view and labels it as such

### Requirement: Quick actions

The dashboard SHALL offer quick actions that begin common tasks, and each quick action SHALL be hidden or disabled with an announced reason when the operator is not permitted to perform it.

#### Scenario: Permitted action
- **WHEN** the operator has the permission a quick action requires
- **THEN** the action is available and can be operated with the keyboard

#### Scenario: Denied action
- **WHEN** the operator lacks the permission a quick action requires
- **THEN** the action is unavailable and the reason is announced to assistive technology

