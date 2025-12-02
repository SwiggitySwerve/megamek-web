# equipment-tray Specification

## Purpose
TBD - created by archiving change add-customizer-ui-components. Update Purpose after archive.
## Requirements
### Requirement: Summary Statistics Panel
The Equipment Tray SHALL display aggregate statistics for all equipment in a header section.

#### Scenario: Statistics grid display
- **WHEN** tray is expanded
- **THEN** 2x2 grid shows Items count, Total weight, Total slots, Total heat
- **AND** weight shows as X.Xt format

#### Scenario: Overweight indication
- **WHEN** equipment weight exceeds remaining tonnage
- **THEN** weight value displays in red
- **AND** capacity warning banner appears

#### Scenario: Over-slots indication
- **WHEN** critical slots exceed available critical slots
- **THEN** slots value displays in red
- **AND** capacity warning specifies overage amount

### Requirement: Categorized Equipment List
The Equipment Tray SHALL group equipment by type category.

#### Scenario: Category grouping
- **WHEN** equipment exists in tray
- **THEN** items are grouped into categories
- **AND** each category has header with name and item count
- **AND** categories with no items are hidden

#### Scenario: Category visual separator
- **WHEN** category header renders
- **THEN** header shows category name on left
- **AND** horizontal line spans remaining width
- **AND** item count badge on right

### Requirement: Equipment Item Display
Each equipment item SHALL display key information in a compact, color-coded format.

#### Scenario: Item card rendering
- **WHEN** equipment item renders
- **THEN** background color matches equipment type
- **AND** border color is slightly darker variant
- **AND** name is displayed with tech base abbreviation badge

#### Scenario: Stats line
- **WHEN** equipment item renders
- **THEN** stats show slots, weight, heat (if non-zero)
- **AND** stats are separated by bullet characters

### Requirement: Equipment Removal
The Equipment Tray SHALL allow users to remove equipment by double-clicking items.

#### Scenario: Removable equipment
- **WHEN** user double-clicks a weapon or equipment item
- **THEN** item is removed from unit
- **AND** item disappears from tray
- **AND** statistics update immediately

#### Scenario: Non-removable configuration components
- **WHEN** user double-clicks a configuration component
- **THEN** removal is blocked
- **AND** tooltip shows which tab manages that component

### Requirement: Hide Structural Toggle
The Equipment Tray SHALL provide option to hide structural components.

#### Scenario: Toggle behavior
- **WHEN** user checks hide structural option
- **THEN** Structural category is hidden from list
- **AND** structural items remain on unit

### Requirement: Empty State
The Equipment Tray SHALL display helpful guidance when no equipment is added.

#### Scenario: Empty state rendering
- **WHEN** no equipment exists on unit
- **THEN** centered message shows gear emoji icon
- **AND** No Equipment Added heading is displayed
- **AND** Go to Equipment Tab button is shown

### Requirement: Capacity Warning Banner
The Equipment Tray SHALL display warnings when unit limits are exceeded.

#### Scenario: Warning banner display
- **WHEN** weight or slots exceed capacity
- **THEN** red warning banner appears below statistics
- **AND** warning icon is shown

#### Scenario: Warning content
- **WHEN** weight is exceeded
- **THEN** message shows Weight over by X.Xt

### Requirement: Global Loadout Tray
The Equipment Loadout Tray SHALL render as an expandable sidebar on the RIGHT edge of the customizer, visible across ALL tabs.

#### Scenario: Tray visibility
- **WHEN** user is on any customizer tab (Overview, Structure, Armor, Equipment, Criticals, Fluff)
- **THEN** loadout tray toggle is visible at right edge of screen
- **AND** tray can be expanded/collapsed independently of active tab
- **AND** tray state persists across tab switches

#### Scenario: Expanded state
- **WHEN** user clicks tray toggle to expand
- **THEN** tray slides in from right (280px width)
- **AND** tab content area shrinks to accommodate tray
- **AND** transition is smooth (300ms ease-in-out)

#### Scenario: Collapsed state
- **WHEN** tray is collapsed
- **THEN** a vertical toggle button is visible at right edge
- **AND** button displays equipment count badge
- **AND** clicking toggle expands the tray

### Requirement: Tray Header with Actions
The Loadout Tray SHALL display action buttons in a fixed header that does not scroll.

