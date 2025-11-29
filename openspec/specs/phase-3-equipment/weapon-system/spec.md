# Weapon System Specification

**Status**: Active
**Version**: 1.0
**Last Updated**: 2025-11-28
**Dependencies**: Core Enumerations, Core Entity Types, Tech Base Integration, Heat Sink System, Critical Slot Allocation
**Affects**: Unit construction, heat management, ammunition management, combat calculations, Battle Value

---

## Overview

### Purpose
Defines the weapon system for BattleMechs as removable equipment, including weapon interfaces, weapon type classifications, damage and range mechanics, ammunition requirements, heat generation, tech base variants, and validation rules for weapon placement and configuration.

### Scope
**In Scope:**
- Weapon interface definitions (IWeapon, IEnergyWeapon, IBallisticWeapon, IMissileWeapon)
- Weapon categories: Energy, Ballistic, Missile
- Weapon properties: name, weight, critical slots, damage, heat, range brackets
- Tech base variants (Inner Sphere vs Clan implementations)
- Ammunition requirements for ballistic and missile weapons
- Special weapon rules (pulse lasers, ER weapons, Ultra autocannons, LB-X, etc.)
- Heat generation per weapon firing
- Weapon placement rules and restrictions
- Validation rules for weapon configuration
- Range bracket definitions (short/medium/long/extreme ranges)
- Minimum range penalties (applicable to certain weapons)

**Out of Scope:**
- Ammunition storage specifications (covered in Ammunition System spec)
- Combat resolution and to-hit calculations (covered in Combat Mechanics spec)
- Weapon critical hit effects (covered in Damage System spec)
- Weapon special ammunition types (covered in Ammunition System spec)
- Advanced weapon systems (artillery, naval weapons) - future phases
- Infantry weapons and vehicle weapons - future phases

### Key Concepts
- **Weapon**: Removable equipment that generates heat and/or requires ammunition to deal damage to targets
- **Energy Weapon**: Self-contained weapon generating heat but requiring no ammunition (Lasers, PPCs, Flamers)
- **Ballistic Weapon**: Projectile weapon requiring ammunition (Autocannons, Gauss Rifles, Machine Guns)
- **Missile Weapon**: Guided/unguided missile launcher requiring ammunition (LRMs, SRMs, ATMs, MMLs, Streaks)
- **Range Brackets**: Distance categories affecting to-hit modifiers (short/medium/long/extreme)
- **Minimum Range**: Closest distance at which weapon can effectively engage (applies to LRMs, some PPCs)
- **Heat Generation**: Amount of heat produced per weapon firing (dissipated by heat sinks)
- **Ammunition Dependency**: Weapons requiring ammunition bins vs self-contained weapons
- **Tech Base Variant**: Inner Sphere and Clan versions of same weapon with different characteristics

---

## Requirements

### Requirement: Base Weapon Interface
All weapons SHALL implement the IWeapon interface, extending IEquipment with weapon-specific properties.

**Rationale**: Weapons are a specialized type of equipment with combat-specific properties (damage, range, heat) that must be tracked consistently.

**Priority**: Critical

#### Scenario: Weapon definition
**GIVEN** a weapon component is defined
**WHEN** implementing the interface
**THEN** it MUST extend IWeapon
**AND** provide damage value
**AND** provide heat generation value
**AND** provide range brackets (short, medium, long, extreme)
**AND** specify ammunition dependency (true/false)
**AND** inherit weight and criticalSlots from IEquipment

#### Scenario: Weapon identification
**GIVEN** a collection of equipment
**WHEN** filtering for weapons
**THEN** components implementing IWeapon SHALL be identified as weapons
**AND** weapon-specific properties SHALL be accessible

### Requirement: Energy Weapon Classification
Energy weapons SHALL implement IEnergyWeapon, generating heat but requiring no ammunition.

**Rationale**: Energy weapons are self-contained, limited only by heat dissipation capacity. They never run out of ammunition.

**Priority**: Critical

#### Scenario: Laser weapon definition
**GIVEN** an energy weapon (Laser, PPC, Flamer)
**WHEN** defining the weapon
**THEN** it MUST implement IEnergyWeapon
**AND** requiresAmmunition MUST be false
**AND** heatGeneration MUST be greater than 0
**AND** no ammunition bin SHALL be required

#### Scenario: Standard Medium Laser (IS)
**GIVEN** a Medium Laser (Inner Sphere)
**WHEN** configured on a unit
**THEN** damage SHALL be 5
**AND** heatGeneration SHALL be 3
**AND** weight SHALL be 1 ton
**AND** criticalSlots SHALL be 1
**AND** range brackets SHALL be {short: 3, medium: 6, long: 9, extreme: 9}
**AND** minimumRange SHALL be undefined (no minimum)
**AND** techBase SHALL be INNER_SPHERE

#### Scenario: ER Medium Laser (IS)
**GIVEN** an ER Medium Laser (Inner Sphere)
**WHEN** configured on a unit
**THEN** damage SHALL be 5
**AND** heatGeneration SHALL be 5
**AND** weight SHALL be 1 ton
**AND** criticalSlots SHALL be 1
**AND** range brackets SHALL be {short: 4, medium: 8, long: 12, extreme: 12}
**AND** techBase SHALL be INNER_SPHERE
**AND** rulesLevel SHALL be ADVANCED

#### Scenario: Medium Pulse Laser (IS)
**GIVEN** a Medium Pulse Laser (Inner Sphere)
**WHEN** configured on a unit
**THEN** damage SHALL be 6
**AND** heatGeneration SHALL be 4
**AND** weight SHALL be 2 tons
**AND** criticalSlots SHALL be 1
**AND** range brackets SHALL be {short: 2, medium: 4, long: 6, extreme: 6}
**AND** to-hit modifier SHALL be -2 (special rule tracked separately)

