## Purpose

Defines the shared foundation every screen is assembled from: the named design tokens for color, space, type, radius and elevation, and the reusable interaction primitives — action buttons, form controls, badges, dialogs, menus, toasts and the table shell — together with their required observable states and accessibility contracts.

## ADDED Requirements

### Requirement: Shared design tokens
The panel SHALL express color, spacing, typography, radius and elevation through a single shared set of named design tokens, and comparable elements on different views SHALL use the same token so the interface stays consistent.

#### Scenario: Consistent spacing and type
- **WHEN** comparable elements are shown on different views
- **THEN** their spacing and type follow the same tokens rather than view-specific values

#### Scenario: Color tokens follow the appearance
- **WHEN** the active appearance changes
- **THEN** surfaces and text that use color tokens update together so no combination becomes unreadable

### Requirement: Action and form primitives expose required states
A button, a text input and a select SHALL each present distinguishable hover, focus-visible and disabled states, SHALL have an accessible name, and SHALL report their disabled and busy states to assistive technology.

#### Scenario: Hover and focus-visible are distinguishable
- **WHEN** the pointer hovers a control or keyboard focus moves to it
- **THEN** the control shows a state visibly different from its resting state, and the keyboard focus indicator is clearly visible

#### Scenario: A control is disabled or busy
- **WHEN** a control is disabled or its activation is in progress
- **THEN** it is presented as unavailable or busy, does not accept activation, and reports that state to assistive technology

### Requirement: Invalid input is explained and announced
When a value does not satisfy its rule, the panel SHALL mark the control invalid, SHALL associate a message describing the problem, and SHALL announce it so the error is not conveyed by colour alone.

#### Scenario: An invalid value
- **WHEN** submitted input fails its validation rule
- **THEN** the control is marked invalid and a message describing the problem is associated with the control and announced

#### Scenario: Correcting the value
- **WHEN** the value is corrected
- **THEN** the invalid state and its message are removed

### Requirement: Overlay primitives manage focus
A dialog and a menu SHALL move focus into themselves when opened, SHALL keep keyboard focus within the overlay while it is open, SHALL be dismissible by keyboard, and SHALL return focus to the control that opened them.

#### Scenario: Dialog focus and dismissal
- **WHEN** a dialog is opened and later dismissed with the keyboard
- **THEN** focus moves into the dialog on open, stays within it while it is open, and returns to the control that opened it on dismissal

#### Scenario: Menu keyboard operation
- **WHEN** a menu is open and the operator presses the arrow and escape keys
- **THEN** the arrow keys move between menu items, and escape closes the menu and returns focus to its trigger

### Requirement: Feedback and table primitives communicate state
A badge, a toast and the table shell SHALL communicate their state without relying on colour alone: a badge SHALL carry a text label, a toast SHALL be announced and dismissible, and the table shell SHALL present a labelled header with clear loading, empty and error presentations.

#### Scenario: Status is not colour alone
- **WHEN** a badge conveys a status
- **THEN** it shows a text label so the status is understandable without perceiving colour

#### Scenario: A toast is announced and dismissible
- **WHEN** a toast appears
- **THEN** it is announced to assistive technology and can be dismissed by the operator

#### Scenario: The table shell handles every outcome
- **WHEN** the table shell has data, is loading, is empty, or its request fails
- **THEN** it presents a labelled column header with the data, and distinct loading, empty and error presentations for the other outcomes
