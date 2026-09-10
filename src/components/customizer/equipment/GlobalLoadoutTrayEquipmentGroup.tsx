import React from 'react';

import { AppIcon } from '@/components/ui/AppIcon';
import { getEquipmentSlotClasses } from '@/utils/colors/equipmentColors';
import { getLocationShorthand } from '@/utils/locationUtils';

import { trayStyles } from './GlobalLoadoutTray.styles';
import { LoadoutEquipmentItem } from './GlobalLoadoutTray.types';
import { GlobalLoadoutTrayEquipmentItem } from './GlobalLoadoutTrayEquipmentItem';

interface EquipmentGroupProps {
  items: LoadoutEquipmentItem[];
  isExpanded: boolean;
  isOmni?: boolean;
  selectedId?: string | null;
  onToggle: () => void;
  onSelect: (id: string | null) => void;
  onRemove: (id: string) => void;
  onContextMenu: (event: React.MouseEvent, item: LoadoutEquipmentItem) => void;
}

function getGroupLocation(item: LoadoutEquipmentItem): string {
  return item.isAllocated && item.location
    ? getLocationShorthand(item.location)
    : 'Unassigned';
}

export function GlobalLoadoutTrayEquipmentGroup({
  items,
  isExpanded,
  isOmni = false,
  selectedId,
  onToggle,
  onSelect,
  onRemove,
  onContextMenu,
}: EquipmentGroupProps): React.ReactElement {
  const [representative] = items;
  const location = getGroupLocation(representative);
  const count = items.length;
  const groupName = `${representative.name} in ${location}`;

  if (count === 1) {
    return (
      <GlobalLoadoutTrayEquipmentItem
        item={representative}
        isOmni={isOmni}
        isSelected={selectedId === representative.instanceId}
        onSelect={() =>
          onSelect(
            selectedId === representative.instanceId
              ? null
              : representative.instanceId,
          )
        }
        onRemove={() => onRemove(representative.instanceId)}
        onContextMenu={(event) => onContextMenu(event, representative)}
      />
    );
  }

  return (
    <div
      className={`my-0.5 rounded-md border-2 border-solid ${getEquipmentSlotClasses(representative.category, representative.name)}`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-label={`${isExpanded ? 'Hide' : 'Show'} ${count} instances of ${groupName}`}
        className="focus-visible:ring-accent flex min-h-11 w-full items-center gap-2 rounded-md px-2 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset"
      >
        <AppIcon
          name="chevron-right"
          size="inline"
          aria-hidden="true"
          className={isExpanded ? 'rotate-90' : ' '}
        />
        <span className="min-w-0 flex-1">
          <span
            className={`block truncate leading-tight text-inherit ${trayStyles.text.primary}`}
          >
            {representative.name}
          </span>
          <span
            className={`mt-0.5 block leading-tight text-inherit ${trayStyles.text.secondary}`}
          >
            {location} · {representative.weight}t ·{' '}
            {representative.criticalSlots} slot
            {representative.criticalSlots === 1 ? '' : 's'}
          </span>
        </span>
        <span
          className="border-border-theme bg-surface-base text-text-theme-primary min-w-6 rounded border px-1.5 py-0.5 text-center text-[10px] tabular-nums"
          aria-hidden="true"
        >
          ×{count}
        </span>
      </button>

      {isExpanded && (
        <div className="border-border-theme-subtle/50 border-t px-1 py-1">
          {items.map((item) => (
            <GlobalLoadoutTrayEquipmentItem
              key={item.instanceId}
              item={item}
              isOmni={isOmni}
              isSelected={selectedId === item.instanceId}
              onSelect={() =>
                onSelect(
                  selectedId === item.instanceId ? null : item.instanceId,
                )
              }
              onRemove={() => onRemove(item.instanceId)}
              onContextMenu={(event) => onContextMenu(event, item)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
