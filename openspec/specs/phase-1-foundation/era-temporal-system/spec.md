# Era & Temporal Availability System Specification

**Status**: Active
**Version**: 1.0
**Last Updated**: 2025-11-27
**Dependencies**: Core Entity Types
**Affects**: All component and equipment specifications, unit validation

---

## Overview

### Purpose
Defines the timeline system for BattleTech technology availability. Establishes era classifications, introduction/extinction years, and temporal filtering to ensure components are available only in their appropriate time periods.

### Scope
**In Scope:**
- Era enumeration and definitions (Age of War through Dark Age)
- Technology introduction and extinction years
- Temporal availability validation
- Era-based component filtering
- Timeline progression rules

**Out of Scope:**
- Specific technology introduction dates (defined in component specs)
- Campaign-specific house rules for technology availability
- Faction-specific technology restrictions
- Prototype and custom technology timelines

### Key Concepts
- **Era**: Named historical period in BattleTech timeline (e.g., Succession Wars, Clan Invasion)
- **Introduction Year**: Year when technology became available
- **Extinction Year**: Year when technology became unavailable (optional)
- **Temporal Entity**: Component with introduction/extinction dates
- **Era Filter**: UI mechanism to filter components by historical period

---

## Requirements

### Requirement: Era Classification
The system SHALL define canonical BattleTech eras with specific year ranges.

**Rationale**: Official BattleTech timeline divides history into distinct eras with different technology availability.

**Priority**: Critical

#### Scenario: Era definition
**GIVEN** a historical year
**WHEN** determining the era
**THEN** it SHALL map to exactly one canonical era
**AND** era boundaries SHALL align with official BattleTech timeline
**AND** eras SHALL cover the range 2443-3250

#### Scenario: Era progression
**GIVEN** the complete timeline
**WHEN** listing eras chronologically
**THEN** they SHALL appear in order: Age of War, Star League, Early Succession Wars, Late Succession Wars, Clan Invasion, Civil War, Jihad, Dark Age

### Requirement: Technology Introduction Date
All temporal entities SHALL declare an introduction year.

**Rationale**: Technology becomes available at specific points in the timeline. This affects campaign and scenario legality.

**Priority**: Critical

#### Scenario: Component with introduction year
**GIVEN** a component implementing ITemporalEntity
**WHEN** defining the component
**THEN** it MUST have introductionYear property
**AND** introductionYear MUST be a valid year (2443-3250)
**AND** introductionYear SHALL determine earliest era availability

#### Scenario: Filtering by year
**GIVEN** a campaign year of 3025
**WHEN** filtering available components
**THEN** show components with introductionYear <= 3025
**AND** hide components with introductionYear > 3025
**AND** hide extinct components (extinctionYear < 3025)

### Requirement: Technology Extinction
Temporal entities MAY declare an extinction year when technology became unavailable.

**Rationale**: Some technologies were lost during the Succession Wars and became unavailable until rediscovered.

**Priority**: High

#### Scenario: Extinct technology
**GIVEN** a component with extinctionYear
**WHEN** filtering for year 3025
**THEN** if extinctionYear < 3025, component SHALL be unavailable
**AND** if extinctionYear >= 3025, component SHALL be available

#### Scenario: Technology without extinction
**GIVEN** a component without extinctionYear
**WHEN** filtering by any year
**THEN** component SHALL be available if introductionYear is met
**AND** component SHALL remain available indefinitely

### Requirement: Temporal Validation
The system SHALL validate temporal consistency.

**Rationale**: Ensures data integrity and prevents impossible configurations (e.g., extinction before introduction).

**Priority**: High

#### Scenario: Valid temporal range
**GIVEN** a component with both introduction and extinction years
**WHEN** validating the component
**THEN** extinctionYear MUST be > introductionYear
**AND** both years MUST be valid timeline years

#### Scenario: Invalid temporal range
**GIVEN** a component with extinctionYear <= introductionYear
**WHEN** validating the component
**THEN** validation SHALL fail with error
**AND** error message SHALL indicate temporal inconsistency

### Requirement: Era-Based Filtering
The system SHALL support filtering components by era.

**Rationale**: Players need to select appropriate technology for their campaign era.

