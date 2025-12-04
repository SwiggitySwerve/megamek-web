/**
 * Equipment Table Renderer
 * 
 * Renders the weapons and equipment inventory table.
 * 
 * @spec openspec/specs/record-sheet-export/spec.md
 */

import { 
  IRecordSheetEquipment, 
  IRecordSheetHeatSinks,
  IRect,
} from '@/types/printing';
import { 
  COLORS, 
  FONT_SIZES, 
  FONTS,
  LINE_WIDTHS,
  EQUIPMENT_COLUMNS,
  HEAT_SCALE_LAYOUT,
} from './RecordSheetLayout';

/**
 * Equipment table column definition
 */
interface TableColumn {
  key: string;
  header: string;
  width: number;
  align: CanvasTextAlign;
}

/**
 * Equipment table renderer class
 */
export class EquipmentTableRenderer {
  private ctx: CanvasRenderingContext2D;
  private container: IRect;
  
  private readonly columns: TableColumn[] = [
    { key: 'quantity', header: 'Qty', width: EQUIPMENT_COLUMNS.qty, align: 'center' },
    { key: 'name', header: 'Type', width: EQUIPMENT_COLUMNS.name, align: 'left' },
    { key: 'locationAbbr', header: 'Loc', width: EQUIPMENT_COLUMNS.loc, align: 'center' },
    { key: 'heat', header: 'Ht', width: EQUIPMENT_COLUMNS.heat, align: 'center' },
    { key: 'damage', header: 'Dmg', width: EQUIPMENT_COLUMNS.damage, align: 'center' },
    { key: 'minimum', header: 'Min', width: EQUIPMENT_COLUMNS.min, align: 'center' },
    { key: 'short', header: 'Sht', width: EQUIPMENT_COLUMNS.short, align: 'center' },
    { key: 'medium', header: 'Med', width: EQUIPMENT_COLUMNS.medium, align: 'center' },
    { key: 'long', header: 'Lng', width: EQUIPMENT_COLUMNS.long, align: 'center' },
  ];

  constructor(ctx: CanvasRenderingContext2D, container: IRect) {
    this.ctx = ctx;
    this.container = container;
  }

  /**
   * Render the complete equipment section
   */
  render(equipment: readonly IRecordSheetEquipment[], heatSinks: IRecordSheetHeatSinks): void {
    const tableHeight = this.container.height * 0.65;
    const heatScaleHeight = this.container.height * 0.30;
    
    // Draw weapons table
    this.drawTable(equipment, {
      ...this.container,
      height: tableHeight,
    });
    
    // Draw heat scale
    this.drawHeatScale(heatSinks, {
      x: this.container.x,
      y: this.container.y + tableHeight + 10,
      width: this.container.width,
      height: heatScaleHeight,
    });
  }

  /**
   * Draw the equipment table
   */
  private drawTable(equipment: readonly IRecordSheetEquipment[], rect: IRect): void {
    const { ctx } = this;
    const rowHeight = 14;
    const headerHeight = 18;
    
    // Draw title
    ctx.save();
    ctx.font = `bold ${FONT_SIZES.sectionHeader}px ${FONTS.primary}`;
    ctx.fillStyle = COLORS.black;
    ctx.textAlign = 'center';
    ctx.fillText('WEAPONS & EQUIPMENT', rect.x + rect.width / 2, rect.y + 12);
    ctx.restore();
    
    const tableTop = rect.y + 20;
    
    // Draw header row
    this.drawTableHeader(rect.x, tableTop, rect.width, headerHeight);
    
    // Draw data rows
    let currentY = tableTop + headerHeight;
    const maxRows = Math.floor((rect.height - 30 - headerHeight) / rowHeight);
    
    const displayEquipment = equipment.slice(0, maxRows);
    
    displayEquipment.forEach((item, index) => {
      const isAlternate = index % 2 === 1;
      this.drawTableRow(item, rect.x, currentY, rect.width, rowHeight, isAlternate);
      currentY += rowHeight;
    });
    
    // Draw table border
    ctx.save();
    ctx.strokeStyle = COLORS.border;
    ctx.lineWidth = LINE_WIDTHS.normal;
    ctx.strokeRect(rect.x, tableTop, rect.width, currentY - tableTop);
    ctx.restore();
    
    // Show truncation notice if needed
    if (equipment.length > maxRows) {
      ctx.save();
      ctx.font = `italic ${FONT_SIZES.tiny}px ${FONTS.primary}`;
      ctx.fillStyle = COLORS.gray;
      ctx.textAlign = 'right';
      ctx.fillText(
        `+${equipment.length - maxRows} more items...`,
        rect.x + rect.width - 5,
        currentY + 10
      );
      ctx.restore();
    }
  }

  /**
   * Draw table header row
   */
  private drawTableHeader(x: number, y: number, width: number, height: number): void {
    const { ctx, columns } = this;
    
    // Draw header background
    ctx.save();
    ctx.fillStyle = COLORS.headerBg;
    ctx.fillRect(x, y, width, height);
    
    // Draw header text
    ctx.font = `bold ${FONT_SIZES.small}px ${FONTS.primary}`;
    ctx.fillStyle = COLORS.black;
    
    let currentX = x;
    columns.forEach((col) => {
      const colWidth = width * col.width;
      ctx.textAlign = col.align;
      const textX = col.align === 'left' 
        ? currentX + 3 
        : col.align === 'right' 
          ? currentX + colWidth - 3 
          : currentX + colWidth / 2;
      ctx.fillText(col.header, textX, y + height - 5);
      currentX += colWidth;
    });
    
    // Draw header border
    ctx.strokeStyle = COLORS.border;
    ctx.lineWidth = LINE_WIDTHS.thin;
    ctx.strokeRect(x, y, width, height);
    ctx.restore();
  }

