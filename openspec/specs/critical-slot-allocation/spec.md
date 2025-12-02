# critical-slot-allocation Specification

## Purpose
TBD - created by archiving change implement-phase2-construction. Update Purpose after archive.
## Requirements
### Requirement: Location Slot Counts
Each location SHALL have a fixed number of critical slots.

#### Scenario: Slot definitions
- **WHEN** defining location capacity
- **THEN** Head = 6 slots
- **AND** Center Torso = 12 slots
- **AND** Side Torsos = 12 slots each
- **AND** Arms = 12 slots each
- **AND** Legs = 6 slots each
- **AND** Total = 78 slots

### Requirement: Fixed Component Placement
Structural components SHALL be placed in fixed order.

#### Scenario: Placement order
- **WHEN** allocating fixed components
- **THEN** engine SHALL be placed first in CT
- **AND** gyro SHALL follow engine
- **AND** heat sinks SHALL follow gyro

### Requirement: Distributed Slot Components
Endo Steel, Ferro-Fibrous, and similar structure/armor types SHALL distribute slots freely as individual 1-slot items.

#### Scenario: Distributed slot placement
- **WHEN** allocating Endo Steel or Ferro-Fibrous slots
- **THEN** slots MAY be placed in ANY location including Head
- **AND** slots MAY be split across multiple locations
- **AND** placement in Head SHOULD be avoided (pilot death risk on crit)

#### Scenario: Individual slot tracking
- **WHEN** Endo Steel or Ferro-Fibrous is selected
- **THEN** each required slot SHALL be a separate equipment item
- **AND** each item SHALL have unique `instanceId`
- **AND** unassigned items SHALL have `location: undefined`
- **AND** assigned items SHALL have `location` set to target location

#### Scenario: Stealth armor fixed placement
- **WHEN** Stealth armor is selected
- **THEN** 2-slot components SHALL be pre-assigned to LA, RA, LT, RT, LL, RL
- **AND** components SHALL NOT be movable to other locations
- **AND** each location SHALL receive exactly one 2-slot component

### Requirement: Actuator Requirements
Limbs SHALL have required actuator slots.

#### Scenario: Arm actuators
- **WHEN** arm has full actuators
- **THEN** shoulder = 1 slot
- **AND** upper arm = 1 slot
- **AND** lower arm = 1 slot (optional)
- **AND** hand = 1 slot (optional)

