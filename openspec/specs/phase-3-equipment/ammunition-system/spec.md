# Ammunition System Specification

**Status**: Active
**Version**: 1.0
**Last Updated**: 2025-11-28
**Dependencies**: Core Entity Types, Core Enumerations, Weapon System, Tech Base Integration, Critical Slot Allocation
**Affects**: Unit construction, weapon loadout, critical slot allocation, weight calculation, combat readiness

---

## Overview

### Purpose
Defines the ammunition system for BattleMechs, including ammunition types, compatibility rules, critical slot allocation, weight calculations, and safety systems (CASE/CASE II). Establishes rules for how ammunition supports weapons, occupies critical space, and handles explosion risks.

### Scope
**In Scope:**
- Ammunition type definitions (Standard, Artemis IV, Precision, Incendiary, Armor-Piercing, Flechette, etc.)
- Ammunition properties (name, weight per ton, shots per ton, compatible weapons)
- Tech base variants (Inner Sphere vs Clan ammunition differences)
- Critical slot allocation rules (1 ton = 1 critical slot)
- Ammunition placement restrictions and location rules
- Special ammunition rules (half-ton machine gun ammo, partial tons)
- Ammunition explosion mechanics and CASE/CASE II protection
- Weapon compatibility validation
- Tech base matching rules

**Out of Scope:**
- Weapon definitions and characteristics (covered in Weapon System spec)
- Damage calculations from ammunition (covered in Combat Mechanics spec)
- Ammunition consumption during combat (covered in Game Mechanics spec)
- Reloading and ammunition management during gameplay (covered in Tactical Rules spec)

### Key Concepts
- **Ammunition**: Removable equipment that provides shots for weapons, stored in one-ton increments
- **Shots Per Ton**: Number of weapon discharges provided by one ton of ammunition (varies by weapon and tech base)
- **Ammunition Type**: Classification of ammunition by function (Standard, Artemis IV, specialty types)
- **Weapon Compatibility**: Ammunition must match weapon type and tech base
- **Critical Slot Allocation**: Each ton of ammunition occupies exactly 1 critical slot
- **CASE (Cellular Ammunition Storage Equipment)**: Safety system that vents ammunition explosions outward
- **CASE II**: Advanced CASE that prevents location destruction from ammunition explosions

---

## Requirements

### Requirement: Ammunition Type Classification
All ammunition SHALL be classified by weapon compatibility and special characteristics.

**Rationale**: Different weapon systems use different ammunition types with varying capabilities, shots per ton, and special effects. Type classification enables proper weapon compatibility validation and combat mechanics.

**Priority**: Critical

#### Scenario: Standard ballistic ammunition
**GIVEN** ammunition for Autocannon weapon
**WHEN** type is "Standard AC/10 Ammo"
**THEN** it SHALL be compatible with AC/10 weapons only
**AND** it SHALL provide 10 shots per ton
**AND** it SHALL weigh 1.0 ton
**AND** it SHALL require 1 critical slot per ton
**AND** it SHALL be available to both Inner Sphere and Clan

#### Scenario: Artemis IV-compatible missile ammunition
**GIVEN** ammunition for LRM weapon with Artemis IV
**WHEN** type is "LRM Ammo (Artemis IV)"
**THEN** it SHALL be compatible only with LRM launchers equipped with Artemis IV FCS
**AND** it SHALL provide 120 shots per ton (same as standard)
**AND** it SHALL weigh 1.0 ton
**AND** it SHALL require 1 critical slot per ton
**AND** it SHALL improve missile accuracy when used

#### Scenario: Specialty ammunition types
**GIVEN** ammunition with special properties
**WHEN** type is "AC/20 Precision Ammo"
**THEN** it SHALL be compatible only with AC/20 weapons
**AND** it SHALL provide reduced shots per ton (4 shots vs standard 5)
**AND** it SHALL weigh 1.0 ton
**AND** it SHALL require Advanced rules level
**AND** it SHALL provide enhanced accuracy

#### Scenario: Machine Gun ammunition half-ton exception
**GIVEN** ammunition for Machine Gun weapon
**WHEN** type is "Machine Gun Ammo"
**THEN** it SHALL be available in 0.5 ton increments (not 1.0 ton)
**AND** each 0.5 ton SHALL provide 100 shots
**AND** each 0.5 ton SHALL require 1 critical slot
**AND** it SHALL be the only ammunition type allowing partial tons

### Requirement: Shots Per Ton Calculation
Ammunition SHALL provide a specific number of shots based on weapon type and tech base.

**Rationale**: BattleTech construction rules specify exact shot counts per ton for each weapon system, with Clan ammunition typically providing more shots than Inner Sphere equivalents.

**Priority**: Critical

#### Scenario: Autocannon ammunition shot count
**GIVEN** Inner Sphere Autocannon ammunition
**WHEN** weapon type is AC/2
**THEN** shots per ton SHALL be 45
**WHEN** weapon type is AC/5
**THEN** shots per ton SHALL be 20
**WHEN** weapon type is AC/10
**THEN** shots per ton SHALL be 10
**WHEN** weapon type is AC/20
**THEN** shots per ton SHALL be 5

#### Scenario: Missile launcher ammunition shot count
**GIVEN** LRM ammunition
**WHEN** launcher size is any
**THEN** shots per ton SHALL be 120 (all LRM sizes use same ammo)
**GIVEN** SRM ammunition
**WHEN** launcher size is any
**THEN** shots per ton SHALL be 100 (all SRM sizes use same ammo)

#### Scenario: Clan ammunition increased capacity
**GIVEN** Clan LRM ammunition
**WHEN** calculating shots per ton
**THEN** shots per ton SHALL be 120 (same as Inner Sphere for LRM)
**GIVEN** Clan SRM ammunition
**WHEN** calculating shots per ton
**THEN** shots per ton SHALL be 100 (same as Inner Sphere for SRM)
**GIVEN** Clan Autocannon ammunition
**WHEN** weapon type is UAC/2
**THEN** shots per ton SHALL be 45 (same as IS AC/2)

#### Scenario: Gauss Rifle ammunition
**GIVEN** Gauss Rifle ammunition
**WHEN** calculating shots per ton
**THEN** shots per ton SHALL be 8 for standard Gauss
**AND** shots per ton SHALL be 8 for Clan ER Gauss (same as IS)

### Requirement: Critical Slot Allocation
Ammunition SHALL occupy critical slots based on tonnage at 1 slot per ton.

**Rationale**: Ammunition storage follows simple allocation rules: each ton requires exactly one critical slot, regardless of weapon type or ammunition variety.

**Priority**: Critical

#### Scenario: Standard ammunition slot allocation
**GIVEN** 1 ton of ammunition
**WHEN** allocating to critical slots
**THEN** it SHALL require exactly 1 critical slot
**AND** slot MAY be in any location with available space

