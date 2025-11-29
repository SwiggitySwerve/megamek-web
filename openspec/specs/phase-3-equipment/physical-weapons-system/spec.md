# Physical Weapons System Specification

**Status**: Draft
**Version**: 1.0
**Last Updated**: 2025-11-28
**Dependencies**: Core Entity Types, Core Enumerations, Tech Base Integration, Critical Slot Allocation, Actuator System (Phase 2)
**Affects**: Equipment Database, Validation System, Damage Calculation, Physical Attack Resolution, Unit Construction

---

## Overview

### Purpose
Defines the physical weapon equipment system for BattleMech construction, including melee weapons, punching weapons, and special physical attack enhancements. Physical weapons are removable equipment items that enhance or modify a BattleMech's physical attack capabilities, requiring specific actuator configurations and placement in arm locations.

### Scope
**In Scope:**
- Physical weapon equipment interfaces and properties
- Melee weapon types: Hatchet, Sword, Mace, Lance
- Punching weapon types: Claws, Talons
- Special physical weapons: Retractable Blade, Vibroblade, Chain Whip
- Tech base variants (Inner Sphere and Clan equivalents)
- Placement rules (arm location requirements, actuator dependencies)
- Damage calculation formulas (tonnage-based scaling)
- Usage constraints (movement requirements, attack limitations)
- Critical slot requirements and allocation
- Weight budget considerations
- Validation rules for legal physical weapon configurations

**Out of Scope:**
- Actuator system component definitions (covered in Phase 2 Actuator System spec)
- Standard physical attack rules without weapons (punch, kick, charge, DFA)
- Physical weapon ammunition (none required)
- Damage resolution and combat mechanics (covered in Combat System spec)
- Battle Value calculations (covered in BV Calculation spec)
- Infantry-scale physical weapons
- Vehicle or aerospace physical weapons

### Key Concepts
- **Physical Weapon**: Removable equipment that enhances melee combat capability, mounted in arm locations only
- **Melee Weapon**: Hand-held weapon requiring hand actuator (Hatchet, Sword, Mace, Lance)
- **Punching Weapon**: Weapon replacing hand actuator for striking attacks (Claws, Talons)
- **Retractable Blade**: Special arm-mounted weapon that can be extended or retracted
- **Tonnage-Based Damage**: Physical weapon damage scales with BattleMech tonnage
- **Actuator Dependency**: Physical weapons require specific actuator configurations to function
- **Arm-Only Placement**: Physical weapons can only be mounted in arm locations (Left Arm or Right Arm)
- **Movement Requirement**: Most physical weapons require walk or run movement to use effectively

---

## Requirements

### Requirement: Physical Weapon Base Interface
All physical weapons SHALL extend IEquipment and provide damage calculation based on BattleMech tonnage.

**Rationale**: Physical weapons are equipment items with tonnage-dependent damage, distinguishing them from energy/ballistic weapons with fixed damage values.

**Priority**: Critical

#### Scenario: Physical weapon creation
**GIVEN** a new physical weapon is being defined
**WHEN** implementing the interface
**THEN** it MUST extend IEquipment from Core Entity Types
**AND** MUST implement IPhysicalWeapon interface
**AND** MUST provide damage calculation function based on mech tonnage
**AND** MUST specify required actuators
**AND** MUST define arm-only location restriction

#### Scenario: Damage calculation
**GIVEN** a physical weapon mounted on a BattleMech
**WHEN** calculating attack damage
**THEN** damage MUST be calculated using the weapon's damage formula
**AND** formula MUST use the BattleMech's total tonnage as input
**AND** result MUST be rounded down to nearest integer
**AND** damage MUST be consistent for the same tonnage

#### Scenario: Equipment properties
**GIVEN** a physical weapon
**WHEN** querying equipment properties
**THEN** it MUST have weight in tons
**AND** MUST have criticalSlots requirement
**AND** MUST have techBase classification
**AND** MUST have rulesLevel classification
**AND** MUST have cost in C-Bills

---

### Requirement: Melee Weapon Types
The system SHALL provide four standard melee weapon types: Hatchet, Sword, Mace, and Lance.

**Rationale**: These are the canonical BattleTech melee weapons with distinct characteristics and tactical uses.

**Priority**: Critical

#### Scenario: Hatchet weapon
**GIVEN** a Hatchet physical weapon
**WHEN** defining its properties
**THEN** weight MUST be ceiling(tonnage / 15) tons
**AND** criticalSlots MUST be 1
**AND** damage formula MUST be ceiling(tonnage / 5)
**AND** MUST require hand actuator present
**AND** MUST require lower arm actuator present
**AND** location restriction MUST be arm only
**AND** techBase MUST be TechBase.INNER_SPHERE or TechBase.CLAN

#### Scenario: Sword weapon
**GIVEN** a Sword physical weapon
**WHEN** defining its properties
**THEN** weight MUST be ceiling(tonnage / 20) tons
**AND** criticalSlots MUST be 1
**AND** damage formula MUST be (tonnage / 10) + 1, rounded down
**AND** MUST require hand actuator present
**AND** MUST require lower arm actuator present
**AND** location restriction MUST be arm only
**AND** techBase MUST be TechBase.INNER_SPHERE or TechBase.CLAN

#### Scenario: Mace weapon
**GIVEN** a Mace physical weapon
**WHEN** defining its properties
**THEN** weight MUST be ceiling(tonnage / 10) tons
**AND** criticalSlots MUST be 1 + (1 per 10 tons of weight)
**AND** damage formula MUST be ceiling(tonnage / 5)
**AND** MUST require hand actuator present
**AND** MUST require lower arm actuator present
**AND** location restriction MUST be arm only
**AND** techBase MUST be TechBase.INNER_SPHERE or TechBase.CLAN

#### Scenario: Lance weapon
**GIVEN** a Lance physical weapon
**WHEN** defining its properties
**THEN** weight MUST be ceiling(tonnage / 20) tons
**AND** criticalSlots MUST be 1
**AND** damage formula MUST be (tonnage / 10), rounded down
**AND** MUST require hand actuator present
**AND** MUST require lower arm actuator present
**AND** location restriction MUST be arm only
**AND** can only be used while charging (special usage rule)
**AND** techBase MUST be TechBase.INNER_SPHERE or TechBase.CLAN

---

### Requirement: Punching Weapon Types
The system SHALL provide punching weapons (Claws, Talons) that replace the hand actuator.

**Rationale**: Punching weapons are integrated into the arm structure, replacing the hand rather than being held.

**Priority**: High

