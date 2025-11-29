# Hardpoint System Specification

**Status**: Draft
**Version**: 1.0
**Last Updated**: 2025-11-28
**Dependencies**: Core Enumerations, Critical Slot Allocation, Equipment Database, Weapon System
**Affects**: Equipment Placement, UI Components, Mech Configuration

---

## Overview

### Purpose
Defines the hardpoint system for BattleMech construction, providing pre-configured equipment mounting points that guide and optionally restrict equipment placement based on mech variant design. Hardpoints represent physical mounting infrastructure on mechs that favor certain weapon types or equipment categories.

### Scope
**In Scope:**
- Hardpoint interface definitions (IHardpoint, IHardpointDefinition, IHardpointSlot)
- Hardpoint type classifications (Energy, Ballistic, Missile, AMS, Omnimech)
- Hardpoint properties (location, type, slot limits, fixed vs flexible)
- Hardpoint assignment rules and validation
- Standard mech hardpoint behavior (fixed hardpoints restrict equipment types)
- Omnimech hardpoint behavior (flexible hardpoints allow any equipment within pod space)
- Hardpoint grouping concepts (multiple hardpoints in same location)
- Equipment-to-hardpoint matching rules
- Hardpoint capacity validation
- Optional hardpoint enforcement modes

**Out of Scope:**
- Omnimech pod space allocation (covered in Omnimech System spec if available)
- Equipment database and equipment properties (covered in Equipment Database spec)
- Critical slot allocation algorithms (covered in Critical Slot Allocation spec)
- Weapon system specifics (covered in Weapon System spec)
- Location definitions and slot counts (covered in Critical Slot Allocation spec)
- Combat effectiveness calculations (covered in Combat System spec)
- Specific mech variant hardpoint configurations (part of unit database)

### Key Concepts
- **Hardpoint**: Pre-configured mounting point on a mech variant that suggests or restricts equipment placement
- **Hardpoint Type**: Classification of what equipment category can mount to hardpoint (Energy, Ballistic, Missile, AMS, Omnimech)
- **Fixed Hardpoint**: Standard mech hardpoint that restricts equipment to matching type
- **Flexible Hardpoint**: Omnimech hardpoint that allows any equipment type within pod space limits
- **Hardpoint Group**: Collection of hardpoints in the same location (e.g., "2E+1B" = 2 Energy + 1 Ballistic)
- **Hardpoint Capacity**: Maximum critical slots available for equipment on this hardpoint
- **Equipment Type Matching**: Rules for determining if equipment can mount to hardpoint
- **Optional Enforcement**: Hardpoints can be advisory (UI convenience) or mandatory (validation enforced)

---

## Requirements

### Requirement: Hardpoint Type Classification
The system SHALL support five hardpoint types corresponding to major equipment categories.

**Rationale**: BattleTech mechs have physical mounting infrastructure that favors certain weapon types based on variant design.

**Priority**: Critical

#### Scenario: Energy hardpoint definition
**GIVEN** a mech variant with energy weapon mounting infrastructure
**WHEN** defining a hardpoint
**THEN** hardpoint type SHALL be ENERGY
**AND** hardpoint SHALL accept lasers, PPCs, and flamers
**AND** hardpoint SHALL reject ballistic and missile weapons (for standard mechs)

#### Scenario: Ballistic hardpoint definition
**GIVEN** a mech variant with ballistic weapon mounting infrastructure
**WHEN** defining a hardpoint
**THEN** hardpoint type SHALL be BALLISTIC
**AND** hardpoint SHALL accept autocannons, gauss rifles, and machine guns
**AND** hardpoint SHALL reject energy and missile weapons (for standard mechs)

#### Scenario: Missile hardpoint definition
**GIVEN** a mech variant with missile launcher mounting infrastructure
**WHEN** defining a hardpoint
**THEN** hardpoint type SHALL be MISSILE
**AND** hardpoint SHALL accept LRMs, SRMs, ATMs, and MMLs
**AND** hardpoint SHALL reject energy and ballistic weapons (for standard mechs)

#### Scenario: AMS hardpoint definition
**GIVEN** a mech variant with dedicated AMS mounting point
**WHEN** defining a hardpoint
**THEN** hardpoint type SHALL be AMS
**AND** hardpoint SHALL accept Anti-Missile Systems only
**AND** hardpoint SHALL reject all other weapon types

#### Scenario: Omnimech hardpoint definition
**GIVEN** an Omnimech variant with flexible mounting infrastructure
**WHEN** defining a hardpoint
**THEN** hardpoint type SHALL be OMNIMECH
**AND** hardpoint SHALL accept any equipment type
**AND** hardpoint SHALL be limited only by pod space and critical slots
**AND** hardpoint SHALL ignore equipment type restrictions

### Requirement: Hardpoint Location Assignment
Each hardpoint SHALL be assigned to a specific mech location.

**Rationale**: Hardpoints are physical mounting points on specific body sections.

**Priority**: Critical

#### Scenario: Hardpoint in arm location
**GIVEN** a hardpoint definition
**WHEN** location is set to Left Arm or Right Arm
**THEN** hardpoint SHALL be associated with that arm location
**AND** equipment mounted to hardpoint SHALL occupy slots in that arm
**AND** hardpoint capacity SHALL not exceed arm available slots

#### Scenario: Hardpoint in torso location
**GIVEN** a hardpoint definition
**WHEN** location is set to Center Torso, Left Torso, or Right Torso
**THEN** hardpoint SHALL be associated with that torso location
**AND** equipment mounted to hardpoint SHALL occupy slots in that torso
**AND** rear-facing equipment MAY be supported if location is torso

