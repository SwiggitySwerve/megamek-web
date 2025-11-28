import { TechBase, TechBaseFilter } from '../types/core/BaseTypes';

export type TechBaseCode = 'IS' | 'Clan' | 'Mixed';

export const TechBaseUtil = {
  /**
   * Normalize a tech base string to the standard TechBase type
   */
  normalize(input: string | null | undefined, fallback: TechBase = TechBase.INNER_SPHERE): TechBase {
    if (!input) {
      return fallback;
    }
    const normalized = input.trim();
    if (normalized === 'IS' || normalized === 'Inner Sphere' || normalized === TechBase.INNER_SPHERE) {
      return TechBase.INNER_SPHERE;
    }
    if (normalized === 'Clan' || normalized === TechBase.CLAN) {
      return TechBase.CLAN;
    }
    if (normalized.startsWith('Mixed') || normalized === 'Both') {
      console.warn(`Mixed tech input "${input}" cannot be used as a concrete tech base; defaulting to ${fallback}`);
      return fallback;
    }
    
    console.warn(`Unknown tech base: ${input}, defaulting to ${fallback}`);
    return fallback;
  },

  /**
   * Convert a TechBase or filter to its code representation
   */
  toCode(techBase: TechBase | TechBaseFilter): TechBaseCode {
      switch(techBase) {
          case TechBaseFilter.MIXED: return 'Mixed';
          case TechBase.CLAN: return 'Clan';
          case TechBase.INNER_SPHERE:
          default: return 'IS';
      }
  },

  /**
   * Check if a string is a valid tech base or shorthand
   */
  isValid(input: string): boolean {
       const values: string[] = [
        TechBase.INNER_SPHERE,
        TechBase.CLAN,
        TechBaseFilter.MIXED,
        'IS',
      ];
       return values.includes(input);
  },

  /**
   * Get all valid tech bases for filtering
   */
  all(): Array<TechBase | TechBaseFilter> {
      return [TechBase.INNER_SPHERE, TechBase.CLAN, TechBaseFilter.MIXED];
  }
};