#### Scenario: Claws weapon
**GIVEN** Claws physical weapon
**WHEN** defining its properties
**THEN** weight MUST be 0.5 tons per claw
**AND** criticalSlots MUST be 1
**AND** damage formula MUST be ceiling(tonnage / 7)
**AND** MUST replace hand actuator (hand actuator removed)
**AND** MUST require lower arm actuator present
**AND** location restriction MUST be arm only
**AND** techBase MUST be TechBase.INNER_SPHERE or TechBase.CLAN

#### Scenario: Talons weapon
**GIVEN** Talons physical weapon
**WHEN** defining its properties
**THEN** weight MUST be 1 ton per talon
**AND** criticalSlots MUST be 1
**AND** damage formula MUST be ceiling(tonnage / 5)
**AND** MUST replace hand actuator (hand actuator removed)
**AND** MUST require lower arm actuator present
**AND** location restriction MUST be arm only
**AND** techBase MUST be TechBase.INNER_SPHERE or TechBase.CLAN

#### Scenario: Hand actuator replacement
**GIVEN** a punching weapon is being installed
**WHEN** validating actuator configuration
**THEN** hand actuator MUST be removed from the location
**AND** lower arm actuator MUST remain present
**AND** the punching weapon occupies the slot previously used by hand
**AND** attempting to add hand actuator SHALL fail while punching weapon present

---

### Requirement: Special Physical Weapons
The system SHALL provide special physical weapons with unique characteristics: Retractable Blade, Vibroblade, Chain Whip.

**Rationale**: Advanced physical weapons offer tactical flexibility and unique capabilities beyond standard melee weapons.

**Priority**: Medium

#### Scenario: Retractable Blade
**GIVEN** a Retractable Blade physical weapon
**WHEN** defining its properties
**THEN** weight MUST be 0.5 tons
**AND** criticalSlots MUST be 1
**AND** damage formula MUST be (tonnage / 10), rounded down
**AND** MUST replace hand actuator (hand actuator removed)
**AND** MUST require lower arm actuator present
**AND** location restriction MUST be arm only
**AND** blade can be retracted (does not hinder weapon use)
**AND** rulesLevel MUST be RulesLevel.ADVANCED
**AND** techBase MUST be TechBase.INNER_SPHERE or TechBase.CLAN

#### Scenario: Vibroblade
**GIVEN** a Vibroblade physical weapon
**WHEN** defining its properties
**THEN** weight MUST be ceiling(tonnage / 10) tons
**AND** criticalSlots MUST be 1 + ceiling(weight / 5)
**AND** damage formula MUST be (tonnage / 5), rounded down
**AND** MUST require hand actuator present
**AND** MUST require lower arm actuator present
**AND** location restriction MUST be arm only
**AND** requires power from engine (special rule)
**AND** rulesLevel MUST be RulesLevel.EXPERIMENTAL
**AND** techBase MUST be TechBase.INNER_SPHERE or TechBase.CLAN

#### Scenario: Chain Whip
**GIVEN** a Chain Whip physical weapon
**WHEN** defining its properties
**THEN** weight MUST be 3 tons
**AND** criticalSlots MUST be 3
**AND** damage formula MUST be 2D6 (special: roll-based damage)
**AND** MUST require hand actuator present
**AND** MUST require lower arm actuator present
**AND** location restriction MUST be arm only
**AND** has grapple capability (special rule)
**AND** rulesLevel MUST be RulesLevel.EXPERIMENTAL
**AND** techBase MUST be TechBase.INNER_SPHERE or TechBase.CLAN

---

### Requirement: Arm Location Restriction
Physical weapons SHALL only be placeable in arm locations (Left Arm or Right Arm).

**Rationale**: Physical weapons require arm actuators to wield and cannot be mounted in torso, leg, or head locations.

**Priority**: Critical

#### Scenario: Valid arm placement
**GIVEN** a physical weapon
**WHEN** attempting to allocate to Left Arm or Right Arm
**THEN** allocation SHALL succeed if actuator requirements met
**AND** allocation SHALL succeed if critical slots available
**AND** weapon SHALL be added to equipment inventory

#### Scenario: Invalid torso placement
**GIVEN** a physical weapon
**WHEN** attempting to allocate to Center Torso, Left Torso, or Right Torso
**THEN** allocation SHALL fail
**AND** error message SHALL be "Physical weapons can only be mounted in arm locations"
**AND** suggest Left Arm or Right Arm as valid alternatives

#### Scenario: Invalid leg placement
**GIVEN** a physical weapon
**WHEN** attempting to allocate to Left Leg or Right Leg
**THEN** allocation SHALL fail
**AND** error message SHALL be "Physical weapons can only be mounted in arm locations"

#### Scenario: Invalid head placement
**GIVEN** a physical weapon
**WHEN** attempting to allocate to Head
**THEN** allocation SHALL fail
**AND** error message SHALL be "Physical weapons can only be mounted in arm locations"

---

### Requirement: Actuator Dependencies
Physical weapons SHALL enforce actuator requirements based on weapon type.

**Rationale**: Different physical weapons require different actuator configurations to function properly.

**Priority**: Critical

#### Scenario: Hand-held weapon actuator check
**GIVEN** a hand-held melee weapon (Hatchet, Sword, Mace, Lance, Vibroblade, Chain Whip)
**WHEN** validating placement
**THEN** target arm MUST have shoulder actuator (always present)
**AND** target arm MUST have upper arm actuator (always present)
**AND** target arm MUST have lower arm actuator present
**AND** target arm MUST have hand actuator present
**AND** if any required actuator missing, allocation SHALL fail
**AND** error message SHALL specify which actuator is missing

#### Scenario: Punching weapon actuator check
**GIVEN** a punching weapon (Claws, Talons, Retractable Blade)
**WHEN** validating placement
**THEN** target arm MUST have shoulder actuator (always present)
**AND** target arm MUST have upper arm actuator (always present)
**AND** target arm MUST have lower arm actuator present
**AND** hand actuator MUST NOT be present (will be replaced)
**AND** if lower arm missing, allocation SHALL fail

#### Scenario: Installing punching weapon removes hand
**GIVEN** an arm with hand actuator present
**WHEN** installing a punching weapon
**THEN** hand actuator SHALL be automatically removed
**AND** hand actuator slot SHALL become available
**AND** punching weapon SHALL be placed in that slot
**AND** user SHALL be notified of hand actuator removal

#### Scenario: Removing punching weapon
**GIVEN** an arm with punching weapon installed
**WHEN** removing the punching weapon
**THEN** punching weapon slot SHALL become empty
**AND** user MAY add hand actuator back to that slot
**AND** hand actuator is optional (not automatically restored)

---

### Requirement: Damage Calculation Formulas
Physical weapons SHALL calculate damage based on BattleMech tonnage using defined formulas.

