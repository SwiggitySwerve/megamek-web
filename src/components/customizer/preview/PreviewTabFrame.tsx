import React from 'react';

import { PaperSize } from '@/types/printing';

import { PreviewToolbar } from './PreviewToolbar';

export interface PreviewToolbarActions {
  onExportPDF: () => Promise<void>;
  onPrint: () => Promise<void>;
  paperSize: PaperSize;
  onPaperSizeChange: (paperSize: PaperSize) => void;
}

interface PreviewTabFrameProps {
  className?: string;
  testId?: string;
  toolbarActions: PreviewToolbarActions;
  children: React.ReactNode;
}

export function PreviewTabFrame({
  className = '',
  testId,
  toolbarActions,
  children,
}: PreviewTabFrameProps): React.ReactElement {
  return (
    <div
      className={`preview-tab bg-surface-base flex h-full min-h-0 flex-col ${className}`}
      data-testid={testId}
    >
      <PreviewToolbar {...toolbarActions} />

      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}
