import React, { useId, useMemo } from 'react';

import { AppIcon } from '@/components/ui/AppIcon';
import { Button } from '@/components/ui/Button';
import { IEquipmentItem } from '@/types/equipment';
import { getCategoryColors } from '@/utils/colors/equipmentColors';
import { getWeaponById } from '@/utils/equipment/weapons/utilities';

import workbenchStyles from '../CustomizerWorkbench.module.css';

interface EquipmentCatalogCardProps {
  equipment: IEquipmentItem;
  expanded: boolean;
  readOnly: boolean;
  onInspect: () => void;
  onAdd: () => void;
  onAddAndPlace?: () => void;
}

export function EquipmentCatalogCard({
  equipment,
  expanded,
  readOnly,
  onInspect,
  onAdd,
  onAddAndPlace,
}: EquipmentCatalogCardProps): React.ReactElement {
  const detailId = useId();
  const weapon = useMemo(() => getWeaponById(equipment.id), [equipment.id]);
  const variable = Boolean(equipment.variableEquipmentId);
  const colors = getCategoryColors(equipment.category);
  return (
    <li
      className={`group text-text-theme-primary relative isolate rounded-lg border border-solid ${colors.slotBorder} ${expanded ? 'ring-accent ring-2' : ''}`}
      data-testid="equipment-catalog-row"
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 -z-10 rounded-[inherit] ${colors.slotBg} ${expanded ? 'opacity-40' : 'opacity-30 group-hover:opacity-40'}`}
        data-testid="equipment-catalog-row-fill"
      />
      <div
        className={`${workbenchStyles.catalogColumns} flex items-center gap-3 lg:grid`}
      >
        <button
          type="button"
          data-catalog-column="name"
          onClick={onInspect}
          aria-label={`Details for ${equipment.name}`}
          aria-expanded={expanded}
          aria-controls={detailId}
          className="focus-visible:ring-accent min-h-11 min-w-0 flex-1 rounded text-left focus-visible:ring-2 lg:w-full lg:flex-none lg:text-center"
        >
          <span
            className="block truncate text-sm font-semibold text-inherit"
            title={equipment.name}
          >
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
          data-catalog-column="category"
          className="hidden min-w-0 truncate text-xs text-inherit lg:block"
          title={equipment.category}
        >
          {equipment.category}
        </span>
        <span
          data-catalog-column="weight"
          className="hidden text-xs text-inherit tabular-nums lg:block"
        >
          {variable ? 'Variable' : equipment.weight}
        </span>
        <span
          data-catalog-column="criticalSlots"
          className="hidden text-xs text-inherit tabular-nums lg:block"
        >
          {variable ? 'Variable' : equipment.criticalSlots}
        </span>
        <span
          data-catalog-column="heat"
          className="hidden text-xs text-inherit tabular-nums lg:block"
        >
          {weapon?.heat ?? '—'}
        </span>
        <div
          data-catalog-column="actions"
          className="flex h-11 w-11 shrink-0 items-center justify-center"
        >
          <Button
            size="sm"
            variant="ghost"
            disabled={readOnly}
            onClick={onAdd}
            title={`Add ${equipment.name}`}
            aria-label={`Add ${equipment.name}`}
            className={`!h-11 !min-h-11 !w-11 !min-w-11 !p-0 ${workbenchStyles.catalogAddHit}`}
          >
            <span className={workbenchStyles.catalogAddGlyph}>
              <AppIcon name="add" size="inline" aria-hidden="true" />
            </span>
          </Button>
        </div>
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
          {onAddAndPlace && (
            <div className="mt-3">
              <Button
                size="sm"
                variant="secondary"
                disabled={readOnly}
                onClick={onAddAndPlace}
                title={`Add and place ${equipment.name}`}
                aria-label={`Add and place ${equipment.name}`}
              >
                Add + place
              </Button>
            </div>
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
