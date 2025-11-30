/**
 * Custom Variants API
 * 
 * Custom variants are stored in browser IndexedDB for privacy and offline support.
 * This endpoint provides information about the client-side storage system.
 * 
 * For actual CRUD operations, use the CustomUnitService directly in client code:
 * 
 * ```typescript
 * import { customUnitService } from '@/services/units/CustomUnitService';
 * 
 * // List all custom variants
 * const variants = await customUnitService.list();
 * 
 * // Create new variant
 * const id = await customUnitService.create(unitData);
 * 
 * // Update variant
 * await customUnitService.update(id, updatedData);
 * 
 * // Delete variant
 * await customUnitService.delete(id);
 * ```
 * 
 * GET /api/custom-variants - Returns storage info and usage instructions
 * 
 * @spec openspec/specs/unit-services/spec.md
 */
import type { NextApiRequest, NextApiResponse } from 'next';

interface ApiResponse {
  success: boolean;
  data?: {
    storageType: string;
    location: string;
    service: string;
    usage: {
      list: string;
      create: string;
      update: string;
      delete: string;
      getById: string;
    };
  };
  message?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Custom variant operations should be performed client-side using CustomUnitService.',
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Custom variants are stored in browser IndexedDB for privacy and offline support.',
    data: {
      storageType: 'IndexedDB',
      location: 'Browser local storage',
      service: '@/services/units/CustomUnitService',
      usage: {
        list: 'customUnitService.list()',
        create: 'customUnitService.create(unit)',
        update: 'customUnitService.update(id, unit)',
        delete: 'customUnitService.delete(id)',
        getById: 'customUnitService.getById(id)',
      },
    },
  });
}
