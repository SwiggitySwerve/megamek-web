import React, { useCallback, useEffect } from 'react';
import { useStore, type StoreApi } from 'zustand';

import type { UnitStore } from '@/stores/unitState';

import { useToast } from '@/components/shared/Toast';
import { Button } from '@/components/ui/Button';
import { getUnitEditHistory } from '@/stores/unit/unitEditHistory';
import { getUnitStore } from '@/stores/unitStoreRegistry';

export function UnitEditControls({
  unitId,
}: {
  unitId: string;
}): React.ReactElement | null {
  const store = getUnitStore(unitId);
  return store ? <StoreEditControls key={unitId} store={store} /> : null;
}

export function StoreEditControls({
  store,
}: {
  store: StoreApi<UnitStore>;
}): React.ReactElement {
  const history = getUnitEditHistory(store);
  const state = useStore(history);
  const { showToast } = useToast();
  const perform = useCallback(
    (direction: 'undo' | 'redo') => {
      try {
        history.getState()[direction]();
      } catch {
        showToast({
          message:
            'The draft changed, but browser storage could not save it. Keep this tab open and retry saving.',
          variant: 'error',
        });
      }
    },
    [history, showToast],
  );

  useEffect(() => {
    const handleKey = (event: KeyboardEvent): void => {
      if (
        event.defaultPrevented ||
        event.isComposing ||
        event.altKey ||
        !(event.ctrlKey || event.metaKey)
      )
        return;
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.closest(
            'input, textarea, [contenteditable="true"], [contenteditable=""]',
          ))
      )
        return;
      if (document.querySelector('[aria-modal="true"], dialog[open]')) return;
      const key = event.key.toLowerCase();
      const direction =
        key === 'z'
          ? event.shiftKey
            ? 'redo'
            : 'undo'
          : key === 'y' && event.ctrlKey && !event.shiftKey
            ? 'redo'
            : null;
      if (!direction) return;
      const current = history.getState();
      if (!(direction === 'undo' ? current.canUndo : current.canRedo)) return;
      event.preventDefault();
      perform(direction);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [history, perform]);

  return (
    <div
      className="flex shrink-0 items-center gap-1"
      role="group"
      aria-label="Edit history"
    >
      <Button
        size="sm"
        variant="ghost"
        disabled={!state.canUndo}
        aria-label={state.undoLabel ? `Undo: ${state.undoLabel}` : 'Undo'}
        title={
          state.undoLabel
            ? `Undo: ${state.undoLabel} (Ctrl/Cmd+Z)`
            : 'No edits to undo this session'
        }
        className="!min-h-11"
        onClick={() => perform('undo')}
      >
        Undo
      </Button>
      <Button
        size="sm"
        variant="ghost"
        disabled={!state.canRedo}
        aria-label={state.redoLabel ? `Redo: ${state.redoLabel}` : 'Redo'}
        title={
          state.redoLabel
            ? `Redo: ${state.redoLabel} (Ctrl/Cmd+Shift+Z)`
            : 'No edits to redo this session'
        }
        className="!min-h-11"
        onClick={() => perform('redo')}
      >
        Redo
      </Button>
    </div>
  );
}