#### Scenario: PPC (IS)
**GIVEN** a PPC (Inner Sphere)
**WHEN** configured on a unit
**THEN** damage SHALL be 10
**AND** heatGeneration SHALL be 10
**AND** weight SHALL be 7 tons
**AND** criticalSlots SHALL be 3
**AND** range brackets SHALL be {short: 6, medium: 12, long: 18, extreme: 18}
**AND** minimumRange SHALL be 3 hexes

#### Scenario: Flamer
**GIVEN** a Flamer
**WHEN** configured on a unit
**THEN** damage SHALL be 2
**AND** heatGeneration SHALL be 3
**AND** weight SHALL be 1 ton
**AND** criticalSlots SHALL be 1
**AND** range brackets SHALL be {short: 1, medium: 2, long: 3, extreme: 3}
**AND** special effect SHALL add heat to target

### Requirement: Ballistic Weapon Classification
Ballistic weapons SHALL implement IBallisticWeapon, requiring ammunition to function.

**Rationale**: Ballistic weapons fire physical projectiles and require ammunition bins with finite shot counts.

**Priority**: Critical

#### Scenario: Autocannon weapon definition
**GIVEN** a ballistic weapon (AC, Gauss, MG)
**WHEN** defining the weapon
**THEN** it MUST implement IBallisticWeapon
**AND** requiresAmmunition MUST be true
**AND** shotsPerTon MUST be defined (ammunition capacity)
**AND** at least one ammunition bin MUST be allocated

#### Scenario: AC/20 (IS)
**GIVEN** an AC/20 (Inner Sphere)
**WHEN** configured on a unit
**THEN** damage SHALL be 20
**AND** heatGeneration SHALL be 7
**AND** weight SHALL be 14 tons
**AND** criticalSlots SHALL be 10
**AND** range brackets SHALL be {short: 3, medium: 6, long: 9, extreme: 9}
**AND** shotsPerTon SHALL be 5
**AND** requiresAmmunition SHALL be true

#### Scenario: AC/10 (IS)
**GIVEN** an AC/10 (Inner Sphere)
**WHEN** configured on a unit
**THEN** damage SHALL be 10
**AND** heatGeneration SHALL be 3
**AND** weight SHALL be 12 tons
**AND** criticalSlots SHALL be 7
**AND** range brackets SHALL be {short: 5, medium: 10, long: 15, extreme: 15}
**AND** shotsPerTon SHALL be 10

#### Scenario: AC/5 (IS)
**GIVEN** an AC/5 (Inner Sphere)
**WHEN** configured on a unit
**THEN** damage SHALL be 5
**AND** heatGeneration SHALL be 1
**AND** weight SHALL be 8 tons
**AND** criticalSlots SHALL be 4
**AND** range brackets SHALL be {short: 6, medium: 12, long: 18, extreme: 18}
**AND** shotsPerTon SHALL be 20

#### Scenario: AC/2 (IS)
**GIVEN** an AC/2 (Inner Sphere)
**WHEN** configured on a unit
**THEN** damage SHALL be 2
**AND** heatGeneration SHALL be 1
**AND** weight SHALL be 6 tons
**AND** criticalSlots SHALL be 1
**AND** range brackets SHALL be {short: 8, medium: 16, long: 24, extreme: 24}
**AND** shotsPerTon SHALL be 45

#### Scenario: Gauss Rifle (IS)
**GIVEN** a Gauss Rifle (Inner Sphere)
**WHEN** configured on a unit
**THEN** damage SHALL be 15
**AND** heatGeneration SHALL be 1
**AND** weight SHALL be 15 tons
**AND** criticalSlots SHALL be 7
**AND** range brackets SHALL be {short: 7, medium: 15, long: 22, extreme: 22}
**AND** shotsPerTon SHALL be 8
**AND** special rule SHALL be explosive (destroyed on critical hit)

#### Scenario: Machine Gun
**GIVEN** a Machine Gun
**WHEN** configured on a unit
**THEN** damage SHALL be 2
**AND** heatGeneration SHALL be 0
**AND** weight SHALL be 0.5 tons
**AND** criticalSlots SHALL be 1
**AND** range brackets SHALL be {short: 1, medium: 2, long: 3, extreme: 3}
**AND** shotsPerTon SHALL be 200

#### Scenario: Ultra AC/5 (IS)
**GIVEN** an Ultra AC/5 (Inner Sphere)
**WHEN** configured on a unit
**THEN** damage SHALL be 5 (or 10 if firing both shots)
**AND** heatGeneration SHALL be 1
**AND** weight SHALL be 9 tons
**AND** criticalSlots SHALL be 5
**AND** range brackets SHALL be {short: 6, medium: 13, long: 20, extreme: 20}
**AND** shotsPerTon SHALL be 20
**AND** special rule SHALL allow double-shot with jam risk

#### Scenario: LB 10-X AC (IS)
**GIVEN** an LB 10-X Autocannon (Inner Sphere)
**WHEN** configured on a unit
**THEN** damage SHALL be 10 (slug) or 1 per pellet (cluster)
**AND** heatGeneration SHALL be 2
**AND** weight SHALL be 11 tons
**AND** criticalSlots SHALL be 6
**AND** range brackets SHALL be {short: 6, medium: 12, long: 18, extreme: 18}
**AND** shotsPerTon SHALL be 10
**AND** special rule SHALL allow slug or cluster ammunition selection

### Requirement: Missile Weapon Classification
Missile weapons SHALL implement IMissileWeapon, requiring ammunition and firing in volleys.

**Rationale**: Missile weapons launch guided or unguided missiles in groups, with damage clustering and ammunition tracking.

