/**
 * HotkeyHelpOverlay — modal that lists every in-app keyboard
 * shortcut, grouped by category (Camera, Overlays, Combat, Help).
 *
 * Why a modal rather than a tooltip:
 *   - Spec § 6 requires the overlay to open on `?`, close on Esc, and
 *     list every hotkey in one place.
 *   - A full-screen (or near-full) modal also gives us a predictable
 *     focus trap point — pressing Esc only dismisses the overlay,
 *     not some other unrelated piece of hover UI.
 *
 * First-time prompt:
 *   - Per spec § 6.4 and the "First-time prompt" scenario, we track
 *     a boolean in localStorage under `mekstation.camera.hotkeyHintSeen`.
 *     Once the user opens the overlay (or dismisses the hint), the
 *     flag is set and the hint never re-renders in any future
 *     session.
 *
 * @spec openspec/changes/add-minimap-and-camera-controls/specs/camera-controls/spec.md
 */

import React, { useCallback, useEffect, useState } from 'react';

import { AppIcon } from '@/components/ui/AppIcon';

const HINT_STORAGE_KEY = 'mekstation.camera.hotkeyHintSeen';

interface IHotkeyEntry {
  readonly keys: readonly string[];
  readonly description: string;
}

interface IHotkeyGroup {
  readonly title: string;
  readonly entries: readonly IHotkeyEntry[];
}

/**
 * Source of truth for the hotkey list. Updating a shortcut's label
 * here ripples into both the modal and the optional hint badge.
 */
const HOTKEY_GROUPS: readonly IHotkeyGroup[] = [
  {
    title: 'Camera',
    entries: [
      {
        keys: ['W', 'A', 'S', 'D'],
        description: 'Pan the camera one hex at a time',
      },
      { keys: ['↑', '↓', '←', '→'], description: 'Same as WASD (arrow keys)' },
      { keys: ['+'], description: 'Zoom in (10% per press)' },
      { keys: ['-'], description: 'Zoom out (10% per press)' },
      { keys: ['Space'], description: 'Recenter on the selected unit' },
    ],
  },
  {
    title: 'Overlays',
    entries: [
      { keys: ['M'], description: 'Toggle the minimap' },
      { keys: ['A'], description: 'Toggle firing arcs' },
      { keys: ['L'], description: 'Toggle line-of-sight lines' },
    ],
  },
  {
    title: 'Combat',
    entries: [
      {
        keys: ['1', '…', '5'],
        description: 'Select weapon slots (when defined)',
      },
    ],
  },
  {
    title: 'Help',
    entries: [
      { keys: ['?'], description: 'Open or close this help overlay' },
      { keys: ['Esc'], description: 'Close modals and clear hover state' },
    ],
  },
];

/**
 * Render a single key-cap chip. Small standalone sub-component so
 * the main overlay body reads linearly.
 */
function KeyCap({ label }: { label: string }): React.ReactElement {
  return (
    <kbd className="border-border-theme bg-surface-base text-text-theme-primary inline-flex min-w-[22px] items-center justify-center rounded border px-1.5 py-0.5 font-mono text-xs shadow-sm">
      {label}
    </kbd>
  );
}

export interface HotkeyHelpOverlayProps {
  /** Is the overlay open right now (controlled by the host). */
  readonly open: boolean;
  /** Callback fired when the overlay wants to close itself. */
  readonly onClose: () => void;
}

