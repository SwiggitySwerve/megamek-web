/**
 * Mech Record Sheet Renderer
 * 
 * Combines all rendering components to produce a complete BattleMech record sheet.
 * 
 * @spec openspec/specs/record-sheet-export/spec.md
 */

import { 
  IRecordSheetData,
  ILocationCriticals,
  PaperSize,
  IRect,
} from '@/types/printing';
import { 
  getSectionRects, 
  COLORS, 
  FONT_SIZES, 
  FONTS,
  LINE_WIDTHS,
  CRITICAL_SLOTS_LAYOUT,
} from './RecordSheetLayout';
import { ArmorDiagramRenderer } from './ArmorDiagramRenderer';
import { EquipmentTableRenderer } from './EquipmentTableRenderer';

/**
 * Mech record sheet renderer class
 */
export class MechRecordSheetRenderer {
  private ctx: CanvasRenderingContext2D;
  private paperSize: PaperSize;
  private sections: Record<string, IRect>;

  constructor(ctx: CanvasRenderingContext2D, paperSize: PaperSize = PaperSize.LETTER) {
    this.ctx = ctx;
    this.paperSize = paperSize;
    this.sections = getSectionRects(paperSize);
  }

  /**
   * Render the complete record sheet
   */
  render(data: IRecordSheetData): void {
    // Clear canvas with white background
    this.clearCanvas();
    
    // Draw sheet border
    this.drawBorder();
    
    // Render each section
    this.renderHeader(data);
    this.renderMovement(data);
    this.renderArmorDiagram(data);
    this.renderEquipmentTable(data);
    this.renderCriticalSlots(data);
    this.renderPilotData(data);
  }

