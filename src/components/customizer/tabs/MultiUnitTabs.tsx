/**
 * Multi-Unit Tabs Component
 * 
 * Browser-like tabs for editing multiple units.
 * 
 * @spec openspec/changes/add-customizer-ui-components/specs/multi-unit-tabs/spec.md
 */

import React from 'react';
import { TabBar } from './TabBar';
import { NewTabModal } from './NewTabModal';
import { useUnit } from '@/hooks/useUnit';

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
  const {
    allTabs,
    activeTabId,
    isLoading,
    isNewTabModalOpen,
    selectTab,
    closeTab,
    renameUnit,
    createNewUnit,
    openNewTabModal,
    closeNewTabModal,
  } = useUnit();
  
  // Loading state
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }
  
  // Empty state - no tabs
  if (allTabs.length === 0) {
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
        tabs={allTabs}
        activeTabId={activeTabId}
        onSelectTab={selectTab}
        onCloseTab={closeTab}
        onRenameTab={(tabId, name) => {
          if (tabId === activeTabId) {
            renameUnit(name);
          }
        }}
        onAddTab={openNewTabModal}
      />
      
      {/* Tab content */}
      <div className="flex-1 overflow-auto">
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

