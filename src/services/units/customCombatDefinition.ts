/**
 * Shared parser for saved custom combat construction.
 *
 * @spec openspec/changes/enable-saved-custom-unit-combat/specs/custom-unit-combat/spec.md
 */

import {
  projectCustomCombatSnapshot,
  type CustomCombatSnapshot,
} from '@/types/contracts/CustomCombatSnapshot';

const CUSTOM_ID_PREFIX = 'custom-';

/**
 * Accept only a biped BattleMech snapshot whose identity matches the requested
 * custom-* reference. Id mismatch, malformed payloads, and unsupported
 * chassis types return null (callers fail closed).
 */
export function parseCustomCombatDefinition(
  payload: unknown,
  id: string,
): CustomCombatSnapshot | null {
  if (!id.startsWith(CUSTOM_ID_PREFIX)) return null;
  const definition = projectCustomCombatSnapshot(payload);
  if (
    !definition ||
    definition.id !== id ||
    definition.unitType !== 'BattleMech' ||
    definition.configuration !== 'Biped'
  ) {
    return null;
  }
  return definition;
}
