import type { IUnitContract } from '@/types/contracts';
import type { IUnitDefinitionReference } from '@/types/unit/UnitDefinition';
export type {
  UnitSource,
  IUnitDefinitionReference,
} from '@/types/unit/UnitDefinition';

export interface IUnitDefinitionReader {
  read(reference: IUnitDefinitionReference): Promise<unknown | null>;
}

export type UnitDefinitionLoadResult =
  | {
      readonly success: true;
      readonly definition: IUnitContract;
      readonly reference: IUnitDefinitionReference;
    }
  | {
      readonly success: false;
      readonly reference: IUnitDefinitionReference;
      readonly code: 'not-found' | 'read-failed' | 'invalid-definition';
      readonly error: string;
      readonly issues?: ReadonlyArray<{
        readonly path: string;
        readonly message: string;
      }>;
    };
