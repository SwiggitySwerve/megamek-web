/**
 * GlobalStyleProvider
 *
 * Connects app settings to CSS custom properties and theme classes.
 * Wrap your app with this component to enable dynamic styling.
 *
 * Uses "effective" values which are draft values (for live preview)
 * if they exist, otherwise uses saved/persisted values.
 */

'use client';

import { useEffect } from 'react';

import { UI_THEMES } from '@/constants/appearance';
import { useAccessibilityStore } from '@/stores/useAccessibilityStore';
import {
  useAppearanceStore,
  ACCENT_COLOR_CSS,
  FONT_SIZE_CSS,
} from '@/stores/useAppearanceStore';

/**
 * Applies user settings as CSS custom properties on document root
 * and theme classes on document body.
 */
export function GlobalStyleProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  // Use saved values as base
  const savedAccentColor = useAppearanceStore((s) => s.accentColor);
  const savedFontSize = useAppearanceStore((s) => s.fontSize);
  const savedUITheme = useAppearanceStore((s) => s.uiTheme);
  const reduceMotion = useAccessibilityStore((s) => s.reduceMotion);

  // Use draft values for live preview if they exist
  const draftAppearance = useAppearanceStore((s) => s.draftAppearance);

  // Effective values: draft if exists, otherwise saved
  const accentColor = draftAppearance?.accentColor ?? savedAccentColor;
  const fontSize = draftAppearance?.fontSize ?? savedFontSize;
  const uiTheme = draftAppearance?.uiTheme ?? savedUITheme;

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Apply accent color CSS variables
    const colors = ACCENT_COLOR_CSS[accentColor];
    root.style.setProperty('--accent-primary', colors.primary);
    root.style.setProperty('--accent-hover', colors.hover);
    root.style.setProperty('--accent-muted', colors.muted);

    // Apply font size
    root.style.setProperty('--font-size-base', FONT_SIZE_CSS[fontSize]);

    // Apply theme class (remove old, add new)
    const themeClasses = UI_THEMES.map((theme) => `theme-${theme}`);
    for (const element of [root, body]) {
      themeClasses.forEach((cls) => element.classList.remove(cls));
      element.classList.add(`theme-${uiTheme}`);
    }
    root.dataset.colorScheme = 'dark';
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute(
        'content',
        getComputedStyle(root).getPropertyValue('--surface-deep').trim(),
      );

    // Apply reduce motion class
    if (reduceMotion) {
      body.classList.add('reduce-motion');
    } else {
      body.classList.remove('reduce-motion');
    }
  }, [accentColor, fontSize, uiTheme, reduceMotion]);

  useEffect(() => {
    const syncAppearance = (event: StorageEvent) => {
      if (event.key === 'mekstation-appearance' && event.newValue !== null) {
        void useAppearanceStore.persist.rehydrate();
      }
    };
    window.addEventListener('storage', syncAppearance);
    return () => window.removeEventListener('storage', syncAppearance);
  }, []);

  return <>{children}</>;
}

export default GlobalStyleProvider;
