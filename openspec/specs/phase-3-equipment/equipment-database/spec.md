# Equipment Database Specification

**Status**: Draft
**Version**: 1.0
**Last Updated**: 2025-11-28
**Dependencies**: Core Enumerations, Core Entity Types, Era Temporal System, Tech Base Integration, Weapon System, Ammunition System, Electronics System, Physical Weapons System
**Affects**: Equipment selection, component filtering, database queries, construction validation

---

## Overview

### Purpose
Defines the structure and operations of the equipment database system. Establishes how equipment data is organized, queried, and filtered to provide available equipment based on tech base, rules level, era, and physical constraints.

### Scope
**In Scope:**
- Equipment database interfaces (IEquipmentDatabase, IEquipmentEntry, IEquipmentQuery)
- Equipment entry structure and properties
- Equipment category and subcategory taxonomy
- Database query operations (search, filter, lookup)
- Equipment availability filtering (tech base, rules level, era, year)
- Compatibility queries (ammunition for weapons, tech base variants)
- Default equipment sets and starter templates
- Database validation rules (data integrity, required fields)

**Out of Scope:**
- Specific equipment data (defined in component-specific specs)
- Weapon damage calculations (covered in Weapon System spec)
- Ammunition mechanics (covered in Ammunition System spec)
- Electronics functionality (covered in Electronics System spec)
- Equipment placement logic (covered in Critical Slot Allocation spec)
- Construction rules validation (covered in Construction Rules Core spec)
- UI components for equipment selection (covered in UI Integration spec)

### Key Concepts
- **Equipment Database**: Central repository of all available equipment definitions
- **Equipment Entry**: Individual equipment item with complete metadata
- **Equipment Category**: Top-level classification (weapon, ammunition, electronics, physical)
- **Equipment Subcategory**: Detailed classification within category (e.g., energy weapon, ballistic weapon)
- **Equipment Query**: Search criteria for filtering equipment
- **Availability Filter**: Temporal, tech base, and rules level constraints
- **Compatibility Query**: Finding compatible equipment (e.g., ammo for weapon)

---

## Requirements

### Requirement: Equipment Database Structure
The system SHALL provide a centralized database interface for all equipment definitions.

**Rationale**: Equipment data must be organized, searchable, and filterable to enable efficient equipment selection during construction.

**Priority**: Critical

#### Scenario: Database initialization
**GIVEN** the application starts
**WHEN** the equipment database initializes
**THEN** it SHALL load all equipment entries
**AND** entries SHALL be indexed by id for fast lookup
**AND** entries SHALL be categorized for filtering
**AND** duplicate IDs SHALL cause initialization error

#### Scenario: Equipment lookup by ID
**GIVEN** an equipment database
**WHEN** looking up equipment by id
**THEN** return matching IEquipmentEntry if found
**AND** return undefined if not found
**AND** lookup SHALL be O(1) complexity

#### Scenario: Equipment search by name
**GIVEN** an equipment database
**WHEN** searching by partial name
**THEN** return all entries with matching name substring
**AND** search SHALL be case-insensitive
**AND** results SHALL be sorted alphabetically

### Requirement: Equipment Entry Structure
All equipment entries SHALL include basic identification, physical properties, tech properties, and category classification.

**Rationale**: Complete metadata enables filtering, validation, and display of equipment in construction interface.

**Priority**: Critical

#### Scenario: Complete equipment entry
**GIVEN** a new equipment entry
**WHEN** adding to database
**THEN** it MUST have id, name, category
**AND** it MUST have techBase, rulesLevel
**AND** it MUST have introductionYear, era
**AND** it MUST have weight, criticalSlots
**AND** it MAY have extinctionYear

#### Scenario: Equipment with type-specific properties
**GIVEN** a weapon equipment entry
**WHEN** defining the entry
**THEN** it SHALL include weapon-specific properties (damage, heat, range)
**AND** properties SHALL conform to Weapon System spec
**AND** category SHALL be EquipmentCategory.WEAPON

### Requirement: Equipment Category Taxonomy
The system SHALL organize equipment into hierarchical categories and subcategories.

