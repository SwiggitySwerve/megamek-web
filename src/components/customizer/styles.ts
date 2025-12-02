/**
 * Shared Styles for Customizer Components
 * 
 * Centralized style constants to reduce repetition across tab components.
 * Follow the pattern established in TechBaseConfiguration.tsx.
 * 
 * Usage:
 *   import { customizerStyles as cs } from '../styles';
 *   <div className={cs.panel.main}>...</div>
 */

// =============================================================================
// Panel Styles
// =============================================================================

const panel = {
  /** Main content panel - bg-slate-800 with border */
  main: 'bg-slate-800 rounded-lg border border-slate-700 p-4',
  
  /** Compact summary bar at top of tabs */
  summary: 'bg-slate-800/50 rounded-lg border border-slate-700 px-4 py-2',
  
  /** Read-only notice panel */
  notice: 'bg-blue-900/30 border border-blue-700 rounded-lg p-4 text-blue-300 text-sm',
  
  /** Empty state placeholder */
  empty: 'text-center py-8 text-slate-400',
} as const;

// =============================================================================
// Text Styles
// =============================================================================

const text = {
  /** Section/panel title */
  sectionTitle: 'text-lg font-semibold text-white mb-4',
  
  /** Form field label */
  label: 'text-sm text-slate-400',
  
  /** Secondary/helper text */
  secondary: 'text-xs text-slate-500',
  
  /** Stat value - white */
  value: 'font-medium text-white',
  
  /** Highlighted stat value - amber */
  valueHighlight: 'font-medium text-amber-400',
  
  /** Positive value - green */
  valuePositive: 'font-medium text-green-400',
  
  /** Negative/error value - red */
  valueNegative: 'font-medium text-red-400',
  
  /** Warning value - amber */
  valueWarning: 'font-medium text-amber-400',
} as const;

// =============================================================================
// Input Styles
// =============================================================================

const input = {
  /** Base input styles (without width) */
  base: 'px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500',
  
  /** Full-width input */
  full: 'w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500',
  
  /** Compact input (smaller padding) */
  compact: 'px-2 py-1.5 bg-slate-700 border border-slate-600 rounded text-white text-sm',
  
  /** Full-width compact input */
  fullCompact: 'w-full px-2 py-1.5 bg-slate-700 border border-slate-600 rounded text-white text-sm',
  
  /** Centered number input (for stepper controls) */
  number: 'px-2 py-1 bg-slate-700 border border-slate-600 text-white text-sm text-center',
  
  /** Hide number input spinners - append to number inputs */
  noSpinners: '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
} as const;

// =============================================================================
// Select Styles
// =============================================================================

const select = {
  /** Full-width select */
  full: 'w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500',
  
  /** Compact select (smaller padding) */
  compact: 'w-full px-2 py-1.5 bg-slate-700 border border-slate-600 rounded text-white text-sm',
  
  /** Inline select (no full width) */
  inline: 'px-2 py-1.5 bg-slate-700 border border-slate-600 rounded text-white text-sm',
} as const;

// =============================================================================
// Button Styles
// =============================================================================

const button = {
  /** Stepper button (increment/decrement) - small */
  stepper: 'px-2 py-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded border border-slate-600 text-white text-sm',
  
  /** Stepper button - medium */
  stepperMd: 'px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded border border-slate-600 text-white text-sm',
  
  /** Left stepper in grouped control */
  stepperLeft: 'px-2 py-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-l border border-slate-600 text-white text-sm',
  
  /** Right stepper in grouped control */
  stepperRight: 'px-2 py-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-r border border-slate-600 text-white text-sm',
  
  /** Primary action button - blue */
  action: 'px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded text-white text-sm font-medium transition-colors',
  
  /** Full-width action button */
  actionFull: 'flex-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded text-white text-sm font-medium transition-colors',
} as const;

// =============================================================================
// Layout Styles
// =============================================================================

const layout = {
  /** Tab content container */
  tabContent: 'space-y-4 p-4',
  
  /** Two-column grid */
  twoColumn: 'grid grid-cols-1 lg:grid-cols-2 gap-4',
  
  /** Two-column grid with larger gap */
  twoColumnWide: 'grid grid-cols-1 lg:grid-cols-2 gap-6',
  
  /** Three-column grid */
  threeColumn: 'grid grid-cols-3 gap-3',
  
  /** Vertical form fields */
  formStack: 'space-y-3',
  
  /** Field with label above */
  field: 'space-y-1',
  
  /** Flex row with items centered */
  row: 'flex items-center',
  
  /** Flex row with gap */
  rowGap: 'flex items-center gap-2',
  
  /** Flex row spaced between */
  rowBetween: 'flex items-center justify-between',
  
  /** Summary stat row */
  statRow: 'flex items-center gap-2',
  
  /** Divider/separator */
  divider: 'pt-3 mt-1 border-t border-slate-700',
  
  /** Vertical divider */
  dividerV: 'pl-4 border-l border-slate-600',
} as const;

// =============================================================================
// Combined Export
// =============================================================================

/**
 * Customizer component styles
 * 
 * @example
 * import { customizerStyles as cs } from '../styles';
 * 
 * <div className={cs.panel.main}>
 *   <h3 className={cs.text.sectionTitle}>Title</h3>
 *   <div className={cs.layout.field}>
 *     <label className={cs.text.label}>Field</label>
 *     <input className={cs.input.full} />
 *   </div>
 * </div>
 */
export const customizerStyles = {
  panel,
  text,
  input,
  select,
  button,
  layout,
} as const;

// Convenient alias
export { customizerStyles as cs };

// Individual exports for selective imports
export { panel, text, input, select, button, layout };

