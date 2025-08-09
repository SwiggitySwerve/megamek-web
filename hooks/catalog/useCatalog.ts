import { useMemo } from 'react'
import { CatalogService } from '../../services/catalog/CatalogService'
import { PaginatedResult } from '../../services/catalog/types'
import { CatalogItem, SearchCriteria, TechContext } from '../../services/catalog/types'

export function useCatalog(ctx: TechContext) {
  const service = useMemo(() => new CatalogService(), [])

  async function search(criteria: SearchCriteria): Promise<PaginatedResult<CatalogItem>> {
    await service.initialize(ctx)
    return service.search(criteria, ctx)
  }

  async function getById(id: string): Promise<CatalogItem | null> {
    await service.initialize(ctx)
    return service.getById(id, ctx)
  }

  return { search, getById }
}