#### Scenario: Multiple ammunition bins
**GIVEN** 3 tons of LRM ammunition
**WHEN** placing in mech locations
**THEN** total slots required SHALL be 3
**AND** bins MAY be split across multiple locations
**AND** each ton is tracked as separate bin for explosion purposes

#### Scenario: Machine Gun ammunition half-ton slots
**GIVEN** 0.5 ton of Machine Gun ammunition
**WHEN** allocating to critical slots
**THEN** it SHALL require exactly 1 critical slot
**AND** weight SHALL be 0.5 ton but slot count SHALL be 1

#### Scenario: Ammunition cannot share slots
**GIVEN** multiple ammunition bins
**WHEN** allocating to critical slots
**THEN** each bin SHALL occupy its own dedicated slot(s)
**AND** ammunition SHALL NOT share slots with other equipment
**AND** ammunition SHALL NOT occupy fractional slots

### Requirement: Weapon Compatibility Validation
Ammunition SHALL only be usable by compatible weapon systems.

**Rationale**: Each weapon type requires specific ammunition. Incompatible ammunition cannot be loaded or used, preventing configuration errors.

**Priority**: Critical

#### Scenario: Exact weapon type match
**GIVEN** AC/10 ammunition
**WHEN** validating compatibility
**THEN** it SHALL be compatible with AC/10 weapons
**AND** it SHALL NOT be compatible with AC/5 or AC/20
**AND** it SHALL NOT be compatible with Gauss Rifle or LRM

#### Scenario: Launcher family compatibility
**GIVEN** LRM ammunition
**WHEN** validating compatibility
**THEN** it SHALL be compatible with LRM/5, LRM/10, LRM/15, LRM/20
**AND** all launcher sizes use same ammunition type
**AND** one ammunition bin can support multiple LRM launchers

#### Scenario: Artemis IV compatibility restriction
**GIVEN** LRM ammunition with Artemis IV
**WHEN** validating compatibility
**THEN** it SHALL only be compatible with LRM launchers equipped with Artemis IV FCS
**AND** it SHALL NOT be usable by standard LRM launchers
**AND** standard LRM ammo CAN be used by Artemis IV launchers (degraded performance)

#### Scenario: Specialty ammunition restrictions
**GIVEN** Precision ammunition for AC/10
**WHEN** validating compatibility
**THEN** it SHALL be compatible with AC/10 weapons
**AND** it SHALL require Advanced rules level
**AND** it MAY be mixed with standard AC/10 ammunition
**AND** unit must track ammunition types separately

### Requirement: Tech Base Matching
Ammunition tech base SHALL match or be compatible with weapon tech base.

**Rationale**: Inner Sphere and Clan weapons use different ammunition specifications. Tech base matching prevents invalid combinations while allowing Mixed Tech units flexibility.

**Priority**: High

#### Scenario: Inner Sphere weapon with IS ammunition
**GIVEN** Inner Sphere AC/10 weapon
**WHEN** selecting ammunition
**THEN** Inner Sphere AC/10 ammunition SHALL be valid
**AND** Clan AC/10 ammunition SHALL NOT be valid
**AND** tech base MUST match weapon

#### Scenario: Clan weapon with Clan ammunition
**GIVEN** Clan Ultra AC/5 weapon
**WHEN** selecting ammunition
**THEN** Clan UAC/5 ammunition SHALL be valid
**AND** Inner Sphere AC/5 ammunition SHALL NOT be valid
**AND** tech base MUST match weapon

#### Scenario: Mixed Tech unit ammunition selection
**GIVEN** Mixed Tech unit with both IS and Clan weapons
**WHEN** configuring ammunition
**THEN** each ammunition bin MUST match its weapon's tech base
**AND** unit MAY carry both IS and Clan ammunition simultaneously
**AND** ammunition SHALL be tracked separately by tech base
**AND** validation MUST ensure each weapon has compatible ammunition

### Requirement: Ammunition Placement Rules
Ammunition MAY be placed in any location with available critical slots.

**Rationale**: Ammunition can be stored anywhere in the mech for weight distribution and redundancy, unlike fixed system components. However, placement affects explosion risk.

**Priority**: High

#### Scenario: Flexible ammunition placement
**GIVEN** ammunition bins to allocate
**WHEN** selecting placement locations
**THEN** ammunition MAY be placed in any location (CT, LT, RT, LA, RA, LL, RL, HD)
**AND** placement is valid as long as critical slots are available
**AND** multiple bins MAY be placed in same location

#### Scenario: Head location ammunition (risky)
**GIVEN** ammunition bin
**WHEN** placing in Head location
**THEN** placement SHALL be valid
**AND** system SHOULD warn user about explosion risk
**AND** Head location has only 6 slots total (limited capacity)

#### Scenario: Torso ammunition storage (common)
**GIVEN** ammunition bins
**WHEN** placing in torso locations (CT, LT, RT)
**THEN** placement SHALL be valid
**AND** torso locations provide good capacity (12 slots each in LT/RT)
**AND** CASE protection is recommended for torso ammunition

#### Scenario: Leg ammunition storage (safe)
**GIVEN** ammunition bins
**WHEN** placing in leg locations (LL, RL)
**THEN** placement SHALL be valid
**AND** legs provide safer storage (6 slots each)
**AND** leg destruction from ammunition explosion is less critical than torso

### Requirement: CASE Protection System
CASE equipment SHALL vent ammunition explosions to prevent catastrophic damage.

**Rationale**: CASE is a critical safety system that redirects ammunition explosion force outward, preventing internal chain reactions while sacrificing armor at the explosion location.

**Priority**: High

#### Scenario: CASE installation in location
**GIVEN** a mech location with ammunition
**WHEN** CASE is installed in that location
**THEN** CASE SHALL occupy 1 critical slot in the location
**AND** CASE SHALL weigh 0.5 tons
**AND** CASE SHALL protect all ammunition in that location
**AND** CASE SHALL be Inner Sphere technology only

#### Scenario: Ammunition explosion with CASE
**GIVEN** location with ammunition and CASE
**WHEN** ammunition explodes due to critical hit
**THEN** explosion SHALL vent outward through CASE
**AND** location SHALL lose all remaining armor
**AND** location internal structure SHALL remain intact
**AND** explosion SHALL NOT propagate to other locations
**AND** other equipment in location SHALL be destroyed

#### Scenario: Ammunition explosion without CASE
**GIVEN** location with ammunition but no CASE
**WHEN** ammunition explodes due to critical hit
**THEN** explosion SHALL destroy location completely
**AND** adjacent locations SHALL take damage
**AND** mech MAY be destroyed if Center Torso explodes
**AND** explosion damage propagates internally

