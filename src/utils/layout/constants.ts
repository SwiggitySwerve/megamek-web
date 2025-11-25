/**
 * Layout constants shared across tabbed UI surfaces.
 */

export const LAYOUT_HEIGHTS = {
  HEADER: 80,
  NAVIGATION: 60,
  get TOTAL_FIXED() {
    return this.HEADER + this.NAVIGATION;
  },
} as const;

export const TAB_CONTENT_HEIGHT = `calc(100vh - 120px)`;

export const SCROLLBAR_CLASSES =
  'scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800';

export const calculateTabHeight = (additionalOffset: number = 0): string =>
  `calc(100vh - ${LAYOUT_HEIGHTS.TOTAL_FIXED + additionalOffset}px)`;

