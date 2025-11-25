import { TechBase } from '../types';

type NormalizableTechBase = string | TechBase | null | undefined;

const normalizeString = (value: NormalizableTechBase): string =>
  (value ?? '').toString().trim().toLowerCase();

/**
 * Normalize any tech-base string (including legacy labels like
 * "Mixed (IS Chassis)" or "Both") to the canonical enum.
 */
export function normalizeTechBase(value: NormalizableTechBase): TechBase {
  const normalized = normalizeString(value);

  if (normalized.includes('mixed') || normalized === 'both') {
    return TechBase.MIXED;
  }
  if (normalized.includes('clan')) {
    return TechBase.CLAN;
  }
  // Default to Inner Sphere for unknown/undefined inputs
  return TechBase.INNER_SPHERE;
}

export function isMixedTechBase(value: NormalizableTechBase): boolean {
  return normalizeTechBase(value) === TechBase.MIXED;
}

export function getTechBaseLabel(value: NormalizableTechBase): string {
  const normalized = normalizeTechBase(value);
  switch (normalized) {
    case TechBase.CLAN:
      return 'Clan';
    case TechBase.MIXED:
      return 'Mixed Tech';
    default:
      return 'Inner Sphere';
  }
}

export function getTechBaseAbbreviation(value: NormalizableTechBase): string {
  const normalized = normalizeTechBase(value);
  switch (normalized) {
    case TechBase.CLAN:
      return 'Clan';
    case TechBase.MIXED:
      return 'Mixed';
    default:
      return 'IS';
  }
}

export const TECH_BASE_FILTER_OPTIONS: Array<{ value: '' | TechBase; label: string }> = [
  { value: '', label: 'All Tech Bases' },
  { value: TechBase.INNER_SPHERE, label: 'Inner Sphere' },
  { value: TechBase.CLAN, label: 'Clan' },
  { value: TechBase.MIXED, label: 'Mixed Tech' },
];