**Priority**: Critical

#### Scenario: Missile launcher definition
**GIVEN** a missile weapon (LRM, SRM, ATM, MML, Streak)
**WHEN** defining the weapon
**THEN** it MUST implement IMissileWeapon
**AND** requiresAmmunition MUST be true
**AND** volleySize MUST be defined (missiles per firing)
**AND** shotsPerTon MUST be defined
**AND** at least one ammunition bin MUST be allocated

#### Scenario: LRM-20 (IS)
**GIVEN** an LRM-20 (Inner Sphere)
**WHEN** configured on a unit
**THEN** damage SHALL be 1 per missile
**AND** volleySize SHALL be 20
**AND** heatGeneration SHALL be 6
**AND** weight SHALL be 10 tons
**AND** criticalSlots SHALL be 5
**AND** range brackets SHALL be {short: 7, medium: 14, long: 21, extreme: 21}
**AND** minimumRange SHALL be 6 hexes
**AND** shotsPerTon SHALL be 6 (120 missiles / 20 per volley)

#### Scenario: LRM-15 (IS)
**GIVEN** an LRM-15 (Inner Sphere)
**WHEN** configured on a unit
**THEN** damage SHALL be 1 per missile
**AND** volleySize SHALL be 15
**AND** heatGeneration SHALL be 5
**AND** weight SHALL be 7 tons
**AND** criticalSlots SHALL be 3
**AND** range brackets SHALL be {short: 7, medium: 14, long: 21, extreme: 21}
**AND** minimumRange SHALL be 6 hexes
**AND** shotsPerTon SHALL be 8 (120 missiles / 15 per volley)

#### Scenario: LRM-10 (IS)
**GIVEN** an LRM-10 (Inner Sphere)
**WHEN** configured on a unit
**THEN** damage SHALL be 1 per missile
**AND** volleySize SHALL be 10
**AND** heatGeneration SHALL be 4
**AND** weight SHALL be 5 tons
**AND** criticalSlots SHALL be 2
**AND** range brackets SHALL be {short: 7, medium: 14, long: 21, extreme: 21}
**AND** minimumRange SHALL be 6 hexes
**AND** shotsPerTon SHALL be 12 (120 missiles / 10 per volley)

#### Scenario: LRM-5 (IS)
**GIVEN** an LRM-5 (Inner Sphere)
**WHEN** configured on a unit
**THEN** damage SHALL be 1 per missile
**AND** volleySize SHALL be 5
**AND** heatGeneration SHALL be 2
**AND** weight SHALL be 2 tons
**AND** criticalSlots SHALL be 1
**AND** range brackets SHALL be {short: 7, medium: 14, long: 21, extreme: 21}
**AND** minimumRange SHALL be 6 hexes
**AND** shotsPerTon SHALL be 24 (120 missiles / 5 per volley)

#### Scenario: SRM-6 (IS)
**GIVEN** an SRM-6 (Inner Sphere)
**WHEN** configured on a unit
**THEN** damage SHALL be 2 per missile
**AND** volleySize SHALL be 6
**AND** heatGeneration SHALL be 4
**AND** weight SHALL be 3 tons
**AND** criticalSlots SHALL be 2
**AND** range brackets SHALL be {short: 3, medium: 6, long: 9, extreme: 9}
**AND** minimumRange SHALL be undefined (no minimum)
**AND** shotsPerTon SHALL be 15 (100 missiles / 6 per volley, rounded down)

#### Scenario: SRM-4 (IS)
**GIVEN** an SRM-4 (Inner Sphere)
**WHEN** configured on a unit
**THEN** damage SHALL be 2 per missile
**AND** volleySize SHALL be 4
**AND** heatGeneration SHALL be 3
**AND** weight SHALL be 2 tons
**AND** criticalSlots SHALL be 1
**AND** range brackets SHALL be {short: 3, medium: 6, long: 9, extreme: 9}
**AND** shotsPerTon SHALL be 25 (100 missiles / 4 per volley)

#### Scenario: SRM-2 (IS)
**GIVEN** an SRM-2 (Inner Sphere)
**WHEN** configured on a unit
**THEN** damage SHALL be 2 per missile
**AND** volleySize SHALL be 2
**AND** heatGeneration SHALL be 2
**AND** weight SHALL be 1 ton
**AND** criticalSlots SHALL be 1
**AND** range brackets SHALL be {short: 3, medium: 6, long: 9, extreme: 9}
**AND** shotsPerTon SHALL be 50 (100 missiles / 2 per volley)

#### Scenario: Streak SRM-2 (IS)
**GIVEN** a Streak SRM-2 (Inner Sphere)
**WHEN** configured on a unit
**THEN** damage SHALL be 2 per missile
**AND** volleySize SHALL be 2
**AND** heatGeneration SHALL be 2
**AND** weight SHALL be 1.5 tons
**AND** criticalSlots SHALL be 1
**AND** range brackets SHALL be {short: 3, medium: 6, long: 9, extreme: 9}
**AND** shotsPerTon SHALL be 50
**AND** special rule SHALL be hits-only (no ammunition consumed on miss)

### Requirement: Range Bracket Definition
All weapons SHALL define four range brackets: short, medium, long, and extreme ranges in hexes.

**Rationale**: Range brackets determine to-hit modifiers and optimal engagement distances for tactical combat.

**Priority**: Critical

#### Scenario: Range bracket specification
**GIVEN** a weapon is defined
**WHEN** specifying range properties
**THEN** it MUST define shortRange in hexes
**AND** MUST define mediumRange in hexes
**AND** MUST define longRange in hexes
**AND** extremeRange MUST equal longRange (no damage beyond long range)
**AND** shortRange < mediumRange < longRange

