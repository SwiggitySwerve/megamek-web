/**
 * Record Sheet Layout Constants
 * 
 * Defines positioning, sizing, and styling constants for record sheet rendering.
 * Based on standard BattleTech record sheet format.
 * 
 * @spec openspec/specs/record-sheet-export/spec.md
 */

import { PaperSize, PAPER_DIMENSIONS, IRect } from '@/types/printing';

/**
 * Margin sizes in points
 */
export const MARGINS = {
  top: 36,      // 0.5 inch
  bottom: 36,
  left: 36,
  right: 36,
} as const;

/**
 * Font sizes in points
 */
export const FONT_SIZES = {
  title: 14,
  sectionHeader: 10,
  label: 8,
  value: 9,
  small: 7,
  tiny: 6,
} as const;

/**
 * Font families
 */
export const FONTS = {
  primary: 'Helvetica',
  bold: 'Helvetica-Bold',
  mono: 'Courier',
} as const;

/**
 * Colors for rendering
 */
export const COLORS = {
  black: '#000000',
  white: '#FFFFFF',
  gray: '#666666',
  lightGray: '#CCCCCC',
  border: '#000000',
  headerBg: '#E0E0E0',
  pipFill: '#FFFFFF',
  pipStroke: '#000000',
  pipDamaged: '#000000',
} as const;

/**
 * Line widths in points
 */
export const LINE_WIDTHS = {
  thin: 0.5,
  normal: 1,
  thick: 1.5,
  border: 2,
} as const;

/**
 * Calculate content area dimensions
 */
export function getContentArea(paperSize: PaperSize): IRect {
  const { width, height } = PAPER_DIMENSIONS[paperSize];
  return {
    x: MARGINS.left,
    y: MARGINS.top,
    width: width - MARGINS.left - MARGINS.right,
    height: height - MARGINS.top - MARGINS.bottom,
  };
}

/**
 * Section heights as percentages of content area
 */
export const SECTION_HEIGHTS = {
  header: 0.06,        // Unit name, tonnage, tech base, BV
  movement: 0.04,      // Walk/Run/Jump
  mainContent: 0.50,   // Armor diagram + Equipment table side by side
  criticals: 0.30,     // Critical hit tables
  pilot: 0.06,         // Pilot data
  footer: 0.04,        // Copyright, page info
} as const;

/**
 * Main content split (armor diagram vs equipment)
 */
export const MAIN_CONTENT_SPLIT = {
  armorWidth: 0.40,    // Left side: Armor diagram
  equipmentWidth: 0.60, // Right side: Equipment table
} as const;

/**
 * Calculate section rectangles
 */
export function getSectionRects(paperSize: PaperSize): Record<string, IRect> {
  const content = getContentArea(paperSize);
  let currentY = content.y;
  
  const headerHeight = content.height * SECTION_HEIGHTS.header;
  const header: IRect = {
    x: content.x,
    y: currentY,
    width: content.width,
    height: headerHeight,
  };
  currentY += headerHeight;
  
  const movementHeight = content.height * SECTION_HEIGHTS.movement;
  const movement: IRect = {
    x: content.x,
    y: currentY,
    width: content.width,
    height: movementHeight,
  };
  currentY += movementHeight;
  
  const mainContentHeight = content.height * SECTION_HEIGHTS.mainContent;
  const armorDiagram: IRect = {
    x: content.x,
    y: currentY,
    width: content.width * MAIN_CONTENT_SPLIT.armorWidth,
    height: mainContentHeight,
  };
  
  const equipmentTable: IRect = {
    x: content.x + content.width * MAIN_CONTENT_SPLIT.armorWidth,
    y: currentY,
    width: content.width * MAIN_CONTENT_SPLIT.equipmentWidth,
    height: mainContentHeight,
  };
  currentY += mainContentHeight;
  
  const criticalsHeight = content.height * SECTION_HEIGHTS.criticals;
  const criticals: IRect = {
    x: content.x,
    y: currentY,
    width: content.width,
    height: criticalsHeight,
  };
  currentY += criticalsHeight;
  
  const pilotHeight = content.height * SECTION_HEIGHTS.pilot;
  const pilot: IRect = {
    x: content.x,
    y: currentY,
    width: content.width,
    height: pilotHeight,
  };
  
  return {
    header,
    movement,
    armorDiagram,
    equipmentTable,
    criticals,
    pilot,
  };
}