#### Scenario: Multiple hardpoints in same location
**GIVEN** a mech location with multiple hardpoints
**WHEN** listing location hardpoints
**THEN** all hardpoints for that location SHALL be returned
**AND** each hardpoint SHALL be independently trackable
**AND** hardpoint grouping notation MAY be used (e.g., "2E+1B")

#### Scenario: Hardpoint in invalid location
**GIVEN** a hardpoint definition
**WHEN** location is not one of the 8 standard mech locations
**THEN** hardpoint definition SHALL be invalid
**AND** error SHALL indicate invalid location

### Requirement: Hardpoint Capacity Limits
Each hardpoint SHALL specify maximum critical slots for equipment.

**Rationale**: Hardpoints have physical mounting space limits independent of location total slots.

**Priority**: High

#### Scenario: Hardpoint with slot limit
**GIVEN** a hardpoint with maxSlots = 6
**WHEN** equipment requires 3 critical slots
**THEN** equipment SHALL fit within hardpoint capacity
**AND** 3 slots remaining on hardpoint SHALL be available

#### Scenario: Equipment exceeds hardpoint capacity
**GIVEN** a hardpoint with maxSlots = 4
**WHEN** attempting to mount equipment requiring 6 critical slots
**THEN** mounting SHALL fail
**AND** error SHALL indicate hardpoint capacity exceeded
**AND** error SHALL specify capacity (4) vs required (6)

#### Scenario: Hardpoint without slot limit
**GIVEN** a hardpoint with maxSlots = undefined
**WHEN** mounting equipment
**THEN** hardpoint SHALL impose no additional slot restrictions
**AND** only location slot availability SHALL be validated
**AND** equipment MAY use any available slots in location

#### Scenario: Hardpoint tracks used slots
**GIVEN** a hardpoint with maxSlots = 10
**WHEN** equipment using 3 slots is mounted
**THEN** hardpoint usedSlots SHALL be 3
**AND** hardpoint remainingSlots SHALL be 7
**AND** additional equipment MAY be mounted up to 7 more slots

### Requirement: Fixed vs Flexible Hardpoints
Standard mechs SHALL have fixed hardpoints; Omnimechs SHALL have flexible hardpoints.

**Rationale**: Standard mechs have dedicated mounting infrastructure; Omnimechs have modular pod systems.

**Priority**: Critical

#### Scenario: Standard mech fixed hardpoint
**GIVEN** a standard (non-Omnimech) mech
**WHEN** hardpoint is defined
**THEN** hardpoint isFixed property SHALL be true
**AND** hardpoint type SHALL restrict equipment to matching category
**AND** mounting non-matching equipment SHALL fail (if enforcement enabled)

#### Scenario: Omnimech flexible hardpoint
**GIVEN** an Omnimech
**WHEN** hardpoint is defined
**THEN** hardpoint isFixed property SHALL be false
**AND** hardpoint type SHALL typically be OMNIMECH
**AND** hardpoint SHALL accept any equipment type
**AND** only pod space and slot limits SHALL apply

#### Scenario: Fixed hardpoint enforcement
**GIVEN** a fixed energy hardpoint
**WHEN** attempting to mount ballistic weapon
**THEN** mounting SHALL fail
**AND** error SHALL indicate equipment type mismatch
**AND** error SHALL specify required type (ENERGY) vs actual type (BALLISTIC)

#### Scenario: Flexible hardpoint acceptance
**GIVEN** a flexible Omnimech hardpoint
**WHEN** attempting to mount any equipment type
**THEN** mounting SHALL succeed if slot and pod space available
**AND** equipment type SHALL be ignored
**AND** only capacity limits SHALL be validated

### Requirement: Equipment Type Matching
Equipment SHALL be classified into hardpoint-compatible categories.

**Rationale**: Equipment must be categorized to determine hardpoint compatibility.

**Priority**: Critical

#### Scenario: Energy weapon matching
**GIVEN** equipment with weaponCategory = ENERGY
**WHEN** checking hardpoint compatibility
**THEN** equipment SHALL match ENERGY hardpoints
**AND** equipment SHALL match OMNIMECH hardpoints
**AND** equipment SHALL NOT match BALLISTIC, MISSILE, or AMS hardpoints

#### Scenario: Ballistic weapon matching
**GIVEN** equipment with weaponCategory = BALLISTIC
**WHEN** checking hardpoint compatibility
**THEN** equipment SHALL match BALLISTIC hardpoints
**AND** equipment SHALL match OMNIMECH hardpoints
**AND** equipment SHALL NOT match ENERGY, MISSILE, or AMS hardpoints

#### Scenario: Missile weapon matching
**GIVEN** equipment with weaponCategory = MISSILE
**WHEN** checking hardpoint compatibility
**THEN** equipment SHALL match MISSILE hardpoints
**AND** equipment SHALL match OMNIMECH hardpoints
**AND** equipment SHALL NOT match ENERGY, BALLISTIC, or AMS hardpoints

#### Scenario: AMS matching
**GIVEN** equipment with isAMS = true
**WHEN** checking hardpoint compatibility
**THEN** equipment SHALL match AMS hardpoints
**AND** equipment SHALL match OMNIMECH hardpoints
**AND** equipment SHOULD preferentially use AMS hardpoints if available

#### Scenario: Non-weapon equipment
**GIVEN** equipment that is not a weapon (heat sink, electronics, etc.)
**WHEN** checking hardpoint compatibility
**THEN** equipment SHALL NOT require hardpoint
**AND** equipment MAY be placed in any location with available slots
**AND** hardpoint validation SHALL be skipped

### Requirement: Hardpoint Grouping
Locations MAY have multiple hardpoints that are logically grouped.

**Rationale**: Mech variants often have clustered hardpoints described together (e.g., "2E+1B").

**Priority**: Medium

