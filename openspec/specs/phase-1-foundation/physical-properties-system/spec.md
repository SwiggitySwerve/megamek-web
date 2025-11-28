# Physical Properties System Specification

**Status**: Active
**Version**: 1.0
**Last Updated**: 2025-11-27
**Dependencies**: Core Entity Types
**Affects**: All component specifications, unit construction, validation

---

## Overview

### Purpose
Defines the physical property interfaces for BattleTech components, including weight (tonnage) and critical slot allocation. Establishes standardized property names, validation rules, and calculation patterns for physical characteristics.

### Scope
**In Scope:**
- Weight (tonnage) property and validation
- Critical slot property and validation
- Composition interface for placeable components (IPlaceableComponent)
- Weight calculation rules and rounding
- Critical slot allocation rules
- Property naming standardization

**Out of Scope:**
- Specific component weight formulas (defined in component specs)
- Location-specific slot allocation (covered in Critical Slot Allocation spec)
- Armor weight calculations (covered in Armor System spec)
- Structure weight calculations (covered in Internal Structure spec)
- Weight-based construction rules (covered in Unit Construction spec)

### Key Concepts
- **Weight**: Physical mass of a component in tons (always use "weight", never "tons" or "mass")
- **Critical Slots**: Number of critical slot spaces a component occupies (always use "criticalSlots", never "slots")
- **Placeable Component**: Component with both weight and critical slot requirements
- **Fractional Weight**: Components can have fractional tonnage (e.g., 0.5 tons)
- **Integer Slots**: Critical slots are always whole numbers

---

## Requirements

### Requirement: Weight Property Standard
All components with physical mass SHALL use the property name "weight" measured in tons.

**Rationale**: Consistent naming prevents confusion and errors. Many legacy systems use "tons" or "mass" - standardizing on "weight" aligns with BattleTech terminology.

**Priority**: Critical

#### Scenario: Component with weight
**GIVEN** a component interface definition
**WHEN** adding a property for physical mass
**THEN** it MUST be named "weight"
**AND** it MUST be type number
**AND** it MUST be readonly
**AND** it MUST implement IWeightedComponent

#### Scenario: Legacy property names rejected
**GIVEN** a component with property "tons" or "mass"
**WHEN** validating the interface
**THEN** validation SHALL fail
**AND** error SHALL require renaming to "weight"

### Requirement: Critical Slots Property Standard
All components requiring critical slot space SHALL use the property name "criticalSlots".

**Rationale**: Consistent naming and full property name (not abbreviated "slots") improves code clarity.

**Priority**: Critical

#### Scenario: Component with slots
**GIVEN** a component interface definition
**WHEN** adding a property for critical slot usage
**THEN** it MUST be named "criticalSlots"
**AND** it MUST be type number
**AND** it MUST be readonly
**AND** it MUST implement ISlottedComponent

#### Scenario: Abbreviated property names rejected
**GIVEN** a component with property "slots"
**WHEN** validating the interface
**THEN** validation SHALL fail
**AND** error SHALL require full name "criticalSlots"

### Requirement: Weight Validation
Component weight SHALL be non-negative and finite.

**Rationale**: Negative or infinite weight is physically impossible and indicates data errors.

**Priority**: Critical

#### Scenario: Valid weight
**GIVEN** a component with weight property
**WHEN** validating the component
**THEN** weight MUST be >= 0
**AND** weight MUST be finite (not NaN, Infinity, or -Infinity)
**AND** weight MAY be fractional (0.5 tons is valid)

#### Scenario: Invalid weight
**GIVEN** a component with weight < 0 or non-finite weight
**WHEN** validating the component
**THEN** validation SHALL fail with error
**AND** error message SHALL indicate invalid weight value

#### Scenario: Zero weight
**GIVEN** a component with weight = 0
**WHEN** validating the component
**THEN** validation SHALL succeed
**AND** zero weight SHALL be valid (e.g., some electronics have 0 tons)

### Requirement: Critical Slots Validation
Component critical slots SHALL be non-negative integers.

**Rationale**: Critical slots represent discrete physical spaces and cannot be fractional or negative.

**Priority**: Critical

