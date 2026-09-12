/**
 * Root-only SVG size parsing. Canonical sheets have no root viewBox; nested
 * BattleMech logos carry viewBox="2.125 -70.896 69 69".
 */

import * as fs from 'fs';
import * as path from 'path';

import { parseSvgViewBox, readSvgRootSize } from '../svgGeometry';
import { parseSVGTemplate } from '../template';

const NESTED_LOGO_SHEET = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
   width="576.0"
   height="756.0"
   preserveAspectRatio="xMidYMid meet"
   version="1.0"
   xmlns="http://www.w3.org/2000/svg">
  <svg
     viewBox="2.125 -70.896 69 69"
     height="69"
     width="69"
     x="10"
     y="10">
    <rect width="69" height="69"/>
  </svg>
</svg>`;

const NESTED_LOGO_ISO = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="559.0" height="806.0" xmlns="http://www.w3.org/2000/svg">
  <svg viewBox="2.125 -70.896 69 69" height="69" width="69">
    <rect width="69" height="69"/>
  </svg>
</svg>`;

const US_TEMPLATE = path.join(
  process.cwd(),
  'public/record-sheets/templates_us/mek_biped_default.svg',
);
const ISO_TEMPLATE = path.join(
  process.cwd(),
  'public/record-sheets/templates_iso/mek_biped_default.svg',
);

// Real templates are fetched assets (gitignored, `npm run fetch:assets`). The
// CI unit shards run on a bare checkout without them, so gate the two
// read-from-disk cases on presence: they run locally, skip there. The inline
// fixtures above always run and carry the same regression.
const itIfAsset = (file: string) => (fs.existsSync(file) ? it : it.skip);

describe('parseSvgViewBox', () => {
  it('uses root width/height when a nested logo viewBox is present and the root has none', () => {
    expect(parseSvgViewBox(NESTED_LOGO_SHEET)).toEqual({
      width: 576,
      height: 756,
    });
  });

  it('uses ISO root dimensions rather than the nested 69×69 logo viewBox', () => {
    expect(parseSvgViewBox(NESTED_LOGO_ISO)).toEqual({
      width: 559,
      height: 806,
    });
  });

  itIfAsset(US_TEMPLATE)(
    'reads a real US template root, not the nested logo viewBox',
    () => {
      const svg = fs.readFileSync(US_TEMPLATE, 'utf8');
      expect(svg).toContain('viewBox="2.125 -70.896 69 69"');
      expect(parseSvgViewBox(svg)).toEqual({ width: 576, height: 756 });
    },
  );

  itIfAsset(ISO_TEMPLATE)(
    'reads a real ISO template root, not the nested logo viewBox',
    () => {
      const svg = fs.readFileSync(ISO_TEMPLATE, 'utf8');
      expect(parseSvgViewBox(svg)).toEqual({ width: 559, height: 806 });
    },
  );
});

describe('readSvgRootSize', () => {
  it('prefers root width/height over a descendant viewBox', () => {
    const { svgRoot } = parseSVGTemplate(NESTED_LOGO_SHEET, 'nested');
    expect(readSvgRootSize(svgRoot)).toEqual({ width: 576, height: 756 });
  });
});