#### Scenario: Hardpoint group notation
**GIVEN** a location with 2 Energy and 1 Ballistic hardpoint
**WHEN** displaying hardpoint summary
**THEN** notation MAY be shown as "2E+1B"
**AND** each hardpoint SHALL be tracked independently
**AND** equipment SHALL be assigned to specific hardpoint in group

#### Scenario: Independent hardpoint tracking
**GIVEN** a location with hardpoint group "2E+1B"
**WHEN** mounting equipment
**THEN** each hardpoint SHALL track its own used/remaining slots
**AND** mounting to one hardpoint SHALL NOT affect others
**AND** all hardpoints in group SHALL be independently available

#### Scenario: Hardpoint group display
**GIVEN** multiple hardpoints in same location
**WHEN** UI displays location hardpoints
**THEN** hardpoints MAY be shown grouped by type
**AND** individual hardpoint identifiers SHALL be distinct
**AND** equipment assignment SHALL specify which hardpoint used

### Requirement: Optional Enforcement Modes
Hardpoint validation SHALL support multiple enforcement modes.

**Rationale**: Different use cases require different levels of hardpoint enforcement (strict simulation vs flexible customization).

**Priority**: Medium

#### Scenario: Strict enforcement mode
**GIVEN** hardpoint enforcement mode is STRICT
**WHEN** mounting equipment to hardpoint
**THEN** equipment type MUST match hardpoint type (for fixed hardpoints)
**AND** mounting SHALL fail with error if types don't match
**AND** user SHALL be blocked from invalid configurations

#### Scenario: Warning enforcement mode
**GIVEN** hardpoint enforcement mode is WARNING
**WHEN** mounting non-matching equipment to fixed hardpoint
**THEN** mounting SHALL succeed
**AND** validation warning SHALL be issued
**AND** user SHALL be notified of non-canon configuration

#### Scenario: Advisory enforcement mode
**GIVEN** hardpoint enforcement mode is ADVISORY
**WHEN** mounting equipment
**THEN** hardpoint matching SHALL NOT be validated
**AND** hardpoints SHALL serve as UI guidance only
**AND** no errors or warnings SHALL be issued for mismatches

#### Scenario: Enforcement mode per configuration
**GIVEN** a mech configuration
**WHEN** setting enforcement mode
**THEN** mode SHALL be configurable per-configuration
**AND** mode SHALL affect all hardpoint validations
**AND** mode change SHALL re-validate existing equipment placements

### Requirement: Hardpoint Availability Tracking
System SHALL track which hardpoints are used vs available.

**Rationale**: Users need to know which hardpoints are available for equipment placement.

**Priority**: High

#### Scenario: Unused hardpoint
**GIVEN** a hardpoint with no equipment mounted
**WHEN** checking hardpoint availability
**THEN** hardpoint SHALL be marked as available
**AND** hardpoint usedSlots SHALL be 0
**AND** hardpoint remainingSlots SHALL equal maxSlots (if defined)

#### Scenario: Partially used hardpoint
**GIVEN** a hardpoint with maxSlots = 10 and equipment using 4 slots
**WHEN** checking hardpoint availability
**THEN** hardpoint SHALL be marked as partially used
**AND** hardpoint usedSlots SHALL be 4
**AND** hardpoint remainingSlots SHALL be 6
**AND** additional equipment MAY be mounted

#### Scenario: Fully used hardpoint
**GIVEN** a hardpoint with maxSlots = 6 and equipment using 6 slots
**WHEN** checking hardpoint availability
**THEN** hardpoint SHALL be marked as fully used
**AND** hardpoint remainingSlots SHALL be 0
**AND** no additional equipment SHALL be mountable
**AND** attempting to mount SHALL fail with capacity error

#### Scenario: List available hardpoints
**GIVEN** a mech with multiple hardpoints
**WHEN** requesting available hardpoints for equipment type
**THEN** system SHALL return all hardpoints matching equipment type
**AND** hardpoints SHALL be filtered by remaining capacity
**AND** hardpoints SHALL be sorted by location and type
**AND** Omnimech hardpoints SHALL appear for all equipment types

### Requirement: Hardpoint Validation Integration
Hardpoint validation SHALL integrate with equipment placement validation.

**Rationale**: Hardpoint checks must be part of overall placement validation flow.

**Priority**: High

#### Scenario: Validate before placement
**GIVEN** equipment placement request
**WHEN** validating placement
**THEN** hardpoint compatibility SHALL be checked (if enforcement enabled)
**AND** hardpoint capacity SHALL be validated
**AND** validation errors SHALL prevent placement
**AND** validation warnings SHALL allow placement with notification

#### Scenario: Validate on configuration load
**GIVEN** a saved mech configuration with equipment
**WHEN** loading configuration
**THEN** all equipment placements SHALL be validated against hardpoints
**AND** invalid placements SHALL be flagged
**AND** user SHALL be notified of validation issues

#### Scenario: Validate on hardpoint change
**GIVEN** a mech with equipment mounted to hardpoints
**WHEN** hardpoint definitions change (variant change, etc.)
**THEN** all equipment assignments SHALL be re-validated
**AND** incompatible equipment SHALL be flagged
**AND** user SHALL be notified of affected equipment

---

## Data Model Requirements

### Required Interfaces

