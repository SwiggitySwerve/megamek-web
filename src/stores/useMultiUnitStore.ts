/**
 * Multi-Unit Tab Store
 * 
 * Manages multiple unit tabs with:
 * - Tab creation, selection, closing
 * - Unsaved changes tracking
 * - localStorage persistence
 * 
 * @spec openspec/changes/add-customizer-ui-components/specs/multi-unit-tabs/spec.md
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { TechBase } from '@/types/enums/TechBase';
import { MechConfiguration, UnitType } from '@/types/unit/BattleMechInterfaces';

/**
 * Unit tab state
 */
export interface UnitTab {
  /** Unique tab identifier */
  readonly id: string;
  /** Display name (user-editable) */
  name: string;
  /** Unit type */
  readonly unitType: UnitType;
  /** Tonnage */
  readonly tonnage: number;
  /** Tech base */
  readonly techBase: TechBase;
  /** Mech configuration */
  readonly configuration: MechConfiguration;
  /** Has unsaved changes */
  isModified: boolean;
  /** Creation timestamp */
  readonly createdAt: number;
  /** Last modified timestamp */
  lastModifiedAt: number;
}

/**
 * Unit template for creating new tabs
 */
export interface UnitTemplate {
  readonly id: string;
  readonly name: string;
  readonly tonnage: number;
  readonly techBase: TechBase;
  readonly walkMP: number;
  readonly jumpMP: number;
}

/**
 * Default unit templates
 */
export const UNIT_TEMPLATES: readonly UnitTemplate[] = [
  { id: 'light', name: 'Light Mech', tonnage: 25, techBase: TechBase.INNER_SPHERE, walkMP: 8, jumpMP: 0 },
  { id: 'medium', name: 'Medium Mech', tonnage: 50, techBase: TechBase.INNER_SPHERE, walkMP: 5, jumpMP: 0 },
  { id: 'heavy', name: 'Heavy Mech', tonnage: 70, techBase: TechBase.INNER_SPHERE, walkMP: 4, jumpMP: 0 },
  { id: 'assault', name: 'Assault Mech', tonnage: 100, techBase: TechBase.INNER_SPHERE, walkMP: 3, jumpMP: 0 },
];

/**
 * Multi-unit store state
 */
export interface MultiUnitState {
  // Tab state
  tabs: UnitTab[];
  activeTabId: string | null;
  
  // UI state
  isLoading: boolean;
  isNewTabModalOpen: boolean;
  
  // Actions
  createTab: (template: UnitTemplate, name?: string) => string;
  duplicateTab: (tabId: string) => string | null;
  closeTab: (tabId: string) => void;
  selectTab: (tabId: string) => void;
  renameTab: (tabId: string, name: string) => void;
  markModified: (tabId: string, modified?: boolean) => void;
  openNewTabModal: () => void;
  closeNewTabModal: () => void;
  getActiveTab: () => UnitTab | null;
  
  // Persistence helpers
  setLoading: (loading: boolean) => void;
}

/**
 * Generate unique tab ID
 */
function generateTabId(): string {
  return `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Multi-unit tab store with localStorage persistence
 */
export const useMultiUnitStore = create<MultiUnitState>()(
  persist(
    (set, get) => ({
      // Initial state
      tabs: [],
      activeTabId: null,
      isLoading: true,
      isNewTabModalOpen: false,
      
      // Actions
      createTab: (template, customName) => {
        const id = generateTabId();
        const now = Date.now();
        const name = customName || `New ${template.name}`;
        
        const newTab: UnitTab = {
          id,
          name,
          unitType: UnitType.BATTLEMECH,
          tonnage: template.tonnage,
          techBase: template.techBase,
          configuration: MechConfiguration.BIPED,
          isModified: true,
          createdAt: now,
          lastModifiedAt: now,
        };
        
        set((state) => ({
          tabs: [...state.tabs, newTab],
          activeTabId: id,
          isNewTabModalOpen: false,
        }));
        
        return id;
      },
      
      duplicateTab: (tabId) => {
        const state = get();
        const sourceTab = state.tabs.find(t => t.id === tabId);
        if (!sourceTab) return null;
        
        const id = generateTabId();
        const now = Date.now();
        
        const newTab: UnitTab = {
          ...sourceTab,
          id,
          name: `${sourceTab.name} (Copy)`,
          isModified: true,
          createdAt: now,
          lastModifiedAt: now,
        };
        
        set((state) => ({
          tabs: [...state.tabs, newTab],
          activeTabId: id,
        }));
        
        return id;
      },
      
      closeTab: (tabId) => {
        set((state) => {
          const tabIndex = state.tabs.findIndex(t => t.id === tabId);
          if (tabIndex === -1) return state;
          
          // Prevent closing last tab
          if (state.tabs.length === 1) return state;
          
          const newTabs = state.tabs.filter(t => t.id !== tabId);
          
          // Select adjacent tab if closing active tab
          let newActiveId = state.activeTabId;
          if (state.activeTabId === tabId) {
            const newIndex = Math.min(tabIndex, newTabs.length - 1);
            newActiveId = newTabs[newIndex]?.id || null;
          }
          
          return {
            tabs: newTabs,
            activeTabId: newActiveId,
          };
        });
      },
      
      selectTab: (tabId) => {
        set({ activeTabId: tabId });
      },
      
      renameTab: (tabId, name) => {
        set((state) => ({
          tabs: state.tabs.map(tab =>
            tab.id === tabId
              ? { ...tab, name, lastModifiedAt: Date.now() }
              : tab
          ),
        }));
      },
      
      markModified: (tabId, modified = true) => {
        set((state) => ({
          tabs: state.tabs.map(tab =>
            tab.id === tabId
              ? { ...tab, isModified: modified, lastModifiedAt: Date.now() }
              : tab
          ),
        }));
      },
      
      openNewTabModal: () => set({ isNewTabModalOpen: true }),
      
      closeNewTabModal: () => set({ isNewTabModalOpen: false }),
      
      getActiveTab: () => {
        const state = get();
        return state.tabs.find(t => t.id === state.activeTabId) || null;
      },
      
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'megamek-multi-unit-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        tabs: state.tabs,
        activeTabId: state.activeTabId,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setLoading(false);
        }
      },
    }
  )
);

