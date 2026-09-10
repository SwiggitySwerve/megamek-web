/**
 * Server-side custom combat construction reader.
 *
 * Identity authority is the SQLite unit row. Embedded payload ids are replaced
 * with `record.id` before parsing so a forged inner id cannot select another
 * design. Chassis and variant are likewise taken from the row.
 *
 * @spec openspec/changes/enable-saved-custom-unit-combat/specs/custom-unit-combat/spec.md
 */

import type { CustomCombatSnapshot } from '@/types/contracts/CustomCombatSnapshot';

import { parseCustomCombatDefinition } from './customCombatDefinition';
import { getUnitRepository } from './UnitRepository';

const CUSTOM_ID_PREFIX = 'custom-';

function isCustomCombatId(id: string): boolean {
  return id.startsWith(CUSTOM_ID_PREFIX);
}

export function readServerCustomCombatDefinition(
  id: string,
): CustomCombatSnapshot | null {
  if (!isCustomCombatId(id)) return null;
  const record = getUnitRepository().getById(id);
  if (!record || record.id !== id || !isCustomCombatId(record.id)) {
    return null;
  }
  try {
    const data: unknown = JSON.parse(record.data);
    if (!isRecord(data)) return null;
    return parseCustomCombatDefinition(
      {
        ...data,
        id: record.id,
        chassis: record.chassis,
        variant: record.variant,
      },
      id,
    );
  } catch {
    return null;
  }
}

export function listServerCustomCombatRefs(): string[] {
  return getUnitRepository()
    .list()
    .map((row) => row.id)
    .filter(
      (id) =>
        isCustomCombatId(id) && readServerCustomCombatDefinition(id) !== null,
    );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
