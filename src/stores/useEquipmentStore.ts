/**
 * Equipment Store
 * 
 * Manages equipment catalog state including:
 * - Cached equipment data
 * - Filter state for equipment browser
 * - Search and pagination state
 * 
 * @spec openspec/changes/add-customizer-ui-components/specs/equipment-browser/spec.md
 */

import { create } from 'zustand';
import { TechBase } from '@/types/enums/TechBase';
import { EquipmentCategory, IEquipmentItem } from '@/types/equipment';

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Sortable columns
 */
export type SortColumn = 'name' | 'category' | 'techBase' | 'weight' | 'criticalSlots' | 'damage' | 'heat';

/**
 * Equipment filter state
 */
export interface EquipmentFilters {
  /** Text search query */
  readonly search: string;
  /** Tech base filter (null = all) */
  readonly techBase: TechBase | null;
  /** Category filter (null = all) */
  readonly category: EquipmentCategory | null;
  /** Maximum weight filter */
  readonly maxWeight: number | null;
  /** Maximum critical slots */
  readonly maxCriticalSlots: number | null;
  /** Filter by year availability */
  readonly maxYear: number | null;
}

/**
 * Pagination state
 */
export interface PaginationState {
  readonly currentPage: number;
  readonly pageSize: number;
  readonly totalItems: number;
}

/**
 * Sort state
 */
export interface SortState {
  readonly column: SortColumn;
  readonly direction: SortDirection;
}

/**
 * Equipment store state
 */
export interface EquipmentStoreState {
  // Data
  equipment: IEquipmentItem[];
  isLoading: boolean;
  error: string | null;
  
  // Filters
  filters: EquipmentFilters;
  
  // Pagination
  pagination: PaginationState;
  
  // Sorting
  sort: SortState;
  
  // Actions
  setEquipment: (equipment: IEquipmentItem[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Filter actions
  setSearch: (search: string) => void;
  setTechBaseFilter: (techBase: TechBase | null) => void;
  setCategoryFilter: (category: EquipmentCategory | null) => void;
  setMaxWeight: (weight: number | null) => void;
  setMaxCriticalSlots: (slots: number | null) => void;
  setMaxYear: (year: number | null) => void;
  clearFilters: () => void;
  
  // Pagination actions
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  
  // Sort actions
  setSort: (column: SortColumn) => void;
  
  // Computed
  getFilteredEquipment: () => IEquipmentItem[];
  getPaginatedEquipment: () => IEquipmentItem[];
}

/**
 * Default filter state
 */
const DEFAULT_FILTERS: EquipmentFilters = {
  search: '',
  techBase: null,
  category: null,
  maxWeight: null,
  maxCriticalSlots: null,
  maxYear: null,
};

/**
 * Default pagination state
 */
const DEFAULT_PAGINATION: PaginationState = {
  currentPage: 1,
  pageSize: 25,
  totalItems: 0,
};

/**
 * Default sort state
 */
const DEFAULT_SORT: SortState = {
  column: 'name',
  direction: 'asc',
};

/**
 * Equipment store for managing equipment browser state
 */
export const useEquipmentStore = create<EquipmentStoreState>((set, get) => ({
  // Initial state
  equipment: [],
  isLoading: false,
  error: null,
  filters: DEFAULT_FILTERS,
  pagination: DEFAULT_PAGINATION,
  sort: DEFAULT_SORT,
  
  // Data actions
  setEquipment: (equipment) => set({ 
    equipment,
    pagination: { ...get().pagination, totalItems: equipment.length },
  }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  // Filter actions
  setSearch: (search) => set((state) => ({
    filters: { ...state.filters, search },
    pagination: { ...state.pagination, currentPage: 1 },
  })),
  
  setTechBaseFilter: (techBase) => set((state) => ({
    filters: { ...state.filters, techBase },
    pagination: { ...state.pagination, currentPage: 1 },
  })),
  
  setCategoryFilter: (category) => set((state) => ({
    filters: { ...state.filters, category },
    pagination: { ...state.pagination, currentPage: 1 },
  })),
  
  setMaxWeight: (maxWeight) => set((state) => ({
    filters: { ...state.filters, maxWeight },
    pagination: { ...state.pagination, currentPage: 1 },
  })),
  
  setMaxCriticalSlots: (maxCriticalSlots) => set((state) => ({
    filters: { ...state.filters, maxCriticalSlots },
    pagination: { ...state.pagination, currentPage: 1 },
  })),
  
  setMaxYear: (maxYear) => set((state) => ({
    filters: { ...state.filters, maxYear },
    pagination: { ...state.pagination, currentPage: 1 },
  })),
  
  clearFilters: () => set({
    filters: DEFAULT_FILTERS,
    pagination: { ...get().pagination, currentPage: 1 },
  }),
  
  // Pagination actions
  setPage: (page) => set((state) => ({
    pagination: { ...state.pagination, currentPage: page },
  })),
  
  setPageSize: (size) => set((state) => ({
    pagination: { ...state.pagination, pageSize: size, currentPage: 1 },
  })),
  
  // Sort actions
  setSort: (column) => set((state) => ({
    sort: {
      column,
      direction: 
        state.sort.column === column && state.sort.direction === 'asc' 
          ? 'desc' 
          : 'asc',
    },
    pagination: { ...state.pagination, currentPage: 1 },
  })),
  
  // Computed - get filtered equipment
  getFilteredEquipment: () => {
    const { equipment, filters, sort } = get();
    
    let filtered = [...equipment];
    
    // Text search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(e => 
        e.name.toLowerCase().includes(searchLower)
      );
    }
    
    // Tech base filter
    if (filters.techBase) {
      filtered = filtered.filter(e => e.techBase === filters.techBase);
    }
    
    // Category filter
    if (filters.category) {
      filtered = filtered.filter(e => e.category === filters.category);
    }
    
    // Weight filter
    if (filters.maxWeight !== null) {
      filtered = filtered.filter(e => e.weight <= filters.maxWeight!);
    }
    
    // Critical slots filter
    if (filters.maxCriticalSlots !== null) {
      filtered = filtered.filter(e => e.criticalSlots <= filters.maxCriticalSlots!);
    }
    
    // Year filter
    if (filters.maxYear !== null) {
      filtered = filtered.filter(e => e.introductionYear <= filters.maxYear!);
    }
    
    // Sorting
    filtered.sort((a, b) => {
      let aVal: string | number;
      let bVal: string | number;
      
      switch (sort.column) {
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'category':
          aVal = a.category;
          bVal = b.category;
          break;
        case 'techBase':
          aVal = a.techBase;
          bVal = b.techBase;
          break;
        case 'weight':
          aVal = a.weight;
          bVal = b.weight;
          break;
        case 'criticalSlots':
          aVal = a.criticalSlots;
          bVal = b.criticalSlots;
          break;
        default:
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
      }
      
      if (aVal < bVal) return sort.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    return filtered;
  },
  
  // Computed - get paginated equipment
  getPaginatedEquipment: () => {
    const { pagination } = get();
    const filtered = get().getFilteredEquipment();
    
    const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    
    return filtered.slice(startIndex, endIndex);
  },
}));

