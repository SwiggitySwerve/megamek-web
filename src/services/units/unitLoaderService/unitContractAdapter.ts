import { UnitContract } from '@/types/contracts';

import { IRawSerializedUnit } from './types';
/** Validated compatibility adapter for typed BattleMech configuration mapping. */
import { unitContractIssues } from './unitContractIssues';

/**
 * Thrown when `parseUnit` cannot validate input against `UnitContract`.
 *
 * Carries the Zod issue list (first 5) so test output and CI logs can
 * pinpoint the offending field without re-running the parse.
 */
export class UnitContractParseError extends Error {
  /** First 5 Zod issues, preserved verbatim for debugging. */
  readonly issues: ReadonlyArray<{
    readonly path: string;
    readonly message: string;
  }>;

  constructor(
    issues: ReadonlyArray<{
      readonly path: string;
      readonly message: string;
    }>,
    sourceLabel: string,
  ) {
    const summary = issues
      .slice(0, 5)
      .map((issue) => `  ${issue.path || '<root>'}: ${issue.message}`)
      .join('\n');
    super(
      `parseUnit: UnitContract.safeParse failed for ${sourceLabel}:\n${summary}`,
    );
    this.name = 'UnitContractParseError';
    this.issues = issues;
  }
}

/**
 * Parse arbitrary JSON through `UnitContract` and return the
 * boundary-shape unit usable by `UnitLoaderService.mapToUnitState`.
 *
 * Throws `UnitContractParseError` on validation failure. Successful
 * parses produce a value compatible with `IRawSerializedUnit`: the
 * Zod-inferred shape is a structural subset (every required field plus
 * permissive optionals), and the `[key: string]: unknown` catchall on
 * `IRawSerializedUnit` accepts any extra fields the schema allows.
 *
 * @param json    Untyped input — typically `JSON.parse(...)` output, a
 *                fetched response body, or imported JSON.
 * @param sourceLabel Human-readable label used in error messages
 *                    ("Atlas AS7-D.json", "POST /api/custom-units/123",
 *                    etc.). Defaults to "<json input>".
 */
export function parseUnit(
  json: unknown,
  sourceLabel = '<json input>',
): IRawSerializedUnit {
  const result = UnitContract.safeParse(json);
  if (!result.success) {
    const issues = unitContractIssues(result.error.issues);
    throw new UnitContractParseError(issues, sourceLabel);
  }
  // Zod's inferred type is a permissive structural subset of
  // IRawSerializedUnit; the index signature makes the cast safe at this
  // boundary because we've just proven the runtime shape conforms.
  return result.data as IRawSerializedUnit;
}

/**
 * Safe variant: returns either the parsed unit or a structured failure
 * record. Use when the caller wants to handle drift without try/catch
 * (e.g. batch-import flows that need to surface per-file errors).
 */
export function safeParseUnit(
  json: unknown,
):
  | { success: true; unit: IRawSerializedUnit }
  | { success: false; error: UnitContractParseError } {
  try {
    const unit = parseUnit(json);
    return { success: true, unit };
  } catch (err) {
    if (err instanceof UnitContractParseError) {
      return { success: false, error: err };
    }
    throw err;
  }
}
