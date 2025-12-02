/**
 * Slot Row Component
 * 
 * Single critical slot display with drag-and-drop support.
 * 
 * @spec openspec/specs/critical-slots-display/spec.md
 */

import React, { useState, memo } from 'react';
import { SlotContent } from './CriticalSlotsDisplay';
import { 
  getSlotColors, 
  classifySystemComponent,
  isUnhittableComponent,
} from '@/utils/colors/slotColors';
import { 
  classifyEquipment, 
  getEquipmentColors 
} from '@/utils/colors/equipmentColors';

interface SlotRowProps {
  /** Slot data */
  slot: SlotContent;
  /** Is this slot assignable (can accept equipment) */
  isAssignable: boolean;
  /** Is this slot's equipment selected */
  isSelected: boolean;
  /** Use compact display */
  compact?: boolean;
  /** Click handler */
  onClick: () => void;
  /** Drop handler */
  onDrop: (equipmentId: string) => void;
  /** Remove handler */
  onRemove: () => void;
}

/**
 * Get color classes for slot content
 */
function getSlotContentClasses(slot: SlotContent): string {
  if (slot.type === 'empty') {
    return 'bg-gray-700 border-gray-600 border-dashed text-gray-400';
  }
  
  if (slot.type === 'system' && slot.name) {
    const componentType = classifySystemComponent(slot.name);
    const colors = getSlotColors(componentType);
    // Unhittable components use dashed border (already in color definition)
    return `${colors.bg} ${colors.border} ${colors.text}`;
  }
  
  if (slot.type === 'equipment' && slot.name) {
    const colorType = classifyEquipment(slot.name);
    const colors = getEquipmentColors(colorType);
    return `${colors.bg} ${colors.border} ${colors.text} border-solid`;
  }
  
  return 'bg-slate-700 border-slate-600 text-slate-300';
}

/**
 * Check if a slot contains an unhittable component (Endo Steel, Ferro-Fibrous)
 */
function isUnhittableSlot(slot: SlotContent): boolean {
  if (slot.type !== 'system' || !slot.name) return false;
  const componentType = classifySystemComponent(slot.name);
  return isUnhittableComponent(componentType);
}

/**
 * Single critical slot row
 * Memoized for performance with many slots
 */
export const SlotRow = memo(function SlotRow({
  slot,
  isAssignable,
  isSelected,
  compact = false,
  onClick,
  onDrop,
  onRemove,
}: SlotRowProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  
  const contentClasses = getSlotContentClasses(slot);
  
  // Build dynamic classes
  let dynamicClasses = '';
  if (isAssignable && !slot.name) {
    dynamicClasses = 'bg-green-900/50 border-green-500';
  }
  if (isDragOver) {
    dynamicClasses = slot.type === 'empty' 
      ? 'bg-green-900/70 border-green-400 scale-[1.02]'
      : 'bg-red-900/70 border-red-400';
  }
  if (isSelected) {
    dynamicClasses += ' ring-2 ring-yellow-400 ring-offset-1 ring-offset-slate-900';
  }
  
  // Handle drag events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  
  const handleDragLeave = () => {
    setIsDragOver(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const equipmentId = e.dataTransfer.getData('text/equipment-id');
    if (equipmentId && slot.type === 'empty') {
      onDrop(equipmentId);
    }
  };
  
  const handleDoubleClick = () => {
    if (slot.isRemovable) {
      onRemove();
    }
  };
  
  // Determine display name
  let displayName = slot.name;
  if (slot.type === 'empty') {
    displayName = `[${slot.index + 1}]`;
  } else if (slot.isFirstSlot && slot.totalSlots && slot.totalSlots > 1) {
    displayName = `${slot.name} (${slot.totalSlots})`;
  } else if (!slot.isFirstSlot && !slot.isLastSlot && slot.name) {
    displayName = '│'; // Continuation marker
  }
  
  // Border radius for multi-slot equipment
  let borderRadius = 'rounded';
  if (slot.isFirstSlot && slot.totalSlots && slot.totalSlots > 1) {
    borderRadius = 'rounded-t rounded-b-none';
  } else if (slot.isLastSlot) {
    borderRadius = 'rounded-b rounded-t-none';
  } else if (slot.totalSlots && slot.totalSlots > 1 && !slot.isFirstSlot && !slot.isLastSlot) {
    borderRadius = 'rounded-none';
  }
  
  return (
    <div
      role="gridcell"
      tabIndex={0}
      aria-label={slot.name ? `Slot ${slot.index + 1}: ${slot.name}` : `Empty slot ${slot.index + 1}`}
      aria-selected={isSelected}
      className={`
        relative flex items-center border transition-all cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-inset
        ${contentClasses}
        ${dynamicClasses}
        ${borderRadius}
        ${compact ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-sm'}
      `}
      onClick={onClick}
      onDoubleClick={handleDoubleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        } else if (e.key === 'Delete' || e.key === 'Backspace') {
          if (slot.isRemovable) {
            e.preventDefault();
            onRemove();
          }
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <span className="truncate flex-1">{displayName}</span>
      
      {/* Remove button */}
      {isHovered && slot.isRemovable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute right-1 w-4 h-4 flex items-center justify-center bg-red-600 hover:bg-red-500 rounded text-white text-xs transition-colors"
          title="Remove"
        >
          ×
        </button>
      )}
    </div>
  );
});

