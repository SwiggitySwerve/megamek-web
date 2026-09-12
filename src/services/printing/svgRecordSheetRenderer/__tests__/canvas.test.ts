/**
 * Characterization / regression tests for SVG → canvas rasterization.
 *
 * Pins bounded 4x paper-sized output, actual SVG viewBox fitting, and
 * object-URL cleanup on success and error.
 */

import {
  PAPER_DIMENSIONS,
  PaperSize,
  PREVIEW_DPI_MULTIPLIER,
} from '@/types/printing';

import { renderToCanvasHighDPI } from '../canvas';
import { parseSvgViewBox } from '../svgGeometry';
import {
  createMockCanvas,
  installSvgImageMock,
  restoreSvgImageMock,
} from './canvas.test-helpers';

const LETTER = PAPER_DIMENSIONS[PaperSize.LETTER];
const A4 = PAPER_DIMENSIONS[PaperSize.A4];
const BOUNDED_DPI = 4;

function svgMarkup(width: number, height: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}"></svg>`;
}

describe('renderToCanvasHighDPI', () => {
  afterEach(() => {
    restoreSvgImageMock();
    Reflect.deleteProperty(document, 'fonts');
  });

  it('rasterizes to bounded 4x paper pixels instead of a 20x ~775MB buffer', async () => {
    installSvgImageMock();
    const canvas = createMockCanvas();

    await renderToCanvasHighDPI(
      svgMarkup(576, 756),
      canvas as unknown as HTMLCanvasElement,
      PREVIEW_DPI_MULTIPLIER,
      PaperSize.LETTER,
    );

    expect(canvas.width).toBe(LETTER.width * BOUNDED_DPI);
    expect(canvas.height).toBe(LETTER.height * BOUNDED_DPI);
    expect(canvas.width * canvas.height * 4).toBeLessThan(50 * 1024 * 1024);
  });

  it('uses requested A4 paper dimensions and the SVG viewBox without stretching', async () => {
    installSvgImageMock();
    const canvas = createMockCanvas();
    const svgWidth = 500;
    const svgHeight = 800;

    await renderToCanvasHighDPI(
      svgMarkup(svgWidth, svgHeight),
      canvas as unknown as HTMLCanvasElement,
      BOUNDED_DPI,
      PaperSize.A4,
    );

    expect(canvas.width).toBe(A4.width * BOUNDED_DPI);
    expect(canvas.height).toBe(A4.height * BOUNDED_DPI);

    const draw = canvas.ctx.drawImage.mock.calls[0] as unknown[];
    const destWidth = Number(draw[3]);
    const destHeight = Number(draw[4]);
    expect(destWidth / destHeight).toBeCloseTo(svgWidth / svgHeight, 5);
    expect(destWidth).toBeLessThanOrEqual(A4.width + 0.001);
    expect(destHeight).toBeLessThanOrEqual(A4.height + 0.001);
  });

  it('revokes the object URL after a successful rasterization', async () => {
    const { createObjectURL, revokeObjectURL } = installSvgImageMock();
    const canvas = createMockCanvas();

    await renderToCanvasHighDPI(
      svgMarkup(576, 756),
      canvas as unknown as HTMLCanvasElement,
      BOUNDED_DPI,
      PaperSize.LETTER,
    );

    expect(createObjectURL).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:svg-record-sheet');
  });

  it('revokes the object URL when the SVG image fails to load', async () => {
    const { revokeObjectURL } = installSvgImageMock({ fail: true });
    const canvas = createMockCanvas();

    await expect(
      renderToCanvasHighDPI(
        svgMarkup(576, 756),
        canvas as unknown as HTMLCanvasElement,
        BOUNDED_DPI,
        PaperSize.LETTER,
      ),
    ).rejects.toThrow('Failed to load SVG image');

    expect(revokeObjectURL).toHaveBeenCalledWith('blob:svg-record-sheet');
  });

  it('waits for document.fonts.ready before creating the SVG object URL', async () => {
    let resolveFonts: (() => void) | undefined;
    Object.defineProperty(document, 'fonts', {
      configurable: true,
      value: {
        ready: new Promise<void>((resolve) => {
          resolveFonts = resolve;
        }),
      },
    });

    const { createObjectURL } = installSvgImageMock();
    const canvas = createMockCanvas();
    const pending = renderToCanvasHighDPI(
      svgMarkup(576, 756),
      canvas as unknown as HTMLCanvasElement,
      BOUNDED_DPI,
      PaperSize.LETTER,
    );

    await Promise.resolve();
    expect(createObjectURL).not.toHaveBeenCalled();

    resolveFonts?.();
    await pending;
    expect(createObjectURL).toHaveBeenCalledTimes(1);
  });

  it('fits a root-sized sheet even when a nested logo viewBox is 69×69', async () => {
    installSvgImageMock();
    const canvas = createMockCanvas();
    const svg = `<?xml version="1.0"?>
<svg xmlns="http://www.w3.org/2000/svg" width="576.0" height="756.0">
  <svg viewBox="2.125 -70.896 69 69" width="69" height="69"><rect width="69" height="69"/></svg>
</svg>`;
    expect(parseSvgViewBox(svg)).toEqual({ width: 576, height: 756 });

    await renderToCanvasHighDPI(
      svg,
      canvas as unknown as HTMLCanvasElement,
      BOUNDED_DPI,
      PaperSize.LETTER,
    );

    const draw = canvas.ctx.drawImage.mock.calls[0] as unknown[];
    const destWidth = Number(draw[3]);
    const destHeight = Number(draw[4]);
    expect(destWidth / destHeight).toBeCloseTo(576 / 756, 5);
    expect(destWidth / destHeight).not.toBeCloseTo(1, 1);
  });
});
