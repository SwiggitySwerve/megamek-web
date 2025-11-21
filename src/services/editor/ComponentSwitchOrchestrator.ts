import { CatalogGateway } from '../catalog/CatalogGateway'
import { ComponentCategory as CatalogComponentCategory, TechContext } from '../catalog/types'
import { ComponentMemoryState, COMPONENT_CATEGORIES, TECH_BASES, TechBaseMemory } from '../../types/componentDatabase'
import { validateAndResolveComponentWithMemory, createDefaultMemory } from '../../utils/techBaseMemory'
import { ComponentCategory as DbComponentCategory, RulesLevel, TechBase } from '../../types/core/BaseTypes'
import { UnitConfiguration } from '../../utils/criticalSlots/UnitCriticalManagerTypes'

// Map overview subsystem → catalog component category (for searching)
const SubsystemToCategory: Record<string, CatalogComponentCategory> = {
  chassis: 'structure',
  gyro: 'gyro',
  engine: 'engine',
  heatsink: 'heatSink',
  targeting: 'enhancement', // targeting computers treated as enhancements for catalog category purposes
  myomer: 'enhancement',
  movement: 'jumpJet',
  armor: 'armor'
}

// Map overview subsystem → database component category (for memory)
const SubsystemToDbCategory: Record<string, DbComponentCategory> = {
  chassis: DbComponentCategory.CHASSIS,
  gyro: DbComponentCategory.GYRO,
  engine: DbComponentCategory.ENGINE,
  heatsink: DbComponentCategory.HEAT_SINK,
  targeting: DbComponentCategory.TARGETING,
  myomer: DbComponentCategory.MYOMER,
  movement: DbComponentCategory.MOVEMENT,
  armor: DbComponentCategory.ARMOR
}

function normalizeMemory(state: ComponentMemoryState | null): ComponentMemoryState {
  const base = createDefaultMemory()
  if (!state || !state.techBaseMemory) {
    return { techBaseMemory: base, lastUpdated: Date.now(), version: '1.0.0' }
  }
  const merged = { ...base };
  COMPONENT_CATEGORIES.forEach((category) => {
    // Cast category to keyof TechBaseMemory since we know they match
    const cat = category as keyof TechBaseMemory;
    
    if (base && base[cat]) {
      // Create a copy of the base category memory
      merged[cat] = { ...base[cat] };
      
      const provided = state.techBaseMemory[cat] || {};
      TECH_BASES.forEach((tb: TechBase) => {
        if (provided[tb] !== undefined) {
            // We need to handle the strict typing of TechBaseMemory
            // merged[cat] is { [K in TechBase]: string }
            // provided is { [K in TechBase]: string }
            (merged[cat] as Record<string, string>)[tb] = provided[tb];
        }
      })
    }
  })
  return { techBaseMemory: merged, lastUpdated: Date.now(), version: '1.0.0' }
}

const SubsystemToConfigProp: Record<string, string> = {
  chassis: 'structureType',
  gyro: 'gyroType',
  engine: 'engineType',
  heatsink: 'heatSinkType',
  targeting: 'targetingSystem',
  myomer: 'enhancementType',
  movement: 'jumpJetType',
  armor: 'armorType'
}

export interface SwitchResult {
  updatedConfiguration: UnitConfiguration
  updatedMemoryState?: ComponentMemoryState
  wasRestoredFromMemory: boolean
  resolutionReason: string
  displacedEquipmentIds: string[]
  retainedEquipmentIds: string[]
}

export class ComponentSwitchOrchestrator {
  static async switchSubsystemTechBase(
    subsystem: keyof typeof SubsystemToCategory,
    newTechBase: 'Inner Sphere' | 'Clan',
    currentConfiguration: UnitConfiguration,
    memoryState: ComponentMemoryState | null,
    context: Partial<TechContext> = { unitType: 'BattleMech' }
  ): Promise<SwitchResult> {
    const oldTechBase: 'Inner Sphere' | 'Clan' = currentConfiguration.techProgression?.[subsystem as keyof typeof currentConfiguration.techProgression] || 'Inner Sphere'
    const configProp = SubsystemToConfigProp[subsystem]
    
    // Access dynamic property safely using Record<string, any>
    // This is necessary because SubsystemToConfigProp maps to string keys that may not be statically known
    const currentComponent = configProp ? (currentConfiguration as Record<string, any>)[configProp] : undefined

    // Update catalog context so subsequent searches are tech-aware
    await CatalogGateway.setContext({ techBase: newTechBase, unitType: context.unitType || 'BattleMech' })

    let resolvedName = typeof currentComponent === 'object' && currentComponent?.type ? currentComponent.type : currentComponent
    let updatedMemoryState = normalizeMemory(memoryState)
    let wasRestoredFromMemory = false
    let resolutionReason = 'No change'

    if (updatedMemoryState && oldTechBase !== newTechBase) {
      const resolution = validateAndResolveComponentWithMemory(
        resolvedName,
        SubsystemToDbCategory[subsystem],
        oldTechBase as TechBase,
        newTechBase as TechBase,
        updatedMemoryState.techBaseMemory,
        (currentConfiguration.rulesLevel as RulesLevel) || RulesLevel.STANDARD
      )
      wasRestoredFromMemory = resolution.wasRestored
      resolutionReason = resolution.resolutionReason

      // update memory container
      updatedMemoryState = { techBaseMemory: resolution.updatedMemory, lastUpdated: Date.now(), version: '1.0.0' }

      resolvedName = resolution.resolvedComponent
    }

    // If still no resolved component, fall back to defaults using the catalog (first available option)
    if (!resolvedName) {
      const options = await CatalogGateway.search({
        componentCategories: [SubsystemToCategory[subsystem]],
        page: 1,
        pageSize: 1,
        sortBy: 'name',
        sortOrder: 'ASC'
      })
      resolvedName = options.items[0]?.name || 'Standard'
      resolutionReason = `Defaulted to first available: ${resolvedName}`
    }

    // Build updated progression and configuration
    const newProgression = {
      ...(currentConfiguration.techProgression || {
        chassis: 'Inner Sphere',
        engine: 'Inner Sphere',
        gyro: 'Inner Sphere',
        heatsink: 'Inner Sphere',
        armor: 'Inner Sphere',
        myomer: 'Inner Sphere',
        targeting: 'Inner Sphere',
        movement: 'Inner Sphere'
      }),
      [subsystem]: newTechBase
    }

    const updatedConfiguration = {
      ...currentConfiguration,
      techProgression: newProgression,
      [configProp]: resolvedName
    } as UnitConfiguration

    // Placeholders for displacement diffs: require orchestrator/state access to compute precisely
    const displacedEquipmentIds: string[] = []
    const retainedEquipmentIds: string[] = []

    return {
      updatedConfiguration,
      updatedMemoryState,
      wasRestoredFromMemory,
      resolutionReason,
      displacedEquipmentIds,
      retainedEquipmentIds
    }
  }
}




