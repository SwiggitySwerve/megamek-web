/**
 * Critical Slots Tab Component
 * 
 * Displays the critical slots grid for assigning equipment to locations.
 * Layout matches MegaMekLab's diagram style with proper humanoid mech positioning.
 * 
 * @spec openspec/specs/critical-slots-display/spec.md
 * @spec openspec/specs/critical-slot-allocation/spec.md
 */

import React, { useMemo, useCallback, useState } from 'react';
import { useUnitStore } from '@/stores/useUnitStore';
import { useCustomizerStore } from '@/stores/useCustomizerStore';
import { LocationData, SlotContent } from '../critical-slots';
import { LocationGrid } from '../critical-slots/LocationGrid';
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

function getEngineSlots(engineType: EngineType): number {
  const def = getEngineDefinition(engineType);
  return def?.ctSlots ?? 6;
}

function getGyroSlots(gyroType: GyroType): number {
  const def = getGyroDefinition(gyroType);
  return def?.criticalSlots ?? 4;
}

function buildLocationSlots(
  location: MechLocation,
  engineType: EngineType,
  gyroType: GyroType,
  equipment: readonly IMountedEquipmentInstance[],
): SlotContent[] {
  const slotCount = LOCATION_SLOT_COUNTS[location] || 6;
  const slots: SlotContent[] = [];
  
  const locationEquipment = equipment.filter(e => e.location === location);
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
  
  switch (location) {
    case MechLocation.HEAD:
      slots.push({ index: 0, type: 'system', name: 'Life Support' });
      slots.push({ index: 1, type: 'system', name: 'Sensors' });
      slots.push({ index: 2, type: 'system', name: 'Standard Cockpit' });
      slots.push(filledSlots.has(3) 
        ? createEquipmentSlot(3, filledSlots.get(3)!)
        : { index: 3, type: 'empty' }
      );
      slots.push({ index: 4, type: 'system', name: 'Sensors' });
      slots.push({ index: 5, type: 'system', name: 'Life Support' });
      break;
      
    case MechLocation.CENTER_TORSO:
      const engineSlots = getEngineSlots(engineType);
      // First 3 engine slots
      for (let i = 0; i < Math.min(3, engineSlots); i++) {
        slots.push({ index: i, type: 'system', name: 'Engine' });
      }
      // Gyro slots
      const gyroSlots = getGyroSlots(gyroType);
      for (let i = 0; i < gyroSlots; i++) {
        slots.push({ index: 3 + i, type: 'system', name: 'Standard Gyro' });
      }
      // Remaining engine slots after gyro
      for (let i = 3; i < engineSlots; i++) {
        slots.push({ index: 3 + gyroSlots + (i - 3), type: 'system', name: 'Engine' });
      }
      // Remaining slots for equipment
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
      for (let i = 0; i < ARM_ACTUATORS.length; i++) {
        slots.push({ index: i, type: 'system', name: ARM_ACTUATORS[i].name });
      }
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
      for (let i = 0; i < LEG_ACTUATORS.length; i++) {
        slots.push({ index: i, type: 'system', name: LEG_ACTUATORS[i].name });
      }
      for (let i = LEG_ACTUATORS.length; i < slotCount; i++) {
        if (filledSlots.has(i)) {
          slots.push(createEquipmentSlot(i, filledSlots.get(i)!));
        } else {
          slots.push({ index: i, type: 'empty' });
        }
      }
      break;
      
    default:
      for (let i = 0; i < slotCount; i++) {
        slots.push({ index: i, type: 'empty' });
      }
  }
  
  return slots;
}

function createEquipmentSlot(
  index: number, 
  data: { equipment: IMountedEquipmentInstance; position: 'first' | 'middle' | 'last' | 'only' }
): SlotContent {
  const { equipment, position } = data;
  return {
    index,
    type: 'equipment',
    name: equipment.name,
    equipmentId: equipment.instanceId,
    isFirstSlot: position === 'first' || position === 'only',
    isLastSlot: position === 'last' || position === 'only',
    totalSlots: equipment.criticalSlots,
    isRemovable: equipment.isRemovable,
  };
}

// =============================================================================
// Toolbar Component
// =============================================================================

interface ToolbarProps {
  autoFillUnhittables: boolean;
  autoCompact: boolean;
  autoSort: boolean;
  onAutoFillToggle: () => void;
  onAutoCompactToggle: () => void;
  onAutoSortToggle: () => void;
  onFill: () => void;
  onCompact: () => void;
  onSort: () => void;
  onReset: () => void;
  readOnly: boolean;
}

