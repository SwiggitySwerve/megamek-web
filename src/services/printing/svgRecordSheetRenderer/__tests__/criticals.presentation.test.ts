/**
 * Presentation / text-fit contracts for critical tables.
 *
 * Full names stay in the SVG, fitted without crude character-count
 * ellipsis, using detached-safe metrics (fillTemplate may run on an
 * unmounted SVG document).
 */
import type { ILocationCriticals } from '@/types/printing';

import { SVG_NS } from '../constants';
import { renderCriticalSlots } from '../criticals';
import {
  createMockLocationCriticals,
  createMockSlot,
  createMockSvgDoc,
  getCreatedElements,
  mockConsoleWarn,
} from './criticals.test-helpers';

/** US Letter biped `crits_LA` from public/record-sheets/templates_us/mek_biped_default.svg */
const US_LA = { x: 24, y: 35.25, width: 94.397003, height: 103.5 };
/** US Letter biped `crits_HD` */
const US_HD = { x: 139.397, y: 24.9, width: 94.397003, height: 50.025002 };

beforeEach(() => {
  mockConsoleWarn.mockClear();
});

afterAll(() => {
  mockConsoleWarn.mockRestore();
});

function createRealCritDoc(
  areas: Record<
    string,
    { x: number; y: number; width: number; height: number }
  >,
): Document {
  const rects = Object.entries(areas)
    .map(
      ([id, r]) =>
        `<rect id="${id}" x="${r.x}" y="${r.y}" width="${r.width}" height="${r.height}" fill="none"/>`,
    )
    .join('');
  return new DOMParser().parseFromString(
    `<svg xmlns="${SVG_NS}">${rects}</svg>`,
    'image/svg+xml',
  );
}

describe('critical table text fit (presentation)', () => {
  it('preserves the full equipment name in SVG instead of character-count ellipsis', () => {
    const mockDoc = createMockSvgDoc({
      critAreas: { crits_LA: US_LA },
    });

    const longName = 'Extended Range Particle Projection Cannon (ERPPC)';
    const criticals: ILocationCriticals[] = [
      createMockLocationCriticals({
        location: 'Left Arm',
        abbreviation: 'LA',
        slots: [
          createMockSlot({
            slotNumber: 1,
            content: longName,
            isHittable: true,
          }),
        ],
      }),
    ];

    renderCriticalSlots(mockDoc, criticals);

    const createdElements = getCreatedElements(mockDoc);
    const contentEl = createdElements.find(
      (el) => el.tagName === 'text' && el.textContent === longName,
    );

    expect(contentEl).toBeDefined();
    expect(contentEl!.textContent).toBe(longName);
    expect(contentEl!.textContent).not.toMatch(/\.\.$/);

    const fittedWidth = contentEl!.attributes.textLength;
    if (fittedWidth !== undefined) {
      const contentX = parseFloat(contentEl!.attributes.x);
      const maxRight = US_LA.x + US_LA.width - 2;
      expect(contentX + parseFloat(fittedWidth)).toBeLessThanOrEqual(
        maxRight + 0.01,
      );
    }

    const fontPx = parseFloat(contentEl!.attributes['font-size']);
    expect(fontPx).toBeGreaterThanOrEqual(6);
    expect(fontPx).toBeLessThanOrEqual(7.5);
  });

  it('aligns header, numbers, and content on a shared gutter and bolds slot numbers', () => {
    const mockDoc = createMockSvgDoc({
      critAreas: { crits_LA: US_LA },
    });

    const criticals: ILocationCriticals[] = [
      createMockLocationCriticals({
        location: 'Left Arm',
        abbreviation: 'LA',
        slots: [
          createMockSlot({
            slotNumber: 1,
            content: 'Shoulder',
            isSystem: true,
            isHittable: true,
          }),
        ],
      }),
    ];

    renderCriticalSlots(mockDoc, criticals);

    const createdElements = getCreatedElements(mockDoc);
    const texts = createdElements.filter((el) => el.tagName === 'text');
    const header = texts.find((el) => el.textContent === 'Left Arm');
    const number = texts.find((el) => el.textContent === '1.');
    const content = texts.find((el) => el.textContent === 'Shoulder');

    expect(header).toBeDefined();
    expect(number).toBeDefined();
    expect(content).toBeDefined();
    expect(parseFloat(header!.attributes.y)).toBeLessThan(US_LA.y);
    expect(number!.attributes['font-weight']).toBe('bold');
    expect(parseFloat(header!.attributes.x)).toBe(
      parseFloat(content!.attributes.x),
    );
    expect(parseFloat(number!.attributes.x)).toBeLessThan(
      parseFloat(content!.attributes.x),
    );
  });

  it('separates the 6/7 groups and keeps a 12-slot spanning bracket as one path', () => {
    const mockDoc = createMockSvgDoc({
      critAreas: { crits_LA: US_LA },
    });

    const criticals: ILocationCriticals[] = [
      createMockLocationCriticals({
        location: 'Left Arm',
        abbreviation: 'LA',
        slots: Array.from({ length: 12 }, (_, i) =>
          createMockSlot({
            slotNumber: i + 1,
            content: i >= 4 && i <= 8 ? 'LRM 20' : '',
            isHittable: i >= 4 && i <= 8,
            equipmentId: i >= 4 && i <= 8 ? 'lrm20-1' : undefined,
          }),
        ),
      }),
    ];

    renderCriticalSlots(mockDoc, criticals);

    const createdElements = getCreatedElements(mockDoc);
    const divider = createdElements.find(
      (el) => el.attributes.class === 'crit-group-divider',
    );
    const bands = createdElements.filter(
      (el) => el.attributes.class === 'crit-slot-band',
    );
    const paths = createdElements.filter((el) => el.tagName === 'path');

    expect(divider).toBeDefined();
    expect(bands.length).toBe(6);
    expect(paths.length).toBe(1);
  });

  it('skips empty locations without NaN attributes', () => {
    const mockDoc = createMockSvgDoc({
      critAreas: { crits_HD: US_HD },
    });

    const criticals: ILocationCriticals[] = [
      createMockLocationCriticals({
        location: 'Head',
        abbreviation: 'HD',
        slots: [],
      }),
    ];

    expect(() => renderCriticalSlots(mockDoc, criticals)).not.toThrow();

    const createdElements = getCreatedElements(mockDoc);
    createdElements.forEach((el) => {
      Object.values(el.attributes).forEach((value) => {
        expect(value).not.toMatch(/NaN|Infinity/i);
      });
    });
  });

  it('re-renders a location idempotently on a detached SVG document', () => {
    const doc = createRealCritDoc({ crits_HD: US_HD });
    const criticals: ILocationCriticals[] = [
      createMockLocationCriticals({
        location: 'Head',
        abbreviation: 'HD',
        slots: [
          createMockSlot({
            slotNumber: 1,
            content: 'Life Support',
            isSystem: true,
            isHittable: true,
          }),
        ],
      }),
    ];

    renderCriticalSlots(doc, criticals);
    renderCriticalSlots(doc, criticals);

    expect(doc.querySelectorAll('#critSlots_HD').length).toBe(1);
    expect(doc.querySelectorAll('.crit-slots').length).toBe(1);
    const content = Array.from(doc.querySelectorAll('text')).find(
      (el) => el.textContent === 'Life Support',
    );
    expect(content).toBeDefined();
  });
});
