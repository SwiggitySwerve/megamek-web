# Validation Patterns Specification

**Status**: Active
**Version**: 1.0
**Last Updated**: 2025-11-28
**Dependencies**: Core Entity Types, Core Enumerations
**Affects**: All component specifications, validation services

---

## Overview

### Purpose
Defines reusable validation patterns and rules used across all component specifications. Establishes standardized validation functions, error message formats, and common validation logic to ensure consistency and avoid duplication across the codebase.

### Scope
**In Scope:**
- Common validation patterns (weight, slots, tonnage, percentage)
- Validation function interfaces and signatures
- Error message formats and severity levels
- Type-specific validation rules
- Tech base compatibility validation
- Era availability validation
- Rules level validation
- Numeric range validation with custom bounds

**Out of Scope:**
- Component-specific validation logic (defined in component specs)
- Business rule validation (e.g., weapon hardpoint restrictions)
- UI form validation (covered in UI Integration spec)
- Database constraint validation

### Key Concepts
- **Validation Pattern**: Reusable validation logic for common property types
- **Validation Result**: Standardized return type containing errors and warnings
- **Validation Error**: Error with severity, message, and context
- **Type Guard**: Runtime function to validate object shape
- **Validation Function**: Pure function that validates a value and returns result

---

## Requirements

### Requirement: Standardized Validation Result
All validation functions SHALL return a standardized ValidationResult structure.

**Rationale**: Consistent return type enables uniform error handling and display across the application.

**Priority**: Critical

#### Scenario: Validation success
**GIVEN** a validation function is called with valid data
**WHEN** validation completes
**THEN** return ValidationResult with isValid = true
**AND** errors array SHALL be empty
**AND** warnings array MAY contain warnings

#### Scenario: Validation failure
**GIVEN** a validation function is called with invalid data
**WHEN** validation completes
**THEN** return ValidationResult with isValid = false
**AND** errors array SHALL contain at least one error
**AND** each error SHALL include severity, message, and property name

### Requirement: Weight Validation Pattern
Components with weight SHALL use standardized weight validation.

**Rationale**: Weight validation is common across all physical components and must be consistent.

**Priority**: Critical

#### Scenario: Valid weight
**GIVEN** a component with weight property
**WHEN** validating weight
**THEN** weight MUST be a finite number
**AND** weight MUST be >= 0
**AND** weight MAY be fractional (e.g., 0.5 tons)

#### Scenario: Invalid weight
**GIVEN** a component with invalid weight (negative, NaN, or Infinity)
**WHEN** validating weight
**THEN** validation SHALL fail
**AND** error message SHALL indicate "Weight must be a non-negative finite number"
**AND** error severity SHALL be 'error'

### Requirement: Critical Slots Validation Pattern
Components with critical slots SHALL use standardized slots validation.

**Rationale**: Critical slots must always be non-negative integers across all components.

**Priority**: Critical

#### Scenario: Valid critical slots
**GIVEN** a component with criticalSlots property
**WHEN** validating slots
**THEN** criticalSlots MUST be an integer
**AND** criticalSlots MUST be >= 0

#### Scenario: Invalid critical slots
**GIVEN** a component with fractional or negative slots
**WHEN** validating slots
**THEN** validation SHALL fail
**AND** error message SHALL indicate "Critical slots must be a non-negative integer"
**AND** error severity SHALL be 'error'

### Requirement: Tonnage Range Validation
BattleMech tonnage SHALL be validated within the standard 20-100 ton range.

**Rationale**: Standard BattleMechs are defined as 20-100 tons in official rules.

**Priority**: Critical

#### Scenario: Valid tonnage
**GIVEN** a BattleMech with tonnage
**WHEN** validating tonnage
**THEN** tonnage MUST be >= 20 and <= 100
**AND** tonnage MUST be divisible by 5

#### Scenario: Invalid tonnage
**GIVEN** a BattleMech with tonnage outside 20-100 range
**WHEN** validating tonnage
**THEN** validation SHALL fail
**AND** error message SHALL indicate "BattleMech tonnage must be between 20 and 100 tons"

### Requirement: Percentage Validation
Percentage values SHALL be validated within 0-100 range.

**Rationale**: Percentages represent portions and must be within valid range.

**Priority**: High

#### Scenario: Valid percentage
**GIVEN** a percentage value
**WHEN** validating percentage
**THEN** value MUST be >= 0 and <= 100
**AND** value MAY be fractional (e.g., 25.5%)

