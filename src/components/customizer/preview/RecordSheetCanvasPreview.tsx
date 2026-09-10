import React from 'react';

import type { IRecordSheetUnitInput } from '@/services/printing/recordsheet/dispatchTarget';

import { getRecordSheetService } from '@/services/printing/RecordSheetService';
import { PaperSize, PAPER_DIMENSIONS } from '@/types/printing';
import { logger } from '@/utils/logger';

import type { PreviewToolbarActions } from './PreviewTabFrame';

import { RecordSheetPreviewZoomControls } from './RecordSheetPreviewZoomControls';

interface RenderUnitRecordSheetPreviewInput {
  canvas: HTMLCanvasElement;
  unitObject: IRecordSheetUnitInput;
  paperSize: PaperSize;
  errorMessage: string;
}

interface UseRecordSheetCanvasRendererInput {
  unitObject: IRecordSheetUnitInput;
  paperSize: PaperSize;
  errorMessage: string;
}

export async function exportUnitRecordSheetPDF(
  unitObject: IRecordSheetUnitInput,
  paperSize: PaperSize,
): Promise<void> {
  const data = getRecordSheetService().extractData(unitObject);
  await getRecordSheetService().exportPDF(data, {
    paperSize,
    includePilotData: false,
  });
}

export async function printUnitRecordSheet(
  unitObject: IRecordSheetUnitInput,
  paperSize: PaperSize,
): Promise<void> {
  const tempCanvas = document.createElement('canvas');
  const { width, height } = PAPER_DIMENSIONS[paperSize];
  tempCanvas.width = width;
  tempCanvas.height = height;

  const data = getRecordSheetService().extractData(unitObject);
  await getRecordSheetService().renderPreview(tempCanvas, data, paperSize);
  getRecordSheetService().print(tempCanvas);
}

export async function renderUnitRecordSheetPreview({
  canvas,
  unitObject,
  paperSize,
  errorMessage,
}: RenderUnitRecordSheetPreviewInput): Promise<void> {
  try {
    const data = getRecordSheetService().extractData(unitObject);
    await getRecordSheetService().renderPreview(canvas, data, paperSize);
  } catch (error) {
    logger.error(errorMessage, error);
    drawRecordSheetRenderError(canvas, paperSize);
  }
}

export function drawRecordSheetRenderError(
  canvas: HTMLCanvasElement,
  paperSize: PaperSize,
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const { width, height } = PAPER_DIMENSIONS[paperSize];
  canvas.width = width;
  canvas.height = height;
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#f00';
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Error rendering record sheet', width / 2, height / 2);
}

export function useRecordSheetToolbarActions(
  unitObject: IRecordSheetUnitInput,
  paperSize: PaperSize,
  onPaperSizeChange: (paperSize: PaperSize) => void,
): PreviewToolbarActions {
  const onExportPDF = React.useCallback(async () => {
    await exportUnitRecordSheetPDF(unitObject, paperSize);
  }, [unitObject, paperSize]);

  const onPrint = React.useCallback(async () => {
    await printUnitRecordSheet(unitObject, paperSize);
  }, [unitObject, paperSize]);

  return React.useMemo(
    () => ({
      onExportPDF,
      onPrint,
      paperSize,
      onPaperSizeChange,
    }),
    [onExportPDF, onPrint, paperSize, onPaperSizeChange],
  );
}

export function useRecordSheetCanvasRenderer({
  unitObject,
  paperSize,
  errorMessage,
}: UseRecordSheetCanvasRendererInput): React.RefObject<HTMLCanvasElement | null> {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const renderPreview = React.useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    await renderUnitRecordSheetPreview({
      canvas,
      unitObject,
      paperSize,
      errorMessage,
    });
  }, [unitObject, paperSize, errorMessage]);

  React.useEffect(() => {
    void renderPreview();
  }, [renderPreview]);

  return canvasRef;
}

interface RecordSheetCanvasPreviewProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  testId: string;
  width: number;
  height: number;
  scale: number;
  className?: string;
}

export function RecordSheetCanvasPreview({
  canvasRef,
  testId,
  width,
  height,
  scale,
  className = '',
}: RecordSheetCanvasPreviewProps): React.ReactElement {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = React.useState(scale);

  const fitToWidth = React.useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const availableWidth = container.clientWidth - 48;
    if (availableWidth > 0) setZoom(Math.min(availableWidth / width, 3.0));
  }, [width]);

  const fitToPage = React.useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const availableWidth = container.clientWidth - 48;
    const availableHeight = container.clientHeight - 48;
    if (availableWidth <= 0 || availableHeight <= 0) return;
    setZoom(Math.min(availableWidth / width, availableHeight / height, 3.0));
  }, [height, width]);

  React.useEffect(() => {
    fitToPage();
  }, [fitToPage]);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(fitToPage);
    observer.observe(container);
    return () => observer.disconnect();
  }, [fitToPage]);

  const zoomIn = React.useCallback(
    () => setZoom((value) => Math.min(value + 0.15, 3.0)),
    [],
  );
  const zoomOut = React.useCallback(
    () => setZoom((value) => Math.max(value - 0.15, 0.2)),
    [],
  );

  return (
    <div
      className={`record-sheet-preview ${className}`}
      style={{
        position: 'relative',
        height: '100%',
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        ref={containerRef}
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          overflow: 'auto',
          padding: '24px',
          backgroundColor: 'var(--surface-deep)',
        }}
      >
        <canvas
          ref={canvasRef}
          data-testid={testId}
          style={{
            flexShrink: 0,
            margin: 'auto',
            width: width * zoom,
            height: height * zoom,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
            backgroundColor: '#fff',
          }}
        />
      </div>
      <RecordSheetPreviewZoomControls
        zoom={zoom}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onFitToWidth={fitToWidth}
        onFitToPage={fitToPage}
      />
    </div>
  );
}
