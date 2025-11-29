## ADDED Requirements

### Requirement: Damage Types
The system SHALL support multiple damage types.

#### Scenario: Damage classification
- **WHEN** resolving damage
- **THEN** damage type SHALL be Standard, Cluster, Area Effect, or Special
- **AND** damage resolution SHALL vary by type

### Requirement: Hit Location
Damage SHALL be applied to specific locations.

#### Scenario: Hit determination
- **WHEN** attack hits target
- **THEN** location SHALL be determined by hit table
- **AND** hit table SHALL vary by attack direction

### Requirement: Damage Resolution
Damage SHALL be resolved against armor then structure.

#### Scenario: Damage application
- **WHEN** applying damage to location
- **THEN** armor SHALL absorb damage first
- **AND** excess damage SHALL transfer to structure
- **AND** structure destruction SHALL destroy location

