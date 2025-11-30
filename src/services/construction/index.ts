/**
 * Construction Services Exports
 * 
 * @spec openspec/specs/construction-services/spec.md
 */

export { MechBuilderService, mechBuilderService } from './MechBuilderService';
export type { 
  IMechBuilderService, 
  IEditableMech, 
  IArmorAllocation, 
  IEquipmentSlot, 
  IMechChanges 
} from './MechBuilderService';

export { ValidationService, validationService } from './ValidationService';
export type { IValidationService } from './ValidationService';

export { CalculationService, calculationService } from './CalculationService';
export type { 
  ICalculationService, 
  IMechTotals, 
  IHeatProfile, 
  IMovementProfile 
} from './CalculationService';