  /**
   * Clear canvas with white background
   */
  private clearCanvas(): void {
    const { ctx } = this;
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  /**
   * Draw sheet border
   */
  private drawBorder(): void {
    const { ctx, sections } = this;
    const header = sections.header;
    const pilot = sections.pilot;
    
    ctx.save();
    ctx.strokeStyle = COLORS.border;
    ctx.lineWidth = LINE_WIDTHS.border;
    ctx.strokeRect(
      header.x - 2,
      header.y - 2,
      header.width + 4,
      (pilot.y + pilot.height) - header.y + 4
    );
    ctx.restore();
  }

  /**
   * Render header section
   */
  private renderHeader(data: IRecordSheetData): void {
    const { ctx, sections } = this;
    const rect = sections.header;
    const { header } = data;
    
    ctx.save();
    
    // Draw title bar
    ctx.fillStyle = COLORS.headerBg;
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    ctx.strokeStyle = COLORS.border;
    ctx.lineWidth = LINE_WIDTHS.normal;
    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    
    // Draw title
    ctx.font = `bold ${FONT_SIZES.title}px ${FONTS.primary}`;
    ctx.fillStyle = COLORS.black;
    ctx.textAlign = 'left';
    ctx.fillText('BATTLEMECH RECORD SHEET', rect.x + 10, rect.y + rect.height / 2 + 5);
    
    // Draw unit info
    const infoX = rect.x + rect.width * 0.45;
    ctx.font = `bold ${FONT_SIZES.value}px ${FONTS.primary}`;
    ctx.fillText(header.unitName, infoX, rect.y + rect.height / 2 + 5);
    
    // Draw stats on right side
    ctx.font = `${FONT_SIZES.small}px ${FONTS.primary}`;
    ctx.textAlign = 'right';
    const statsX = rect.x + rect.width - 10;
    ctx.fillText(`${header.tonnage} Tons | ${header.techBase}`, statsX, rect.y + 12);
    ctx.fillText(`BV: ${header.battleValue}`, statsX, rect.y + 24);
    
    ctx.restore();
  }

  /**
   * Render movement section
   */
  private renderMovement(data: IRecordSheetData): void {
    const { ctx, sections } = this;
    const rect = sections.movement;
    const { movement } = data;
    
    ctx.save();
    
    // Draw border
    ctx.strokeStyle = COLORS.border;
    ctx.lineWidth = LINE_WIDTHS.thin;
    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    
    // Draw movement values
    const padding = 10;
    const colWidth = rect.width / 5;
    
    ctx.font = `bold ${FONT_SIZES.label}px ${FONTS.primary}`;
    ctx.fillStyle = COLORS.black;
    ctx.textAlign = 'center';
    
    // Walk
    ctx.fillText('Walk', rect.x + colWidth * 0.5, rect.y + 12);
    ctx.font = `${FONT_SIZES.value}px ${FONTS.primary}`;
    ctx.fillText(String(movement.walkMP), rect.x + colWidth * 0.5, rect.y + 24);
    
    // Run
    ctx.font = `bold ${FONT_SIZES.label}px ${FONTS.primary}`;
    ctx.fillText('Run', rect.x + colWidth * 1.5, rect.y + 12);
    ctx.font = `${FONT_SIZES.value}px ${FONTS.primary}`;
    ctx.fillText(String(movement.runMP), rect.x + colWidth * 1.5, rect.y + 24);
    
    // Jump
    ctx.font = `bold ${FONT_SIZES.label}px ${FONTS.primary}`;
    ctx.fillText('Jump', rect.x + colWidth * 2.5, rect.y + 12);
    ctx.font = `${FONT_SIZES.value}px ${FONTS.primary}`;
    ctx.fillText(String(movement.jumpMP), rect.x + colWidth * 2.5, rect.y + 24);
    
    // Enhancements
    const enhancements: string[] = [];
    if (movement.hasMASC) enhancements.push('MASC');
    if (movement.hasTSM) enhancements.push('TSM');
    if (movement.hasSupercharger) enhancements.push('S/C');
    
    if (enhancements.length > 0) {
      ctx.font = `${FONT_SIZES.small}px ${FONTS.primary}`;
      ctx.textAlign = 'left';
      ctx.fillText(`Enhancements: ${enhancements.join(', ')}`, rect.x + colWidth * 3.5, rect.y + 18);
    }
    
    ctx.restore();
  }

  /**
   * Render armor diagram section
   */
  private renderArmorDiagram(data: IRecordSheetData): void {
    const { ctx, sections } = this;
    const rect = sections.armorDiagram;
    
    // Draw section border
    ctx.save();
    ctx.strokeStyle = COLORS.border;
    ctx.lineWidth = LINE_WIDTHS.thin;
    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    ctx.restore();
    
    // Use armor diagram renderer
    const renderer = new ArmorDiagramRenderer(ctx, rect, data.mechType);
    renderer.render(data.armor, data.structure);
  }

  /**
   * Render equipment table section
   */
  private renderEquipmentTable(data: IRecordSheetData): void {
    const { ctx, sections } = this;
    const rect = sections.equipmentTable;
    
    // Draw section border
    ctx.save();
    ctx.strokeStyle = COLORS.border;
    ctx.lineWidth = LINE_WIDTHS.thin;
    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    ctx.restore();
    
    // Use equipment table renderer
    const renderer = new EquipmentTableRenderer(ctx, rect);
    renderer.render(data.equipment, data.heatSinks);
  }

  /**
   * Render critical slots section
   */
  private renderCriticalSlots(data: IRecordSheetData): void {
    const { ctx, sections } = this;
    const rect = sections.criticals;
    
    ctx.save();
    
    // Draw section border
    ctx.strokeStyle = COLORS.border;
    ctx.lineWidth = LINE_WIDTHS.thin;
    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    
    // Draw title
    ctx.font = `bold ${FONT_SIZES.sectionHeader}px ${FONTS.primary}`;
    ctx.fillStyle = COLORS.black;
    ctx.textAlign = 'center';
    ctx.fillText('CRITICAL HIT TABLE', rect.x + rect.width / 2, rect.y + 12);
    
    const tableTop = rect.y + 20;
    const tableHeight = rect.height - 25;
    
    // Draw upper row (6 columns: HD, CT, LT, RT, LA, RA)
    const upperColumns = CRITICAL_SLOTS_LAYOUT.upperRow.columns;
    const upperHeight = tableHeight * CRITICAL_SLOTS_LAYOUT.upperRow.height;
    const colWidth = rect.width / upperColumns.length;
    
    upperColumns.forEach((abbr, colIndex) => {
      const colX = rect.x + colIndex * colWidth;
      const location = data.criticals.find(c => c.abbreviation === abbr);
      this.drawCriticalColumn(location, colX, tableTop, colWidth, upperHeight);
    });
    
    // Draw lower row (2 columns: LL, RL)
    const lowerColumns = CRITICAL_SLOTS_LAYOUT.lowerRow.columns;
    const lowerTop = tableTop + upperHeight + 5;
    const lowerHeight = tableHeight * CRITICAL_SLOTS_LAYOUT.lowerRow.height;
    const lowerColWidth = rect.width / 2;
    const lowerStartX = rect.x + rect.width / 4; // Center the two columns
    
    lowerColumns.forEach((abbr, colIndex) => {
      const colX = rect.x + colIndex * lowerColWidth + lowerColWidth / 4;
      const location = data.criticals.find(c => c.abbreviation === abbr);
      this.drawCriticalColumn(location, colX, lowerTop, lowerColWidth / 2, lowerHeight);
    });
    
    ctx.restore();
  }

  /**
   * Draw a single critical slot column
   */
  private drawCriticalColumn(
    location: ILocationCriticals | undefined,
    x: number,
    y: number,
    width: number,
    height: number
  ): void {
    const { ctx } = this;
    const slotHeight = CRITICAL_SLOTS_LAYOUT.slotHeight;
    const padding = 3;
    
    ctx.save();
    
    // Draw column header
    ctx.fillStyle = COLORS.headerBg;
    ctx.fillRect(x, y, width, 14);
    ctx.font = `bold ${FONT_SIZES.small}px ${FONTS.primary}`;
    ctx.fillStyle = COLORS.black;
    ctx.textAlign = 'center';
    ctx.fillText(location?.abbreviation || '??', x + width / 2, y + 10);
    
    // Draw column border
    ctx.strokeStyle = COLORS.border;
    ctx.lineWidth = LINE_WIDTHS.thin;
    ctx.strokeRect(x, y, width, height);
    
    // Draw slots
    const slotsTop = y + 16;
    const slots = location?.slots || [];
    
    for (let i = 0; i < 6; i++) {
      const slotY = slotsTop + i * slotHeight;
      const slot = slots[i];
      
      // Draw slot number
      ctx.font = `${FONT_SIZES.tiny}px ${FONTS.primary}`;
      ctx.fillStyle = COLORS.gray;
      ctx.textAlign = 'left';
      ctx.fillText(`${i + 1}.`, x + padding, slotY + slotHeight - 3);
      
      // Draw slot content
      const content = slot?.isRollAgain 
        ? 'Roll Again' 
        : slot?.content || '—';
      
      ctx.font = slot?.isSystem 
        ? `bold ${FONT_SIZES.tiny}px ${FONTS.primary}`
        : `${FONT_SIZES.tiny}px ${FONTS.primary}`;
      ctx.fillStyle = slot?.isRollAgain ? COLORS.gray : COLORS.black;
      ctx.textAlign = 'left';
      
      // Truncate long names
      const displayContent = content.length > 12 
        ? content.substring(0, 10) + '...' 
        : content;
      ctx.fillText(displayContent, x + padding + 12, slotY + slotHeight - 3);
      
      // Draw slot divider
      ctx.strokeStyle = COLORS.lightGray;
      ctx.beginPath();
      ctx.moveTo(x + padding, slotY + slotHeight);
      ctx.lineTo(x + width - padding, slotY + slotHeight);
      ctx.stroke();
    }
    
    ctx.restore();
  }

  /**
   * Render pilot data section
   */
  private renderPilotData(data: IRecordSheetData): void {
    const { ctx, sections } = this;
    const rect = sections.pilot;
    
    ctx.save();
    
    // Draw section border
    ctx.strokeStyle = COLORS.border;
    ctx.lineWidth = LINE_WIDTHS.thin;
    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    
    // Draw pilot label
    ctx.font = `bold ${FONT_SIZES.label}px ${FONTS.primary}`;
    ctx.fillStyle = COLORS.black;
    ctx.textAlign = 'left';
    ctx.fillText('PILOT:', rect.x + 10, rect.y + rect.height / 2 + 4);
    
    // Draw pilot name (blank line or actual name)
    const pilot = data.pilot;
    const nameX = rect.x + 55;
    const nameWidth = 150;
    
    if (pilot) {
      ctx.font = `${FONT_SIZES.value}px ${FONTS.primary}`;
      ctx.fillText(pilot.name, nameX, rect.y + rect.height / 2 + 4);
    } else {
      // Draw blank line
      ctx.strokeStyle = COLORS.black;
      ctx.lineWidth = LINE_WIDTHS.thin;
      ctx.beginPath();
      ctx.moveTo(nameX, rect.y + rect.height / 2 + 6);
      ctx.lineTo(nameX + nameWidth, rect.y + rect.height / 2 + 6);
      ctx.stroke();
    }
    
    // Draw gunnery/piloting
    const skillsX = rect.x + rect.width * 0.5;
    ctx.font = `bold ${FONT_SIZES.label}px ${FONTS.primary}`;
    ctx.fillText('Gunnery:', skillsX, rect.y + rect.height / 2 + 4);
    
    ctx.font = `${FONT_SIZES.value}px ${FONTS.primary}`;
    const gunnery = pilot ? String(pilot.gunnery) : '___';
    ctx.fillText(gunnery, skillsX + 55, rect.y + rect.height / 2 + 4);
    
    ctx.font = `bold ${FONT_SIZES.label}px ${FONTS.primary}`;
    ctx.fillText('Piloting:', skillsX + 90, rect.y + rect.height / 2 + 4);
    
    ctx.font = `${FONT_SIZES.value}px ${FONTS.primary}`;
    const piloting = pilot ? String(pilot.piloting) : '___';
    ctx.fillText(piloting, skillsX + 140, rect.y + rect.height / 2 + 4);
    
    ctx.restore();
  }
}

