## ADDED Requirements

### Requirement: The semantic vocabulary is recognisable in every appearance

Every registered appearance SHALL keep the panel's semantic hues — the attention colour and the plum —
as the same colours in every appearance, and SHALL keep them distinguishable from that appearance's own
ground, panel, rail, ink and selection band. A candidate appearance whose own ground, ink, selection
band or saturated region sits in the family of a semantic hue SHALL NOT be registered, and the refusal
SHALL be recorded with the appearance's palette record.

#### Scenario: The semantic hues are the same colour in every appearance

- **WHEN** two different registered appearances are compared
- **THEN** the attention colour and the plum resolve to the same values in both

#### Scenario: The semantic fills stay distinct in every appearance

- **WHEN** any registered appearance is active and a state marker or a destructive control is shown on it
- **THEN** its fill is distinguishable from that appearance's ground, panel, rail and ink, and no colour
  of that appearance's own is drawn in a semantic hue

#### Scenario: A refused candidate is recorded

- **WHEN** a palette is considered as the seed of a new appearance and is refused for sitting in the
  family of a semantic hue
- **THEN** the refusal and its reason are recorded with the appearance's palette record, so the same
  candidate is not screened again for the same reason