#### Scenario: Invalid percentage
**GIVEN** a percentage outside 0-100 range
**WHEN** validating percentage
**THEN** validation SHALL fail
**AND** error message SHALL indicate "Percentage must be between 0 and 100"

### Requirement: Tech Base Compatibility Validation
Components SHALL be validated for tech base compatibility.

**Rationale**: Mixing technology bases has specific rules that must be enforced.

**Priority**: High

#### Scenario: Compatible tech bases
**GIVEN** a unit with specific tech base
**WHEN** adding a component
**THEN** component tech base MUST be compatible with unit tech base
**AND** MIXED tech base units accept both IS and Clan components

#### Scenario: Incompatible tech bases
**GIVEN** a CLAN unit
**WHEN** adding an INNER_SPHERE-only component
**THEN** validation SHALL fail
**AND** error message SHALL indicate tech base incompatibility

### Requirement: Era Availability Validation
Components SHALL be validated for era availability.

**Rationale**: Technology availability varies by timeline era and must be validated.

**Priority**: High

#### Scenario: Component available in era
**GIVEN** a component with introduction year 3025
**WHEN** validating for campaign year 3050
**THEN** validation SHALL succeed
**AND** component SHALL be available

#### Scenario: Component not yet invented
**GIVEN** a component with introduction year 3050
**WHEN** validating for campaign year 3025
**THEN** validation SHALL fail
**AND** error message SHALL indicate "not yet invented in year 3025"

#### Scenario: Component extinct
**GIVEN** a component with extinction year 3000
**WHEN** validating for campaign year 3025
**THEN** validation SHALL fail
**AND** error message SHALL indicate "extinct/unavailable in year 3025"

### Requirement: Rules Level Validation
Components SHALL be validated against rules level filter.

**Rationale**: Players need to limit technology complexity for different game types.

**Priority**: High

#### Scenario: Component within rules level
**GIVEN** a STANDARD component
**WHEN** validating with ADVANCED filter
**THEN** validation SHALL succeed

#### Scenario: Component exceeds rules level
**GIVEN** an EXPERIMENTAL component
**WHEN** validating with STANDARD filter
**THEN** validation SHALL fail
**AND** error message SHALL indicate rules level exceeded

### Requirement: Required Field Validation
Required fields SHALL be validated for presence and non-empty values.

**Rationale**: Required fields must always have valid values.

**Priority**: Critical

#### Scenario: Required field present
**GIVEN** an entity with required field
**WHEN** validating required fields
**THEN** field MUST NOT be undefined or null
**AND** if string type, MUST NOT be empty or whitespace-only

#### Scenario: Required field missing
**GIVEN** an entity missing a required field
**WHEN** validating required fields
**THEN** validation SHALL fail
**AND** error message SHALL indicate "required field missing"

### Requirement: Numeric Range Validation
Numeric values SHALL support custom range validation.

**Rationale**: Many properties have domain-specific numeric constraints.

**Priority**: High

#### Scenario: Value within range
**GIVEN** a numeric value with custom bounds
**WHEN** validating range
**THEN** value MUST be >= minimum and <= maximum

#### Scenario: Value outside range
**GIVEN** a numeric value outside custom bounds
**WHEN** validating range
**THEN** validation SHALL fail
**AND** error message SHALL indicate expected range

---

## Data Model Requirements

### Required Interfaces

