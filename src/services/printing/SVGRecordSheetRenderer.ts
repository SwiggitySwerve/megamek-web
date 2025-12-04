/**
 * SVG Record Sheet Renderer
 * 
 * Renders record sheets using MegaMek SVG templates.
 * Fills in template placeholders with unit data and loads armor/structure pips.
 * 
 * @spec openspec/specs/record-sheet-export/spec.md
 */

import { 
  IRecordSheetData,
  ILocationArmor,
  ILocationStructure,
  IRecordSheetEquipment,
  ILocationCriticals,
  IRecordSheetCriticalSlot,
  PaperSize,
} from '@/types/printing';

// =============================================================================
// Constants (matching MegaMek template element IDs)
// =============================================================================

const SVG_NS = 'http://www.w3.org/2000/svg';

// Base path for pip SVG files
const PIPS_BASE_PATH = '/record-sheets/biped_pips';

// MegaMek template element IDs
const ELEMENT_IDS = {
  // 'MECH DATA section
  TYPE: 'type',
  TONNAGE: 'tonnage',
  TECH_BASE: 'techBase',
  RULES_LEVEL: 'rulesLevel',
  ROLE: 'role',
  ENGINE_TYPE: 'engineType',
  
  // Movement section
  WALK_MP: 'mpWalk',
  RUN_MP: 'mpRun', 
  JUMP_MP: 'mpJump',
  
  // Equipment/Inventory area
  INVENTORY: 'inventory',
  
  // Battle value
  BV: 'bv',
  
  // Armor
  ARMOR_TYPE: 'armorType',
  STRUCTURE_TYPE: 'structureType',
  CANON_ARMOR_PIPS: 'canonArmorPips',
  ARMOR_PIPS: 'armorPips',
  
  // Warrior data
  PILOT_NAME: 'pilotName0',
  GUNNERY_SKILL: 'gunnerySkill0',
  PILOTING_SKILL: 'pilotingSkill0',
  
  // Heat
  HEAT_SINK_TYPE: 'hsType',
  HEAT_SINK_COUNT: 'hsCount',
} as const;

// Map from our location abbreviations to MegaMek pip file location names
const LOCATION_TO_PIP_NAME: Record<string, string> = {
  'HD': 'Head',
  'CT': 'CT',
  'LT': 'LT',
  'RT': 'RT',
  'LA': 'LArm',
  'RA': 'RArm',
  'LL': 'LLeg',
  'RL': 'RLeg',
};

// Rear armor locations
const REAR_LOCATIONS = ['CT', 'LT', 'RT'];

// =============================================================================
// SVG Record Sheet Renderer
// =============================================================================

export class SVGRecordSheetRenderer {
  private svgDoc: Document | null = null;
  private svgRoot: SVGSVGElement | null = null;

  /**
   * Load the SVG template
   */
  async loadTemplate(templatePath: string): Promise<void> {
    const response = await fetch(templatePath);
    const svgText = await response.text();
    
    const parser = new DOMParser();
    this.svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
    this.svgRoot = this.svgDoc.documentElement as unknown as SVGSVGElement;
    
    // Check for parse errors
    const parseError = this.svgDoc.querySelector('parsererror');
    if (parseError) {
      throw new Error(`Failed to parse SVG template: ${parseError.textContent}`);
    }
  }

