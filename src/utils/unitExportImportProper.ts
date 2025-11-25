import { EditableUnit } from '../types'

type ExportFormat = 'json' | 'mtf' | 'blk' | 'auto'

const createEmptyEditableUnit = (): EditableUnit => ({
  id: '',
  chassis: 'Custom Chassis',
  model: 'Variant',
  mul_id: '-1',
  mass: 25,
  tech_base: 'Inner Sphere',
  armorAllocation: {},
  equipmentPlacements: [],
  criticalSlots: [],
  fluffData: {},
  selectedQuirks: [],
  validationState: { isValid: true, errors: [], warnings: [] },
  editorMetadata: {
    lastModified: new Date(),
    isDirty: false,
    version: '1.0',
  },
  data: {
    chassis: 'Custom Chassis',
    model: 'Variant',
    mass: 25,
    tech_base: 'Inner Sphere',
    armor: {
      type: 'Standard',
      locations: [],
      total_armor_points: 0,
    },
    heat_sinks: {
      type: 'Single',
      count: 10,
    },
    movement: {
      walk_mp: 4,
      jump_mp: 0,
    },
    weapons_and_equipment: [],
    criticals: [],
  },
})

const mergeWithDefaults = (data: Partial<EditableUnit>): EditableUnit => {
  const defaults = createEmptyEditableUnit()
  return {
    ...defaults,
    ...data,
    armorAllocation: data.armorAllocation ?? defaults.armorAllocation,
    equipmentPlacements: data.equipmentPlacements ?? defaults.equipmentPlacements,
    criticalSlots: data.criticalSlots ?? defaults.criticalSlots,
    fluffData: data.fluffData ?? defaults.fluffData,
    selectedQuirks: data.selectedQuirks ?? defaults.selectedQuirks,
    validationState: data.validationState ?? defaults.validationState,
    editorMetadata: {
      ...defaults.editorMetadata,
      ...(data.editorMetadata ?? {}),
    },
    data: {
      ...defaults.data,
      ...(data.data ?? {}),
    },
  }
}

const serializeUnit = (unit: EditableUnit): string =>
  JSON.stringify(
    {
      ...unit,
      exportVersion: '1.0',
      exportDate: new Date().toISOString(),
    },
    null,
    2,
  )

export const exportToJSON = (unit: EditableUnit): string => serializeUnit(unit)

export const exportToMTF = (unit: EditableUnit): string => serializeUnit(unit)

export const importFromJSON = (payload: string): EditableUnit => {
  const parsed = JSON.parse(payload)
  return mergeWithDefaults(parsed)
}

export const importFromMTF = (payload: string): EditableUnit => {
  // Placeholder implementation treats MTF as JSON-like for now
  try {
    return importFromJSON(payload)
  } catch {
    return createEmptyEditableUnit()
  }
}

const inferFilename = (unit: EditableUnit, extension: string): string => {
  const chassis = unit.chassis || 'unit'
  const model = unit.model || 'variant'
  return `${chassis}_${model}.${extension}`.replace(/\s+/g, '_')
}

export function downloadUnit(unit: EditableUnit, format: ExportFormat = 'json'): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return
  }

  const payload = format === 'json' ? exportToJSON(unit) : exportToMTF(unit)
  const extension = format === 'auto' ? 'json' : format
  const blob = new Blob([payload], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = inferFilename(unit, extension)
  link.click()
  URL.revokeObjectURL(url)
}

export async function readUploadedFile(file: File): Promise<EditableUnit> {
  const content = await file.text()
  return importFromJSON(content)
}

