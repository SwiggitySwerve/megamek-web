import React, { useId, useMemo } from 'react';

import { Button } from '@/components/ui/Button';
import { IEquipmentItem } from '@/types/equipment';
import { getEquipmentSlotClasses } from '@/utils/colors/equipmentColors';
import { getWeaponById } from '@/utils/equipment/weapons/utilities';

import workbenchStyles from '../CustomizerWorkbench.module.css';

interface EquipmentCatalogCardProps {
  equipment: IEquipmentItem;
  expanded: boolean;
  readOnly: boolean;
  onInspect: () => void;
  onAdd: () => void;
}

export function EquipmentCatalogCard({
  equipment,
  expanded,
  readOnly,
  onInspect,
  onAdd,
}: EquipmentCatalogCardProps): React.ReactElement {
  const detailId = useId();
  const weapon = useMemo(() => getWeaponById(equipment.id), [equipment.id]);
  const variable = Boolean(equipment.variableEquipmentId);
  return (
    <li
      className={`rounded-lg border-2 border-solid ${getEquipmentSlotClasses(equipment.category, equipment.name)} ${expanded ? 'ring-accent ring-2' : ''}`}
    >
      <div
        className={`${workbenchStyles.catalogColumns} flex items-center gap-3 px-3 py-px`}
      >
        <button
          type="button"
          onClick={onInspect}
          aria-label={`Details for ${equipment.name}`}
          aria-expanded={expanded}
          aria-controls={detailId}
          className="focus-visible:ring-accent min-h-11 min-w-0 flex-1 rounded text-left focus-visible:ring-2"
        >
          <span className="block text-sm font-semibold text-inherit">
            {equipment.name}
          </span>
          <span className="mt-1 block text-xs text-inherit lg:hidden">
            {equipment.category} · {equipment.techBase}
          </span>
          <span className="mt-1 block text-xs text-inherit tabular-nums lg:hidden">
            {variable
              ? 'Variable weight / slots'
              : `${equipment.weight} t · ${equipment.criticalSlots} critical ${equipment.criticalSlots === 1 ? 'slot' : 'slots'}`}{' '}
            · {expanded ? 'Hide details' : 'View details'}
          </span>
        </button>
        <span
          className="hidden truncate text-xs text-inherit lg:block"
          title={equipment.category}
        >
          {equipment.category}
        </span>
        <span className="hidden text-right text-xs text-inherit tabular-nums lg:block">
          {variable ? 'Variable' : equipment.weight}
        </span>
        <span className="hidden text-right text-xs text-inherit tabular-nums lg:block">
          {variable ? 'Variable' : equipment.criticalSlots}
        </span>
        <span className="hidden text-right text-xs text-inherit tabular-nums lg:block">
          {weapon?.heat ?? '—'}
        </span>
        <Button
          size="sm"
          variant="secondary"
          disabled={readOnly}
          onClick={onAdd}
          title={`Add ${equipment.name}`}
          aria-label={`Add ${equipment.name}`}
        >
          Add
        </Button>
      </div>
      {expanded && (
        <div id={detailId} className="border-border-theme-subtle border-t p-3">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-3">
            <Detail label="Introduced" value={equipment.introductionYear} />
            <Detail label="Rules" value={equipment.rulesLevel} />
            <Detail
              label="Cost"
              value={equipment.costCBills?.toLocaleString()}
              suffix=" C-bills"
            />
            <Detail label="Battle value" value={equipment.battleValue} />
            {weapon && (
              <>
                <Detail label="Damage" value={weapon.damage} />
                <Detail label="Heat" value={weapon.heat} />
              </>
            )}
            {weapon?.ranges && (
              <Detail
                label="Range (S / M / L)"
                value={`${weapon.ranges.short} / ${weapon.ranges.medium} / ${weapon.ranges.long}`}
              />
            )}
            {weapon?.ranges?.minimum ? (
              <Detail label="Minimum range" value={weapon.ranges.minimum} />
            ) : null}
          </dl>
          {variable && (
            <p className="mt-3 text-xs text-inherit">
              Weight and slots are calculated for this unit when added. Check
              the loadout for the resulting values.
            </p>
          )}
        </div>
      )}
    </li>
  );
}

function Detail({
  label,
  value,
  suffix = '',
}: {
  label: string;
  value: string | number | undefined;
  suffix?: string;
}): React.ReactElement {
  return (
    <div>
      <dt className="text-xs text-inherit">{label}</dt>
      <dd className="mt-1 font-medium text-inherit">
        {value === undefined ? '—' : `${value}${suffix}`}
      </dd>
    </div>
  );
}