#### Scenario: CASE II advanced protection
**GIVEN** location with ammunition and CASE II
**WHEN** ammunition explodes due to critical hit
**THEN** explosion SHALL vent outward safely
**AND** location SHALL lose some armor (half total)
**AND** location internal structure SHALL remain intact
**AND** other equipment in location SHALL remain functional
**AND** CASE II provides superior protection vs CASE

### Requirement: Weight Calculation
Ammunition weight SHALL be calculated based on tonnage allocated.

**Rationale**: Ammunition is purchased and allocated in tons, with direct weight contribution to mech tonnage. Machine Gun ammunition is the only exception with half-ton increments.

**Priority**: Critical

#### Scenario: Standard ammunition weight
**GIVEN** 3 tons of AC/10 ammunition allocated
**WHEN** calculating weight
**THEN** total weight SHALL be 3.0 tons
**AND** each ton contributes exactly 1.0 ton to mech weight

#### Scenario: Machine Gun ammunition half-ton weight
**GIVEN** 2 bins of Machine Gun ammunition (0.5 ton each)
**WHEN** calculating weight
**THEN** total weight SHALL be 1.0 ton
**AND** each bin contributes 0.5 ton to mech weight
**AND** each bin still requires 1 critical slot

#### Scenario: Mixed ammunition types weight
**GIVEN** 2 tons standard AC/20 ammo and 1 ton Precision AC/20 ammo
**WHEN** calculating weight
**THEN** total weight SHALL be 3.0 tons
**AND** ammunition type does not affect weight
**AND** all ammunition weighs 1.0 ton per ton (except MG)

### Requirement: Ammunition Capacity Planning
Units SHOULD carry sufficient ammunition for weapon loadout and mission duration.

**Rationale**: While not strictly enforced, ammunition capacity planning is critical for combat effectiveness. Systems should help users understand ammunition consumption rates.

**Priority**: Medium

#### Scenario: Autocannon ammunition consumption estimate
**GIVEN** AC/20 weapon with 5 shots per ton
**WHEN** estimating ammunition needs
**THEN** 1 ton provides 5 turns of firing
**AND** 10-turn engagement needs 2 tons minimum
**AND** system SHOULD display turns of fire available

#### Scenario: Missile launcher ammunition sharing
**GIVEN** 2x LRM/15 launchers
**WHEN** planning ammunition
**THEN** both launchers MAY share ammunition bins
**AND** 1 ton (120 shots) provides 4 turns of firing both launchers
**AND** system SHOULD calculate total consumption rate

#### Scenario: Insufficient ammunition warning
**GIVEN** weapon configuration
**WHEN** ammunition allocation is very low
**THEN** system SHOULD warn if less than 1 ton per weapon
**AND** warning severity increases if less than 10 turns of fire
**AND** user MAY proceed despite warning (not an error)

---

## Data Model Requirements

### Required Interfaces

```typescript
/**
 * Ammunition type enumeration
 */
enum AmmunitionType {
  // Standard ammunition
  STANDARD = 'Standard',

  // Guided/precision ammunition
  ARTEMIS_IV = 'Artemis IV',
  NARC_GUIDED = 'NARC Guided',
  PRECISION = 'Precision',

  // Specialty ammunition
  ARMOR_PIERCING = 'Armor-Piercing',
  FLECHETTE = 'Flechette',
  INCENDIARY = 'Incendiary',
  SMOKE = 'Smoke',
  SWARM = 'Swarm',
  SWARM_I = 'Swarm-I',
  THUNDER = 'Thunder',
  THUNDER_AUGMENTED = 'Thunder Augmented',
  THUNDER_INFERNO = 'Thunder Inferno',
  THUNDER_VIBRABOMB = 'Thunder Vibrabomb',

  // Missile specialty
  DEAD_FIRE = 'Dead-Fire',
  FRAGMENTATION = 'Fragmentation',
  HEAT_SEEKING = 'Heat-Seeking',
  LISTEN_KILL = 'Listen-Kill',
  SEMI_GUIDED = 'Semi-Guided',

  // Autocannon specialty
  CASELESS = 'Caseless',
  TRACER = 'Tracer'
}

/**
 * Weapon family classification for ammunition compatibility
 */
enum WeaponFamily {
  AUTOCANNON = 'Autocannon',
  LRM = 'LRM',
  SRM = 'SRM',
  MRM = 'MRM',
  GAUSS = 'Gauss',
  MACHINE_GUN = 'Machine Gun',
  LBX = 'LBX Autocannon',
  ULTRA_AC = 'Ultra Autocannon',
  ROTARY_AC = 'Rotary Autocannon',
  ATM = 'ATM',
  ARROW_IV = 'Arrow IV',
  LONG_TOM = 'Long Tom',
  SNIPER = 'Sniper',
  THUMPER = 'Thumper',
  NARC = 'NARC',
  THUNDERBOLT = 'Thunderbolt'
}

/**
 * Ammunition component interface
 * Extends base entity interfaces with ammunition-specific properties
 */
interface IAmmunition extends
  ITechBaseEntity,
  IPlaceableComponent,
  IValuedComponent,
  ITemporalEntity {
  /**
   * Type/variant of ammunition
   */
  readonly ammoType: AmmunitionType;

  /**
   * Weapon family this ammunition is compatible with
   * @example WeaponFamily.AUTOCANNON
   */
  readonly weaponFamily: WeaponFamily;

  /**
   * Specific weapon types this ammunition works with
   * @example ["AC/10", "AC/10 (Clan)"]
   */
  readonly compatibleWeapons: string[];

  /**
   * Number of shots provided per ton
   * @minimum 1
   * @example 10 (for AC/10), 120 (for LRM), 100 (for MG half-ton)
   */
  readonly shotsPerTon: number;

  /**
   * Weight per ton of ammunition
   * Almost always 1.0, except Machine Gun (0.5)
   * @example 1.0
   */
  readonly weight: number;

  /**
   * Critical slots required per ton
   * Always 1 slot per ton (or per 0.5 ton for MG)
   * @example 1
   */
  readonly criticalSlots: number;

  /**
   * Can this ammunition type be mixed with other types
   * Standard ammo: true, Specialty ammo: true but tracked separately
   */
  readonly mixable: boolean;

  /**
   * Requires Artemis IV FCS on launcher
   */
  readonly requiresArtemisIV?: boolean;

  /**
   * Requires NARC beacon on target
   */
  readonly requiresNARC?: boolean;

  /**
   * Description of ammunition effects/characteristics
   */
  readonly description?: string;
}

/**
 * Ammunition bin - represents one allocation of ammunition
 */
interface IAmmunitionBin {
  /**
   * Unique identifier for this ammunition bin
   */
  readonly id: string;

  /**
   * Ammunition type in this bin
   */
  readonly ammunition: IAmmunition;

  /**
   * Amount in tons (usually 1.0, or 0.5 for MG)
   * @minimum 0.5
   */
  readonly tonnage: number;

  /**
   * Current shot count
   * Calculated as tonnage * ammunition.shotsPerTon
   */
  readonly currentShots: number;

  /**
   * Maximum shot capacity
   * Same as currentShots at full capacity
   */
  readonly maxShots: number;

  /**
   * Location where this bin is placed
   */
  readonly location: MechLocation;

  /**
   * Critical slot index occupied
   */
  readonly slotIndex: number;

  /**
   * Is this bin protected by CASE
   */
  readonly hasCASE: boolean;

  /**
   * Is this bin protected by CASE II
   */
  readonly hasCASEII: boolean;
}

/**
 * CASE (Cellular Ammunition Storage Equipment)
 */
interface ICASE extends
  ITechBaseEntity,
  IPlaceableComponent {
  /**
   * CASE variant
   */
  readonly caseType: 'CASE' | 'CASE II';

  /**
   * Weight in tons
   * CASE: 0.5, CASE II: 1.0
   */
  readonly weight: number;

  /**
   * Critical slots required
   * Always 1 slot
   */
  readonly criticalSlots: number;

  /**
   * Location where CASE is installed
   */
  readonly location: MechLocation;

  /**
   * Armor damage on explosion
   * CASE: all armor lost, CASE II: half armor lost
   */
  readonly armorLossOnExplosion: 'all' | 'half';

  /**
   * Structure damage on explosion
   * Both CASE and CASE II prevent structure damage
   */
  readonly structureDamageOnExplosion: boolean;

  /**
   * Equipment destruction on explosion
   * CASE: all destroyed, CASE II: all protected
   */
  readonly equipmentProtection: boolean;
}

/**
 * Ammunition configuration for entire unit
 */
interface IAmmunitionConfiguration {
  /**
   * All ammunition bins on unit
   */
  readonly bins: IAmmunitionBin[];

  /**
   * Total ammunition weight in tons
   */
  readonly totalWeight: number;

  /**
   * Total critical slots used by ammunition
   */
  readonly totalSlots: number;

  /**
   * CASE installations by location
   */
  readonly caseByLocation: Map<MechLocation, ICASE>;

  /**
   * Ammunition grouped by weapon compatibility
   */
  readonly ammunitionByWeapon: Map<string, IAmmunitionBin[]>;
}
```

