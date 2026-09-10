import { useEffect, useRef } from 'react';

import { useToast } from '@/components/shared/Toast';
import { subscribeToStorageWriteReceipts } from '@/stores/utils/clientSafeStorage';
import { UnitType } from '@/types/unit/BattleMechInterfaces';

export interface AutoSaveIndicatorTarget {
  readonly unitId: string;
  readonly unitType: UnitType;
}

function getDraftStoragePrefix(unitType: UnitType): string {
  switch (unitType) {
    case UnitType.BATTLEMECH:
    case UnitType.OMNIMECH:
    case UnitType.INDUSTRIALMECH:
      return 'megamek-unit';
    case UnitType.VEHICLE:
    case UnitType.VTOL:
    case UnitType.SUPPORT_VEHICLE:
      return 'megamek-vehicle';
    case UnitType.AEROSPACE:
    case UnitType.CONVENTIONAL_FIGHTER:
    case UnitType.SMALL_CRAFT:
    case UnitType.DROPSHIP:
    case UnitType.JUMPSHIP:
    case UnitType.WARSHIP:
    case UnitType.SPACE_STATION:
      return 'megamek-aerospace';
    case UnitType.BATTLE_ARMOR:
      return 'megamek-battlearmor';
    case UnitType.INFANTRY:
      return 'megamek-infantry';
    case UnitType.PROTOMECH:
      return 'megamek-protomech';
  }
}

export function getCustomizerDraftStorageKey({
  unitId,
  unitType,
}: AutoSaveIndicatorTarget): string {
  return `${getDraftStoragePrefix(unitType)}-${unitId}`;
}

/**
 * Reports browser-draft persistence for the active customizer unit.
 *
 * Success is driven by the completed localStorage write receipt, rather than a
 * state-change timer. The explicit library-save flow has its own API result and
 * continues to report "Unit ... saved successfully", so the two destinations
 * are unambiguous to the user.
 */
export function useAutoSaveIndicator(
  target: AutoSaveIndicatorTarget | null,
): void {
  const { showToast } = useToast();
  const successTimerRef = useRef<NodeJS.Timeout | null>(null);
  const storageKey = target ? getCustomizerDraftStorageKey(target) : null;

  useEffect(() => {
    if (!storageKey) return;

    const unsubscribe = subscribeToStorageWriteReceipts((receipt) => {
      if (receipt.key !== storageKey) return;

      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
        successTimerRef.current = null;
      }

      if (receipt.status === 'failed') {
        showToast({
          message: 'Draft could not be saved in this browser',
          variant: 'error',
        });
        return;
      }

      successTimerRef.current = setTimeout(() => {
        showToast({
          message: 'Draft saved in this browser',
          variant: 'success',
          duration: 1500,
        });
        successTimerRef.current = null;
      }, 500);
    });

    return () => {
      unsubscribe();
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
        successTimerRef.current = null;
      }
    };
  }, [showToast, storageKey]);
}
