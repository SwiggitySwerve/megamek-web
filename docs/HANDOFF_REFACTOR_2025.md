# Refactor Handoff: Type System & Critical Slots (2025)

## Executive Summary
This refactor introduces a strict 4-layer type system to improve code quality, eliminate `any` types, and enforce SOLID principles. The critical slot management system and key UI components have been migrated to this new system.

## 1. Core Architecture
The type system is structured into four distinct layers to enforce separation of concerns:

### Layer 1: Core (`types/core/BaseTypes.ts`)
Foundational types that have no dependencies.
- **Enums**: `EquipmentCategory`, `TechBase`, `RulesLevel`.
- **Interfaces**: `IIdentifiable`, `INamed`, `IWeighted`.

### Layer 2: Domain Entities
Specific entity definitions.
- **System Components** (`ComponentInterfaces.ts`): Defines fixed structural components like `IEngineDef`, `IGyroDef`, `ISystemComponent`.
- **Inventory Equipment** (`EquipmentInterfaces.ts`): Defines removable inventory items like `IEquipment`, `IWeapon`.
- **Bridge**: `IFixedAllocation` represents system components (like Engines) that occupy critical slots but are not inventory items.

### Layer 3: Unit Composition (`UnitInterfaces.ts`)
Defines how a unit is composed of systems and equipment.
- **`ICompleteUnitConfiguration`**: The canonical unit definition source of truth.
- **`IEquipmentInstance`**: Represents an actual piece of equipment allocated to a unit, including state.
- **`ICriticalSlot`**: Strict definition of a critical slot.

### Layer 4: UI & State (`types/criticalSlots.ts`, `types/editor.ts`)
Types optimized for UI interaction and state management.
- **`CriticalSlotObject`**: UI-optimized slot representation (never a string).
- **`EquipmentReference`**: Reference to equipment in a slot (handles both `IEquipment` and `IFixedAllocation`).
- **`EditableUnit`**: Wrapper around unit configuration for editor state.

## 2. Migrated Components
The following components and utilities have been fully migrated to the new type system:

- **Utilities**: 
  - `UnitCriticalManager`
  - `CriticalSlotCalculator`
  - `UnitStateManager`
  - All converted to use strict types (`SystemAllocation`, `EquipmentAllocation`, `CriticalSection`) instead of `any`.

- **UI Components**:
  - `CriticalSlotDropZone`: Drag-and-drop logic updated to use `EquipmentReference` and strictly typed `IEquipment`. Handles both removable equipment and fixed system components correctly.
  - `ArmorManagementComponent`: Refactored to use standard property keys (`head`, `centerTorso`) matching `ICompleteUnitConfiguration`.
  - `useArmorCalculations`: Updated to favor standard `armor.allocation` structure over legacy formats.

## 3. Technical Debt & Future Work

### 🚨 HIGH PRIORITY: WeightBalanceService Refactor
**File**: `services/WeightBalanceService.ts`

This service is a critical calculation engine but currently relies on `any[]` for equipment lists, breaking type safety chains.

- **Current Issue**: Public methods like `calculateTotalWeight` accept `equipment: any[]`.
- **Required Refactoring**:
  1.  **Update Interfaces**: Import `IEquipmentInstance` from `types/core/UnitInterfaces.ts`.
  2.  **Update Signatures**: Change `calculateTotalWeight(config: UnitConfiguration, equipment: any[])` to `calculateTotalWeight(config: UnitConfiguration, equipment: IEquipmentInstance[])`.
  3.  **Update Internal Helpers**: 
      - Helpers like `extractEquipmentWeight` need to safely access properties.
      - Current safe access pattern needed: check if `item` has `equipment` property (instance) or is the definition itself.
  4.  **Propagate**: Update `WeightCalculationService` and `WeightOptimizationService` delegates to match.

### Medium Priority: StructureTab Typing
- **File**: `components/editor/tabs/StructureTab.tsx`
- **Issue**: Uses `as any` casts when calling `updateConfig` because of strict type checks against legacy string values.
- **Action**: Update the local state management to use strict `StructureType` enums and `ISystemComponent` interfaces instead of strings.

### Medium Priority: Validation Services
- **Files**: `services/validation/*`
- **Issue**: Extensive use of `any` types in validation logic.
- **Action**: Migrate to strict `ICompleteUnitConfiguration` types.

## 4. File Status Summary
- **Fully Migrated (Clean)**:
  - `types/core/*`
  - `utils/criticalSlots/*`
  - `types/criticalSlots.ts`
  - `components/editor/criticals/CriticalSlotDropZone.tsx`
  - `components/armor/ArmorManagementComponent.tsx`
- **Needs Refactoring**:
  - `services/WeightBalanceService.ts` (Use strict `IEquipmentInstance`)
  - `components/editor/tabs/StructureTab.tsx` (Remove casts)
- **Deleted**:
  - `types/components.ts` (Merged into core types)
