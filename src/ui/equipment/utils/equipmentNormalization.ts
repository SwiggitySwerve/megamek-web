import { FullEquipment, IEquipment, SlotEquipment, TechBase } from '../../../types';

const fallbackId = () => `eq-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const mapTechBase = (value: TechBase | 'Inner Sphere' | 'Clan' | 'Mixed' | 'Both' | string | undefined): TechBase | 'Inner Sphere' | 'Clan' => {
  if (value === TechBase.CLAN || value === 'Clan') {
    return TechBase.CLAN;
  }
  return TechBase.INNER_SPHERE;
};

export const normalizeFullEquipment = (equipment: FullEquipment): FullEquipment => {
  const normalizedWeight =
    typeof equipment.weight === 'number'
      ? equipment.weight
      : typeof equipment.data?.tons === 'number'
      ? equipment.data.tons
      : 0;

  const normalizedSlots =
    typeof equipment.space === 'number'
      ? equipment.space
      : typeof equipment.data?.slots === 'number'
      ? equipment.data.slots
      : 1;

  return {
    ...equipment,
    id: equipment.id ?? fallbackId(),
    name: equipment.name ?? 'Unknown Equipment',
    weight: normalizedWeight,
    space: normalizedSlots,
    tech_base: equipment.tech_base ?? 'Inner Sphere',
  };
};

export const fullEquipmentFromSlotEquipment = (equipment: SlotEquipment): FullEquipment => {
  if ('tech_base' in equipment) {
    return normalizeFullEquipment(equipment as FullEquipment);
  }

  const normalized: FullEquipment = {
    id: equipment.id,
    name: equipment.name,
    type: String(equipment.type),
    tech_base: mapTechBase(equipment.techBase),
    era: '',
    source: '',
    weight: equipment.weight,
    space: equipment.criticalSlots,
    cost_cbills: equipment.cost,
    battle_value: equipment.battleValue,
    data: {
      tons: equipment.weight,
      slots: equipment.criticalSlots,
      cost: equipment.cost,
      battle_value: equipment.battleValue,
    },
  };

  return normalizeFullEquipment(normalized);
};

export const slotEquipmentFromFull = (equipment: FullEquipment): SlotEquipment =>
  normalizeFullEquipment(equipment);