**Rationale**: Physical weapon effectiveness scales with mech size, unlike energy/ballistic weapons with fixed damage.

**Priority**: Critical

#### Scenario: Hatchet damage calculation
**GIVEN** a Hatchet mounted on a mech
**WHEN** calculating damage
**THEN** damage = ceiling(tonnage / 5)
**EXAMPLE**: 55-ton mech: ceiling(55 / 5) = ceiling(11) = 11 damage
**EXAMPLE**: 100-ton mech: ceiling(100 / 5) = ceiling(20) = 20 damage

#### Scenario: Sword damage calculation
**GIVEN** a Sword mounted on a mech
**WHEN** calculating damage
**THEN** damage = floor(tonnage / 10) + 1
**EXAMPLE**: 55-ton mech: floor(55 / 10) + 1 = 5 + 1 = 6 damage
**EXAMPLE**: 100-ton mech: floor(100 / 10) + 1 = 10 + 1 = 11 damage

#### Scenario: Claws damage calculation
**GIVEN** Claws mounted on a mech
**WHEN** calculating damage
**THEN** damage = ceiling(tonnage / 7)
**EXAMPLE**: 55-ton mech: ceiling(55 / 7) = ceiling(7.86) = 8 damage
**EXAMPLE**: 100-ton mech: ceiling(100 / 7) = ceiling(14.29) = 15 damage

#### Scenario: Lance damage calculation
**GIVEN** a Lance mounted on a mech
**WHEN** calculating damage during charge
**THEN** damage = floor(tonnage / 10)
**EXAMPLE**: 55-ton mech: floor(55 / 10) = 5 damage
**EXAMPLE**: 100-ton mech: floor(100 / 10) = 10 damage
**AND** Lance can only be used during charge attack (special rule)

---

### Requirement: Weight Budget Integration
Physical weapon weight SHALL be calculated based on BattleMech tonnage and count against total weight budget.

**Rationale**: Physical weapons have variable weight that scales with mech size and must fit within construction limits.

**Priority**: High

#### Scenario: Hatchet weight calculation
**GIVEN** a BattleMech with tonnage T
**WHEN** adding a Hatchet
**THEN** Hatchet weight = ceiling(T / 15) tons
**EXAMPLE**: 55-ton mech: ceiling(55 / 15) = ceiling(3.67) = 4 tons
**EXAMPLE**: 100-ton mech: ceiling(100 / 15) = ceiling(6.67) = 7 tons

#### Scenario: Sword weight calculation
**GIVEN** a BattleMech with tonnage T
**WHEN** adding a Sword
**THEN** Sword weight = ceiling(T / 20) tons
**EXAMPLE**: 55-ton mech: ceiling(55 / 20) = ceiling(2.75) = 3 tons
**EXAMPLE**: 100-ton mech: ceiling(100 / 20) = ceiling(5) = 5 tons

#### Scenario: Weight budget validation
**GIVEN** a BattleMech with remaining weight budget
**WHEN** adding a physical weapon
**THEN** physical weapon weight MUST be <= remaining weight
**AND** if weight exceeds budget, allocation SHALL fail
**AND** error message SHALL indicate insufficient weight available
**AND** error message SHALL specify weapon weight and available weight

---

### Requirement: Critical Slot Requirements
Physical weapons SHALL consume critical slots based on weapon type and mech tonnage.

**Rationale**: Larger or more complex physical weapons require more critical slot space.

**Priority**: High

#### Scenario: Single-slot weapons
**GIVEN** Hatchet, Sword, Lance, Claws, Talons, or Retractable Blade
**WHEN** calculating critical slots
**THEN** criticalSlots MUST be 1
**AND** weapon SHALL occupy exactly 1 slot in arm

#### Scenario: Mace slot calculation
**GIVEN** a Mace on a mech with tonnage T
**WHEN** calculating critical slots
**THEN** Mace weight = ceiling(T / 10) tons
**AND** criticalSlots = 1 + ceiling(Mace weight / 10)
**EXAMPLE**: 55-ton mech: weight = 6 tons, slots = 1 + ceiling(6 / 10) = 1 + 1 = 2 slots
**EXAMPLE**: 100-ton mech: weight = 10 tons, slots = 1 + ceiling(10 / 10) = 1 + 1 = 2 slots

#### Scenario: Vibroblade slot calculation
**GIVEN** a Vibroblade on a mech with tonnage T
**WHEN** calculating critical slots
**THEN** Vibroblade weight = ceiling(T / 10) tons
**AND** criticalSlots = 1 + ceiling(weight / 5)
**EXAMPLE**: 55-ton mech: weight = 6 tons, slots = 1 + ceiling(6 / 5) = 1 + 2 = 3 slots
**EXAMPLE**: 100-ton mech: weight = 10 tons, slots = 1 + ceiling(10 / 5) = 1 + 2 = 3 slots

#### Scenario: Chain Whip slots
**GIVEN** a Chain Whip
**WHEN** calculating critical slots
**THEN** criticalSlots MUST be 3 (fixed)
**AND** weight MUST be 3 tons (fixed, not tonnage-based)

---

### Requirement: Tech Base Variants
Physical weapons SHALL be available in both Inner Sphere and Clan variants with identical mechanics.

**Rationale**: Physical weapons function identically regardless of tech base, but must be classified for era availability and construction validation.

**Priority**: Medium

#### Scenario: Inner Sphere physical weapons
**GIVEN** an Inner Sphere physical weapon
**WHEN** defining its properties
**THEN** techBase MUST be TechBase.INNER_SPHERE
**AND** all damage and weight formulas SHALL apply unchanged
**AND** weapon SHALL be available to Inner Sphere and Mixed Tech units
**AND** introductionYear SHALL reflect IS availability

#### Scenario: Clan physical weapons
**GIVEN** a Clan physical weapon
**WHEN** defining its properties
**THEN** techBase MUST be TechBase.CLAN
**AND** all damage and weight formulas SHALL apply unchanged
**AND** weapon SHALL be available to Clan and Mixed Tech units
**AND** introductionYear SHALL reflect Clan availability

#### Scenario: Equivalent mechanics
**GIVEN** IS Hatchet and Clan Hatchet
**WHEN** comparing properties
**THEN** weight formulas MUST be identical
**AND** damage formulas MUST be identical
**AND** critical slot requirements MUST be identical
**AND** only techBase and availability dates SHALL differ

---

### Requirement: Usage Constraints
Physical weapons SHALL have usage constraints based on movement and attack limitations.

**Rationale**: BattleTech rules restrict when and how physical weapons can be used in combat.

**Priority**: Medium

