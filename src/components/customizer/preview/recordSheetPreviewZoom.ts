export type RecordSheetPreviewZoomMode = 'manual' | 'fit-width' | 'fit-page';

export const MIN_RECORD_SHEET_PREVIEW_ZOOM = 0.2;
export const MAX_RECORD_SHEET_PREVIEW_ZOOM = 3;
export const RECORD_SHEET_PREVIEW_ZOOM_STEP = 0.15;
export const RECORD_SHEET_PREVIEW_VIEWPORT_PADDING = 48;

export function clampRecordSheetPreviewZoom(zoom: number): number {
  return Math.min(
    MAX_RECORD_SHEET_PREVIEW_ZOOM,
    Math.max(MIN_RECORD_SHEET_PREVIEW_ZOOM, zoom),
  );
}

export function computeFitWidthZoom(
  viewportWidth: number,
  pageWidth: number,
): number | null {
  const availableWidth = viewportWidth - RECORD_SHEET_PREVIEW_VIEWPORT_PADDING;
  if (availableWidth <= 0 || pageWidth <= 0) return null;
  return clampRecordSheetPreviewZoom(availableWidth / pageWidth);
}

export function computeFitPageZoom(
  viewportWidth: number,
  viewportHeight: number,
  pageWidth: number,
  pageHeight: number,
): number | null {
  const availableWidth = viewportWidth - RECORD_SHEET_PREVIEW_VIEWPORT_PADDING;
  const availableHeight =
    viewportHeight - RECORD_SHEET_PREVIEW_VIEWPORT_PADDING;
  if (
    availableWidth <= 0 ||
    availableHeight <= 0 ||
    pageWidth <= 0 ||
    pageHeight <= 0
  ) {
    return null;
  }
  return clampRecordSheetPreviewZoom(
    Math.min(availableWidth / pageWidth, availableHeight / pageHeight),
  );
}

export function computeZoomForMode(
  mode: RecordSheetPreviewZoomMode,
  viewportWidth: number,
  viewportHeight: number,
  pageWidth: number,
  pageHeight: number,
): number | null {
  if (mode === 'fit-width') {
    return computeFitWidthZoom(viewportWidth, pageWidth);
  }
  if (mode === 'fit-page') {
    return computeFitPageZoom(
      viewportWidth,
      viewportHeight,
      pageWidth,
      pageHeight,
    );
  }
  return null;
}
