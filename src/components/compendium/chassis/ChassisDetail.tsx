import Link from 'next/link';

import type { ChassisTechBase, IChassisEntry } from '@/types/unit/ChassisIndex';

import { Card } from '@/components/ui/Card';

export const CHASSIS_TECH_LABELS: Record<ChassisTechBase, string> = {
  INNER_SPHERE: 'Inner Sphere',
  CLAN: 'Clan',
  MIXED: 'Mixed',
};

export function ChassisDetail({
  chassis,
}: {
  chassis: IChassisEntry;
}): React.ReactElement {
  return (
    <section aria-label={`${chassis.name} details`}>
      <Card className="mb-6">
        <h2 className="text-text-theme-primary text-2xl font-bold">
          {chassis.name}
        </h2>
        {chassis.aliases.length > 0 && (
          <p className="text-text-theme-secondary mt-1">
            Also known as {chassis.aliases.join(', ')}
          </p>
        )}
        <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <dt className="text-text-theme-secondary text-sm">Weight</dt>
            <dd>{chassis.weights.join(' / ')} t</dd>
          </div>
          <div>
            <dt className="text-text-theme-secondary text-sm">Class</dt>
            <dd>{chassis.weightClasses.join(' / ')}</dd>
          </div>
          <div>
            <dt className="text-text-theme-secondary text-sm">Technology</dt>
            <dd>
              {chassis.techBases
                .map((base) => CHASSIS_TECH_LABELS[base])
                .join(' / ')}
            </dd>
          </div>
          <div>
            <dt className="text-text-theme-secondary text-sm">Introduced</dt>
            <dd>{chassis.introductionYear}</dd>
          </div>
        </dl>
      </Card>
      <Card className="mb-6">
        <h3 className="text-text-theme-primary font-semibold">3D models</h3>
        <p className="text-text-theme-secondary mt-2">
          No preview has been added for this chassis yet.
        </p>
      </Card>
      <h3 className="text-text-theme-primary mb-2 text-lg font-semibold">
        Variants ({chassis.variants.length})
      </h3>
      <p className="text-text-theme-secondary mb-4 text-sm">
        The catalog includes unofficial designs. Check the rules level on each
        variant.
      </p>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {chassis.variants.map((variant) => (
          <li key={variant.unitId}>
            <Link
              href={`/compendium/units/${encodeURIComponent(variant.unitId)}`}
              className="border-border-theme-subtle bg-surface-base/50 hover:border-accent focus-visible:ring-accent block h-full rounded-xl border p-4 focus-visible:ring-2"
            >
              <span className="text-accent font-semibold">
                {chassis.name} {variant.name}
              </span>
              <span className="text-text-theme-secondary mt-2 block text-sm">
                {variant.weight} t · {CHASSIS_TECH_LABELS[variant.techBase]} ·{' '}
                {variant.introductionYear}
              </span>
              <span className="text-text-theme-secondary mt-1 block text-sm">
                {variant.rulesLevel ?? 'Rules level unspecified'}
                {variant.role ? ` · ${variant.role}` : ''}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
