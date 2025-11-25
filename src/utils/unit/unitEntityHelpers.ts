import { EditableUnit } from '../../types'

export const updateUnitData = (unit: EditableUnit, updates: Partial<EditableUnit['data']>): EditableUnit => {
  return {
    ...unit,
    data: {
      ...(unit.data ?? {}),
      ...updates,
    },
  }
}

export const updateUnitSystem = <K extends keyof NonNullable<EditableUnit['data']>>(
  unit: EditableUnit,
  systemKey: K,
  updates: Partial<NonNullable<EditableUnit['data']>[K]>,
): EditableUnit => {
  const currentData = unit.data ?? {}
  const currentSystem = currentData[systemKey]
  const nextSystem =
    typeof currentSystem === 'object' && currentSystem !== null
      ? { ...currentSystem, ...updates }
      : { ...updates }

  return {
    ...unit,
    data: {
      ...currentData,
      [systemKey]: nextSystem,
    },
  }
}

