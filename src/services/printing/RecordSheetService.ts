/**
 * Record Sheet Service
 * 
 * Orchestrates record sheet generation, preview rendering, and PDF export.
 * 
 * @spec openspec/specs/record-sheet-export/spec.md
 */

import { jsPDF } from 'jspdf';
import {
  IRecordSheetData,
  IRecordSheetHeader,
  IRecordSheetMovement,
  IRecordSheetArmor,
  IRecordSheetStructure,
  IRecordSheetEquipment,
  IRecordSheetHeatSinks,
  ILocationCriticals,
  IRecordSheetCriticalSlot,
  ILocationArmor,
  ILocationStructure,
  PaperSize,
  PAPER_DIMENSIONS,
  LOCATION_ABBREVIATIONS,
  LOCATION_NAMES,
  IPDFExportOptions,
} from '@/types/printing';
import { MechRecordSheetRenderer } from './MechRecordSheetRenderer';
import { SVGRecordSheetRenderer } from './SVGRecordSheetRenderer';
import { MechLocation } from '@/types/construction/CriticalSlotAllocation';
import { STRUCTURE_POINTS_TABLE } from '@/types/construction/InternalStructureType';
import { getAllWeapons, IWeapon, WeaponCategory } from '@/types/equipment';

// SVG template paths (using original MegaMek templates)
const SVG_TEMPLATES = {
  biped: '/record-sheets/templates/mek_biped_default.svg',
  quad: '/record-sheets/templates/mek_quad.svg',
  tripod: '/record-sheets/templates/mek_tripod.svg',
  lam: '/record-sheets/templates/mek_lam.svg',
  quadvee: '/record-sheets/templates/mek_quadvee.svg',
} as const;

/**
 * Unit configuration interface (simplified for service)
 */
interface IUnitConfig {
  id: string;
  name: string;
  chassis: string;
  model: string;
  tonnage: number;
  techBase: string;
  rulesLevel: string;
  era: string;
  configuration: string;
  engine: {
    type: string;
    rating: number;
  };
  gyro: {
    type: string;
  };
  structure: {
    type: string;
  };
  armor: {
    type: string;
    allocation: {
      head: number;
      centerTorso: number;
      centerTorsoRear: number;
      leftTorso: number;
      leftTorsoRear: number;
      rightTorso: number;
      rightTorsoRear: number;
      leftArm: number;
      rightArm: number;
      leftLeg: number;
      rightLeg: number;
    };
  };
  heatSinks: {
    type: string;
    count: number;
  };
  movement: {
    walkMP: number;
    runMP: number;
    jumpMP: number;
  };
  equipment: Array<{
    id: string;
    name: string;
    location: string;
    heat?: number;
    damage?: number | string;
    ranges?: {
      minimum: number;
      short: number;
      medium: number;
      long: number;
    };
    isWeapon?: boolean;
    isAmmo?: boolean;
    ammoCount?: number;
    slots?: number[];
  }>;
  criticalSlots?: Record<string, Array<{ content: string; isSystem?: boolean; equipmentId?: string } | null>>;
  battleValue?: number;
  cost?: number;
  enhancements?: string[];
}

/**
 * Record Sheet Service class
 */
