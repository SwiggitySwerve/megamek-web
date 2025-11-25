import { CompendiumSources } from '../../../features/compendium/data/CompendiumSources';
import { CompendiumBrowser } from '../../../features/compendium/components/CompendiumBrowser';
import type { ReactElement } from 'react';

export default function UnitsCompendiumPage(): ReactElement {
  const entries = CompendiumSources.getUnitEntries();

  return (
    <div className="p-6">
      <CompendiumBrowser
        entries={entries}
        title="Unit Compendium"
        description="BattleMech blueprints hydrated from the mech lab store with derived weight/validation metrics."
        emptyState="No unit blueprints registered yet."
      />
    </div>
  );
}