### Required Properties

| Property | Type | Required | Description | Valid Values | Default |
|----------|------|----------|-------------|--------------|---------|
| `ammoType` | `AmmunitionType` | Yes | Ammunition variant | Enum value | STANDARD |
| `weaponFamily` | `WeaponFamily` | Yes | Compatible weapon family | Enum value | - |
| `compatibleWeapons` | `string[]` | Yes | Specific compatible weapons | Non-empty array | - |
| `shotsPerTon` | `number` | Yes | Shots per ton | >= 1 | - |
| `weight` | `number` | Yes | Weight per ton | 0.5 or 1.0 | 1.0 |
| `criticalSlots` | `number` | Yes | Slots per ton | 1 | 1 |
| `mixable` | `boolean` | Yes | Can mix with other types | true/false | true |
| `tonnage` | `number` | Yes | Bin size in tons | 0.5, 1.0, 2.0, etc. | 1.0 |
| `currentShots` | `number` | Yes | Current ammunition count | >= 0 | tonnage * shotsPerTon |
| `maxShots` | `number` | Yes | Maximum shots | >= currentShots | tonnage * shotsPerTon |
| `location` | `MechLocation` | Yes | Placement location | Enum value | - |
| `hasCASE` | `boolean` | Yes | CASE protection | true/false | false |
| `hasCASEII` | `boolean` | Yes | CASE II protection | true/false | false |

### Type Constraints

- `tonnage` MUST be multiple of 0.5 for Machine Gun ammo, 1.0 for all others
- `criticalSlots` MUST always be 1 per ton (or per 0.5 ton for MG)
- `weight` MUST be 0.5 for Machine Gun ammo, 1.0 for all other types
- `currentShots` MUST be <= maxShots
- `maxShots` MUST equal tonnage * shotsPerTon
- `hasCASE` and `hasCASEII` SHALL NOT both be true (mutually exclusive)
- `compatibleWeapons` array MUST NOT be empty
- `shotsPerTon` MUST be positive integer
- `ammoType` STANDARD is compatible with all weapon variants
- Specialty ammo types MAY have reduced shotsPerTon

---

## Calculation Formulas

### Total Shots Calculation

**Formula**:
```
totalShots = tonnage * shotsPerTon
```

**Where**:
- `tonnage` = Amount of ammunition in tons (0.5, 1.0, 2.0, etc.)
- `shotsPerTon` = Shots provided per ton (weapon-specific)

**Example 1**:
```
Input: tonnage = 2.0, weapon = AC/10, shotsPerTon = 10
Calculation: 2.0 * 10 = 20
Output: totalShots = 20 shots
```

**Example 2**:
```
Input: tonnage = 1.0, weapon = LRM, shotsPerTon = 120
Calculation: 1.0 * 120 = 120
Output: totalShots = 120 shots
```

**Example 3**:
```
Input: tonnage = 0.5, weapon = Machine Gun, shotsPerTon = 100
Calculation: 0.5 * 100 = 50
Output: totalShots = 50 shots
```

**Special Cases**:
- Machine Gun ammo: Only ammunition allowing 0.5 ton increments
- Precision ammo: Often has reduced shotsPerTon (e.g., AC/20 Precision = 4 vs standard 5)

**Rounding Rules**:
- Result is always integer (no rounding needed - inputs guarantee integer result)

### Ammunition Weight Calculation

**Formula**:
```
ammunitionWeight = SUM(bin.tonnage) for all ammunition bins
```

**Where**:
- `bin.tonnage` = Weight of each ammunition bin (0.5 or 1.0 tons typically)

**Example**:
```
Input:
  Bin 1: 2 tons AC/10 ammo
  Bin 2: 1 ton LRM ammo
  Bin 3: 1 ton SRM ammo
  Bin 4: 0.5 ton MG ammo

Calculation: 2.0 + 1.0 + 1.0 + 0.5 = 4.5
Output: ammunitionWeight = 4.5 tons
```

**Special Cases**:
- Only weight is summed; ammunition type does not affect weight
- Machine Gun ammo is only type allowing fractional tons

**Rounding Rules**:
- Store full precision (to 0.5 ton increments)
- Display rounded to 1 decimal place

### Critical Slots Calculation

**Formula**:
```
ammunitionSlots = COUNT(bins)
```

**Where**:
- `bins` = All ammunition bins on unit
- Each bin occupies exactly 1 slot regardless of tonnage