#### Scenario: Valid critical slots
**GIVEN** a component with criticalSlots property
**WHEN** validating the component
**THEN** criticalSlots MUST be >= 0
**AND** criticalSlots MUST be an integer
**AND** criticalSlots MAY be 0 (e.g., some equipment is slotless)

#### Scenario: Fractional slots rejected
**GIVEN** a component with criticalSlots = 1.5
**WHEN** validating the component
**THEN** validation SHALL fail with error
**AND** error message SHALL indicate slots must be integers

#### Scenario: Negative slots rejected
**GIVEN** a component with criticalSlots < 0
**WHEN** validating the component
**THEN** validation SHALL fail with error
**AND** error message SHALL indicate slots cannot be negative

### Requirement: Composition Pattern
Components with both weight and critical slots SHALL use IPlaceableComponent.

**Rationale**: Avoid interface duplication. IPlaceableComponent composes IWeightedComponent and ISlottedComponent.

**Priority**: High

#### Scenario: Component with both properties
**GIVEN** a component requiring both weight and slots
**WHEN** defining the interface
**THEN** it SHALL extend IPlaceableComponent
**AND** it SHALL NOT separately extend IWeightedComponent and ISlottedComponent
**AND** it SHALL inherit both weight and criticalSlots properties

#### Scenario: Single property components
**GIVEN** a component with only weight (no slots needed)
**WHEN** defining the interface
**THEN** it SHALL extend IWeightedComponent only
**AND** it SHALL NOT use IPlaceableComponent

---

## Data Model Requirements

### Required Interfaces

```typescript
/**
 * Component with physical mass (from Core Entity Types)
 */
interface IWeightedComponent {
  /**
   * Weight in tons
   * MUST be >= 0
   * MUST be finite
   * MAY be fractional (e.g., 0.5)
   */
  readonly weight: number;
}

/**
 * Component requiring critical slot space (from Core Entity Types)
 */
interface ISlottedComponent {
  /**
   * Number of critical slots required
   * MUST be >= 0
   * MUST be an integer
   */
  readonly criticalSlots: number;
}

/**
 * Component with both weight and slot requirements (from Core Entity Types)
 * Composition of IWeightedComponent and ISlottedComponent
 */
interface IPlaceableComponent extends IWeightedComponent, ISlottedComponent {}
```

### Required Properties

| Property | Type | Required | Description | Valid Values | Default |
|----------|------|----------|-------------|--------------|---------|
| `weight` | `number` | Yes* | Weight in tons | Finite number >= 0 | - |
| `criticalSlots` | `number` | Yes** | Critical slots | Integer >= 0 | - |

\* Required for IWeightedComponent and IPlaceableComponent
\** Required for ISlottedComponent and IPlaceableComponent

### Type Constraints

- `weight` MUST be a finite number
- `weight` MUST be >= 0
- `weight` MAY be fractional (e.g., 0.5, 1.5, 2.5)
- `criticalSlots` MUST be an integer
- `criticalSlots` MUST be >= 0
- Both properties MUST be readonly

---

## Property Naming Standards

### Standardized Names

| Concept | Property Name | Type | Never Use |
|---------|--------------|------|-----------|
| Physical mass | `weight` | `number` | tons, mass, tonnage, wt |
| Critical slots | `criticalSlots` | `number` | slots, critSlots, cs |

### Rationale

**Why "weight" instead of "tons":**
- "weight" is a property name, "tons" is a unit of measurement
- Consistent with other physical properties (height, length, etc.)
- Property can have documentation specifying unit: `/** Weight in tons */`

**Why "criticalSlots" instead of "slots":**
- Explicit and unambiguous
- "slots" could mean equipment slots, weapon hardpoints, etc.
- Full name improves code readability and searchability

### Migration

Existing code using non-standard names SHALL be updated:
- `tons` → `weight`
- `mass` → `weight`
- `tonnage` → `weight`
- `slots` → `criticalSlots`
- `critSlots` → `criticalSlots`

---

## Weight Calculation Rules

### Precision

**Rule**: Weight calculations SHALL use standard JavaScript number precision.

**Rounding**: Round to 2 decimal places for display, store full precision internally.

```typescript
// Calculate weight
const calculatedWeight = baseWeight * multiplier;

// Store full precision
component.weight = calculatedWeight;

// Display rounded
const displayWeight = Math.round(calculatedWeight * 100) / 100;
console.log(`${displayWeight} tons`);
```

