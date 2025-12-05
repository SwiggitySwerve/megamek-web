## ADDED Requirements

### Requirement: Record Sheet Data Model

The system SHALL define data structures for record sheet generation.

**Rationale**: Typed interfaces ensure correct data mapping from unit configuration to printable format.

**Priority**: Critical

#### Scenario: Record sheet data extraction
- **GIVEN** a valid IBattleMech unit configuration
- **WHEN** RecordSheetService.extractData(unit) is called
- **THEN** return IRecordSheetData containing:
  - Unit identity (name, chassis, model, tonnage)
  - Movement stats (walk, run, jump MP)
  - Armor allocation per location with max values
  - Internal structure points per location
  - Equipment list with heat, damage, range data
  - Heat sink count and type
  - Critical slot assignments per location

---

### Requirement: PDF Generation

The system SHALL generate PDF record sheets client-side using jsPDF.

**Rationale**: Client-side generation works offline and is portable to Electron desktop app.

**Priority**: Critical

#### Scenario: Export PDF
- **WHEN** user clicks Download PDF button
- **THEN** generate PDF document matching record sheet layout
- **AND** trigger browser download with filename "{chassis}-{model}.pdf"
- **AND** PDF is A4/Letter size, print-ready

#### Scenario: PDF content
- **GIVEN** a valid unit configuration
- **WHEN** PDF is generated
- **THEN** PDF contains:
  - Unit header with name, tonnage, tech base, BV
  - Movement block with Walk/Run/Jump MP
  - Armor diagram with values per location
  - Internal structure values per location
  - Weapons and equipment table with columns: Qty, Type, Loc, Heat, Damage, Min, Short, Med, Long
  - Heat scale from 0 to 30 with movement penalties
  - Critical hit tables for each location
  - Pilot data section (blank or filled)

---

### Requirement: Preview Rendering

The system SHALL render a live preview of the record sheet in the browser.

**Rationale**: Users need to see changes immediately as they edit the unit.

**Priority**: High

#### Scenario: Preview display
- **WHEN** PreviewTab is active
- **THEN** RecordSheetPreview component renders current unit as canvas
- **AND** preview updates when unit configuration changes
- **AND** preview maintains aspect ratio of paper size

#### Scenario: Preview scaling
- **GIVEN** PreviewTab is displayed at various viewport sizes
- **WHEN** viewport resizes
- **THEN** preview scales to fit container while maintaining aspect ratio
- **AND** preview remains readable at reduced sizes

#### Scenario: Preview DPI and quality
- **WHEN** preview canvas renders
- **THEN** use high DPI multiplier (10x) for crisp text at all zoom levels
- **AND** support zoom range from 30% to 300%
- **AND** provide "Fit Width" button to auto-scale to container width
- **AND** provide zoom in/out buttons with 10% increments

#### Scenario: PDF DPI and quality  
- **WHEN** PDF is generated
- **THEN** use 3x DPI multiplier (216 DPI) for print quality
- **AND** ensure sharp text and lines at print resolution

---

### Requirement: Print Functionality

The system SHALL support browser print of the record sheet.

**Rationale**: Users may prefer browser print dialog for direct printing.

**Priority**: Medium

#### Scenario: Print action
- **WHEN** user clicks Print button in PreviewTab
- **THEN** open browser print dialog
- **AND** print content matches preview display
- **AND** print uses appropriate page margins

---

### Requirement: Armor Diagram Rendering

The system SHALL render a visual armor diagram showing armor values per location.

**Rationale**: Armor diagrams are essential for tracking damage during gameplay.

**Priority**: High

#### Scenario: Biped mech diagram
- **GIVEN** a biped BattleMech configuration
- **WHEN** armor diagram renders
- **THEN** display mech silhouette with labeled locations:
  - Head (HD)
  - Center Torso (CT) with rear
  - Left Torso (LT) with rear
  - Right Torso (RT) with rear
  - Left Arm (LA)
  - Right Arm (RA)
  - Left Leg (LL)
  - Right Leg (RL)
- **AND** each location shows current/max armor values
- **AND** rear torso values are shown separately

#### Scenario: Quad mech diagram
- **GIVEN** a quad BattleMech configuration
- **WHEN** armor diagram renders
- **THEN** display quad silhouette with four leg locations instead of arms/legs

#### Scenario: Armor value display
- **WHEN** armor diagram renders
- **THEN** display armor point values around the mech silhouette in parentheses format: "( value )"
- **AND** display rear armor values separately for CT, LT, RT locations
- **AND** use SVG text elements with IDs matching template (textArmor_HD, textArmor_CT, textArmor_CTR, etc.)

#### Scenario: Armor pip visualization
- **WHEN** armor diagram renders
- **THEN** display filled circles (pips) representing current armor points
- **AND** load pip SVG assets from template directory
- **AND** position pips according to location-specific layouts

