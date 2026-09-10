export const trayStyles = {
  padding: {
    row: 'px-2',
    header: 'px-3',
  },
  text: {
    primary: 'text-xs',
    secondary: 'text-[10px]',
    tertiary: 'text-[9px]',
  },
  gap: 'gap-1.5',
  row: 'h-7 flex items-center',
  equipmentRow:
    'pl-2 min-h-11 flex items-stretch gap-1.5 transition-all group rounded-md border-2 border-solid my-0.5',
  categoryRow: 'bg-surface-base/50 flex h-8 items-center gap-1.5 px-2',
  sectionRow:
    'bg-surface-raised/30 hover:bg-surface-raised/50 flex min-h-11 w-full items-center justify-between gap-1.5 px-2 text-left transition-colors',
  categoryDot: 'w-2 h-2 rounded-sm',
  actionButton: 'opacity-0 group-hover:opacity-100 transition-opacity px-0.5',
} as const;
