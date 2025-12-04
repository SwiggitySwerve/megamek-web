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

The system SHALL render critical hit tables for each location.

**Rationale**: Critical slots track equipment placement and damage during gameplay.

**Priority**: High

#### Scenario: Critical slot display
- **WHEN** critical slots section renders
- **THEN** display 6 columns for HD, CT, LT, RT, LA, RA
- **AND** display 2 columns for LL, RL below
- **AND** each slot shows equipment name or "Roll Again"
- **AND** multi-slot equipment spans consecutive slots with bracket

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

