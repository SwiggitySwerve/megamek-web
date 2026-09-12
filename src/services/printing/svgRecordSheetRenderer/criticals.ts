/**
 * Critical slots rendering utilities
 * Renders critical hit tables for each location with multi-slot equipment brackets
 */

import { ILocationCriticals, IRecordSheetCriticalSlot } from '@/types/printing';
import { logger } from '@/utils/logger';

import { SVG_NS } from './constants';
import {
  ALT_FILL,
  applyFittedText,
  BAR_WIDTH,
  BRACKET_ARM,
  BRACKET_PAD_RATIO,
  BRACKET_STROKE,
  contentMaxWidth,
  contentX,
  CRIT_FONT_FAMILY,
  DIVIDER_STROKE,
  DIVIDER_WIDTH,
  EMPTY_FILL,
  fitCriticalText,
  gapHeightFor,
  HEADER_CLEARANCE,
  numberX,
  readCritRect,
  SLOT_FONT_SIZE,
  slotBandTop,
  slotBaselineY,
  TITLE_FONT_SIZE,
} from './criticalTableHelper';

/**
 * Render critical slots for all locations
 */
export function renderCriticalSlots(
  svgDoc: Document,
  criticals: readonly ILocationCriticals[],
): void {
  criticals.forEach((loc) => {
    renderLocationCriticals(svgDoc, loc);
  });
}

/**
 * Render critical slots for a single location
 * Uses the crits_XX rect elements from the template as positioning guides
 */