**Rationale**: Category hierarchy enables progressive filtering and organized display of equipment options.

**Priority**: High

#### Scenario: Weapon category structure
**GIVEN** weapon equipment
**WHEN** categorizing
**THEN** category SHALL be WEAPON
**AND** subcategory SHALL be ENERGY, BALLISTIC, MISSILE, or other weapon type
**AND** further classification SHALL specify exact type (e.g., LASER, AUTOCANNON)

#### Scenario: Ammunition category structure
**GIVEN** ammunition equipment
**WHEN** categorizing
**THEN** category SHALL be AMMUNITION
**AND** subcategory SHALL indicate weapon type (e.g., AC_AMMO, LRM_AMMO)
**AND** variant SHALL specify ammo type (e.g., STANDARD, ARTEMIS_IV)

#### Scenario: Equipment category filtering
**GIVEN** a database query
**WHEN** filtering by category WEAPON
**THEN** return only entries with category WEAPON
**AND** exclude AMMUNITION, ELECTRONICS, PHYSICAL categories

### Requirement: Equipment Query Operations
The system SHALL support flexible query operations for filtering and searching equipment.

**Rationale**: Construction interface needs to filter equipment by multiple criteria simultaneously.

**Priority**: Critical

#### Scenario: Query by tech base
**GIVEN** equipment database with mixed tech base items
**WHEN** querying for techBase INNER_SPHERE
**THEN** return Inner Sphere equipment
**AND** exclude Clan equipment
**AND** include items compatible with Inner Sphere units

#### Scenario: Query by rules level
**GIVEN** equipment database
**WHEN** querying for rulesLevel STANDARD or lower
**THEN** return INTRODUCTORY and STANDARD equipment
**AND** exclude ADVANCED and EXPERIMENTAL equipment

#### Scenario: Query by era and year
**GIVEN** equipment database
**WHEN** querying for year 3025
**THEN** return equipment with introductionYear <= 3025
**AND** exclude equipment with extinctionYear < 3025
**AND** exclude equipment with introductionYear > 3025

#### Scenario: Combined query filters
**GIVEN** equipment database
**WHEN** querying with multiple filters (techBase, rulesLevel, year, category)
**THEN** apply ALL filters as logical AND
**AND** return only equipment matching all criteria

### Requirement: Physical Constraint Filtering
The system SHALL support filtering equipment by physical properties.

**Rationale**: Construction must respect weight and critical slot limits.

**Priority**: High

#### Scenario: Filter by maximum weight
**GIVEN** a query with maxWeight constraint
**WHEN** filtering equipment
**THEN** return only equipment with weight <= maxWeight
**AND** exclude heavier equipment

#### Scenario: Filter by maximum critical slots
**GIVEN** a query with maxCriticalSlots constraint
**WHEN** filtering equipment
**THEN** return only equipment with criticalSlots <= maxCriticalSlots
**AND** exclude equipment requiring more slots

#### Scenario: Filter by available tonnage
**GIVEN** a mech with 5 tons remaining
**WHEN** querying available weapons
**THEN** show weapons weighing 5 tons or less
**AND** hide weapons weighing more than 5 tons

### Requirement: Ammunition Compatibility Queries
The system SHALL provide queries to find compatible ammunition for weapons.

**Rationale**: Each weapon type requires specific ammunition. System must identify compatible ammo.

**Priority**: High

#### Scenario: Find ammunition for weapon
**GIVEN** a weapon entry (e.g., "AC/10")
**WHEN** querying compatible ammunition
**THEN** return all ammunition entries compatible with AC/10
**AND** include standard and special ammunition types
**AND** respect tech base and rules level constraints

#### Scenario: Ammunition with weapon type reference
**GIVEN** an ammunition entry
**WHEN** defining the entry
**THEN** it SHALL include weaponType property
**AND** weaponType SHALL match weapon id or type
**AND** ammo SHALL only be compatible with matching weapons

#### Scenario: Tech base ammunition compatibility
**GIVEN** Inner Sphere LRM launcher
**WHEN** querying compatible ammunition
**THEN** return Inner Sphere LRM ammunition
**AND** exclude Clan LRM ammunition (different damage/range)

