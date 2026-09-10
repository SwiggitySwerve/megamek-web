import type { ISerializedFluff } from '@/types/unit/UnitSerialization';

import type { UnitSliceSetFn } from './unitSliceTypes';

import { modifiedPatch } from '../unitStoreIdentityActions';

export interface UnitFluffActions {
  setRole: (role: string) => void;
  updateFluff: (patch: Partial<ISerializedFluff>) => void;
}

/** Actions for editable descriptive fields on an isolated unit draft. */
export function createFluffSlice(set: UnitSliceSetFn): UnitFluffActions {
  return {
    setRole: (role) => set(modifiedPatch({ role })),
    updateFluff: (patch) =>
      set((state) =>
        modifiedPatch({
          fluff: {
            ...state.fluff,
            ...patch,
          },
        }),
      ),
  };
}
