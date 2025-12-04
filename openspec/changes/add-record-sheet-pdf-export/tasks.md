# Tasks: Add Record Sheet PDF Export

## 1. Dependencies

- [x] 1.1 Add jsPDF dependency to package.json

## 2. Type Definitions

- [x] 2.1 Create src/types/printing/RecordSheetTypes.ts with core interfaces
- [x] 2.2 Create src/types/printing/index.ts barrel export

## 3. Service Layer

- [x] 3.1 Create RecordSheetLayout.ts with positioning constants
- [x] 3.2 Create ArmorDiagramRenderer.ts for armor pip visualization
- [x] 3.3 Create EquipmentTableRenderer.ts for weapons/equipment table
- [x] 3.4 Create MechRecordSheetRenderer.ts combining all elements
- [x] 3.5 Create RecordSheetService.ts for orchestration and PDF export
- [x] 3.6 Create src/services/printing/index.ts barrel export

## 4. Preview Components

- [x] 4.1 Create RecordSheetPreview.tsx canvas/SVG preview component
- [x] 4.2 Create PreviewToolbar.tsx with Download PDF and Print buttons
- [x] 4.3 Create src/components/customizer/preview/index.ts barrel

## 5. Tab Integration

- [x] 5.1 Create PreviewTab.tsx component
- [x] 5.2 Update CustomizerTabs.tsx to include Preview tab
- [x] 5.3 Verify tab navigation works correctly

## 6. Testing

- [ ] 6.1 Manual test PDF generation with various unit configurations
- [ ] 6.2 Verify preview updates when unit changes
- [ ] 6.3 Test print functionality in browser

