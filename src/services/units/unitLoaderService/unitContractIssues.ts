import type { ZodIssue } from 'zod';

export interface IUnitContractIssue {
  readonly path: string;
  readonly message: string;
}

/** Keep actionable field paths when conditional schemas report nested union errors. */
export function unitContractIssues(
  issues: readonly ZodIssue[],
): IUnitContractIssue[] {
  const flattened = issues.flatMap((issue) =>
    issue.code === 'invalid_union'
      ? issue.errors.flatMap((branch) => unitContractIssues(branch))
      : [{ path: issue.path.join('.'), message: issue.message }],
  );
  return Array.from(
    new Map(
      flattened.map((issue) => [issue.path + ':' + issue.message, issue]),
    ).values(),
  );
}
