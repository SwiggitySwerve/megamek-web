import Link from 'next/link';
import { useState } from 'react';

import type { IChassisIndex } from '@/types/unit/ChassisIndex';

import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { searchChassisIndex } from '@/services/units/chassis/chassisIndex';
import { WeightClass } from '@/types/enums/WeightClass';

import { CHASSIS_TECH_LABELS } from './ChassisDetail';

const PAGE_SIZE = 24;

export function ChassisBrowser({
  index,
}: {
  index: IChassisIndex;
}): React.ReactElement {
  const [query, setQuery] = useState('');
  const [weightClass, setWeightClass] = useState('');
  const [page, setPage] = useState(1);
  const filtered = searchChassisIndex(index.chassis, query, weightClass);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <p className="text-text-theme-secondary mb-5">
        {index.chassis.length.toLocaleString()} chassis ·{' '}
        {index.totalVariants.toLocaleString()} variants
      </p>
      <div className="mb-4 grid items-end gap-3 sm:grid-cols-[1fr_12rem_auto]">
        <Input
          label="Search chassis"
          placeholder="Name, alternate name, or variant…"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}
        />
        <Select
          label="Weight class"
          value={weightClass}
          onChange={(event) => {
            setWeightClass(event.target.value);
            setPage(1);
          }}
          options={[
            { value: '', label: 'All classes' },
            ...Object.values(WeightClass).map((value) => ({
              value,
              label: value,
            })),
          ]}
        />
        <Button
          onClick={() => {
            setQuery('');
            setWeightClass('');
            setPage(1);
          }}
        >
          Clear filters
        </Button>
      </div>
      <p role="status" className="text-text-theme-secondary mb-4 text-sm">
        {filtered.length} chassis found
      </p>
      {visible.length === 0 ? (
        <p className="border-border-theme-subtle rounded-xl border p-8">
          No chassis match these filters. Try another name or clear the filters.
        </p>
      ) : (
        <ul className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((chassis) => (
            <li key={chassis.id}>
              <Link
                href={{
                  pathname: '/compendium/chassis',
                  query: { chassis: chassis.id },
                }}
                shallow
                className="border-border-theme-subtle bg-surface-base/50 hover:border-accent focus-visible:ring-accent block h-full rounded-xl border p-5 focus-visible:ring-2"
                aria-label={`View ${chassis.name} chassis`}
              >
                <h2 className="text-text-theme-primary text-lg font-semibold">
                  {chassis.name}
                </h2>
                {chassis.aliases.length > 0 && (
                  <p className="text-accent mt-1 text-sm">
                    {chassis.aliases.join(' · ')}
                  </p>
                )}
                <p className="text-text-theme-secondary mt-3 text-sm">
                  {chassis.weights.join(' / ')} t ·{' '}
                  {chassis.weightClasses.join(' / ')}
                </p>
                <p className="text-text-theme-secondary mt-1 text-sm">
                  {chassis.variants.length}{' '}
                  {chassis.variants.length === 1 ? 'variant' : 'variants'} ·{' '}
                  {chassis.techBases
                    .map((base) => CHASSIS_TECH_LABELS[base])
                    .join(' / ')}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {totalPages > 1 && (
        <nav
          aria-label="Chassis pages"
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <Button
            variant="pagination"
            disabled={page === 1}
            onClick={() => setPage((value) => value - 1)}
          >
            Previous
          </Button>
          <span className="text-text-theme-secondary text-sm">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="pagination"
            disabled={page === totalPages}
            onClick={() => setPage((value) => value + 1)}
          >
            Next
          </Button>
        </nav>
      )}
    </>
  );
}
