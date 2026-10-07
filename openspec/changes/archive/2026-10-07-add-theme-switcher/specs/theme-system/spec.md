## ADDED Requirements

### Requirement: The appearance control is a switcher

The panel SHALL present every registered appearance in a single switcher that scales with the registry
rather than in a row of segments sized for a fixed number, SHALL indicate which appearance is active
within that switcher, and SHALL apply a chosen appearance without a reload.

#### Scenario: Every registered appearance is offered, whatever its number

- **WHEN** the operator opens the appearance switcher
- **THEN** every appearance in the registry is offered in one list, and the active one is indicated in
  that list

#### Scenario: The switcher follows the registry

- **WHEN** an appearance is added to the registry
- **THEN** it appears in the switcher without the control being resized or rewritten

#### Scenario: Choosing applies without a reload

- **WHEN** the operator chooses an appearance from the switcher
- **THEN** the whole panel updates to it without a reload and the choice is the one indicated

#### Scenario: The switcher is operable by keyboard

- **WHEN** the operator reaches the switcher with the keyboard, opens it, moves through the list and
  chooses an entry
- **THEN** each of those steps is possible without a pointer, and dismissing without choosing leaves
  the appearance unchanged and returns focus to the switcher

### Requirement: Each entry previews its own appearance

Every entry in the switcher SHALL show a preview drawn from that appearance's own colours, so the
choice can be made by looking at the appearance rather than by reading its name, and the preview SHALL
be that appearance's colours even when it is not the active one.

#### Scenario: A non-active appearance previews its own colours

- **WHEN** the switcher is open and an appearance other than the active one is listed
- **THEN** that entry shows that appearance's own surface and its own saturated region, not the colours
  currently applied

#### Scenario: The preview matches the appearance it names

- **WHEN** an entry's preview colours are compared with the appearance's token values
- **THEN** they are the same colours, so the preview cannot misrepresent what choosing it will do