#### Scenario: Movement requirement
**GIVEN** a physical weapon
**WHEN** determining usage constraints
**THEN** weapon SHALL require walk or run movement to attack
**AND** weapon CANNOT be used after jump movement
**AND** weapon CANNOT be used if mech did not move
**AND** this constraint applies to all physical weapons except special cases

#### Scenario: One attack per turn
**GIVEN** a BattleMech with multiple physical weapons
**WHEN** resolving physical attacks
**THEN** mech MAY make only one physical attack per turn
**AND** mech MUST choose which physical weapon to use
**AND** unused weapons provide no benefit that turn
**AND** multiple weapons in different arms do NOT allow multiple attacks

#### Scenario: Lance charge requirement
**GIVEN** a Lance physical weapon
**WHEN** determining usage
**THEN** Lance SHALL only be usable during charge attack
**AND** Lance CANNOT be used for standard melee attack
**AND** damage is added to charge damage
**AND** if mech does not charge, Lance provides no benefit

---

## Validation Rules

### Validation: Arm Location Only
**Rule**: Physical weapons must be placed in arm locations

**Severity**: Error

**Condition**:
```typescript
if (location !== MechLocation.LEFT_ARM && location !== MechLocation.RIGHT_ARM) {
  return {
    isValid: false,
    errors: ['Physical weapons can only be mounted in arm locations (Left Arm or Right Arm)']
  };
}
```

**Error Message**: "Physical weapons can only be mounted in arm locations (Left Arm or Right Arm)"

**User Action**: Select Left Arm or Right Arm as the target location

### Validation: Actuator Requirements
**Rule**: Hand-held weapons require lower arm and hand actuators; punching weapons require lower arm only

**Severity**: Error

**Condition**:
```typescript
// Hand-held weapons
if (weapon.requiresHand) {
  if (!hasLowerArmActuator(location) || !hasHandActuator(location)) {
    return {
      isValid: false,
      errors: [`${weapon.name} requires both Lower Arm Actuator and Hand Actuator in ${location}`]
    };
  }
}

// Punching weapons
if (weapon.replacesHand) {
  if (!hasLowerArmActuator(location)) {
    return {
      isValid: false,
      errors: [`${weapon.name} requires Lower Arm Actuator in ${location}`]
    };
  }
  if (hasHandActuator(location)) {
    // Will be removed automatically - warn user
    warnings.push(`Hand Actuator in ${location} will be removed when installing ${weapon.name}`);
  }
}
```

**Error Message**: "[Weapon] requires Lower Arm Actuator [and Hand Actuator] in [Location]"

**User Action**: Add required actuators to the target arm before installing weapon

### Validation: Critical Slot Availability
**Rule**: Target location must have sufficient consecutive empty slots

**Severity**: Error

**Condition**:
```typescript
const requiredSlots = calculateCriticalSlots(weapon, mechTonnage);
const availableSlots = countConsecutiveEmptySlots(location);

if (availableSlots < requiredSlots) {
  return {
    isValid: false,
    errors: [`Insufficient slots in ${location}. Required: ${requiredSlots}, Available: ${availableSlots}`]
  };
}
```

**Error Message**: "Insufficient slots in [Location]. Required: [N], Available: [M]"

**User Action**: Remove equipment from target location to free slots, or choose different location

### Validation: Weight Budget
**Rule**: Physical weapon weight must not exceed remaining weight budget

**Severity**: Error

**Condition**:
```typescript
const weaponWeight = calculateWeaponWeight(weapon, mechTonnage);
const remainingWeight = calculateRemainingWeight(mech);

if (weaponWeight > remainingWeight) {
  return {
    isValid: false,
    errors: [`Insufficient weight budget. ${weapon.name} weighs ${weaponWeight} tons, but only ${remainingWeight} tons available`]
  };
}
```

**Error Message**: "Insufficient weight budget. [Weapon] weighs [X] tons, but only [Y] tons available"

**User Action**: Remove other equipment to free weight, or choose lighter weapon

### Validation: One Weapon Per Arm
**Rule**: Each arm may contain at most one physical weapon

**Severity**: Error

**Condition**:
```typescript
if (hasPhysicalWeapon(location)) {
  return {
    isValid: false,
    errors: [`${location} already contains a physical weapon. Remove existing weapon first.`]
  };
}
```

**Error Message**: "[Location] already contains a physical weapon. Remove existing weapon first."

**User Action**: Remove existing physical weapon before adding new one

---

## Data Model Requirements

### Required Interfaces