#### Scenario: Range bracket validation
**GIVEN** a weapon's range brackets
**WHEN** validating range values
**THEN** all ranges MUST be positive integers
**AND** shortRange MUST be less than mediumRange
**AND** mediumRange MUST be less than longRange
**AND** extremeRange MUST equal longRange

### Requirement: Minimum Range Penalty
Weapons with minimum range SHALL define minimumRange property for close-range penalties.

**Rationale**: Some weapons (LRMs, PPCs) are less effective or unusable at close range due to arming distance or targeting limitations.

**Priority**: High

#### Scenario: LRM minimum range
**GIVEN** any LRM launcher
**WHEN** configured on a unit
**THEN** minimumRange SHALL be 6 hexes
**AND** firing at targets within 6 hexes SHALL incur to-hit penalties
**AND** penalty calculation is +1 per hex inside minimum range

#### Scenario: PPC minimum range (optional rule)
**GIVEN** a PPC with minimum range rule active
**WHEN** configured on a unit
**THEN** minimumRange SHALL be 3 hexes
**AND** firing within 3 hexes SHALL incur penalties

#### Scenario: No minimum range
**GIVEN** a weapon without minimum range (most weapons)
**WHEN** configured on a unit
**THEN** minimumRange SHALL be undefined
**AND** weapon SHALL be effective at all ranges up to maximum

### Requirement: Heat Generation
All weapons SHALL specify heat generation per firing.

**Rationale**: Weapons generate heat that must be dissipated by heat sinks. Heat management is critical to BattleMech operation.

**Priority**: Critical

#### Scenario: Energy weapon heat
**GIVEN** an energy weapon
**WHEN** fired
**THEN** it SHALL generate heat equal to heatGeneration property
**AND** this heat MUST be tracked for heat scale effects
**AND** heat sinks SHALL dissipate this heat

#### Scenario: Ballistic weapon heat
**GIVEN** a ballistic weapon
**WHEN** fired
**THEN** it SHALL generate heat equal to heatGeneration property
**AND** heat generation is typically lower than energy weapons
**AND** some ballistic weapons generate 0 heat (Machine Gun)

#### Scenario: Missile weapon heat
**GIVEN** a missile weapon
**WHEN** fired
**THEN** it SHALL generate heat equal to heatGeneration property
**AND** heat is based on launcher size, not individual missiles

#### Scenario: Heat calculation for multiple weapons
**GIVEN** multiple weapons firing in same turn
**WHEN** calculating total heat
**THEN** heat SHALL be sum of all heatGeneration values
**AND** total heat SHALL be compared to heat dissipation capacity

### Requirement: Ammunition Dependency
Weapons SHALL declare whether they require ammunition bins.

**Rationale**: Energy weapons are self-contained; ballistic and missile weapons require ammunition tracking.

**Priority**: Critical

#### Scenario: Self-contained weapon
**GIVEN** an energy weapon (Laser, PPC, Flamer)
**WHEN** checking ammunition requirements
**THEN** requiresAmmunition SHALL be false
**AND** no ammunition bin SHALL be required
**AND** weapon SHALL function indefinitely

#### Scenario: Ammunition-dependent weapon
**GIVEN** a ballistic or missile weapon
**WHEN** checking ammunition requirements
**THEN** requiresAmmunition SHALL be true
**AND** at least one compatible ammunition bin MUST be present
**AND** validation error SHALL occur if no ammunition allocated

#### Scenario: Ammunition exhaustion
**GIVEN** a weapon requiring ammunition
**WHEN** all ammunition is expended
**THEN** weapon SHALL be unable to fire
**AND** weapon remains installed but non-functional

---

## Data Model Requirements

### Required Interfaces

```typescript
/**
 * Range bracket definition for weapon targeting
 */
interface IRangeBrackets {
  /**
   * Short range in hexes (optimal range, no penalty)
   */
  readonly short: number;

  /**
   * Medium range in hexes (moderate penalty)
   */
  readonly medium: number;

  /**
   * Long range in hexes (significant penalty)
   */
  readonly long: number;

  /**
   * Extreme range in hexes (equals long range for most weapons)
   */
  readonly extreme: number;
}

/**
 * Base weapon interface - all weapons extend this
 * Weapons are equipment that deal damage and may generate heat
 */
interface IWeapon extends IEquipment {
  /**
   * Weapon category classification
   */
  readonly weaponCategory: WeaponCategory;

  /**
   * Damage dealt per successful hit
   * For missile weapons, this is damage per individual missile
   */
  readonly damage: number;

  /**
   * Heat generated per weapon firing
   * @minimum 0
   */
  readonly heatGeneration: number;

  /**
   * Range brackets in hexes
   */
  readonly rangeBrackets: IRangeBrackets;

  /**
   * Minimum range in hexes (if applicable)
   * Weapon incurs penalties when firing within this range
   * @example 6 for LRMs, 3 for PPCs (optional rule)
   */
  readonly minimumRange?: number;

  /**
   * Whether weapon requires ammunition to function
   */
  readonly requiresAmmunition: boolean;

  /**
   * Special weapon properties (pulse, ER, streak, etc.)
   */
  readonly specialRules?: string[];
}

/**
 * Energy weapon - generates heat, no ammunition required
 * Examples: Lasers, PPCs, Flamers
 */
interface IEnergyWeapon extends IWeapon {
  /**
   * Energy weapons never require ammunition
   */
  readonly requiresAmmunition: false;

  /**
   * Weapon category is always ENERGY
   */
  readonly weaponCategory: WeaponCategory.ENERGY;
}

/**
 * Ballistic weapon - requires ammunition
 * Examples: Autocannons, Gauss Rifles, Machine Guns
 */
interface IBallisticWeapon extends IWeapon {
  /**
   * Ballistic weapons always require ammunition
   */
  readonly requiresAmmunition: true;

  /**
   * Weapon category is always BALLISTIC
   */
  readonly weaponCategory: WeaponCategory.BALLISTIC;

  /**
   * Number of shots provided per ton of ammunition
   * Used to calculate ammunition consumption
   * @example 20 for AC/5, 8 for Gauss Rifle, 200 for Machine Gun
   */
  readonly shotsPerTon: number;

  /**
   * Compatible ammunition types
   * @example ["AC/5 Standard", "AC/5 Armor-Piercing"]
   */
  readonly compatibleAmmo: string[];
}

/**
 * Missile weapon - requires ammunition, fires in volleys
 * Examples: LRMs, SRMs, ATMs, MMLs, Streaks
 */
interface IMissileWeapon extends IWeapon {
  /**
   * Missile weapons always require ammunition
   */
  readonly requiresAmmunition: true;

  /**
   * Weapon category is always MISSILE
   */
  readonly weaponCategory: WeaponCategory.MISSILE;

  /**
   * Number of missiles fired per volley
   * @example 20 for LRM-20, 6 for SRM-6
   */
  readonly volleySize: number;

  /**
   * Number of volleys provided per ton of ammunition
   * Calculated as: total missiles per ton / volleySize
   * @example 6 for LRM-20 (120 missiles / 20), 15 for SRM-6 (100 missiles / 6)
   */
  readonly shotsPerTon: number;

  /**
   * Compatible ammunition types
   * @example ["LRM Standard", "LRM Artemis IV", "LRM Swarm"]
   */
  readonly compatibleAmmo: string[];
}
```