  /**
   * Fill the template with unit data (sync parts only)
   */
  fillTemplate(data: IRecordSheetData): void {
    if (!this.svgDoc || !this.svgRoot) {
      throw new Error('Template not loaded. Call loadTemplate first.');
    }

    // === 'MECH DATA Section ===
    this.setTextContent(ELEMENT_IDS.TYPE, `${data.header.chassis} ${data.header.model}`);
    this.setTextContent(ELEMENT_IDS.TONNAGE, String(data.header.tonnage));
    this.setTextContent(ELEMENT_IDS.TECH_BASE, data.header.techBase);
    this.setTextContent(ELEMENT_IDS.RULES_LEVEL, data.header.rulesLevel);
    this.setTextContent(ELEMENT_IDS.ROLE, 'Juggernaut');
    
    const engineRating = data.header.tonnage * data.movement.walkMP;
    this.setTextContent(ELEMENT_IDS.ENGINE_TYPE, `${engineRating} XL`);

    // === Movement ===
    this.setTextContent(ELEMENT_IDS.WALK_MP, String(data.movement.walkMP));
    this.setTextContent(ELEMENT_IDS.RUN_MP, String(data.movement.runMP));
    this.setTextContent(ELEMENT_IDS.JUMP_MP, String(data.movement.jumpMP));

    // === Battle Value ===
    this.setTextContent(ELEMENT_IDS.BV, data.header.battleValue.toLocaleString());

    // === Armor & Structure Types ===
    this.setTextContent(ELEMENT_IDS.ARMOR_TYPE, data.armor.type);
    this.setTextContent(ELEMENT_IDS.STRUCTURE_TYPE, data.structure.type);

    // === Heat Sinks ===
    this.setTextContent(ELEMENT_IDS.HEAT_SINK_TYPE, data.heatSinks.type);
    this.setTextContent(ELEMENT_IDS.HEAT_SINK_COUNT, `${data.heatSinks.count}`);

    // === Warrior Data (blank for tabletop) ===
    this.setTextContent(ELEMENT_IDS.PILOT_NAME, '');
    this.setTextContent(ELEMENT_IDS.GUNNERY_SKILL, '');
    this.setTextContent(ELEMENT_IDS.PILOTING_SKILL, '');

    // === Render dynamic content ===
    this.renderEquipmentTable(data.equipment);
    this.renderCriticalSlots(data.criticals);
  }

  /**
   * Fill template with armor pips (async - fetches pip SVGs)
   */
  async fillArmorPips(armor: IRecordSheetData['armor']): Promise<void> {
    if (!this.svgDoc || !this.svgRoot) {
      throw new Error('Template not loaded');
    }

    // Find the armorPips group in the template
    // The pips will be inserted into this group which has the correct transform
    // MegaMekLab uses canonArmorPips with a specific transform to position pips
    let armorPipsGroup = this.svgDoc.getElementById(ELEMENT_IDS.CANON_ARMOR_PIPS);
    if (!armorPipsGroup) {
      // Fallback to armorPips
      armorPipsGroup = this.svgDoc.getElementById(ELEMENT_IDS.ARMOR_PIPS);
    }
    if (!armorPipsGroup) {
      console.warn('Could not find canonArmorPips or armorPips group in template');
      // Fallback: create at root level with MegaMek's transform
      const rootGroup = this.svgDoc.createElementNS(SVG_NS, 'g');
      rootGroup.setAttribute('id', 'armor-pips-generated');
      // Apply the transform from MegaMek's canonArmorPips: matrix(0.975,0,0,0.975,-390.621,-44.241)
      rootGroup.setAttribute('transform', 'matrix(0.975,0,0,0.975,-390.621,-44.241)');
      this.svgRoot.appendChild(rootGroup);
      await this.loadAllArmorPips(rootGroup, armor);
      return;
    }

    await this.loadAllArmorPips(armorPipsGroup, armor);
  }

  /**
   * Load all armor pips into a parent group
   */
  private async loadAllArmorPips(parentGroup: Element, armor: IRecordSheetData['armor']): Promise<void> {
    // Load pips for each armor location
    const pipPromises = armor.locations.map(async (loc) => {
      const pipName = LOCATION_TO_PIP_NAME[loc.abbreviation];
      if (!pipName) {
        console.warn(`Unknown location abbreviation: ${loc.abbreviation}`);
        return;
      }

      // Load front armor pips
      if (loc.current > 0) {
        await this.loadAndInsertPips(
          parentGroup,
          pipName,
          loc.current,
          false
        );
      }

      // Load rear armor pips if applicable
      if (loc.rear !== undefined && loc.rear > 0 && REAR_LOCATIONS.includes(loc.abbreviation)) {
        await this.loadAndInsertPips(
          parentGroup,
          pipName,
          loc.rear,
          true
        );
      }
    });

    await Promise.all(pipPromises);
  }

