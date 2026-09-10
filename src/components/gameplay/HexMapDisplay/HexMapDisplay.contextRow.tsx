import React from 'react';

import type { ICombatRangeHex, IMovementRangeHex } from '@/types/gameplay';
import type { ITacticalMapHexProjection } from '@/utils/gameplay/tacticalMapProjection';

import {
  tacticalProjectionDataAttributes,
  type TacticalProjectionDataAttributes,
  type TacticalProjectionSourceMetadata,
} from './HexMapDisplay.tacticalProjectionAttributes';

export interface CombatContextRowsProps {
  readonly combatInfo: ICombatRangeHex;
  readonly projection?: ITacticalMapHexProjection;
  readonly testId: string;
}

export interface MovementContextRowsProps {
  readonly movementInfo: IMovementRangeHex;
  readonly projection?: ITacticalMapHexProjection;
  readonly testId: string;
}

export function TacticalProjectionContextRow({
  children,
  dataAttributes,
  rulesSurface,
  source,
  testId,
}: {
  readonly children: React.ReactNode;
  readonly dataAttributes?: TacticalProjectionDataAttributes;
  readonly rulesSurface?: string;
  readonly source: TacticalProjectionSourceMetadata;
  readonly testId: string;
}): React.ReactElement {
  return (
    <div
      className="border-border-theme/70 text-text-theme-primary mt-1 border-t pt-1 text-[11px]"
      data-testid={testId}
      {...tacticalProjectionDataAttributes(source, rulesSurface)}
      {...dataAttributes}
    >
      {children}
    </div>
  );
}
