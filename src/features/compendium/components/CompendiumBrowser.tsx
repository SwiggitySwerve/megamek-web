'use client';

import React, { useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { CompendiumCategory, ICompendiumEntry } from '../types';
import { TechBase, RulesLevel } from '../../../types/TechBase';
import { Surface, Button } from '../../../ui';

type TechBaseFilter = 'all' | TechBase;
type RulesFilter = 'all' | RulesLevel;

const TECH_FILTERS: Array<{ label: string; value: TechBaseFilter }> = [
  { label: 'All Tech Bases', value: 'all' },
  { label: 'Inner Sphere', value: TechBase.INNER_SPHERE },
  { label: 'Clan', value: TechBase.CLAN },
  { label: 'Mixed', value: TechBase.MIXED },
];

const RULES_FILTERS: Array<{ label: string; value: RulesFilter }> = [
  { label: 'All Rules', value: 'all' },
  { label: 'Introductory', value: RulesLevel.INTRODUCTORY },
  { label: 'Standard', value: RulesLevel.STANDARD },
  { label: 'Advanced', value: RulesLevel.ADVANCED },
  { label: 'Experimental', value: RulesLevel.EXPERIMENTAL },
];

export interface CompendiumBrowserProps<
  TEntry extends ICompendiumEntry<CompendiumCategory, unknown>,
> {
  readonly entries: ReadonlyArray<TEntry>;
  readonly title: string;
  readonly description: string;
  readonly emptyState?: string;
}

export function CompendiumBrowser<
  TEntry extends ICompendiumEntry<CompendiumCategory, unknown>,
>({ entries, title, description, emptyState = 'No results match your filters.' }: CompendiumBrowserProps<TEntry>): JSX.Element {
  const [query, setQuery] = useState('');
  const [techFilter, setTechFilter] = useState<TechBaseFilter>('all');
  const [rulesFilter, setRulesFilter] = useState<RulesFilter>('all');
  const [selected, setSelected] = useState<TEntry | null>(null);

  const filteredEntries = useMemo(
    () =>
      entries.filter(entry => {
        const matchesQuery =
          query.trim().length === 0 ||
          entry.name.toLowerCase().includes(query.toLowerCase()) ||
          entry.summary.toLowerCase().includes(query.toLowerCase()) ||
          entry.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));

        const matchesTech =
          techFilter === 'all' || (entry.techBase && entry.techBase === techFilter);

        const matchesRules =
          rulesFilter === 'all' || (entry.rulesLevel && entry.rulesLevel === rulesFilter);

        return matchesQuery && matchesTech && matchesRules;
      }),
    [entries, query, rulesFilter, techFilter]
  );

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">Compendium</p>
        <h1 className="text-4xl font-semibold">{title}</h1>
        <p className="text-sm text-[var(--text-secondary)]">{description}</p>
      </div>

      <Surface className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="search"
            placeholder="Search by name, tags, or summary..."
            value={query}
            onChange={handleSearchChange}
            className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface-sunken)] px-4 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
          />
          <select
            value={techFilter}
            onChange={event => setTechFilter(event.target.value as TechBaseFilter)}
            className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface-sunken)] px-4 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
          >
            {TECH_FILTERS.map(filter => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
          <select
            value={rulesFilter}
            onChange={event => setRulesFilter(event.target.value as RulesFilter)}
            className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface-sunken)] px-4 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
          >
            {RULES_FILTERS.map(filter => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>
        <div className="text-xs text-[var(--text-muted)]">
          Showing {filteredEntries.length} of {entries.length} entries
        </div>
      </Surface>

      {filteredEntries.length === 0 ? (
        <Surface variant="sunken" className="text-center py-12 text-[var(--text-muted)]">
          {emptyState}
        </Surface>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredEntries.map(entry => (
            <Surface
              key={entry.id}
              variant="sunken"
              padding="sm"
              className="cursor-pointer hover:border-[var(--accent-primary)] transition-colors flex flex-col gap-2"
              onClick={() => setSelected(entry)}
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
                    {entry.category}
                  </p>
                  <h3 className="text-lg font-semibold">{entry.name}</h3>
                </div>
                <span className="text-[10px] font-semibold text-[var(--accent-secondary)]">
                  {entry.techBase ?? 'Universal'}
                </span>
              </div>
              <p className="text-sm text-[var(--text-secondary)] overflow-hidden text-ellipsis whitespace-nowrap">
                {entry.summary}
              </p>
              <div className="flex flex-wrap gap-2">
                {entry.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-[10px] uppercase tracking-wide text-[var(--text-muted)] bg-[var(--surface-panel)] border border-[var(--surface-border)] rounded-full px-2 py-0.5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Surface>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
          <Surface variant="overlay" padding="lg" className="w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-strong">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
                  {selected.category}
                </p>
                <h2 className="text-3xl font-semibold">{selected.name}</h2>
                <p className="text-sm text-[var(--text-secondary)]">{selected.summary}</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Source: <code className="text-[var(--text-secondary)]">{selected.source}</code>
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>
                Close
              </Button>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
              {selected.stats.map(stat => (
                <Surface key={stat.id} variant="sunken" padding="sm">
                  <p className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">
                    {stat.label}
                  </p>
                  <p className="text-lg font-mono">{stat.value}</p>
                  {stat.description && (
                    <p className="text-[11px] text-[var(--text-muted)] mt-1">{stat.description}</p>
                  )}
                </Surface>
              ))}
            </div>

            <div className="mt-6">
              <p className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">
                Canonical Payload
              </p>
              <pre className="bg-[var(--surface-sunken)] border border-[var(--surface-border)] rounded-xl p-4 text-[11px] overflow-x-auto">
                {JSON.stringify(selected.payload, null, 2)}
              </pre>
            </div>
          </Surface>
        </div>
      )}
    </div>
  );
}


