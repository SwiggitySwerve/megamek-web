import { IEquipment, FullEquipment } from '../types'

type EquipmentLike = IEquipment | FullEquipment

export const getEquipmentHeatGenerated = (equipment: EquipmentLike): number => {
  if (typeof equipment.heat === 'number') {
    return equipment.heat
  }

  const data = equipment.data ?? {}
  if (typeof data.heat === 'number') {
    return data.heat
  }
  if (typeof data.heatmap === 'number') {
    return data.heatmap
  }
  if (typeof data.heatGeneration === 'number') {
    return data.heatGeneration
  }

  return 0
}

export const getEquipmentWeight = (equipment: EquipmentLike): number => {
  if (typeof equipment.weight === 'number') {
    return equipment.weight
  }

  const data = equipment.data ?? {}
  if (typeof data.tons === 'number') {
    return data.tons
  }
  if (typeof data.weight === 'number') {
    return data.weight
  }

  return 0
}

export const getEquipmentSlots = (equipment: EquipmentLike): number => {
  if (typeof (equipment as { criticalSlots?: number }).criticalSlots === 'number') {
    return (equipment as { criticalSlots?: number }).criticalSlots ?? 0
  }

  if (typeof (equipment as { space?: number }).space === 'number') {
    return (equipment as { space?: number }).space ?? 0
  }

  const data = equipment.data ?? {}
  if (typeof data.slots === 'number') {
    return data.slots
  }

  if (typeof data.space === 'number') {
    return data.space
  }

  return 0
}

export const getEquipmentDamage = (equipment: EquipmentLike): number | string | undefined => {
  if (typeof equipment.damage === 'number' || typeof equipment.damage === 'string') {
    return equipment.damage
  }

  const data = equipment.data ?? {}
  if (typeof data.damage === 'number' || typeof data.damage === 'string') {
    return data.damage
  }

  return undefined
}

