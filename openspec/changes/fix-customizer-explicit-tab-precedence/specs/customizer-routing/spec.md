## ADDED Requirements

### Requirement: Explicit Customizer Tab Precedence

The route-backed customizer SHALL distinguish an explicitly supplied valid tab from an omitted tab. Every explicit valid tab, including Structure, SHALL take precedence over the selected unit's persisted last subtab. An omitted tab SHALL retain the existing stored-subtab or default restoration behavior. Invalid tab handling and campaign routing SHALL remain compatible.

#### Scenario: Explicit Structure overrides a saved Preview tab

- **GIVEN** a persisted unit whose last subtab is Preview
- **WHEN** the user opens its explicit Structure URL and refreshes
- **THEN** Structure SHALL remain selected after store hydration
- **AND** the selected unit SHALL retain its identity and edits

#### Scenario: Omitted tab restores the saved subtab

- **GIVEN** a persisted unit whose last subtab is Preview
- **WHEN** the user opens its unit URL without a tab segment
- **THEN** the existing persisted-subtab restoration SHALL select Preview
- **AND** a unit with no valid saved subtab SHALL use the established default