```typescript
/**
 * Hardpoint type classification
 */
enum HardpointType {
  /**
   * Energy weapon hardpoint (lasers, PPCs, flamers)
   */
  ENERGY = 'ENERGY',

  /**
   * Ballistic weapon hardpoint (autocannons, gauss rifles, machine guns)
   */
  BALLISTIC = 'BALLISTIC',

  /**
   * Missile weapon hardpoint (LRMs, SRMs, ATMs, MMLs)
   */
  MISSILE = 'MISSILE',

  /**
   * Anti-Missile System dedicated hardpoint
   */
  AMS = 'AMS',

  /**
   * Omnimech flexible hardpoint (accepts any equipment type)
   */
  OMNIMECH = 'OMNIMECH'
}

/**
 * Hardpoint enforcement mode
 */
enum HardpointEnforcementMode {
  /**
   * Strict enforcement - type mismatches are errors
   */
  STRICT = 'STRICT',

  /**
   * Warning mode - type mismatches are warnings
   */
  WARNING = 'WARNING',

  /**
   * Advisory only - no validation, UI guidance only
   */
  ADVISORY = 'ADVISORY'
}

/**
 * Hardpoint definition for a mech variant
 */
interface IHardpointDefinition {
  /**
   * Unique identifier for this hardpoint
   * @example "atlas-as7-d-ct-energy-1"
   */
  readonly id: string;

  /**
   * Hardpoint type classification
   */
  readonly type: HardpointType;

  /**
   * Location where hardpoint is mounted
   */
  readonly location: MechLocation;

  /**
   * Maximum critical slots available for equipment on this hardpoint
   * Undefined means no hardpoint-specific slot limit (use location limit)
   */
  readonly maxSlots?: number;

  /**
   * Whether hardpoint is fixed (standard mech) or flexible (Omnimech)
   * Fixed hardpoints enforce equipment type matching
   */
  readonly isFixed: boolean;

  /**
   * Optional hardpoint group identifier
   * Multiple hardpoints in same location can be grouped (e.g., "2E+1B")
   * @example "ra-energy-group"
   */
  readonly groupId?: string;

  /**
   * Display name for UI
   * @example "Right Arm Energy Hardpoint 1"
   */
  readonly displayName?: string;

  /**
   * Optional description or notes
   * @example "Shoulder-mounted energy weapon port"
   */
  readonly description?: string;
}

/**
 * Hardpoint slot tracking for equipment assignment
 */
interface IHardpointSlot extends IHardpointDefinition {
  /**
   * Number of critical slots currently used on this hardpoint
   */
  readonly usedSlots: number;

  /**
   * Number of critical slots remaining on this hardpoint
   * Undefined if maxSlots is undefined
   */
  readonly remainingSlots?: number;

  /**
   * Whether hardpoint has available capacity
   */
  readonly isAvailable: boolean;

  /**
   * Whether hardpoint is fully utilized
   */
  readonly isFullyUsed: boolean;

  /**
   * Equipment currently mounted to this hardpoint
   */
  readonly mountedEquipment: Array<{
    equipmentId: string;
    equipmentName: string;
    slotsUsed: number;
  }>;
}

/**
 * Hardpoint assignment for specific equipment
 */
interface IHardpointAssignment {
  /**
   * Equipment identifier
   */
  readonly equipmentId: string;

  /**
   * Hardpoint this equipment is assigned to
   */
  readonly hardpointId: string;

  /**
   * Location where equipment is placed
   */
  readonly location: MechLocation;

  /**
   * Critical slots occupied by equipment
   */
  readonly slotIndices: number[];

  /**
   * Whether assignment is valid per current enforcement mode
   */
  readonly isValid: boolean;

  /**
   * Validation errors (if any)
   */
  readonly errors?: string[];

  /**
   * Validation warnings (if any)
   */
  readonly warnings?: string[];
}

/**
 * Equipment category for hardpoint matching
 */
enum EquipmentCategory {
  ENERGY_WEAPON = 'ENERGY_WEAPON',
  BALLISTIC_WEAPON = 'BALLISTIC_WEAPON',
  MISSILE_WEAPON = 'MISSILE_WEAPON',
  AMS_WEAPON = 'AMS_WEAPON',
  PHYSICAL_WEAPON = 'PHYSICAL_WEAPON',
  HEAT_SINK = 'HEAT_SINK',
  JUMP_JET = 'JUMP_JET',
  ELECTRONICS = 'ELECTRONICS',
  AMMUNITION = 'AMMUNITION',
  OTHER = 'OTHER'
}

/**
 * Hardpoint-compatible equipment interface
 */
interface IHardpointCompatibleEquipment {
  /**
   * Equipment category for hardpoint matching
   */
  readonly equipmentCategory: EquipmentCategory;

  /**
   * Whether equipment requires a hardpoint
   * Weapons typically require hardpoints; other equipment does not
   */
  readonly requiresHardpoint: boolean;

  /**
   * Preferred hardpoint types (in priority order)
   * @example [HardpointType.AMS, HardpointType.OMNIMECH]
   */
  readonly preferredHardpointTypes?: HardpointType[];

  /**
   * Critical slots required by equipment
   */
  readonly criticalSlots: number;
}

/**
 * Hardpoint validation request
 */
interface IHardpointValidationRequest {
  /**
   * Equipment to validate
   */
  readonly equipment: IHardpointCompatibleEquipment;

  /**
   * Target hardpoint
   */
  readonly hardpoint: IHardpointSlot;

  /**
   * Enforcement mode to use
   */
  readonly enforcementMode: HardpointEnforcementMode;

  /**
   * Whether to include location slot availability check
   */
  readonly checkLocationSlots?: boolean;
}

/**
 * Hardpoint validation result
 */
interface IHardpointValidationResult {
  /**
   * Whether placement is valid
   */
  readonly isValid: boolean;

  /**
   * Whether placement can proceed (true for valid or warning mode)
   */
  readonly canProceed: boolean;

  /**
   * Critical errors preventing placement
   */
  readonly errors: string[];

  /**
   * Warnings about non-standard configuration
   */
  readonly warnings: string[];

  /**
   * Informational messages
   */
  readonly info?: string[];

  /**
   * Suggested alternative hardpoints
   */
  readonly suggestedHardpoints?: string[];
}

/**
 * Mech variant hardpoint configuration
 */
interface IMechVariantHardpoints {
  /**
   * Mech variant identifier
   * @example "Atlas AS7-D"
   */
  readonly variantId: string;

  /**
   * Whether this is an Omnimech
   */
  readonly isOmnimech: boolean;

  /**
   * All hardpoints defined for this variant
   */
  readonly hardpoints: IHardpointDefinition[];

  /**
   * Hardpoint enforcement mode for this variant
   */
  readonly enforcementMode: HardpointEnforcementMode;

  /**
   * Hardpoints grouped by location
   */
  readonly hardpointsByLocation: Record<MechLocation, IHardpointDefinition[]>;

  /**
   * Hardpoint group summaries (e.g., "2E+1B")
   */
  readonly hardpointSummary: Record<MechLocation, string>;
}
```

