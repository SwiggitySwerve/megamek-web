/**
 * Detached-safe geometry and Times-width text fitting for critical tables.
 * fillTemplate may run on an unmounted SVG document, so nothing here uses
 * getBBox or canvas measurement.
 */

export const CRIT_FONT_FAMILY = 'Times New Roman, Times, serif';
export const SLOT_FONT_SIZE = 7;
export const TITLE_FONT_SIZE = SLOT_FONT_SIZE * 1.25;
export const MIN_SLOT_FONT_SIZE = 6;
export const NUMBER_WIDTH = 12;
export const BAR_WIDTH = 2;
export const BAR_MARGIN = 1;
export const NUMBER_INSET = 2;
export const RIGHT_PAD = 2;
export const HEADER_CLEARANCE = 7;
export const ALT_FILL = '#f3f3f3';
export const DIVIDER_STROKE = '#b3b3b3';
export const DIVIDER_WIDTH = 0.4;
export const EMPTY_FILL = '#999999';
export const BRACKET_ARM = 3;
export const BRACKET_STROKE = 0.72;
export const BRACKET_PAD_RATIO = 0.15;
export const DEFAULT_CRIT_WIDTH = 94;
export const DEFAULT_CRIT_HEIGHT = 103;

/** Adobe Times-Roman advances in thousandths of an em. */
const TIMES_ADVANCE: Record<string, number> = {
  ' ': 250,
  '!': 333,
  '"': 408,
  '#': 500,
  $: 500,
  '%': 833,
  '&': 778,
  "'": 180,
  '(': 333,
  ')': 333,
  '*': 500,
  '+': 564,
  ',': 250,
  '-': 333,
  '.': 250,
  '/': 278,
  '0': 500,
  '1': 500,
  '2': 500,
  '3': 500,
  '4': 500,
  '5': 500,
  '6': 500,
  '7': 500,
  '8': 500,
  '9': 500,
  ':': 278,
  ';': 278,
  '<': 564,
  '=': 564,
  '>': 564,
  '?': 444,
  '@': 921,
  A: 722,
  B: 667,
  C: 722,
  D: 722,
  E: 611,
  F: 556,
  G: 722,
  H: 722,
  I: 333,
  J: 389,
  K: 722,
  L: 611,
  M: 889,
  N: 722,
  O: 722,
  P: 556,
  Q: 722,
  R: 667,
  S: 556,
  T: 611,
  U: 722,
  V: 722,
  W: 944,
  X: 722,
  Y: 722,
  Z: 611,
  '[': 333,
  '\\': 278,
  ']': 333,
  '^': 469,
  _: 500,
  '`': 333,
  a: 444,
  b: 500,
  c: 444,
  d: 500,
  e: 444,
  f: 333,
  g: 500,
  h: 500,
  i: 278,
  j: 278,
  k: 500,
  l: 278,
  m: 778,
  n: 500,
  o: 500,
  p: 500,
  q: 500,
  r: 333,
  s: 389,
  t: 278,
  u: 500,
  v: 500,
  w: 722,
  x: 500,
  y: 500,
  z: 444,
  '{': 480,
  '|': 200,
  '}': 480,
  '~': 541,
};

const DEFAULT_ADVANCE = 500;
const BOLD_FACTOR = 1.045;

export type CritRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type FittedText = {
  fontSize: number;
  textLength?: number;
};

export function readCritRect(el: Element): CritRect | null {
  const x = parseFloat(el.getAttribute('x') || '0');
  const y = parseFloat(el.getAttribute('y') || '0');
  const width = parseFloat(
    el.getAttribute('width') || String(DEFAULT_CRIT_WIDTH),
  );
  const height = parseFloat(
    el.getAttribute('height') || String(DEFAULT_CRIT_HEIGHT),
  );
  if (
    ![x, y, width, height].every(Number.isFinite) ||
    width <= 0 ||
    height <= 0
  ) {
    return null;
  }
  return { x, y, width, height };
}

export function gapHeightFor(slotCount: number, rectHeight: number): number {
  return slotCount > 6 ? rectHeight * 0.05 : 0;
}

export function numberX(rectX: number): number {
  return rectX + BAR_WIDTH + BAR_MARGIN + NUMBER_INSET;
}

export function contentX(rectX: number): number {
  return rectX + BAR_WIDTH + BAR_MARGIN + NUMBER_WIDTH;
}

export function contentMaxWidth(rect: CritRect): number {
  return Math.max(4, rect.x + rect.width - contentX(rect.x) - RIGHT_PAD);
}

export function slotGapOffset(
  index: number,
  slotCount: number,
  gapHeight: number,
): number {
  return slotCount > 6 && index >= 6 ? gapHeight : 0;
}

export function slotBandTop(
  rectY: number,
  index: number,
  slotHeight: number,
  gapHeight: number,
  slotCount: number,
): number {
  return (
    rectY + index * slotHeight + slotGapOffset(index, slotCount, gapHeight)
  );
}

export function slotBaselineY(
  rectY: number,
  index: number,
  slotHeight: number,
  gapHeight: number,
  slotCount: number,
): number {
  return (
    rectY +
    (index + 0.7) * slotHeight +
    slotGapOffset(index, slotCount, gapHeight)
  );
}

export function estimateTimesWidth(
  text: string,
  fontSize: number,
  bold: boolean,
): number {
  let units = 0;
  for (const ch of text) {
    units += TIMES_ADVANCE[ch] ?? DEFAULT_ADVANCE;
  }
  return (units / 1000) * fontSize * (bold ? BOLD_FACTOR : 1);
}

export function fitCriticalText(
  text: string,
  maxWidth: number,
  fontSize: number,
  bold: boolean,
): FittedText {
  if (!(maxWidth > 0) || text.length === 0) {
    return { fontSize };
  }

  let size = fontSize;
  let width = estimateTimesWidth(text, size, bold);
  if (width <= maxWidth) {
    return { fontSize: size };
  }

  while (size - 0.25 >= MIN_SLOT_FONT_SIZE && width > maxWidth) {
    size -= 0.25;
    width = estimateTimesWidth(text, size, bold);
  }

  if (width <= maxWidth) {
    return { fontSize: size };
  }

  return { fontSize: size, textLength: maxWidth };
}

export function applyFittedText(el: Element, fit: FittedText): void {
  el.setAttribute('font-size', `${fit.fontSize}px`);
  if (fit.textLength !== undefined) {
    el.setAttribute('textLength', String(fit.textLength));
    el.setAttribute('lengthAdjust', 'spacingAndGlyphs');
  }
}
