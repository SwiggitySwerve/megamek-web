import React from 'react';

import { unitNameValidator } from '@/services/units/UnitNameValidator';

import { customizerStyles as cs } from '../styles';

export function SaveUnitDialogPreview({
  chassis,
  variant,
}: {
  chassis: string;
  variant: string;
}): React.ReactElement | null {
  if (!chassis.trim() || !variant.trim()) return null;

  return (
    <div className={cs.dialog.infoPanel}>
      <div className="text-text-theme-secondary mb-1 text-xs">
        Full Unit Name:
      </div>
      <div className="text-text-theme-primary font-medium">
        {unitNameValidator.buildFullName(chassis.trim(), variant.trim())}
      </div>
    </div>
  );
}
