import type { IArmorAllocation } from '@/types/construction/ArmorAllocation';
import type { IMountedEquipmentInstance } from '@/types/equipment/MountedEquipment';

import { MechLocation } from '@/types/construction/CriticalSlotAllocation';
import { TechBase } from '@/types/enums/TechBase';
import { MechConfiguration } from '@/types/unit/BattleMechInterfaces';

import type {
  IEditableMech,
  IArmorAllocation as IEditableArmorAllocation,
} from './MechBuilderService';

export function buildEditableArmorAllocation(
  armorAllocation: IArmorAllocation,
): IEditableArmorAllocation {
  return {
    head: armorAllocation[MechLocation.HEAD],
    centerTorso: armorAllocation[MechLocation.CENTER_TORSO],
    centerTorsoRear: armorAllocation.centerTorsoRear,
    leftTorso: armorAllocation[MechLocation.LEFT_TORSO],
    leftTorsoRear: armorAllocation.leftTorsoRear,
    rightTorso: armorAllocation[MechLocation.RIGHT_TORSO],
    rightTorsoRear: armorAllocation.rightTorsoRear,
    leftArm: armorAllocation[MechLocation.LEFT_ARM],
    rightArm: armorAllocation[MechLocation.RIGHT_ARM],
    leftLeg: armorAllocation[MechLocation.LEFT_LEG],
    rightLeg: armorAllocation[MechLocation.RIGHT_LEG],
    frontLeftLeg: armorAllocation[MechLocation.FRONT_LEFT_LEG] ?? 0,
    frontRightLeg: armorAllocation[MechLocation.FRONT_RIGHT_LEG] ?? 0,
    rearLeftLeg: armorAllocation[MechLocation.REAR_LEFT_LEG] ?? 0,
    rearRightLeg: armorAllocation[MechLocation.REAR_RIGHT_LEG] ?? 0,
    centerLeg: armorAllocation[MechLocation.CENTER_LEG] ?? 0,
  };
}

export interface IEditableMechProjectionInput {
  readonly name: string;
  readonly chassis: string;
  readonly model: string;
  readonly tonnage: number;
  readonly configuration: MechConfiguration;
  readonly techBase: string;
  readonly engineType: IEditableMech['engineType'];
  readonly engineRating: number;
  readonly internalStructureType: IEditableMech['structureType'];
  readonly gyroType: IEditableMech['gyroType'];
  readonly cockpitType: IEditableMech['cockpitType'];
  readonly armorType: IEditableMech['armorType'];
  readonly armorAllocation: IArmorAllocation;
  readonly heatSinkType: IEditableMech['heatSinkType'];
  readonly heatSinkCount: number;
  readonly equipment: readonly IMountedEquipmentInstance[];
}

/** Shared construction-service projection for editor summaries and record sheets. */
export function projectEditableMech(
  state: IEditableMechProjectionInput,
  walkMP: number,
  id = 'preview',
): IEditableMech {
  return {
    id,
    chassis: state.chassis || state.name.split(' ')[0] || 'Unknown',
    variant:
      state.model || state.name.split(' ').slice(1).join(' ') || 'Custom',
    tonnage: state.tonnage,
    configuration: state.configuration,
    techBase: state.techBase as TechBase,
    engineType: state.engineType,
    engineRating: state.engineRating,
    walkMP,
    structureType: state.internalStructureType,
    gyroType: state.gyroType,
    cockpitType: state.cockpitType,
    armorType: state.armorType,
    armorAllocation: buildEditableArmorAllocation(state.armorAllocation),
    heatSinkType: state.heatSinkType,
    heatSinkCount: state.heatSinkCount,
    equipment: state.equipment.map((item) => ({
      equipmentId: item.equipmentId,
      location: item.location ?? '',
      slotIndex: item.slots?.[0] ?? 0,
    })),
    isDirty: false,
  };
}
