# theme-system Specification

## Purpose
Controls the panel's appearance — light and dark modes, following the operating system preference until the operator chooses otherwise, remembering an explicit choice across reloads, applying the correct appearance from the first paint, and keeping content legible in both modes.
## Requirements
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

### Requirement: Appearance is a registry

An appearance SHALL be defined as a named set of the design system's semantic role tokens, and the
panel SHALL treat the set of appearances as a registry rather than as a fixed pair — the appearance
control SHALL offer every registered appearance, whatever its number, and SHALL indicate which is
active.

#### Scenario: Every registered appearance is offered

- **WHEN** the operator opens the appearance control
- **THEN** every appearance in the registry is offered, and the active one is indicated

#### Scenario: Registering an appearance is a token set alone

- **WHEN** an appearance is added to the registry with its token set
- **THEN** the panel offers and applies it without any change to a component, screen or shell file

#### Scenario: A stale stored appearance does not break the board

- **WHEN** the stored preference names an appearance that is not in the registry
- **THEN** the panel falls back to following the machine's preference and remains fully styled

### Requirement: Every appearance is composed

Each registered appearance SHALL define its own surface, ink and rule relationships. An appearance
SHALL NOT be produced by inverting another appearance's tokens, and each SHALL name the region that
owns its saturated ground.

#### Scenario: An appearance's surfaces are its own

- **WHEN** a registered appearance is active
- **THEN** its ground, panel, rail and ink relationships come from that appearance's own definition,
  not from an inversion of another appearance

#### Scenario: The committed-rail rule holds in every appearance

- **WHEN** any registered appearance is active
- **THEN** exactly one region owns a saturated ground, and it is the region that appearance's
  definition names

### Requirement: Every appearance is measured against the legibility bar

Every registered appearance SHALL keep body text, large text, and controls, icons and focus indicators
above the contrast minima, and the computed pairs for an appearance SHALL be recorded alongside its
definition so the claim is checkable rather than asserted.

#### Scenario: Contrast holds in every appearance

- **WHEN** any registered appearance is active
- **THEN** body text measures at least 4.5:1, large text at least 3:1, and controls, icons and focus
  indicators at least 3:1 against the surface they are drawn on

#### Scenario: The measurement is recorded with the appearance

- **WHEN** an appearance is added or its tokens change
- **THEN** its computed contrast pairs are recorded next to its definition, and the record is part of
  the change rather than a later recollection