**Example**:
```
Input:
  Bin 1: 2 tons AC/10 ammo (counts as 2 bins of 1 ton each)
  Bin 2: 1 ton LRM ammo
  Bin 3: 0.5 ton MG ammo

Calculation:
  - 2 tons AC/10 = 2 bins = 2 slots
  - 1 ton LRM = 1 bin = 1 slot
  - 0.5 ton MG = 1 bin = 1 slot
  Total: 2 + 1 + 1 = 4

Output: ammunitionSlots = 4 critical slots
```

**Special Cases**:
- Even 0.5 ton Machine Gun ammo requires full 1 slot
- Multi-ton allocations must be split into 1-ton bins
- Each bin is tracked separately for explosion purposes

**Rounding Rules**:
- Always integer result (bins are discrete)

### Firing Duration Estimate

**Formula**:
```
turnsOfFire = FLOOR(totalShots / shotsPerFiring)
```

**Where**:
- `totalShots` = Sum of all compatible ammunition bin shots
- `shotsPerFiring` = Shots consumed per weapon firing (usually 1)

**Example 1**:
```
Input: 2 tons AC/10 ammo (20 shots total), AC/10 fires 1 shot per turn
Calculation: FLOOR(20 / 1) = 20
Output: turnsOfFire = 20 turns
```

**Example 2**:
```
Input: 1 ton LRM ammo (120 shots), 2x LRM/15 launchers (30 missiles per turn)
Calculation: FLOOR(120 / 30) = 4
Output: turnsOfFire = 4 turns
```

**Special Cases**:
- Multiple weapons sharing ammunition reduce duration
- Ultra Autocannons in Ultra mode consume 2 shots per turn
- Rotary Autocannons can consume up to 6 shots per turn

**Rounding Rules**:
- Use FLOOR to avoid partial turn optimism

---

## Validation Rules

### Validation: Weapon Compatibility

**Rule**: All ammunition must be compatible with at least one weapon on unit

**Severity**: Warning (ammunition without weapon is legal but useless)

**Condition**:
```typescript
const weapons = unit.equipment.filter(e => e.type === 'Weapon');
const unusableAmmo = unit.ammunition.filter(ammo => {
  return !weapons.some(weapon =>
    ammo.compatibleWeapons.includes(weapon.name)
  );
});

if (unusableAmmo.length > 0) {
  // emit warning
}
```

**Error Message**: "Ammunition '{ammoName}' has no compatible weapon on unit"

**User Action**: Add compatible weapon or remove ammunition

### Validation: Tech Base Matching

**Rule**: Ammunition tech base must match weapon tech base

**Severity**: Error

**Condition**:
```typescript
for (const ammoBin of unit.ammunition) {
  const compatibleWeapons = unit.weapons.filter(w =>
    ammoBin.ammunition.compatibleWeapons.includes(w.name)
  );

  for (const weapon of compatibleWeapons) {
    if (ammoBin.ammunition.techBase !== weapon.techBase) {
      // invalid - emit error
    }
  }
}
```

**Error Message**: "Ammunition tech base ({ammoTechBase}) does not match weapon tech base ({weaponTechBase})"

**User Action**: Use ammunition matching weapon's tech base

### Validation: Artemis IV Requirements

**Rule**: Artemis IV ammunition requires launcher with Artemis IV FCS

**Severity**: Error

**Condition**:
```typescript
if (ammunition.requiresArtemisIV) {
  const hasArtemisLauncher = unit.weapons.some(w =>
    w.hasArtemisIV && ammunition.compatibleWeapons.includes(w.baseType)
  );

  if (!hasArtemisLauncher) {
    // invalid - emit error
  }
}
```

**Error Message**: "Artemis IV ammunition requires launcher equipped with Artemis IV FCS"

**User Action**: Add Artemis IV FCS to launcher or use standard ammunition

### Validation: Critical Slot Allocation

**Rule**: All ammunition bins must be allocated to valid critical slots

**Severity**: Error

**Condition**:
```typescript
for (const bin of unit.ammunition) {
  const slot = unit.criticalSlots[bin.location][bin.slotIndex];

  if (!slot || slot.equipment !== bin) {
    // invalid - emit error
  }

  if (!isLocationSlotAvailable(bin.location, bin.slotIndex)) {
    // invalid - emit error
  }
}
```

**Error Message**: "Ammunition bin not properly allocated to critical slot"

**User Action**: Allocate ammunition to available critical slot

### Validation: Machine Gun Ammunition Tonnage

**Rule**: Only Machine Gun ammunition may use half-ton increments

**Severity**: Error

**Condition**:
```typescript
if (ammunition.tonnage % 1.0 !== 0) {
  if (ammunition.weaponFamily !== WeaponFamily.MACHINE_GUN) {
    // invalid - emit error
  }
}
```

**Error Message**: "Only Machine Gun ammunition may be allocated in half-ton increments"

**User Action**: Use full-ton increments for non-MG ammunition

### Validation: CASE Installation

**Rule**: CASE can only be installed once per location

**Severity**: Error

**Condition**:
```typescript
const casePerLocation = new Map<MechLocation, number>();
for (const caseUnit of unit.equipment.filter(e => e.type === 'CASE')) {
  casePerLocation.set(
    caseUnit.location,
    (casePerLocation.get(caseUnit.location) || 0) + 1
  );
}

for (const [location, count] of casePerLocation) {
  if (count > 1) {
    // invalid - emit error
  }
}
```

**Error Message**: "Location {location} has multiple CASE installations (only 1 allowed)"

**User Action**: Remove duplicate CASE from location

### Validation: CASE Tech Base

**Rule**: CASE is Inner Sphere technology only (CASE II is mixed tech)

**Severity**: Error

**Condition**:
```typescript
if (caseEquipment.caseType === 'CASE' &&
    caseEquipment.techBase !== TechBase.INNER_SPHERE) {
  // invalid - emit error
}
```

**Error Message**: "CASE is Inner Sphere technology only"

**User Action**: Use CASE II for Clan/Mixed units, or remove CASE

### Validation: Sufficient Ammunition

**Rule**: Units should have ammunition for all weapons requiring it

**Severity**: Warning

**Condition**:
```typescript
const weaponsNeedingAmmo = unit.weapons.filter(w => w.requiresAmmunition);

for (const weapon of weaponsNeedingAmmo) {
  const compatibleAmmo = unit.ammunition.filter(ammo =>
    ammo.ammunition.compatibleWeapons.includes(weapon.name)
  );

  if (compatibleAmmo.length === 0) {
    // emit warning
  }

  const totalShots = compatibleAmmo.reduce((sum, bin) =>
    sum + bin.currentShots, 0
  );

  if (totalShots < 10) {  // Less than 10 turns of fire
    // emit warning
  }
}
```

**Error Message**: "Weapon '{weaponName}' has insufficient ammunition (less than 10 turns of fire)"

**User Action**: Add more ammunition for weapon

---

## Tech Base Variants

