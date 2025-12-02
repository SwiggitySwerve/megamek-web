/**
 * Equipment Tab Component
 * 
 * Browse and add equipment to the unit, view mounted equipment summary.
 * Left panel: Equipment Browser (searchable catalog)
 * Right panel: Mounted Equipment Summary (totals and list)
 * 
 * @spec openspec/specs/equipment-browser/spec.md
 * @spec openspec/specs/equipment-tray/spec.md
 */

import React, { useCallback, useMemo } from 'react';
import { useUnitStore } from '@/stores/useUnitStore';
import { useEquipmentCalculations } from '@/hooks/useEquipmentCalculations';
import { useUnitCalculations } from '@/hooks/useUnitCalculations';
import { EquipmentBrowser } from '../equipment/EquipmentBrowser';
import { IEquipmentItem, EquipmentCategory } from '@/types/equipment';
import { IMountedEquipmentInstance } from '@/stores/unitState';
import { TechBaseBadge } from '../shared/TechBaseBadge';
import { categoryToColorType, getEquipmentColors } from '@/utils/colors/equipmentColors';
import { customizerStyles as cs } from '../styles';

// =============================================================================
// Types
// =============================================================================

interface EquipmentTabProps {
  /** Read-only mode */
  readOnly?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get short category label for display
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
 * Get category order for display grouping
 */
function getCategoryOrder(category: EquipmentCategory): number {
  switch (category) {
    case EquipmentCategory.ENERGY_WEAPON:
      return 0;
    case EquipmentCategory.BALLISTIC_WEAPON:
      return 1;
    case EquipmentCategory.MISSILE_WEAPON:
      return 2;
    case EquipmentCategory.ARTILLERY:
      return 3;
    case EquipmentCategory.CAPITAL_WEAPON:
      return 4;
    case EquipmentCategory.PHYSICAL_WEAPON:
      return 5;
    case EquipmentCategory.AMMUNITION:
      return 6;
    case EquipmentCategory.ELECTRONICS:
      return 7;
    case EquipmentCategory.MISC_EQUIPMENT:
      return 8;
    default:
      return 99;
  }
}

// =============================================================================
// Sub-Components
// =============================================================================

/**
 * Mounted equipment item row
 */
interface MountedEquipmentRowProps {
  equipment: IMountedEquipmentInstance;
  onRemove: (instanceId: string) => void;
  readOnly: boolean;
}

function MountedEquipmentRow({ equipment, onRemove, readOnly }: MountedEquipmentRowProps) {
  const colorType = categoryToColorType(equipment.category);
  const colors = getEquipmentColors(colorType);
  
  const handleRemove = useCallback(() => {
    onRemove(equipment.instanceId);
  }, [equipment.instanceId, onRemove]);
  
  return (
    <div 
      className={`flex items-center justify-between px-3 py-2 rounded ${colors.bg} ${colors.border} border`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-white truncate">{equipment.name}</span>
          <TechBaseBadge techBase={equipment.techBase} />
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-300 mt-0.5">
          <span>{equipment.weight}t</span>
          <span>{equipment.criticalSlots} slots</span>
          {equipment.heat > 0 && <span>{equipment.heat} heat</span>}
          {equipment.location && (
            <span className="text-amber-400">{equipment.location}</span>
          )}
          {!equipment.location && (
            <span className="text-slate-500 italic">Unallocated</span>
          )}
        </div>
      </div>
      {!readOnly && (
        <button
          onClick={handleRemove}
          className="ml-2 px-2 py-1 text-xs bg-red-600 hover:bg-red-500 text-white rounded transition-colors"
          title="Remove equipment"
        >
          ✕
        </button>
      )}
    </div>
  );
}

/**
 * Equipment category group
 */
interface CategoryGroupProps {
  category: EquipmentCategory;
  items: IMountedEquipmentInstance[];
  onRemove: (instanceId: string) => void;
  readOnly: boolean;
}

function CategoryGroup({ category, items, onRemove, readOnly }: CategoryGroupProps) {
  if (items.length === 0) return null;
  
  const colorType = categoryToColorType(category);
  const colors = getEquipmentColors(colorType);
  
  return (
    <div className="space-y-2">
      {/* Category header */}
      <div className="flex items-center gap-2">
        <span className={`px-2 py-0.5 rounded text-xs ${colors.badge}`}>
          {getCategoryLabel(category)}
        </span>
        <div className="flex-1 h-px bg-slate-700" />
        <span className="text-xs text-slate-500">{items.length}</span>
      </div>
      
      {/* Items */}
      <div className="space-y-1">
        {items.map((item) => (
          <MountedEquipmentRow
            key={item.instanceId}
            equipment={item}
            onRemove={onRemove}
            readOnly={readOnly}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Summary statistics panel
 */
interface SummaryPanelProps {
  calculations: ReturnType<typeof useEquipmentCalculations>;
  remainingWeight: number;
  remainingSlots: number;
  maxSlots: number;
}

function SummaryPanel({ calculations, remainingWeight, remainingSlots, maxSlots }: SummaryPanelProps) {
  const isOverWeight = remainingWeight < 0;
  const isOverSlots = remainingSlots < 0;
  
  return (
    <div className={cs.panel.summary}>
      <div className="grid grid-cols-4 gap-4">
        {/* Items Count */}
        <div className="text-center">
          <div className={cs.text.label}>Items</div>
          <div className={cs.text.value}>{calculations.itemCount}</div>
        </div>
        
        {/* Total Weight */}
        <div className="text-center">
          <div className={cs.text.label}>Weight</div>
          <div className={isOverWeight ? cs.text.valueNegative : cs.text.value}>
            {calculations.totalWeight.toFixed(1)}t
          </div>
        </div>
        
        {/* Total Slots */}
        <div className="text-center">
          <div className={cs.text.label}>Slots</div>
          <div className={isOverSlots ? cs.text.valueNegative : cs.text.value}>
            {calculations.totalSlots}
          </div>
        </div>
        
        {/* Total Heat */}
        <div className="text-center">
          <div className={cs.text.label}>Heat</div>
          <div className={calculations.totalHeat > 0 ? cs.text.valueWarning : cs.text.value}>
            {calculations.totalHeat}
          </div>
        </div>
      </div>
      
      {/* Capacity warnings */}
      {(isOverWeight || isOverSlots) && (
        <div className="mt-2 p-2 bg-red-900/50 border border-red-700 rounded text-sm text-red-300">
          <span className="mr-2">⚠️</span>
          {isOverWeight && (
            <span>Weight over by {Math.abs(remainingWeight).toFixed(1)}t</span>
          )}
          {isOverWeight && isOverSlots && <span> • </span>}
          {isOverSlots && (
            <span>Slots over by {Math.abs(remainingSlots)}</span>
          )}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

/**
 * Equipment configuration tab
 * 
 * Uses useUnitStore() to access the current unit's state.
 * No tabId prop needed - context provides the active unit.
 */
export function EquipmentTab({
  readOnly = false,
  className = '',
}: EquipmentTabProps) {
  // Get unit state from context
  const tonnage = useUnitStore((s) => s.tonnage);
  const equipment = useUnitStore((s) => s.equipment);
  const addEquipment = useUnitStore((s) => s.addEquipment);
  const removeEquipment = useUnitStore((s) => s.removeEquipment);
  
  // Get structural weight for capacity calculations
  const engineType = useUnitStore((s) => s.engineType);
  const engineRating = useUnitStore((s) => s.engineRating);
  const gyroType = useUnitStore((s) => s.gyroType);
  const internalStructureType = useUnitStore((s) => s.internalStructureType);
  const cockpitType = useUnitStore((s) => s.cockpitType);
  const heatSinkType = useUnitStore((s) => s.heatSinkType);
  const heatSinkCount = useUnitStore((s) => s.heatSinkCount);
  const armorType = useUnitStore((s) => s.armorType);
  const armorTonnage = useUnitStore((s) => s.armorTonnage);
  
  // Calculate structural weight
  const unitCalculations = useUnitCalculations(tonnage, {
    engineType,
    engineRating,
    gyroType,
    internalStructureType,
    cockpitType,
    heatSinkType,
    heatSinkCount,
    armorType,
  }, armorTonnage);
  
  // Calculate equipment totals
  const equipmentCalcs = useEquipmentCalculations(equipment);
  
  // Calculate remaining capacity
  const remainingWeight = tonnage - unitCalculations.totalStructuralWeight - equipmentCalcs.totalWeight;
  const availableEquipmentSlots = 78 - unitCalculations.totalSystemSlots;
  const remainingSlots = availableEquipmentSlots - equipmentCalcs.totalSlots;
  
  // Handle adding equipment
  const handleAddEquipment = useCallback((item: IEquipmentItem) => {
    if (readOnly) return;
    addEquipment(item);
  }, [addEquipment, readOnly]);
  
  // Handle removing equipment
  const handleRemoveEquipment = useCallback((instanceId: string) => {
    if (readOnly) return;
    removeEquipment(instanceId);
  }, [removeEquipment, readOnly]);
  
  // Group equipment by category and sort
  const groupedEquipment = useMemo(() => {
    const byCategory = equipmentCalcs.byCategory;
    
    // Get categories with items, sorted by display order
    const categories = Object.values(EquipmentCategory)
      .filter((cat) => byCategory[cat]?.count > 0)
      .sort((a, b) => getCategoryOrder(a) - getCategoryOrder(b));
    
    // Build grouped list
    const groups: Array<{ category: EquipmentCategory; items: IMountedEquipmentInstance[] }> = [];
    
    for (const category of categories) {
      const items = equipment.filter((e) => e.category === category);
      if (items.length > 0) {
        groups.push({ category, items });
      }
    }
    
    return groups;
  }, [equipment, equipmentCalcs.byCategory]);
  
  return (
    <div className={`${cs.layout.tabContent} ${className}`}>
      {/* Summary Stats */}
      <SummaryPanel
        calculations={equipmentCalcs}
        remainingWeight={remainingWeight}
        remainingSlots={remainingSlots}
        maxSlots={availableEquipmentSlots}
      />
      
      {/* Two-panel layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Left: Equipment Browser */}
        <div className="min-h-0">
          <EquipmentBrowser
            onAddEquipment={handleAddEquipment}
            className="h-full"
          />
        </div>
        
        {/* Right: Mounted Equipment */}
        <div className={cs.panel.main}>
          <h3 className={cs.text.sectionTitle}>Mounted Equipment</h3>
          
          {equipment.length === 0 ? (
            <div className={cs.panel.empty}>
              <div className="text-4xl mb-3">⚙️</div>
              <div className="text-lg font-medium text-slate-300 mb-2">
                No Equipment Added
              </div>
              <div className="text-sm text-slate-500">
                Browse equipment on the left and click Add to mount it
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {/* Allocation summary */}
              <div className="text-sm text-slate-400 flex items-center justify-between">
                <span>
                  {equipmentCalcs.allocatedCount} allocated, {equipmentCalcs.unallocatedCount} unallocated
                </span>
                <span className={remainingWeight < 0 ? 'text-red-400' : 'text-green-400'}>
                  {remainingWeight >= 0 ? '+' : ''}{remainingWeight.toFixed(1)}t remaining
                </span>
              </div>
              
              {/* Equipment by category */}
              {groupedEquipment.map(({ category, items }) => (
                <CategoryGroup
                  key={category}
                  category={category}
                  items={items}
                  onRemove={handleRemoveEquipment}
                  readOnly={readOnly}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {readOnly && (
        <div className={cs.panel.notice}>
          This unit is in read-only mode. Changes cannot be made.
        </div>
      )}
    </div>
  );
}

export default EquipmentTab;

