# Critical Slots Infrastructure - Lint Fixes Summary

## ✅ Completed Work

### 1. Canonical Type Index Created
- **File**: `src/utils/criticalSlots/types/index.ts`
- **Purpose**: Centralized type exports for all critical-slot managers
- **Exports**: All interfaces from SlotAllocationManager, SlotValidationManager, SlotCalculationManager, SpecialComponentCalculator, UnitCalculationManager

### 2. All CommonJS require() Converted to ES Modules ✅
**Files Fixed:**
- ✅ `SlotAllocationManager.ts` - Already fixed (no requires)
- ✅ `HeatManagementManager.ts` - Removed unused require()
- ✅ `ArmorManagementManager.ts` - Converted `require('../armorCalculations')` → `import from '../../lib/armorCalculations'`
- ✅ `ConfigurationManager.ts` - Converted `require('./ArmorManagementManager')` → `import { ArmorManagementManager }`
- ✅ `UnitStateManager.ts` - Converted `require('./MechConstructor')` → `import { MechConstructor }`
- ✅ `WeightBalanceManager.ts` - Converted `require('../internalStructureTable')` → `import from '../../lib/internalStructureTable'`
- ✅ `UnitConfigurationBuilder.ts` - Converted `require('../heatSinkCalculations')` → `import from '../../old/utils/heatSinkCalculations'`

**Result**: Zero `@typescript-eslint/no-var-requires` errors in critical-slot infrastructure

### 3. Type Safety Improvements ✅
- ✅ Fixed `SlotAllocationManager.ts` - All `any` types replaced with `EquipmentObject[]`
- ✅ Fixed `SlotValidationManager.ts` - All `any` types replaced with proper interfaces
- ✅ Fixed `SlotCalculationManager.ts` - All `any[]` replaced with `EquipmentObject[]`
- ✅ Fixed `SpecialComponentCalculator.ts` - Fixed `any[]` parameter type
- ✅ Fixed `MechConstructor.ts` - Changed `error: any` → `error: unknown`
- ✅ Fixed `SectionManagementManager.ts` - Changed `Map<number, any>` → `Map<number, FixedSystemComponent>`
- ✅ Fixed import paths - `SlotValidationManager.ts` now imports from `UnitCriticalManagerTypes` instead of `UnitCriticalManager`

## 🔄 Remaining Work

### 4. Orchestrator Layer Typing (In Progress)
**Files Needing Work:**
- `UnitOrchestratorTypes.ts` - Has `[key: string]: any` index signature (line 29)
- `UnitOrchestratorFacade.ts` - Uses `any` types in several places
- `UnitOrchestratorPerformanceMonitor.ts` - Multiple `any` types
- `UnitOrchestratorStateNotifier.ts` - Multiple `any` types

**Pattern**: Replace `any` with concrete interfaces:
- Define `UnitOrchestratorContext` interface
- Define event payload interfaces
- Define monitoring snapshot interfaces

### 5. Serialization & State Managers
**Files Needing Work:**
- `UnitSerializationManager.ts` - Uses `any` for manager parameter
- `UnitStateManager.ts` - Some `any` types remain
- `UnitCriticalManager.ts` - Some legacy `any` usage

**Pattern**: Create DTO interfaces for serialized state

### 6. Calculator/Gateway Integration
**Files Needing Work:**
- `WeightCalculationManager.ts` - Gateway calls return `any`
- `ArmorManagementManager.ts` - Some gateway integration issues
- `CriticalSlotCalculator.ts` - Gateway calls return `any`

**Pattern**: Type gateway responses properly

### 7. UI Entrypoints
**Files Needing Work:**
- `src/app/compendium/**/*.tsx` - Missing return types
- `src/lib/armorAllocationHelpers.ts` - Missing parameter types
- Various other UI files

**Pattern**: Add explicit return types (`React.FC`, `Promise<JSX.Element>`, etc.)

## 📊 Current Status

### Critical-Slot Infrastructure Files Status
- ✅ **SlotAllocationManager.ts** - Fully typed, no errors
- ✅ **HeatManagementManager.ts** - Fully typed, no errors  
- ✅ **SlotCalculationManager.ts** - Fully typed, no errors
- ✅ **SlotValidationManager.ts** - Fully typed, no errors
- ✅ **SpecialComponentCalculator.ts** - Fully typed, no errors
- ✅ **ValidationManager.ts** - No `any` types found
- ✅ **UnitCalculationManager.ts** - No `any` types found
- ✅ **MechConstructor.ts** - Fixed `any` → `unknown`
- ✅ **SectionManagementManager.ts** - Fixed `any` → `FixedSystemComponent`
- ✅ **ArmorManagementManager.ts** - Fixed require(), needs gateway typing
- ✅ **ConfigurationManager.ts** - Fixed require(), typed ArmorManagementManager
- ✅ **UnitStateManager.ts** - Fixed require(), needs some type cleanup
- ✅ **WeightBalanceManager.ts** - Fixed require(), fully typed
- ✅ **UnitConfigurationBuilder.ts** - Fixed require()

### Remaining Error Count
- **Critical-slot infrastructure**: 0 errors (all require() statements fixed)
- **Orchestrator layer**: ~50+ warnings (mostly `any` types)
- **Other files**: Various warnings (UI entrypoints, etc.)

## 🎯 Next Steps Priority

1. **High Priority**: Type orchestrator layer (affects many files)
2. **Medium Priority**: Type serialization managers
3. **Medium Priority**: Type calculator/gateway integration
4. **Low Priority**: Fix UI entrypoint return types

## 📝 Notes

- All CommonJS `require()` statements have been successfully converted to ES module `import` statements
- The canonical type index provides a single source of truth for shared types
- Import paths have been standardized to use relative paths from `src/`
- Gateway typing will require coordination with `SystemComponentsGateway` and related services

