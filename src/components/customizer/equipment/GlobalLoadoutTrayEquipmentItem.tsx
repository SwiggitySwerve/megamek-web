import React from 'react';

import { LoadoutEquipmentItem } from './GlobalLoadoutTray.types';
import {
  buildEquipmentItemView,
  EquipmentItemSummary,
  EquipmentRemoveControl,
  useEquipmentItemInteractions,
} from './GlobalLoadoutTrayEquipmentItem.helpers';

interface EquipmentItemProps {
  item: LoadoutEquipmentItem;
  isSelected: boolean;
  isOmni?: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

export function GlobalLoadoutTrayEquipmentItem({
  item,
  isSelected,
  isOmni = false,
  onSelect,
  onRemove,
  onContextMenu,
}: EquipmentItemProps): React.ReactElement {
  const initialView = buildEquipmentItemView({
    item,
    isOmni,
    isDragging: false,
    isSelected,
  });
  const interactions = useEquipmentItemInteractions({
    canDrag: initialView.canDrag,
    instanceId: item.instanceId,
    onSelect,
    onRemove,
  });
  const view = buildEquipmentItemView({
    item,
    isOmni,
    isDragging: interactions.isDragging,
    isSelected,
  });

  return (
    <div
      draggable={view.canDrag}
      onDragStart={interactions.handleDragStart}
      onDragEnd={interactions.handleDragEnd}
      className={view.rowClassName}
      onContextMenu={onContextMenu}
      title={view.tooltip}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-label={view.selectAccessibleName}
        aria-pressed={isSelected}
        className="focus-visible:ring-accent flex min-h-11 min-w-0 flex-1 items-center rounded-l-md text-left focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset"
      >
        <EquipmentItemSummary item={item} displayName={view.displayName} />
      </button>

      <div className="border-border-theme-subtle/30 ml-1 flex min-h-11 w-11 flex-shrink-0 items-center justify-center border-l">
        <EquipmentRemoveControl
          isRemovable={item.isRemovable}
          showConfirmRemove={interactions.showConfirmRemove}
          removeAccessibleName={view.removeAccessibleName}
          confirmRemoveAccessibleName={view.confirmRemoveAccessibleName}
          onRemoveClick={interactions.handleRemoveClick}
        />
      </div>
    </div>
  );
}
