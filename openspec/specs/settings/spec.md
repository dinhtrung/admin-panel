# settings Specification

## Purpose
The settings surface is where an operator changes the workspace configuration, their own profile and preferences, the appearance of the interface, and carries out deliberate destructive operations behind explicit typed confirmation.
## Requirements
### Requirement: Workspace configuration

The settings surface SHALL allow editing the workspace name, its identifier slug and its default values, and MUST refuse a slug that is empty, malformed, or already used by another workspace.

#### Scenario: Duplicate slug
- **WHEN** the operator submits a slug that another workspace already uses
- **THEN** the save is refused and the conflict is reported next to the field

#### Scenario: Malformed slug
- **WHEN** the operator submits a slug that does not meet the accepted format
- **THEN** the save is refused with a message describing the accepted format

#### Scenario: Valid change persisted
- **WHEN** the operator submits a valid, unused slug together with a name
- **THEN** the change is saved and is still in effect after a reload

### Requirement: Personal profile and preferences

The settings surface SHALL allow editing the personal display name and the preferences for display density and default landing surface, and MUST refuse a display name that is empty or longer than the supported length.

#### Scenario: Default landing surface applied
- **WHEN** the operator saves a new default landing surface
- **THEN** the next sign-in opens on the chosen surface

#### Scenario: Invalid display name
- **WHEN** the display name is empty or exceeds the supported length
- **THEN** the save is refused with a message identifying the problem

#### Scenario: Density change
- **WHEN** the operator changes the display density and saves it
- **THEN** the interface reflects the chosen density after the reload

### Requirement: Appearance preference

The settings surface SHALL expose the appearance preference as either light, dark or follow-system, and SHALL persist the selection so the chosen appearance is restored on the next load.

#### Scenario: Explicit choice persisted
- **WHEN** the operator selects an appearance and saves it
- **THEN** that appearance is applied and is restored after a reload

#### Scenario: Following the system
- **WHEN** the operator chooses to follow the system
- **THEN** a later change to the system appearance is reflected without editing settings again

### Requirement: Save, cancel and unsaved-change protection

The settings surface SHALL provide save and cancel actions, MUST keep unsaved edits until they are saved or explicitly discarded, and MUST warn before unsaved edits are lost.

#### Scenario: Cancelling with unsaved edits
- **WHEN** there are unsaved edits and the operator cancels
- **THEN** the edits are discarded only after a confirmation

#### Scenario: Leaving with unsaved edits
- **WHEN** there are unsaved edits and the operator tries to leave the surface
- **THEN** a warning is shown and the operator may return to continue editing

#### Scenario: No edits made
- **WHEN** nothing has been edited
- **THEN** the save and cancel actions have no effect and are announced as unavailable

### Requirement: Destructive zone

The settings surface SHALL present destructive operations in a zone separated from ordinary settings, and MUST require the operator to type an exact confirmation phrase before a destructive action is carried out.

#### Scenario: Entering the destructive zone
- **WHEN** the operator opens a destructive action
- **THEN** a confirmation is shown that states the consequences and demands the typed phrase

#### Scenario: Mismatched phrase
- **WHEN** the typed phrase does not match the required phrase exactly
- **THEN** the destructive action remains unavailable

#### Scenario: Confirmation dismissed
- **WHEN** the operator dismisses the confirmation
- **THEN** nothing is destroyed and the settings remain unchanged