function CriticalSlotsToolbar({
  autoFillUnhittables,
  autoCompact,
  autoSort,
  onAutoFillToggle,
  onAutoCompactToggle,
  onAutoSortToggle,
  onFill,
  onCompact,
  onSort,
  onReset,
  readOnly,
}: ToolbarProps) {
  const toggleBtnClass = (active: boolean) => `
    px-3 py-1.5 text-sm font-medium rounded border transition-colors
    ${active 
      ? 'bg-teal-600 border-teal-500 text-white' 
      : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
    }
    ${readOnly ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
  `;
  
  const actionBtnClass = `
    px-4 py-1.5 text-sm font-medium rounded border transition-colors
    bg-slate-600 border-slate-500 text-white hover:bg-slate-500
    ${readOnly ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
  `;
  
  return (
    <div className="flex items-center gap-2 p-3 bg-slate-800 border-b border-slate-700">
      {/* Auto toggles */}
      <button 
        onClick={onAutoFillToggle} 
        disabled={readOnly}
        className={toggleBtnClass(autoFillUnhittables)}
      >
        Auto Fill Unhittables
      </button>
      <button 
        onClick={onAutoCompactToggle} 
        disabled={readOnly}
        className={toggleBtnClass(autoCompact)}
      >
        Auto Compact
      </button>
      <button 
        onClick={onAutoSortToggle} 
        disabled={readOnly}
        className={toggleBtnClass(autoSort)}
      >
        Auto Sort
      </button>
      
      <div className="w-px h-6 bg-slate-600 mx-2" />
      
      {/* Manual actions */}
      <button onClick={onFill} disabled={readOnly} className={actionBtnClass}>
        Fill
      </button>
      <button onClick={onCompact} disabled={readOnly} className={actionBtnClass}>
        Compact
      </button>
      <button onClick={onSort} disabled={readOnly} className={actionBtnClass}>
        Sort
      </button>
      
      <div className="flex-1" />
      
      <button 
        onClick={onReset} 
        disabled={readOnly}
        className={`${actionBtnClass} bg-slate-700 hover:bg-red-600`}
      >
        Reset
      </button>
    </div>
  );
}

// =============================================================================
// Unallocated Equipment Table
// =============================================================================

interface UnallocatedTableProps {
  equipment: readonly IMountedEquipmentInstance[];
  selectedId: string | null;
  onSelect: (instanceId: string) => void;
}