```typescript
/**
 * Base interface for all physical weapons
 */
interface IPhysicalWeapon extends IEquipment {
  /**
   * Category of physical weapon
   */
  readonly category: PhysicalWeaponCategory;

  /**
   * Whether weapon requires hand actuator
   */
  readonly requiresHand: boolean;

  /**
   * Whether weapon replaces hand actuator
   */
  readonly replacesHand: boolean;

  /**
   * Calculate damage based on mech tonnage
   * @param mechTonnage - Total tonnage of BattleMech
   * @returns Damage value (rounded as per formula)
   */
  calculateDamage(mechTonnage: number): number;

  /**
   * Calculate weapon weight based on mech tonnage
   * @param mechTonnage - Total tonnage of BattleMech
   * @returns Weight in tons
   */
  calculateWeight(mechTonnage: number): number;

  /**
   * Calculate critical slots based on mech tonnage
   * @param mechTonnage - Total tonnage of BattleMech
   * @returns Number of critical slots required
   */
  calculateCriticalSlots(mechTonnage: number): number;

  /**
   * Usage constraints for this weapon
   */
  readonly usageConstraints: IPhysicalWeaponUsageConstraints;
}

/**
 * Physical weapon category classification
 */
enum PhysicalWeaponCategory {
  MELEE = 'Melee',
  PUNCHING = 'Punching',
  SPECIAL = 'Special'
}

/**
 * Usage constraints for physical weapons
 */
interface IPhysicalWeaponUsageConstraints {
  /**
   * Requires walk or run movement to use
   */
  readonly requiresMovement: boolean;

  /**
   * Can only be used during charge attack
   */
  readonly chargeOnly: boolean;

  /**
   * Cannot be used after jump movement
   */
  readonly noJumpAttack: boolean;

  /**
   * Special usage notes
   */
  readonly specialRules?: string;
}

/**
 * Hatchet physical weapon
 */
interface IHatchet extends IPhysicalWeapon {
  readonly category: PhysicalWeaponCategory.MELEE;
  readonly name: 'Hatchet' | 'Hatchet (IS)' | 'Hatchet (Clan)';
  readonly requiresHand: true;
  readonly replacesHand: false;
}

/**
 * Sword physical weapon
 */
interface ISword extends IPhysicalWeapon {
  readonly category: PhysicalWeaponCategory.MELEE;
  readonly name: 'Sword' | 'Sword (IS)' | 'Sword (Clan)';
  readonly requiresHand: true;
  readonly replacesHand: false;
}

/**
 * Mace physical weapon
 */
interface IMace extends IPhysicalWeapon {
  readonly category: PhysicalWeaponCategory.MELEE;
  readonly name: 'Mace' | 'Mace (IS)' | 'Mace (Clan)';
  readonly requiresHand: true;
  readonly replacesHand: false;
}

/**
 * Lance physical weapon
 */
interface ILance extends IPhysicalWeapon {
  readonly category: PhysicalWeaponCategory.MELEE;
  readonly name: 'Lance' | 'Lance (IS)' | 'Lance (Clan)';
  readonly requiresHand: true;
  readonly replacesHand: false;
  readonly usageConstraints: {
    readonly requiresMovement: true;
    readonly chargeOnly: true;
    readonly noJumpAttack: true;
  };
}

/**
 * Claws physical weapon
 */
interface IClaws extends IPhysicalWeapon {
  readonly category: PhysicalWeaponCategory.PUNCHING;
  readonly name: 'Claws' | 'Claws (IS)' | 'Claws (Clan)';
  readonly requiresHand: false;
  readonly replacesHand: true;
}

/**
 * Talons physical weapon
 */
interface ITalons extends IPhysicalWeapon {
  readonly category: PhysicalWeaponCategory.PUNCHING;
  readonly name: 'Talons' | 'Talons (IS)' | 'Talons (Clan)';
  readonly requiresHand: false;
  readonly replacesHand: true;
}

/**
 * Retractable Blade physical weapon
 */
interface IRetractableBlade extends IPhysicalWeapon {
  readonly category: PhysicalWeaponCategory.PUNCHING;
  readonly name: 'Retractable Blade' | 'Retractable Blade (IS)' | 'Retractable Blade (Clan)';
  readonly requiresHand: false;
  readonly replacesHand: true;
  readonly rulesLevel: RulesLevel.ADVANCED;
}

/**
 * Vibroblade physical weapon
 */
interface IVibroblade extends IPhysicalWeapon {
  readonly category: PhysicalWeaponCategory.SPECIAL;
  readonly name: 'Vibroblade' | 'Vibroblade (IS)' | 'Vibroblade (Clan)';
  readonly requiresHand: true;
  readonly replacesHand: false;
  readonly rulesLevel: RulesLevel.EXPERIMENTAL;
}

/**
 * Chain Whip physical weapon
 */
interface IChainWhip extends IPhysicalWeapon {
  readonly category: PhysicalWeaponCategory.SPECIAL;
  readonly name: 'Chain Whip' | 'Chain Whip (IS)' | 'Chain Whip (Clan)';
  readonly requiresHand: true;
  readonly replacesHand: false;
  readonly rulesLevel: RulesLevel.EXPERIMENTAL;
  readonly usageConstraints: {
    readonly requiresMovement: true;
    readonly chargeOnly: false;
    readonly noJumpAttack: true;
    readonly specialRules: 'Can grapple target on successful hit';
  };
}
```

### Required Properties

| Property | Type | Required | Description | Valid Values | Default |
|----------|------|----------|-------------|--------------|---------|
| `category` | `PhysicalWeaponCategory` | Yes | Weapon classification | MELEE, PUNCHING, SPECIAL | - |
| `requiresHand` | `boolean` | Yes | Requires hand actuator | true/false | - |
| `replacesHand` | `boolean` | Yes | Replaces hand actuator | true/false | - |
| `calculateDamage` | `function` | Yes | Damage formula | Function returning number | - |
| `calculateWeight` | `function` | Yes | Weight formula | Function returning number | - |
| `calculateCriticalSlots` | `function` | Yes | Slots formula | Function returning number | - |
| `usageConstraints` | `IPhysicalWeaponUsageConstraints` | Yes | Usage rules | Valid constraints object | - |

### Type Constraints

- `category` MUST be one of the PhysicalWeaponCategory enum values
- `requiresHand` and `replacesHand` MUST NOT both be true
- `calculateDamage` MUST return integer >= 0
- `calculateWeight` MUST return number >= 0
- `calculateCriticalSlots` MUST return integer >= 1
- Location restrictions MUST be `['Left Arm', 'Right Arm']` only
- When `replacesHand` is true, hand actuator MUST be removed before installation
- When `requiresHand` is true, hand actuator MUST be present in target location

---

## Calculation Formulas

### Hatchet Weight
**Formula**:
```
weight = ceiling(mechTonnage / 15)
```

**Where**:
- `mechTonnage` = Total tonnage of BattleMech
- `ceiling()` = Round up to nearest integer

**Example**:
```
Input: mechTonnage = 55 tons
Calculation: ceiling(55 / 15) = ceiling(3.67) = 4
Output: weight = 4 tons
```

**Special Cases**:
- Minimum weight: 1 ton (20-ton mech: ceiling(20 / 15) = 2 tons)
- Maximum weight: 7 tons (100-ton mech: ceiling(100 / 15) = 7 tons)

### Hatchet Damage
**Formula**:
```
damage = ceiling(mechTonnage / 5)
```

**Example**:
```
Input: mechTonnage = 55 tons
Calculation: ceiling(55 / 5) = ceiling(11) = 11
Output: damage = 11
```

### Sword Weight
**Formula**:
```
weight = ceiling(mechTonnage / 20)
```

**Example**:
```
Input: mechTonnage = 55 tons
Calculation: ceiling(55 / 20) = ceiling(2.75) = 3
Output: weight = 3 tons
```

### Sword Damage
**Formula**:
```
damage = floor(mechTonnage / 10) + 1
```

**Where**:
- `floor()` = Round down to nearest integer

**Example**:
```
Input: mechTonnage = 55 tons
Calculation: floor(55 / 10) + 1 = 5 + 1 = 6
Output: damage = 6
```

### Mace Weight
**Formula**:
```
weight = ceiling(mechTonnage / 10)
```

**Example**:
```
Input: mechTonnage = 55 tons
Calculation: ceiling(55 / 10) = ceiling(5.5) = 6
Output: weight = 6 tons
```

### Mace Damage
**Formula**:
```
damage = ceiling(mechTonnage / 5)
```

**Example**:
```
Input: mechTonnage = 55 tons
Calculation: ceiling(55 / 5) = ceiling(11) = 11
Output: damage = 11
```

### Mace Critical Slots
**Formula**:
```
criticalSlots = 1 + ceiling(weaponWeight / 10)
where weaponWeight = ceiling(mechTonnage / 10)
```

