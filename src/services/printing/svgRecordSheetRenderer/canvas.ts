/**
 * Canvas rendering utilities for SVG record sheets
 * Handles bounded-DPI rendering for preview and PDF export
 */

import { PAPER_DIMENSIONS, PaperSize } from '@/types/printing';

import { fitRect, parseSvgViewBox } from './svgGeometry';

async function awaitDocumentFonts(): Promise<void> {
  if (
    typeof document !== 'undefined' &&
    'fonts' in document &&
    document.fonts &&
    typeof document.fonts.ready?.then === 'function'
  ) {
    await document.fonts.ready;
  }
}

/**
 * Render SVG to canvas at a bounded DPI for sharp text (preview and PDF).
 * Fits the SVG viewBox into the requested paper size without stretching or cropping.
 *
 * @param svgString Serialized SVG string
 * @param canvas Target canvas element
 * @param dpiMultiplier Resolution multiplier (4 for 288 DPI preview/PDF)
 * @param paperSize Selected paper; defaults to US Letter
 */
export async function renderToCanvasHighDPI(
  svgString: string,
  canvas: HTMLCanvasElement,
  dpiMultiplier: number,
  paperSize: PaperSize = PaperSize.LETTER,
): Promise<void> {
  await awaitDocumentFonts();

  const paper = PAPER_DIMENSIONS[paperSize];
  const svgSize = parseSvgViewBox(svgString);
  const svgBlob = new Blob([svgString], {
    type: 'image/svg+xml;charset=utf-8',
  });
  const url = URL.createObjectURL(svgBlob);
  const img = new Image();

  try {
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to load SVG image'));
      img.src = url;
    });

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    canvas.width = paper.width * dpiMultiplier;
    canvas.height = paper.height * dpiMultiplier;
    ctx.setTransform(dpiMultiplier, 0, 0, dpiMultiplier, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, paper.width, paper.height);

    const fitted = fitRect(
      svgSize.width,
      svgSize.height,
      paper.width,
      paper.height,
    );
    ctx.drawImage(
      img,
      fitted.offsetX,
      fitted.offsetY,
      fitted.destWidth,
      fitted.destHeight,
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}