### Required Enumerations

```typescript
/**
 * Weapon category classification
 */
enum WeaponCategory {
  /**
   * Energy weapons (self-contained, heat-based)
   */
  ENERGY = 'Energy',

  /**
   * Ballistic weapons (projectile-based, ammunition-dependent)
   */
  BALLISTIC = 'Ballistic',

  /**
   * Missile weapons (guided/unguided missiles, ammunition-dependent)
   */
  MISSILE = 'Missile'
}
```

### Required Properties

| Property | Type | Required | Description | Valid Values | Default |
|----------|------|----------|-------------|--------------|---------|
| `weaponCategory` | `WeaponCategory` | Yes | Weapon classification | ENERGY, BALLISTIC, MISSILE | - |
| `damage` | `number` | Yes | Damage per hit/missile | > 0 | - |
| `heatGeneration` | `number` | Yes | Heat per firing | >= 0 | - |
| `rangeBrackets` | `IRangeBrackets` | Yes | Range in hexes | Valid range object | - |
| `minimumRange` | `number` | No | Minimum effective range | >= 0 | undefined |
| `requiresAmmunition` | `boolean` | Yes | Ammunition dependency | true/false | - |
| `specialRules` | `string[]` | No | Special weapon rules | Array of rule names | undefined |
| `shotsPerTon` | `number` | Yes* | Shots per ton of ammo | > 0 | - |
| `volleySize` | `number` | Yes** | Missiles per volley | > 0 | - |
| `compatibleAmmo` | `string[]` | Yes* | Compatible ammo types | Array of ammo IDs | - |

\* Required for IBallisticWeapon and IMissileWeapon
\** Required for IMissileWeapon only

### Type Constraints

- `damage` MUST be a positive number > 0
- `heatGeneration` MUST be a non-negative number >= 0
- `rangeBrackets.short` MUST be < `rangeBrackets.medium`
- `rangeBrackets.medium` MUST be < `rangeBrackets.long`
- `rangeBrackets.extreme` MUST equal `rangeBrackets.long` (standard rule)
- `minimumRange` MUST be >= 0 if present
- `minimumRange` MUST be < `rangeBrackets.short` if present
- `shotsPerTon` MUST be a positive number > 0 for ammunition-dependent weapons
- `volleySize` MUST be a positive integer > 0 for missile weapons
- `compatibleAmmo` MUST contain at least one ammunition type for ammunition-dependent weapons
- Energy weapons MUST have `requiresAmmunition: false`
- Ballistic and Missile weapons MUST have `requiresAmmunition: true`

---

## Validation Rules

### Validation: Weapon Weight and Slots
**Rule**: Weapon must have valid weight and critical slot allocation

**Severity**: Error

**Condition**:
```typescript
if (!weapon.weight || weapon.weight <= 0) {
  // invalid - emit error
}
if (!Number.isInteger(weapon.criticalSlots) || weapon.criticalSlots <= 0) {
  // invalid - emit error
}
```

**Error Message**: "Weapon must have positive weight and at least 1 critical slot"

**User Action**: Verify weapon database entry has correct weight and slot values

### Validation: Range Bracket Order
**Rule**: Range brackets must be in ascending order

**Severity**: Error

**Condition**:
```typescript
const { short, medium, long, extreme } = weapon.rangeBrackets;
if (short >= medium || medium >= long || extreme !== long) {
  // invalid - emit error
}
```

**Error Message**: "Range brackets must be in order: short < medium < long = extreme"

**User Action**: Correct range bracket definitions in weapon data

### Validation: Ammunition Requirement
**Rule**: Ammunition-dependent weapons must have compatible ammunition allocated

**Severity**: Error

**Condition**:
```typescript
if (weapon.requiresAmmunition) {
  const hasCompatibleAmmo = unit.equipment.some(
    eq => eq.type === 'ammunition' &&
    weapon.compatibleAmmo.includes(eq.ammunitionType)
  );
  if (!hasCompatibleAmmo) {
    // invalid - emit error
  }
}
```