### Requirement: Tech Base Variant Queries
The system SHALL support finding tech base variants of equipment.

**Rationale**: Many equipment types exist in both Inner Sphere and Clan variants with different properties.

**Priority**: Medium

#### Scenario: Find tech base variants
**GIVEN** an equipment entry (e.g., "ER Medium Laser IS")
**WHEN** querying tech base variants
**THEN** return Clan ER Medium Laser if exists
**AND** variants SHALL have different IDs
**AND** variants SHALL have same base name

#### Scenario: Equipment without variants
**GIVEN** equipment unique to one tech base
**WHEN** querying variants
**THEN** return empty array
**AND** do not create errors

### Requirement: Equipment Availability Rules
The system SHALL enforce temporal availability based on introduction and extinction years.

**Rationale**: Technology availability changes over timeline. Database must filter by campaign year.

**Priority**: High

#### Scenario: Available equipment in year
**GIVEN** campaign year 3025
**WHEN** querying available equipment
**THEN** include equipment with introductionYear <= 3025
**AND** exclude equipment with introductionYear > 3025
**AND** exclude equipment with extinctionYear < 3025

#### Scenario: Extinct technology
**GIVEN** Double Heat Sink (Star League) with extinctionYear 2865
**WHEN** querying for year 3025
**THEN** exclude this equipment
**AND** include reintroduced IS Double Heat Sink (introductionYear 3040) when year >= 3040

### Requirement: Default Equipment Sets
The system SHALL provide predefined equipment sets for common configurations.

**Rationale**: Quick-start templates accelerate construction for common loadouts.

**Priority**: Low

#### Scenario: Standard equipment set
**GIVEN** a request for standard equipment set
**WHEN** retrieving the set
**THEN** return collection of common equipment
**AND** include standard weapons, heat sinks, ammunition
**AND** all equipment SHALL be STANDARD rules level or lower

#### Scenario: Tech base specific defaults
**GIVEN** request for Inner Sphere starter set
**WHEN** retrieving equipment
**THEN** return only Inner Sphere equipment
**AND** include common IS weapons (Medium Laser, AC/5, LRM-10)

### Requirement: Database Validation
The system SHALL validate equipment data integrity on load and updates.

**Rationale**: Invalid data causes construction errors. Validation ensures database consistency.

**Priority**: High

#### Scenario: Required field validation
**GIVEN** equipment entry being loaded
**WHEN** validating entry
**THEN** verify all required fields present (id, name, category, techBase, rulesLevel, weight, criticalSlots, introductionYear, era)
**AND** emit error for missing required fields

#### Scenario: Unique ID validation
**GIVEN** multiple equipment entries
**WHEN** validating database
**THEN** verify all IDs are unique
**AND** emit error for duplicate IDs

#### Scenario: Temporal consistency validation
**GIVEN** equipment entry with extinctionYear
**WHEN** validating entry
**THEN** verify extinctionYear > introductionYear
**AND** emit error if extinction before introduction

---

## Data Model Requirements

### Required Interfaces

