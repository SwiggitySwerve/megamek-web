/**
 * useCatalogBrowser Hook - STUB FILE
 * TODO: Replace with spec-driven implementation
 */

import { useState, useCallback } from 'react';
import { SearchCriteria, CatalogItem, PaginatedResult } from '../../services/catalog/types';

export interface CatalogBrowserState {
  items: CatalogItem[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
}

export interface CatalogBrowserActions {
  search: (criteria: SearchCriteria) => Promise<void>;
  nextPage: () => void;
  prevPage: () => void;
  setPageSize: (size: number) => void;
  reset: () => void;
}

export function useCatalogBrowser(): CatalogBrowserState & CatalogBrowserActions {
  const [state, setState] = useState<CatalogBrowserState>({
    items: [],
    loading: false,
    error: null,
    total: 0,
    page: 1,
    pageSize: 25,
  });

  const search = useCallback(async (criteria: SearchCriteria) => {
    setState(s => ({ ...s, loading: true, error: null }));
    // Stub: empty results
    setState(s => ({ ...s, loading: false, items: [], total: 0 }));
  }, []);

  const nextPage = useCallback(() => {
    setState(s => ({ ...s, page: s.page + 1 }));
  }, []);

  const prevPage = useCallback(() => {
    setState(s => ({ ...s, page: Math.max(1, s.page - 1) }));
  }, []);

  const setPageSize = useCallback((size: number) => {
    setState(s => ({ ...s, pageSize: size, page: 1 }));
  }, []);

  const reset = useCallback(() => {
    setState({
      items: [],
      loading: false,
      error: null,
      total: 0,
      page: 1,
      pageSize: 25,
    });
  }, []);

  return { ...state, search, nextPage, prevPage, setPageSize, reset };
}


