/**
 * Armor Diagram Settings
 *
 * Split-panel layout for selecting armor diagram variant.
 * Left: list with thumbnails, Right: large preview.
 * Uses draft/save pattern for consistency with appearance settings.
 *
 * Includes a mech type selector to preview different unit configurations
 * (Biped, Quad, Tripod, LAM, QuadVee).
 */

import React, { useEffect, useState } from 'react';

import type { MechConfigType } from '@/types/construction/MechConfigType';

import { AppIcon } from '@/components/ui/AppIcon';
import {
  resolveArmorDiagramVariant,
  useCustomizerSettingsStore,
} from '@/stores/useCustomizerSettingsStore';
import { MECH_CONFIG_DISPLAY_NAMES } from '@/types/construction/MechConfigType';

import {
  ArmorDiagramPreview,
  DIAGRAM_VARIANT_INFO,
} from './ArmorDiagramPreview';
import { getMechConfigTypes } from './shared/layout/useResolvedLayout';
import { ALL_VARIANTS, DEFAULT_VARIANT } from './shared/VariantConstants';
import { VariantThumbnail } from './VariantThumbnail';

interface ArmorDiagramSettingsProps {
  className?: string;
}

export function ArmorDiagramSettings({
  className = '',
}: ArmorDiagramSettingsProps): React.ReactElement {
  const initDraftCustomizer = useCustomizerSettingsStore(
    (s) => s.initDraftCustomizer,
  );
  const saveCustomizer = useCustomizerSettingsStore((s) => s.saveCustomizer);
  const hasUnsavedCustomizer = useCustomizerSettingsStore(
    (s) => s.hasUnsavedCustomizer,
  );
  const setDraftArmorDiagramVariant = useCustomizerSettingsStore(
    (s) => s.setDraftArmorDiagramVariant,
  );
  const storedEffectiveVariant = useCustomizerSettingsStore(
    (s) => s.draftCustomizer?.armorDiagramVariant ?? s.armorDiagramVariant,
  );

  // Track hydration to avoid SSR mismatch (server doesn't have localStorage values)
  const [hasMounted, setHasMounted] = useState(false);

  // Mech type selector for preview (local state, not persisted)
  const [previewMechType, setPreviewMechType] =
    useState<MechConfigType>('biped');

  // Use default on server, actual value after mount
  const effectiveVariant = hasMounted
    ? resolveArmorDiagramVariant(storedEffectiveVariant)
    : DEFAULT_VARIANT;

  // Initialize draft and mark as mounted
  useEffect(() => {
    setHasMounted(true);
    initDraftCustomizer();
  }, [initDraftCustomizer]);

  // Use centralized variant list
  const variants = ALL_VARIANTS;
  const mechConfigTypes = getMechConfigTypes();

  return (
    <div className={className}>
      {/* Mech Type Selector Bar */}
      <div className="bg-surface-raised/50 border-border-theme mb-4 rounded-lg border p-1">
        <div className="flex gap-1">
          {mechConfigTypes.map((configType) => {
            const isSelected = previewMechType === configType;
            return (
              <button
                key={configType}
                onClick={() => setPreviewMechType(configType)}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-accent text-on-accent shadow-sm'
                    : 'text-text-theme-secondary hover:text-text-theme-primary hover:bg-surface-raised'
                }`}
              >
                {MECH_CONFIG_DISPLAY_NAMES[configType]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Responsive layout: stacked on mobile, side-by-side on desktop */}
      <div className="flex flex-col gap-4 md:flex-row">
        {/* Variant list: full width on mobile, fixed width on desktop */}
        <div className="w-full space-y-1 md:w-48">
          {variants.map((variant) => {
            const info = DIAGRAM_VARIANT_INFO[variant];
            const isSelected = effectiveVariant === variant;

            return (
              <button
                key={variant}
                onClick={() => setDraftArmorDiagramVariant(variant)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                  isSelected
                    ? 'bg-accent/20 border-accent border'
                    : 'bg-surface-raised/30 hover:bg-surface-raised hover:border-border-theme border border-transparent'
                }`}
              >
                <VariantThumbnail variant={variant} />
                <div className="min-w-0 flex-1">
                  <div
                    className={`text-sm font-medium ${isSelected ? 'text-accent' : 'text-text-theme-primary'}`}
                  >
                    {info.name}
                  </div>
                  <div className="text-text-theme-secondary truncate text-xs">
                    {info.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Preview: below on mobile, right side on desktop */}
        <div className="min-w-0 flex-1">
          <ArmorDiagramPreview
            variant={effectiveVariant}
            mechConfigType={previewMechType}
          />
        </div>
      </div>

      {/* Save indicator */}
      {hasUnsavedCustomizer && (
        <div className="mt-4 flex items-center justify-between rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
          <div className="flex items-center gap-2">
            <AppIcon
              name="info"
              size="control"
              className="text-amber-400"
              aria-hidden="true"
            />
            <span className="text-sm text-amber-200">
              Diagram style preview active — save to keep changes
            </span>
          </div>
          <button
            onClick={saveCustomizer}
            className="text-text-theme-primary rounded-md bg-amber-600 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-amber-500"
          >
            Save Diagram Style
          </button>
        </div>
      )}
    </div>
  );
}