```typescript
/**
 * Equipment database interface
 */
interface IEquipmentDatabase {
  /**
   * Retrieve equipment by unique ID
   * @param id - Equipment identifier
   * @returns Equipment entry or undefined if not found
   */
  getById(id: string): IEquipmentEntry | undefined;

  /**
   * Search equipment by name (case-insensitive substring match)
   * @param name - Partial or full name
   * @returns Array of matching equipment entries
   */
  searchByName(name: string): IEquipmentEntry[];

  /**
   * Query equipment with filters
   * @param query - Query criteria
   * @returns Array of matching equipment entries
   */
  query(query: IEquipmentQuery): IEquipmentEntry[];

  /**
   * Get all equipment in category
   * @param category - Equipment category
   * @returns Array of equipment in category
   */
  getByCategory(category: EquipmentCategory): IEquipmentEntry[];

  /**
   * Find compatible ammunition for weapon
   * @param weaponId - Weapon equipment ID
   * @param query - Optional additional filters
   * @returns Array of compatible ammunition entries
   */
  getCompatibleAmmo(weaponId: string, query?: Partial<IEquipmentQuery>): IEquipmentEntry[];

  /**
   * Find tech base variants of equipment
   * @param equipmentId - Equipment ID
   * @returns Array of variant entries (different tech base, same base type)
   */
  getTechBaseVariants(equipmentId: string): IEquipmentEntry[];

  /**
   * Get all equipment entries
   * @returns Complete equipment array
   */
  getAll(): IEquipmentEntry[];
}

/**
 * Individual equipment entry in database
 * Extends core entity interfaces with equipment-specific properties
 */
interface IEquipmentEntry extends
  ITechBaseEntity,
  IPlaceableComponent,
  ITemporalEntity,
  IDocumentedEntity {

  /**
   * Equipment category
   */
  readonly category: EquipmentCategory;

  /**
   * Equipment subcategory (category-specific)
   */
  readonly subcategory?: string;

  /**
   * Type-specific properties (weapon, ammunition, electronics, etc.)
   * Use discriminated union based on category
   */
  readonly properties: EquipmentProperties;

  /**
   * Economic value
   */
  readonly cost?: number;
  readonly battleValue?: number;
}

/**
 * Equipment category enumeration
 */
enum EquipmentCategory {
  WEAPON = 'WEAPON',
  AMMUNITION = 'AMMUNITION',
  ELECTRONICS = 'ELECTRONICS',
  PHYSICAL = 'PHYSICAL',
  HEAT_MANAGEMENT = 'HEAT_MANAGEMENT',
  MOVEMENT = 'MOVEMENT'
}

/**
 * Type-specific equipment properties (discriminated union)
 */
type EquipmentProperties =
  | WeaponProperties
  | AmmunitionProperties
  | ElectronicsProperties
  | PhysicalWeaponProperties
  | HeatManagementProperties
  | MovementProperties;

/**
 * Weapon-specific properties
 */
interface WeaponProperties {
  readonly type: 'WEAPON';
  readonly damage: number;
  readonly heat: number;
  readonly minRange?: number;
  readonly shortRange: number;
  readonly mediumRange: number;
  readonly longRange: number;
  readonly weaponType: string; // e.g., 'LASER', 'AUTOCANNON', 'MISSILE'
  readonly subtype?: string; // e.g., 'MEDIUM_LASER', 'AC_10'
}

/**
 * Ammunition-specific properties
 */
interface AmmunitionProperties {
  readonly type: 'AMMUNITION';
  readonly weaponType: string; // Weapon this ammo is for
  readonly shotsPerTon: number;
  readonly damageModifier?: number;
  readonly rangeModifier?: number;
  readonly special?: string[]; // Special rules (e.g., 'ARTEMIS_IV', 'INFERNO')
}

/**
 * Electronics-specific properties
 */
interface ElectronicsProperties {
  readonly type: 'ELECTRONICS';
  readonly electronicsType: string; // 'TARGETING', 'ECM', 'C3', 'SPECIAL'
  readonly functionality: string; // Specific function
  readonly range?: number; // Effective range if applicable
}

/**
 * Physical weapon properties
 */
interface PhysicalWeaponProperties {
  readonly type: 'PHYSICAL';
  readonly physicalType: string; // 'MELEE', 'PUNCHING'
  readonly damage: number | string; // May be formula-based
}

/**
 * Heat management properties
 */
interface HeatManagementProperties {
  readonly type: 'HEAT_MANAGEMENT';
  readonly dissipation: number;
  readonly heatSinkType: string;
}

/**
 * Movement equipment properties
 */
interface MovementProperties {
  readonly type: 'MOVEMENT';
  readonly movementType: string; // 'JUMP_JET', 'MASC', 'TSM'
  readonly bonus?: number; // MP bonus or multiplier
}

/**
 * Equipment query criteria
 */
interface IEquipmentQuery {
  /**
   * Filter by equipment category
   */
  readonly category?: EquipmentCategory;

  /**
   * Filter by subcategory
   */
  readonly subcategory?: string;

  /**
   * Filter by tech base
   */
  readonly techBase?: TechBase;

  /**
   * Filter by maximum rules level (inclusive)
   */
  readonly maxRulesLevel?: RulesLevel;

  /**
   * Filter by campaign year (checks introduction/extinction)
   */
  readonly year?: number;

  /**
   * Filter by era
   */
  readonly era?: Era;

  /**
   * Filter by maximum weight
   */
  readonly maxWeight?: number;

  /**
   * Filter by maximum critical slots
   */
  readonly maxCriticalSlots?: number;

  /**
   * Search by name substring (case-insensitive)
   */
  readonly nameContains?: string;

  /**
   * Filter by specific IDs
   */
  readonly ids?: string[];
}
```