  /**
   * Load a pip SVG file and insert its paths into the template
   */
  private async loadAndInsertPips(
    parentGroup: Element,
    locationName: string,
    pipCount: number,
    isRear: boolean
  ): Promise<void> {
    // Build the pip file path
    // Format: Armor_<Location>_<Count>_Humanoid.svg or Armor_<Location>_R_<Count>_Humanoid.svg
    const rearSuffix = isRear ? '_R' : '';
    const pipFileName = `Armor_${locationName}${rearSuffix}_${pipCount}_Humanoid.svg`;
    const pipPath = `${PIPS_BASE_PATH}/${pipFileName}`;

    try {
      const response = await fetch(pipPath);
      if (!response.ok) {
        console.warn(`Pip file not found: ${pipPath}`);
        return;
      }

      const pipSvgText = await response.text();
      const parser = new DOMParser();
      const pipDoc = parser.parseFromString(pipSvgText, 'image/svg+xml');

      // Extract the path elements from the pip SVG
      // Pip files have paths inside <switch><g>...</g></switch>
      const paths = pipDoc.querySelectorAll('path');
      
      if (!this.svgDoc || paths.length === 0) return;

      // Create a group for this location's pips
      // MegaMekLab imports pip paths directly - the parent's transform handles positioning
      // NO additional transform needed on location groups
      const locationGroup = this.svgDoc.createElementNS(SVG_NS, 'g');
      locationGroup.setAttribute('id', `pips_${locationName}${rearSuffix}`);
      locationGroup.setAttribute('class', 'armor-pips');

      // Clone each path into our template
      paths.forEach(path => {
        const clonedPath = this.svgDoc!.importNode(path, true) as SVGPathElement;
        // Ensure the path styling is preserved
        if (!clonedPath.getAttribute('fill')) {
          clonedPath.setAttribute('fill', '#FFFFFF');
        }
        if (!clonedPath.getAttribute('stroke')) {
          clonedPath.setAttribute('stroke', '#000000');
        }
        locationGroup.appendChild(clonedPath);
      });

      parentGroup.appendChild(locationGroup);
    } catch (error) {
      console.warn(`Failed to load pip SVG: ${pipPath}`, error);
    }
  }

  /**
   * Get the SVG as a string
   */
  getSVGString(): string {
    if (!this.svgDoc) {
      throw new Error('Template not loaded');
    }
    const serializer = new XMLSerializer();
    return serializer.serializeToString(this.svgDoc);
  }

  /**
   * Render to canvas with high-DPI support for sharp text
   */
  async renderToCanvas(canvas: HTMLCanvasElement): Promise<void> {
    const svgString = this.getSVGString();
    const img = new Image();
    
    return new Promise((resolve, reject) => {
      img.onload = () => {
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        // Use 2x resolution for sharp rendering (retina/high-DPI)
        const dpr = window.devicePixelRatio || 2;
        const baseWidth = 612;
        const baseHeight = 792;
        
        // Set canvas internal resolution to 2x for sharpness
        canvas.width = baseWidth * dpr;
        canvas.height = baseHeight * dpr;
        
        // Scale context to match high-DPI
        ctx.scale(dpr, dpr);
        
        // Enable image smoothing for better quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, baseWidth, baseHeight);
        
        // Calculate scale to fit SVG (576x756) into canvas (612x792)
        const scale = Math.min(baseWidth / 576, baseHeight / 756);
        const offsetX = (baseWidth - 576 * scale) / 2;
        const offsetY = (baseHeight - 756 * scale) / 2;
        
        ctx.drawImage(img, offsetX, offsetY, 576 * scale, 756 * scale);
        
        resolve();
      };
      
      img.onerror = () => reject(new Error('Failed to load SVG image'));
      
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      img.src = URL.createObjectURL(svgBlob);
    });
  }