**Priority**: High

#### Scenario: Filter by Succession Wars
**GIVEN** era filter set to Late Succession Wars (3025-3049)
**WHEN** displaying available components
**THEN** show components introduced before 3050
**AND** hide components introduced 3050 or later
**AND** hide components extinct before 3025

#### Scenario: Filter by year within era
**GIVEN** specific campaign year of 3028
**WHEN** filtering components
**THEN** use exact year for introduction/extinction checks
**AND** display era as "Late Succession Wars"

---

## Data Model Requirements

### Required Enumerations

```typescript
/**
 * BattleTech historical eras
 *
 * Canonical timeline periods with approximate year ranges.
 * Used for categorization and filtering of technology availability.
 */
enum Era {
  /**
   * Age of War (2005-2570)
   * Early interstellar conflict and technology development
   */
  AGE_OF_WAR = 'Age of War',

  /**
   * Star League (2571-2780)
   * Golden age of technology and prosperity
   */
  STAR_LEAGUE = 'Star League',

  /**
   * Early Succession Wars (2781-2900)
   * Technology regression and loss
   */
  EARLY_SUCCESSION_WARS = 'Early Succession Wars',

  /**
   * Late Succession Wars (2901-3049)
   * Continued conflict with limited technology
   */
  LATE_SUCCESSION_WARS = 'Late Succession Wars',

  /**
   * Clan Invasion (3050-3061)
   * Clan technology introduction to Inner Sphere
   */
  CLAN_INVASION = 'Clan Invasion',

  /**
   * Civil War (3062-3067)
   * FedCom Civil War and political upheaval
   */
  CIVIL_WAR = 'Civil War',

  /**
   * Jihad (3068-3085)
   * Word of Blake Jihad and massive conflicts
   */
  JIHAD = 'Jihad',

  /**
   * Dark Age (3086-3150+)
   * HPG blackout and technological chaos
   */
  DARK_AGE = 'Dark Age'
}
```

### Required Interface Extensions

```typescript
/**
 * Entity with temporal availability (from Core Entity Types)
 */
interface ITemporalEntity {
  /**
   * Year technology was introduced
   * @minimum 2443
   * @maximum 3250
   */
  readonly introductionYear: number;

  /**
   * Year technology became extinct (optional)
   * @minimum 2443
   * @maximum 3250
   */
  readonly extinctionYear?: number;

  /**
   * Era classification
   */
  readonly era: Era;
}
```

### Required Properties

| Property | Type | Required | Description | Valid Values | Default |
|----------|------|----------|-------------|--------------|---------|
| `introductionYear` | `number` | Yes | Introduction year | 2443-3250 | - |
| `extinctionYear` | `number` | No | Extinction year | 2443-3250 | undefined |
| `era` | `Era` | Yes | Era classification | Valid Era enum | - |

### Type Constraints

- `introductionYear` MUST be an integer between 2443 and 3250
- `extinctionYear` MUST be undefined OR an integer between 2443 and 3250
- When `extinctionYear` is defined, it MUST be > `introductionYear`
- `era` MUST correspond to the `introductionYear` range

---

## Era Definitions

### Age of War (2005-2570)

**Characteristics**:
- Early interstellar expansion
- Development of BattleMech technology
- Primitive technology variants
- Foundation of Great Houses

**Representative Technology**:
- Primitive BattleMechs
- Standard Fusion Engines
- Early autocannons and lasers
- Basic armor systems

**Year Range**: 2005-2570

### Star League (2571-2780)

**Characteristics**:
- Golden age of technology
- Peak technological advancement
- Widespread prosperity
- Formation of SLDF

**Representative Technology**:
- Advanced BattleMechs
- Gauss Rifles
- PPC variants
- Advanced electronics
- Clan prototypes (late period)

**Year Range**: 2571-2780

### Early Succession Wars (2781-2900)

**Characteristics**:
- Collapse of Star League
- Massive technology loss
- Destruction of factories and knowledge
- Beginning of regression

**Representative Technology**:
- Technology losses begin
- Maintenance of existing systems
- Limited new development
- Many technologies go extinct

**Year Range**: 2781-2900

### Late Succession Wars (2901-3049)

