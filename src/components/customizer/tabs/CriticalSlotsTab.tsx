/**
 * Critical Slots Tab Component
 * 
 * Displays the critical slots grid for assigning equipment to locations.
 * Shows fixed system components and allows assigning equipment from the loadout.
 * 
 * @spec openspec/specs/critical-slots-display/spec.md
 * @spec openspec/specs/critical-slot-allocation/spec.md
 */

import React, { useMemo, useCallback, useState } from 'react';
import { useUnitStore } from '@/stores/useUnitStore';
import { useCustomizerStore } from '@/stores/useCustomizerStore';
import { 
  CriticalSlotsDisplay, 
  LocationData, 
  SlotContent 
} from '../critical-slots';
import { MechLocation, LOCATION_SLOT_COUNTS } from '@/types/construction';
import { EquipmentCategory } from '@/types/equipment';
import { IMountedEquipmentInstance } from '@/stores/unitState';
import { SystemComponentType } from '@/utils/colors/slotColors';
import { EngineType, getEngineDefinition } from '@/types/construction/EngineType';
import { GyroType, getGyroDefinition } from '@/types/construction/GyroType';

// =============================================================================
// Types
// =============================================================================

interface CriticalSlotsTabProps {
  /** Read-only mode */
  readOnly?: boolean;
  /** Additional CSS classes */
  className?: string;
}

interface FixedComponent {
  name: string;
  type: SystemComponentType;
  slots: number;
}

// =============================================================================
// Constants
// =============================================================================

/** Fixed components by location */
const HEAD_COMPONENTS: FixedComponent[] = [
  { name: 'Life Support', type: 'lifesupport', slots: 1 },
  { name: 'Sensors', type: 'sensors', slots: 1 },
  { name: 'Cockpit', type: 'cockpit', slots: 1 },
  // Slot 4 empty (can hold equipment)
  { name: 'Sensors', type: 'sensors', slots: 1 },
  { name: 'Life Support', type: 'lifesupport', slots: 1 },
];

/** Arm actuators (fixed positions) */
const ARM_ACTUATORS: FixedComponent[] = [
  { name: 'Shoulder', type: 'actuator', slots: 1 },
  { name: 'Upper Arm', type: 'actuator', slots: 1 },
  { name: 'Lower Arm', type: 'actuator', slots: 1 },
  { name: 'Hand', type: 'actuator', slots: 1 },
];

/** Leg actuators (fixed positions) */
const LEG_ACTUATORS: FixedComponent[] = [
  { name: 'Hip', type: 'actuator', slots: 1 },
  { name: 'Upper Leg', type: 'actuator', slots: 1 },
  { name: 'Lower Leg', type: 'actuator', slots: 1 },
  { name: 'Foot', type: 'actuator', slots: 1 },
];

// =============================================================================
// Helpers
// =============================================================================

/**
 * Get engine CT slots from engine type
 */
function getEngineSlots(engineType: EngineType): number {
  const def = getEngineDefinition(engineType);
  return def?.ctSlots ?? 6;
}

/**
 * Get gyro slots from gyro type
 */
function getGyroSlots(gyroType: GyroType): number {
  const def = getGyroDefinition(gyroType);
  return def?.criticalSlots ?? 4;
}

/**
 * Get equipment color type based on category
 */
function getEquipmentColorType(category: EquipmentCategory): SystemComponentType {
  switch (category) {
    case EquipmentCategory.STRUCTURAL:
      return 'structure';
    default:
      return 'empty'; // Use default for now, equipment colors handled separately
  }
}

/**
 * Build location slots for a given location
 */
