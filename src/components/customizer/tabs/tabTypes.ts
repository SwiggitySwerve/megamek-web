import type { TechBaseMode } from '@/types/construction/TechBaseConfiguration';

export interface TabDisplayInfo {
  readonly id: string;
  readonly name: string;
  readonly isModified?: boolean;
  readonly techBaseMode?: TechBaseMode;
}