### Required Properties

| Property | Type | Required | Description | Valid Values | Default |
|----------|------|----------|-------------|--------------|---------|
| `id` | `string` | Yes | Unique hardpoint identifier | Any unique string | - |
| `type` | `HardpointType` | Yes | Hardpoint classification | ENERGY, BALLISTIC, MISSILE, AMS, OMNIMECH | - |
| `location` | `MechLocation` | Yes | Mech location | 8 standard locations | - |
| `isFixed` | `boolean` | Yes | Fixed vs flexible | true (standard), false (Omnimech) | true |
| `maxSlots` | `number` | No | Max slots for hardpoint | 1-12, undefined for no limit | undefined |
| `usedSlots` | `number` | Yes | Slots currently used | 0 to maxSlots | 0 |
| `equipmentCategory` | `EquipmentCategory` | Yes | Equipment type | See EquipmentCategory enum | - |
| `requiresHardpoint` | `boolean` | Yes | Whether equipment needs hardpoint | true (weapons), false (other) | false |
| `enforcementMode` | `HardpointEnforcementMode` | Yes | Validation mode | STRICT, WARNING, ADVISORY | STRICT |

### Type Constraints

- `type` MUST be one of the five HardpointType values
- `location` MUST be one of the 8 standard MechLocation values
- `maxSlots` MUST be > 0 if defined
- `usedSlots` MUST be >= 0 and <= maxSlots (if maxSlots defined)
- `isFixed` MUST be true for standard mechs, false for Omnimechs
- When `type` is OMNIMECH, `isFixed` SHOULD be false
- When `isFixed` is true, equipment type matching SHALL be enforced (if enforcement mode is STRICT)
- `equipmentCategory` MUST be defined for all equipment that requires hardpoint
- `preferredHardpointTypes` SHOULD list most specific type first (e.g., AMS before OMNIMECH)

---

## Validation Rules

### Validation: Hardpoint Type Compatibility
**Rule**: Equipment type must match hardpoint type for fixed hardpoints in STRICT mode

**Severity**: Error (STRICT mode), Warning (WARNING mode), None (ADVISORY mode)

**Condition**:
```typescript
if (enforcementMode === HardpointEnforcementMode.STRICT && hardpoint.isFixed) {
  const compatible = isEquipmentCompatibleWithHardpoint(equipment, hardpoint);
  if (!compatible) {
    return {
      isValid: false,
      errors: [`Equipment type ${equipment.equipmentCategory} does not match hardpoint type ${hardpoint.type}`]
    };
  }
}
```

**Error Message**: "Equipment type [CATEGORY] does not match hardpoint type [TYPE]"

**User Action**: Select compatible equipment for this hardpoint or choose different hardpoint

### Validation: Hardpoint Capacity
**Rule**: Equipment slots must not exceed hardpoint capacity

**Severity**: Error

**Condition**:
```typescript
if (hardpoint.maxSlots !== undefined) {
  const requiredSlots = equipment.criticalSlots;
  const availableSlots = hardpoint.maxSlots - hardpoint.usedSlots;

  if (requiredSlots > availableSlots) {
    return {
      isValid: false,
      errors: [`Hardpoint capacity exceeded. Required: ${requiredSlots}, Available: ${availableSlots}`]
    };
  }
}
```

**Error Message**: "Hardpoint capacity exceeded. Required: [N], Available: [M]"

**User Action**: Choose hardpoint with more capacity or remove existing equipment

### Validation: Hardpoint Location Match
**Rule**: Equipment must be placed in same location as hardpoint

**Severity**: Error

**Condition**:
```typescript
if (equipmentLocation !== hardpoint.location) {
  return {
    isValid: false,
    errors: [`Equipment location ${equipmentLocation} does not match hardpoint location ${hardpoint.location}`]
  };
}
```

**Error Message**: "Equipment location [LOC1] does not match hardpoint location [LOC2]"

**User Action**: Place equipment in correct location or select different hardpoint

### Validation: Weapon Hardpoint Requirement
**Rule**: Weapons should use hardpoints when available (WARNING if not)

**Severity**: Warning

**Condition**:
```typescript
if (equipment.requiresHardpoint && !assignedHardpoint) {
  const availableHardpoints = findCompatibleHardpoints(equipment, location);
  if (availableHardpoints.length > 0) {
    return {
      isValid: true,
      canProceed: true,
      warnings: [`Weapon placed without using available hardpoint. Consider using: ${availableHardpoints.map(h => h.id).join(', ')}`]
    };
  }
}
```

**Error Message**: "Weapon placed without using available hardpoint. Consider using: [LIST]"

**User Action**: Assign weapon to available hardpoint for better organization

### Validation: Omnimech Flexible Hardpoint
**Rule**: Omnimech hardpoints accept all equipment types

**Severity**: None (no errors)

