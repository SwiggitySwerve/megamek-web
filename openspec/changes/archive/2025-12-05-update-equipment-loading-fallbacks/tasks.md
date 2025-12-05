# Tasks: Update Equipment Loading with Fallback Architecture

## 1. Specification Updates

- [x] 1.1 Add cross-environment loading requirements to data-loading-architecture spec
- [x] 1.2 Add fallback pattern requirements to data-loading-architecture spec
- [x] 1.3 Add initialization state requirements to equipment-services spec
- [x] 1.4 Add fallback behavior requirements to equipment-services spec

## 2. Implementation (Already Complete)

- [x] 2.1 Implement cross-environment loading in EquipmentLoaderService
  - Server-side: Dynamic import of `fs` and `path`
  - Client-side: Standard `fetch` API
- [x] 2.2 Add initialization state tracking to EquipmentLookupService
  - `initialize()` method with idempotent behavior
  - `isInitialized()` and `getDataSource()` methods
- [x] 2.3 Implement fallback definitions in equipmentListUtils
  - Heat sink fallbacks (HEAT_SINK_FALLBACKS)
  - Jump jet fallbacks (JUMP_JET_FALLBACKS)
  - Targeting computer fallbacks (TARGETING_COMPUTER_FALLBACKS)
  - Enhancement fallbacks (ENHANCEMENT_FALLBACKS)
- [x] 2.4 Update weapon utilities to use JSON loader
- [x] 2.5 Update EquipmentNameResolver to use JSON loader

## 3. Testing

- [x] 3.1 Update EquipmentLoaderService tests with proper mocks
- [x] 3.2 Update EquipmentLookupService tests with comprehensive mock data
- [x] 3.3 Update equipmentListUtils tests for fallback behavior
- [x] 3.4 Update weapons/utilities tests with mock loader
- [x] 3.5 Update EquipmentNameResolver tests with comprehensive mocks
- [x] 3.6 Verify all 3502 tests pass

## 4. Validation

- [x] 4.1 Run `openspec validate update-equipment-loading-fallbacks --strict`
- [x] 4.2 Verify spec deltas are correctly formatted