function buildLocationSlots(
  location: MechLocation,
  engineType: EngineType,
  engineRating: number,
  gyroType: GyroType,
  equipment: readonly IMountedEquipmentInstance[],
): SlotContent[] {
  const slotCount = LOCATION_SLOT_COUNTS[location] || 6;
  const slots: SlotContent[] = [];
  
  // Get equipment assigned to this location
  const locationEquipment = equipment.filter(e => e.location === location);
  
  // Track which slots are filled
  const filledSlots = new Map<number, { equipment: IMountedEquipmentInstance; position: 'first' | 'middle' | 'last' | 'only' }>();
  
  for (const eq of locationEquipment) {
    if (eq.slots && eq.slots.length > 0) {
      for (let i = 0; i < eq.slots.length; i++) {
        const slotIdx = eq.slots[i];
        let position: 'first' | 'middle' | 'last' | 'only' = 'only';
        if (eq.slots.length > 1) {
          if (i === 0) position = 'first';
          else if (i === eq.slots.length - 1) position = 'last';
          else position = 'middle';
        }
        filledSlots.set(slotIdx, { equipment: eq, position });
      }
    }
  }
  
  // Build slots based on location type
  switch (location) {
    case MechLocation.HEAD:
      // Head has fixed cockpit components
      slots.push({ index: 0, type: 'system', name: 'Life Support' });
      slots.push({ index: 1, type: 'system', name: 'Sensors' });
      slots.push({ index: 2, type: 'system', name: 'Cockpit' });
      // Slot 3 can have equipment or be empty
      slots.push(filledSlots.has(3) 
        ? createEquipmentSlot(3, filledSlots.get(3)!)
        : { index: 3, type: 'empty' }
      );
      slots.push({ index: 4, type: 'system', name: 'Sensors' });
      slots.push({ index: 5, type: 'system', name: 'Life Support' });
      break;
      
    case MechLocation.CENTER_TORSO:
      // Engine slots first
      const engineSlots = getEngineSlots(engineType);
      for (let i = 0; i < engineSlots; i++) {
        slots.push({ 
          index: i, 
          type: 'system', 
          name: i === 0 ? 'Engine' : '',
          isFirstSlot: i === 0,
          isLastSlot: i === engineSlots - 1,
          totalSlots: engineSlots,
        });
      }
      
      // Gyro slots next
      const gyroSlots = getGyroSlots(gyroType);
      for (let i = 0; i < gyroSlots; i++) {
        const slotIdx = engineSlots + i;
        slots.push({ 
          index: slotIdx, 
          type: 'system', 
          name: i === 0 ? 'Gyro' : '',
          isFirstSlot: i === 0,
          isLastSlot: i === gyroSlots - 1,
          totalSlots: gyroSlots,
        });
      }
      
      // Remaining slots are for equipment or empty
      const ctUsed = engineSlots + gyroSlots;
      for (let i = ctUsed; i < slotCount; i++) {
        if (filledSlots.has(i)) {
          slots.push(createEquipmentSlot(i, filledSlots.get(i)!));
        } else {
          slots.push({ index: i, type: 'empty' });
        }
      }
      break;
      
    case MechLocation.LEFT_TORSO:
    case MechLocation.RIGHT_TORSO:
      // Side torsos have no fixed components, all equipment or empty
      for (let i = 0; i < slotCount; i++) {
        if (filledSlots.has(i)) {
          slots.push(createEquipmentSlot(i, filledSlots.get(i)!));
        } else {
          slots.push({ index: i, type: 'empty' });
        }
      }
      break;
      
    case MechLocation.LEFT_ARM:
    case MechLocation.RIGHT_ARM:
      // Arms have actuators in first 4 slots
      for (let i = 0; i < ARM_ACTUATORS.length; i++) {
        slots.push({ index: i, type: 'system', name: ARM_ACTUATORS[i].name });
      }
      // Remaining slots for equipment
      for (let i = ARM_ACTUATORS.length; i < slotCount; i++) {
        if (filledSlots.has(i)) {
          slots.push(createEquipmentSlot(i, filledSlots.get(i)!));
        } else {
          slots.push({ index: i, type: 'empty' });
        }
      }
      break;
      
    case MechLocation.LEFT_LEG:
    case MechLocation.RIGHT_LEG:
      // Legs have actuators in first 4 slots
      for (let i = 0; i < LEG_ACTUATORS.length; i++) {
        slots.push({ index: i, type: 'system', name: LEG_ACTUATORS[i].name });
      }
      // Remaining slots for equipment (legs have 6 slots, so 2 available)
      for (let i = LEG_ACTUATORS.length; i < slotCount; i++) {
        if (filledSlots.has(i)) {
          slots.push(createEquipmentSlot(i, filledSlots.get(i)!));
        } else {
          slots.push({ index: i, type: 'empty' });
        }
      }
      break;
      
    default:
      // Fallback: all empty
      for (let i = 0; i < slotCount; i++) {
        slots.push({ index: i, type: 'empty' });
      }
  }
  
  return slots;
}

/**
 * Create a slot content entry for equipment
 */
function createEquipmentSlot(
  index: number, 
  data: { equipment: IMountedEquipmentInstance; position: 'first' | 'middle' | 'last' | 'only' }
): SlotContent {
  const { equipment, position } = data;
  return {
    index,
    type: 'equipment',
    name: position === 'first' || position === 'only' ? equipment.name : '',
    equipmentId: equipment.instanceId,
    isFirstSlot: position === 'first' || position === 'only',
    isLastSlot: position === 'last' || position === 'only',
    totalSlots: equipment.criticalSlots,
    isRemovable: equipment.isRemovable,
  };
}

// =============================================================================
// Unallocated Equipment Panel
// =============================================================================

interface UnallocatedPanelProps {
  equipment: readonly IMountedEquipmentInstance[];
  selectedId: string | null;
  onSelect: (instanceId: string) => void;
}

