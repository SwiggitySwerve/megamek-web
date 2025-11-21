/**
 * Optimized Equipment List Component
 * Demonstrates integration of performance optimizations
 */

import React, { useMemo } from 'react'
import { 
  useOptimizedEquipmentList, 
  withPerformanceOptimization,
  PerformanceMonitor 
} from '../../utils/performance/PerformanceOptimizer'
import { IEquipment } from '../../types/core/EquipmentInterfaces'

interface OptimizedEquipmentListProps {
  equipment: IEquipment[]
  filterByTechBase?: (item: IEquipment) => boolean
  sortByName?: (a: IEquipment, b: IEquipment) => number
  onEquipmentSelect?: (equipment: IEquipment) => void
  selectedEquipmentId?: string | null
}

// CRITICAL: Base equipment list component with performance monitoring
function EquipmentListBase({
  equipment,
  filterByTechBase,
  sortByName,
  onEquipmentSelect,
  selectedEquipmentId
}: OptimizedEquipmentListProps) {
  
  // CRITICAL: Use optimized equipment list hook
  const { 
    equipment: visibleEquipment, 
    loadMore, 
    hasMore, 
    isLoading,
    totalCount 
  } = useOptimizedEquipmentList(
    equipment,
    filterByTechBase,
    sortByName
  )

  // CRITICAL: Memoize equipment items to prevent unnecessary re-renders
  const equipmentItems = useMemo(() => {
    return visibleEquipment.map(item => (
      <EquipmentItem
        key={item.name}
        item={item}
        isSelected={selectedEquipmentId === item.id}
        onSelect={() => onEquipmentSelect?.(item)}
      />
    ))
  }, [visibleEquipment, selectedEquipmentId, onEquipmentSelect])

  return (
    <div className="optimized-equipment-list">
      <div className="equipment-header">
        <h3>Equipment ({totalCount} total)</h3>
        <span className="visible-count">
          Showing {visibleEquipment.length} of {totalCount}
        </span>
      </div>
      
      <div className="equipment-items">
        {equipmentItems}
      </div>
      
      {hasMore && (
        <div className="load-more-container">
          <button 
            onClick={loadMore} 
            disabled={isLoading}
            className="load-more-button"
          >
            {isLoading ? 'Loading...' : `Load More (${totalCount - visibleEquipment.length} remaining)`}
          </button>
        </div>
      )}
    </div>
  )
}

// CRITICAL: Individual equipment item component
function EquipmentItem({
  item,
  isSelected,
  onSelect
}: {
  item: IEquipment
  isSelected: boolean
  onSelect: () => void
}) {
  return (
    <div 
      className={`equipment-item ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
    >
      <div className="equipment-name">{item.name}</div>
      <div className="equipment-details">
        <span className="equipment-type">{item.type}</span>
        <span className="equipment-tech-base">{item.techBase}</span>
      </div>
    </div>
  )
}

// CRITICAL: Performance-optimized equipment list with monitoring
const OptimizedEquipmentList = withPerformanceOptimization(
  (props: OptimizedEquipmentListProps) => (
    <PerformanceMonitor componentName="OptimizedEquipmentList">
      <EquipmentListBase {...props} />
    </PerformanceMonitor>
  ),
  {
    enableMemoization: true,
    enableLazyLoading: true,
    debounceDelay: 300
  }
)

export default OptimizedEquipmentList 