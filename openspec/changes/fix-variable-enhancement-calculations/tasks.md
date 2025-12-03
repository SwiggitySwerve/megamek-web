# Tasks: Fix Variable Enhancement Calculations

## 1. Update Store Enhancement Helpers

- [ ] 1.1 Import `EquipmentCalculatorService` in `useUnitStore.ts`
- [ ] 1.2 Update `calculateEnhancementWeight()` to use `EquipmentCalculatorService.calculateProperties()` for MASC and Supercharger
- [ ] 1.3 Update `calculateEnhancementSlots()` to use `EquipmentCalculatorService.calculateProperties()` for MASC (Supercharger is already fixed at 1)
- [ ] 1.4 Update `createEnhancementEquipmentList()` signature to accept `engineRating` and `engineWeight` parameters

## 2. Update Store Actions

- [ ] 2.1 Update `setEnhancement()` action to pass `engineRating` and `engineWeight` to equipment list creator
- [ ] 2.2 Update `setEngineRating()` action to recalculate enhancement equipment when engine changes
- [ ] 2.3 Update `setEngineType()` action to recalculate enhancement equipment (engine weight depends on type)

## 3. Deprecate MovementEnhancement.ts Functions

- [ ] 3.1 Add deprecation comments to `getWeight()` function in MASC definition pointing to `EquipmentCalculatorService`
- [ ] 3.2 Update `calculateMASCWeight()` signature to require `engineRating` parameter (or deprecate entirely)
- [ ] 3.3 Update `calculateSuperchargerWeight()` signature to require `engineWeight` parameter (or deprecate entirely)
- [ ] 3.4 Remove incorrect formulas from `MOVEMENT_ENHANCEMENT_DEFINITIONS`

## 4. Validation

- [ ] 4.1 Run existing enhancement calculation tests to ensure they now use correct formulas
- [ ] 4.2 Verify MASC weight/slots change when engine rating changes
- [ ] 4.3 Verify Supercharger weight changes when engine weight changes (but slots stay at 1)
- [ ] 4.4 Test with sample mechs: 75-ton/300 engine should have 15-ton IS MASC

