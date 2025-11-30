/**
 * Unit Store Provider
 * 
 * React component that provides the active unit's store via context.
 * Child components can use useUnitStore() to access the current unit's state.
 * 
 * @spec openspec/changes/add-customizer-ui-components/specs/unit-store-architecture/spec.md
 */

import React, { useMemo, useEffect, useState } from 'react';
import { StoreApi } from 'zustand';
import { UnitStoreContext } from './useUnitStore';
import { UnitStore } from './unitState';
import { useTabManagerStore } from './useTabManagerStore';
import { getUnitStore, hydrateOrCreateUnit } from './unitStoreRegistry';

// =============================================================================
// Provider Props
// =============================================================================

interface UnitStoreProviderProps {
  children: React.ReactNode;
  /** Fallback UI when no unit is selected */
  fallback?: React.ReactNode;
}

// =============================================================================
// Provider Component
// =============================================================================

/**
 * Provides the active unit's store to child components
 * 
 * Usage:
 * ```tsx
 * <UnitStoreProvider>
 *   <StructureTab />  // Can now use useUnitStore()
 * </UnitStoreProvider>
 * ```
 */
export function UnitStoreProvider({
  children,
  fallback,
}: UnitStoreProviderProps) {
  // Get active tab info from TabManager
  const activeTabId = useTabManagerStore((s) => s.activeTabId);
  const activeTab = useTabManagerStore((s) => s.getActiveTab());
  const isLoading = useTabManagerStore((s) => s.isLoading);
  
  // Track the current store
  const [currentStore, setCurrentStore] = useState<StoreApi<UnitStore> | null>(null);
  
  // Update store when active tab changes
  useEffect(() => {
    if (!activeTabId || !activeTab) {
      setCurrentStore(null);
      return;
    }
    
    // Get or hydrate the store for this tab
    const store = hydrateOrCreateUnit(activeTabId, {
      name: activeTab.name,
      tonnage: activeTab.tonnage,
      techBase: activeTab.techBase,
    });
    
    setCurrentStore(store);
  }, [activeTabId, activeTab]);
  
  // Show loading state during hydration
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }
  
  // No active unit - show fallback or default message
  if (!currentStore) {
    return (
      <>
        {fallback ?? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center text-slate-400">
              <p>No unit selected</p>
              <p className="text-sm mt-2">Create a new unit to get started</p>
            </div>
          </div>
        )}
      </>
    );
  }
  
  // Provide the active unit's store to children
  return (
    <UnitStoreContext.Provider value={currentStore}>
      {children}
    </UnitStoreContext.Provider>
  );
}

/**
 * Hook to check if we're inside a UnitStoreProvider
 */
export function useHasUnitStore(): boolean {
  const store = React.useContext(UnitStoreContext);
  return store !== null;
}