### Required Properties

| Property | Type | Required | Description | Valid Values | Default |
|----------|------|----------|-------------|--------------|---------|
| `id` | `string` | Yes | Unique identifier | Non-empty string | - |
| `name` | `string` | Yes | Human-readable name | Non-empty string | - |
| `category` | `EquipmentCategory` | Yes | Equipment category | WEAPON, AMMUNITION, ELECTRONICS, PHYSICAL, HEAT_MANAGEMENT, MOVEMENT | - |
| `subcategory` | `string` | No | Detailed classification | Category-specific | undefined |
| `techBase` | `TechBase` | Yes | Tech base | INNER_SPHERE, CLAN | - |
| `rulesLevel` | `RulesLevel` | Yes | Rules level | INTRODUCTORY, STANDARD, ADVANCED, EXPERIMENTAL | - |
| `weight` | `number` | Yes | Weight in tons | >= 0 | - |
| `criticalSlots` | `number` | Yes | Critical slots | Integer >= 0 | - |
| `introductionYear` | `number` | Yes | Introduction year | 2443-3250 | - |
| `extinctionYear` | `number` | No | Extinction year | 2443-3250 | undefined |
| `era` | `Era` | Yes | Era classification | Valid Era enum | - |
| `properties` | `EquipmentProperties` | Yes | Type-specific properties | Discriminated union | - |
| `cost` | `number` | No | Cost in C-Bills | >= 0 | undefined |
| `battleValue` | `number` | No | Battle Value | >= 0 | undefined |
| `description` | `string` | No | Description text | Any string | undefined |
| `sourceBook` | `string` | No | Source book name | Any string | undefined |
| `pageReference` | `number` | No | Page number | Positive integer | undefined |

### Type Constraints

- All IEquipmentEntry properties SHALL inherit constraints from parent interfaces (ITechBaseEntity, IPlaceableComponent, ITemporalEntity)
- `category` MUST be a valid EquipmentCategory enum value
- `properties.type` MUST match the category (WEAPON category → WeaponProperties)
- `subcategory` SHOULD be non-empty if provided
- Database SHALL contain no duplicate `id` values
- All required fields MUST be present for each entry

---

## Database Operations

### Lookup Operations

```typescript
// Get specific equipment
const medLaser = database.getById('med-laser-is');

// Search by name
const lasers = database.searchByName('laser');
// Returns: Medium Laser, Large Laser, ER Medium Laser, etc.

// Get category
const allWeapons = database.getByCategory(EquipmentCategory.WEAPON);
```

### Query Operations

```typescript
// Query Inner Sphere standard weapons available in 3025
const query: IEquipmentQuery = {
  category: EquipmentCategory.WEAPON,
  techBase: TechBase.INNER_SPHERE,
  maxRulesLevel: RulesLevel.STANDARD,
  year: 3025
};
const weapons = database.query(query);

// Query equipment that fits weight/slot constraints
const lightWeapons = database.query({
  category: EquipmentCategory.WEAPON,
  maxWeight: 1,
  maxCriticalSlots: 1
});

// Query by multiple categories (use separate queries)
const offensive = [
  ...database.query({ category: EquipmentCategory.WEAPON }),
  ...database.query({ category: EquipmentCategory.AMMUNITION })
];
```

### Compatibility Operations

