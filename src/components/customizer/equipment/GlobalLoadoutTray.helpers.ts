import { EquipmentCategory } from '@/types/equipment';

import { CATEGORY_LABELS, CATEGORY_ORDER } from './equipmentConstants';
import { LoadoutEquipmentItem } from './GlobalLoadoutTray.types';

export interface EquipmentDisplayGroup {
  id: string;
  title: string;
  items: LoadoutEquipmentItem[];
}

export type GroupingMode = 'category' | 'location';

export function groupEquipment(
  equipment: LoadoutEquipmentItem[],
  grouping: GroupingMode,
): EquipmentDisplayGroup[] {
  const groups = new Map<string, EquipmentDisplayGroup>();

  for (const item of equipment) {
    const key =
      grouping === 'category'
        ? item.category
        : (item.isAllocated && item.location?.trim()) || 'Unassigned';
    const title =
      grouping === 'category'
        ? (CATEGORY_LABELS[item.category] ?? item.category)
        : key;
    const existing = groups.get(key);

    if (existing) {
      existing.items.push(item);
    } else {
      groups.set(key, { id: key, title, items: [item] });
    }
  }

  return Array.from(groups.values()).sort((left, right) => {
    if (grouping === 'category') {
      return (
        CATEGORY_ORDER.indexOf(left.id as EquipmentCategory) -
        CATEGORY_ORDER.indexOf(right.id as EquipmentCategory)
      );
    }
    return left.title.localeCompare(right.title);
  });
}

export function isFixedSystem(
  item: LoadoutEquipmentItem,
  isOmni: boolean,
): boolean {
  return !item.isRemovable || (isOmni && item.isOmniPodMounted === false);
}