**Characteristics**:
- Continued technology regression
- Limited industrial capacity
- Rediscovery efforts
- Technological stagnation

**Representative Technology**:
- Standard/basic technology only
- Lost technologies unavailable
- Primitive replacements for lost tech
- Gradual rediscovery beginning (late period)

**Year Range**: 2901-3049
**Note**: Year 3025 is the classic BattleTech setting year

### Clan Invasion (3050-3061)

**Characteristics**:
- Clan arrival in Inner Sphere
- Introduction of Clan technology
- Technology renaissance
- Major military conflicts

**Representative Technology**:
- Clan weapons and equipment
- Rediscovered lostech
- Pulse lasers
- ER weapons
- Double heat sinks (rediscovered)

**Year Range**: 3050-3061

### Civil War (3062-3067)

**Characteristics**:
- FedCom Civil War
- Internal conflicts
- Continued technology development
- Prototype advanced systems

**Representative Technology**:
- Light Ferro-Fibrous armor
- Stealth armor
- Advanced targeting systems
- Experimental weapon variants

**Year Range**: 3062-3067

### Jihad (3068-3085)

**Characteristics**:
- Word of Blake Jihad
- Massive devastation
- Advanced/experimental technology
- Nuclear and orbital weapons

**Representative Technology**:
- C3 networks
- Improved C3
- Advanced ammunition types
- Prototype weapon systems

**Year Range**: 3068-3085

### Dark Age (3086-3150+)

**Characteristics**:
- HPG blackout
- Communications disruption
- Regional isolation
- Mixed technology availability

**Representative Technology**:
- Regional variants
- Improvised systems
- Mixed IS/Clan technology
- Experimental innovations

**Year Range**: 3086-3150+

---

## Temporal Filtering Logic

### Availability Calculation

```typescript
/**
 * Determines if a component is available in a given year
 */
function isAvailableInYear(
  component: ITemporalEntity,
  year: number
): boolean {
  // Not yet introduced
  if (year < component.introductionYear) {
    return false;
  }

  // Already extinct
  if (component.extinctionYear !== undefined &&
      year > component.extinctionYear) {
    return false;
  }

  // Available
  return true;
}

/**
 * Determines era from year
 */
function getEraFromYear(year: number): Era {
  if (year >= 2005 && year <= 2570) return Era.AGE_OF_WAR;
  if (year >= 2571 && year <= 2780) return Era.STAR_LEAGUE;
  if (year >= 2781 && year <= 2900) return Era.EARLY_SUCCESSION_WARS;
  if (year >= 2901 && year <= 3049) return Era.LATE_SUCCESSION_WARS;
  if (year >= 3050 && year <= 3061) return Era.CLAN_INVASION;
  if (year >= 3062 && year <= 3067) return Era.CIVIL_WAR;
  if (year >= 3068 && year <= 3085) return Era.JIHAD;
  if (year >= 3086) return Era.DARK_AGE;

  // Default for edge cases
  return Era.LATE_SUCCESSION_WARS;
}
```

### Era Filtering

```typescript
/**
 * Filters components by era (uses era end year for filtering)
 */
function filterByEra(
  components: ITemporalEntity[],
  era: Era
): ITemporalEntity[] {
  const eraEndYear = getEraEndYear(era);
  return components.filter(c => isAvailableInYear(c, eraEndYear));
}

function getEraEndYear(era: Era): number {
  switch (era) {
    case Era.AGE_OF_WAR: return 2570;
    case Era.STAR_LEAGUE: return 2780;
    case Era.EARLY_SUCCESSION_WARS: return 2900;
    case Era.LATE_SUCCESSION_WARS: return 3049;
    case Era.CLAN_INVASION: return 3061;
    case Era.CIVIL_WAR: return 3067;
    case Era.JIHAD: return 3085;
    case Era.DARK_AGE: return 3150;
  }
}
```

---

## Validation Rules

### Validation: Introduction Year Required
**Rule**: All temporal entities must have a valid introduction year

**Severity**: Error

**Condition**:
```typescript
if (!Number.isInteger(component.introductionYear) ||
    component.introductionYear < 2443 ||
    component.introductionYear > 3250) {
  // invalid - emit error
}
```

