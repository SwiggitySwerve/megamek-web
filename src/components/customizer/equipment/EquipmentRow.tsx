/**
 * Equipment Row Component
 * 
 * Table row for equipment in the browser.
 * 
 * @spec openspec/changes/add-customizer-ui-components/specs/equipment-browser/spec.md
 */

import React, { memo } from 'react';
import { IEquipmentItem, EquipmentCategory } from '@/types/equipment';
import { TechBaseBadge } from '../shared/TechBaseBadge';
import { categoryToColorType, getEquipmentColors } from '@/utils/colors/equipmentColors';

interface EquipmentRowProps {
  /** Equipment item data */
  equipment: IEquipmentItem;
  /** Called when add button is clicked */
  onAdd: () => void;
}

/**
 * Get short category label
 */
function getCategoryLabel(category: EquipmentCategory): string {
  switch (category) {
    case EquipmentCategory.ENERGY_WEAPON:
      return 'Energy';
    case EquipmentCategory.BALLISTIC_WEAPON:
      return 'Ballistic';
    case EquipmentCategory.MISSILE_WEAPON:
      return 'Missile';
    case EquipmentCategory.ARTILLERY:
      return 'Artillery';
    case EquipmentCategory.CAPITAL_WEAPON:
      return 'Capital';
    case EquipmentCategory.AMMUNITION:
      return 'Ammo';
    case EquipmentCategory.ELECTRONICS:
      return 'Electronics';
    case EquipmentCategory.PHYSICAL_WEAPON:
      return 'Physical';
    case EquipmentCategory.MISC_EQUIPMENT:
      return 'Misc';
    default:
      return String(category);
  }
}

/**
 * Equipment table row
 * Memoized for performance when rendering large lists
 */
export const EquipmentRow = memo(function EquipmentRow({
  equipment,
  onAdd,
}: EquipmentRowProps) {
  const colorType = categoryToColorType(equipment.category);
  const colors = getEquipmentColors(colorType);
  
  return (
    <tr className="border-t border-slate-700/50 hover:bg-slate-700/30 transition-colors">
      {/* Name */}
      <td className="px-3 py-2">
        <span className="text-white">{equipment.name}</span>
      </td>
      
      {/* Category */}
      <td className="px-3 py-2">
        <span className={`px-2 py-0.5 rounded text-xs ${colors.badge}`}>
          {getCategoryLabel(equipment.category)}
        </span>
      </td>
      
      {/* Tech Base */}
      <td className="px-3 py-2">
        <TechBaseBadge techBase={equipment.techBase} />
      </td>
      
      {/* Weight */}
      <td className="px-3 py-2 text-slate-300 text-right">
        {equipment.weight}t
      </td>
      
      {/* Critical Slots */}
      <td className="px-3 py-2 text-slate-300 text-right">
        {equipment.criticalSlots}
      </td>
      
      {/* Damage (placeholder - would need weapon-specific data) */}
      <td className="px-3 py-2 text-slate-400 text-right">
        -
      </td>
      
      {/* Heat (placeholder - would need weapon-specific data) */}
      <td className="px-3 py-2 text-slate-400 text-right">
        -
      </td>
      
      {/* Add button */}
      <td className="px-3 py-2">
        <button
          onClick={onAdd}
          className="px-2 py-1 text-xs bg-amber-600 hover:bg-amber-500 text-white rounded transition-colors"
        >
          Add
        </button>
      </td>
    </tr>
  );
});