### Inner Sphere Ammunition

**Characteristics**:
- Standard shot counts per ton (baseline)
- CASE available for explosion protection (0.5 tons, 1 slot)
- Wide variety of specialty ammunition types
- Generally lower shot count than Clan equivalents

**Examples**:
- AC/10 Ammo: 10 shots/ton
- LRM Ammo: 120 shots/ton
- SRM Ammo: 100 shots/ton
- Gauss Ammo: 8 shots/ton

### Clan Ammunition

**Characteristics**:
- Generally same shot counts as Inner Sphere (not increased for most weapons)
- CASE II available (1.0 ton, 1 slot, superior protection)
- Some Clan-exclusive specialty types
- Compatible only with Clan weapons

**Examples**:
- Ultra AC/5 Ammo: 20 shots/ton (same as IS AC/5)
- LRM Ammo: 120 shots/ton (same as IS)
- SRM Ammo: 100 shots/ton (same as IS)
- Gauss Ammo: 8 shots/ton (same as IS)

**Key Differences**:
- CASE vs CASE II protection level
- Some specialty ammunition exclusive to each tech base
- Tech base compatibility restrictions enforce separate ammunition supplies

### Mixed Tech Rules

**When unit tech base is Mixed**:
- Unit MAY carry both Inner Sphere and Clan ammunition
- Each ammunition bin MUST match tech base of weapon it supports
- CASE (IS) and CASE II (Clan/Mixed) both available
- Ammunition bins tracked separately by tech base
- No mixing IS and Clan ammunition in single bin
- Validation MUST verify each weapon has compatible tech base ammunition

---

## Dependencies

### Defines
- **AmmunitionType enum**: Defines standard and specialty ammunition types
- **WeaponFamily enum**: Defines weapon categories for compatibility
- **IAmmunition interface**: Complete ammunition specification
- **IAmmunitionBin interface**: Individual ammunition allocation
- **ICASE interface**: Ammunition protection system
- **IAmmunitionConfiguration interface**: Unit ammunition configuration
- **Shots per ton specifications**: By weapon type and tech base
- **Ammunition placement rules**: Flexible location assignment
- **CASE/CASE II explosion mechanics**: Safety system behavior

### Depends On
- [Core Entity Types](../../phase-1-foundation/core-entity-types/spec.md) - Extends IEntity, ITechBaseEntity, IPlaceableComponent, IValuedComponent, ITemporalEntity
- [Core Enumerations](../../phase-1-foundation/core-enumerations/spec.md) - Uses TechBase, RulesLevel, Era enums
- [Critical Slot Allocation](../../phase-2-construction/critical-slot-allocation/spec.md) - Slot placement rules
- [Tech Base Integration](../../phase-2-construction/tech-base-integration/spec.md) - Tech base matching rules
- **Weapon System**: Weapon compatibility and ammunition requirements

### Used By
- **Weapon System**: Weapons reference compatible ammunition
- **Combat Mechanics**: Ammunition consumption and damage calculations
- **Construction Rules Core**: Weight and slot allocation validation
- **Damage System**: Ammunition explosion effects

### Construction Sequence
1. Define unit tech base (Inner Sphere, Clan, or Mixed)
2. Select and place weapons requiring ammunition
3. Determine ammunition needs based on weapon types
4. Allocate ammunition bins (1 ton = 1 slot, minimum 0.5 ton for MG)
5. Place ammunition in locations with available critical slots
6. Install CASE/CASE II in locations with ammunition (recommended)
7. Validate weapon compatibility and tech base matching
8. Calculate total ammunition weight and slot usage
9. Verify sufficient ammunition for expected engagement duration

---

## Implementation Notes

### Performance Considerations
- Ammunition calculations are O(n) where n = number of ammunition bins
- Weapon compatibility checking is O(w * a) where w = weapons, a = ammunition
- Cache compatible ammunition lists per weapon for efficiency
- Ammunition shot tracking requires mutable state (consumed during combat)

### Edge Cases
- **Zero ammunition**: Legal but weapon cannot fire
- **Machine Gun half-tons**: Only ammunition allowing 0.5 ton increments
- **Artemis IV mixed with standard**: Can mix ammo types, track separately
- **Multi-weapon ammunition sharing**: Multiple LRMs can share ammunition bins
- **CASE in location with no ammunition**: Legal but useless (warning)
- **Ammunition in Head**: Legal but very risky (explosion destroys mech)
- **Partial ton remainder**: Not allowed except Machine Gun (must round to full tons)

### Common Pitfalls
- **Pitfall**: Allowing fractional tons for non-MG ammunition
  - **Solution**: Enforce 1.0 ton minimum for all non-MG ammunition
- **Pitfall**: Counting multi-ton allocation as single bin
  - **Solution**: Split into separate 1-ton bins for explosion tracking
- **Pitfall**: Mixing tech base ammunition with weapons
  - **Solution**: Strict validation of tech base matching
- **Pitfall**: Forgetting CASE is IS-only
  - **Solution**: Validate CASE tech base restriction
- **Pitfall**: Installing multiple CASE in same location
  - **Solution**: Validate single CASE per location
- **Pitfall**: Not tracking ammunition types separately
  - **Solution**: Each ammunition bin is discrete entity with own properties

---

## Examples

### Example 1: Standard Autocannon Ammunition

**Input**:
```typescript
const ac10Ammo: IAmmunition = {
  id: 'ammo-ac10-standard-is',
  name: 'AC/10 Ammo',
  techBase: TechBase.INNER_SPHERE,
  rulesLevel: RulesLevel.INTRODUCTORY,
  ammoType: AmmunitionType.STANDARD,
  weaponFamily: WeaponFamily.AUTOCANNON,
  compatibleWeapons: ['AC/10'],
  shotsPerTon: 10,
  weight: 1.0,
  criticalSlots: 1,
  cost: 6000,
  battleValue: 0,
  mixable: true,
  introductionYear: 2443,
  era: Era.AGE_OF_WAR
};

const ammoBin: IAmmunitionBin = {
  id: 'bin-ac10-rt-1',
  ammunition: ac10Ammo,
  tonnage: 2.0,  // 2 tons
  currentShots: 20,  // 2 * 10
  maxShots: 20,
  location: MechLocation.RIGHT_TORSO,
  slotIndex: 5,
  hasCASE: true,
  hasCASEII: false
};
```

**Output**:
```typescript
const result = {
  weight: 2.0,  // 2 tons of ammunition
  slots: 2,     // 2 bins of 1 ton each = 2 slots
  shots: 20,    // Provides 20 shots for AC/10
  firingDuration: 20,  // 20 turns of continuous fire
  protected: true  // CASE installed in RT
};
```

### Example 2: LRM Ammunition for Multiple Launchers