**Condition**:
```typescript
if (hardpoint.type === HardpointType.OMNIMECH) {
  // Only check capacity, not equipment type
  return validateCapacityOnly(equipment, hardpoint);
}
```

**User Action**: None - Omnimech hardpoints have no type restrictions

---

## Tech Base Variants

### Inner Sphere Implementation

**Hardpoint Characteristics**:
- Fixed hardpoints are common on standard Inner Sphere mechs
- Omnimechs introduced later in timeline (Clan technology initially)
- Inner Sphere Omnimechs (post-3060) use flexible hardpoint system
- Hardpoint enforcement typically STRICT for canon Inner Sphere variants

**Special Rules**:
- Inner Sphere mechs generally have more restrictive hardpoint layouts
- Fewer hardpoints per location compared to Clan equivalents
- Hardpoint capacities reflect Inner Sphere equipment size (e.g., larger IS DHS)

### Clan Implementation

**Hardpoint Characteristics**:
- Omnimechs are standard Clan construction (flexible hardpoints)
- Clan Omnimechs have modular pod system rather than fixed hardpoints
- All Clan Omnimech hardpoints have type = OMNIMECH
- More generous hardpoint allocations reflecting superior technology

**Special Rules**:
- Clan Omnimechs use pod space limits rather than hardpoint type restrictions
- Hardpoint capacity often larger due to more compact Clan equipment
- Clan equipment (especially heat sinks) uses fewer slots, affecting hardpoint efficiency

### Mixed Tech Rules

**When unit tech base is Mixed**:
- Hardpoint definitions remain based on variant design
- Equipment tech base does not affect hardpoint compatibility
- Clan equipment may fit better in hardpoints due to smaller size
- Inner Sphere equipment may require more hardpoint slots
- Validation should check both hardpoint capacity AND location slot availability

**Example**:
- Mixed Tech mech with Energy hardpoint (maxSlots = 6)
- Clan ER PPC (3 slots) fits easily
- IS ER PPC (3 slots) also fits
- Hardpoint type (ENERGY) matters more than equipment tech base

---

## Dependencies

### Depends On
- **Core Enumerations**: Uses MechLocation type for hardpoint placement
- **Critical Slot Allocation**: Hardpoints reference location slot availability
- **Equipment Database**: Equipment must have category and slot properties
- **Weapon System**: Weapon categories determine hardpoint type matching

### Used By
- **Equipment Placement UI**: Displays available hardpoints for equipment
- **Validation System**: Validates equipment-to-hardpoint assignments
- **Mech Configuration**: Tracks hardpoint usage and availability
- **Unit Database**: Mech variants define hardpoint layouts
- **Auto-Allocation**: Suggests optimal hardpoint for equipment

### Construction Sequence
1. Load mech variant hardpoint definitions
2. Initialize hardpoint tracking structures
3. Place system components (engine, gyro, etc.) - no hardpoints needed
4. User selects equipment to mount
5. System suggests compatible hardpoints
6. User selects hardpoint (or auto-assigns)
7. Validate hardpoint compatibility and capacity
8. Allocate equipment to location slots
9. Update hardpoint usage tracking
10. Validate complete configuration

---

## Implementation Notes

### Performance Considerations
- **Hardpoint Lookup**: Index hardpoints by location for O(1) access
- **Compatibility Check**: Cache equipment category for fast matching
- **Available Hardpoints**: Pre-filter by location and type before capacity check
- **Validation**: Only re-validate affected hardpoint, not all hardpoints

### Edge Cases
- **No Hardpoints Defined**: Some mech variants may not have hardpoint data - treat as ADVISORY mode
- **Hardpoint Without maxSlots**: Unlimited capacity on hardpoint, still must fit in location
- **Multiple Weapons on One Hardpoint**: Allowed if total slots <= maxSlots
- **Omnimech Pod Space**: Hardpoint validation separate from pod space validation
- **Rear-Facing Weapons**: Hardpoints don't specify facing; that's part of placement

### Common Pitfalls
- **Pitfall**: Confusing hardpoint slots with location slots
  - **Solution**: Hardpoint maxSlots is additional restriction; location slots always apply

- **Pitfall**: Forgetting to update usedSlots after equipment removal
  - **Solution**: Recalculate hardpoint usage on any equipment change

- **Pitfall**: Enforcing hardpoints for non-weapon equipment
  - **Solution**: Check requiresHardpoint flag; only weapons need hardpoints

- **Pitfall**: Not handling enforcement mode changes
  - **Solution**: Re-validate all assignments when enforcement mode changes

- **Pitfall**: Omnimech hardpoints with isFixed = true
  - **Solution**: Omnimech hardpoints should always have isFixed = false

---

## Examples

### Example 1: Standard Mech Hardpoint Configuration

**Input**:
```typescript
const atlasAS7D: IMechVariantHardpoints = {
  variantId: 'Atlas AS7-D',
  isOmnimech: false,
  enforcementMode: HardpointEnforcementMode.STRICT,
  hardpoints: [
    {
      id: 'atlas-as7d-ra-energy-1',
      type: HardpointType.ENERGY,
      location: 'Right Arm',
      maxSlots: 6,
      isFixed: true,
      displayName: 'Right Arm Energy 1'
    },
    {
      id: 'atlas-as7d-la-missile-1',
      type: HardpointType.MISSILE,
      location: 'Left Arm',
      maxSlots: 10,
      isFixed: true,
      displayName: 'Left Arm Missile 1'
    },
    {
      id: 'atlas-as7d-rt-ballistic-1',
      type: HardpointType.BALLISTIC,
      location: 'Right Torso',
      maxSlots: 12,
      isFixed: true,
      displayName: 'Right Torso Ballistic 1'
    }
  ],
  hardpointsByLocation: {
    'Right Arm': [/* energy hardpoint */],
    'Left Arm': [/* missile hardpoint */],
    'Right Torso': [/* ballistic hardpoint */]
    // ... other locations
  },
  hardpointSummary: {
    'Right Arm': '1E',
    'Left Arm': '1M',
    'Right Torso': '1B'
    // ... other locations
  }
};
```

