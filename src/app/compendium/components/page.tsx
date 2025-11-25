import { CompendiumSources } from '../../../features/compendium/data/CompendiumSources';
import { CompendiumBrowser } from '../../../features/compendium/components/CompendiumBrowser';

export default function ComponentsCompendiumPage(): JSX.Element {
  const entries = CompendiumSources.getComponentEntries();

  return (
    <div className="p-6">
      <CompendiumBrowser
        entries={entries}
        title="Component Compendium"
        description="Structure, armor, engine, gyro, cockpit, and heat sink profiles sourced from the mechanics layer."
      />
    </div>
  );
}