#### Scenario: Header layout
- **WHEN** tray is expanded
- **THEN** header shows "Loadout" title and item count
- **AND** "Remove" button is in header (removes selected item)
- **AND** "Remove All" button is in header
- **AND** header remains fixed when equipment list scrolls

#### Scenario: Remove all confirmation
- **WHEN** user clicks "Remove All" button
- **THEN** confirmation dialog appears
- **AND** confirming removes all user-added equipment
- **AND** structural components (engine, gyro, etc.) are NOT removed

### Requirement: Categorized Equipment Display
The Loadout Tray SHALL group mounted equipment by category with collapsible sections.

#### Scenario: Category grouping
- **WHEN** equipment is mounted
- **THEN** items are grouped into collapsible sections: Energy Weapons, Ballistic Weapons, Missile Weapons, Ammunition, Electronics, Physical Weapons, Misc Equipment
- **AND** each section header shows category name and item count
- **AND** empty categories are hidden

#### Scenario: Category collapse/expand
- **WHEN** user clicks category header
- **THEN** category section toggles between collapsed and expanded
- **AND** collapse state is remembered within session

#### Scenario: Equipment row display
- **WHEN** equipment item renders in category
- **THEN** row shows: Name, Weight (tons), Slots, Location (if allocated)
- **AND** unallocated items show "Unallocated" in amber text
- **AND** clicking row selects it for removal

### Requirement: Structural Slot Components
The system SHALL distinguish between user-added equipment and structural slot components.

#### Scenario: Structural components excluded from tray
- **WHEN** unit has Endo Steel internal structure
- **THEN** Endo Steel slots are NOT shown in loadout tray
- **AND** Endo Steel is managed via Structure tab
- **BUT** Endo Steel slots appear in Critical Slots display

#### Scenario: Ferro-Fibrous armor handling
- **WHEN** unit has Ferro-Fibrous armor
- **THEN** Ferro-Fibrous slots are NOT shown in loadout tray
- **AND** Ferro-Fibrous is managed via Armor tab
- **BUT** Ferro-Fibrous slots appear in Critical Slots display

#### Scenario: Unhittable slot display in Criticals
- **WHEN** viewing Critical Slots tab
- **THEN** Endo Steel and Ferro-Fibrous slots are shown with distinct styling
- **AND** slots are marked as "unhittable" (cannot be destroyed by critical hits)
- **AND** slots are distributed across locations per BattleTech rules

### Requirement: Global Status Bar
The customizer SHALL display a persistent status bar showing capacity utilization across all tabs.

#### Scenario: Status bar display
- **WHEN** user is on any customizer tab
- **THEN** status bar shows at bottom of customizer
- **AND** displays: Weight (used/max with remaining), Free Slots (used/total), Heat (generated/dissipated)

#### Scenario: Over-capacity warning
- **WHEN** weight exceeds tonnage or slots exceed available
- **THEN** affected stat displays in red/warning color
- **AND** remaining value shows as negative

#### Scenario: Slot calculation includes structural
- **WHEN** calculating used slots
- **THEN** count includes Endo Steel slots (14 IS / 7 Clan)
- **AND** count includes Ferro-Fibrous slots (14 IS / 7 Clan)
- **AND** count includes all mounted equipment slots

### Requirement: Structural Equipment Display
The equipment tray SHALL display structural slot items grouped by category.

#### Scenario: Endo Steel display
- **WHEN** Endo Steel is equipped
- **THEN** tray SHALL show under 'Structural' category
- **AND** item count SHALL reflect total slots (e.g., "Endo Steel (IS)" x14)

#### Scenario: Ferro-Fibrous display
- **WHEN** Ferro-Fibrous is equipped
- **THEN** tray SHALL show under 'Structural' category
- **AND** item count SHALL reflect total slots

#### Scenario: Stealth armor display
- **WHEN** Stealth armor is equipped
- **THEN** tray SHALL show 6 'Stealth' items under 'Structural' category
- **AND** each SHALL indicate its assigned location

### Requirement: Non-Removable Structural Items
Structural slot items SHALL NOT be removable via the equipment tray.

#### Scenario: Remove button disabled
- **WHEN** structural equipment item is displayed
- **THEN** remove button SHALL NOT be shown
- **AND** item SHALL display lock icon or visual indicator

#### Scenario: Configuration via tabs
- **WHEN** user wants to change structure/armor type
- **THEN** user SHALL use Structure or Armor configuration tab
- **AND** equipment tray SHALL automatically sync