```typescript
// Find ammo for LRM-10
const lrm10Ammo = database.getCompatibleAmmo('lrm-10-is', {
  year: 3025,
  maxRulesLevel: RulesLevel.STANDARD
});

// Find tech base variants
const clanVariant = database.getTechBaseVariants('er-med-laser-is');
// Returns: ER Medium Laser (Clan) if exists
```

---

## Validation Rules

### Validation: Required Fields Present
**Rule**: All equipment entries must have required fields

**Severity**: Error

**Condition**:
```typescript
const requiredFields = ['id', 'name', 'category', 'techBase', 'rulesLevel',
                        'weight', 'criticalSlots', 'introductionYear', 'era', 'properties'];
for (const field of requiredFields) {
  if (!(field in entry)) {
    // invalid - emit error
  }
}
```

**Error Message**: "Equipment entry missing required field: {field}"

**User Action**: Add missing required field to equipment definition

### Validation: Unique Equipment IDs
**Rule**: All equipment IDs must be unique across database

**Severity**: Error

**Condition**:
```typescript
const ids = new Set<string>();
for (const entry of allEntries) {
  if (ids.has(entry.id)) {
    // invalid - emit error (duplicate ID)
  }
  ids.add(entry.id);
}
```

**Error Message**: "Duplicate equipment ID: {id}"

**User Action**: Change equipment ID to unique value

### Validation: Properties Match Category
**Rule**: Equipment properties type must match category

**Severity**: Error

**Condition**:
```typescript
if (entry.category === EquipmentCategory.WEAPON &&
    entry.properties.type !== 'WEAPON') {
  // invalid - emit error
}
```

**Error Message**: "Equipment properties type does not match category"

**User Action**: Correct properties type or category

### Validation: Temporal Consistency
**Rule**: Extinction year must be after introduction year

**Severity**: Error

**Condition**:
```typescript
if (entry.extinctionYear !== undefined &&
    entry.extinctionYear <= entry.introductionYear) {
  // invalid - emit error
}
```

**Error Message**: "Equipment extinction year must be after introduction year"

**User Action**: Correct temporal values

---

## Tech Base Variants

### Inner Sphere Implementation
Inner Sphere equipment SHALL use `techBase: TechBase.INNER_SPHERE` and follow Inner Sphere technology progression timeline.

**Differences**:
- Many technologies lost during Succession Wars (extinctionYear values)
- Reintroduced technologies have later introduction years than original
- Generally heavier and less efficient than Clan equivalents

### Clan Implementation
Clan equipment SHALL use `techBase: TechBase.CLAN` and follow Clan technology timeline.

**Differences**:
- Continuous technology progression (fewer extinctionYear values)
- Earlier introduction years for advanced technology
- Generally lighter and more efficient than Inner Sphere equivalents
- Available to Inner Sphere starting 3050 (Clan Invasion era)

### Mixed Tech Rules
**When querying for Mixed Tech unit**:
- Include both Inner Sphere and Clan equipment
- Apply year filter to both tech bases
- Respect construction rules for mixing (defined in Construction Rules Core spec)

---

## Dependencies

### Depends On
- [Core Enumerations](../../phase-1-foundation/core-enumerations/spec.md) - Uses TechBase, RulesLevel, Era enums
- [Core Entity Types](../../phase-1-foundation/core-entity-types/spec.md) - Extends ITechBaseEntity, IPlaceableComponent, ITemporalEntity, IDocumentedEntity
- [Era Temporal System](../../phase-1-foundation/era-temporal-system/spec.md) - Uses temporal availability logic and era filtering
- [Tech Base Integration](../../phase-2-construction/tech-base-integration/spec.md) - Uses tech base compatibility rules
- **Weapon System** (Phase 3) - Uses weapon data structure for WeaponProperties
- **Ammunition System** (Phase 3) - Uses ammunition data structure for AmmunitionProperties
- **Electronics System** (Phase 3) - Uses electronics data structure for ElectronicsProperties
- **Physical Weapons System** (Phase 3) - Uses physical weapon data structure for PhysicalWeaponProperties