  // ===========================================================================
  // Private helpers
  // ===========================================================================

  private setTextContent(id: string, text: string): void {
    const element = this.svgDoc?.getElementById(id);
    if (element) {
      element.textContent = text;
    }
  }

  private renderEquipmentTable(equipment: readonly IRecordSheetEquipment[]): void {
    const inventoryArea = this.svgDoc?.getElementById(ELEMENT_IDS.INVENTORY);
    if (!inventoryArea || !this.svgDoc) return;

    const x = parseFloat(inventoryArea.getAttribute('x') || '3');
    const y = parseFloat(inventoryArea.getAttribute('y') || '87.5');
    const width = parseFloat(inventoryArea.getAttribute('width') || '216');
    const height = parseFloat(inventoryArea.getAttribute('height') || '185');

    const group = this.svgDoc.createElementNS(SVG_NS, 'g');
    group.setAttribute('id', 'equipment-rows');
    group.setAttribute('style', 'font-family: Eurostile, Arial, sans-serif; font-size: 7px;');

    const rowHeight = 9;
    const headerY = y + 10;
    const startY = y + 22;
    const maxRows = Math.floor((height - 30) / rowHeight);

    // Column positions - adjusted for damage codes like "1/Msl [M,C,S]"
    const cols = {
      qty: x + 2,
      name: x + 12,
      loc: x + 80,      // Shortened name column
      heat: x + 95,
      dmg: x + 108,     // More space for damage + code
      min: x + 158,     // Pushed range columns right
      sht: x + 172,
      med: x + 186,
      lng: x + 200,
    };

    const headers = [
      { text: 'Qty', x: cols.qty },
      { text: 'Type', x: cols.name },
      { text: 'Loc', x: cols.loc },
      { text: 'Ht', x: cols.heat },
      { text: 'Dmg', x: cols.dmg },
      { text: 'Min', x: cols.min },
      { text: 'Sht', x: cols.sht },
      { text: 'Med', x: cols.med },
      { text: 'Lng', x: cols.lng },
    ];

    headers.forEach(h => {
      const text = this.createEquipmentText(h.x, headerY, h.text, true);
      group.appendChild(text);
    });

    const displayEquipment = equipment.slice(0, maxRows);
    displayEquipment.forEach((eq, index) => {
      const rowY = startY + index * rowHeight;

      const qty = this.createEquipmentText(cols.qty, rowY, String(eq.quantity || 1), false);
      group.appendChild(qty);

      // Truncate long names to fit in narrower column
      const name = eq.name.length > 16 ? eq.name.substring(0, 14) + '..' : eq.name;
      const nameEl = this.createEquipmentText(cols.name, rowY, name, false);
      group.appendChild(nameEl);

      const loc = this.createEquipmentText(cols.loc, rowY, eq.locationAbbr, false);
      group.appendChild(loc);

      if (eq.isWeapon || eq.isEquipment) {
        // Heat column
        const heatStr = eq.heat === 0 || eq.heat === '-' ? '-' : String(eq.heat);
        const heat = this.createEquipmentText(cols.heat, rowY, heatStr, false);
        group.appendChild(heat);
        
        // Damage column with type code: "5 [DE]" format
        const damageStr = eq.damageCode 
          ? `${eq.damage} ${eq.damageCode}` 
          : String(eq.damage || '-');
        const dmg = this.createEquipmentText(cols.dmg, rowY, damageStr, false);
        group.appendChild(dmg);
        
        // Range columns - show '-' for 0 minimum
        const minStr = eq.minimum === 0 || eq.minimum === '-' ? '-' : String(eq.minimum);
        const min = this.createEquipmentText(cols.min, rowY, minStr, false);
        group.appendChild(min);
        
        const sht = this.createEquipmentText(cols.sht, rowY, String(eq.short || '-'), false);
        const med = this.createEquipmentText(cols.med, rowY, String(eq.medium || '-'), false);
        const lng = this.createEquipmentText(cols.lng, rowY, String(eq.long || '-'), false);
        group.appendChild(sht);
        group.appendChild(med);
        group.appendChild(lng);
      } else if (eq.isAmmo) {
        const ammoInfo = this.createEquipmentText(cols.dmg, rowY, eq.ammoCount ? `(${eq.ammoCount})` : '-', false);
        group.appendChild(ammoInfo);
      }
    });

    const parent = inventoryArea.parentNode;
    if (parent) {
      parent.insertBefore(group, inventoryArea.nextSibling);
    }
  }

