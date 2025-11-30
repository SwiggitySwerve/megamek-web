/**
 * Custom Variant Detail API
 * 
 * Custom variants are stored in browser IndexedDB for privacy and offline support.
 * This endpoint provides information about accessing specific variants.
 * 
 * For actual operations on a specific variant, use the CustomUnitService directly:
 * 
 * ```typescript
 * import { customUnitService } from '@/services/units/CustomUnitService';
 * 
 * // Get specific variant
 * const variant = await customUnitService.getById(variantId);
 * 
 * // Update specific variant
 * await customUnitService.update(variantId, updatedData);
 * 
 * // Delete specific variant
 * await customUnitService.delete(variantId);
 * 
 * // Check if variant exists
 * const exists = await customUnitService.exists(variantId);
 * ```
 * 
 * GET /api/custom-variants/[variantId] - Returns usage instructions for specific variant
 * 
 * @spec openspec/specs/unit-services/spec.md
 */
import type { NextApiRequest, NextApiResponse } from 'next';

interface ApiResponse {
  success: boolean;
  data?: {
    variantId: string;
    storageType: string;
    service: string;
    usage: {
      get: string;
      update: string;
      delete: string;
      exists: string;
    };
  };
  message?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const { variantId } = req.query;

  if (typeof variantId !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Invalid variant ID',
    });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Custom variant operations should be performed client-side using CustomUnitService.',
    });
  }

  return res.status(200).json({
    success: true,
    message: `Custom variant '${variantId}' is stored in browser IndexedDB. Use CustomUnitService client-side to access.`,
    data: {
      variantId,
      storageType: 'IndexedDB',
      service: '@/services/units/CustomUnitService',
      usage: {
        get: `customUnitService.getById('${variantId}')`,
        update: `customUnitService.update('${variantId}', updatedData)`,
        delete: `customUnitService.delete('${variantId}')`,
        exists: `customUnitService.exists('${variantId}')`,
      },
    },
  });
}
