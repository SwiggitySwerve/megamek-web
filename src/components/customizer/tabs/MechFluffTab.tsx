import React from 'react';

import { useUnitStore } from '@/stores/useUnitStore';

import { FluffTab } from './FluffTab';

interface MechFluffTabProps {
  readOnly?: boolean;
  className?: string;
}

/** Bind the shared controlled fluff form to the active BattleMech draft. */
export function MechFluffTab({
  readOnly = false,
  className,
}: MechFluffTabProps): React.ReactElement {
  const unitId = useUnitStore((state) => state.id);
  const role = useUnitStore((state) => state.role);
  const fluff = useUnitStore((state) => state.fluff);
  const setRole = useUnitStore((state) => state.setRole);
  const updateFluff = useUnitStore((state) => state.updateFluff);

  return (
    <FluffTab
      key={unitId}
      role={role}
      fluff={fluff}
      readOnly={readOnly}
      className={className}
      onRoleChange={setRole}
      onFluffChange={updateFluff}
    />
  );
}
