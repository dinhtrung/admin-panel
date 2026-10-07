# user-management Specification

## Purpose
Define how an operator browses, searches, inspects and maintains the user directory, including the create, edit and status lifecycle and bulk changes.
## Requirements
### Requirement: Directory browsing with search and filters
The panel SHALL present the user directory and SHALL allow narrowing it by a free-text search over display name and email together with filters for status, role and organization.

#### Scenario: Search combines with filters
- **WHEN** an operator provides a search term and selects one or more status, role or organization filters
- **THEN** the panel lists only the users that match the search term and every selected filter

#### Scenario: Zero matches
- **WHEN** the combined search and filters match no user
- **THEN** the panel shows a no-results state that is distinct from the state shown when the directory contains no users at all

#### Scenario: Criteria cleared
- **WHEN** the operator clears the search term and all filters
- **THEN** the panel lists the full directory again

### Requirement: User detail view
The panel SHALL present, for a selected user, the profile (email, display name, avatar initials, status, last active, MFA flag, created date), the assigned roles, the organization memberships, and the most recent activity attributed to that user.

#### Scenario: Detail sections present
- **WHEN** an operator opens a user's detail view
- **THEN** the panel shows the user's profile, roles, memberships and recent activity

#### Scenario: Very long values stay legible
- **WHEN** a user's display name or email is far longer than the available width
- **THEN** the value does not break the layout and remains fully readable in the detail view

#### Scenario: User not found
- **WHEN** a deep link refers to a user that no longer exists
- **THEN** the panel shows a not-found state rather than an empty detail view

### Requirement: Creating and editing a user
The panel SHALL allow an operator to create a user with an email and a display name, or to edit an existing user's editable attributes, and MUST refuse to create or update a user whose email duplicates another user's.

#### Scenario: User created
- **WHEN** an operator submits a new user with a unique email and a valid display name
- **THEN** the panel creates the user in the invited state and lists it in the directory

#### Scenario: Duplicate email refused
- **WHEN** an operator submits an email that already belongs to another user
- **THEN** the panel does not create or update the user and indicates which field is in conflict

#### Scenario: User edited
- **WHEN** an operator saves a change to an editable attribute of an existing user
- **THEN** the panel reflects the new value in both the detail view and the directory

### Requirement: Status lifecycle
The panel SHALL allow an operator to suspend, deactivate and reactivate a user, MUST require explicit confirmation for each transition, and MUST refuse a transition that would deactivate or suspend the operator's own account.

#### Scenario: Suspend and reactivate
- **WHEN** an operator confirms suspending an active user, and later confirms reactivating them
- **THEN** the panel reports each new status and the directory shows the updated status

#### Scenario: Deactivating yourself refused
- **WHEN** an operator attempts to suspend or deactivate their own account
- **THEN** the panel refuses the transition and states that an operator cannot deactivate themselves

#### Scenario: Confirmation is required
- **WHEN** an operator starts a status transition but does not confirm it
- **THEN** the panel leaves the user's status unchanged

### Requirement: Bulk operations
The panel SHALL apply a bulk operation to the selected users only after explicit confirmation, and SHALL report a summary of the outcome.

#### Scenario: Bulk confirmation and summary
- **WHEN** an operator selects several users and confirms a bulk status change
- **THEN** the panel applies the change to every selected user and reports how many were affected

#### Scenario: Bulk operation with nothing selected
- **WHEN** no user is selected
- **THEN** the panel does not offer or perform the bulk operation

#### Scenario: Bulk operation excludes the operator
- **WHEN** a bulk selection includes the operator's own account in a change that would deactivate it
- **THEN** the panel leaves the operator's account unchanged and states so in the summary