**Input**:
```typescript
const lrmAmmo: IAmmunition = {
  id: 'ammo-lrm-standard-is',
  name: 'LRM Ammo',
  techBase: TechBase.INNER_SPHERE,
  rulesLevel: RulesLevel.INTRODUCTORY,
  ammoType: AmmunitionType.STANDARD,
  weaponFamily: WeaponFamily.LRM,
  compatibleWeapons: ['LRM/5', 'LRM/10', 'LRM/15', 'LRM/20'],
  shotsPerTon: 120,
  weight: 1.0,
  criticalSlots: 1,
  cost: 30000,
  battleValue: 0,
  mixable: true,
  introductionYear: 2295,
  era: Era.AGE_OF_WAR
};

const weapons = [
  { name: 'LRM/15', location: MechLocation.LEFT_TORSO },
  { name: 'LRM/15', location: MechLocation.RIGHT_TORSO }
];

const ammoBins = [
  {
    id: 'bin-lrm-lt-1',
    ammunition: lrmAmmo,
    tonnage: 1.0,
    currentShots: 120,
    maxShots: 120,
    location: MechLocation.LEFT_TORSO,
    slotIndex: 6,
    hasCASE: true,
    hasCASEII: false
  },
  {
    id: 'bin-lrm-rt-1',
    ammunition: lrmAmmo,
    tonnage: 1.0,
    currentShots: 120,
    maxShots: 120,
    location: MechLocation.RIGHT_TORSO,
    slotIndex: 6,
    hasCASE: true,
    hasCASEII: false
  }
];
```

**Processing**:
```typescript
// Total shots available
const totalShots = 120 + 120; // = 240

// Missiles fired per turn (both LRM/15s)
const missilesPerTurn = 15 + 15; // = 30

// Turns of sustained fire
const turnsOfFire = Math.floor(240 / 30); // = 8 turns

// Weight calculation
const totalWeight = 1.0 + 1.0; // = 2.0 tons

// Slot calculation
const totalSlots = 2; // 2 bins = 2 slots
```

**Output**:
```typescript
const result = {
  totalWeight: 2.0,
  totalSlots: 2,
  totalShots: 240,
  turnsOfFire: 8,
  missilesPerTurn: 30,
  distribution: 'LT: 120 shots, RT: 120 shots',
  caseProtection: 'Both locations protected'
};
```

### Example 3: Machine Gun Half-Ton Ammunition

**Input**:
```typescript
const mgAmmo: IAmmunition = {
  id: 'ammo-mg-standard-is',
  name: 'Machine Gun Ammo',
  techBase: TechBase.INNER_SPHERE,
  rulesLevel: RulesLevel.INTRODUCTORY,
  ammoType: AmmunitionType.STANDARD,
  weaponFamily: WeaponFamily.MACHINE_GUN,
  compatibleWeapons: ['Machine Gun'],
  shotsPerTon: 100,  // Per ton, but sold in 0.5 ton increments
  weight: 0.5,       // Half-ton per bin
  criticalSlots: 1,  // Still requires 1 full slot
  cost: 1000,
  battleValue: 0,
  mixable: true,
  introductionYear: 2439,
  era: Era.AGE_OF_WAR
};

const ammoBin: IAmmunitionBin = {
  id: 'bin-mg-la-1',
  ammunition: mgAmmo,
  tonnage: 0.5,      // Half-ton allocation
  currentShots: 50,  // 0.5 * 100
  maxShots: 50,
  location: MechLocation.LEFT_ARM,
  slotIndex: 11,
  hasCASE: false,    // MG ammo rarely needs CASE
  hasCASEII: false
};
```

**Output**:
```typescript
const result = {
  weight: 0.5,      // Half-ton only
  slots: 1,         // Still requires full slot
  shots: 50,        // 50 shots available
  firingDuration: 50,  // 50 turns of fire
  special: 'Only ammunition type allowing half-ton increments'
};
```

### Example 4: Artemis IV-Compatible Ammunition

**Input**:
```typescript
const artemisLRM: IAmmunition = {
  id: 'ammo-lrm-artemis-is',
  name: 'LRM Ammo (Artemis IV)',
  techBase: TechBase.INNER_SPHERE,
  rulesLevel: RulesLevel.STANDARD,
  ammoType: AmmunitionType.ARTEMIS_IV,
  weaponFamily: WeaponFamily.LRM,
  compatibleWeapons: ['LRM/5 (Artemis IV)', 'LRM/10 (Artemis IV)', 'LRM/15 (Artemis IV)', 'LRM/20 (Artemis IV)'],
  shotsPerTon: 120,  // Same as standard
  weight: 1.0,
  criticalSlots: 1,
  cost: 36000,       // More expensive than standard
  battleValue: 0,
  mixable: true,
  requiresArtemisIV: true,  // Requires Artemis FCS on launcher
  introductionYear: 2598,
  era: Era.STAR_LEAGUE
};

const weapon = {
  name: 'LRM/15',
  hasArtemisIV: true,  // Launcher equipped with Artemis IV FCS
  location: MechLocation.LEFT_TORSO
};

const ammoBin: IAmmunitionBin = {
  id: 'bin-lrm-artemis-lt-1',
  ammunition: artemisLRM,
  tonnage: 1.0,
  currentShots: 120,
  maxShots: 120,
  location: MechLocation.LEFT_TORSO,
  slotIndex: 7,
  hasCASE: true,
  hasCASEII: false
};
```

**Validation**:
```typescript
// Check Artemis IV requirement
if (artemisLRM.requiresArtemisIV && !weapon.hasArtemisIV) {
  // ERROR: "Artemis IV ammunition requires launcher with Artemis IV FCS"
}

// Valid configuration passes
const result = {
  valid: true,
  ammunition: 'LRM Ammo (Artemis IV)',
  weapon: 'LRM/15 (Artemis IV)',
  benefit: 'Improved accuracy with Artemis IV FCS',
  shotsAvailable: 120
};
```

### Example 5: Mixed Specialty Ammunition

**Input**:
```typescript
const standardAC20: IAmmunition = {
  id: 'ammo-ac20-standard-is',
  name: 'AC/20 Ammo',
  shotsPerTon: 5,
  weight: 1.0,
  // ... other properties
};

const precisionAC20: IAmmunition = {
  id: 'ammo-ac20-precision-is',
  name: 'AC/20 Precision Ammo',
  shotsPerTon: 4,  // Reduced capacity
  weight: 1.0,
  rulesLevel: RulesLevel.ADVANCED,
  // ... other properties
};

const ammoBins = [
  {
    id: 'bin-ac20-standard-rt-1',
    ammunition: standardAC20,
    tonnage: 2.0,
    currentShots: 10,  // 2 * 5
    location: MechLocation.RIGHT_TORSO,
    slotIndex: 5
  },
  {
    id: 'bin-ac20-precision-rt-2',
    ammunition: precisionAC20,
    tonnage: 1.0,
    currentShots: 4,   // 1 * 4
    location: MechLocation.RIGHT_TORSO,
    slotIndex: 7
  }
];
```