/**
 * Armor diagram layout for biped mech
 */
export const BIPED_ARMOR_LAYOUT = {
  // Relative positions (0-1) within armor diagram section
  head: { x: 0.5, y: 0.08, width: 0.15, height: 0.12 },
  leftArm: { x: 0.15, y: 0.25, width: 0.18, height: 0.35 },
  rightArm: { x: 0.85, y: 0.25, width: 0.18, height: 0.35 },
  leftTorso: { x: 0.28, y: 0.22, width: 0.18, height: 0.35 },
  centerTorso: { x: 0.5, y: 0.22, width: 0.18, height: 0.40 },
  rightTorso: { x: 0.72, y: 0.22, width: 0.18, height: 0.35 },
  leftLeg: { x: 0.30, y: 0.65, width: 0.16, height: 0.30 },
  rightLeg: { x: 0.70, y: 0.65, width: 0.16, height: 0.30 },
} as const;

/**
 * Armor diagram layout for quad mech
 */
export const QUAD_ARMOR_LAYOUT = {
  head: { x: 0.5, y: 0.08, width: 0.15, height: 0.12 },
  frontLeftLeg: { x: 0.20, y: 0.25, width: 0.16, height: 0.30 },
  frontRightLeg: { x: 0.80, y: 0.25, width: 0.16, height: 0.30 },
  leftTorso: { x: 0.28, y: 0.35, width: 0.18, height: 0.30 },
  centerTorso: { x: 0.5, y: 0.30, width: 0.18, height: 0.35 },
  rightTorso: { x: 0.72, y: 0.35, width: 0.18, height: 0.30 },
  rearLeftLeg: { x: 0.25, y: 0.70, width: 0.16, height: 0.25 },
  rearRightLeg: { x: 0.75, y: 0.70, width: 0.16, height: 0.25 },
} as const;

/**
 * Equipment table column widths (percentages)
 */
export const EQUIPMENT_COLUMNS = {
  qty: 0.06,
  name: 0.28,
  loc: 0.08,
  heat: 0.08,
  damage: 0.12,
  min: 0.08,
  short: 0.08,
  medium: 0.08,
  long: 0.08,
  extreme: 0.06,
} as const;

/**
 * Critical slots layout
 */
export const CRITICAL_SLOTS_LAYOUT = {
  // Upper row: 6 columns
  upperRow: {
    columns: ['HD', 'CT', 'LT', 'RT', 'LA', 'RA'],
    slotsPerColumn: 6,
    y: 0,
    height: 0.55,
  },
  // Lower row: 2 columns
  lowerRow: {
    columns: ['LL', 'RL'],
    slotsPerColumn: 6,
    y: 0.58,
    height: 0.40,
  },
  slotHeight: 12,  // points
  columnGap: 4,    // points
} as const;

/**
 * Heat scale layout
 */
export const HEAT_SCALE_LAYOUT = {
  maxHeat: 30,
  pipSize: 8,
  pipGap: 2,
  penaltyThresholds: [
    { heat: 5, penalty: '-1 MP' },
    { heat: 10, penalty: '-2 MP' },
    { heat: 15, penalty: '-3 MP, +1 To-Hit' },
    { heat: 20, penalty: '-4 MP, +2 To-Hit' },
    { heat: 25, penalty: '-5 MP, +3 To-Hit' },
    { heat: 30, penalty: 'Shutdown' },
  ],
} as const;

/**
 * Convert relative position to absolute
 */
export function relativeToAbsolute(
  relPos: { x: number; y: number; width: number; height: number },
  container: IRect
): IRect {
  return {
    x: container.x + relPos.x * container.width - (relPos.width * container.width) / 2,
    y: container.y + relPos.y * container.height,
    width: relPos.width * container.width,
    height: relPos.height * container.height,
  };
}