**Error Message**: "Weapon [name] requires ammunition but none allocated"

**User Action**: Add at least one ton of compatible ammunition for this weapon

### Validation: Heat Generation
**Rule**: Weapon heat generation must be non-negative

**Severity**: Error

**Condition**:
```typescript
if (weapon.heatGeneration < 0 || !Number.isFinite(weapon.heatGeneration)) {
  // invalid - emit error
}
```

**Error Message**: "Weapon heat generation must be a non-negative number"

**User Action**: Correct weapon heat generation value

### Validation: Minimum Range Consistency
**Rule**: Minimum range must be less than short range

**Severity**: Error

**Condition**:
```typescript
if (weapon.minimumRange !== undefined &&
    weapon.minimumRange >= weapon.rangeBrackets.short) {
  // invalid - emit error
}
```

**Error Message**: "Minimum range must be less than short range"

**User Action**: Correct minimum range or short range values

### Validation: Ammunition Dependency Consistency
**Rule**: Energy weapons must not require ammunition, ballistic/missile weapons must

**Severity**: Error

**Condition**:
```typescript
if (weapon.weaponCategory === WeaponCategory.ENERGY && weapon.requiresAmmunition) {
  // invalid - emit error
}
if ((weapon.weaponCategory === WeaponCategory.BALLISTIC ||
     weapon.weaponCategory === WeaponCategory.MISSILE) &&
    !weapon.requiresAmmunition) {
  // invalid - emit error
}
```

**Error Message**: "Energy weapons cannot require ammunition; ballistic/missile weapons must"

**User Action**: Correct weapon category or ammunition requirement flag

---

## Tech Base Variants

### Inner Sphere Implementation

Inner Sphere weapons generally have:
- **Longer range** for autocannons compared to Clan equivalents
- **Heavier weight** for Double Heat Sink-equivalent weapons (ER lasers)
- **More critical slots** for advanced weapons (Double heat sink lasers require more slots)
- **Lower heat efficiency** for ER (Extended Range) weapons

**Differences from base specification**:
- ER Medium Laser (IS): 5 heat vs 3 heat for standard
- Double Heat Sinks (IS): 3 critical slots when external
- LB-X Autocannons available (Clan has LB-X as well)
- Ultra Autocannons: single or double-shot with jam risk

**Example: ER Large Laser (IS)**
```typescript
const erLargeLaserIS: IEnergyWeapon = {
  id: 'er-large-laser-is',
  name: 'ER Large Laser',
  techBase: TechBase.INNER_SPHERE,
  rulesLevel: RulesLevel.ADVANCED,
  weaponCategory: WeaponCategory.ENERGY,
  weight: 5,
  criticalSlots: 2,
  damage: 8,
  heatGeneration: 12,
  rangeBrackets: {
    short: 7,
    medium: 14,
    long: 19,
    extreme: 19
  },
  requiresAmmunition: false,
  introductionYear: 3058,
  era: Era.CIVIL_WAR
};
```

### Clan Implementation

Clan weapons generally have:
- **Lighter weight** for equivalent damage output
- **Fewer critical slots** for most weapons
- **Better heat efficiency** for ER weapons
- **Longer range** for pulse lasers and missile launchers
- **Higher damage-to-weight ratio**

**Differences from base specification**:
- ER Medium Laser (Clan): 5 heat (same as standard, but longer range)
- Double Heat Sinks (Clan): 2 critical slots when external
- Pulse lasers have longer range than IS equivalents
- LB-X and Ultra autocannons typically lighter than IS versions

**Example: ER Medium Laser (Clan)**
```typescript
const erMediumLaserClan: IEnergyWeapon = {
  id: 'er-medium-laser-clan',
  name: 'ER Medium Laser (Clan)',
  techBase: TechBase.CLAN,
  rulesLevel: RulesLevel.STANDARD,
  weaponCategory: WeaponCategory.ENERGY,
  weight: 1,
  criticalSlots: 1,
  damage: 5,
  heatGeneration: 5,
  rangeBrackets: {
    short: 5,
    medium: 10,
    long: 15,
    extreme: 15
  },
  requiresAmmunition: false,
  introductionYear: 2820,
  era: Era.EARLY_SUCCESSION_WARS
};
```

**Example: LRM-20 (Clan)**
```typescript
const lrm20Clan: IMissileWeapon = {
  id: 'lrm-20-clan',
  name: 'LRM-20 (Clan)',
  techBase: TechBase.CLAN,
  rulesLevel: RulesLevel.STANDARD,
  weaponCategory: WeaponCategory.MISSILE,
  weight: 5,        // IS version: 10 tons
  criticalSlots: 4, // IS version: 5 slots
  damage: 1,
  heatGeneration: 6,
  rangeBrackets: {
    short: 7,
    medium: 14,
    long: 21,
    extreme: 21
  },
  minimumRange: 6,
  requiresAmmunition: true,
  volleySize: 20,
  shotsPerTon: 6,
  compatibleAmmo: ['LRM Ammo (Clan)', 'LRM Artemis IV Ammo (Clan)'],
  introductionYear: 2824,
  era: Era.EARLY_SUCCESSION_WARS
};
```

### Mixed Tech Rules

**When unit tech base is Mixed**:
- Weapons from both tech bases MAY be installed on same unit
- Each weapon retains its native tech base properties
- No special integration rules (weapons are tech-base independent)
- Weight, slots, heat, and ammunition requirements remain unchanged
- Compatible ammunition MUST match weapon tech base (IS weapon requires IS ammo, Clan weapon requires Clan ammo)

