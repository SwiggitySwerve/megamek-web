import Link from 'next/link';
import { Surface } from '../../ui';

const sections = [
  {
    href: '/compendium/equipment',
    title: 'Equipment',
    summary: 'Energy, ballistic, and missile weapons sourced from the canonical equipment DB.',
  },
  {
    href: '/compendium/components',
    title: 'Components',
    summary: 'Structure, armor, engine, gyro, cockpit, and heat sink variants with slots and weight data.',
  },
  {
    href: '/compendium/units',
    title: 'Units',
    summary: 'BattleMech blueprints with derived weight metrics and validation outputs.',
  },
];

export default function CompendiumIndexPage(): JSX.Element {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">Compendium</p>
        <h1 className="text-4xl font-semibold">Rule-Accurate References</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Browse the canonical data sets backing the customizer—equipment, structural components, and
          fully hydrated unit blueprints.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map(section => (
          <Surface key={section.href} variant="sunken" padding="lg" className="space-y-3">
            <h2 className="text-2xl font-semibold">{section.title}</h2>
            <p className="text-sm text-[var(--text-secondary)]">{section.summary}</p>
            <Link
              href={section.href}
              className="inline-flex items-center rounded-pill bg-[var(--accent-primary)] px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-[var(--accent-primary-hover)] transition-colors"
            >
              Open {section.title}
            </Link>
          </Surface>
        ))}
      </div>
    </div>
  );
}