### Summation

**Rule**: Sum component weights using standard addition, round final result only.

```typescript
// Correct: sum then round for display
const totalWeight = components.reduce((sum, c) => sum + c.weight, 0);
const displayTotal = Math.round(totalWeight * 100) / 100;

// Incorrect: rounding each component before summing
// This can accumulate rounding errors
const wrongTotal = components.reduce((sum, c) =>
  sum + Math.round(c.weight * 100) / 100, 0
);
```

### Special Cases

**Zero Weight**: Some components (certain electronics, some ammunition types) have 0 tons weight. This is valid.

**Fractional Weight**: Many components have fractional tonnage (e.g., 0.5 tons for some weapons). This is valid.

**Variable Weight**: Some components have weight that depends on unit tonnage (e.g., engines, gyros). Weight is calculated, not fixed.

---

## Critical Slot Rules

### Integer Constraint

**Rule**: Critical slots MUST always be integers. Never use fractional slots.

```typescript
// Correct
const component: ISlottedComponent = {
  criticalSlots: 1
};

// Incorrect - fractional slots are invalid
const invalid: ISlottedComponent = {
  criticalSlots: 1.5  // INVALID - will fail validation
};
```

### Zero Slots

**Rule**: Some components occupy zero slots (slotless equipment). This is valid.

```typescript
const heatsink: ISlottedComponent = {
  criticalSlots: 0  // Valid - some equipment is slotless
};
```

### Variable Slots

**Rule**: Some components have slot count that depends on other factors (e.g., engine rating determines engine slots). Calculate and assign integer result.

```typescript
// Engine slots depend on engine rating and type
function calculateEngineSlots(rating: number, type: EngineType): number {
  // Calculation returns integer
  const slots = getEngineSlotsForType(rating, type);
  return Math.floor(slots);  // Ensure integer
}
```

---

## Validation Rules

### Validation: Weight is Finite and Non-Negative

**Rule**: Weight must be a finite non-negative number

**Severity**: Error

**Condition**:
```typescript
function validateWeight(component: IWeightedComponent): boolean {
  if (!Number.isFinite(component.weight)) {
    throw new ValidationError('Weight must be finite');
  }
  if (component.weight < 0) {
    throw new ValidationError('Weight cannot be negative');
  }
  return true;
}
```

**Error Message**: "Weight must be a finite non-negative number"

**User Action**: Correct the weight value

### Validation: Critical Slots is Non-Negative Integer

**Rule**: Critical slots must be a non-negative integer

**Severity**: Error

**Condition**:
```typescript
function validateCriticalSlots(component: ISlottedComponent): boolean {
  if (!Number.isInteger(component.criticalSlots)) {
    throw new ValidationError('Critical slots must be an integer');
  }
  if (component.criticalSlots < 0) {
    throw new ValidationError('Critical slots cannot be negative');
  }
  return true;
}
```

**Error Message**: "Critical slots must be a non-negative integer"

**User Action**: Correct the slots value to a whole number >= 0

### Validation: Property Naming

**Rule**: Use standardized property names

**Severity**: Error

**Condition**:
```typescript
function validatePropertyNames(obj: any): boolean {
  const invalidWeightProps = ['tons', 'mass', 'tonnage'];
  const invalidSlotProps = ['slots', 'critSlots'];

  for (const prop of invalidWeightProps) {
    if (prop in obj) {
      throw new ValidationError(`Use "weight" instead of "${prop}"`);
    }
  }

  for (const prop of invalidSlotProps) {
    if (prop in obj) {
      throw new ValidationError(`Use "criticalSlots" instead of "${prop}"`);
    }
  }

  return true;
}
```

**Error Message**: "Use standardized property name: 'weight' for mass, 'criticalSlots' for slots"

**User Action**: Rename properties to standard names

---

## Technology Base Variants

### Inner Sphere Implementation
**No special rules** - Weight and slots use same validation regardless of tech base.

### Clan Implementation
**No special rules** - Weight and slots use same validation regardless of tech base.

**Note**: Clan components may have different weight/slot values than IS equivalents (e.g., Clan weapons are often lighter/more compact), but the validation rules are identical.