**Example**:
```
Input: mechTonnage = 55 tons
Calculation:
  weaponWeight = ceiling(55 / 10) = 6 tons
  criticalSlots = 1 + ceiling(6 / 10) = 1 + 1 = 2
Output: criticalSlots = 2
```

### Lance Weight
**Formula**:
```
weight = ceiling(mechTonnage / 20)
```

**Example**:
```
Input: mechTonnage = 55 tons
Calculation: ceiling(55 / 20) = ceiling(2.75) = 3
Output: weight = 3 tons
```

### Lance Damage
**Formula**:
```
damage = floor(mechTonnage / 10)
```

**Example**:
```
Input: mechTonnage = 55 tons
Calculation: floor(55 / 10) = 5
Output: damage = 5
```

### Claws Damage
**Formula**:
```
damage = ceiling(mechTonnage / 7)
```

**Example**:
```
Input: mechTonnage = 55 tons
Calculation: ceiling(55 / 7) = ceiling(7.86) = 8
Output: damage = 8
```

### Talons Damage
**Formula**:
```
damage = ceiling(mechTonnage / 5)
```

**Example**:
```
Input: mechTonnage = 55 tons
Calculation: ceiling(55 / 5) = ceiling(11) = 11
Output: damage = 11
```

### Retractable Blade Damage
**Formula**:
```
damage = floor(mechTonnage / 10)
```

**Example**:
```
Input: mechTonnage = 55 tons
Calculation: floor(55 / 10) = 5
Output: damage = 5
```

### Vibroblade Weight
**Formula**:
```
weight = ceiling(mechTonnage / 10)
```

**Example**:
```
Input: mechTonnage = 55 tons
Calculation: ceiling(55 / 10) = ceiling(5.5) = 6
Output: weight = 6 tons
```

### Vibroblade Damage
**Formula**:
```
damage = floor(mechTonnage / 5)
```

**Example**:
```
Input: mechTonnage = 55 tons
Calculation: floor(55 / 5) = 11
Output: damage = 11
```

### Vibroblade Critical Slots
**Formula**:
```
criticalSlots = 1 + ceiling(weaponWeight / 5)
where weaponWeight = ceiling(mechTonnage / 10)
```

**Example**:
```
Input: mechTonnage = 55 tons
Calculation:
  weaponWeight = ceiling(55 / 10) = 6 tons
  criticalSlots = 1 + ceiling(6 / 5) = 1 + 2 = 3
Output: criticalSlots = 3
```

---

## Tech Base Variants

### Inner Sphere Implementation

**Differences from base specification**:
- `techBase`: TechBase.INNER_SPHERE
- Introduction years reflect Inner Sphere availability timeline

**Physical Weapon Availability**:
- Hatchet: 2463 (Age of War)
- Sword: 2470 (Age of War)
- Mace: 2465 (Age of War)
- Lance: 2470 (Age of War)
- Claws: 2470 (Age of War)
- Talons: 2475 (Age of War)
- Retractable Blade: 3060 (Civil War)
- Vibroblade: 3068 (Jihad) - Experimental
- Chain Whip: 3068 (Jihad) - Experimental

**Example**:
```typescript
const hatchetIS: IHatchet = {
  id: 'hatchet-is',
  name: 'Hatchet (IS)',
  category: PhysicalWeaponCategory.MELEE,
  techBase: TechBase.INNER_SPHERE,
  rulesLevel: RulesLevel.STANDARD,
  requiresHand: true,
  replacesHand: false,
  calculateDamage: (tonnage) => Math.ceil(tonnage / 5),
  calculateWeight: (tonnage) => Math.ceil(tonnage / 15),
  calculateCriticalSlots: () => 1,
  introductionYear: 2463,
  era: Era.AGE_OF_WAR,
  cost: 5000,
  battleValue: 0, // BV included in melee attack calculation
  allowedLocations: [MechLocation.LEFT_ARM, MechLocation.RIGHT_ARM],
  usageConstraints: {
    requiresMovement: true,
    chargeOnly: false,
    noJumpAttack: true
  }
};
```

### Clan Implementation

**Differences from base specification**:
- `techBase`: TechBase.CLAN
- Introduction years reflect Clan availability timeline

**Physical Weapon Availability**:
- All standard physical weapons: 2823 (Early Succession Wars - Clan development era)
- Retractable Blade: 3060 (Civil War)
- Vibroblade: 3068 (Jihad) - Experimental
- Chain Whip: 3068 (Jihad) - Experimental

**Special Rules**:
- Clan physical weapons function identically to IS versions
- Clan warriors historically disdain physical weapons (cultural, not mechanical limitation)
- Clan mechs typically do not mount physical weapons except in special circumstances

**Example**:
```typescript
const hatchetClan: IHatchet = {
  id: 'hatchet-clan',
  name: 'Hatchet (Clan)',
  category: PhysicalWeaponCategory.MELEE,
  techBase: TechBase.CLAN,
  rulesLevel: RulesLevel.STANDARD,
  requiresHand: true,
  replacesHand: false,
  calculateDamage: (tonnage) => Math.ceil(tonnage / 5),
  calculateWeight: (tonnage) => Math.ceil(tonnage / 15),
  calculateCriticalSlots: () => 1,
  introductionYear: 2823,
  era: Era.EARLY_SUCCESSION_WARS,
  cost: 5000,
  battleValue: 0,
  allowedLocations: [MechLocation.LEFT_ARM, MechLocation.RIGHT_ARM],
  usageConstraints: {
    requiresMovement: true,
    chargeOnly: false,
    noJumpAttack: true
  }
};
```

### Mixed Tech Rules

**When unit tech base is Mixed**:
- Physical weapons are equipment (not system components), so unit tech base does NOT restrict availability
- Physical weapon availability determined by year/era only
- Both IS and Clan variants available in equipment database
- User may select either IS or Clan variant regardless of other components
- Physical weapon tech base does not affect unit tech rating (equipment exemption)
- Tournament legality unaffected by physical weapon tech base choice

**Example**:
```typescript
// Mixed Tech unit can use either IS or Clan Hatchet
const mixedTechMech: IBattleMech = {
  unitTechBase: UnitTechBase.MIXED,
  structure: { techBase: TechBase.INNER_SPHERE }, // IS Endo Steel
  engine: { techBase: TechBase.CLAN },            // Clan XL
  // ... other system components
  equipment: [
    hatchetIS,        // IS Hatchet in left arm - valid
    hatchetClan       // Clan Hatchet in right arm - also valid
  ]
};
```

---

## Dependencies