```typescript
/**
 * Result of a validation operation
 */
interface ValidationResult {
  /**
   * Whether validation passed (no errors)
   */
  readonly isValid: boolean;

  /**
   * Validation errors (prevent save/use)
   */
  readonly errors: ValidationError[];

  /**
   * Validation warnings (allow save but notify user)
   */
  readonly warnings: ValidationWarning[];
}

/**
 * Validation error details
 */
interface ValidationError {
  /**
   * Severity level
   */
  readonly severity: 'error';

  /**
   * Human-readable error message
   */
  readonly message: string;

  /**
   * Property name that failed validation
   */
  readonly property?: string;

  /**
   * Component or entity ID
   */
  readonly entityId?: string;

  /**
   * Additional context data
   */
  readonly context?: Record<string, unknown>;
}

/**
 * Validation warning details
 */
interface ValidationWarning {
  /**
   * Severity level
   */
  readonly severity: 'warning';

  /**
   * Human-readable warning message
   */
  readonly message: string;

  /**
   * Property name that triggered warning
   */
  readonly property?: string;

  /**
   * Component or entity ID
   */
  readonly entityId?: string;

  /**
   * Additional context data
   */
  readonly context?: Record<string, unknown>;
}

/**
 * Validation function signature
 */
type ValidatorFunction<T> = (value: T, context?: ValidationContext) => ValidationResult;

/**
 * Validation context for contextual validation
 */
interface ValidationContext {
  /**
   * Unit being validated (if applicable)
   */
  readonly unit?: IUnit;

  /**
   * Campaign year for era validation
   */
  readonly campaignYear?: number;

  /**
   * Rules level filter
   */
  readonly rulesLevelFilter?: RulesLevelFilter;

  /**
   * Tech base constraint
   */
  readonly techBase?: TechBase;

  /**
   * Additional context properties
   */
  readonly [key: string]: unknown;
}
```

### Validation Function Interfaces

```typescript
/**
 * Weight validation function
 */
interface IWeightValidator {
  /**
   * Validates weight is finite and non-negative
   * @param weight - Weight in tons
   * @returns Validation result
   */
  validateWeight(weight: number): ValidationResult;
}

/**
 * Critical slots validation function
 */
interface ICriticalSlotsValidator {
  /**
   * Validates critical slots is non-negative integer
   * @param slots - Number of critical slots
   * @returns Validation result
   */
  validateCriticalSlots(slots: number): ValidationResult;
}

/**
 * Tonnage validation function
 */
interface ITonnageValidator {
  /**
   * Validates BattleMech tonnage is within 20-100 range
   * @param tonnage - Unit tonnage
   * @returns Validation result
   */
  validateTonnage(tonnage: number): ValidationResult;
}

/**
 * Percentage validation function
 */
interface IPercentageValidator {
  /**
   * Validates percentage is within 0-100 range
   * @param percentage - Percentage value
   * @returns Validation result
   */
  validatePercentage(percentage: number): ValidationResult;
}

/**
 * Tech base compatibility validation
 */
interface ITechBaseValidator {
  /**
   * Validates component tech base is compatible with unit
   * @param componentTechBase - Component's tech base
   * @param unitTechBase - Unit's tech base
   * @returns Validation result
   */
  validateTechBaseCompatibility(
    componentTechBase: TechBase,
    unitTechBase: TechBase
  ): ValidationResult;
}

/**
 * Era availability validation
 */
interface IEraValidator {
  /**
   * Validates component is available in specified year
   * @param component - Component with temporal properties
   * @param campaignYear - Year to validate against
   * @returns Validation result
   */
  validateEraAvailability(
    component: ITemporalEntity,
    campaignYear: number
  ): ValidationResult;
}

/**
 * Rules level validation
 */
interface IRulesLevelValidator {
  /**
   * Validates component rules level against filter
   * @param componentLevel - Component's rules level
   * @param filter - Maximum allowed rules level
   * @returns Validation result
   */
  validateRulesLevel(
    componentLevel: RulesLevel,
    filter: RulesLevelFilter
  ): ValidationResult;
}

/**
 * Required field validation
 */
interface IRequiredFieldValidator {
  /**
   * Validates required field is present and non-empty
   * @param value - Field value
   * @param fieldName - Field name for error message
   * @returns Validation result
   */
  validateRequiredField(
    value: unknown,
    fieldName: string
  ): ValidationResult;
}

/**
 * Numeric range validation
 */
interface INumericRangeValidator {
  /**
   * Validates numeric value is within specified range
   * @param value - Numeric value
   * @param min - Minimum allowed value (inclusive)
   * @param max - Maximum allowed value (inclusive)
   * @param fieldName - Field name for error message
   * @returns Validation result
   */
  validateNumericRange(
    value: number,
    min: number,
    max: number,
    fieldName: string
  ): ValidationResult;
}
```

---

## Validation Rules

### Validation: Weight
**Rule**: Weight must be finite and non-negative

**Severity**: Error

**Condition**:
```typescript
function validateWeight(weight: number): ValidationResult {
  const errors: ValidationError[] = [];

  if (!Number.isFinite(weight)) {
    errors.push({
      severity: 'error',
      message: 'Weight must be a finite number',
      property: 'weight',
      context: { value: weight }
    });
  }

  if (weight < 0) {
    errors.push({
      severity: 'error',
      message: 'Weight cannot be negative',
      property: 'weight',
      context: { value: weight }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: []
  };
}
```

