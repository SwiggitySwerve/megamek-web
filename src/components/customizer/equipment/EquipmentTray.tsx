/**
 * Equipment Tray Component
 * 
 * Persistent sidebar showing unit's current equipment.
 * 
 * @spec openspec/changes/add-customizer-ui-components/specs/equipment-tray/spec.md
 */

import React, { useState } from 'react';
import { EquipmentCategory } from '@/types/equipment';
import { categoryToColorType, getEquipmentColors } from '@/utils/colors/equipmentColors';
import { getAllocationBadgeClasses } from '@/utils/colors/statusColors';

/**
 * Equipment item in the tray
 */
export interface TrayEquipmentItem {
  /** Unique mount ID */
  id: string;
  /** Equipment name */
  name: string;
  /** Equipment category */
  category: EquipmentCategory;
  /** Weight in tons */
  weight: number;
  /** Critical slots */
  criticalSlots: number;
  /** Is allocated to critical slots */
  isAllocated: boolean;
  /** Location if allocated */
  location?: string;
}

/**
 * Weight statistics
 */
export interface WeightStats {
  /** Total unit tonnage */
  maxWeight: number;
  /** Weight used */
  usedWeight: number;
  /** Remaining weight */
  remainingWeight: number;
}

interface EquipmentTrayProps {
  /** Equipment items */
  equipment: TrayEquipmentItem[];
  /** Weight statistics */
  weightStats: WeightStats;
  /** Called when equipment is double-clicked (remove) */
  onRemoveEquipment: (id: string) => void;
  /** Called when equipment is clicked (select) */
  onSelectEquipment: (id: string) => void;
  /** Currently selected equipment ID */
  selectedEquipmentId?: string;
  /** Is tray collapsed */
  isCollapsed?: boolean;
  /** Toggle collapse state */
  onToggleCollapse?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Group equipment by category
 */
function groupByCategory(
  equipment: TrayEquipmentItem[]
): Record<EquipmentCategory, TrayEquipmentItem[]> {
  const groups: Record<string, TrayEquipmentItem[]> = {};
  
  for (const item of equipment) {
    if (!groups[item.category]) {
      groups[item.category] = [];
    }
    groups[item.category].push(item);
  }
  
  return groups as Record<EquipmentCategory, TrayEquipmentItem[]>;
}

/**
 * Equipment tray sidebar
 */
export function EquipmentTray({
  equipment,
  weightStats,
  onRemoveEquipment,
  onSelectEquipment,
  selectedEquipmentId,
  isCollapsed = false,
  onToggleCollapse,
  className = '',
}: EquipmentTrayProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(Object.values(EquipmentCategory))
  );
  
  const grouped = groupByCategory(equipment);
  const isOverweight = weightStats.remainingWeight < 0;
  
  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };
  
  if (isCollapsed) {
    return (
      <div className={`bg-slate-800 border border-slate-700 rounded-lg ${className}`}>
        <button
          onClick={onToggleCollapse}
          className="w-full p-2 text-slate-400 hover:text-white transition-colors"
          title="Expand equipment tray"
        >
          <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    );
  }
  
  return (
    <div className={`bg-slate-800 border border-slate-700 rounded-lg flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700">
        <h3 className="font-semibold text-white">Equipment</h3>
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Weight stats */}
      <div className={`px-3 py-2 border-b border-slate-700 ${isOverweight ? 'bg-red-900/30' : ''}`}>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Weight:</span>
          <span className={isOverweight ? 'text-red-400' : 'text-white'}>
            {weightStats.usedWeight.toFixed(1)} / {weightStats.maxWeight}t
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Remaining:</span>
          <span className={isOverweight ? 'text-red-400' : 'text-green-400'}>
            {weightStats.remainingWeight.toFixed(1)}t
          </span>
        </div>
        {isOverweight && (
          <div className="mt-2 text-xs text-red-400 bg-red-900/50 rounded px-2 py-1">
            ⚠️ Over weight limit!
          </div>
        )}
      </div>
      
      {/* Equipment list */}
      <div className="flex-1 overflow-y-auto">
        {equipment.length === 0 ? (
          <div className="p-4 text-center text-slate-400 text-sm">
            No equipment mounted
          </div>
        ) : (
          Object.entries(grouped).map(([category, items]) => {
            const colorType = categoryToColorType(category as EquipmentCategory);
            const colors = getEquipmentColors(colorType);
            const isExpanded = expandedCategories.has(category);
            
            return (
              <div key={category} className="border-b border-slate-700/50 last:border-b-0">
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between px-3 py-2 hover:bg-slate-700/50 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded ${colors.bg}`} />
                    <span className="text-sm text-slate-300">{category}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">{items.length}</span>
                    <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </span>
                </button>
                
                {isExpanded && (
                  <div className="pb-1">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className={`
                          mx-2 mb-1 px-2 py-1.5 rounded text-sm cursor-pointer
                          transition-colors
                          ${selectedEquipmentId === item.id
                            ? 'bg-amber-600/30 ring-1 ring-amber-500'
                            : 'bg-slate-700/50 hover:bg-slate-700'
                          }
                        `}
                        onClick={() => onSelectEquipment(item.id)}
                        onDoubleClick={() => onRemoveEquipment(item.id)}
                        title="Click to select, double-click to remove"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-white truncate">{item.name}</span>
                          <span className={getAllocationBadgeClasses(item.isAllocated ? 'allocated' : 'unallocated')}>
                            {item.isAllocated ? '✓' : '?'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                          <span>{item.weight}t</span>
                          <span>{item.criticalSlots} slots</span>
                          {item.location && <span>@ {item.location}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