**Error Message**: "Component must have a valid introduction year (2443-3250)"

**User Action**: Provide a valid introduction year within the timeline

### Validation: Temporal Consistency
**Rule**: Extinction year must be after introduction year

**Severity**: Error

**Condition**:
```typescript
if (component.extinctionYear !== undefined &&
    component.extinctionYear <= component.introductionYear) {
  // invalid - emit error
}
```

**Error Message**: "Extinction year must be after introduction year"

**User Action**: Correct the extinction year to be later than introduction year

### Validation: Era Alignment
**Rule**: Era should align with introduction year

**Severity**: Warning

**Condition**:
```typescript
const expectedEra = getEraFromYear(component.introductionYear);
if (component.era !== expectedEra) {
  // misalignment - emit warning
}
```

**Error Message**: "Era classification does not match introduction year"

**User Action**: Verify era classification matches the introduction year

---

## Technology Base Variants

### Inner Sphere Implementation
**No special rules** - Inner Sphere components use the same temporal system.

**Note**: Many Inner Sphere technologies have extinction periods during Succession Wars and reintroduction during Clan Invasion era.

### Clan Implementation
**No special rules** - Clan components use the same temporal system.

**Note**: Most Clan technology becomes available to Inner Sphere in 3050 (Clan Invasion). Clan technology existed earlier but was unavailable to Inner Sphere.

### Mixed Tech Rules
**When unit tech base is Mixed**: Temporal availability applies independently to each component regardless of tech base. A component is available if the year requirement is met.

---

## Dependencies

### Defines
- **Era enum**: Defines 8 canonical BattleTech eras (AGE_OF_WAR through DARK_AGE)
- **Era year ranges**: Maps each era to specific year boundaries (e.g., Clan Invasion 3050-3061)
- **Temporal availability rules**: How introduction/extinction years affect component availability
- **Temporal validation rules**: Ensures extinction year > introduction year
- **Era filtering logic**: How to filter components by era/year

### Depends On
- [Core Entity Types](../core-entity-types/spec.md) - Uses ITemporalEntity interface (introductionYear, extinctionYear, era properties)

### Used By
- [Engine System](../../phase-2-construction/engine-system/spec.md) - Temporal availability of engine types
- [Gyro System](../../phase-2-construction/gyro-system/spec.md) - Temporal availability of gyro types
- [Heat Sink System](../../phase-2-construction/heat-sink-system/spec.md) - Temporal availability of heat sink types (DHS introduced 3050 IS, 2828 Clan)
- [Internal Structure System](../../phase-2-construction/internal-structure-system/spec.md) - Temporal availability of structure types
- [Armor System](../../phase-2-construction/armor-system/spec.md) - Temporal availability of armor types
- [Cockpit System](../../phase-2-construction/cockpit-system/spec.md) - Temporal availability of cockpit types
- [Movement System](../../phase-2-construction/movement-system/spec.md) - Temporal availability of movement equipment
- [Construction Rules Core](../../phase-2-construction/construction-rules-core/spec.md) - Validates components exist in construction year
- **All equipment specifications**: Technology introduction dates and era filtering
- **Campaign rules**: Year-based filtering
- **UI filters**: Era and year selection

### Construction Sequence
1. Define Era enumeration (this spec)
2. Define ITemporalEntity interface (Core Entity Types)
3. Implement components with temporal properties
4. Implement filtering logic in UI and validation

---

## Implementation Notes

### Performance Considerations
- Pre-compute era boundaries at application startup
- Cache filtered component lists by year/era
- Use binary search for year-based filtering on sorted lists

### Edge Cases
- **Technology gaps**: Some tech extinct then reintroduced (use multiple components with different IDs)
- **Prototypes**: Use introduction year for prototype availability, not mass production
- **Clan availability**: Clan tech available in Clan space earlier than IS
- **Unknown dates**: Require explicit dates; no defaults

### Common Pitfalls
- **Pitfall**: Using current year instead of campaign year for filtering
  - **Solution**: Always use explicit campaign/construction year parameter
- **Pitfall**: Forgetting to check extinction year
  - **Solution**: Always validate both introduction and extinction
