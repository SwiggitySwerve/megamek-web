/**
 * Armor Diagram Renderer
 * 
 * Renders the mech armor diagram with location values and visual representation.
 * 
 * @spec openspec/specs/record-sheet-export/spec.md
 */

import { 
  IRecordSheetArmor, 
  IRecordSheetStructure,
  IRenderContext, 
  IRect,
  ILocationArmor,
} from '@/types/printing';
import { 
  BIPED_ARMOR_LAYOUT, 
  QUAD_ARMOR_LAYOUT,
  COLORS, 
  FONT_SIZES, 
  FONTS,
  LINE_WIDTHS,
  relativeToAbsolute,
} from './RecordSheetLayout';

/**
 * Armor diagram renderer class
 */
export class ArmorDiagramRenderer {
  private ctx: CanvasRenderingContext2D;
  private container: IRect;
  private mechType: 'biped' | 'quad' | 'tripod' | 'lam' | 'quadvee';

  constructor(
    ctx: CanvasRenderingContext2D,
    container: IRect,
    mechType: 'biped' | 'quad' | 'tripod' | 'lam' | 'quadvee' = 'biped'
  ) {
    this.ctx = ctx;
    this.container = container;
    this.mechType = mechType;
  }

  /**
   * Render the complete armor diagram
   */
  render(armor: IRecordSheetArmor, structure: IRecordSheetStructure): void {
    // Draw section title
    this.drawTitle();
    
    // Draw mech silhouette
    this.drawMechOutline();
    
    // Draw armor values for each location
    this.drawArmorValues(armor);
    
    // Draw structure values
    this.drawStructureValues(structure);
    
    // Draw armor type label
    this.drawArmorType(armor.type);
  }

  /**
   * Draw section title
   */
  private drawTitle(): void {
    const { ctx, container } = this;
    
    ctx.save();
    ctx.font = `bold ${FONT_SIZES.sectionHeader}px ${FONTS.primary}`;
    ctx.fillStyle = COLORS.black;
    ctx.textAlign = 'center';
    ctx.fillText('ARMOR DIAGRAM', container.x + container.width / 2, container.y + 12);
    ctx.restore();
  }

  /**
   * Draw mech silhouette outline
   */
  private drawMechOutline(): void {
    const { ctx, container, mechType } = this;
    const layout = mechType === 'quad' ? QUAD_ARMOR_LAYOUT : BIPED_ARMOR_LAYOUT;
    
    ctx.save();
    ctx.strokeStyle = COLORS.border;
    ctx.lineWidth = LINE_WIDTHS.normal;
    ctx.fillStyle = COLORS.white;
    
    // Draw each location box
    Object.entries(layout).forEach(([location, relPos]) => {
      const rect = relativeToAbsolute(relPos, {
        ...container,
        y: container.y + 20, // Offset for title
        height: container.height - 40,
      });
      
      // Draw rounded rectangle for location
      this.drawRoundedRect(rect, 4);
      
      // Draw location label
      ctx.font = `bold ${FONT_SIZES.small}px ${FONTS.primary}`;
      ctx.fillStyle = COLORS.black;
      ctx.textAlign = 'center';
      ctx.fillText(
        this.getLocationLabel(location),
        rect.x + rect.width / 2,
        rect.y + 10
      );
    });
    
    ctx.restore();
  }

  /**
   * Draw armor values for each location
   */
  private drawArmorValues(armor: IRecordSheetArmor): void {
    const { ctx, container, mechType } = this;
    const layout = mechType === 'quad' ? QUAD_ARMOR_LAYOUT : BIPED_ARMOR_LAYOUT;
    
    armor.locations.forEach((loc) => {
      const layoutKey = this.getLayoutKey(loc.abbreviation);
      const relPos = layout[layoutKey as keyof typeof layout];
      if (!relPos) return;
      
      const rect = relativeToAbsolute(relPos, {
        ...container,
        y: container.y + 20,
        height: container.height - 40,
      });
      
      // Draw armor value
      ctx.save();
      ctx.font = `bold ${FONT_SIZES.value}px ${FONTS.primary}`;
      ctx.fillStyle = COLORS.black;
      ctx.textAlign = 'center';
      
      const armorText = `${loc.current}/${loc.maximum}`;
      ctx.fillText(armorText, rect.x + rect.width / 2, rect.y + rect.height / 2);
      
      // Draw rear armor if applicable
      if (loc.rear !== undefined && loc.rearMaximum !== undefined) {
        ctx.font = `${FONT_SIZES.small}px ${FONTS.primary}`;
        const rearText = `(R: ${loc.rear}/${loc.rearMaximum})`;
        ctx.fillText(rearText, rect.x + rect.width / 2, rect.y + rect.height / 2 + 12);
      }
      
      // Draw armor pips
      this.drawArmorPips(rect, loc);
      
      ctx.restore();
    });
  }

