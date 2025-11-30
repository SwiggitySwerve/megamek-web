/**
 * Units API
 * 
 * Query and retrieve canonical unit data.
 * 
 * GET /api/units - List/query units
 * GET /api/units?id=<id> - Get single unit by ID
 * 
 * Query Parameters:
 * - id: Get specific unit by ID
 * - techBase: Filter by tech base (INNER_SPHERE, CLAN, BOTH)
 * - era: Filter by era
 * - weightClass: Filter by weight class (LIGHT, MEDIUM, HEAVY, ASSAULT)
 * - unitType: Filter by unit type (BattleMech, Vehicle, etc.)
 * - minTonnage: Minimum tonnage
 * - maxTonnage: Maximum tonnage
 * 
 * @spec openspec/specs/unit-services/spec.md
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import { canonicalUnitService } from '@/services/units/CanonicalUnitService';
import { IUnitQueryCriteria } from '@/services/common/types';
import { TechBase } from '@/types/enums/TechBase';
import { Era } from '@/types/enums/Era';
import { WeightClass } from '@/types/enums/WeightClass';

interface ApiResponse {
  success: boolean;
  data?: unknown;
  error?: string;
  count?: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use GET.',
    });
  }

  try {
    const { id, techBase, era, weightClass, unitType, minTonnage, maxTonnage } = req.query;

    // Get single unit by ID
    if (id && typeof id === 'string') {
      const unit = await canonicalUnitService.getById(id);
      
      if (!unit) {
        return res.status(404).json({
          success: false,
          error: `Unit not found: ${id}`,
        });
      }

      return res.status(200).json({
        success: true,
        data: unit,
      });
    }

    // Build query criteria from query parameters
    const criteria: IUnitQueryCriteria = {};

    if (techBase && typeof techBase === 'string' && techBase in TechBase) {
      (criteria as { techBase: TechBase }).techBase = techBase as TechBase;
    }

    if (era && typeof era === 'string' && era in Era) {
      (criteria as { era: Era }).era = era as Era;
    }

    if (weightClass && typeof weightClass === 'string' && weightClass in WeightClass) {
      (criteria as { weightClass: WeightClass }).weightClass = weightClass as WeightClass;
    }

    if (unitType && typeof unitType === 'string') {
      (criteria as { unitType: IUnitQueryCriteria['unitType'] }).unitType = unitType as NonNullable<IUnitQueryCriteria['unitType']>;
    }

    if (minTonnage && typeof minTonnage === 'string') {
      const parsed = parseInt(minTonnage, 10);
      if (!isNaN(parsed)) {
        (criteria as { minTonnage: number }).minTonnage = parsed;
      }
    }

    if (maxTonnage && typeof maxTonnage === 'string') {
      const parsed = parseInt(maxTonnage, 10);
      if (!isNaN(parsed)) {
        (criteria as { maxTonnage: number }).maxTonnage = parsed;
      }
    }

    // Query units
    const units = await canonicalUnitService.query(criteria);

    return res.status(200).json({
      success: true,
      data: units,
      count: units.length,
    });

  } catch (error) {
    console.error('Units API error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
}
