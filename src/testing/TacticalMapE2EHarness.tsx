import { useRouter } from 'next/router';
import { useState } from 'react';

import type { MapMovementKind } from '@/components/gameplay/HexMapDisplay/HexMapDisplay.types';

import { HexMapDisplay } from '@/components/gameplay/HexMapDisplay/HexMapDisplay';
import { resolveTacticalMapE2EHarnessConfig } from '@/testing/tactical-map.e2e-harness-config';

const isTestEnv =
  process.env.NODE_ENV === 'development' ||
  process.env.NODE_ENV === 'test' ||
  process.env.NEXT_PUBLIC_E2E_MODE === 'true';

export default function TacticalMapE2EHarness(): React.JSX.Element {
  const router = useRouter();
  const [legendMode, setLegendMode] = useState<MapMovementKind>('run');
  const scenario =
    typeof router.query.scenario === 'string' ? router.query.scenario : '';
  const config = resolveTacticalMapE2EHarnessConfig(scenario, legendMode);

  if (!isTestEnv) {
    return <main style={{ padding: 40 }}>Not Available</main>;
  }

  return (
    <main
      className="bg-surface-deep text-text-theme-primary min-h-screen p-4"
      data-testid="tactical-map-e2e-harness"
    >
      <section className="mx-auto flex max-w-6xl flex-col gap-3">
        <h1 className="text-lg font-semibold">Tactical Map E2E Harness</h1>
        <div className="border-border-theme-subtle bg-surface-deep h-[680px] overflow-hidden rounded border">
          <HexMapDisplay
            mapId="tactical-map-e2e"
            radius={config.mapRadius}
            tokens={config.tokens}
            selectedHex={config.selectedHex}
            targetUnitId={config.targetUnitId}
            hexTerrain={config.hexTerrain}
            unitWeapons={config.unitWeapons}
            combatState={config.combatState}
            selectedWeaponIds={config.selectedWeaponIds}
            showCoordinates
            movementRange={config.movementRange}
            highlightPath={config.highlightPath}
            mpLegend={config.mpLegend}
            onMovementModeSelect={
              scenario === 'legend-mode-selection' ? setLegendMode : undefined
            }
          />
        </div>
      </section>
    </main>
  );
}