**Error Message**: "Weight must be a non-negative finite number"

**User Action**: Correct the weight value to be >= 0 and finite

### Validation: Critical Slots
**Rule**: Critical slots must be non-negative integer

**Severity**: Error

**Condition**:
```typescript
function validateCriticalSlots(slots: number): ValidationResult {
  const errors: ValidationError[] = [];

  if (!Number.isInteger(slots)) {
    errors.push({
      severity: 'error',
      message: 'Critical slots must be an integer',
      property: 'criticalSlots',
      context: { value: slots }
    });
  }

  if (slots < 0) {
    errors.push({
      severity: 'error',
      message: 'Critical slots cannot be negative',
      property: 'criticalSlots',
      context: { value: slots }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: []
  };
}
```

**Error Message**: "Critical slots must be a non-negative integer"

**User Action**: Correct slots to be a whole number >= 0

### Validation: BattleMech Tonnage
**Rule**: Tonnage must be 20-100 tons and divisible by 5

**Severity**: Error

**Condition**:
```typescript
function validateTonnage(tonnage: number): ValidationResult {
  const errors: ValidationError[] = [];

  if (tonnage < 20 || tonnage > 100) {
    errors.push({
      severity: 'error',
      message: 'BattleMech tonnage must be between 20 and 100 tons',
      property: 'tonnage',
      context: { value: tonnage, min: 20, max: 100 }
    });
  }

  if (tonnage % 5 !== 0) {
    errors.push({
      severity: 'error',
      message: 'BattleMech tonnage must be divisible by 5',
      property: 'tonnage',
      context: { value: tonnage }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: []
  };
}
```

**Error Message**: "BattleMech tonnage must be between 20 and 100 tons and divisible by 5"

**User Action**: Set tonnage to valid value (20, 25, 30, ..., 95, 100)

### Validation: Percentage
**Rule**: Percentage must be 0-100

**Severity**: Error

**Condition**:
```typescript
function validatePercentage(percentage: number): ValidationResult {
  const errors: ValidationError[] = [];

  if (percentage < 0 || percentage > 100) {
    errors.push({
      severity: 'error',
      message: 'Percentage must be between 0 and 100',
      property: 'percentage',
      context: { value: percentage, min: 0, max: 100 }
    });
  }

  if (!Number.isFinite(percentage)) {
    errors.push({
      severity: 'error',
      message: 'Percentage must be a finite number',
      property: 'percentage',
      context: { value: percentage }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: []
  };
}
```

**Error Message**: "Percentage must be between 0 and 100"

**User Action**: Set percentage to value within 0-100 range

### Validation: Tech Base Compatibility
**Rule**: Component tech base must be compatible with unit

**Severity**: Error

**Condition**:
```typescript
function validateTechBaseCompatibility(
  componentTechBase: TechBase,
  unitTechBase: TechBase
): ValidationResult {
  const errors: ValidationError[] = [];

  // Mixed tech units accept all components
  if (unitTechBase === TechBase.MIXED) {
    return { isValid: true, errors: [], warnings: [] };
  }

  // Non-mixed units require matching tech base
  if (componentTechBase !== unitTechBase &&
      componentTechBase !== TechBase.BOTH) {
    errors.push({
      severity: 'error',
      message: `Component tech base ${componentTechBase} is incompatible with unit tech base ${unitTechBase}`,
      property: 'techBase',
      context: { componentTechBase, unitTechBase }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: []
  };
}
```

**Error Message**: "Component tech base {X} is incompatible with unit tech base {Y}"

**User Action**: Select component with compatible tech base or change unit to Mixed tech base

### Validation: Era Availability
**Rule**: Component must be available in campaign year

**Severity**: Error

**Condition**:
```typescript
function validateEraAvailability(
  component: ITemporalEntity,
  campaignYear: number
): ValidationResult {
  const errors: ValidationError[] = [];

  // Not yet introduced
  if (campaignYear < component.introductionYear) {
    errors.push({
      severity: 'error',
      message: `${component.name} not yet invented in year ${campaignYear} (introduced ${component.introductionYear})`,
      property: 'introductionYear',
      entityId: component.id,
      context: { campaignYear, introductionYear: component.introductionYear }
    });
  }

  // Already extinct
  if (component.extinctionYear !== undefined &&
      campaignYear > component.extinctionYear) {
    errors.push({
      severity: 'error',
      message: `${component.name} is extinct/unavailable in year ${campaignYear} (extinct ${component.extinctionYear})`,
      property: 'extinctionYear',
      entityId: component.id,
      context: { campaignYear, extinctionYear: component.extinctionYear }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: []
  };
}
```