### Used By
- **Equipment Selection UI** (Phase 4) - Queries database for available equipment
- **Construction Validation** (Phase 2) - Validates equipment compatibility and availability
- **Unit Import/Export** (Phase 4) - Resolves equipment references
- **Campaign Rules** (Phase 4) - Filters equipment by campaign constraints

### Construction Sequence
1. Load core enumerations (TechBase, RulesLevel, Era)
2. Define core entity interfaces (ITechBaseEntity, IPlaceableComponent, ITemporalEntity)
3. Define temporal availability logic (Era Temporal System)
4. Define equipment-specific interfaces (Weapon, Ammunition, Electronics, Physical Weapons)
5. Implement equipment database with all entries
6. Initialize database on application startup
7. Use database for equipment selection and validation

---

## Implementation Notes

### Performance Considerations
- **Index by ID**: Use Map<string, IEquipmentEntry> for O(1) lookup
- **Category indexes**: Pre-build Map<EquipmentCategory, IEquipmentEntry[]> for fast category filtering
- **Search optimization**: Use lowercase normalized names for case-insensitive search
- **Query caching**: Cache common query results (e.g., "IS Standard weapons 3025")
- **Lazy loading**: Load equipment data on demand for large databases

### Edge Cases
- **Empty database**: Return empty arrays, not errors
- **Invalid ID lookup**: Return undefined, not error
- **Query with no matches**: Return empty array
- **Missing optional fields**: Treat as undefined, not error
- **Ammunition without matching weapon**: Valid (weapon may be missing from database)
- **Tech base variants not found**: Return empty array (equipment may be unique to one tech base)

### Common Pitfalls
- **Pitfall**: Mutating equipment entries after retrieval
  - **Solution**: Return readonly references or deep clones
- **Pitfall**: Case-sensitive name search
  - **Solution**: Normalize to lowercase for comparison
- **Pitfall**: Forgetting to filter extinct technology
  - **Solution**: Always check extinctionYear when year filter present
- **Pitfall**: Using wrong properties type for category
  - **Solution**: Validate properties.type matches category on load
- **Pitfall**: Duplicate equipment IDs across tech bases
  - **Solution**: Use tech base suffix in IDs (e.g., "med-laser-is", "med-laser-clan")

---

## Examples

### Example 1: Equipment Entry Definition

```typescript
const mediumLaserIS: IEquipmentEntry = {
  // Base entity properties
  id: 'med-laser-is',
  name: 'Medium Laser',

  // Tech base properties
  techBase: TechBase.INNER_SPHERE,
  rulesLevel: RulesLevel.INTRODUCTORY,

  // Physical properties
  weight: 1,
  criticalSlots: 1,

  // Temporal properties
  introductionYear: 2443,
  era: Era.AGE_OF_WAR,

  // Category classification
  category: EquipmentCategory.WEAPON,
  subcategory: 'ENERGY',

  // Type-specific properties
  properties: {
    type: 'WEAPON',
    damage: 5,
    heat: 3,
    shortRange: 3,
    mediumRange: 6,
    longRange: 9,
    weaponType: 'LASER',
    subtype: 'MEDIUM_LASER'
  },

  // Economic properties
  cost: 40000,
  battleValue: 46,

  // Documentation
  description: 'Standard medium-range energy weapon',
  sourceBook: 'TechManual',
  pageReference: 227
};
```

### Example 2: Ammunition Entry

```typescript
const ac10AmmoStandard: IEquipmentEntry = {
  id: 'ammo-ac10-standard',
  name: 'AC/10 Ammo',
  techBase: TechBase.INNER_SPHERE,
  rulesLevel: RulesLevel.STANDARD,
  weight: 1,
  criticalSlots: 1,
  introductionYear: 2443,
  era: Era.AGE_OF_WAR,
  category: EquipmentCategory.AMMUNITION,
  subcategory: 'AUTOCANNON',
  properties: {
    type: 'AMMUNITION',
    weaponType: 'AC_10',
    shotsPerTon: 10
  },
  cost: 6000,
  battleValue: 0
};
```

### Example 3: Database Queries

