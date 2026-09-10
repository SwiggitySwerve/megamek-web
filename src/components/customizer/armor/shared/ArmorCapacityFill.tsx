import React, { useId } from 'react';

import type { LocationPosition } from './MechSilhouette';

export function clampArmorFillRatio(current: number, maximum: number): number {
  return Number.isFinite(current) && Number.isFinite(maximum) && maximum > 0
    ? Math.min(1, Math.max(0, current / maximum))
    : 0;
}

interface ArmorCapacityFillProps {
  position: LocationPosition;
  current: number;
  maximum: number;
  color: string;
  emptyColor: string;
  marker: string;
  section?: 'front' | 'rear';
  radius?: number;
  className?: string;
}

/**
 * Renders the actual capacity-bearing layer for a location. A rectangular clip
 * rises from the bottom of the section while the path keeps the silhouette
 * boundary intact.
 */
export function ArmorCapacityFill({
  position,
  current,
  maximum,
  color,
  emptyColor,
  marker,
  section = 'front',
  radius = 0,
  className,
}: ArmorCapacityFillProps): React.ReactElement {
  const clipId = useId();
  const ratio = clampArmorFillRatio(current, maximum);
  const fillHeight = position.height * ratio;
  const fillY = position.y + position.height - fillHeight;
  const shapeProps = position.path
    ? { d: position.path }
    : {
        x: position.x,
        y: position.y,
        width: position.width,
        height: position.height,
        rx: radius,
      };

  return (
    <>
      <defs>
        <clipPath id={clipId}>
          <rect
            x={position.x}
            y={fillY}
            width={position.width}
            height={fillHeight}
          />
        </clipPath>
      </defs>
      {position.path ? (
        <path {...shapeProps} fill={emptyColor} className={className} />
      ) : (
        <rect {...shapeProps} fill={emptyColor} className={className} />
      )}
      {position.path ? (
        <path
          {...shapeProps}
          data-armor-fill={marker}
          data-armor-fill-ratio={ratio}
          data-armor-fill-section={section}
          fill={color}
          clipPath={`url(#${clipId})`}
          className={className}
        />
      ) : (
        <rect
          {...shapeProps}
          data-armor-fill={marker}
          data-armor-fill-ratio={ratio}
          data-armor-fill-section={section}
          fill={color}
          clipPath={`url(#${clipId})`}
          className={className}
        />
      )}
    </>
  );
}
