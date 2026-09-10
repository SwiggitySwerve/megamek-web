import { MechLocation } from '@/types/construction';

interface BipedArmorPlate {
  readonly path: string;
  readonly x: number;
  readonly y: number;
  readonly label: string;
  readonly rearY?: number;
}

// Local presentation geometry; allocation limits come from ArmorTab's projection.
export const BIPED_ARMOR_PLATES: Partial<
  Record<MechLocation, BipedArmorPlate>
> = {
  [MechLocation.HEAD]: {
    path: 'M156 28 H204 L214 44 L207 78 H153 L146 44 Z',
    x: 180,
    y: 45,
    label: 'HD',
  },
  [MechLocation.CENTER_TORSO]: {
    path: 'M149 93 H211 L220 131 L210 204 L198 220 H162 L150 204 L140 131 Z',
    x: 180,
    y: 115,
    label: 'CT-F',
    rearY: 187,
  },
  [MechLocation.LEFT_TORSO]: {
    path: 'M223 93 L280 104 L274 181 L254 215 L221 203 L228 133 Z',
    x: 250,
    y: 120,
    label: 'LT-F',
    rearY: 182,
  },
  [MechLocation.RIGHT_TORSO]: {
    path: 'M137 93 L80 104 L86 181 L106 215 L139 203 L132 133 Z',
    x: 110,
    y: 120,
    label: 'RT-F',
    rearY: 182,
  },
  [MechLocation.LEFT_ARM]: {
    path: 'M288 99 L327 111 L339 161 L334 204 L343 250 L324 269 L289 256 L284 217 L293 176 L280 138 Z',
    x: 312,
    y: 169,
    label: 'LA',
  },
  [MechLocation.RIGHT_ARM]: {
    path: 'M72 99 L33 111 L21 161 L26 204 L17 250 L36 269 L71 256 L76 217 L67 176 L80 138 Z',
    x: 48,
    y: 169,
    label: 'RA',
  },
  [MechLocation.LEFT_LEG]: {
    path: 'M190 235 L245 228 L258 290 L247 327 L264 399 L247 415 H185 L186 373 L199 326 L184 280 Z',
    x: 222,
    y: 283,
    label: 'LL',
  },
  [MechLocation.RIGHT_LEG]: {
    path: 'M170 235 L115 228 L102 290 L113 327 L96 399 L113 415 H175 L174 373 L161 326 L176 280 Z',
    x: 138,
    y: 283,
    label: 'RL',
  },
};
