import { CompendiumSources } from '../../../features/compendium/data/CompendiumSources';
import { CompendiumBrowser } from '../../../features/compendium/components/CompendiumBrowser';

export default function UnitsCompendiumPage(): JSX.Element {
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