**Example: Mixed Tech Mech with Both IS and Clan Weapons**
```typescript
// Unit can mount both:
const weapons = [
  mediumLaserIS,      // Inner Sphere Medium Laser
  erMediumLaserClan,  // Clan ER Medium Laser
  ac20IS,             // Inner Sphere AC/20
  lrm20Clan           // Clan LRM-20
];
// Each retains its native characteristics
```

---

## Dependencies

### Depends On
- **Core Enumerations**: Uses `TechBase`, `RulesLevel`, `Era` enums for classification
- **Core Entity Types**: Extends `IEquipment` interface (which extends `IEntity`, `ITechBaseEntity`, `IPlaceableComponent`, `IValuedComponent`, `ITemporalEntity`)
- **Tech Base Integration**: Weapons are equipment (tech-base independent), available based on year/era only
- **Heat Sink System**: Weapon heat generation must be dissipated by heat sinks
- **Critical Slot Allocation**: Weapons require critical slot placement in mech locations

### Used By
- **Ammunition System**: Ammunition bins reference compatible weapons via `compatibleAmmo` property
- **Heat Management**: Total heat calculated from all weapon firings
- **Combat System**: Weapon properties (damage, range, heat) used for combat resolution
- **Battle Value Calculation**: Weapon offensive BV contributes to unit total BV
- **Construction Rules Core**: Weapons contribute to total weight and critical slot usage
- **Validation System**: Weapon placement and ammunition requirements validated

### Construction Sequence
1. Define base enumerations (TechBase, RulesLevel, Era, WeaponCategory)
2. Define core entity interfaces (IEntity, ITechBaseEntity, IEquipment)
3. Define weapon interfaces (IWeapon, IEnergyWeapon, IBallisticWeapon, IMissileWeapon)
4. Implement weapon database with all weapon definitions
5. Validate weapon data against interface constraints
6. Enable weapon selection in unit construction UI
7. Validate weapon placement and ammunition allocation during construction

---

## Implementation Notes

### Performance Considerations
- Weapon database should be indexed by `id` for fast lookup
- Filter weapons by category before displaying in UI
- Cache compatible ammunition lists to avoid repeated filtering
- Validate ammunition allocation only when weapons change

### Edge Cases
- **Zero heat weapons**: Machine Guns generate 0 heat (valid)
- **Fractional weight**: Some weapons weigh 0.5 tons (Machine Gun, Small Laser)
- **Large slot counts**: AC/20 requires 10 critical slots (largest single weapon)
- **Minimum range**: Only LRMs and PPCs (optional) have minimum range
- **Ammunition sharing**: Multiple weapons of same type can share ammunition bins

### Common Pitfalls
- **Pitfall**: Forgetting to allocate ammunition for ballistic/missile weapons
  - **Solution**: Validation rule checks for at least one compatible ammo bin
- **Pitfall**: Mixing IS and Clan ammunition with wrong weapons
  - **Solution**: Ammunition tech base must match weapon tech base
- **Pitfall**: Assuming all weapons generate heat
  - **Solution**: Machine Guns generate 0 heat, some weapons generate minimal heat
- **Pitfall**: Confusing damage per missile vs total volley damage
  - **Solution**: Missile damage is per individual missile; multiply by volleySize for maximum possible damage
- **Pitfall**: Not accounting for minimum range penalties
  - **Solution**: Validate minimum range property and apply penalties in combat calculations

---

## Examples

### Example 1: Standard Medium Laser (Energy Weapon)

**Input**:
```typescript
const mediumLaserIS: IEnergyWeapon = {
  id: 'medium-laser-is',
  name: 'Medium Laser',
  techBase: TechBase.INNER_SPHERE,
  rulesLevel: RulesLevel.INTRODUCTORY,
  weaponCategory: WeaponCategory.ENERGY,
  weight: 1,
  criticalSlots: 1,
  cost: 40000,
  battleValue: 46,
  damage: 5,
  heatGeneration: 3,
  rangeBrackets: {
    short: 3,
    medium: 6,
    long: 9,
    extreme: 9
  },
  requiresAmmunition: false,
  introductionYear: 2300,
  era: Era.AGE_OF_WAR
};
```

**Processing**:
```typescript
// Weapon mounted in Right Arm location
// No ammunition required (self-contained)
// Generates 3 heat per firing
// Effective range: 0-9 hexes (optimal at 0-3)
```

**Output**:
```typescript
// Validation: PASS
// - No ammunition required
// - Heat generation valid
// - Range brackets in correct order
// - Weight and slots positive
```

### Example 2: AC/10 (Ballistic Weapon)

**Input**:
```typescript
const ac10IS: IBallisticWeapon = {
  id: 'ac-10-is',
  name: 'Autocannon/10',
  techBase: TechBase.INNER_SPHERE,
  rulesLevel: RulesLevel.INTRODUCTORY,
  weaponCategory: WeaponCategory.BALLISTIC,
  weight: 12,
  criticalSlots: 7,
  cost: 200000,
  battleValue: 123,
  damage: 10,
  heatGeneration: 3,
  rangeBrackets: {
    short: 5,
    medium: 10,
    long: 15,
    extreme: 15
  },
  requiresAmmunition: true,
  shotsPerTon: 10,
  compatibleAmmo: ['AC/10 Standard Ammo'],
  introductionYear: 2443,
  era: Era.AGE_OF_WAR
};
```

**Processing**:
```typescript
// Weapon mounted in Right Torso (7 slots)
// Requires at least 1 ton AC/10 ammunition
// Each ton provides 10 shots
// Generates 3 heat per firing
```

**Output**:
```typescript
// Validation: CHECK AMMUNITION
// - If ammo allocated: PASS
// - If no ammo: ERROR "Weapon Autocannon/10 requires ammunition but none allocated"
```

### Example 3: LRM-15 (Missile Weapon)