  /**
   * Draw structure values
   */
  private drawStructureValues(structure: IRecordSheetStructure): void {
    const { ctx, container } = this;
    
    // Draw structure type and total at bottom
    ctx.save();
    ctx.font = `${FONT_SIZES.small}px ${FONTS.primary}`;
    ctx.fillStyle = COLORS.gray;
    ctx.textAlign = 'center';
    
    const structureY = container.y + container.height - 20;
    ctx.fillText(
      `Structure: ${structure.type} (${structure.totalPoints} pts)`,
      container.x + container.width / 2,
      structureY
    );
    ctx.restore();
  }

  /**
   * Draw armor pips for a location
   */
  private drawArmorPips(rect: IRect, loc: ILocationArmor): void {
    const { ctx } = this;
    const pipSize = 3;
    const pipGap = 2;
    const pipsPerRow = Math.floor((rect.width - 10) / (pipSize + pipGap));
    const startY = rect.y + rect.height - 25;
    const startX = rect.x + 5;
    
    ctx.save();
    ctx.strokeStyle = COLORS.pipStroke;
    ctx.lineWidth = 0.5;
    
    for (let i = 0; i < loc.maximum; i++) {
      const row = Math.floor(i / pipsPerRow);
      const col = i % pipsPerRow;
      const x = startX + col * (pipSize + pipGap);
      const y = startY - row * (pipSize + pipGap);
      
      // Fill if armor is remaining
      ctx.fillStyle = i < loc.current ? COLORS.pipFill : COLORS.pipDamaged;
      
      ctx.beginPath();
      ctx.arc(x + pipSize / 2, y - pipSize / 2, pipSize / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    
    ctx.restore();
  }

  /**
   * Draw armor type label
   */
  private drawArmorType(armorType: string): void {
    const { ctx, container } = this;
    
    ctx.save();
    ctx.font = `${FONT_SIZES.small}px ${FONTS.primary}`;
    ctx.fillStyle = COLORS.gray;
    ctx.textAlign = 'center';
    ctx.fillText(
      `Armor Type: ${armorType}`,
      container.x + container.width / 2,
      container.y + container.height - 8
    );
    ctx.restore();
  }

  /**
   * Draw a rounded rectangle
   */
  private drawRoundedRect(rect: IRect, radius: number): void {
    const { ctx } = this;
    const { x, y, width, height } = rect;
    
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  /**
   * Get location label from layout key
   */
  private getLocationLabel(key: string): string {
    const labels: Record<string, string> = {
      head: 'HD',
      leftArm: 'LA',
      rightArm: 'RA',
      leftTorso: 'LT',
      centerTorso: 'CT',
      rightTorso: 'RT',
      leftLeg: 'LL',
      rightLeg: 'RL',
      frontLeftLeg: 'FLL',
      frontRightLeg: 'FRL',
      rearLeftLeg: 'RLL',
      rearRightLeg: 'RRL',
    };
    return labels[key] || key.toUpperCase();
  }

  /**
   * Get layout key from abbreviation
   */
  private getLayoutKey(abbr: string): string {
    const mapping: Record<string, string> = {
      'HD': 'head',
      'LA': 'leftArm',
      'RA': 'rightArm',
      'LT': 'leftTorso',
      'CT': 'centerTorso',
      'RT': 'rightTorso',
      'LL': 'leftLeg',
      'RL': 'rightLeg',
      'FLL': 'frontLeftLeg',
      'FRL': 'frontRightLeg',
      'RLL': 'rearLeftLeg',
      'RRL': 'rearRightLeg',
    };
    return mapping[abbr] || abbr.toLowerCase();
  }
}

