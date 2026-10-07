## Purpose

Define how roles are created and maintained, how their permission grants are reviewed and changed, and what protects the workspace from an unsafe grant or the loss of the last administrative role.

## ADDED Requirements

### Requirement: Creating a custom role
The panel SHALL allow an operator to create a custom role with a name, a description and an initial set of permission grants, and MUST refuse a name that duplicates an existing role.

#### Scenario: Custom role created
- **WHEN** an operator submits a role with a unique name and a description
- **THEN** the panel lists the role as a custom role with no members and the grants the operator selected

#### Scenario: Duplicate name refused
- **WHEN** an operator submits a role whose name matches an existing role
- **THEN** the panel does not create the role and indicates that the name is already in use

#### Scenario: System and custom roles distinguished
- **WHEN** the panel lists roles
- **THEN** each role is marked as either system-defined or custom

### Requirement: Editing permission grants in a grouped matrix
The panel SHALL present a role's available permissions as a matrix grouped by area of the admin surface, SHALL stage edits before saving, and MUST support operating the matrix by keyboard alone.

#### Scenario: Grants grouped and staged
- **WHEN** an operator opens a role's grants
- **THEN** the panel groups the permissions by area and reflects each grant as a toggle whose change is not saved immediately

#### Scenario: Staged grants saved
- **WHEN** the operator confirms the staged grant changes
- **THEN** the panel persists the role's grants and reports that the role was updated

#### Scenario: Matrix operated by keyboard
- **WHEN** an operator moves through the matrix using only the keyboard
- **THEN** every grant's toggle can be reached, its state is announced, and it can be changed without a pointer

### Requirement: Blast-radius preview before saving a grant
Before saving a change to a role's grants, the panel SHALL show the blast radius of that change — how many identities hold the role and would be affected.

#### Scenario: Preview of affected members
- **WHEN** an operator changes a grant and has not yet saved
- **THEN** the panel states how many identities hold the role and would be affected

#### Scenario: Preview reflects the pending change
- **WHEN** the operator changes a different grant before saving
- **THEN** the panel updates the blast-radius preview to match the staged change

#### Scenario: Save confirms the effect
- **WHEN** the operator confirms saving the staged grants
- **THEN** the panel applies the change and reports the number of affected identities

### Requirement: Protection of system roles from deletion
The panel MUST NOT allow a system-defined role to be deleted, and SHALL delete a custom role only after explicit confirmation.

#### Scenario: System role is protected
- **WHEN** an operator views a system-defined role
- **THEN** the panel does not offer deletion and states that the role is protected

#### Scenario: Custom role deleted after confirmation
- **WHEN** an operator confirms deleting a custom role
- **THEN** the panel removes the role and reports the outcome

#### Scenario: Direct deletion of a system role refused
- **WHEN** a deletion of a system-defined role is attempted without the corresponding control
- **THEN** the panel refuses the deletion and keeps the role intact

### Requirement: Preserving the last role that grants administration
The panel MUST refuse any change that would leave no role granting administration, whether by removing the last administrative grant or by deleting the last role that holds it.

#### Scenario: Last administrative grant removal refused
- **WHEN** an operator removes the administration grant from the only role that holds it
- **THEN** the panel refuses the change and explains that at least one role must grant administration

#### Scenario: Deleting the last administrative role refused
- **WHEN** an operator attempts to delete the last remaining role that grants administration
- **THEN** the panel refuses the deletion and keeps the role

#### Scenario: Change allowed while another role grants administration
- **WHEN** at least one other role still grants administration
- **THEN** the panel allows the grant removal or deletion