**Error Message**: "{Component} not yet invented in year {Y}" or "{Component} extinct in year {Y}"

**User Action**: Change campaign year or select different component

### Validation: Rules Level
**Rule**: Component rules level must not exceed filter

**Severity**: Error (or Warning for informational filters)

**Condition**:
```typescript
function validateRulesLevel(
  componentLevel: RulesLevel,
  filter: RulesLevelFilter
): ValidationResult {
  const errors: ValidationError[] = [];

  const allowed = matchesRulesFilter(componentLevel, filter);

  if (!allowed) {
    errors.push({
      severity: 'error',
      message: `Component rules level ${componentLevel} exceeds filter ${filter}`,
      property: 'rulesLevel',
      context: { componentLevel, filter }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: []
  };
}

function matchesRulesFilter(
  level: RulesLevel,
  filter: RulesLevelFilter
): boolean {
  switch (filter) {
    case RulesLevelFilter.INTRODUCTORY:
      return level === RulesLevel.INTRODUCTORY;
    case RulesLevelFilter.STANDARD:
      return level === RulesLevel.INTRODUCTORY ||
             level === RulesLevel.STANDARD;
    case RulesLevelFilter.ADVANCED:
      return level !== RulesLevel.EXPERIMENTAL;
    case RulesLevelFilter.ALL:
      return true;
    default:
      return false;
  }
}
```

**Error Message**: "Component rules level {X} exceeds allowed level {Y}"

**User Action**: Change rules level filter or select different component

### Validation: Required Field
**Rule**: Required field must be present and non-empty

**Severity**: Error

**Condition**:
```typescript
function validateRequiredField(
  value: unknown,
  fieldName: string
): ValidationResult {
  const errors: ValidationError[] = [];

  if (value === undefined || value === null) {
    errors.push({
      severity: 'error',
      message: `${fieldName} is required`,
      property: fieldName
    });
    return { isValid: false, errors, warnings: [] };
  }

  if (typeof value === 'string' && value.trim() === '') {
    errors.push({
      severity: 'error',
      message: `${fieldName} cannot be empty`,
      property: fieldName
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: []
  };
}
```

**Error Message**: "{Field} is required" or "{Field} cannot be empty"

**User Action**: Provide valid value for required field

### Validation: Numeric Range
**Rule**: Value must be within specified range

**Severity**: Error

**Condition**:
```typescript
function validateNumericRange(
  value: number,
  min: number,
  max: number,
  fieldName: string
): ValidationResult {
  const errors: ValidationError[] = [];

  if (!Number.isFinite(value)) {
    errors.push({
      severity: 'error',
      message: `${fieldName} must be a finite number`,
      property: fieldName,
      context: { value }
    });
    return { isValid: false, errors, warnings: [] };
  }

  if (value < min || value > max) {
    errors.push({
      severity: 'error',
      message: `${fieldName} must be between ${min} and ${max}`,
      property: fieldName,
      context: { value, min, max }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: []
  };
}
```

**Error Message**: "{Field} must be between {min} and {max}"

**User Action**: Correct value to be within specified range

---

## Error Message Formats

### Standard Format
All error messages SHALL follow these formats for consistency:

**Property Validation Errors**:
- Pattern: `{Property} must be {constraint}`
- Examples:
  - "Weight must be a non-negative finite number"
  - "Critical slots must be a non-negative integer"
  - "Tonnage must be between 20 and 100 tons"

**Range Validation Errors**:
- Pattern: `{Property} must be between {min} and {max}`
- Examples:
  - "Percentage must be between 0 and 100"
  - "Damage must be between 1 and 100"

**Compatibility Errors**:
- Pattern: `{Component} {reason} with {context}`
- Examples:
  - "Component tech base CLAN is incompatible with unit tech base INNER_SPHERE"
  - "ER Medium Laser not yet invented in year 3025"

**Required Field Errors**:
- Pattern: `{Field} is required` or `{Field} cannot be empty`
- Examples:
  - "id is required"
  - "name cannot be empty"

