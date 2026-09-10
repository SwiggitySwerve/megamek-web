import React from 'react';

import type { ArmorDiagramVariant } from '@/stores/useCustomizerSettingsStore';

import { BipedArmorSurface } from './variants/BipedArmorSurface';
import { BIPED_ARMOR_PLATES } from './variants/CleanTechBipedDiagram.geometry';

interface VariantThumbnailProps {
  variant: ArmorDiagramVariant;
  className?: string;
}

export function VariantThumbnail({
  variant,
  className = '',
}: VariantThumbnailProps): React.ReactElement {
  return (
    <svg
      viewBox="0 0 360 440"
      className={`h-[60px] w-10 ${className}`}
      aria-label={`${variant} style preview`}
      role="img"
    >
      {Object.entries(BIPED_ARMOR_PLATES).map(([location, plate]) => (
        <BipedArmorSurface
          key={location}
          path={plate.path}
          variant={variant}
          current={1}
          maximum={1}
          preview
        />
      ))}
    </svg>
  );
}
