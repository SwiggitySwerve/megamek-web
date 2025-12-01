/**
 * Equipment Browser Component
 * 
 * Searchable, filterable equipment catalog.
 * 
 * @spec openspec/specs/equipment-browser/spec.md
 */

import React from 'react';
import { EquipmentRow } from './EquipmentRow';
import { EquipmentFilters } from './EquipmentFilters';
import { useEquipmentBrowser } from '@/hooks/useEquipmentBrowser';
import { SortColumn } from '@/stores/useEquipmentStore';
import { IEquipmentItem } from '@/types/equipment';
import { PaginationButtons } from '@/components/ui/Button';

interface EquipmentBrowserProps {
  /** Called when equipment is added to unit */
  onAddEquipment: (equipment: IEquipmentItem) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Equipment browser with filtering and pagination
 */
export function EquipmentBrowser({
  onAddEquipment,
  className = '',
}: EquipmentBrowserProps) {
  const {
    paginatedEquipment,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalItems,
    search,
    techBaseFilter,
    categoryFilter,
    sortColumn,
    sortDirection,
    setSearch,
    setTechBaseFilter,
    setCategoryFilter,
    clearFilters,
    setPage,
    setSort,
    refresh,
  } = useEquipmentBrowser();
  
  if (error) {
    return (
      <div className={`bg-slate-800 rounded-lg border border-slate-700 p-4 ${className}`}>
        <div className="text-center py-8">
          <div className="text-red-400 mb-2">Failed to load equipment</div>
          <p className="text-sm text-slate-400 mb-4">{error}</p>
          <button
            onClick={refresh}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`bg-slate-800 rounded-lg border border-slate-700 ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-700">
        <h3 className="text-lg font-semibold text-white">Equipment Browser</h3>
      </div>
      
      {/* Filters */}
      <EquipmentFilters
        search={search}
        techBase={techBaseFilter}
        category={categoryFilter}
        onSearchChange={setSearch}
        onTechBaseChange={setTechBaseFilter}
        onCategoryChange={setCategoryFilter}
        onClear={clearFilters}
        className="border-b border-slate-700"
      />
      
      {/* Table */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-pulse text-slate-400">Loading equipment...</div>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-slate-400 uppercase">
                <SortableHeader
                  label="Name"
                  column="name"
                  currentColumn={sortColumn}
                  direction={sortDirection}
                  onSort={setSort}
                />
                <SortableHeader
                  label="Category"
                  column="category"
                  currentColumn={sortColumn}
                  direction={sortDirection}
                  onSort={setSort}
                />
                <SortableHeader
                  label="Tech"
                  column="techBase"
                  currentColumn={sortColumn}
                  direction={sortDirection}
                  onSort={setSort}
                />
                <SortableHeader
                  label="Weight"
                  column="weight"
                  currentColumn={sortColumn}
                  direction={sortDirection}
                  onSort={setSort}
                />
                <SortableHeader
                  label="Crits"
                  column="criticalSlots"
                  currentColumn={sortColumn}
                  direction={sortDirection}
                  onSort={setSort}
                />
                <th className="px-3 py-2">Damage</th>
                <th className="px-3 py-2">Heat</th>
                <th className="px-3 py-2 w-20">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEquipment.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-3 py-8 text-center text-slate-400">
                    No equipment found
                  </td>
                </tr>
              ) : (
                paginatedEquipment.map((equipment) => (
                  <EquipmentRow
                    key={equipment.id}
                    equipment={equipment}
                    onAdd={() => onAddEquipment(equipment)}
                  />
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
      
      {/* Pagination */}
      <div className="px-4 py-3 border-t border-slate-700 flex items-center justify-between">
        <div className="text-sm text-slate-400">
          Showing {paginatedEquipment.length} of {totalItems} items
        </div>
        <PaginationButtons
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}

/**
 * Sortable table header
 */
interface SortableHeaderProps {
  label: string;
  column: SortColumn;
  currentColumn: SortColumn;
  direction: 'asc' | 'desc';
  onSort: (column: SortColumn) => void;
}

function SortableHeader({
  label,
  column,
  currentColumn,
  direction,
  onSort,
}: SortableHeaderProps) {
  const isActive = column === currentColumn;
  
  return (
    <th
      className="px-3 py-2 cursor-pointer hover:text-white transition-colors"
      onClick={() => onSort(column)}
    >
      <span className="flex items-center gap-1">
        {label}
        {isActive && (
          <span className="text-amber-400">
            {direction === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </span>
    </th>
  );
}