function UnallocatedPanel({ equipment, selectedId, onSelect }: UnallocatedPanelProps) {
  // Group by category
  const grouped = useMemo(() => {
    const groups: Record<string, IMountedEquipmentInstance[]> = {};
    for (const eq of equipment) {
      const cat = eq.category || 'Other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(eq);
    }
    return groups;
  }, [equipment]);
  
  const categories = Object.keys(grouped).sort();
  
  if (equipment.length === 0) {
    return (
      <div className="text-slate-500 text-sm text-center py-8">
        All equipment has been assigned to slots.
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {categories.map(category => (
        <div key={category}>
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
            {category} ({grouped[category].length})
          </div>
          <div className="space-y-1">
            {grouped[category].map(eq => (
              <button
                key={eq.instanceId}
                onClick={() => onSelect(eq.instanceId)}
                className={`
                  w-full text-left px-2 py-1.5 rounded text-sm transition-colors
                  ${selectedId === eq.instanceId
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                  }
                `}
              >
                <div className="flex justify-between items-center">
                  <span className="truncate">{eq.name}</span>
                  <span className="text-xs opacity-70 ml-2">{eq.criticalSlots} slot{eq.criticalSlots !== 1 ? 's' : ''}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function CriticalSlotsTab({
  readOnly = false,
  className = '',
}: CriticalSlotsTabProps) {
  // Unit state
  const equipment = useUnitStore((s) => s.equipment);
  const engineType = useUnitStore((s) => s.engineType);
  const engineRating = useUnitStore((s) => s.engineRating);
  const gyroType = useUnitStore((s) => s.gyroType);
  const updateEquipmentLocation = useUnitStore((s) => s.updateEquipmentLocation);
  const clearEquipmentLocation = useUnitStore((s) => s.clearEquipmentLocation);
  
  // UI state
  const autoModeSettings = useCustomizerStore((s) => s.autoModeSettings);
  const toggleAutoFillUnhittables = useCustomizerStore((s) => s.toggleAutoFillUnhittables);
  const toggleShowPlacementPreview = useCustomizerStore((s) => s.toggleShowPlacementPreview);
  
  // Local state for selected equipment
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);
  
  // Get unallocated equipment (has no location assigned)
  const unallocatedEquipment = useMemo(() => {
    return equipment.filter(e => e.location === undefined);
  }, [equipment]);
  
  // Get selected equipment item
  const selectedEquipment = useMemo(() => {
    if (!selectedEquipmentId) return null;
    return equipment.find(e => e.instanceId === selectedEquipmentId) || null;
  }, [equipment, selectedEquipmentId]);
  
  // Build location data for display
  const locations: LocationData[] = useMemo(() => {
    const allLocations = [
      MechLocation.HEAD,
      MechLocation.CENTER_TORSO,
      MechLocation.LEFT_TORSO,
      MechLocation.RIGHT_TORSO,
      MechLocation.LEFT_ARM,
      MechLocation.RIGHT_ARM,
      MechLocation.LEFT_LEG,
      MechLocation.RIGHT_LEG,
    ];
    
    return allLocations.map(location => ({
      location,
      slots: buildLocationSlots(location, engineType, engineRating, gyroType, equipment),
    }));
  }, [equipment, engineType, engineRating, gyroType]);
  
  // Calculate assignable slots for selected equipment
  const assignableSlots = useMemo(() => {
    if (!selectedEquipment || readOnly) return [];
    
    const slotsNeeded = selectedEquipment.criticalSlots;
    const result: { location: MechLocation; slots: number[] }[] = [];
    
    for (const locData of locations) {
      const emptySlots = locData.slots
        .filter(s => s.type === 'empty')
        .map(s => s.index);
      
      // Find contiguous runs that can fit the equipment
      const assignable: number[] = [];
      for (let i = 0; i <= emptySlots.length - slotsNeeded; i++) {
        // Check if we have enough contiguous slots
        let contiguous = true;
        for (let j = 0; j < slotsNeeded; j++) {
          if (j > 0 && emptySlots[i + j] !== emptySlots[i + j - 1] + 1) {
            contiguous = false;
            break;
          }
        }
        if (contiguous) {
          assignable.push(emptySlots[i]);
        }
      }
      
      if (assignable.length > 0) {
        result.push({ location: locData.location, slots: assignable });
      }
    }
    
    return result;
  }, [selectedEquipment, locations, readOnly]);
  
  // Handle slot click
  const handleSlotClick = useCallback((location: MechLocation, slotIndex: number) => {
    if (readOnly || !selectedEquipment) return;
    
    // Check if this slot is assignable
    const locAssignable = assignableSlots.find(a => a.location === location);
    if (!locAssignable || !locAssignable.slots.includes(slotIndex)) return;
    
    // Assign equipment to consecutive slots starting at slotIndex
    const slots: number[] = [];
    for (let i = 0; i < selectedEquipment.criticalSlots; i++) {
      slots.push(slotIndex + i);
    }
    
    updateEquipmentLocation(selectedEquipment.instanceId, location, slots);
    setSelectedEquipmentId(null);
  }, [readOnly, selectedEquipment, assignableSlots, updateEquipmentLocation]);
  
  // Handle equipment drop (drag and drop)
  const handleEquipmentDrop = useCallback((location: MechLocation, slotIndex: number, equipmentId: string) => {
    if (readOnly) return;
    
    const eq = equipment.find(e => e.instanceId === equipmentId);
    if (!eq) return;
    
    const slots: number[] = [];
    for (let i = 0; i < eq.criticalSlots; i++) {
      slots.push(slotIndex + i);
    }
    
    updateEquipmentLocation(equipmentId, location, slots);
  }, [readOnly, equipment, updateEquipmentLocation]);
  
  // Handle equipment removal
  const handleEquipmentRemove = useCallback((location: MechLocation, slotIndex: number) => {
    if (readOnly) return;
    
    // Find equipment at this slot
    const locData = locations.find(l => l.location === location);
    if (!locData) return;
    
    const slot = locData.slots.find(s => s.index === slotIndex);
    if (!slot || slot.type !== 'equipment' || !slot.equipmentId) return;
    if (!slot.isRemovable) return;
    
    clearEquipmentLocation(slot.equipmentId);
  }, [readOnly, locations, clearEquipmentLocation]);
  
  // Handle toolbar actions
  const handleToolbarAction = useCallback((action: 'fill' | 'compact' | 'sort' | 'reset') => {
    if (readOnly) return;
    
    switch (action) {
      case 'fill':
        // TODO: Auto-fill unhittable slots
        console.log('Fill action not yet implemented');
        break;
      case 'compact':
        // TODO: Compact equipment to lowest slots
        console.log('Compact action not yet implemented');
        break;
      case 'sort':
        // TODO: Sort equipment by type
        console.log('Sort action not yet implemented');
        break;
      case 'reset':
        // Clear all equipment locations
        for (const eq of equipment) {
          if (eq.location !== undefined && eq.isRemovable) {
            clearEquipmentLocation(eq.instanceId);
          }
        }
        break;
    }
  }, [readOnly, equipment, clearEquipmentLocation]);
  
  return (
    <div className={`flex h-full gap-4 p-4 ${className}`}>
      {/* Main critical slots grid */}
      <div className="flex-1 min-w-0">
        <CriticalSlotsDisplay
          locations={locations}
          selectedEquipmentId={selectedEquipmentId || undefined}
          assignableSlots={assignableSlots}
          autoFillUnhittables={autoModeSettings.autoFillUnhittables}
          showPlacementPreview={autoModeSettings.showPlacementPreview}
          onSlotClick={handleSlotClick}
          onEquipmentDrop={handleEquipmentDrop}
          onEquipmentRemove={handleEquipmentRemove}
          onAutoFillToggle={toggleAutoFillUnhittables}
          onPreviewToggle={toggleShowPlacementPreview}
          onToolbarAction={handleToolbarAction}
          className="h-full"
        />
      </div>
      
      {/* Unallocated equipment sidebar */}
      <div className="w-64 flex-shrink-0">
        <div className="bg-slate-800 rounded-lg border border-slate-700 h-full flex flex-col">
          <div className="px-4 py-3 border-b border-slate-700">
            <h3 className="font-medium text-white">Unallocated Equipment</h3>
            <p className="text-xs text-slate-400 mt-1">
              {unallocatedEquipment.length} item{unallocatedEquipment.length !== 1 ? 's' : ''} to assign
            </p>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            <UnallocatedPanel
              equipment={unallocatedEquipment}
              selectedId={selectedEquipmentId}
              onSelect={setSelectedEquipmentId}
            />
          </div>
          {selectedEquipment && (
            <div className="px-4 py-3 border-t border-slate-700 bg-slate-700/50">
              <div className="text-sm text-slate-300">
                Selected: <span className="text-amber-400 font-medium">{selectedEquipment.name}</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Click a highlighted slot to assign
              </div>
            </div>
          )}
        </div>
      </div>
      
      {readOnly && (
        <div className="absolute bottom-4 left-4 right-4 bg-blue-900/30 border border-blue-700 rounded-lg p-4 text-blue-300 text-sm">
          This unit is in read-only mode. Changes cannot be made.
        </div>
      )}
    </div>
  );
}

export default CriticalSlotsTab;

