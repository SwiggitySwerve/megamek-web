/**
 * Equipment API
 * 
 * Query and retrieve equipment data.
 * 
 * GET /api/equipment - List/query equipment
 * GET /api/equipment?id=<id> - Get single equipment by ID
 * 
 * Query Parameters:
 * - id: Get specific equipment by ID
 * - category: Filter by category (ENERGY_WEAPON, BALLISTIC_WEAPON, etc.)
 * - techBase: Filter by tech base (INNER_SPHERE, CLAN, BOTH)
 * - year: Filter by availability year
 * - search: Search by name
 * - rulesLevel: Filter by rules level
 * - maxWeight: Maximum weight in tons
 * - maxSlots: Maximum critical slots
 * 
 * @spec openspec/specs/equipment-services/spec.md
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import { equipmentLookupService } from '@/services/equipment/EquipmentLookupService';
import { IEquipmentQueryCriteria } from '@/services/common/types';
import { TechBase } from '@/types/enums/TechBase';
import { RulesLevel } from '@/types/enums/RulesLevel';
import { EquipmentCategory } from '@/types/equipment';

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
    const { 
      id, 
      category, 
      techBase, 
      year, 
      search, 
      rulesLevel,
      maxWeight,
      maxSlots 
    } = req.query;

    // Get single equipment by ID
    if (id && typeof id === 'string') {
      const equipment = equipmentLookupService.getById(id);
      
      if (!equipment) {
        return res.status(404).json({
          success: false,
          error: `Equipment not found: ${id}`,
        });
      }

      return res.status(200).json({
        success: true,
        data: equipment,
      });
    }

    // Build query criteria from query parameters
    const criteria: IEquipmentQueryCriteria = {};

    if (category && typeof category === 'string') {
      // Validate category is a valid EquipmentCategory
      const categoryValues = Object.values(EquipmentCategory);
      if (categoryValues.includes(category as EquipmentCategory)) {
        (criteria as { category: EquipmentCategory }).category = category as EquipmentCategory;
      }
    }

    if (techBase && typeof techBase === 'string' && techBase in TechBase) {
      (criteria as { techBase: TechBase }).techBase = techBase as TechBase;
    }

    if (year && typeof year === 'string') {
      const parsed = parseInt(year, 10);
      if (!isNaN(parsed)) {
        (criteria as { year: number }).year = parsed;
      }
    }

    if (search && typeof search === 'string') {
      (criteria as { nameQuery: string }).nameQuery = search;
    }

    if (rulesLevel && typeof rulesLevel === 'string' && rulesLevel in RulesLevel) {
      (criteria as { rulesLevel: RulesLevel }).rulesLevel = rulesLevel as RulesLevel;
    }

    if (maxWeight && typeof maxWeight === 'string') {
      const parsed = parseFloat(maxWeight);
      if (!isNaN(parsed)) {
        (criteria as { maxWeight: number }).maxWeight = parsed;
      }
    }

    if (maxSlots && typeof maxSlots === 'string') {
      const parsed = parseInt(maxSlots, 10);
      if (!isNaN(parsed)) {
        (criteria as { maxSlots: number }).maxSlots = parsed;
      }
    }

    // Query equipment
    const equipment = equipmentLookupService.query(criteria);

    return res.status(200).json({
      success: true,
      data: equipment,
      count: equipment.length,
    });

  } catch (error) {
    console.error('Equipment API error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
}
