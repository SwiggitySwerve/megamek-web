import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { AppIcon } from '@/components/ui/AppIcon';

export function CustomizerWorkspaceControls({
  wide,
  onToggle,
  onOpenLoadout,
}: {
  wide: boolean;
  onToggle: () => void;
  onOpenLoadout: () => void;
}): React.ReactElement {
  const [host, setHost] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setHost(document.getElementById('customizer-workspace-controls'));
  }, []);
  const buttonClass =
    'text-text-theme-primary bg-surface-raised border-border-theme-strong hover:bg-surface-base focus-visible:outline-accent ml-1 hidden h-11 w-11 shrink-0 items-center justify-center rounded border !p-0 focus-visible:outline-2 focus-visible:outline-offset-[-2px] md:flex';
  const content = (
    <>
      {wide && (
        <button
          type="button"
          aria-label="Open loadout drawer"
          title="Open loadout drawer"
          onClick={onOpenLoadout}
          className={buttonClass}
        >
          <AppIcon name="list" size="toolbar" />
        </button>
      )}
      <button
        type="button"
        aria-pressed={wide}
        aria-label="Wide workspace"
        title={wide ? 'Restore the loadout sidebar' : 'Expand the workspace'}
        onClick={onToggle}
        className={`${buttonClass} aria-pressed:border-accent aria-pressed:bg-accent/15`}
        data-testid="customizer-workspace-toggle"
      >
        <AppIcon
          name={wide ? 'panel-right-open' : 'panel-right-close'}
          size="toolbar"
        />
      </button>
    </>
  );
  return host ? createPortal(content, host) : content;
}
