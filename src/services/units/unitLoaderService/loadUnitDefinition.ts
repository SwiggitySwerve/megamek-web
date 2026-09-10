import { UnitContract } from '@/types/contracts';

import type {
  IUnitDefinitionReader,
  IUnitDefinitionReference,
  UnitDefinitionLoadResult,
} from './definitionTypes';

import { unitContractIssues } from './unitContractIssues';

/** Validates source data without initializing equipment or creating an editor session. */
export async function loadUnitDefinition(
  reader: IUnitDefinitionReader,
  reference: IUnitDefinitionReference,
): Promise<UnitDefinitionLoadResult> {
  let payload: unknown;
  try {
    payload = await reader.read(reference);
  } catch (error) {
    return {
      success: false,
      reference,
      code: 'read-failed',
      error:
        error instanceof Error
          ? error.message
          : 'Failed to read unit definition',
    };
  }
  if (payload === null || payload === undefined) {
    return {
      success: false,
      reference,
      code: 'not-found',
      error: `${reference.source === 'canonical' ? 'Canonical' : 'Custom'} unit "${reference.id}" not found`,
    };
  }
  const parsed = UnitContract.safeParse(payload);
  if (!parsed.success) {
    const issues = unitContractIssues(parsed.error.issues);
    return {
      success: false,
      reference,
      code: 'invalid-definition',
      error: `Invalid unit definition "${reference.id}": ${issues
        .slice(0, 3)
        .map((issue) => `${issue.path || '<root>'}: ${issue.message}`)
        .join('; ')}`,
      issues,
    };
  }
  const version = parsed.data.currentVersion;
  return {
    success: true,
    definition: parsed.data,
    reference: {
      source: reference.source,
      id: reference.id,
      ...(reference.source === 'custom' &&
      typeof version === 'number' &&
      Number.isSafeInteger(version) &&
      version > 0
        ? { version }
        : {}),
    },
  };
}