### Severity Levels

**Error**: Prevents save/use of configuration
- Use for: Invalid data, missing required fields, constraint violations
- User cannot proceed without fixing

**Warning**: Allows save but notifies user
- Use for: Suboptimal choices, unusual configurations, deprecated features
- User can proceed but should review

---

## Technology Base Variants

### Inner Sphere Implementation
**No special rules** - Validation patterns apply uniformly to all tech bases.

### Clan Implementation
**No special rules** - Validation patterns apply uniformly to all tech bases.

### Mixed Tech Rules
**When unit tech base is Mixed**: Tech base compatibility validation allows both IS and Clan components.

---

## Dependencies

### Depends On
- **Core Entity Types**: IEntity, ITechBaseEntity, ITemporalEntity, IWeightedComponent, ISlottedComponent
- **Core Enumerations**: TechBase, RulesLevel, RulesLevelFilter, Era

### Used By
- **All component specifications**: Use validation patterns for properties
- **Validation services**: Implement validation logic
- **UI forms**: Display validation errors and warnings
- **Unit construction**: Validate unit configuration

### Construction Sequence
1. Define ValidationResult and error/warning interfaces
2. Define validation function interfaces
3. Implement validation functions
4. Use in component specifications
5. Integrate into validation services and UI

---

## Implementation Notes

### Performance Considerations
- Validation functions should be pure (no side effects)
- Cache validation results when validating large lists
- Validate on blur/change in UI, not on every keystroke
- Short-circuit validation when first error is found (if appropriate)

### Edge Cases
- **Zero values**: Zero is valid for weight, slots (handled explicitly)
- **Undefined vs null**: Treat both as missing value
- **Floating point precision**: Use epsilon comparison for fractional values if needed
- **Multiple errors**: Return all errors, don't stop at first failure

### Common Pitfalls
- **Pitfall**: Not validating in all necessary locations
  - **Solution**: Validate at system boundaries (user input, API, file load)
- **Pitfall**: Different error message formats
  - **Solution**: Use consistent message templates
- **Pitfall**: Throwing exceptions instead of returning ValidationResult
  - **Solution**: Always return ValidationResult, never throw
- **Pitfall**: Mutating input values during validation
  - **Solution**: Validation functions must be pure

---

## Examples

### Example 1: Weight Validation
```typescript
import { validateWeight } from '@/validation/patterns';

function validateComponent(component: IWeightedComponent): ValidationResult {
  return validateWeight(component.weight);
}

// Usage
const component = { weight: -1 };
const result = validateComponent(component);
// result.isValid = false
// result.errors = [{ severity: 'error', message: 'Weight cannot be negative', property: 'weight' }]
```

### Example 2: Multiple Validations
```typescript
function validatePlaceableComponent(
  component: IPlaceableComponent
): ValidationResult {
  const results: ValidationResult[] = [
    validateWeight(component.weight),
    validateCriticalSlots(component.criticalSlots)
  ];

  // Combine results
  return {
    isValid: results.every(r => r.isValid),
    errors: results.flatMap(r => r.errors),
    warnings: results.flatMap(r => r.warnings)
  };
}
```

### Example 3: Contextual Validation
```typescript
function validateComponentForUnit(
  component: ITechBaseEntity & ITemporalEntity,
  context: ValidationContext
): ValidationResult {
  const results: ValidationResult[] = [];

  // Tech base validation
  if (context.techBase) {
    results.push(
      validateTechBaseCompatibility(component.techBase, context.techBase)
    );
  }

  // Era validation
  if (context.campaignYear) {
    results.push(
      validateEraAvailability(component, context.campaignYear)
    );
  }

  // Rules level validation
  if (context.rulesLevelFilter) {
    results.push(
      validateRulesLevel(component.rulesLevel, context.rulesLevelFilter)
    );
  }

  return {
    isValid: results.every(r => r.isValid),
    errors: results.flatMap(r => r.errors),
    warnings: results.flatMap(r => r.warnings)
  };
}

// Usage
const component: ITechBaseEntity & ITemporalEntity = {
  id: 'er-med-laser-is',
  name: 'ER Medium Laser',
  techBase: TechBase.INNER_SPHERE,
  rulesLevel: RulesLevel.ADVANCED,
  introductionYear: 3058,
  era: Era.CIVIL_WAR
};

const context: ValidationContext = {
  techBase: TechBase.INNER_SPHERE,
  campaignYear: 3025,
  rulesLevelFilter: RulesLevelFilter.STANDARD
};

const result = validateComponentForUnit(component, context);
// result.isValid = false
// result.errors = [
//   { message: 'ER Medium Laser not yet invented in year 3025...', ... },
//   { message: 'Component rules level Advanced exceeds filter Standard', ... }
// ]
```