function renderLocationCriticals(
  svgDoc: Document,
  location: ILocationCriticals,
): void {
  const abbr = location.abbreviation;

  // Template uses crits_XX format (e.g., crits_HD, crits_LA)
  const critAreaId = `crits_${abbr}`;
  const critArea = svgDoc.getElementById(critAreaId);

  if (!critArea) {
    logger.warn(`Critical area not found: ${critAreaId}`);
    return;
  }

  const rect = readCritRect(critArea);
  if (!rect) {
    logger.warn(`Critical area has invalid geometry: ${critAreaId}`);
    return;
  }

  const { x, y, width, height } = rect;

  const existing = svgDoc.getElementById(`critSlots_${abbr}`);
  if (existing?.parentNode) {
    existing.parentNode.removeChild(existing);
  }

  const group = svgDoc.createElementNS(SVG_NS, 'g');
  group.setAttribute('id', `critSlots_${abbr}`);
  group.setAttribute('class', 'crit-slots');

  const slotCount = location.slots.length;
  const gapHeight = gapHeightFor(slotCount, height);
  const slotHeight = slotCount > 0 ? (height - gapHeight) / slotCount : 0;
  const numX = numberX(x);
  const textX = contentX(x);
  const maxTextWidth = contentMaxWidth(rect);

  const labelEl = svgDoc.createElementNS(SVG_NS, 'text');
  labelEl.setAttribute('x', String(textX));
  labelEl.setAttribute('y', String(y - HEADER_CLEARANCE));
  labelEl.setAttribute('font-family', CRIT_FONT_FAMILY);
  labelEl.setAttribute('font-weight', 'bold');
  labelEl.setAttribute('fill', '#000000');
  labelEl.setAttribute('text-anchor', 'start');
  applyFittedText(
    labelEl,
    fitCriticalText(location.location, maxTextWidth, TITLE_FONT_SIZE, true),
  );
  labelEl.textContent = location.location;
  group.appendChild(labelEl);

  if (slotCount > 0 && Number.isFinite(slotHeight) && slotHeight > 0) {
    const multiSlotGroups = identifyMultiSlotGroups(location.slots);

    location.slots.forEach((slot, index) => {
      const bandTop = slotBandTop(y, index, slotHeight, gapHeight, slotCount);
      const slotY = slotBaselineY(y, index, slotHeight, gapHeight, slotCount);

      if (index % 2 === 1) {
        const band = svgDoc.createElementNS(SVG_NS, 'rect');
        band.setAttribute('class', 'crit-slot-band');
        band.setAttribute('x', String(x));
        band.setAttribute('y', String(bandTop));
        band.setAttribute('width', String(width));
        band.setAttribute('height', String(slotHeight));
        band.setAttribute('fill', ALT_FILL);
        band.setAttribute('stroke', 'none');
        group.appendChild(band);
      }

      const displayNum = (index % 6) + 1;
      const numEl = svgDoc.createElementNS(SVG_NS, 'text');
      numEl.setAttribute('x', String(numX));
      numEl.setAttribute('y', String(slotY));
      numEl.setAttribute('font-size', `${SLOT_FONT_SIZE}px`);
      numEl.setAttribute('font-family', CRIT_FONT_FAMILY);
      numEl.setAttribute('font-weight', 'bold');
      numEl.setAttribute('fill', '#000000');
      numEl.textContent = `${displayNum}.`;
      group.appendChild(numEl);

      const contentEl = svgDoc.createElementNS(SVG_NS, 'text');
      contentEl.setAttribute('x', String(textX));
      contentEl.setAttribute('y', String(slotY));
      contentEl.setAttribute('font-family', CRIT_FONT_FAMILY);

      let content: string;
      let fillColor = '#000000';
      let fontWeight = 'normal';

      if (slot.content && slot.content.trim() !== '') {
        content = slot.content;
        if (slot.isHittable) {
          fontWeight = 'bold';
        }
      } else if (slot.isRollAgain) {
        content = 'Roll Again';
        fontWeight = 'normal';
      } else {
        content = '-Empty-';
        fillColor = EMPTY_FILL;
      }

      contentEl.setAttribute('fill', fillColor);
      contentEl.setAttribute('font-weight', fontWeight);
      applyFittedText(
        contentEl,
        fitCriticalText(
          content,
          maxTextWidth,
          SLOT_FONT_SIZE,
          fontWeight === 'bold',
        ),
      );
      contentEl.textContent = content;
      group.appendChild(contentEl);
    });

    if (slotCount > 6) {
      const divider = svgDoc.createElementNS(SVG_NS, 'line');
      const dividerY = y + 6 * slotHeight + gapHeight / 2;
      divider.setAttribute('class', 'crit-group-divider');
      divider.setAttribute('x1', String(x + 1));
      divider.setAttribute('y1', String(dividerY));
      divider.setAttribute('x2', String(x + width - 1));
      divider.setAttribute('y2', String(dividerY));
      divider.setAttribute('stroke', DIVIDER_STROKE);
      divider.setAttribute('stroke-width', String(DIVIDER_WIDTH));
      group.appendChild(divider);
    }

    multiSlotGroups.forEach((groupInfo) => {
      drawMultiSlotBar({
        svgDoc,
        group,
        x,
        y,
        slotHeight,
        gapHeight,
        slotCount,
        groupInfo,
        barWidth: BAR_WIDTH,
      });
    });
  }

  const parent = critArea.parentNode;
  if (parent) {
    parent.insertBefore(group, critArea.nextSibling);
  }
}

/**
 * Identify groups of consecutive slots that belong to the same multi-slot equipment
 * Only brackets USER equipment (weapons, ammo) - NOT system components (engine, gyro, actuators)
 */