---

### Requirement: Equipment Table Rendering

The system SHALL render a weapons and equipment table with combat statistics.

**Rationale**: Equipment table provides quick reference for weapon ranges and damage during combat.

**Priority**: High

#### Scenario: Equipment columns
- **WHEN** equipment table renders
- **THEN** display columns: Qty, Type, Loc, Heat, Damage, Min, Short, Med, Long
- **AND** weapons are grouped by location
- **AND** ammunition shows shots remaining

#### Scenario: Equipment sorting
- **GIVEN** multiple weapons on unit
- **WHEN** equipment table renders
- **THEN** weapons are sorted by location, then by name

---

### Requirement: Critical Slots Rendering

The system SHALL render critical hit tables for each location matching MegaMekLab style.

**Rationale**: Critical slots track equipment placement and damage during gameplay.

**Priority**: High

#### Scenario: Critical slot display
- **WHEN** critical slots section renders
- **THEN** display 6 columns for HD, CT, LT, RT, LA, RA
- **AND** display 2 columns for LL, RL below
- **AND** each slot shows equipment name or "Roll Again"
- **AND** multi-slot equipment spans consecutive slots with bracket

#### Scenario: Critical slot font styling
- **WHEN** critical slot text renders
- **THEN** use Times New Roman serif font (matching MegaMekLab)
- **AND** bold hittable equipment (weapons, system components)
- **AND** use normal weight for unhittable equipment (Endo Steel, Ferro-Fibrous, TSM, Stealth, Reactive, Reflective, Blue Shield)
- **AND** use normal weight black text for "Roll Again" entries
- **AND** use gray text for empty slots ("-Empty-")

#### Scenario: Critical slot section layout
- **WHEN** 12-slot locations (CT, LT, RT, LA, RA) render
- **THEN** display location name label at top of column (e.g., "Center Torso")
- **AND** display "1-3" marker for slots 1-6 (dice roll result 1-3)
- **AND** display "4-6" marker for slots 7-12 (dice roll result 4-6)
- **AND** add visible gap between slot 6 and slot 7
- **AND** slot numbers restart at 1 for each section (1-6 in both sections)

#### Scenario: Multi-slot equipment brackets
- **WHEN** equipment occupies multiple consecutive slots
- **THEN** draw L-shaped bracket on left side of slots
- **AND** bracket only applies to user-added equipment, NOT system components (Engine, Gyro, Actuators)
- **AND** bracket bridges continuously across the 6/7 gap when equipment spans both sections

#### Scenario: Center Torso slot allocation
- **GIVEN** a standard fusion engine and standard gyro
- **WHEN** CT critical slots are filled
- **THEN** allocate slots in MegaMekLab interleaved pattern:
  - Slots 1-3: Engine (first half)
  - Slots 4-7: Gyro (4 slots for standard gyro)
  - Slots 8-10: Engine (second half)
  - Slots 11-12: Available for user equipment

#### Scenario: Engine naming
- **WHEN** engine slots display in critical table
- **THEN** show full engine type name:
  - "Fusion Engine" for standard fusion
  - "XL Engine" for extra-light
  - "Light Engine" for light fusion
  - "XXL Engine" for extra-extra-light
  - "Compact Engine" for compact
  - "ICE" for internal combustion
  - "Fuel Cell" for fuel cell
  - "Fission Engine" for fission

---

### Requirement: Heat Scale Rendering

The system SHALL render a heat scale from 0 to 30.

**Rationale**: Heat scale tracks heat buildup and associated penalties during combat.

**Priority**: Medium

#### Scenario: Heat scale display
- **WHEN** heat scale section renders
- **THEN** display numbered scale from 0 to 30
- **AND** show movement penalty thresholds
- **AND** show heat sink count and capacity

---

### Requirement: SVG Template Rendering

The system SHALL use SVG templates from MegaMek/MegaMekLab for record sheet generation.

**Rationale**: SVG templates provide authentic MegaMekLab-style record sheets and leverage existing official assets.

**Priority**: High

#### Scenario: SVG template loading
- **WHEN** record sheet renders
- **THEN** load base SVG template from `/public/record-sheets/` directory
- **AND** parse SVG DOM for element manipulation
- **AND** locate elements by ID for data injection (e.g., tspanName, tspanTonnage)

#### Scenario: SVG data injection
- **WHEN** template is loaded with unit data
- **THEN** populate text elements via setTextContent() helper
- **AND** populate armor/structure pips via SVG element cloning
- **AND** render critical slots dynamically into designated areas

#### Scenario: SVG to canvas conversion
- **WHEN** preview or PDF export is requested
- **THEN** serialize modified SVG to string
- **AND** convert to base64 data URL
- **AND** load as Image for canvas drawing
- **AND** apply appropriate DPI scaling for output quality