**Processing**:
```typescript
// Ammunition tracked separately
const standardShots = 10;
const precisionShots = 4;

// Pilot chooses which to use each turn
// Standard: normal accuracy, 10 shots available
// Precision: improved accuracy, 4 shots available

const totalWeight = 2.0 + 1.0; // = 3.0 tons
const totalSlots = 2 + 1;      // = 3 slots
```

**Output**:
```typescript
const result = {
  totalWeight: 3.0,
  totalSlots: 3,
  standardShots: 10,
  precisionShots: 4,
  tactical: 'Use precision for critical hits, standard for regular fire'
};
```

### Example 6: CASE Protection Configuration

**Input**:
```typescript
const caseRT: ICASE = {
  id: 'case-rt',
  name: 'CASE',
  techBase: TechBase.INNER_SPHERE,
  rulesLevel: RulesLevel.STANDARD,
  caseType: 'CASE',
  weight: 0.5,
  criticalSlots: 1,
  location: MechLocation.RIGHT_TORSO,
  armorLossOnExplosion: 'all',
  structureDamageOnExplosion: false,
  equipmentProtection: false,
  cost: 50000,
  battleValue: 0,
  introductionYear: 2476,
  era: Era.AGE_OF_WAR
};

const ammoBinsRT = [
  {
    tonnage: 2.0,
    ammunition: { name: 'AC/10 Ammo' },
    location: MechLocation.RIGHT_TORSO,
    hasCASE: true
  },
  {
    tonnage: 1.0,
    ammunition: { name: 'LRM Ammo' },
    location: MechLocation.RIGHT_TORSO,
    hasCASE: true
  }
];
```

**Explosion Scenario**:
```typescript
// Critical hit on ammunition bin in RT
const explosionResult = {
  location: MechLocation.RIGHT_TORSO,
  casProtection: true,
  effects: {
    armorLost: 'all',           // All RT armor destroyed
    structureDamage: 0,         // No structure damage (CASE protects)
    equipmentDestroyed: 'all',  // All equipment in RT destroyed
    adjacentDamage: 0,          // No damage to CT/RA (CASE vents outward)
    mechDestroyed: false        // Mech survives
  },
  without_CASE: {
    armorLost: 'all',
    structureDamage: 'all',     // RT destroyed completely
    adjacentDamage: 'high',     // CT and RA take damage
    mechDestroyed: 'possible'   // If CT structure fails
  }
};
```

**Output**:
```typescript
const result = {
  caseInstalled: true,
  caseWeight: 0.5,
  caseSlots: 1,
  protectedAmmunition: [
    '2 tons AC/10 Ammo',
    '1 ton LRM Ammo'
  ],
  explosionProtection: 'Vents outward, saves mech structure',
  recommendation: 'Always install CASE in locations with ammunition'
};
```

### Example 7: Validation Failure Cases

```typescript
// Case 1: Incompatible tech base
const invalidConfig1 = {
  weapon: {
    name: 'AC/10',
    techBase: TechBase.INNER_SPHERE
  },
  ammunition: {
    name: 'AC/10 Ammo (Clan)',
    techBase: TechBase.CLAN
  }
};
// Validation: FAIL
// Error: "Ammunition tech base (Clan) does not match weapon tech base (Inner Sphere)"

// Case 2: Artemis IV ammunition without Artemis FCS
const invalidConfig2 = {
  weapon: {
    name: 'LRM/15',
    hasArtemisIV: false
  },
  ammunition: {
    name: 'LRM Ammo (Artemis IV)',
    requiresArtemisIV: true
  }
};
// Validation: FAIL
// Error: "Artemis IV ammunition requires launcher equipped with Artemis IV FCS"

// Case 3: Non-MG ammunition in half-tons
const invalidConfig3 = {
  ammunition: {
    name: 'AC/10 Ammo',
    weaponFamily: WeaponFamily.AUTOCANNON
  },
  tonnage: 0.5  // ERROR: Only MG can use half-tons
};
// Validation: FAIL
// Error: "Only Machine Gun ammunition may be allocated in half-ton increments"

// Case 4: Multiple CASE in same location
const invalidConfig4 = {
  location: MechLocation.RIGHT_TORSO,
  equipment: [
    { name: 'CASE', location: MechLocation.RIGHT_TORSO },
    { name: 'CASE', location: MechLocation.RIGHT_TORSO }  // ERROR
  ]
};
// Validation: FAIL
// Error: "Location RT has multiple CASE installations (only 1 allowed)"

// Case 5: Ammunition without compatible weapon
const invalidConfig5 = {
  weapons: [
    { name: 'PPC' },
    { name: 'Medium Laser' }
    // No AC/10 weapon
  ],
  ammunition: [
    { name: 'AC/10 Ammo', compatibleWeapons: ['AC/10'] }
  ]
};
// Validation: WARNING (not error)
// Warning: "Ammunition 'AC/10 Ammo' has no compatible weapon on unit"
```

---

## References

### Official BattleTech Rules
- **TechManual**: Pages 205-214 - Ammunition types and specifications
- **TechManual**: Pages 177-179 - CASE/CASE II rules
- **Total Warfare**: Pages 136-137 - Ammunition explosion rules
- **BattleMech Manual**: Pages 39-40 - Ammunition construction rules
- **Tactical Operations**: Advanced ammunition types and specialty munitions

### Related Documentation
- `openspec/specs/core-entity-types/spec.md` - Base interface definitions
- `openspec/specs/critical-slot-allocation/spec.md` - Slot placement rules
- `openspec/specs/tech-base-integration/spec.md` - Tech base matching
- **Weapon System Specification**: Weapon compatibility and ammunition requirements

### Code References
- Types: `src/types/core/EquipmentInterfaces.ts`
- Ammunition data: `src/data/ammunition/`
- Validation: `src/services/validation/AmmunitionValidator.ts`

---

## Changelog

### Version 1.0 (2025-11-28)
- Initial specification
- Defined ammunition classification system (AmmunitionType, WeaponFamily enums)
- Established shots per ton specifications by weapon type
- Documented critical slot allocation rules (1 ton = 1 slot)
- Specified weight calculations (1.0 ton standard, 0.5 ton for MG)
- Defined weapon compatibility validation rules
- Documented tech base matching requirements
- Established CASE/CASE II protection mechanics
- Added special rules for Machine Gun half-ton ammunition
- Included Artemis IV and specialty ammunition requirements
- Provided 7 comprehensive examples covering common and edge cases
- Documented validation rules for weapon compatibility, tech base, and allocation
- Clarified ammunition bin tracking for explosion mechanics
- Specified ammunition placement flexibility (any location)