```typescript
// Initialize database
const db: IEquipmentDatabase = new EquipmentDatabase();

// Query 1: Find all Inner Sphere energy weapons for 3025
const isEnergyWeapons3025 = db.query({
  category: EquipmentCategory.WEAPON,
  subcategory: 'ENERGY',
  techBase: TechBase.INNER_SPHERE,
  year: 3025,
  maxRulesLevel: RulesLevel.STANDARD
});

// Query 2: Find weapons that fit in 1 ton, 1 slot
const lightWeapons = db.query({
  category: EquipmentCategory.WEAPON,
  maxWeight: 1,
  maxCriticalSlots: 1
});

// Query 3: Find compatible ammo for AC/10
const ac10 = db.getById('ac-10-is');
const ac10Ammo = db.getCompatibleAmmo('ac-10-is', {
  year: 3025,
  maxRulesLevel: RulesLevel.STANDARD
});

// Query 4: Search by name
const ppcs = db.searchByName('PPC');
// Returns: PPC, ER PPC, PPC Capacitor, etc.

// Query 5: Get tech base variant
const clanERMedLaser = db.getTechBaseVariants('er-med-laser-is');
// Returns: ER Medium Laser (Clan)
```

### Example 4: Validation Examples

```typescript
function validateEquipmentEntry(entry: IEquipmentEntry): ValidationResult {
  const errors: ValidationError[] = [];

  // Check required fields
  if (!entry.id || entry.id.trim() === '') {
    errors.push({ message: 'Equipment ID required', severity: 'error' });
  }

  // Check category matches properties
  if (entry.category === EquipmentCategory.WEAPON &&
      entry.properties.type !== 'WEAPON') {
    errors.push({
      message: 'Weapon category requires WeaponProperties',
      severity: 'error'
    });
  }

  // Check temporal consistency
  if (entry.extinctionYear !== undefined &&
      entry.extinctionYear <= entry.introductionYear) {
    errors.push({
      message: 'Extinction year must be after introduction year',
      severity: 'error'
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: []
  };
}
```

### Example 5: Default Equipment Sets

```typescript
function getStarterWeaponSet(techBase: TechBase): IEquipmentEntry[] {
  if (techBase === TechBase.INNER_SPHERE) {
    return [
      'med-laser-is',
      'large-laser-is',
      'ac-5-is',
      'lrm-10-is',
      'srm-6-is'
    ].map(id => database.getById(id)).filter(e => e !== undefined);
  } else {
    return [
      'med-laser-clan',
      'large-laser-clan',
      'ultra-ac-5-clan',
      'lrm-10-clan',
      'srm-6-clan'
    ].map(id => database.getById(id)).filter(e => e !== undefined);
  }
}
```

---

## References

### Official BattleTech Rules
- **TechManual**: Equipment tables and specifications
- **Total Warfare**: Basic equipment rules
- **Tactical Operations**: Advanced equipment and ammunition types

### Related Documentation
- [Core Entity Types](../../phase-1-foundation/core-entity-types/spec.md) - Base interfaces
- [Era Temporal System](../../phase-1-foundation/era-temporal-system/spec.md) - Temporal availability
- [Tech Base Integration](../../phase-2-construction/tech-base-integration/spec.md) - Tech base rules
- Equipment-specific specs: Weapon System, Ammunition System, Electronics System, Physical Weapons System

### Code References
- Database: `src/services/equipment/EquipmentDatabase.ts`
- Interfaces: `src/types/core/ComponentDatabase.ts`
- Query logic: `src/services/equipment/EquipmentQuery.ts`

---

## Changelog

### Version 1.0 (2025-11-28)
- Initial specification
- Defined IEquipmentDatabase, IEquipmentEntry, IEquipmentQuery interfaces
- Established equipment category taxonomy (WEAPON, AMMUNITION, ELECTRONICS, PHYSICAL, HEAT_MANAGEMENT, MOVEMENT)
- Defined query operations (search, filter, lookup, compatibility)
- Established availability filtering (tech base, rules level, era, year)
- Added validation rules for database integrity
- Defined discriminated union for type-specific properties
