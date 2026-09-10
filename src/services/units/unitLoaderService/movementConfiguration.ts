import { MovementEnhancementType } from '@/types/construction/MovementEnhancement';
import { JumpJetType } from '@/utils/construction/movementCalculations';

import type { IRawSerializedUnit } from './types';

export class UnsupportedUnitConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnsupportedUnitConfigurationError';
  }
}

const jumpTypes: Readonly<Record<string, JumpJetType>> = {
  STANDARD: JumpJetType.STANDARD,
  IMPROVED: JumpJetType.IMPROVED,
  MECHANICAL: JumpJetType.MECHANICAL,
  'MECHANICAL JUMP BOOSTERS': JumpJetType.MECHANICAL,
};
const enhancements: Readonly<Record<string, MovementEnhancementType>> = {
  MASC: MovementEnhancementType.MASC,
  SUPERCHARGER: MovementEnhancementType.SUPERCHARGER,
  TSM: MovementEnhancementType.TSM,
  'TRIPLE-STRENGTH MYOMER': MovementEnhancementType.TSM,
  PARTIAL_WING: MovementEnhancementType.PARTIAL_WING,
  'PARTIAL WING': MovementEnhancementType.PARTIAL_WING,
};

export function mapMovementConfiguration(
  movement: IRawSerializedUnit['movement'],
): {
  jumpMP: number;
  jumpJetType: JumpJetType;
  enhancement: MovementEnhancementType | null;
} {
  const jumpJetType =
    jumpTypes[(movement?.jumpJetType ?? 'STANDARD').toUpperCase()];
  if (!jumpJetType) {
    throw new UnsupportedUnitConfigurationError(
      `Jump equipment "${movement?.jumpJetType}" is not supported by this editor.`,
    );
  }
  const requested = movement?.enhancements ?? [];
  if (requested.length > 1) {
    throw new UnsupportedUnitConfigurationError(
      'This definition uses multiple movement enhancements; this editor supports one at a time.',
    );
  }
  const enhancement = requested.length
    ? enhancements[requested[0].toUpperCase()]
    : null;
  if (enhancement === undefined) {
    throw new UnsupportedUnitConfigurationError(
      `Movement enhancement "${requested[0]}" is not supported by this editor.`,
    );
  }
  return { jumpMP: movement?.jump ?? 0, jumpJetType, enhancement };
}
