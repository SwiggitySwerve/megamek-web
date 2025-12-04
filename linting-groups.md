# Linting Issues - File Groups

This document organizes the 160 files with linting issues into groups of 12 files each for parallel processing by subagents.

## Group 1
1. `src/__tests__/api/units/custom/index.test.ts`
2. `src/__tests__/api/units/import.test.ts`
3. `src/__tests__/components/common/ControlledInput.test.tsx`
4. `src/__tests__/components/customizer/equipment/EquipmentBrowser.test.tsx`
5. `src/__tests__/components/customizer/equipment/EquipmentRow.test.tsx`
6. `src/__tests__/components/customizer/tabs/ArmorTab.test.tsx`
7. `src/__tests__/components/customizer/tabs/CriticalSlotsTab.test.tsx`
8. `src/__tests__/components/customizer/tabs/EquipmentTab.test.tsx`
9. `src/__tests__/components/customizer/tabs/MultiUnitTabs.test.tsx`
10. `src/__tests__/components/customizer/tabs/OverviewTab.test.tsx`
11. `src/__tests__/components/customizer/tabs/StructureTab.test.tsx`
12. `src/__tests__/components/customizer/tabs/TabBar.test.tsx`

## Group 2
1. `src/__tests__/helpers/storeTestHelpers.ts`
2. `src/__tests__/integration/dataLoading/EquipmentLoading.test.ts`
3. `src/__tests__/integration/dataLoading/UnitLoading.test.ts`
4. `src/__tests__/integration/techBaseSwitching.test.ts`
5. `src/__tests__/mocks/services/MockFormulaRegistry.ts`
6. `src/__tests__/service/construction/CalculationService.test.ts`
7. `src/__tests__/service/construction/ValidationService.test.ts`
8. `src/__tests__/service/conversion/ConversionValidation.test.ts`
9. `src/__tests__/service/conversion/EquipmentNameResolver.test.ts`
10. `src/__tests__/service/conversion/LocationMappings.test.ts`
11. `src/__tests__/service/conversion/MTFImportService.test.ts`
12. `src/__tests__/service/conversion/UnitFormatConverter.test.ts`

## Group 3
1. `src/__tests__/service/equipment/EquipmentLoaderService.test.ts`
2. `src/__tests__/service/equipment/EquipmentNameMapper.test.ts`
3. `src/__tests__/service/equipment/EquipmentRegistry.test.ts`
4. `src/__tests__/service/equipment/variableEquipmentFormulas.test.ts`
5. `src/__tests__/service/persistence/FileService.test.ts`
6. `src/__tests__/service/persistence/IndexedDBService.test.ts`
7. `src/__tests__/service/persistence/MigrationService.test.ts`
8. `src/__tests__/service/units/CustomUnitApiService.test.ts`
9. `src/__tests__/service/units/UnitLoaderService.test.ts`
10. `src/__tests__/service/units/UnitNameValidator.test.ts`
11. `src/__tests__/service/units/UnitSearchService.test.ts`
12. `src/__tests__/stores/unitStoreRegistry.test.ts`

## Group 4
1. `src/__tests__/stores/useMultiUnitStore.test.ts`
2. `src/__tests__/stores/useTabManagerStore.test.ts`
3. `src/__tests__/stores/useUnitStore.test.ts`
4. `src/__tests__/unit/utils/construction/displacementUtils.test.ts`
5. `src/__tests__/unit/utils/construction/formulaRegistry.test.ts`
6. `src/__tests__/unit/utils/equipment/equipmentListUtils.test.ts`
7. `src/__tests__/unit/utils/rulesLevel/rulesLevelUtils.test.ts`
8. `src/__tests__/unit/utils/serialization/UnitSerializer.test.ts`
9. `src/components/common/CategoryNavigation.tsx`
10. `src/components/common/ControlledInput.tsx`
11. `src/components/common/CustomDropdown.tsx`
12. `src/components/common/ErrorBoundary.tsx`

## Group 5
1. `src/components/customizer/CustomizerWithRouter.tsx`
2. `src/components/customizer/UnitEditorWithRouting.tsx`
3. `src/components/customizer/armor/ArmorDiagram.tsx`
4. `src/components/customizer/armor/ArmorLegend.tsx`
5. `src/components/customizer/armor/ArmorLocation.tsx`
6. `src/components/customizer/armor/LocationArmorEditor.tsx`
7. `src/components/customizer/critical-slots/CriticalSlotToolbar.tsx`
8. `src/components/customizer/critical-slots/CriticalSlotsDisplay.tsx`
9. `src/components/customizer/critical-slots/DraggableEquipment.tsx`
10. `src/components/customizer/critical-slots/LocationGrid.tsx`
11. `src/components/customizer/dialogs/ImportUnitDialog.tsx`
12. `src/components/customizer/dialogs/ModalOverlay.tsx`