### Depends On
- **Core Entity Types** (Phase 1): Uses IEquipment, IEntity, IWeightedComponent, ISlottedComponent, IPlaceableComponent
- **Core Enumerations** (Phase 1): Uses TechBase, RulesLevel, Era enums
- **Tech Base Integration** (Phase 2): Uses tech base classification and Mixed Tech rules
- **Critical Slot Allocation** (Phase 2): Uses MechLocation type, slot allocation algorithms, location restrictions
- **Actuator System** (Phase 2): Depends on actuator presence/absence for weapon installation validation

### Used By
- **Equipment Database**: Physical weapons included in equipment catalog
- **Validation System**: Validates physical weapon placement, actuator requirements, weight budget
- **Damage Calculation**: Uses physical weapon damage formulas during combat resolution
- **Physical Attack Resolution**: Determines attack success, damage application, special effects
- **Construction Rules Core**: Validates complete mech configuration including physical weapons
- **UI Equipment Selection**: Displays available physical weapons with calculated properties

### Construction Sequence
1. Define BattleMech tonnage (determines weapon weight/damage)
2. Configure arm actuators (shoulder, upper arm always present; lower arm and hand optional)
3. Allocate critical slots for system components (engine, gyro, etc.)
4. Calculate remaining weight budget
5. Select physical weapon type
6. Validate actuator requirements for selected weapon
7. Calculate weapon weight and slots based on mech tonnage
8. Validate weight budget and slot availability
9. Install weapon (remove hand actuator if punching weapon)
10. Update equipment inventory and slot allocation

---

## Implementation Notes

### Performance Considerations
- **Damage Calculation**: Cache calculated damage values for given tonnage to avoid repeated formula execution
- **Weight Calculation**: Pre-calculate weapon weight during mech initialization, not on every query
- **Slot Calculation**: Store calculated slot count with weapon instance to avoid recalculation
- **Validation**: Run actuator validation only when arm configuration changes, not continuously

### Edge Cases
- **20-ton mech**: Minimum tonnage; verify all formulas produce valid results (e.g., Hatchet weight = ceiling(20 / 15) = 2 tons)
- **100-ton mech**: Maximum tonnage; verify formulas cap appropriately
- **Arm without hand**: Cannot install hand-held weapons, only punching weapons
- **Arm without lower arm**: Cannot install any physical weapons
- **Removing punching weapon**: Hand actuator slot becomes available but hand not automatically restored
- **Multiple physical weapons**: Mech may have weapons in both arms, but only one usable per turn
- **Chain Whip damage**: Uses 2D6 roll-based damage instead of fixed formula (special handling required)

### Common Pitfalls
- **Pitfall**: Forgetting to check actuator requirements before allowing weapon installation
  - **Solution**: Always validate actuator presence as first step in allocation validation

- **Pitfall**: Not removing hand actuator when installing punching weapon
  - **Solution**: Automatically remove hand actuator as part of punching weapon installation process

- **Pitfall**: Calculating weapon properties without mech tonnage context
  - **Solution**: Always pass mech tonnage to calculation functions; never use static values

- **Pitfall**: Allowing physical weapons in non-arm locations
  - **Solution**: Enforce location restriction in equipment definition and allocation validation

- **Pitfall**: Using incorrect rounding in formulas (ceiling vs floor)
  - **Solution**: Follow specification exactly; Hatchet uses ceiling, Sword uses floor for damage

- **Pitfall**: Not validating weight budget after calculating tonnage-based weapon weight
  - **Solution**: Calculate weapon weight first, then validate against remaining budget

---

## Examples

### Example 1: Hatchet on 55-ton Mech

**Input**:
```typescript
const mech: IBattleMech = {
  tonnage: 55,
  leftArm: {
    actuators: {
      shoulder: true,
      upperArm: true,
      lowerArm: true,
      hand: true
    }
  },
  remainingWeight: 8.5
};

const hatchet: IHatchet = {
  id: 'hatchet-is',
  name: 'Hatchet (IS)',
  category: PhysicalWeaponCategory.MELEE,
  techBase: TechBase.INNER_SPHERE,
  requiresHand: true,
  replacesHand: false
};
```

**Processing**:
```typescript
// Calculate weapon properties
const weight = Math.ceil(55 / 15);        // ceiling(3.67) = 4 tons
const damage = Math.ceil(55 / 5);         // ceiling(11) = 11
const slots = 1;

// Validate actuators
const hasLowerArm = mech.leftArm.actuators.lowerArm;  // true
const hasHand = mech.leftArm.actuators.hand;          // true
// Validation passes

// Validate weight budget
const fitsInBudget = weight <= mech.remainingWeight;  // 4 <= 8.5, true

// Allocate to left arm
allocateEquipment({
  equipment: { ...hatchet, weight: 4, criticalSlots: 1, damage: 11 },
  location: MechLocation.LEFT_ARM
});
```

**Output**:
```typescript
// Hatchet successfully installed
{
  success: true,
  weapon: {
    name: 'Hatchet (IS)',
    weight: 4,
    criticalSlots: 1,
    damage: 11,
    location: MechLocation.LEFT_ARM
  },
  remainingWeight: 4.5  // 8.5 - 4
}
```

### Example 2: Claws on 100-ton Mech

**Input**:
```typescript
const mech: IBattleMech = {
  tonnage: 100,
  rightArm: {
    actuators: {
      shoulder: true,
      upperArm: true,
      lowerArm: true,
      hand: true  // Will be removed
    }
  },
  remainingWeight: 2.0
};

const claws: IClaws = {
  id: 'claws-is',
  name: 'Claws (IS)',
  category: PhysicalWeaponCategory.PUNCHING,
  techBase: TechBase.INNER_SPHERE,
  requiresHand: false,
  replacesHand: true
};
```

**Processing**:
```typescript
// Calculate weapon properties
const weight = 0.5;  // Fixed weight per claw
const damage = Math.ceil(100 / 7);  // ceiling(14.29) = 15
const slots = 1;

// Validate actuators
const hasLowerArm = mech.rightArm.actuators.lowerArm;  // true
// Punching weapon doesn't require hand actuator

// Validate weight budget
const fitsInBudget = weight <= mech.remainingWeight;  // 0.5 <= 2.0, true

// Remove hand actuator
removeHandActuator(MechLocation.RIGHT_ARM);

// Allocate claws to right arm
allocateEquipment({
  equipment: { ...claws, weight: 0.5, criticalSlots: 1, damage: 15 },
  location: MechLocation.RIGHT_ARM
});
```