### Mixed Tech Rules
**No special rules** - Physical properties are independent of unit tech base classification.

---

## Dependencies

### Defines
- **Property naming standards**: Establishes "weight" (not "tons" or "mass") and "criticalSlots" (not "slots") as standard names
- **Weight validation rules**: Weight must be finite, >= 0, may be fractional
- **Critical slots validation rules**: Slots must be integer, >= 0
- **Weight calculation rules**: Rounding to 2 decimal places for display, full precision internally
- **Summation rules**: Sum then round, don't round before summing

### Depends On
- [Core Entity Types](../core-entity-types/spec.md) - Defines IWeightedComponent, ISlottedComponent, IPlaceableComponent interfaces

### Used By
- [Engine System](../../phase-2-construction/engine-system/spec.md) - Uses weight property for engine weight, criticalSlots for CT slot allocation
- [Gyro System](../../phase-2-construction/gyro-system/spec.md) - Uses weight property (calculated from engine rating)
- [Heat Sink System](../../phase-2-construction/heat-sink-system/spec.md) - Uses IPlaceableComponent for external heat sinks
- [Internal Structure System](../../phase-2-construction/internal-structure-system/spec.md) - Uses weight property (percentage of mech tonnage)
- [Armor System](../../phase-2-construction/armor-system/spec.md) - Uses weight property (armor points / points-per-ton)
- [Cockpit System](../../phase-2-construction/cockpit-system/spec.md) - Uses weight property (fixed tonnage)
- [Movement System](../../phase-2-construction/movement-system/spec.md) - Uses IPlaceableComponent for jump jets
- [Critical Slot Allocation](../../phase-2-construction/critical-slot-allocation/spec.md) - Uses criticalSlots property for placement
- [Construction Rules Core](../../phase-2-construction/construction-rules-core/spec.md) - Validates weight and slot budgets
- **All component specifications**: Every physical component uses weight and/or slots properties

### Construction Sequence
1. Define IWeightedComponent, ISlottedComponent, IPlaceableComponent interfaces (Core Entity Types)
2. Establish property naming standards (this spec)
3. Define specific component interfaces extending these
4. Implement component data with weight/slot values using standard names
5. Implement validation logic enforcing standards

---

## Implementation Notes

### Performance Considerations
- Weight and slot properties are readonly - no performance overhead
- Weight summation is O(n) - acceptable for typical component counts
- Validation checks are O(1) per component

### Edge Cases
- **Zero values**: Both weight and slots can be 0 (valid)
- **Very small weight**: Components < 0.5 tons are rare but valid
- **Large slot counts**: Some components (e.g., Autocannon ammo bins) can be 1-6 slots
- **Floating point precision**: Use full precision internally, round for display only

### Common Pitfalls
- **Pitfall**: Using "tons" as property name instead of "weight"
  - **Solution**: Always use "weight" - tons is the unit, not the property
- **Pitfall**: Abbreviating "criticalSlots" to "slots"
  - **Solution**: Always use full name "criticalSlots"
- **Pitfall**: Rounding weights before summing
  - **Solution**: Sum full precision, round final result only
- **Pitfall**: Allowing fractional critical slots
  - **Solution**: Validate slots are integers
- **Pitfall**: Rejecting zero weight/slots as invalid
  - **Solution**: Zero is valid for both properties

---

## Examples

### Example 1: Component with Weight Only
```typescript
interface IArmor extends ITechBaseEntity, IWeightedComponent {
  readonly armorType: ArmorType;
  readonly pointsPerTon: number;
}

const standardArmor: IArmor = {
  id: 'armor-standard',
  name: 'Standard Armor',
  techBase: TechBase.INNER_SPHERE,
  rulesLevel: RulesLevel.INTRODUCTORY,
  weight: 1.0,  // 1 ton
  armorType: ArmorType.STANDARD,
  pointsPerTon: 16
  // No criticalSlots - armor doesn't use slots
};
```