function UnallocatedEquipmentTable({ equipment, selectedId, onSelect }: UnallocatedTableProps) {
  if (equipment.length === 0) {
    return (
      <div className="text-slate-500 text-sm text-center py-8">
        All equipment assigned
      </div>
    );
  }
  
  return (
    <div className="overflow-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-700 sticky top-0">
          <tr>
            <th className="text-left px-3 py-2 text-slate-300 font-medium">Name</th>
            <th className="text-right px-3 py-2 text-teal-400 font-medium w-16">Tons</th>
            <th className="text-right px-3 py-2 text-slate-300 font-medium w-16">Crits</th>
          </tr>
        </thead>
        <tbody>
          {equipment.map(eq => (
            <tr
              key={eq.instanceId}
              onClick={() => onSelect(eq.instanceId)}
              className={`
                cursor-pointer transition-colors border-b border-slate-700
                ${selectedId === eq.instanceId 
                  ? 'bg-amber-600/30' 
                  : 'hover:bg-slate-700/50'
                }
              `}
            >
              <td className="px-3 py-1.5 text-slate-200">{eq.name}</td>
              <td className="px-3 py-1.5 text-right text-teal-400">{eq.weight.toFixed(1)}</td>
              <td className="px-3 py-1.5 text-right text-slate-300">{eq.criticalSlots}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
  const gyroType = useUnitStore((s) => s.gyroType);
  const updateEquipmentLocation = useUnitStore((s) => s.updateEquipmentLocation);
  const clearEquipmentLocation = useUnitStore((s) => s.clearEquipmentLocation);
  
  // UI state
  const autoModeSettings = useCustomizerStore((s) => s.autoModeSettings);
  const toggleAutoFillUnhittables = useCustomizerStore((s) => s.toggleAutoFillUnhittables);
  
  // Local state
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);
  const [autoCompact, setAutoCompact] = useState(false);
  const [autoSort, setAutoSort] = useState(false);
  
  // Get unallocated equipment
  const unallocatedEquipment = useMemo(() => {
    return equipment.filter(e => e.location === undefined);
  }, [equipment]);
  
  // Get selected equipment item
  const selectedEquipment = useMemo(() => {
    if (!selectedEquipmentId) return null;
    return equipment.find(e => e.instanceId === selectedEquipmentId) || null;
  }, [equipment, selectedEquipmentId]);
  
  // Build location data
  const getLocationData = useCallback((location: MechLocation): LocationData => ({
    location,
    slots: buildLocationSlots(location, engineType, gyroType, equipment),
  }), [equipment, engineType, gyroType]);
  
  // Calculate assignable slots
  const getAssignableSlots = useCallback((location: MechLocation): number[] => {
    if (!selectedEquipment || readOnly) return [];
    
    const locData = getLocationData(location);
    const emptySlots = locData.slots
      .filter(s => s.type === 'empty')
      .map(s => s.index);
    
    const slotsNeeded = selectedEquipment.criticalSlots;
    const assignable: number[] = [];
    
    for (let i = 0; i <= emptySlots.length - slotsNeeded; i++) {
      let contiguous = true;
      for (let j = 1; j < slotsNeeded; j++) {
        if (emptySlots[i + j] !== emptySlots[i + j - 1] + 1) {
          contiguous = false;
          break;
        }
      }
      if (contiguous) {
        assignable.push(emptySlots[i]);
      }
    }
    
    return assignable;
  }, [selectedEquipment, readOnly, getLocationData]);
  
  // Handlers
  const handleSlotClick = useCallback((location: MechLocation, slotIndex: number) => {
    if (readOnly || !selectedEquipment) return;
    
    const assignable = getAssignableSlots(location);
    if (!assignable.includes(slotIndex)) return;
    
    const slots: number[] = [];
    for (let i = 0; i < selectedEquipment.criticalSlots; i++) {
      slots.push(slotIndex + i);
    }
    
    updateEquipmentLocation(selectedEquipment.instanceId, location, slots);
    setSelectedEquipmentId(null);
  }, [readOnly, selectedEquipment, getAssignableSlots, updateEquipmentLocation]);
  
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
  
  const handleEquipmentRemove = useCallback((location: MechLocation, slotIndex: number) => {
    if (readOnly) return;
    const locData = getLocationData(location);
    const slot = locData.slots.find(s => s.index === slotIndex);
    if (!slot || slot.type !== 'equipment' || !slot.equipmentId || !slot.isRemovable) return;
    clearEquipmentLocation(slot.equipmentId);
  }, [readOnly, getLocationData, clearEquipmentLocation]);
  
  const handleReset = useCallback(() => {
    if (readOnly) return;
    for (const eq of equipment) {
      if (eq.location !== undefined && eq.isRemovable) {
        clearEquipmentLocation(eq.instanceId);
      }
    }
  }, [readOnly, equipment, clearEquipmentLocation]);
  
  // Render location grid helper
  const renderLocation = (location: MechLocation) => (
    <LocationGrid
      key={location}
      location={location}
      data={getLocationData(location)}
      selectedEquipmentId={selectedEquipmentId || undefined}
      assignableSlots={getAssignableSlots(location)}
      onSlotClick={(i) => handleSlotClick(location, i)}
      onEquipmentDrop={(i, e) => handleEquipmentDrop(location, i, e)}
      onEquipmentRemove={(i) => handleEquipmentRemove(location, i)}
    />
  );
  
  return (
    <div className={`flex flex-col h-full bg-slate-900 ${className}`}>
      {/* Toolbar */}
      <CriticalSlotsToolbar
        autoFillUnhittables={autoModeSettings.autoFillUnhittables}
        autoCompact={autoCompact}
        autoSort={autoSort}
        onAutoFillToggle={toggleAutoFillUnhittables}
        onAutoCompactToggle={() => setAutoCompact(!autoCompact)}
        onAutoSortToggle={() => setAutoSort(!autoSort)}
        onFill={() => console.log('Fill')}
        onCompact={() => console.log('Compact')}
        onSort={() => console.log('Sort')}
        onReset={handleReset}
        readOnly={readOnly}
      />
      
      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Mech diagram */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="min-w-[800px]">
            {/* Row 1: Left Torso | Head | Right Torso */}
            <div className="grid grid-cols-5 gap-3 mb-3">
              <div className="col-start-2">
                {renderLocation(MechLocation.LEFT_TORSO)}
              </div>
              <div className="flex justify-center">
                {renderLocation(MechLocation.HEAD)}
              </div>
              <div>
                {renderLocation(MechLocation.RIGHT_TORSO)}
              </div>
            </div>
            
            {/* Row 2: Left Arm | Center Torso | Right Arm */}
            <div className="grid grid-cols-5 gap-3 mb-3">
              <div>
                {renderLocation(MechLocation.LEFT_ARM)}
              </div>
              <div className="col-span-3 flex justify-center">
                {renderLocation(MechLocation.CENTER_TORSO)}
              </div>
              <div>
                {renderLocation(MechLocation.RIGHT_ARM)}
              </div>
            </div>
            
            {/* Row 3: Left Leg | Right Leg */}
            <div className="grid grid-cols-5 gap-3">
              <div className="col-start-2 flex justify-center">
                {renderLocation(MechLocation.LEFT_LEG)}
              </div>
              <div />
              <div className="flex justify-center">
                {renderLocation(MechLocation.RIGHT_LEG)}
              </div>
            </div>
          </div>
        </div>
        
        {/* Unallocated Equipment Panel */}
        <div className="w-80 flex-shrink-0 border-l border-slate-700 bg-slate-800 flex flex-col">
          <div className="px-4 py-3 border-b border-slate-700 bg-slate-700">
            <h3 className="font-medium text-white">Unallocated Equipment</h3>
          </div>
          <div className="flex-1 overflow-auto">
            <UnallocatedEquipmentTable
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
                Click a highlighted slot to assign ({selectedEquipment.criticalSlots} slot{selectedEquipment.criticalSlots !== 1 ? 's' : ''})
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CriticalSlotsTab;
