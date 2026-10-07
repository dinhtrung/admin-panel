## Purpose

Controls the panel's appearance — light and dark modes, following the operating system preference until the operator chooses otherwise, remembering an explicit choice across reloads, applying the correct appearance from the first paint, and keeping content legible in both modes.

## ADDED Requirements

### Requirement: Light and dark appearance
The panel SHALL provide a light and a dark appearance, SHALL indicate which one is active, and SHALL apply a change of appearance across the whole panel without a reload.

#### Scenario: Both appearances are offered
- **WHEN** the operator opens the appearance control
- **THEN** both light and dark are offered and the active appearance is indicated

#### Scenario: Switching appearance is immediate
- **WHEN** the operator selects the other appearance
- **THEN** the whole panel updates to that appearance without a reload

### Requirement: Operating system preference by default
Until the operator makes an explicit choice, the panel SHALL follow the operating system's appearance preference, and SHALL follow it again whenever it changes.

#### Scenario: A first visit follows the system
- **WHEN** the operator has never chosen an appearance and the operating system prefers dark
- **THEN** the panel opens in the dark appearance

#### Scenario: A system change is followed live
- **WHEN** the operating system preference changes and the operator has made no explicit choice
- **THEN** the panel follows the new preference without a reload

### Requirement: An explicit choice is remembered
When the operator chooses an appearance explicitly, the panel SHALL remember that choice and SHALL apply it on later visits regardless of the operating system preference, until the choice is changed or cleared.

#### Scenario: The choice survives a reload
- **WHEN** the operator explicitly chooses an appearance and later reloads the panel
- **THEN** the panel opens in the chosen appearance regardless of the operating system preference

#### Scenario: The choice can return to the system
- **WHEN** the operator clears the explicit choice
- **THEN** the panel resumes following the operating system preference

### Requirement: Correct appearance from the first paint
The panel SHALL apply the correct appearance before the first paint of a page load, so that no frame of the wrong appearance is shown.

#### Scenario: No flash of the wrong appearance
- **WHEN** a page is loaded and the resolved appearance, from an explicit choice or the system preference, is dark
- **THEN** the page is shown in the dark appearance from its first paint with no visible light frame

#### Scenario: A deep link does not flash
- **WHEN** the operator opens a deep link directly
- **THEN** the first paint already uses the correct appearance

### Requirement: Legibility in both appearances
The panel SHALL keep text, essential controls and focus indicators legible and distinguishable in both appearances.

#### Scenario: Text and controls meet contrast
- **WHEN** any text or essential control is shown in either appearance
- **THEN** it is shown with sufficient contrast against its background to remain readable

#### Scenario: Focus remains visible
- **WHEN** a control receives keyboard focus in either appearance
- **THEN** the focus indicator remains distinguishable from the surrounding surface
