export type UnitSource = 'canonical' | 'custom';

/** Stable source identity, independent of an editor's UUID and display name. */
export interface IUnitDefinitionReference {
  readonly source: UnitSource;
  readonly id: string;
  readonly version?: number;
}