## Group 6
1. `src/components/customizer/dialogs/OverwriteConfirmDialog.tsx`
2. `src/components/customizer/dialogs/ResetConfirmationDialog.tsx`
3. `src/components/customizer/dialogs/SaveUnitDialog.tsx`
4. `src/components/customizer/dialogs/UnitLoadDialog.tsx`
5. `src/components/customizer/dialogs/UnsavedChangesDialog.tsx`
6. `src/components/customizer/dialogs/VersionHistoryDialog.tsx`
7. `src/components/customizer/equipment/CategoryToggleBar.tsx`
8. `src/components/customizer/equipment/EquipmentBrowser.tsx`
9. `src/components/customizer/equipment/EquipmentFilters.tsx`
10. `src/components/customizer/equipment/EquipmentRow.tsx`
11. `src/components/customizer/equipment/GlobalLoadoutTray.tsx`
12. `src/components/customizer/shared/ColorLegend.tsx`

## Group 7
1. `src/components/customizer/shared/GlobalStatusBar.tsx`
2. `src/components/customizer/shared/StatCell.tsx`
3. `src/components/customizer/shared/TechBaseBadge.tsx`
4. `src/components/customizer/shared/TechBaseConfiguration.tsx`
5. `src/components/customizer/shared/UnitInfoBanner.tsx`
6. `src/components/customizer/shared/ValidationBadge.tsx`
7. `src/components/customizer/tabs/ArmorTab.tsx`
8. `src/components/customizer/tabs/CriticalSlotsTab.tsx`
9. `src/components/customizer/tabs/CustomizerTabs.tsx`
10. `src/components/customizer/tabs/EquipmentTab.tsx`
11. `src/components/customizer/tabs/FluffTab.tsx`
12. `src/components/customizer/tabs/MultiUnitTabs.tsx`

## Group 8
1. `src/components/customizer/tabs/NewTabModal.tsx`
2. `src/components/customizer/tabs/OverviewTab.tsx`
3. `src/components/customizer/tabs/StructureTab.tsx`
4. `src/components/customizer/tabs/TabBar.tsx`
5. `src/components/customizer/tabs/UnitTab.tsx`
6. `src/components/ui/Badge.tsx`
7. `src/components/ui/Button.tsx`
8. `src/components/ui/Card.tsx`
9. `src/components/ui/Input.tsx`
10. `src/components/ui/PageLayout.tsx`
11. `src/components/ui/StatDisplay.tsx`
12. `src/hooks/useCustomizerRouter.ts`

## Group 9
1. `src/hooks/useKeyboardNavigation.ts`
2. `src/hooks/useTechBaseSync.ts`
3. `src/hooks/useTechBaseSyncEffect.ts`
4. `src/hooks/useUnit.ts`
5. `src/pages/_app.tsx`
6. `src/pages/_document.tsx`
7. `src/pages/api/catalog.ts`
8. `src/pages/api/custom-variants.ts`
9. `src/pages/api/custom-variants/[variantId].ts`
10. `src/pages/api/equipment.ts`
11. `src/pages/api/equipment/catalog.ts`
12. `src/pages/api/equipment/filters.ts`

## Group 10
1. `src/pages/api/meta/categories.ts`
2. `src/pages/api/meta/techbases.ts`
3. `src/pages/api/units/[unitId].ts`
4. `src/pages/api/units/custom/[variantId].ts`
5. `src/pages/api/units/custom/index.ts`
6. `src/pages/api/units/custom/variants.ts`
7. `src/pages/api/units/import.ts`
8. `src/pages/api/units/search.ts`
9. `src/pages/catalog.tsx`
10. `src/pages/customizer/[unitId].tsx`
11. `src/pages/customizer/new.tsx`
12. `src/pages/index.tsx`

## Group 11
1. `src/pages/units/index.tsx`
2. `src/services/api/BaseApiService.ts`
3. `src/services/api/CatalogApiService.ts`
4. `src/services/api/CustomVariantsApiService.ts`
5. `src/services/api/EquipmentApiService.ts`
6. `src/services/api/UnitApiService.ts`
7. `src/services/catalog/CatalogService.ts`
8. `src/services/catalog/EquipmentCatalogService.ts`
9. `src/services/construction/CalculationService.ts`
10. `src/services/construction/ConstructionRulesValidator.ts`
11. `src/services/construction/ValidationService.ts`
12. `src/services/conversion/ConversionService.ts`

## Group 12
1. `src/services/conversion/EquipmentNameResolver.ts`
2. `src/services/conversion/MTFImportService.ts`
3. `src/services/conversion/UnitFormatConverter.ts`
4. `src/services/equipment/EquipmentLoaderService.ts`
5. `src/services/equipment/EquipmentNameMapper.ts`
6. `src/services/equipment/EquipmentRegistry.ts`
7. `src/services/persistence/FileService.ts`
8. `src/services/persistence/IndexedDBService.ts`
9. `src/services/persistence/MigrationService.ts`
10. `src/services/units/CustomUnitApiService.ts`
11. `src/services/units/UnitLoaderService.ts`
12. `src/services/units/UnitNameValidator.ts`

## Group 13
1. `src/services/units/UnitSearchService.ts`
2. `src/stores/unitStoreRegistry.ts`
3. `src/utils/api/responseUtils.ts`

## Summary

- **Total files:** 147
- **Groups:** 13 (Groups 1-12 have 12 files each, Group 13 has 3 files)
- **Files per group:** 12 (except Group 13 with 3 files)

Each group can be assigned to a subagent for parallel processing of linting fixes.
