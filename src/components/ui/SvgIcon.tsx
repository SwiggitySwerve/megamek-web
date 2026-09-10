import React from 'react';

export const ICON_SIZES = {
  inline: 16,
  control: 20,
  toolbar: 24,
  feature: 32,
  hero: 48,
} as const;

export type IconSize = keyof typeof ICON_SIZES;

export interface SvgIconProps extends Omit<
  React.SVGProps<SVGSVGElement>,
  'width' | 'height' | 'strokeWidth'
> {
  size?: IconSize;
  label?: string;
}

/** Shared frame for UI symbols. Keep chart, map, and record-sheet SVGs separate. */
export function SvgIcon({
  size = 'control',
  label,
  className = '',
  style,
  children,
  viewBox = '0 0 24 24',
  fill = 'none',
  stroke = fill === 'none' ? 'currentColor' : 'none',
  ...props
}: SvgIconProps): React.ReactElement {
  const accessibleLabel = label ?? props['aria-label'];
  const decorative =
    !accessibleLabel && !props['aria-labelledby'] && props.role !== 'img';
  return (
    <svg
      {...props}
      data-ui-icon="true"
      data-icon-size={size}
      aria-label={accessibleLabel}
      aria-hidden={props['aria-hidden'] ?? (decorative ? true : undefined)}
      role={props.role ?? (decorative ? undefined : 'img')}
      focusable="false"
      className={`ui-icon ${className}`.trim()}
      viewBox={viewBox}
      width={ICON_SIZES[size]}
      height={ICON_SIZES[size]}
      fill={fill}
      stroke={stroke}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        ...style,
        width: ICON_SIZES[size],
        height: ICON_SIZES[size],
        flexShrink: 0,
        verticalAlign: 'middle',
      }}
    >
      {children}
    </svg>
  );
}
