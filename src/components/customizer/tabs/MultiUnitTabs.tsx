/**
 * Multi-Unit Tabs Component
 * 
 * Browser-like tabs for editing multiple units.
 * Uses the new TabManagerStore for tab lifecycle management.
 * Integrates with URL routing for shareable links.
 * 
 * @spec openspec/specs/multi-unit-tabs/spec.md
 * @spec openspec/specs/unit-store-architecture/spec.md
 */

import React, { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { TabBar } from './TabBar';
import { NewTabModal } from './NewTabModal';
import { UnsavedChangesDialog } from '@/components/customizer/dialogs/UnsavedChangesDialog';
import { useTabManagerStore, UNIT_TEMPLATES, TabInfo } from '@/stores/useTabManagerStore';
import { getUnitStore } from '@/stores/unitStoreRegistry';
import { TechBase } from '@/types/enums/TechBase';
import { DEFAULT_TAB } from '@/hooks/useCustomizerRouter';

// =============================================================================
// Types
// =============================================================================

interface MultiUnitTabsProps {
  /** Content to render for the active tab */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

interface CloseDialogState {
  isOpen: boolean;
  tabId: string | null;
  tabName: string;
}

// =============================================================================
// Component
// =============================================================================

/**
 * Multi-unit tab container with tab bar and content area
 */
export function MultiUnitTabs({
  children,
  className = '',
}: MultiUnitTabsProps) {
  const router = useRouter();
  
  // Close dialog state
  const [closeDialog, setCloseDialog] = useState<CloseDialogState>({
    isOpen: false,
    tabId: null,
    tabName: '',
  });
  
  // Use individual selectors for primitives and stable references
  // This avoids creating new objects on each render
  const tabs = useTabManagerStore((s) => s.tabs);
  const activeTabId = useTabManagerStore((s) => s.activeTabId);
  const isLoading = useTabManagerStore((s) => s.isLoading);
  const isNewTabModalOpen = useTabManagerStore((s) => s.isNewTabModalOpen);
  
  // Actions are stable references from the store
  const storeSelectTab = useTabManagerStore((s) => s.selectTab);
  const storeCloseTab = useTabManagerStore((s) => s.closeTab);
  const renameTab = useTabManagerStore((s) => s.renameTab);
  const createTab = useTabManagerStore((s) => s.createTab);
  const openNewTabModal = useTabManagerStore((s) => s.openNewTabModal);
  const closeNewTabModal = useTabManagerStore((s) => s.closeNewTabModal);
  
  // Select tab with URL navigation
  const selectTab = useCallback((tabId: string) => {
    storeSelectTab(tabId);
    // Navigate to the unit URL
    router.push(`/customizer/${tabId}/${DEFAULT_TAB}`, undefined, { shallow: true });
  }, [storeSelectTab, router]);
  
  // Actually close the tab and navigate
  const performCloseTab = useCallback((tabId: string) => {
    // Close the tab in the store
    storeCloseTab(tabId);
    
    // Get updated state after closing
    const newState = useTabManagerStore.getState();
    
    if (newState.tabs.length === 0) {
      // All tabs closed - navigate to index (empty state)
      router.push('/customizer', undefined, { shallow: true });
    } else if (newState.activeTabId && newState.activeTabId !== tabId) {
      // A different tab is now active - navigate to it
      router.push(`/customizer/${newState.activeTabId}/${DEFAULT_TAB}`, undefined, { shallow: true });
    }
  }, [storeCloseTab, router]);
  
  // Close tab with unsaved changes check
  const closeTab = useCallback((tabId: string) => {
    // Check if the unit has unsaved changes
    const unitStore = getUnitStore(tabId);
    const isModified = unitStore?.getState().isModified ?? false;
    const tabInfo = tabs.find((t) => t.id === tabId);
    
    if (isModified) {
      // Show confirmation dialog
      setCloseDialog({
        isOpen: true,
        tabId,
        tabName: tabInfo?.name ?? 'Unknown Unit',
      });
    } else {
      // No unsaved changes, close directly
      performCloseTab(tabId);
    }
  }, [tabs, performCloseTab]);
  
  // Dialog handlers
  const handleCloseDialogCancel = useCallback(() => {
    setCloseDialog({ isOpen: false, tabId: null, tabName: '' });
  }, []);
  
  const handleCloseDialogDiscard = useCallback(() => {
    if (closeDialog.tabId) {
      performCloseTab(closeDialog.tabId);
    }
    setCloseDialog({ isOpen: false, tabId: null, tabName: '' });
  }, [closeDialog.tabId, performCloseTab]);
  
  const handleCloseDialogSave = useCallback(() => {
    // TODO: Implement save functionality
    // For now, just close after "saving"
    if (closeDialog.tabId) {
      const unitStore = getUnitStore(closeDialog.tabId);
      if (unitStore) {
        // Mark as not modified (simulating save)
        unitStore.getState().markModified(false);
      }
      performCloseTab(closeDialog.tabId);
    }
    setCloseDialog({ isOpen: false, tabId: null, tabName: '' });
  }, [closeDialog.tabId, performCloseTab]);
  
  // Navigate to unit library
  const handleLoadFromLibrary = useCallback(() => {
    router.push('/units');
  }, [router]);
  
  // Create unit from template with URL navigation
  const createNewUnit = useCallback((tonnage: number, techBase: TechBase = TechBase.INNER_SPHERE) => {
    const template = UNIT_TEMPLATES.find(t => t.tonnage === tonnage) || UNIT_TEMPLATES[1];
    const templateWithTechBase = { ...template, techBase };
    const newTabId = createTab(templateWithTechBase);
    // Navigate to the new unit URL
    router.push(`/customizer/${newTabId}/${DEFAULT_TAB}`, undefined, { shallow: true });
    return newTabId;
  }, [createTab, router]);
  
  // Transform tabs to format expected by TabBar
  // Check isModified from unit stores
  const tabBarTabs = useMemo(() => 
    tabs.map((tab) => {
      const unitStore = getUnitStore(tab.id);
      return {
        id: tab.id,
        name: tab.name,
        isModified: unitStore?.getState().isModified ?? false,
      };
    }),
    [tabs]
  );
  
  // Loading state - show while Zustand is hydrating
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
        <div className="text-center max-w-md">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-6 bg-slate-800 rounded-2xl flex items-center justify-center">
            <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">No Units Open</h2>
          <p className="text-slate-400 mb-8">Create a new BattleMech from scratch or load an existing unit from the library.</p>
          
          {/* Quick action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={openNewTabModal}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Unit
            </button>
            
            <button
              onClick={handleLoadFromLibrary}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              Load from Library
            </button>
          </div>
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
      
      {/* Unsaved changes dialog */}
      <UnsavedChangesDialog
        isOpen={closeDialog.isOpen}
        unitName={closeDialog.tabName}
        onClose={handleCloseDialogCancel}
        onDiscard={handleCloseDialogDiscard}
        onSave={handleCloseDialogSave}
      />
    </div>
  );
}
