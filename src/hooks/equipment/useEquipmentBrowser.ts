/**
 * useEquipmentBrowser Hook - STUB FILE
 * TODO: Replace with spec-driven implementation
 */

import { useState, useCallback } from 'react';
import { EquipmentSearchCriteria, EquipmentItem } from '../../services/equipment/EquipmentGateway';

export interface EquipmentBrowserState {
  items: EquipmentItem[];
  loading: boolean;
  error: string | null;
  categories: string[];
  selectedCategory: string | null;
}

export function useEquipmentBrowser() {
  const [state, setState] = useState<EquipmentBrowserState>({
    items: [],
    loading: false,
    error: null,
    categories: [],
    selectedCategory: null,
  });

  const search = useCallback(async (criteria: EquipmentSearchCriteria) => {
    setState(s => ({ ...s, loading: true }));
    // Stub: empty results
    setState(s => ({ ...s, loading: false, items: [] }));
  }, []);

  const setCategory = useCallback((category: string | null) => {
    setState(s => ({ ...s, selectedCategory: category }));
  }, []);

  const refresh = useCallback(async () => {
    // Stub
  }, []);

  return { ...state, search, setCategory, refresh };
}


