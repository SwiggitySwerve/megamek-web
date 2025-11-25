import { CompendiumSources } from '../../../features/compendium/data/CompendiumSources';
import { CompendiumBrowser } from '../../../features/compendium/components/CompendiumBrowser';

export default function EquipmentCompendiumPage(): JSX.Element {
  const entries = CompendiumSources.getEquipmentEntries();

  return (
    <div className="p-6">
      <CompendiumBrowser
        entries={entries}
        title="Equipment Compendium"
        description="All weapon entries pulled directly from the canonical BattleTech equipment database."
      />
    </div>
  );
}