**Output**:
```typescript
// Claws successfully installed, hand actuator removed
{
  success: true,
  weapon: {
    name: 'Claws (IS)',
    weight: 0.5,
    criticalSlots: 1,
    damage: 15,
    location: MechLocation.RIGHT_ARM
  },
  removedActuator: 'Hand Actuator',
  remainingWeight: 1.5  // 2.0 - 0.5
}
```

### Example 3: Mace on 75-ton Mech

**Input**:
```typescript
const mech: IBattleMech = {
  tonnage: 75,
  leftArm: {
    actuators: {
      shoulder: true,
      upperArm: true,
      lowerArm: true,
      hand: true
    },
    availableSlots: 8  // Slots 4-11 available
  },
  remainingWeight: 10
};

const mace: IMace = {
  id: 'mace-is',
  name: 'Mace (IS)',
  category: PhysicalWeaponCategory.MELEE,
  techBase: TechBase.INNER_SPHERE,
  requiresHand: true,
  replacesHand: false
};
```

**Processing**:
```typescript
// Calculate weapon properties
const weight = Math.ceil(75 / 10);              // ceiling(7.5) = 8 tons
const damage = Math.ceil(75 / 5);               // ceiling(15) = 15
const slots = 1 + Math.ceil(weight / 10);       // 1 + ceiling(8 / 10) = 1 + 1 = 2

// Validate actuators
const hasLowerArm = mech.leftArm.actuators.lowerArm;  // true
const hasHand = mech.leftArm.actuators.hand;          // true
// Validation passes

// Validate weight budget
const fitsInBudget = weight <= mech.remainingWeight;  // 8 <= 10, true

// Validate slot availability
const fitsInSlots = slots <= mech.leftArm.availableSlots;  // 2 <= 8, true

// Allocate to left arm
allocateEquipment({
  equipment: { ...mace, weight: 8, criticalSlots: 2, damage: 15 },
  location: MechLocation.LEFT_ARM
});
```

**Output**:
```typescript
// Mace successfully installed
{
  success: true,
  weapon: {
    name: 'Mace (IS)',
    weight: 8,
    criticalSlots: 2,
    damage: 15,
    location: MechLocation.LEFT_ARM,
    occupiedSlots: [4, 5]
  },
  remainingWeight: 2,        // 10 - 8
  remainingSlots: 6          // 8 - 2
}
```

### Example 4: Failed Installation - No Hand Actuator

**Input**:
```typescript
const mech: IBattleMech = {
  tonnage: 60,
  rightArm: {
    actuators: {
      shoulder: true,
      upperArm: true,
      lowerArm: true,
      hand: false  // Hand removed to mount PPC
    }
  }
};

const sword: ISword = {
  id: 'sword-is',
  name: 'Sword (IS)',
  requiresHand: true,
  replacesHand: false
};
```

**Processing**:
```typescript
// Validate actuators
const hasLowerArm = mech.rightArm.actuators.lowerArm;  // true
const hasHand = mech.rightArm.actuators.hand;          // false

// Validation fails - hand actuator required but missing
```

**Output**:
```typescript
{
  success: false,
  error: 'Sword (IS) requires Hand Actuator in Right Arm. Add Hand Actuator before installing weapon.',
  requiredActuators: ['Lower Arm Actuator', 'Hand Actuator'],
  missingActuators: ['Hand Actuator']
}
```

### Example 5: Vibroblade on 80-ton Mech

**Input**:
```typescript
const mech: IBattleMech = {
  tonnage: 80,
  leftArm: {
    actuators: {
      shoulder: true,
      upperArm: true,
      lowerArm: true,
      hand: true
    },
    availableSlots: 8
  },
  remainingWeight: 12
};

const vibroblade: IVibroblade = {
  id: 'vibroblade-is',
  name: 'Vibroblade (IS)',
  category: PhysicalWeaponCategory.SPECIAL,
  techBase: TechBase.INNER_SPHERE,
  rulesLevel: RulesLevel.EXPERIMENTAL,
  requiresHand: true,
  replacesHand: false
};
```

**Processing**:
```typescript
// Calculate weapon properties
const weight = Math.ceil(80 / 10);              // ceiling(8) = 8 tons
const damage = Math.floor(80 / 5);              // floor(16) = 16
const slots = 1 + Math.ceil(weight / 5);        // 1 + ceiling(8 / 5) = 1 + 2 = 3

// Validate actuators - passes
// Validate weight budget - 8 <= 12, passes
// Validate slot availability - 3 <= 8, passes
// Validate rules level - Experimental allowed

// Allocate to left arm
allocateEquipment({
  equipment: { ...vibroblade, weight: 8, criticalSlots: 3, damage: 16 },
  location: MechLocation.LEFT_ARM
});
```

**Output**:
```typescript
{
  success: true,
  weapon: {
    name: 'Vibroblade (IS)',
    weight: 8,
    criticalSlots: 3,
    damage: 16,
    location: MechLocation.LEFT_ARM,
    occupiedSlots: [4, 5, 6],
    rulesLevel: RulesLevel.EXPERIMENTAL
  },
  warnings: [
    'Vibroblade is Experimental technology and may not be tournament legal'
  ],
  remainingWeight: 4,
  remainingSlots: 5
}
```

---

## References

### Official BattleTech Rules
- **TechManual**: Page 252 - Physical Weapon Equipment
- **TechManual**: Page 253 - Hatchet, Sword, Mace specifications
- **TechManual**: Page 254 - Claws, Talons specifications
- **Tactical Operations**: Page 100 - Advanced Physical Weapons
- **Tactical Operations**: Page 101 - Retractable Blade, Vibroblade
- **Total Warfare**: Page 144 - Physical Attack Rules
- **Total Warfare**: Page 145 - Melee Weapon Damage

### Related Documentation
- Core Entity Types Specification - Base interfaces (IEquipment, IEntity)
- Tech Base Integration Specification - Tech base rules and Mixed Tech
- Critical Slot Allocation Specification - Location restrictions and slot management
- Actuator System Specification (Phase 2) - Actuator configuration and dependencies
- Equipment Database Specification - Equipment catalog structure

---

## Changelog

### Version 1.0 (2025-11-28)
- Initial specification
- Defined physical weapon base interface (IPhysicalWeapon)
- Specified melee weapons: Hatchet, Sword, Mace, Lance
- Specified punching weapons: Claws, Talons
- Specified special weapons: Retractable Blade, Vibroblade, Chain Whip
- Defined tonnage-based damage and weight formulas for all weapon types
- Established arm-only location restrictions
- Defined actuator dependency rules (hand-held vs punching weapons)
- Created validation rules for placement, actuators, weight, and slots
- Provided tech base variants (Inner Sphere and Clan)
- Added comprehensive examples for successful and failed installations
- Documented usage constraints and combat limitations