export class RecordSheetService {
  private static instance: RecordSheetService;

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): RecordSheetService {
    if (!RecordSheetService.instance) {
      RecordSheetService.instance = new RecordSheetService();
    }
    return RecordSheetService.instance;
  }

  /**
   * Extract record sheet data from unit configuration
   */
  extractData(unit: IUnitConfig): IRecordSheetData {
    return {
      header: this.extractHeader(unit),
      movement: this.extractMovement(unit),
      armor: this.extractArmor(unit),
      structure: this.extractStructure(unit),
      equipment: this.extractEquipment(unit),
      heatSinks: this.extractHeatSinks(unit),
      criticals: this.extractCriticals(unit),
      pilot: undefined, // Blank for now
      mechType: this.getMechType(unit.configuration),
    };
  }

  /**
   * Render preview to canvas (legacy canvas-based rendering)
   */
  renderPreview(
    canvas: HTMLCanvasElement,
    data: IRecordSheetData,
    paperSize: PaperSize = PaperSize.LETTER
  ): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get canvas 2D context');
    }

    // Set canvas size to match paper
    const { width, height } = PAPER_DIMENSIONS[paperSize];
    canvas.width = width;
    canvas.height = height;

    // Render record sheet
    const renderer = new MechRecordSheetRenderer(ctx, paperSize);
    renderer.render(data);
  }

  /**
   * Render preview using SVG template (MegaMekLab-style)
   */
  async renderSVGPreview(
    canvas: HTMLCanvasElement,
    data: IRecordSheetData,
    paperSize: PaperSize = PaperSize.LETTER
  ): Promise<void> {
    // Get template path based on mech type
    const templatePath = SVG_TEMPLATES[data.mechType] || SVG_TEMPLATES.biped;
    
    try {
      const renderer = new SVGRecordSheetRenderer();
      await renderer.loadTemplate(templatePath);
      renderer.fillTemplate(data);
      
      // Load and insert armor pips
      await renderer.fillArmorPips(data.armor);
      
      await renderer.renderToCanvas(canvas);
    } catch (error) {
      console.warn('SVG rendering failed, falling back to canvas rendering:', error);
      // Fallback to canvas rendering
      this.renderPreview(canvas, data, paperSize);
    }
  }

  /**
   * Get SVG string for the record sheet
   */
  async getSVGString(data: IRecordSheetData): Promise<string> {
    const templatePath = SVG_TEMPLATES[data.mechType] || SVG_TEMPLATES.biped;
    
    const renderer = new SVGRecordSheetRenderer();
    await renderer.loadTemplate(templatePath);
    renderer.fillTemplate(data);
    
    // Load and insert armor pips
    await renderer.fillArmorPips(data.armor);
    
    return renderer.getSVGString();
  }

  /**
   * Export to PDF and trigger download
   */
  async exportPDF(
    data: IRecordSheetData,
    options: IPDFExportOptions = { paperSize: PaperSize.LETTER, includePilotData: false }
  ): Promise<void> {
    const { paperSize, filename } = options;
    const { width, height } = PAPER_DIMENSIONS[paperSize];

    // Create off-screen canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    // Render to canvas
    this.renderPreview(canvas, data, paperSize);

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: paperSize === PaperSize.A4 ? 'a4' : 'letter',
    });

    // Add canvas image to PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, width, height);

    // Generate filename
    const pdfFilename = filename || `${data.header.chassis}-${data.header.model}.pdf`.replace(/\s+/g, '-');

    // Trigger download
    pdf.save(pdfFilename);
  }

  /**
   * Print record sheet using browser print dialog
   */
  print(canvas: HTMLCanvasElement): void {
    const dataUrl = canvas.toDataURL('image/png');
    
    const printWindow = window.open('', '_blank') as unknown as Window | null;
    if (!printWindow) {
      throw new Error('Could not open print window. Check popup blocker settings.');
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Record Sheet</title>
          <style>
            @page { margin: 0; }
            body { margin: 0; display: flex; justify-content: center; }
            img { max-width: 100%; height: auto; }
            @media print {
              body { margin: 0; }
              img { max-width: 100%; max-height: 100vh; }
            }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" onload="window.print(); window.close();" />
        </body>
      </html>
    `);
    printWindow.document.close();
  }

  /**
   * Extract header data
   */
  private extractHeader(unit: IUnitConfig): IRecordSheetHeader {
    return {
      unitName: unit.name || `${unit.chassis} ${unit.model}`,
      chassis: unit.chassis,
      model: unit.model,
      tonnage: unit.tonnage,
      techBase: unit.techBase,
      rulesLevel: unit.rulesLevel,
      era: unit.era,
      battleValue: unit.battleValue || 0,
      cost: unit.cost || 0,
    };
  }

  /**
   * Extract movement data
   */
  private extractMovement(unit: IUnitConfig): IRecordSheetMovement {
    const enhancements = unit.enhancements || [];
    return {
      walkMP: unit.movement.walkMP,
      runMP: unit.movement.runMP,
      jumpMP: unit.movement.jumpMP,
      hasMASC: enhancements.includes('MASC'),
      hasTSM: enhancements.includes('TSM'),
      hasSupercharger: enhancements.includes('Supercharger'),
    };
  }

  /**
   * Extract armor data
   */
  private extractArmor(unit: IUnitConfig): IRecordSheetArmor {
    const { armor, tonnage } = unit;
    const structurePoints = STRUCTURE_POINTS_TABLE[tonnage] || STRUCTURE_POINTS_TABLE[50];
    
    const locations: ILocationArmor[] = [
      {
        location: LOCATION_NAMES[MechLocation.HEAD],
        abbreviation: LOCATION_ABBREVIATIONS[MechLocation.HEAD],
        current: armor.allocation.head,
        maximum: 9, // Head max is always 9
      },
      {
        location: LOCATION_NAMES[MechLocation.CENTER_TORSO],
        abbreviation: LOCATION_ABBREVIATIONS[MechLocation.CENTER_TORSO],
        current: armor.allocation.centerTorso,
        maximum: structurePoints.centerTorso * 2,
        rear: armor.allocation.centerTorsoRear,
        rearMaximum: structurePoints.centerTorso,
      },
      {
        location: LOCATION_NAMES[MechLocation.LEFT_TORSO],
        abbreviation: LOCATION_ABBREVIATIONS[MechLocation.LEFT_TORSO],
        current: armor.allocation.leftTorso,
        maximum: structurePoints.sideTorso * 2,
        rear: armor.allocation.leftTorsoRear,
        rearMaximum: structurePoints.sideTorso,
      },
      {
        location: LOCATION_NAMES[MechLocation.RIGHT_TORSO],
        abbreviation: LOCATION_ABBREVIATIONS[MechLocation.RIGHT_TORSO],
        current: armor.allocation.rightTorso,
        maximum: structurePoints.sideTorso * 2,
        rear: armor.allocation.rightTorsoRear,
        rearMaximum: structurePoints.sideTorso,
      },
      {
        location: LOCATION_NAMES[MechLocation.LEFT_ARM],
        abbreviation: LOCATION_ABBREVIATIONS[MechLocation.LEFT_ARM],
        current: armor.allocation.leftArm,
        maximum: structurePoints.arm * 2,
      },
      {
        location: LOCATION_NAMES[MechLocation.RIGHT_ARM],
        abbreviation: LOCATION_ABBREVIATIONS[MechLocation.RIGHT_ARM],
        current: armor.allocation.rightArm,
        maximum: structurePoints.arm * 2,
      },
      {
        location: LOCATION_NAMES[MechLocation.LEFT_LEG],
        abbreviation: LOCATION_ABBREVIATIONS[MechLocation.LEFT_LEG],
        current: armor.allocation.leftLeg,
        maximum: structurePoints.leg * 2,
      },
      {
        location: LOCATION_NAMES[MechLocation.RIGHT_LEG],
        abbreviation: LOCATION_ABBREVIATIONS[MechLocation.RIGHT_LEG],
        current: armor.allocation.rightLeg,
        maximum: structurePoints.leg * 2,
      },
    ];

    const totalPoints = locations.reduce((sum, loc) => {
      return sum + loc.current + (loc.rear || 0);
    }, 0);

    return {
      type: armor.type,
      totalPoints,
      locations,
    };
  }

  /**
   * Extract structure data
   */
  private extractStructure(unit: IUnitConfig): IRecordSheetStructure {
    const structurePoints = STRUCTURE_POINTS_TABLE[unit.tonnage] || STRUCTURE_POINTS_TABLE[50];
    
    const locations: ILocationStructure[] = [
      {
        location: LOCATION_NAMES[MechLocation.HEAD],
        abbreviation: LOCATION_ABBREVIATIONS[MechLocation.HEAD],
        points: structurePoints.head,
      },
      {
        location: LOCATION_NAMES[MechLocation.CENTER_TORSO],
        abbreviation: LOCATION_ABBREVIATIONS[MechLocation.CENTER_TORSO],
        points: structurePoints.centerTorso,
      },
      {
        location: LOCATION_NAMES[MechLocation.LEFT_TORSO],
        abbreviation: LOCATION_ABBREVIATIONS[MechLocation.LEFT_TORSO],
        points: structurePoints.sideTorso,
      },
      {
        location: LOCATION_NAMES[MechLocation.RIGHT_TORSO],
        abbreviation: LOCATION_ABBREVIATIONS[MechLocation.RIGHT_TORSO],
        points: structurePoints.sideTorso,
      },
      {
        location: LOCATION_NAMES[MechLocation.LEFT_ARM],
        abbreviation: LOCATION_ABBREVIATIONS[MechLocation.LEFT_ARM],
        points: structurePoints.arm,
      },
      {
        location: LOCATION_NAMES[MechLocation.RIGHT_ARM],
        abbreviation: LOCATION_ABBREVIATIONS[MechLocation.RIGHT_ARM],
        points: structurePoints.arm,
      },
      {
        location: LOCATION_NAMES[MechLocation.LEFT_LEG],
        abbreviation: LOCATION_ABBREVIATIONS[MechLocation.LEFT_LEG],
        points: structurePoints.leg,
      },
      {
        location: LOCATION_NAMES[MechLocation.RIGHT_LEG],
        abbreviation: LOCATION_ABBREVIATIONS[MechLocation.RIGHT_LEG],
        points: structurePoints.leg,
      },
    ];

    const totalPoints = locations.reduce((sum, loc) => sum + loc.points, 0);

    return {
      type: unit.structure.type,
      totalPoints,
      locations,
    };
  }

  /**
   * Extract equipment data - weapons, ammo, and combat equipment for the inventory table
   * Looks up actual weapon stats from the equipment database
   */
  private extractEquipment(unit: IUnitConfig): readonly IRecordSheetEquipment[] {
    // Get all weapons from the database for lookups
    const allWeapons = getAllWeapons();
    
    // Combat-relevant equipment that should appear in inventory (with [E] damage code)
    const COMBAT_EQUIPMENT = [
      'Targeting Computer',
      'C3 Master Computer', 'C3 Slave', 'C3i Computer',
      'TAG', 'Light TAG',
      'Guardian ECM', 'Angel ECM', 'ECM Suite',
      'BAP', 'Beagle Active Probe', 'Bloodhound Active Probe',
      'AMS', 'Anti-Missile System', 'Laser AMS',
    ];
    
    // Only include equipment that belongs in the Weapons & Equipment Inventory
    const combatEquipment = unit.equipment.filter((eq) => {
      // Include weapons
      if (eq.isWeapon) return true;
      
      // Include ammunition
      if (eq.isAmmo) return true;
      
      // Include items that have range data (combat-relevant)
      if (eq.ranges && (eq.ranges.short || eq.ranges.medium || eq.ranges.long)) return true;
      
      // Include combat-relevant equipment
      const lowerName = eq.name.toLowerCase();
      if (COMBAT_EQUIPMENT.some(ce => lowerName.includes(ce.toLowerCase()))) return true;
      
      // Exclude structural components, enhancements, movement equipment
      return false;
    });

    return combatEquipment.map((eq) => {
      // Look up weapon data from database by name or id
      const weaponData = this.lookupWeapon(allWeapons, eq.name, eq.id);
      
      if (weaponData) {
        // Get damage type code based on weapon category
        const damageCode = this.getDamageCode(weaponData.category);
        
        // Format damage - missiles use "X/Msl" format
        const isMissile = weaponData.category === WeaponCategory.MISSILE;
        const formattedDamage = isMissile 
          ? this.formatMissileDamage(eq.name, weaponData.damage)
          : String(weaponData.damage);
        
        // Use database values for damage, heat, and ranges
        return {
          id: eq.id,
          name: eq.name,
          location: eq.location,
          locationAbbr: LOCATION_ABBREVIATIONS[eq.location as MechLocation] || eq.location,
          heat: weaponData.heat,
          damage: formattedDamage,
          damageCode,
          minimum: weaponData.ranges.minimum,
          short: weaponData.ranges.short,
          medium: weaponData.ranges.medium,
          long: weaponData.ranges.long,
          quantity: 1,
          isWeapon: true,
          isAmmo: false,
          ammoCount: undefined,
        };
      }
      
      // Check if this is combat equipment (non-weapon)
      const lowerName = eq.name.toLowerCase();
      const isCombatEquipment = COMBAT_EQUIPMENT.some(ce => lowerName.includes(ce.toLowerCase()));
      
      if (isCombatEquipment) {
        return {
          id: eq.id,
          name: eq.name,
          location: eq.location,
          locationAbbr: LOCATION_ABBREVIATIONS[eq.location as MechLocation] || eq.location,
          heat: '-',
          damage: '-',
          damageCode: '[E]', // Equipment
          minimum: '-',
          short: '-',
          medium: '-',
          long: '-',
          quantity: 1,
          isWeapon: false,
          isAmmo: false,
          isEquipment: true,
          ammoCount: undefined,
        };
      }
      
      // Fallback for ammo or items not in weapon database
      return {
        id: eq.id,
        name: eq.name,
        location: eq.location,
        locationAbbr: LOCATION_ABBREVIATIONS[eq.location as MechLocation] || eq.location,
        heat: eq.heat || 0,
        damage: eq.damage || '-',
        minimum: eq.ranges?.minimum || 0,
        short: eq.ranges?.short || '-',
        medium: eq.ranges?.medium || '-',
        long: eq.ranges?.long || '-',
        quantity: 1,
        isWeapon: eq.isWeapon || false,
        isAmmo: eq.isAmmo || false,
        ammoCount: eq.ammoCount,
      };
    });
  }

  /**
   * Get damage type code based on weapon category
   * Format matches MegaMekLab output:
   * - [DE] = Direct Energy
   * - [DB] = Direct Ballistic  
   * - [M,C,S] = Missile, Cluster, Salvo
   * - [AE] = Area Effect
   */
  private getDamageCode(category: WeaponCategory): string {
    switch (category) {
      case WeaponCategory.ENERGY:
        return '[DE]';
      case WeaponCategory.BALLISTIC:
        return '[DB]';
      case WeaponCategory.MISSILE:
        return '[M,C,S]'; // Missile, Cluster, Salvo
      case WeaponCategory.ARTILLERY:
        return '[AE]';
      case WeaponCategory.PHYSICAL:
        return '[P]';
      default:
        return '';
    }
  }

  /**
   * Format missile damage as "X/Msl" where X is damage per missile
   */
  private formatMissileDamage(weaponName: string, baseDamage: number | string): string {
    const name = weaponName.toLowerCase();
    
    // LRMs do 1 damage per missile
    if (name.includes('lrm')) {
      return '1/Msl';
    }
    // SRMs do 2 damage per missile
    if (name.includes('srm') || name.includes('streak srm')) {
      return '2/Msl';
    }
    // MRMs do 1 damage per missile
    if (name.includes('mrm')) {
      return '1/Msl';
    }
    // ATMs vary - default to 2/Msl
    if (name.includes('atm')) {
      return '2/Msl';
    }
    
    // Default: return base damage
    return String(baseDamage);
  }

  /**
   * Look up weapon data from the database by name or id
   */
  private lookupWeapon(weapons: readonly IWeapon[], name: string, id?: string): IWeapon | undefined {
    // First try exact id match
    if (id) {
      const byId = weapons.find(w => w.id === id);
      if (byId) return byId;
    }
    
    // Try exact name match
    const byName = weapons.find(w => w.name === name);
    if (byName) return byName;
    
    // Try case-insensitive name match
    const lowerName = name.toLowerCase();
    const byLowerName = weapons.find(w => w.name.toLowerCase() === lowerName);
    if (byLowerName) return byLowerName;
    
    // Try partial match (weapon name contains the search name)
    const byPartial = weapons.find(w => 
      w.name.toLowerCase().includes(lowerName) || 
      lowerName.includes(w.name.toLowerCase())
    );
    
    return byPartial;
  }

  /**
   * Extract heat sink data
   */
  private extractHeatSinks(unit: IUnitConfig): IRecordSheetHeatSinks {
    const isDouble = unit.heatSinks.type.toLowerCase().includes('double');
    const capacity = unit.heatSinks.count * (isDouble ? 2 : 1);
    const integrated = Math.floor(unit.engine.rating / 25);
    
    return {
      type: unit.heatSinks.type,
      count: unit.heatSinks.count,
      capacity,
      integrated: Math.min(integrated, unit.heatSinks.count),
      external: Math.max(0, unit.heatSinks.count - integrated),
    };
  }

  /**
   * Extract critical slots data
   */
  private extractCriticals(unit: IUnitConfig): readonly ILocationCriticals[] {
    const locations: MechLocation[] = [
      MechLocation.HEAD,
      MechLocation.CENTER_TORSO,
      MechLocation.LEFT_TORSO,
      MechLocation.RIGHT_TORSO,
      MechLocation.LEFT_ARM,
      MechLocation.RIGHT_ARM,
      MechLocation.LEFT_LEG,
      MechLocation.RIGHT_LEG,
    ];

    return locations.map((loc) => {
      const slotData = unit.criticalSlots?.[loc] || [];
      const slotCount = loc === MechLocation.HEAD || loc === MechLocation.LEFT_LEG || loc === MechLocation.RIGHT_LEG ? 6 : 12;
      
      const slots: IRecordSheetCriticalSlot[] = [];
      for (let i = 0; i < slotCount; i++) {
        const slot = slotData[i];
        slots.push({
          slotNumber: i + 1,
          content: slot?.content || '',
          isSystem: slot?.isSystem || false,
          isHittable: true,
          isRollAgain: !slot?.content,
          equipmentId: slot?.equipmentId,
        });
      }

      return {
        location: LOCATION_NAMES[loc],
        abbreviation: LOCATION_ABBREVIATIONS[loc],
        slots,
      };
    });
  }

  /**
   * Get mech type from configuration
   */
  private getMechType(configuration: string): 'biped' | 'quad' | 'tripod' | 'lam' | 'quadvee' {
    const config = configuration.toLowerCase();
    if (config.includes('quad')) return 'quad';
    if (config.includes('tripod')) return 'tripod';
    if (config.includes('lam')) return 'lam';
    if (config.includes('quadvee')) return 'quadvee';
    return 'biped';
  }
}

// Export singleton instance
export const recordSheetService = RecordSheetService.getInstance();

