import React from 'react';

import { Button } from '@/components/ui/Button';
import { SvgIcon } from '@/components/ui/SvgIcon';

interface RecordSheetPreviewZoomControlsProps {
  readonly zoom: number;
  readonly onZoomIn: () => void;
  readonly onZoomOut: () => void;
  readonly onFitToWidth: () => void;
  readonly onFitToPage: () => void;
}

export function RecordSheetPreviewZoomControls({
  zoom,
  onZoomIn,
  onZoomOut,
  onFitToWidth,
  onFitToPage,
}: RecordSheetPreviewZoomControlsProps): React.ReactElement {
  return (
    <div
      className="border-border-theme-subtle bg-surface-base flex shrink-0 flex-wrap items-center justify-center gap-1 border-t p-1.5 sm:justify-end"
      role="group"
      aria-label="Record sheet zoom controls"
    >
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onZoomOut}
        aria-label="Zoom out"
        className="min-w-11 px-2 text-lg leading-none"
      >
        <SvgIcon size="inline" aria-hidden="true">
          <circle cx="10" cy="10" r="7" />
          <path d="m15 15 7 7M7 10h6" />
        </SvgIcon>
      </Button>
      <output
        className="text-text-theme-primary min-w-14 px-1 text-center text-xs font-medium tabular-nums"
        aria-live="polite"
        aria-label="Current zoom"
      >
        {Math.round(zoom * 100)}%
      </output>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onZoomIn}
        aria-label="Zoom in"
        className="min-w-11 px-2 text-lg leading-none"
      >
        <SvgIcon size="inline" aria-hidden="true">
          <circle cx="10" cy="10" r="7" />
          <path d="m15 15 7 7M7 10h6M10 7v6" />
        </SvgIcon>
      </Button>
      <div
        aria-hidden="true"
        className="border-border-theme mx-1 h-6 border-l"
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onFitToWidth}
        className="px-3 text-xs"
      >
        Fit Width
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onFitToPage}
        className="px-3 text-xs"
      >
        Fit Page
      </Button>
    </div>
  );
}
