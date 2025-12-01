/**
 * Equipment Filters Component
 * 
 * Filter controls for the equipment browser.
 * 
 * @spec openspec/specs/equipment-browser/spec.md
 */

import React from 'react';
import { TechBase, ALL_TECH_BASES } from '@/types/enums/TechBase';
import { EquipmentCategory } from '@/types/equipment';

interface EquipmentFiltersProps {
  /** Current search query */
  search: string;
  /** Current tech base filter */
  techBase: TechBase | null;
  /** Current category filter */
  category: EquipmentCategory | null;
  /** Search change handler */
  onSearchChange: (search: string) => void;
  /** Tech base change handler */
  onTechBaseChange: (techBase: TechBase | null) => void;
  /** Category change handler */
  onCategoryChange: (category: EquipmentCategory | null) => void;
  /** Clear all filters */
  onClear: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Equipment categories for filtering
 */
const FILTER_CATEGORIES: { value: EquipmentCategory; label: string }[] = [
  { value: EquipmentCategory.ENERGY_WEAPON, label: 'Energy Weapons' },
  { value: EquipmentCategory.BALLISTIC_WEAPON, label: 'Ballistic Weapons' },
  { value: EquipmentCategory.MISSILE_WEAPON, label: 'Missile Weapons' },
  { value: EquipmentCategory.AMMUNITION, label: 'Ammunition' },
  { value: EquipmentCategory.ELECTRONICS, label: 'Electronics' },
  { value: EquipmentCategory.PHYSICAL_WEAPON, label: 'Physical Weapons' },
  { value: EquipmentCategory.MISC_EQUIPMENT, label: 'Misc Equipment' },
];

/**
 * Equipment filter controls
 */
export function EquipmentFilters({
  search,
  techBase,
  category,
  onSearchChange,
  onTechBaseChange,
  onCategoryChange,
  onClear,
  className = '',
}: EquipmentFiltersProps) {
  const hasFilters = search || techBase || category;
  
  return (
    <div className={`px-4 py-3 flex flex-wrap gap-3 ${className}`}>
      {/* Search */}
      <div className="flex-1 min-w-[200px]">
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search equipment..."
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 text-sm focus:outline-none focus:border-amber-500"
        />
      </div>
      
      {/* Tech Base */}
      <div>
        <select
          value={techBase || ''}
          onChange={(e) => onTechBaseChange(e.target.value as TechBase || null)}
          className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-amber-500"
        >
          <option value="">All Tech</option>
          {ALL_TECH_BASES.map((tb) => (
            <option key={tb} value={tb}>
              {tb}
            </option>
          ))}
        </select>
      </div>
      
      {/* Category */}
      <div>
        <select
          value={category || ''}
          onChange={(e) => onCategoryChange(e.target.value as EquipmentCategory || null)}
          className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-amber-500"
        >
          <option value="">All Categories</option>
          {FILTER_CATEGORIES.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      
      {/* Clear */}
      {hasFilters && (
        <button
          onClick={onClear}
          className="px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  );
}