export function HotkeyHelpOverlay({
  open,
  onClose,
}: HotkeyHelpOverlayProps): React.ReactElement | null {
  // Mark the hint as "seen" the first time the overlay is ever
  // opened. We do this as a side-effect of `open === true` so either
  // the user pressing `?` OR the host opening the modal
  // programmatically counts.
  useEffect(() => {
    if (!open) return;
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(HINT_STORAGE_KEY, '1');
    } catch {
      // localStorage can throw in locked-down contexts (Safari
      // private mode, etc.). Ignoring is safe — the worst outcome is
      // that the hint reappears next session.
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="bg-surface-deep/70 absolute inset-0 z-40 flex items-center justify-center p-4"
      onClick={onClose}
      data-testid="hotkey-help-overlay-backdrop"
      role="presentation"
    >
      <div
        className="border-border-theme bg-surface-deep max-h-[80vh] w-full max-w-md overflow-y-auto rounded-lg border p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="hotkey-help-title"
        data-testid="hotkey-help-overlay"
      >
        <div className="mb-3 flex items-center justify-between">
          <h2
            id="hotkey-help-title"
            className="text-text-theme-primary text-lg font-semibold"
          >
            Keyboard Shortcuts
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-text-theme-secondary hover:bg-surface-base rounded px-2 py-1 text-sm"
            aria-label="Close shortcuts help"
            data-testid="hotkey-help-close"
          >
            Close
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {HOTKEY_GROUPS.map((group) => (
            <section
              key={group.title}
              data-testid={`hotkey-group-${group.title.toLowerCase()}`}
            >
              <h3 className="mb-1.5 text-xs font-semibold tracking-wider text-amber-300 uppercase">
                {group.title}
              </h3>
              <ul className="flex flex-col gap-1">
                {group.entries.map((entry, idx) => (
                  <li
                    key={`${group.title}-${idx}`}
                    className="text-text-theme-primary flex items-baseline justify-between gap-3 text-sm"
                  >
                    <span className="flex flex-wrap items-center gap-1">
                      {entry.keys.map((k, i) => (
                        <React.Fragment key={`${group.title}-${idx}-${i}`}>
                          <KeyCap label={k} />
                          {i < entry.keys.length - 1 && (
                            <span className="text-text-theme-muted">/</span>
                          )}
                        </React.Fragment>
                      ))}
                    </span>
                    <span className="text-text-theme-secondary text-right">
                      {entry.description}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Small badge telling first-time users about the `?` shortcut.
 * Host renders this once; it auto-hides the first time it is shown
 * and never reappears afterwards.
 */
export function HotkeyHintBadge(): React.ReactElement | null {
  const [visible, setVisible] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return window.localStorage.getItem(HINT_STORAGE_KEY) !== '1';
    } catch {
      return false;
    }
  });

  // Auto-dismiss after ~8 seconds so the badge is unobtrusive. We
  // also set the storage flag as part of auto-dismiss so a user who
  // ignored the badge still won't see it again next session.
  useEffect(() => {
    if (!visible) return;
    const t = window.setTimeout(() => {
      try {
        window.localStorage.setItem(HINT_STORAGE_KEY, '1');
      } catch {
        // ignore — see note in HotkeyHelpOverlay useEffect
      }
      setVisible(false);
    }, 8000);
    return () => window.clearTimeout(t);
  }, [visible]);

  const dismiss = useCallback(() => {
    try {
      window.localStorage.setItem(HINT_STORAGE_KEY, '1');
    } catch {
      // ignore
    }
    setVisible(false);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="border-border-theme bg-surface-deep/90 text-text-theme-primary pointer-events-auto absolute top-2 right-auto bottom-auto left-2 flex items-center justify-center gap-2 rounded-full border px-2 py-1 text-[11px] whitespace-nowrap shadow-lg lg:top-auto lg:right-auto lg:bottom-4 lg:left-1/2 lg:-translate-x-1/2 lg:px-3 lg:py-1.5 lg:text-xs"
      data-testid="hotkey-hint-badge"
      role="status"
    >
      <span className="lg:hidden">
        Press <KeyCap label="?" /> for shortcuts.
      </span>
      <span className="hidden lg:inline">
        Press <KeyCap label="?" /> for shortcuts. <KeyCap label="A" /> arcs,{' '}
        <KeyCap label="L" /> LOS.
      </span>
      <button
        type="button"
        onClick={dismiss}
        className="text-text-theme-secondary hover:bg-surface-base rounded px-1"
        aria-label="Dismiss shortcut hint"
      >
        <AppIcon name="close" size="inline" aria-hidden="true" />
      </button>
    </div>
  );
}

export { HINT_STORAGE_KEY };