  /**
   * Draw a single table row
   */
  private drawTableRow(
    item: IRecordSheetEquipment,
    x: number,
    y: number,
    width: number,
    height: number,
    isAlternate: boolean
  ): void {
    const { ctx, columns } = this;
    
    ctx.save();
    
    // Draw alternating background
    if (isAlternate) {
      ctx.fillStyle = '#F5F5F5';
      ctx.fillRect(x, y, width, height);
    }
    
    // Draw cell values
    ctx.font = `${FONT_SIZES.tiny}px ${FONTS.primary}`;
    ctx.fillStyle = COLORS.black;
    
    let currentX = x;
    columns.forEach((col) => {
      const colWidth = width * col.width;
      ctx.textAlign = col.align;
      
      let value = '';
      switch (col.key) {
        case 'quantity':
          value = item.quantity > 1 ? String(item.quantity) : '';
          break;
        case 'name':
          value = item.name;
          if (item.isAmmo && item.ammoCount !== undefined) {
            value += ` (${item.ammoCount})`;
          }
          break;
        case 'locationAbbr':
          value = item.locationAbbr;
          break;
        case 'heat':
          value = item.isWeapon ? String(item.heat) : '-';
          break;
        case 'damage':
          value = item.isWeapon ? String(item.damage) : '-';
          break;
        case 'minimum':
          value = item.isWeapon ? (item.minimum === 0 ? '-' : String(item.minimum)) : '-';
          break;
        case 'short':
          value = item.isWeapon ? String(item.short) : '-';
          break;
        case 'medium':
          value = item.isWeapon ? String(item.medium) : '-';
          break;
        case 'long':
          value = item.isWeapon ? String(item.long) : '-';
          break;
        default:
          value = '-';
      }
      
      const textX = col.align === 'left' 
        ? currentX + 3 
        : col.align === 'right' 
          ? currentX + colWidth - 3 
          : currentX + colWidth / 2;
      
      // Truncate long names
      if (col.key === 'name' && value.length > 20) {
        value = value.substring(0, 18) + '...';
      }
      
      ctx.fillText(value, textX, y + height - 3);
      currentX += colWidth;
    });
    
    // Draw row border
    ctx.strokeStyle = COLORS.lightGray;
    ctx.lineWidth = LINE_WIDTHS.thin;
    ctx.beginPath();
    ctx.moveTo(x, y + height);
    ctx.lineTo(x + width, y + height);
    ctx.stroke();
    
    ctx.restore();
  }

  /**
   * Draw heat scale section
   */
  private drawHeatScale(heatSinks: IRecordSheetHeatSinks, rect: IRect): void {
    const { ctx } = this;
    const { maxHeat, pipSize, pipGap, penaltyThresholds } = HEAT_SCALE_LAYOUT;
    
    ctx.save();
    
    // Draw title
    ctx.font = `bold ${FONT_SIZES.label}px ${FONTS.primary}`;
    ctx.fillStyle = COLORS.black;
    ctx.textAlign = 'left';
    ctx.fillText('HEAT SCALE', rect.x, rect.y + 10);
    
    // Draw heat sink info
    ctx.font = `${FONT_SIZES.small}px ${FONTS.primary}`;
    ctx.fillText(
      `Heat Sinks: ${heatSinks.count} (${heatSinks.capacity})`,
      rect.x,
      rect.y + 22
    );
    ctx.fillText(
      `Type: ${heatSinks.type}`,
      rect.x + 100,
      rect.y + 22
    );
    
    // Draw heat scale pips
    const scaleStartY = rect.y + 35;
    const pipsPerRow = 15;
    const rows = Math.ceil(maxHeat / pipsPerRow);
    
    for (let i = 0; i <= maxHeat; i++) {
      const row = Math.floor(i / pipsPerRow);
      const col = i % pipsPerRow;
      const x = rect.x + col * (pipSize + pipGap + 8);
      const y = scaleStartY + row * (pipSize + pipGap + 12);
      
      // Draw pip box
      ctx.strokeStyle = COLORS.pipStroke;
      ctx.lineWidth = LINE_WIDTHS.thin;
      ctx.fillStyle = COLORS.pipFill;
      ctx.fillRect(x, y, pipSize, pipSize);
      ctx.strokeRect(x, y, pipSize, pipSize);
      
      // Draw heat number
      ctx.font = `${FONT_SIZES.tiny}px ${FONTS.primary}`;
      ctx.fillStyle = COLORS.black;
      ctx.textAlign = 'center';
      ctx.fillText(String(i), x + pipSize / 2, y + pipSize + 8);
      
      // Check for penalty threshold
      const threshold = penaltyThresholds.find(t => t.heat === i);
      if (threshold) {
        ctx.fillStyle = COLORS.gray;
        ctx.font = `${FONT_SIZES.tiny - 1}px ${FONTS.primary}`;
        ctx.textAlign = 'left';
        ctx.fillText(threshold.penalty, x + pipSize + 3, y + pipSize / 2 + 2);
      }
    }
    
    ctx.restore();
  }
}

