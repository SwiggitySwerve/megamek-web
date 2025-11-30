/**
 * Multi-Unit Tabs Component
 * 
 * Browser-like tabs for editing multiple units.
 * Uses the new TabManagerStore for tab lifecycle management.
 * 
 * @spec openspec/changes/add-customizer-ui-components/specs/multi-unit-tabs/spec.md
 * @spec openspec/changes/add-customizer-ui-components/specs/unit-store-architecture/spec.md
 */

import React, { useCallback } from 'react';
import { TabBar } from './TabBar';
import { NewTabModal } from './NewTabModal';
import { useTabManagerStore, UNIT_TEMPLATES } from '@/stores/useTabManagerStore';
import { TechBase } from '@/types/enums/TechBase';

interface MultiUnitTabsProps {
  /** Content to render for the active tab */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Multi-unit tab container with tab bar and content area
 */
export function MultiUnitTabs({
  children,
  className = '',
}: MultiUnitTabsProps) {
  // Use the new TabManagerStore
  const tabs = useTabManagerStore((s) => s.tabs);
  const activeTabId = useTabManagerStore((s) => s.activeTabId);
  const isLoading = useTabManagerStore((s) => s.isLoading);
  const isNewTabModalOpen = useTabManagerStore((s) => s.isNewTabModalOpen);
  const selectTab = useTabManagerStore((s) => s.selectTab);
  const closeTab = useTabManagerStore((s) => s.closeTab);
  const renameTab = useTabManagerStore((s) => s.renameTab);
  const createTab = useTabManagerStore((s) => s.createTab);
  const openNewTabModal = useTabManagerStore((s) => s.openNewTabModal);
  const closeNewTabModal = useTabManagerStore((s) => s.closeNewTabModal);
  
  // Create unit from template
  const createNewUnit = useCallback((tonnage: number, techBase: TechBase = TechBase.INNER_SPHERE) => {
    const template = UNIT_TEMPLATES.find(t => t.tonnage === tonnage) || UNIT_TEMPLATES[1];
    const templateWithTechBase = { ...template, techBase };
    return createTab(templateWithTechBase);
  }, [createTab]);
  
  // Transform tabs to format expected by TabBar
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    name: tab.name,
    tonnage: tab.tonnage,
    techBase: tab.techBase,
    isModified: false, // Would need to track this separately or get from unit store
  }));
  
  // Loading state
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }
  
  // Empty state - no tabs
  if (tabs.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center h-full ${className}`}>
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">No Units Open</h2>
          <p className="text-slate-400 mb-4">Create a new unit to get started</p>
          <button
            onClick={openNewTabModal}
            className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-lg transition-colors"
          >
            Create New Unit
          </button>
        </div>
        
        <NewTabModal
          isOpen={isNewTabModalOpen}
          onClose={closeNewTabModal}
          onCreateUnit={createNewUnit}
        />
      </div>
    );
  }
  
  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Tab bar */}
      <TabBar
        tabs={tabBarTabs}
        activeTabId={activeTabId}
        onSelectTab={selectTab}
        onCloseTab={closeTab}
        onRenameTab={renameTab}
        onNewTab={openNewTabModal}
      />
      
      {/* Tab content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {children}
      </div>
      
      {/* New tab modal */}
      <NewTabModal
        isOpen={isNewTabModalOpen}
        onClose={closeNewTabModal}
        onCreateUnit={createNewUnit}
      />
    </div>
  );
}