### Example 2: Component with Slots Only
```typescript
interface ICockpit extends ITechBaseEntity, ISlottedComponent {
  readonly cockpitType: CockpitType;
}

const standardCockpit: ICockpit = {
  id: 'cockpit-standard',
  name: 'Standard Cockpit',
  techBase: TechBase.INNER_SPHERE,
  rulesLevel: RulesLevel.INTRODUCTORY,
  criticalSlots: 1,
  cockpitType: CockpitType.STANDARD
  // No weight - cockpit weight included in structure
};
```

### Example 3: Component with Both (using IPlaceableComponent)
```typescript
interface IWeapon extends
  ITechBaseEntity,
  IPlaceableComponent,  // Provides both weight and criticalSlots
  IValuedComponent {
  readonly damage: number;
}

const mediumLaser: IWeapon = {
  id: 'med-laser-is',
  name: 'Medium Laser',
  techBase: TechBase.INNER_SPHERE,
  rulesLevel: RulesLevel.INTRODUCTORY,
  weight: 1.0,           // IWeightedComponent via IPlaceableComponent
  criticalSlots: 1,      // ISlottedComponent via IPlaceableComponent
  cost: 40000,
  battleValue: 46,
  damage: 5
};
```

### Example 4: Fractional Weight
```typescript
const machineGun: IWeapon = {
  id: 'machine-gun-is',
  name: 'Machine Gun',
  techBase: TechBase.INNER_SPHERE,
  rulesLevel: RulesLevel.STANDARD,
  weight: 0.5,           // Fractional weight is valid
  criticalSlots: 1,
  cost: 5000,
  battleValue: 0,
  damage: 2
};
```

### Example 5: Zero Weight and Slots
```typescript
const jumpJetBooster: IEquipment = {
  id: 'jj-booster',
  name: 'Jump Jet Booster',
  techBase: TechBase.INNER_SPHERE,
  rulesLevel: RulesLevel.ADVANCED,
  weight: 0,             // Zero weight is valid
  criticalSlots: 0       // Zero slots is valid (slotless)
};
```

### Example 6: Weight Validation
```typescript
function validateComponent(component: IPlaceableComponent): ValidationResult {
  const errors: ValidationError[] = [];

  // Validate weight
  if (!Number.isFinite(component.weight) || component.weight < 0) {
    errors.push({
      severity: 'error',
      message: `Invalid weight: ${component.weight}`,
      property: 'weight'
    });
  }

  // Validate slots
  if (!Number.isInteger(component.criticalSlots) ||
      component.criticalSlots < 0) {
    errors.push({
      severity: 'error',
      message: `Invalid critical slots: ${component.criticalSlots}`,
      property: 'criticalSlots'
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: []
  };
}
```

### Example 7: Weight Calculation and Display
```typescript
function calculateTotalWeight(components: IWeightedComponent[]): number {
  // Sum with full precision
  const total = components.reduce((sum, c) => sum + c.weight, 0);
  return total;
}

function displayWeight(weight: number): string {
  // Round to 2 decimal places for display
  const rounded = Math.round(weight * 100) / 100;
  return `${rounded} tons`;
}

// Usage
const weapons: IWeapon[] = [...];
const total = calculateTotalWeight(weapons);
console.log(`Total weapon weight: ${displayWeight(total)}`);
// Output: "Total weapon weight: 12.50 tons"
```

---

## References

### Official BattleTech Rules
- **TechManual**: Pages 38-42 - Component weights and critical slots
- **Total Warfare**: Pages 48-52 - Construction rules
- **BattleMech Manual**: Weight and slot allocation tables

### Related Documentation
- `openspec/specs/core-entity-types/spec.md` - Base interface definitions
- `openspec/specs/critical-slot-allocation/spec.md` - Slot placement rules
- `openspec/specs/unit-construction/spec.md` - Weight and slot budgets

### Code References
- Interfaces: `src/types/core/BaseTypes.ts`
- Validation: `src/services/validation/physicalPropertiesValidator.ts`
- Type guards: `src/utils/typeGuards/physicalProperties.ts`

---

## Changelog

### Version 1.0 (2025-11-27)
- Initial specification
- Established "weight" as standard property name (not "tons" or "mass")
- Established "criticalSlots" as standard property name (not "slots")
- Defined validation rules for weight (finite, >= 0, may be fractional)
- Defined validation rules for slots (integer, >= 0)
- Documented IPlaceableComponent composition pattern
- Added weight calculation and rounding guidelines
