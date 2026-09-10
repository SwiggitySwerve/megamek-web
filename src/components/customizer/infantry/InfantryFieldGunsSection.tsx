import React from 'react';

import type { IInfantryFieldGun } from '@/types/unit/InfantryInterfaces';
import type { IFieldGunCatalogEntry } from '@/types/unit/InfantryInterfaces';

import { customizerStyles as cs } from '../styles';

interface InfantryFieldGunsSectionProps {
  readOnly: boolean;
  canUseFieldGuns: boolean;
  fieldGuns: readonly IInfantryFieldGun[];
  addedFieldGunIds: ReadonlySet<string>;
  catalog: readonly IFieldGunCatalogEntry[];
  onAddFieldGun: (gunId: string) => void;
  onRemoveFieldGun: (equipmentId: string) => void;
  onFieldGunAmmo: (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
}

export function InfantryFieldGunsSection({
  readOnly,
  canUseFieldGuns,
  fieldGuns,
  addedFieldGunIds,
  catalog,
  onAddFieldGun,
  onRemoveFieldGun,
  onFieldGunAmmo,
}: InfantryFieldGunsSectionProps): React.ReactElement {
  return (
    <div className={cs.panel.main}>
      <h3 className={cs.text.sectionTitle}>Field Guns</h3>
      {!canUseFieldGuns && (
        <p className="mb-4 text-xs text-amber-400">
          Field guns require Foot or Motorized motive.
        </p>
      )}
      {fieldGuns.length > 0 ? (
        <div className="mb-4 space-y-2">
          {fieldGuns.map((gun, idx) => (
            <div
              key={gun.equipmentId}
              className="bg-surface-raised border-border-theme flex items-center gap-3 rounded border px-3 py-2"
            >
              <span className="text-text-theme-primary flex-1 text-sm">
                {gun.name}
                <span className="text-text-theme-secondary ml-2 text-xs">
                  (crew: {gun.crewCount})
                </span>
              </span>
              <label className="text-text-theme-secondary flex items-center gap-1 text-xs">
                Ammo:
                <input
                  type="number"
                  value={gun.ammoRounds}
                  onChange={(event) => onFieldGunAmmo(idx, event)}
                  disabled={readOnly}
                  min={0}
                  className="bg-surface-base border-border-theme text-text-theme-primary ml-1 w-16 rounded border px-1 py-0.5 text-sm"
                />
              </label>
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => onRemoveFieldGun(gun.equipmentId)}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-text-theme-secondary mb-4 text-xs">
          No field guns assigned.
        </p>
      )}

      {!readOnly && (
        <div className="flex items-center gap-3">
          <label className={cs.text.label}>Add Field Gun</label>
          <select
            className={cs.select.full}
            defaultValue=""
            disabled={!canUseFieldGuns}
            onChange={(event) => {
              if (event.target.value) {
                onAddFieldGun(event.target.value);
                event.target.value = '';
              }
            }}
          >
            <option value="">Select field gun to add...</option>
            {catalog.map((gun) => (
              <option
                key={gun.id}
                value={gun.id}
                disabled={addedFieldGunIds.has(gun.id)}
              >
                {gun.name} (crew {gun.crewRequired})
                {addedFieldGunIds.has(gun.id) ? ' - added' : ''}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
