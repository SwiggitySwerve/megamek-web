import { EditableUnit } from '../../types/editor';
import { UnitData } from '../../types/index';

/**
 * Safely updates a top-level property of UnitData within an EditableUnit.
 * Handles undefined checks for unit.data.
 * 
 * Use this for updating primitive fields like 'mass', 'era', etc., 
 * or for replacing entire objects.
 */
export function updateUnitData(unit: EditableUnit, updates: Partial<UnitData>): EditableUnit {
  return {
    ...unit,
    data: {
      ...(unit.data || {}),
      ...updates
    }
  };
}

/**
 * Safely updates a nested system configuration (like engine, gyro, etc.) 
 * within UnitData. Handles undefined checks for unit.data and the system property.
 * 
 * Use this when you want to merge updates into an existing system object
 * rather than replacing it entirely.
 * 
 * @param unit The unit to update
 * @param systemKey The key of the system in UnitData (e.g., 'engine', 'gyro')
 * @param updates The partial updates to apply to that system
 */
export function updateUnitSystem<K extends keyof UnitData>(
  unit: EditableUnit, 
  systemKey: K, 
  updates: Partial<NonNullable<UnitData[K]>>
): EditableUnit {
  const currentData = unit.data || {};
  const currentSystem = currentData[systemKey];
  
  // If the current system value is an object, we spread it. 
  // If it's undefined, we default to empty object.
  // If it's a primitive (which shouldn't happen for system updates usually), this logic might need adjustment,
  // but for standard systems (engine, gyro, etc.) this works.
  
  let newSystemValue: any;

  if (typeof currentSystem === 'object' && currentSystem !== null) {
    newSystemValue = {
      ...currentSystem,
      ...updates
    };
  } else {
    // If it was null/undefined, or a primitive we are promoting/initializing
    newSystemValue = {
      ...updates
    };
  }

  return {
    ...unit,
    data: {
      ...currentData,
      [systemKey]: newSystemValue
    }
  };
}

