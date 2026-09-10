import React from 'react';

import {
  useAppearanceStore,
  FontSize,
  AnimationLevel,
} from '@/stores/useAppearanceStore';

import {
  SettingsSection,
  SettingsSectionProps,
  Toggle,
  Select,
  AccentColorPicker,
  UIThemePicker,
} from './SettingsShared';

export function AppearanceSettings({
  isExpanded,
  onToggle,
  onRef,
}: SettingsSectionProps): React.ReactElement {
  const initDraftAppearance = useAppearanceStore((s) => s.initDraftAppearance);
  const saveOtherAppearance = useAppearanceStore((s) => s.saveOtherAppearance);
  const hasUnsavedOtherAppearance = useAppearanceStore(
    (s) => s.hasUnsavedOtherAppearance,
  );

  const draftAppearance = useAppearanceStore((s) => s.draftAppearance);
  const savedAccentColor = useAppearanceStore((s) => s.accentColor);
  const savedUITheme = useAppearanceStore((s) => s.uiTheme);
  const savedFontSize = useAppearanceStore((s) => s.fontSize);
  const savedAnimationLevel = useAppearanceStore((s) => s.animationLevel);
  const savedCompactMode = useAppearanceStore((s) => s.compactMode);

  const effectiveAccentColor = draftAppearance?.accentColor ?? savedAccentColor;
  const effectiveUITheme = draftAppearance?.uiTheme ?? savedUITheme;
  const effectiveFontSize = draftAppearance?.fontSize ?? savedFontSize;
  const effectiveAnimationLevel =
    draftAppearance?.animationLevel ?? savedAnimationLevel;
  const effectiveCompactMode = draftAppearance?.compactMode ?? savedCompactMode;

  const setAccentColor = useAppearanceStore((s) => s.setAccentColor);
  const setUITheme = useAppearanceStore((s) => s.setUITheme);
  const [colorSaveFailed, setColorSaveFailed] = React.useState(false);
  const saveColor = (update: () => void) => {
    try {
      update();
      setColorSaveFailed(false);
    } catch {
      setColorSaveFailed(true);
    }
  };
  const setDraftFontSize = useAppearanceStore((s) => s.setDraftFontSize);
  const setDraftAnimationLevel = useAppearanceStore(
    (s) => s.setDraftAnimationLevel,
  );
  const setDraftCompactMode = useAppearanceStore((s) => s.setDraftCompactMode);

  React.useEffect(() => {
    initDraftAppearance();
  }, [initDraftAppearance]);

  return (
    <SettingsSection
      id="appearance"
      title="Appearance"
      description="Colors apply immediately and save automatically on this device. Preview and save font, motion, and spacing changes below."
      isExpanded={isExpanded}
      onToggle={onToggle}
      onRef={onRef}
    >
      <UIThemePicker
        value={effectiveUITheme}
        onChange={(theme) => saveColor(() => setUITheme(theme))}
      />
      <AccentColorPicker
        value={effectiveAccentColor}
        onChange={(color) => saveColor(() => setAccentColor(color))}
      />
      {colorSaveFailed ? (
        <div
          role="alert"
          className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-300"
        >
          Couldn’t save colors on this device. Your changes apply for this
          session.
          <button
            type="button"
            className="ml-2 underline"
            onClick={() => saveColor(() => setUITheme(effectiveUITheme))}
          >
            Retry saving colors
          </button>
        </div>
      ) : (
        <p role="status" className="text-text-theme-secondary text-sm">
          Colors save automatically on this device.
        </p>
      )}

      <Select<FontSize>
        label="Font Size"
        description="Base font size for the application"
        value={effectiveFontSize}
        onChange={setDraftFontSize}
        options={[
          { value: 'small', label: 'Small (14px)' },
          { value: 'medium', label: 'Medium (16px)' },
          { value: 'large', label: 'Large (18px)' },
        ]}
      />

      <Select<AnimationLevel>
        label="Animation Level"
        description="Control the amount of motion and transitions"
        value={effectiveAnimationLevel}
        onChange={setDraftAnimationLevel}
        options={[
          { value: 'full', label: 'Full - All animations enabled' },
          {
            value: 'reduced',
            label: 'Reduced - Essential animations only',
          },
          { value: 'none', label: 'None - Disable all animations' },
        ]}
      />

      <Toggle
        label="Compact Mode"
        description="Reduce spacing and padding for more information density"
        checked={effectiveCompactMode}
        onChange={setDraftCompactMode}
      />

      <div className="border-border-theme-subtle border-t pt-4">
        <div className="flex items-center justify-between">
          <div className="text-text-theme-secondary text-sm">
            {hasUnsavedOtherAppearance
              ? 'You have unsaved appearance changes'
              : 'Appearance settings saved'}
          </div>
          <button
            onClick={saveOtherAppearance}
            disabled={!hasUnsavedOtherAppearance}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              hasUnsavedOtherAppearance
                ? 'bg-accent hover:bg-accent-hover text-on-accent'
                : 'bg-surface-raised text-text-theme-muted cursor-not-allowed'
            }`}
          >
            Save Appearance
          </button>
        </div>
      </div>
    </SettingsSection>
  );
}
