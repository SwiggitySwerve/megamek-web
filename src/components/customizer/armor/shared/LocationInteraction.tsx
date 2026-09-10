import React from 'react';

import type { LocationContentProps } from './LocationTypes';

import { ArmorCapacityFill } from './ArmorCapacityFill';
import * as ArmorFills from './ArmorFills';

export function CleanTechLocationContent(
  props: LocationContentProps,
): React.ReactElement {
  const { pos, data, showRear, label, isSelected } = props;
  const { current, maximum, rear = 0, rearMaximum } = data;
  const center = { x: pos.x + pos.width / 2, y: pos.y + pos.height / 2 };
  const frontMaximum = showRear ? Math.round(maximum * 0.75) : maximum;
  const resolvedRearMaximum = rearMaximum ?? Math.round(maximum * 0.25);

  const frontColor = showRear
    ? ArmorFills.getTorsoFrontStatusColor(current, maximum)
    : ArmorFills.getArmorStatusColor(current, maximum);
  const rearColor = ArmorFills.getTorsoRearStatusColor(rear, maximum);
  const strokeColor = isSelected ? ArmorFills.SELECTED_STROKE : '#475569';
  const strokeWidth = isSelected ? 2.5 : 1;

  const dividerHeight = showRear ? 2 : 0;
  const frontHeight = showRear ? pos.height * 0.65 : pos.height;
  const rearHeight = showRear ? pos.height * 0.35 - dividerHeight : 0;
  const dividerY = pos.y + frontHeight;
  const rearY = dividerY + dividerHeight;
  const frontPosition = pos.path ? pos : { ...pos, height: frontHeight };

  return (
    <>
      <ArmorCapacityFill
        position={frontPosition}
        current={current}
        maximum={frontMaximum}
        color={frontColor}
        emptyColor={ArmorFills.darkenColor(frontColor, 0.58)}
        marker={`${label}-front`}
        radius={6}
        className="transition-all duration-150"
      />
      {pos.path ? (
        <path
          d={pos.path}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          className="transition-all duration-150"
        />
      ) : (
        <rect
          x={pos.x}
          y={pos.y}
          width={pos.width}
          height={frontHeight}
          rx={6}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          className="transition-all duration-150"
        />
      )}

      <text
        x={center.x}
        y={pos.y + frontHeight / 2 + 5}
        textAnchor="middle"
        className="pointer-events-none fill-white font-bold"
        style={{ fontSize: pos.width < 40 ? '14px' : '18px' }}
      >
        {current}
      </text>
      <text
        x={center.x}
        y={pos.y + frontHeight / 2 + 18}
        textAnchor="middle"
        className="pointer-events-none fill-white/60"
        style={{ fontSize: '9px' }}
      >
        / {maximum}
      </text>
      <text
        x={center.x}
        y={pos.y + 12}
        textAnchor="middle"
        className="pointer-events-none fill-white/80 font-semibold"
        style={{ fontSize: showRear ? '8px' : '10px' }}
      >
        {showRear ? `${label} FRONT` : label}
      </text>

      {showRear && (
        <>
          <line
            x1={pos.x + 4}
            y1={dividerY + 1}
            x2={pos.x + pos.width - 4}
            y2={dividerY + 1}
            stroke="#334155"
            strokeWidth={1}
            strokeDasharray="3 2"
            className="pointer-events-none"
          />
          <ArmorCapacityFill
            position={{
              x: pos.x,
              y: rearY,
              width: pos.width,
              height: rearHeight,
            }}
            current={rear}
            maximum={resolvedRearMaximum}
            color={rearColor}
            emptyColor={ArmorFills.darkenColor(rearColor, 0.58)}
            marker={`${label}-rear`}
            section="rear"
            radius={6}
            className="transition-all duration-150"
          />
          <rect
            x={pos.x}
            y={rearY}
            width={pos.width}
            height={rearHeight}
            rx={6}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            className="transition-all duration-150"
          />
          <text
            x={center.x}
            y={rearY + 11}
            textAnchor="middle"
            className="pointer-events-none fill-white/80 font-semibold"
            style={{ fontSize: '8px' }}
          >
            REAR
          </text>
          <text
            x={center.x}
            y={rearY + rearHeight / 2 + 6}
            textAnchor="middle"
            className="pointer-events-none fill-white font-bold"
            style={{ fontSize: '14px' }}
          >
            {rear}
          </text>
        </>
      )}
    </>
  );
}

export { NeonLocationContent } from './LocationInteraction.neon';
