import { EquipmentCategory, type IEquipmentItem } from '@/types/equipment';

const WEAPON_CATEGORIES: ReadonlySet<EquipmentCategory> = new Set([
  EquipmentCategory.ENERGY_WEAPON,
  EquipmentCategory.BALLISTIC_WEAPON,
  EquipmentCategory.MISSILE_WEAPON,
  EquipmentCategory.ARTILLERY,
  EquipmentCategory.CAPITAL_WEAPON,
  EquipmentCategory.PHYSICAL_WEAPON,
]);

export function isWeaponCategory(category: EquipmentCategory): boolean {
  return WEAPON_CATEGORIES.has(category);
}

function normalizeIdentity(identity: string): string {
  return identity.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/** Exact fallback for imported ammunition whose compatibility list is absent. */
function ammunitionIdentity(identity: string): string {
  return normalizeIdentity(
    identity
      .replace(/^ammo[-\s]+/i, '')
      .replace(/[-\s]+ammo(?:unition)?$/i, ''),
  );
}

export function createAmmoWeaponMatcher(
  weaponIds: readonly string[],
  equipment: readonly IEquipmentItem[],
): (ammunition: IEquipmentItem) => boolean {
  const mountedIds = new Set(weaponIds);
  const identities = new Set(weaponIds.map(normalizeIdentity));
  for (const item of equipment) {
    if (mountedIds.has(item.id) && isWeaponCategory(item.category)) {
      identities.add(normalizeIdentity(item.name));
    }
  }
  return (ammunition) => {
    if (ammunition.compatibleWeaponIds?.length) {
      return ammunition.compatibleWeaponIds.some((id) => mountedIds.has(id));
    }
    return (
      identities.has(ammunitionIdentity(ammunition.id)) ||
      identities.has(ammunitionIdentity(ammunition.name))
    );
  };
}
