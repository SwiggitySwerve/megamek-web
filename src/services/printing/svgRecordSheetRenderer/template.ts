/**
 * Template loading and document configuration utilities
 */

import { PAPER_DIMENSIONS, PaperSize } from '@/types/printing';

import { SVG_NS } from './constants';
import { footerTranslateForRoot, readSvgRootSize } from './svgGeometry';

/**
 * Parse an SVG template string into a validated document + root.
 *
 * Validates that the content is real SVG (not an HTML 404 page),
 * parses it with `DOMParser`, and confirms the root is a genuine
 * `SVGSVGElement`. Shared by `loadSVGTemplate` (raw-fetch path) and the
 * `MmDataAssetService.loadSVG`-backed shared renderer path.
 *
 * @param svgText the raw SVG markup
 * @param sourceLabel a path/identifier for diagnostics in thrown errors
 * @throws Error when the content is HTML, malformed, or not SVG-rooted
 */
export function parseSVGTemplate(
  svgText: string,
  sourceLabel: string,
): { svgDoc: Document; svgRoot: SVGSVGElement } {
  // If content starts with an HTML doctype or <html, it's a 404 page.
  const trimmedText = svgText.trim().toLowerCase();
  if (
    trimmedText.startsWith('<!doctype html') ||
    trimmedText.startsWith('<html')
  ) {
    throw new Error(
      `SVG template "${sourceLabel}" returned HTML content instead of SVG. ` +
        `The asset file is missing. Run 'npm run fetch:assets' to download required assets.`,
    );
  }

  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');

  // Check for parse errors first.
  const parseError = svgDoc.querySelector('parsererror');
  if (parseError) {
    throw new Error(`Failed to parse SVG template: ${parseError.textContent}`);
  }

  // Verify documentElement is an SVG element.
  const docElement = svgDoc.documentElement;
  if (
    docElement.tagName === 'svg' &&
    docElement.namespaceURI === SVG_NS &&
    docElement instanceof SVGSVGElement
  ) {
    return { svgDoc, svgRoot: docElement };
  }
  throw new Error('SVG template root element is not a valid SVGSVGElement');
}

/**
 * Load an SVG template from a URL via a raw `fetch`.
 *
 * The mech record-sheet path uses this directly. The shared
 * `TemplateRecordSheetRenderer` instead loads through
 * `MmDataAssetService.loadSVG` (three-source fallback) and hands the
 * result to `parseSVGTemplate`.
 *
 * @throws Error if the template cannot be fetched or is not valid SVG
 */
export async function loadSVGTemplate(templatePath: string): Promise<{
  svgDoc: Document;
  svgRoot: SVGSVGElement;
}> {
  const response = await fetch(templatePath);

  // Check for HTTP errors (404, 500, etc.)
  if (!response.ok) {
    throw new Error(
      `Failed to load SVG template "${templatePath}": HTTP ${response.status}. ` +
        `Run 'npm run fetch:assets' to download required record sheet assets.`,
    );
  }

  // Verify content type is SVG/XML (not HTML from a 404 page served by the dev server)
  const contentType = response.headers.get('content-type') || '';
  const isValidContentType =
    contentType.includes('svg') ||
    contentType.includes('xml') ||
    contentType.includes('octet-stream');

  if (!isValidContentType && contentType.includes('text/html')) {
    throw new Error(
      `Invalid content type for SVG template "${templatePath}": received HTML instead of SVG. ` +
        `The asset file may be missing. Run 'npm run fetch:assets' to download required assets.`,
    );
  }

  const svgText = await response.text();
  return parseSVGTemplate(svgText, templatePath);
}

/**
 * Add margins around the SVG document for proper spacing on all edges.
 * Uses the template's own viewBox/size (US Letter 576x756 or ISO 559x806)
 * and expands to the requested paper (612x792 or 595x842) without cropping.
 */
export function addDocumentMargins(
  svgRoot: SVGSVGElement,
  paperSize: PaperSize = PaperSize.LETTER,
): void {
  const { width: originalWidth, height: originalHeight } =
    readSvgRootSize(svgRoot);
  const { width: targetWidth, height: targetHeight } =
    PAPER_DIMENSIONS[paperSize];

  const marginX = (targetWidth - originalWidth) / 2;
  const marginY = (targetHeight - originalHeight) / 2;

  svgRoot.setAttribute(
    'viewBox',
    `${-marginX} ${-marginY} ${targetWidth} ${targetHeight}`,
  );
  svgRoot.setAttribute('width', String(targetWidth));
  svgRoot.setAttribute('height', String(targetHeight));
}

/**
 * Hide the second crew damage panel (crewDamage1) for single-pilot mechs
 * The template has two crew panels for dual-cockpit mechs, but most mechs only have one pilot
 */
export function hideSecondCrewPanel(svgDoc: Document): void {
  const crewDamage1 = svgDoc.getElementById('crewDamage1');
  if (crewDamage1) {
    crewDamage1.setAttribute('visibility', 'hidden');
  }
}

/**
 * Fix the copyright text: replace year placeholder, set font, and adjust spacing
 * Matches MegaMekLab's style: Eurostile bold font, centered at bottom
 */
export function fixCopyrightYear(svgDoc: Document): void {
  // Get the footer parent element to adjust font and position
  const footerElement = svgDoc.getElementById('footer');
  if (footerElement) {
    // Use Eurostile (MegaMekLab's font) with web-safe fallbacks
    footerElement.setAttribute(
      'font-family',
      'Eurostile, "Century Gothic", "Trebuchet MS", Arial, sans-serif',
    );
    footerElement.setAttribute('font-size', '7.5px');
    footerElement.setAttribute('font-weight', 'bold');
    const root = svgDoc.documentElement;
    if (root instanceof SVGSVGElement) {
      const { x, y } = footerTranslateForRoot(root);
      footerElement.setAttribute(
        'transform',
        `translate(${x.toFixed(1)} ${y.toFixed(1)})`,
      );
    }
  }

  const copyrightElement = svgDoc.getElementById('tspanCopyright');
  if (copyrightElement && copyrightElement.textContent) {
    const currentYear = new Date().getFullYear();
    copyrightElement.textContent = copyrightElement.textContent.replace(
      '%d',
      String(currentYear),
    );
    // Remove textLength and lengthAdjust to prevent text stretching/distortion
    copyrightElement.removeAttribute('textLength');
    copyrightElement.removeAttribute('lengthAdjust');
    // Position first line above second line (adjusted for larger font)
    copyrightElement.setAttribute('y', '-9.0');
  }

  // Also fix the second line of copyright (Catalyst Game Labs)
  const catalystElement = svgDoc.getElementById('tspan221');
  if (catalystElement) {
    catalystElement.removeAttribute('textLength');
    catalystElement.removeAttribute('lengthAdjust');
    // Second line at baseline
    catalystElement.setAttribute('y', '0');
  }
}

/**
 * Helper to set text content of an element by ID
 */
export function setTextContent(
  svgDoc: Document,
  id: string,
  text: string,
): void {
  const element = svgDoc.getElementById(id);
  if (element) {
    element.textContent = text;
  }
}