- **Pitfall**: Hard-coding era years instead of using enum mapping
  - **Solution**: Use getEraFromYear() function
- **Pitfall**: Allowing components without introduction years
  - **Solution**: Make introductionYear required for temporal entities

---

## Examples

### Example 1: Component with Simple Availability
```typescript
interface IWeapon extends ITechBaseEntity, ITemporalEntity {
  readonly damage: number;
}

const mediumLaser: IWeapon = {
  id: 'med-laser-is',
  name: 'Medium Laser',
  techBase: TechBase.INNER_SPHERE,
  rulesLevel: RulesLevel.INTRODUCTORY,
  damage: 5,
  introductionYear: 2443,  // Available from Age of War
  era: Era.AGE_OF_WAR
  // No extinctionYear - still in production
};
```

### Example 2: Extinct Technology
```typescript
const doubleHeatSinkStarLeague: IHeatSink = {
  id: 'heat-sink-double-sl',
  name: 'Double Heat Sink (Star League)',
  techBase: TechBase.INNER_SPHERE,
  rulesLevel: RulesLevel.STANDARD,
  dissipation: 2,
  introductionYear: 2567,  // Star League era
  extinctionYear: 2865,     // Lost during Succession Wars
  era: Era.STAR_LEAGUE
};

// Reintroduced version (different component ID)
const doubleHeatSinkRecovered: IHeatSink = {
  id: 'heat-sink-double-is',
  name: 'Double Heat Sink',
  techBase: TechBase.INNER_SPHERE,
  rulesLevel: RulesLevel.STANDARD,
  dissipation: 2,
  introductionYear: 3040,  // Rediscovered
  era: Era.LATE_SUCCESSION_WARS
  // No extinction - still available
};
```

### Example 3: Temporal Filtering
```typescript
const weapons: IWeapon[] = loadWeaponDatabase();

// Filter for 3025 campaign
const availableIn3025 = weapons.filter(w =>
  isAvailableInYear(w, 3025)
);

// Filter by era
const clanInvasionWeapons = filterByEra(weapons, Era.CLAN_INVASION);
```

### Example 4: Era Detection
```typescript
function displayComponentEra(component: ITemporalEntity): string {
  const era = component.era;
  const intro = component.introductionYear;
  const extinct = component.extinctionYear;

  if (extinct) {
    return `${era} (${intro}-${extinct})`;
  } else {
    return `${era} (${intro}+)`;
  }
}

// Output: "Star League (2567-2865)"
console.log(displayComponentEra(doubleHeatSinkStarLeague));

// Output: "Late Succession Wars (3040+)"
console.log(displayComponentEra(doubleHeatSinkRecovered));
```

### Example 5: Campaign Year Validation
```typescript
function validateUnitForCampaign(
  unit: IUnit,
  campaignYear: number
): ValidationResult {
  const errors: ValidationError[] = [];

  for (const component of unit.getAllComponents()) {
    if (!isAvailableInYear(component, campaignYear)) {
      const reason = component.introductionYear > campaignYear
        ? 'not yet invented'
        : 'extinct/unavailable';

      errors.push({
        severity: 'error',
        message: `${component.name} is ${reason} in year ${campaignYear}`,
        component: component.id,
        introYear: component.introductionYear,
        extinctYear: component.extinctionYear
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: []
  };
}
```

---

## References

### Official BattleTech Rules
- **Era Digest**: Complete era definitions and technology availability
- **TechManual**: Pages 6-10 - Technology progression
- **Interstellar Operations**: Pages 20-30 - Historical timelines

### Related Documentation
- `openspec/specs/core-entity-types/spec.md` - ITemporalEntity interface
- `openspec/specs/tech-base-system/spec.md` - Technology classification
- Campaign books - Specific era details and technology lists

### Code References
- Enums: `src/types/core/BaseTypes.ts`
- Filtering: `src/utils/filters/temporalFilter.ts`
- Validation: `src/services/validation/temporalValidator.ts`

---

## Changelog

### Version 1.0 (2025-11-27)
- Initial specification
- Defined 8 canonical eras from Age of War through Dark Age
- Defined ITemporalEntity interface requirements
- Established temporal filtering and validation logic
- Added extinction year support for lost technology
