# Coding Standards

Essential coding standards for the BattleTech Editor project.

## TypeScript

### Use Concrete Types

```typescript
// ✅ Good - Concrete type
function processUnit(unit: ICompleteUnitConfiguration): void { ... }

// ❌ Bad - Using 'any'
function processUnit(unit: any): void { ... }
```

### Import from Core Types

```typescript
// ✅ Good - Import from established paths
import { TechBase, RulesLevel } from '@/types/enums';
import { IEntity, ITechBaseEntity } from '@/types/core';

// ❌ Bad - Relative deep imports
import { TechBase } from '../../types/enums/TechBase';
```

### Use Constants, Not Magic Strings

```typescript
// ✅ Good
if (mech.techBase === TechBase.INNER_SPHERE) { ... }

// ❌ Bad
if (mech.techBase === 'Inner Sphere') { ... }
```

### Use Type Guards

```typescript
// ✅ Good - Type guard for runtime validation
function isValidUnit(data: unknown): data is ICompleteUnitConfiguration {
  return (
    typeof data === 'object' &&
    data !== null &&
    'tonnage' in data &&
    'techBase' in data
  );
}

if (isValidUnit(response.data)) {
  processUnit(response.data); // TypeScript knows it's valid
}
```

## React Components

### Component Structure

```typescript
// 1. Imports
import React, { useState, useCallback } from 'react';
import { TechBase } from '@/types/enums';

// 2. Types
interface ComponentProps {
  unit: ICompleteUnitConfiguration;
  onEdit: (id: string) => void;
}

// 3. Component
export const Component: React.FC<ComponentProps> = ({ unit, onEdit }) => {
  const [value, setValue] = useState('');

  const handleClick = useCallback(() => {
    onEdit(unit.id);
  }, [unit.id, onEdit]);

  return <div onClick={handleClick}>{unit.name}</div>;
};
```

### Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `UnitCard.tsx` |
| Utilities | camelCase | `engineCalculations.ts` |
| Types/Interfaces | PascalCase with I prefix | `IUnitConfiguration` |
| Constants | UPPER_SNAKE_CASE | `MAX_TONNAGE` |
| Hooks | camelCase with `use` prefix | `useUnitData.ts` |

## Formatting

- **Indentation**: 2 spaces
- **Line length**: 100 characters max
- **Semicolons**: Always
- **Trailing commas**: Yes, in multi-line structures
- **Quotes**: Single quotes for strings

## Error Handling

```typescript
// ✅ Good - Specific error handling
try {
  const unit = await fetchUnit(unitId);
  setUnit(unit);
} catch (error) {
  if (error instanceof ValidationError) {
    showError('Invalid unit configuration');
  } else {
    console.error('Failed to fetch unit:', error);
    showError('Failed to load unit');
  }
}
```

## Performance

- Use `React.memo` for expensive components
- Use `useMemo` for expensive calculations
- Use `useCallback` for stable function references

```typescript
const ExpensiveComponent = React.memo<Props>(({ data }) => {
  const processed = useMemo(() => expensiveCalc(data), [data]);
  return <div>{processed}</div>;
});
```

## SOLID Principles

1. **Single Responsibility** - One file, one purpose
2. **Open/Closed** - Extend via interfaces, not modification
3. **Liskov Substitution** - Subtypes must be substitutable
4. **Interface Segregation** - Small, focused interfaces
5. **Dependency Inversion** - Depend on abstractions

## Pre-Commit Checklist

- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] No `as any` casts in new code
- [ ] Types imported from `@/types/core` or `@/types/enums`
- [ ] Constants used instead of magic strings

