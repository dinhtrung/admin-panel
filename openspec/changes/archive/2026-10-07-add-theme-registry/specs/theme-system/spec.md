## ADDED Requirements

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