  private createEquipmentText(x: number, y: number, content: string, isHeader: boolean): SVGTextElement {
    const text = this.svgDoc!.createElementNS(SVG_NS, 'text');
    text.setAttribute('x', String(x));
    text.setAttribute('y', String(y));
    text.setAttribute('fill', '#000000');
    text.setAttribute('font-size', '6px');
    if (isHeader) {
      text.setAttribute('font-weight', 'bold');
    }
    text.textContent = content;
    return text;
  }

  private renderCriticalSlots(criticals: readonly ILocationCriticals[]): void {
    criticals.forEach(loc => {
      this.renderLocationCriticals(loc);
    });
  }

  private renderLocationCriticals(location: ILocationCriticals): void {
    const abbr = location.abbreviation;
    
    const possibleIds = [
      `critTableArea${abbr}`,
      `critTable_${abbr}`,
      `critArea_${abbr}`,
      `crits${abbr}`,
    ];

    let critArea: Element | null = null;
    for (const id of possibleIds) {
      critArea = this.svgDoc?.getElementById(id) ?? null;
      if (critArea) break;
    }

    if (!critArea || !this.svgDoc) return;

    const x = parseFloat(critArea.getAttribute('x') || '0');
    const y = parseFloat(critArea.getAttribute('y') || '0');
    
    const group = this.svgDoc.createElementNS(SVG_NS, 'g');
    group.setAttribute('class', `crit-slots-${abbr}`);

    const slotHeight = 8;
    location.slots.forEach((slot, index) => {
      const slotY = y + 10 + index * slotHeight;
      
      const numEl = this.svgDoc!.createElementNS(SVG_NS, 'text');
      numEl.setAttribute('x', String(x + 2));
      numEl.setAttribute('y', String(slotY));
      numEl.setAttribute('font-size', '5px');
      numEl.setAttribute('font-family', 'Eurostile, Arial, sans-serif');
      numEl.textContent = `${(index % 6) + 1}.`;
      group.appendChild(numEl);

      const contentEl = this.svgDoc!.createElementNS(SVG_NS, 'text');
      contentEl.setAttribute('x', String(x + 12));
      contentEl.setAttribute('y', String(slotY));
      contentEl.setAttribute('font-size', '5px');
      contentEl.setAttribute('font-family', 'Eurostile, Arial, sans-serif');
      
      const content = slot.isRollAgain ? 'Roll Again' : slot.content || '-';
      contentEl.textContent = content.length > 15 ? content.substring(0, 13) + '..' : content;
      
      if (slot.isSystem) {
        contentEl.setAttribute('font-weight', 'bold');
      }
      if (slot.isRollAgain) {
        contentEl.setAttribute('fill', '#666666');
      }
      
      group.appendChild(contentEl);
    });

    const parent = critArea.parentNode;
    if (parent) {
      parent.insertBefore(group, critArea.nextSibling);
    }
  }
}

/**
 * Create and configure an SVG renderer instance
 */
export async function createSVGRenderer(templatePath: string): Promise<SVGRecordSheetRenderer> {
  const renderer = new SVGRecordSheetRenderer();
  await renderer.loadTemplate(templatePath);
  return renderer;
}