**Input**:
```typescript
const lrm15IS: IMissileWeapon = {
  id: 'lrm-15-is',
  name: 'LRM-15',
  techBase: TechBase.INNER_SPHERE,
  rulesLevel: RulesLevel.INTRODUCTORY,
  weaponCategory: WeaponCategory.MISSILE,
  weight: 7,
  criticalSlots: 3,
  cost: 175000,
  battleValue: 136,
  damage: 1,  // per missile
  heatGeneration: 5,
  rangeBrackets: {
    short: 7,
    medium: 14,
    long: 21,
    extreme: 21
  },
  minimumRange: 6,
  requiresAmmunition: true,
  volleySize: 15,
  shotsPerTon: 8,  // 120 missiles / 15 per volley
  compatibleAmmo: ['LRM Standard Ammo', 'LRM Artemis IV Ammo'],
  introductionYear: 2300,
  era: Era.AGE_OF_WAR
};
```

**Processing**:
```typescript
// Weapon mounted in Left Torso (3 slots)
// Requires at least 1 ton LRM ammunition
// Each ton provides 8 volleys (120 missiles / 15)
// Fires 15 missiles per volley
// Maximum damage per volley: 15 points (if all hit)
// Minimum range: 6 hexes (penalties if closer)
// Generates 5 heat per volley
```

**Output**:
```typescript
// Validation: CHECK AMMUNITION AND MINIMUM RANGE
// - If ammo allocated: PASS
// - If no ammo: ERROR "Weapon LRM-15 requires ammunition but none allocated"
// - Minimum range warning: "LRM-15 has minimum range of 6 hexes"
```

### Example 4: Mixed Tech Loadout

**Input**:
```typescript
const mixedTechWeapons: IWeapon[] = [
  {
    // IS ER Large Laser
    id: 'er-large-laser-is',
    name: 'ER Large Laser',
    techBase: TechBase.INNER_SPHERE,
    weaponCategory: WeaponCategory.ENERGY,
    weight: 5,
    criticalSlots: 2,
    damage: 8,
    heatGeneration: 12,
    rangeBrackets: { short: 7, medium: 14, long: 19, extreme: 19 },
    requiresAmmunition: false
  },
  {
    // Clan ER Medium Laser
    id: 'er-medium-laser-clan',
    name: 'ER Medium Laser (Clan)',
    techBase: TechBase.CLAN,
    weaponCategory: WeaponCategory.ENERGY,
    weight: 1,
    criticalSlots: 1,
    damage: 5,
    heatGeneration: 5,
    rangeBrackets: { short: 5, medium: 10, long: 15, extreme: 15 },
    requiresAmmunition: false
  },
  {
    // Clan LRM-20
    id: 'lrm-20-clan',
    name: 'LRM-20 (Clan)',
    techBase: TechBase.CLAN,
    weaponCategory: WeaponCategory.MISSILE,
    weight: 5,
    criticalSlots: 4,
    damage: 1,
    heatGeneration: 6,
    rangeBrackets: { short: 7, medium: 14, long: 21, extreme: 21 },
    minimumRange: 6,
    requiresAmmunition: true,
    volleySize: 20,
    shotsPerTon: 6,
    compatibleAmmo: ['LRM Ammo (Clan)']
  }
];
```

**Processing**:
```typescript
// Total weight: 5 + 1 + 5 = 11 tons
// Total slots: 2 + 1 + 4 = 7 critical slots
// Total heat (all firing): 12 + 5 + 6 = 23 heat
// Ammunition requirement: 1 ton Clan LRM ammunition
// Unit tech base: MIXED (has both IS and Clan weapons)
```

**Output**:
```typescript
// Validation: PASS (with Mixed Tech)
// - All weapons have valid properties
// - Clan LRM requires Clan ammunition (must be allocated)
// - Total heat requires at least 12 heat sinks (23 heat / 2 per DHS)
// - Unit marked as Mixed Tech (affects tech rating and tournament legality)
```

---

## References

### Official BattleTech Rules
- **TechManual**: Pages 226-242 - Weapon Tables and Specifications
- **Total Warfare**: Pages 134-137 - Weapon Range and Damage
- **Total Warfare**: Pages 138-145 - Weapon Types and Special Rules
- **TechManual**: Pages 207-209 - Construction Rules for Weapons
- **Campaign Operations**: Pages 273-285 - Advanced Weapons and Ammunition

### Related Documentation
- `openspec/specs/phase-1-foundation/core-entity-types/spec.md` - Base IEquipment interface
- `openspec/specs/phase-1-foundation/core-enumerations/spec.md` - TechBase, RulesLevel, Era enums
- `openspec/specs/phase-2-construction/heat-sink-system/spec.md` - Heat dissipation
- `openspec/specs/phase-2-construction/critical-slot-allocation/spec.md` - Slot placement
- `openspec/specs/phase-2-construction/tech-base-integration/spec.md` - Tech base rules
- `openspec/TERMINOLOGY_GLOSSARY.md` - Canonical terminology

### Code References
- Interfaces: `src/types/core/EquipmentInterfaces.ts`
- Weapon database: `src/data/weapons/`
- Validation: `src/services/validation/weaponValidation.ts`

---

## Changelog

### Version 1.0 (2025-11-28)
- Initial specification
- Defined weapon interfaces: IWeapon, IEnergyWeapon, IBallisticWeapon, IMissileWeapon
- Defined WeaponCategory enum
- Established weapon properties: damage, heat, range brackets, ammunition requirements
- Specified tech base variants for IS and Clan weapons
- Added validation rules for weapon configuration
- Documented weapon examples: lasers, autocannons, missile launchers
- Established dependencies on Core Entity Types, Tech Base Integration, Heat Sink System
