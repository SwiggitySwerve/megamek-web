/**
 * Characterization: document margins must follow the template's own
 * geometry and the requested paper size. ISO templates are 559x806 and
 * must expand to A4 595x842 — not be forced through Letter 612x792,
 * which crops the footer.
 */

import { PaperSize } from '@/types/printing';

import {
  addDocumentMargins,
  fixCopyrightYear,
  parseSVGTemplate,
} from '../template';

function parseRoot(width: number, height: number): SVGSVGElement {
  const markup = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <text id="footer" y="${height - 8}">Copyright</text>
</svg>`;
  return parseSVGTemplate(markup, 'fixture').svgRoot;
}

describe('addDocumentMargins', () => {
  it('expands a Letter template (576x756) to Letter paper without cropping', () => {
    const root = parseRoot(576, 756);
    addDocumentMargins(root, PaperSize.LETTER);

    expect(root.getAttribute('width')).toBe('612');
    expect(root.getAttribute('height')).toBe('792');
    const [minX, minY, width, height] = (root.getAttribute('viewBox') ?? '')
      .trim()
      .split(/[\s,]+/)
      .map(Number);
    expect(width).toBe(612);
    expect(height).toBe(792);
    expect(minY + height).toBeGreaterThan(756);
    expect(minX + width).toBeGreaterThan(576);
  });

  it('expands an ISO template (559x806) to A4 paper and keeps the footer', () => {
    const root = parseRoot(559, 806);
    addDocumentMargins(root, PaperSize.A4);

    expect(root.getAttribute('width')).toBe('595');
    expect(root.getAttribute('height')).toBe('842');
    const [minX, minY, width, height] = (root.getAttribute('viewBox') ?? '')
      .trim()
      .split(/[\s,]+/)
      .map(Number);
    expect(width).toBe(595);
    expect(height).toBe(842);
    expect(minY + height).toBeGreaterThan(806);
    expect(minX + width).toBeGreaterThan(559);
    expect(height).not.toBe(792);
    expect(width).not.toBe(612);
  });

  it('places the Letter copyright below 756 content inside the paper margin', () => {
    const markup = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="576" height="756" viewBox="0 0 576 756">
  <text id="footer" transform="translate (288.0 756.0)">Copyright</text>
</svg>`;
    const { svgDoc, svgRoot } = parseSVGTemplate(markup, 'letter-footer');
    addDocumentMargins(svgRoot, PaperSize.LETTER);
    fixCopyrightYear(svgDoc);

    const transform =
      svgDoc.getElementById('footer')?.getAttribute('transform') ?? '';
    const match = transform.match(/translate\(([-.\d]+)\s+([-.\d]+)\)/);
    expect(match).not.toBeNull();
    const x = Number(match?.[1]);
    const y = Number(match?.[2]);
    expect(x).toBeCloseTo(288, 1);
    expect(y).toBeCloseTo(762, 1);
    expect(y).toBeGreaterThan(756);
    expect(y).toBeLessThan(-18 + 792);
  });

  it('places the A4 copyright below complete ISO 806 content without overlap or crop', () => {
    const markup = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="559" height="806">
  <text id="footer" transform="translate (279.5 806.0)">Copyright</text>
</svg>`;
    const { svgDoc, svgRoot } = parseSVGTemplate(markup, 'iso-footer');
    addDocumentMargins(svgRoot, PaperSize.A4);
    fixCopyrightYear(svgDoc);

    const transform =
      svgDoc.getElementById('footer')?.getAttribute('transform') ?? '';
    expect(transform).not.toContain('762');
    expect(transform).not.toContain('288.0');
    const match = transform.match(/translate\(([-.\d]+)\s+([-.\d]+)\)/);
    expect(match).not.toBeNull();
    const x = Number(match?.[1]);
    const y = Number(match?.[2]);
    expect(x).toBeCloseTo(279.5, 1);
    expect(y).toBeGreaterThan(806);
    expect(y).toBeLessThan(-18 + 842);
    expect(y).toBeCloseTo(812, 1);
  });
});