**Usage**:
```typescript
// User wants to mount ER Large Laser (Energy weapon, 2 slots)
const erLargeLaser: IHardpointCompatibleEquipment = {
  equipmentCategory: EquipmentCategory.ENERGY_WEAPON,
  requiresHardpoint: true,
  criticalSlots: 2,
  preferredHardpointTypes: [HardpointType.ENERGY, HardpointType.OMNIMECH]
};

// Find compatible hardpoints
const compatibleHardpoints = atlasAS7D.hardpoints.filter(h =>
  h.type === HardpointType.ENERGY || h.type === HardpointType.OMNIMECH
);
// Returns: [atlas-as7d-ra-energy-1]

// Validate assignment
const validation = validateHardpointPlacement({
  equipment: erLargeLaser,
  hardpoint: compatibleHardpoints[0],
  enforcementMode: HardpointEnforcementMode.STRICT
});
// Result: { isValid: true, canProceed: true, errors: [], warnings: [] }
```

**Output**:
```typescript
// ER Large Laser mounted successfully to Right Arm Energy hardpoint
const assignment: IHardpointAssignment = {
  equipmentId: 'er-large-laser-1',
  hardpointId: 'atlas-as7d-ra-energy-1',
  location: 'Right Arm',
  slotIndices: [4, 5], // First available slots in Right Arm
  isValid: true,
  errors: [],
  warnings: []
};

// Hardpoint updated
const updatedHardpoint: IHardpointSlot = {
  ...compatibleHardpoints[0],
  usedSlots: 2,
  remainingSlots: 4, // maxSlots (6) - usedSlots (2)
  isAvailable: true,
  isFullyUsed: false,
  mountedEquipment: [{
    equipmentId: 'er-large-laser-1',
    equipmentName: 'ER Large Laser',
    slotsUsed: 2
  }]
};
```

### Example 2: Type Mismatch Validation

**Input**:
```typescript
// Trying to mount AC/20 (ballistic) to energy hardpoint
const ac20: IHardpointCompatibleEquipment = {
  equipmentCategory: EquipmentCategory.BALLISTIC_WEAPON,
  requiresHardpoint: true,
  criticalSlots: 10,
  preferredHardpointTypes: [HardpointType.BALLISTIC, HardpointType.OMNIMECH]
};

const energyHardpoint: IHardpointSlot = {
  id: 'atlas-as7d-ra-energy-1',
  type: HardpointType.ENERGY,
  location: 'Right Arm',
  maxSlots: 6,
  isFixed: true,
  usedSlots: 0,
  remainingSlots: 6,
  isAvailable: true,
  isFullyUsed: false,
  mountedEquipment: []
};
```

**Processing**:
```typescript
// STRICT mode validation
const strictValidation = validateHardpointPlacement({
  equipment: ac20,
  hardpoint: energyHardpoint,
  enforcementMode: HardpointEnforcementMode.STRICT
});
```

**Output**:
```typescript
// STRICT mode: Error
{
  isValid: false,
  canProceed: false,
  errors: ['Equipment type BALLISTIC_WEAPON does not match hardpoint type ENERGY'],
  warnings: [],
  suggestedHardpoints: ['atlas-as7d-rt-ballistic-1']
}

// WARNING mode: Warning but allow
const warningValidation = validateHardpointPlacement({
  equipment: ac20,
  hardpoint: energyHardpoint,
  enforcementMode: HardpointEnforcementMode.WARNING
});

{
  isValid: false,
  canProceed: true, // Can proceed despite invalid
  errors: [],
  warnings: ['Equipment type BALLISTIC_WEAPON does not match hardpoint type ENERGY. This is a non-canon configuration.'],
  suggestedHardpoints: ['atlas-as7d-rt-ballistic-1']
}

// ADVISORY mode: No validation
const advisoryValidation = validateHardpointPlacement({
  equipment: ac20,
  hardpoint: energyHardpoint,
  enforcementMode: HardpointEnforcementMode.ADVISORY
});

{
  isValid: true,
  canProceed: true,
  errors: [],
  warnings: [],
  info: ['Hardpoint enforcement is advisory only']
}
```

### Example 3: Omnimech Flexible Hardpoint

**Input**:
```typescript
const timberwolfPrime: IMechVariantHardpoints = {
  variantId: 'Timber Wolf Prime',
  isOmnimech: true,
  enforcementMode: HardpointEnforcementMode.STRICT,
  hardpoints: [
    {
      id: 'timber-wolf-ra-omni-1',
      type: HardpointType.OMNIMECH,
      location: 'Right Arm',
      maxSlots: 10, // Pod space limit
      isFixed: false,
      displayName: 'Right Arm Omnipod'
    },
    {
      id: 'timber-wolf-la-omni-1',
      type: HardpointType.OMNIMECH,
      location: 'Left Arm',
      maxSlots: 10,
      isFixed: false,
      displayName: 'Left Arm Omnipod'
    }
  ],
  hardpointsByLocation: {
    'Right Arm': [/* omni hardpoint */],
    'Left Arm': [/* omni hardpoint */]
    // ... other locations
  },
  hardpointSummary: {
    'Right Arm': 'Omnipod',
    'Left Arm': 'Omnipod'
    // ... other locations
  }
};
```