### Example 4: Custom Range Validation
```typescript
// Validate heat generation (domain-specific range)
function validateHeatGeneration(heat: number): ValidationResult {
  return validateNumericRange(heat, 0, 50, 'heat');
}

// Validate ammunition shots per ton
function validateShotsPerTon(shots: number): ValidationResult {
  return validateNumericRange(shots, 1, 200, 'shotsPerTon');
}
```

### Example 5: Composite Validation
```typescript
class ComponentValidator {
  validateFully(
    component: IWeapon & ITemporalEntity,
    context: ValidationContext
  ): ValidationResult {
    const allResults: ValidationResult[] = [
      // Physical properties
      validateWeight(component.weight),
      validateCriticalSlots(component.criticalSlots),

      // Required fields
      validateRequiredField(component.id, 'id'),
      validateRequiredField(component.name, 'name'),

      // Domain-specific
      validateNumericRange(component.damage, 0, 100, 'damage'),
      validateNumericRange(component.heat, 0, 50, 'heat'),

      // Contextual
      validateComponentForUnit(component, context)
    ];

    return {
      isValid: allResults.every(r => r.isValid),
      errors: allResults.flatMap(r => r.errors),
      warnings: allResults.flatMap(r => r.warnings)
    };
  }
}
```

### Example 6: Validation Result Display
```typescript
function displayValidationErrors(result: ValidationResult): void {
  if (result.isValid) {
    console.log('Validation passed');
    return;
  }

  console.log('Validation failed:');
  for (const error of result.errors) {
    console.log(`  [${error.severity.toUpperCase()}] ${error.message}`);
    if (error.property) {
      console.log(`    Property: ${error.property}`);
    }
    if (error.context) {
      console.log(`    Context: ${JSON.stringify(error.context)}`);
    }
  }

  if (result.warnings.length > 0) {
    console.log('Warnings:');
    for (const warning of result.warnings) {
      console.log(`  [WARNING] ${warning.message}`);
    }
  }
}
```

### Example 7: Form Integration
```typescript
function validateFormField(
  fieldName: string,
  value: unknown,
  validationRules: ValidatorFunction<unknown>[]
): ValidationResult {
  const results = validationRules.map(validator => validator(value));

  return {
    isValid: results.every(r => r.isValid),
    errors: results.flatMap(r => r.errors),
    warnings: results.flatMap(r => r.warnings)
  };
}

// Usage in form
const weightValidationRules = [
  validateRequiredField,
  (value: number) => validateWeight(value),
  (value: number) => validateNumericRange(value, 0.5, 100, 'weight')
];

const result = validateFormField('weight', formData.weight, weightValidationRules);
if (!result.isValid) {
  displayFormErrors('weight', result.errors);
}
```

---

## References

### Official BattleTech Rules
- **TechManual**: Various pages - Component specifications and constraints
- **Total Warfare**: Construction rules and validation requirements
- **BattleMech Manual**: Quick reference for component limits

### Related Documentation
- `openspec/specs/phase-1-foundation/core-entity-types/spec.md` - Base interfaces
- `openspec/specs/phase-1-foundation/physical-properties-system/spec.md` - Weight and slots
- `openspec/specs/phase-1-foundation/era-temporal-system/spec.md` - Era validation
- `openspec/specs/phase-1-foundation/rules-level-system/spec.md` - Rules level validation

### Code References
- Interfaces: `src/types/core/ValidationInterfaces.ts`
- Validators: `src/services/validation/patterns/*.ts`
- Type guards: `src/utils/typeGuards.ts`

---

## Changelog

### Version 1.0 (2025-11-28)
- Initial specification
- Defined ValidationResult and error/warning interfaces
- Defined 9 common validation patterns: weight, critical slots, tonnage, percentage, tech base, era, rules level, required fields, numeric range
- Established error message format standards
- Provided validation function interfaces and implementations
- Added comprehensive examples for all validation patterns
