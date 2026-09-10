import React from 'react';

import type { IInfantryFieldGun } from '@/types/unit/InfantryInterfaces';
import type { InfantryArmorKit } from '@/types/unit/PersonnelInterfaces';

interface InfantryStatusBarProps {
  platoonStrength: number;
  groundMP: number;
  jumpMP: number;
  fieldGuns: readonly IInfantryFieldGun[];
  armorKit: InfantryArmorKit;
}

export function InfantryStatusBar({
  platoonStrength,
  groundMP,
  jumpMP,
  fieldGuns,
  armorKit,
}: InfantryStatusBarProps): React.ReactElement {
  return (
    <div className="border-border-theme bg-surface-base rounded border px-4 py-2">
      <div className="text-text-theme-secondary flex flex-wrap gap-4 text-xs">
        <span>
          <span className="text-text-theme-primary font-medium">
            {platoonStrength}
          </span>{' '}
          troopers
        </span>
        <span>
          Ground MP:{' '}
          <span className="text-text-theme-primary font-medium">
            {groundMP}
          </span>
        </span>
        {jumpMP > 0 && (
          <span>
            Jump MP:{' '}
            <span className="text-text-theme-primary font-medium">
              {jumpMP}
            </span>
          </span>
        )}
        {fieldGuns.length > 0 && (
          <span>
            Field gun crew:{' '}
            <span className="text-text-theme-primary font-medium">
              {fieldGuns.reduce((sum, gun) => sum + gun.crewCount, 0)}
            </span>{' '}
            / {platoonStrength} troopers
          </span>
        )}
        <span>
          Armor:{' '}
          <span className="text-text-theme-primary font-medium">
            {armorKit}
          </span>
        </span>
      </div>
    </div>
  );
}