**Usage**:
```typescript
// Mount various weapon types to same hardpoint type
const clanErPPC: IHardpointCompatibleEquipment = {
  equipmentCategory: EquipmentCategory.ENERGY_WEAPON,
  requiresHardpoint: true,
  criticalSlots: 2, // Clan ER PPC is 2 slots
  preferredHardpointTypes: [HardpointType.ENERGY, HardpointType.OMNIMECH]
};

const lrm20: IHardpointCompatibleEquipment = {
  equipmentCategory: EquipmentCategory.MISSILE_WEAPON,
  requiresHardpoint: true,
  criticalSlots: 5,
  preferredHardpointTypes: [HardpointType.MISSILE, HardpointType.OMNIMECH]
};

// Both validate successfully to OMNIMECH hardpoint
const omniHardpoint = timberwolfPrime.hardpoints[0];

const ppcValidation = validateHardpointPlacement({
  equipment: clanErPPC,
  hardpoint: omniHardpoint,
  enforcementMode: HardpointEnforcementMode.STRICT
});
// Result: { isValid: true, canProceed: true, errors: [], warnings: [] }

const lrmValidation = validateHardpointPlacement({
  equipment: lrm20,
  hardpoint: omniHardpoint,
  enforcementMode: HardpointEnforcementMode.STRICT
});
// Result: { isValid: true, canProceed: true, errors: [], warnings: [] }
```

**Output**:
```typescript
// Both weapons can mount to Omnimech hardpoint
// Limited only by slot capacity (2 + 5 = 7 <= 10)
const updatedOmniHardpoint: IHardpointSlot = {
  ...omniHardpoint,
  usedSlots: 7,
  remainingSlots: 3,
  isAvailable: true,
  isFullyUsed: false,
  mountedEquipment: [
    { equipmentId: 'er-ppc-1', equipmentName: 'Clan ER PPC', slotsUsed: 2 },
    { equipmentId: 'lrm20-1', equipmentName: 'LRM 20', slotsUsed: 5 }
  ]
};
```

### Example 4: Multiple Hardpoints in Same Location

**Input**:
```typescript
const madcatHardpoints: IMechVariantHardpoints = {
  variantId: 'Mad Cat Prime',
  isOmnimech: true,
  enforcementMode: HardpointEnforcementMode.STRICT,
  hardpoints: [
    {
      id: 'madcat-ra-omni-1',
      type: HardpointType.OMNIMECH,
      location: 'Right Arm',
      maxSlots: 5,
      isFixed: false,
      groupId: 'ra-omni-group',
      displayName: 'Right Arm Omnipod 1'
    },
    {
      id: 'madcat-ra-omni-2',
      type: HardpointType.OMNIMECH,
      location: 'Right Arm',
      maxSlots: 5,
      isFixed: false,
      groupId: 'ra-omni-group',
      displayName: 'Right Arm Omnipod 2'
    }
  ],
  hardpointsByLocation: {
    'Right Arm': [/* 2 omni hardpoints */]
    // ... other locations
  },
  hardpointSummary: {
    'Right Arm': '2×Omnipod'
    // ... other locations
  }
};
```

**Usage**:
```typescript
// User mounts two weapons in Right Arm
const weapon1 = { /* ER Medium Laser, 1 slot */ };
const weapon2 = { /* Ultra AC/5, 5 slots */ };

// Assign to different hardpoints in same location
const assignment1: IHardpointAssignment = {
  equipmentId: 'er-medium-1',
  hardpointId: 'madcat-ra-omni-1',
  location: 'Right Arm',
  slotIndices: [4],
  isValid: true
};

const assignment2: IHardpointAssignment = {
  equipmentId: 'uac5-1',
  hardpointId: 'madcat-ra-omni-2',
  location: 'Right Arm',
  slotIndices: [5, 6, 7, 8, 9],
  isValid: true
};
```

**Output**:
```typescript
// Two hardpoints independently track usage
const hardpoint1: IHardpointSlot = {
  id: 'madcat-ra-omni-1',
  usedSlots: 1,
  remainingSlots: 4,
  isAvailable: true,
  isFullyUsed: false,
  mountedEquipment: [{ equipmentId: 'er-medium-1', equipmentName: 'ER Medium Laser', slotsUsed: 1 }]
};

const hardpoint2: IHardpointSlot = {
  id: 'madcat-ra-omni-2',
  usedSlots: 5,
  remainingSlots: 0,
  isAvailable: false,
  isFullyUsed: true,
  mountedEquipment: [{ equipmentId: 'uac5-1', equipmentName: 'Ultra AC/5', slotsUsed: 5 }]
};

// Right Arm has 6 total slots used (1 + 5) out of 12 available
// Both hardpoints in same location work independently
```

---

## References

### Official BattleTech Rules
- **TechManual**: Pages 208-212 - Weapon and Equipment Placement
- **Total Warfare**: Page 44 - BattleMech Record Sheet Reference
- **Strategic Operations**: Pages 176-180 - Omnimech Construction Rules
- **MegaMek Source Code**: Hardpoint implementation reference
- **Sarna.net**: Mech variant hardpoint listings

### Related Documentation
- Equipment Database Specification (equipment categories and properties)
- Weapon System Specification (weapon type classification)
- Critical Slot Allocation Specification (location slots and placement)
- Omnimech System Specification (pod space and flexible mounting)

---

## Changelog

### Version 1.0 (2025-11-28)
- Initial specification
- Defined five hardpoint types (Energy, Ballistic, Missile, AMS, Omnimech)
- Specified fixed vs flexible hardpoint behavior
- Created hardpoint interfaces and tracking structures
- Defined equipment category matching rules
- Established three enforcement modes (Strict, Warning, Advisory)
- Provided validation rules for type compatibility and capacity
- Created comprehensive examples for standard mechs and Omnimechs
- Documented hardpoint grouping and multiple hardpoints per location
