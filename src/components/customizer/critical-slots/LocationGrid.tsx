/**
 * Location Grid Component
 * 
 * Grid of critical slots for a single location.
 * 
 * @spec openspec/specs/critical-slots-display/spec.md
 */

import React from 'react';
import { SlotRow } from './SlotRow';
import { MechLocation, LOCATION_SLOT_COUNTS } from '@/types/construction';
import { LocationData, SlotContent } from './CriticalSlotsDisplay';

/**
 * Get short location label
 */
function getLocationLabel(location: MechLocation): string {
  switch (location) {
    case MechLocation.HEAD: return 'Head';
    case MechLocation.CENTER_TORSO: return 'CT';
    case MechLocation.LEFT_TORSO: return 'LT';
    case MechLocation.RIGHT_TORSO: return 'RT';
    case MechLocation.LEFT_ARM: return 'LA';
    case MechLocation.RIGHT_ARM: return 'RA';
    case MechLocation.LEFT_LEG: return 'LL';
    case MechLocation.RIGHT_LEG: return 'RL';
    default: return '';
  }
}

interface LocationGridProps {
  /** Location */
  location: MechLocation;
  /** Location data */
  data?: LocationData;
  /** Currently selected equipment ID */
  selectedEquipmentId?: string;
  /** Slots that can accept selected equipment */
  assignableSlots: number[];
  /** Called when slot is clicked */
  onSlotClick: (slotIndex: number) => void;
  /** Called when equipment is dropped */
  onEquipmentDrop: (slotIndex: number, equipmentId: string) => void;
  /** Called when equipment is removed */
  onEquipmentRemove: (slotIndex: number) => void;
  /** Use compact layout */
  compact?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Grid of slots for a single location
 */
export function LocationGrid({
  location,
  data,
  selectedEquipmentId,
  assignableSlots,
  onSlotClick,
  onEquipmentDrop,
  onEquipmentRemove,
  compact = false,
  className = '',
}: LocationGridProps) {
  const slotCount = LOCATION_SLOT_COUNTS[location];
  const label = getLocationLabel(location);
  
  // Create slot data for all slots
  const slots: SlotContent[] = Array.from({ length: slotCount }, (_, i) => {
    const existing = data?.slots.find((s) => s.index === i);
    return existing || { index: i, type: 'empty' as const };
  });
  
  return (
    <div className={`bg-slate-900 rounded border border-slate-700 ${className}`}>
      {/* Location header */}
      <div className="px-2 py-1 border-b border-slate-700 bg-slate-800">
        <span className="text-xs font-medium text-slate-300">{label}</span>
        <span className="text-xs text-slate-500 ml-1">({slotCount})</span>
      </div>
      
      {/* Slots */}
      <div className={`p-1 ${compact ? 'space-y-0.5' : 'space-y-1'}`}>
        {slots.map((slot) => (
          <SlotRow
            key={slot.index}
            slot={slot}
            isAssignable={assignableSlots.includes(slot.index)}
            isSelected={slot.equipmentId === selectedEquipmentId}
            compact={compact}
            onClick={() => onSlotClick(slot.index)}
            onDrop={(equipmentId) => onEquipmentDrop(slot.index, equipmentId)}
            onRemove={() => onEquipmentRemove(slot.index)}
          />
        ))}
      </div>
    </div>
  );
}

