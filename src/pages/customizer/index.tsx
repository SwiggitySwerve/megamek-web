/**
 * Unit Customizer Page
 * 
 * Full-featured BattleMech construction and modification interface.
 * Uses isolated unit stores with the new architecture.
 * 
 * @spec openspec/changes/add-customizer-ui-components
 * @spec openspec/changes/add-customizer-ui-components/specs/unit-store-architecture/spec.md
 */

import React, { useState, useCallback, useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Stores and hooks
import { useTabManagerStore, UNIT_TEMPLATES } from '@/stores/useTabManagerStore';
import { UnitStoreProvider, useUnitStore } from '@/stores';
import { useCustomizerStore } from '@/stores/useCustomizerStore';
import { useUnitCalculations } from '@/hooks/useUnitCalculations';

// Tab components
import {
  MultiUnitTabs,
  CustomizerTabs,
  DEFAULT_CUSTOMIZER_TABS,
  useCustomizerTabs,
  OverviewTab,
  StructureTab,
  FluffTab,
} from '@/components/customizer/tabs';

// Other customizer components
import { ArmorDiagram, LocationArmorData } from '@/components/customizer/armor';
import { EquipmentBrowser } from '@/components/customizer/equipment/EquipmentBrowser';
import { EquipmentTray, TrayEquipmentItem, WeightStats } from '@/components/customizer/equipment/EquipmentTray';
import { CriticalSlotsDisplay, LocationData } from '@/components/customizer/critical-slots/CriticalSlotsDisplay';
import { ColorLegend } from '@/components/customizer/shared/ColorLegend';
import { UnitInfoBanner } from '@/components/customizer/shared/UnitInfoBanner';
import { ResetConfirmationDialog } from '@/components/customizer/dialogs/ResetConfirmationDialog';

// Utils
import { ValidationStatus } from '@/utils/colors/statusColors';

// Types
import { MechLocation } from '@/types/construction';
import { IEquipmentItem, EquipmentCategory } from '@/types/equipment';

// =============================================================================
// Inner Content Component (uses UnitStore context)
// =============================================================================

function CustomizerContent() {
  const { tabs: sectionTabs, activeTab, setActiveTab } = useCustomizerTabs('overview');
  const {
    autoModeSettings,
    toggleAutoFillUnhittables,
    toggleShowPlacementPreview,
    colorLegendExpanded,
  } = useCustomizerStore();

  // Get unit state from context (no tabId needed!)
  const unitName = useUnitStore((s) => s.name);
  const tonnage = useUnitStore((s) => s.tonnage);
  const techBase = useUnitStore((s) => s.techBase);
  const engineType = useUnitStore((s) => s.engineType);
  const engineRating = useUnitStore((s) => s.engineRating);
  const gyroType = useUnitStore((s) => s.gyroType);
  const internalStructureType = useUnitStore((s) => s.internalStructureType);
  const cockpitType = useUnitStore((s) => s.cockpitType);
  const heatSinkType = useUnitStore((s) => s.heatSinkType);
  const heatSinkCount = useUnitStore((s) => s.heatSinkCount);
  const armorType = useUnitStore((s) => s.armorType);

  // Local state for dialogs
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  
  // Mock state for armor
  const [selectedArmorLocation, setSelectedArmorLocation] = useState<MechLocation | null>(null);
  
  // Mock state for equipment
  const [unitEquipment, setUnitEquipment] = useState<TrayEquipmentItem[]>([]);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | undefined>();

  // Calculate unit stats using the hook
  const calculations = useUnitCalculations(tonnage, {
    engineType,
    engineRating,
    gyroType,
    internalStructureType,
    cockpitType,
    heatSinkType,
    heatSinkCount,
    armorType,
  });

  // Generate mock armor data based on unit
  const armorData: LocationArmorData[] = useMemo(() => {
    const maxArmor = Math.floor(tonnage * 2 * 3.5);
    
    return [
      { location: MechLocation.HEAD, current: 0, maximum: 9 },
      { location: MechLocation.CENTER_TORSO, current: 0, maximum: Math.floor(maxArmor * 0.2), rear: 0, rearMaximum: Math.floor(maxArmor * 0.1) },
      { location: MechLocation.LEFT_TORSO, current: 0, maximum: Math.floor(maxArmor * 0.15), rear: 0, rearMaximum: Math.floor(maxArmor * 0.07) },
      { location: MechLocation.RIGHT_TORSO, current: 0, maximum: Math.floor(maxArmor * 0.15), rear: 0, rearMaximum: Math.floor(maxArmor * 0.07) },
      { location: MechLocation.LEFT_ARM, current: 0, maximum: Math.floor(maxArmor * 0.1) },
      { location: MechLocation.RIGHT_ARM, current: 0, maximum: Math.floor(maxArmor * 0.1) },
      { location: MechLocation.LEFT_LEG, current: 0, maximum: Math.floor(maxArmor * 0.12) },
      { location: MechLocation.RIGHT_LEG, current: 0, maximum: Math.floor(maxArmor * 0.12) },
    ];
  }, [tonnage]);

  // Generate mock critical slot data
  const criticalSlotsData: LocationData[] = useMemo(() => {
    return Object.values(MechLocation).map(location => ({
      location: location as MechLocation,
      slots: [],
    }));
  }, []);

  // Weight stats
  const weightStats: WeightStats = useMemo(() => ({
    maxWeight: tonnage,
    usedWeight: unitEquipment.reduce((sum, eq) => sum + eq.weight, 0),
    remainingWeight: tonnage - unitEquipment.reduce((sum, eq) => sum + eq.weight, 0),
  }), [tonnage, unitEquipment]);

  // Unit stats for the persistent banner
  const unitStats = useMemo(() => {
    const maxArmorPoints = Math.floor(tonnage * 2 * 3.5);
    
    const equipmentWeight = unitEquipment.reduce((sum, eq) => sum + eq.weight, 0);
    const totalUsedWeight = calculations.totalStructuralWeight + equipmentWeight;
    
    const equipmentSlots = unitEquipment.reduce((sum, eq) => sum + eq.criticalSlots, 0);
    const totalSlots = 78;
    const usedSlots = calculations.totalSystemSlots + equipmentSlots;
    
    return {
      name: unitName,
      tonnage,
      techBase,
      walkMP: calculations.walkMP,
      runMP: calculations.runMP,
      jumpMP: 0,
      weightUsed: totalUsedWeight,
      weightRemaining: tonnage - totalUsedWeight,
      armorPoints: 0,
      maxArmorPoints,
      criticalSlotsUsed: usedSlots,
      criticalSlotsTotal: totalSlots,
      heatGenerated: 0,
      heatDissipation: calculations.totalHeatDissipation,
      validationStatus: 'warning' as ValidationStatus,
      errorCount: 0,
      warningCount: 1,
    };
  }, [unitName, tonnage, techBase, unitEquipment, calculations]);

  // Handlers
  const handleAddEquipment = useCallback((equipment: IEquipmentItem) => {
    const newItem: TrayEquipmentItem = {
      id: `${equipment.id}-${Date.now()}`,
      name: equipment.name,
      category: equipment.category,
      weight: equipment.weight,
      criticalSlots: equipment.criticalSlots,
      isAllocated: false,
    };
    setUnitEquipment(prev => [...prev, newItem]);
  }, []);

  const handleRemoveEquipment = useCallback((id: string) => {
    setUnitEquipment(prev => prev.filter(eq => eq.id !== id));
    if (selectedEquipmentId === id) {
      setSelectedEquipmentId(undefined);
    }
  }, [selectedEquipmentId]);

  const handleSlotClick = useCallback((location: MechLocation, slotIndex: number) => {
    console.log('Slot clicked:', location, slotIndex);
  }, []);

  const handleEquipmentDrop = useCallback((location: MechLocation, slotIndex: number, equipmentId: string) => {
    console.log('Equipment dropped:', equipmentId, 'at', location, slotIndex);
  }, []);

  const handleEquipmentRemove = useCallback((location: MechLocation, slotIndex: number) => {
    console.log('Equipment removed from:', location, slotIndex);
  }, []);

  const handleToolbarAction = useCallback((action: 'fill' | 'compact' | 'sort' | 'reset') => {
    if (action === 'reset') {
      setIsResetDialogOpen(true);
    } else {
      console.log('Toolbar action:', action);
    }
  }, []);

  const handleResetConfirm = useCallback(async (optionId: string) => {
    console.log('Reset confirmed:', optionId);
    if (optionId === 'equipment' || optionId === 'full') {
      setUnitEquipment([]);
    }
  }, []);

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        // No tabId needed - uses context!
        return <OverviewTab />;

      case 'structure':
        // No tabId needed - uses context!
        return <StructureTab />;

      case 'armor':
        return (
          <div className="p-4">
            <div className="max-w-lg mx-auto">
              <ArmorDiagram
                armorData={armorData}
                selectedLocation={selectedArmorLocation}
                unallocatedPoints={100}
                onLocationClick={setSelectedArmorLocation}
                onAutoAllocate={() => console.log('Auto-allocate clicked')}
              />
            </div>
          </div>
        );

      case 'weapons':
      case 'equipment':
        return (
          <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <EquipmentBrowser onAddEquipment={handleAddEquipment} />
            </div>
            <div>
              <EquipmentTray
                equipment={unitEquipment}
                weightStats={weightStats}
                onRemoveEquipment={handleRemoveEquipment}
                onSelectEquipment={setSelectedEquipmentId}
                selectedEquipmentId={selectedEquipmentId}
                className="h-[600px]"
              />
            </div>
          </div>
        );

      case 'criticals':
        return (
          <div className="p-4">
            <CriticalSlotsDisplay
              locations={criticalSlotsData}
              selectedEquipmentId={selectedEquipmentId}
              assignableSlots={[]}
              autoFillUnhittables={autoModeSettings.autoFillUnhittables}
              showPlacementPreview={autoModeSettings.showPlacementPreview}
              onSlotClick={handleSlotClick}
              onEquipmentDrop={handleEquipmentDrop}
              onEquipmentRemove={handleEquipmentRemove}
              onAutoFillToggle={toggleAutoFillUnhittables}
              onPreviewToggle={toggleShowPlacementPreview}
              onToolbarAction={handleToolbarAction}
            />
          </div>
        );

      case 'fluff':
        return (
          <FluffTab
            chassis={unitName.split(' ')[0]}
            model={unitName}
          />
        );

      default:
        return (
          <div className="p-8 text-center text-slate-400">
            Tab content not implemented yet
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Persistent unit stats banner */}
      <UnitInfoBanner 
        stats={unitStats}
        onReset={() => setIsResetDialogOpen(true)}
      />
      
      {/* Customizer section tabs */}
      <CustomizerTabs
        tabs={DEFAULT_CUSTOMIZER_TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tab content */}
      <div className="flex-1 overflow-auto bg-slate-900">
        {renderTabContent()}
      </div>

      {/* Color legend (collapsible) */}
      <div className="border-t border-slate-700 p-2">
        <ColorLegend defaultExpanded={colorLegendExpanded} />
      </div>

      {/* Reset confirmation dialog */}
      <ResetConfirmationDialog
        isOpen={isResetDialogOpen}
        onClose={() => setIsResetDialogOpen(false)}
        onConfirm={handleResetConfirm}
      />
    </div>
  );
}

// =============================================================================
// Main Page Component
// =============================================================================

/**
 * Main customizer page component
 */
export default function CustomizerPage() {
  const isLoading = useTabManagerStore((s) => s.isLoading);
  const tabs = useTabManagerStore((s) => s.tabs);
  const activeTabId = useTabManagerStore((s) => s.activeTabId);

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-slate-400">Loading customizer...</div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-slate-900 flex flex-col">
        {/* Multi-unit tabs at top */}
        <MultiUnitTabs>
          {/* UnitStoreProvider provides the active unit's store */}
          <UnitStoreProvider
            fallback={
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-slate-400">
                  <p className="text-lg mb-2">No unit selected</p>
                  <p className="text-sm">Create a new unit to get started</p>
                </div>
              </div>
            }
          >
            <CustomizerContent />
          </UnitStoreProvider>
        </MultiUnitTabs>
      </div>
    </DndProvider>
  );
}