function identifyMultiSlotGroups(
  slots: readonly IRecordSheetCriticalSlot[],
): Array<{ startIndex: number; endIndex: number; content: string }> {
  interface SlotGroup {
    startIndex: number;
    content: string;
    equipmentId?: string;
  }

  const groups: Array<{
    startIndex: number;
    endIndex: number;
    content: string;
  }> = [];
  let currentGroup: SlotGroup | null = null;

  for (let index = 0; index < slots.length; index++) {
    const slot = slots[index];
    // Only consider user equipment (not system components) for bracketing
    const isUserEquipment =
      slot.content &&
      slot.content.trim() !== '' &&
      !slot.isRollAgain &&
      !slot.isSystem;
    const contentKey = isUserEquipment
      ? slot.equipmentId || slot.content
      : null;

    if (
      isUserEquipment &&
      currentGroup !== null &&
      contentKey === (currentGroup.equipmentId || currentGroup.content)
    ) {
      // Continue current group - same equipment
      continue;
    }

    // End current group if it spans multiple slots
    if (currentGroup !== null && index - currentGroup.startIndex > 1) {
      groups.push({
        startIndex: currentGroup.startIndex,
        endIndex: index - 1,
        content: currentGroup.content,
      });
    }

    // Start new group if slot has user equipment
    if (isUserEquipment) {
      currentGroup = {
        startIndex: index,
        content: slot.content,
        equipmentId: slot.equipmentId,
      };
    } else {
      currentGroup = null;
    }
  }

  // Handle final group
  if (currentGroup !== null && slots.length - currentGroup.startIndex > 1) {
    groups.push({
      startIndex: currentGroup.startIndex,
      endIndex: slots.length - 1,
      content: currentGroup.content,
    });
  }

  return groups;
}

/**
 * Draw a bracket indicating multi-slot equipment (MegaMekLab style)
 * Draws an "L" shaped bracket: horizontal top, vertical bar, horizontal bottom
 * When equipment spans across the gap between slots 6 and 7, draws a single
 * continuous bracket that bridges across the gap.
 */
type MultiSlotBarParams = {
  svgDoc: Document;
  group: Element;
  x: number;
  y: number;
  slotHeight: number;
  gapHeight: number;
  slotCount: number;
  groupInfo: { startIndex: number; endIndex: number };
  barWidth: number;
};

type BracketPathParams = {
  svgDoc: Document;
  group: Element;
  x: number;
  y: number;
  width: number;
  height: number;
  strokeWidth: number;
};

function drawMultiSlotBar(params: MultiSlotBarParams): void {
  const {
    svgDoc,
    group,
    x,
    y,
    slotHeight,
    gapHeight,
    slotCount,
    groupInfo,
    barWidth,
  } = params;
  const startSlot = groupInfo.startIndex;
  const endSlot = groupInfo.endIndex;
  const bracketWidth = BRACKET_ARM;
  const strokeWidth = BRACKET_STROKE;

  const verticalPadding = slotHeight * BRACKET_PAD_RATIO;

  let barStartY: number;
  let barEndY: number;

  if (slotCount > 6 && startSlot >= 6) {
    barStartY = y + startSlot * slotHeight + gapHeight + verticalPadding;
  } else {
    barStartY = y + startSlot * slotHeight + verticalPadding;
  }

  if (slotCount > 6 && endSlot >= 6) {
    barEndY = y + (endSlot + 1) * slotHeight + gapHeight - verticalPadding;
  } else {
    barEndY = y + (endSlot + 1) * slotHeight - verticalPadding;
  }

  const bracketX = x + barWidth;

  drawBracketPath({
    svgDoc,
    group,
    x: bracketX,
    y: barStartY,
    width: bracketWidth,
    height: barEndY - barStartY,
    strokeWidth,
  });
}

/**
 * Draw an L-shaped bracket path (MegaMekLab style)
 * Path: Move to top, horizontal left, vertical down, horizontal right
 */
function drawBracketPath(params: BracketPathParams): void {
  const { svgDoc, group, x, y, width, height, strokeWidth } = params;
  const path = svgDoc.createElementNS(SVG_NS, 'path');
  path.setAttribute(
    'd',
    `M ${x} ${y} ` + `h ${-width} ` + `v ${height} ` + `h ${width}`,
  );
  path.setAttribute('stroke', '#000000');
  path.setAttribute('stroke-width', String(strokeWidth));
  path.setAttribute('fill', 'none');
  group.appendChild(path);
}
