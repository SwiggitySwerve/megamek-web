import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import type { IChassisIndex } from '@/types/unit/ChassisIndex';

import { ChassisBrowser } from '@/components/compendium/chassis/ChassisBrowser';
import { ChassisDetail } from '@/components/compendium/chassis/ChassisDetail';
import { CompendiumLayout } from '@/components/compendium/CompendiumLayout';
import { Button } from '@/components/ui/Button';

export default function ChassisPage(): React.ReactElement {
  const router = useRouter();
  const [index, setIndex] = useState<IChassisIndex | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setError(false);
    async function load() {
      try {
        const response = await fetch('/api/chassis', {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('Chassis catalog unavailable');
        const data: IChassisIndex = await response.json();
        if (!controller.signal.aborted) setIndex(data);
      } catch {
        if (!controller.signal.aborted) setError(true);
      }
    }
    void load();
    return () => controller.abort();
  }, [attempt]);

  const requestedId = router.query.chassis;
  const selected = index?.chassis.find((chassis) => chassis.id === requestedId);
  const breadcrumbs = requestedId
    ? [
        { label: 'Chassis index', href: '/compendium/chassis' },
        { label: selected?.name ?? 'Chassis' },
      ]
    : [{ label: 'Chassis index' }];

  return (
    <CompendiumLayout
      title="Chassis index"
      subtitle="Browse BattleMech chassis, alternate names, and canonical variants."
      breadcrumbs={breadcrumbs}
      maxWidth="wide"
    >
      <Head>
        <title>{`${selected ? `${selected.name} · ` : ''}Chassis index | MekStation`}</title>
      </Head>
      {error ? (
        <div role="alert">
          <p className="mb-4">The chassis catalog could not be loaded.</p>
          <Button onClick={() => setAttempt((value) => value + 1)}>
            Try again
          </Button>
        </div>
      ) : !index || !router.isReady ? (
        <p role="status">Loading chassis index…</p>
      ) : requestedId !== undefined ? (
        <>
          <Link
            href="/compendium/chassis"
            shallow
            className="text-accent focus-visible:ring-accent mb-4 inline-flex min-h-11 items-center rounded focus-visible:ring-2"
          >
            Back to chassis index
          </Link>
          {selected ? (
            <ChassisDetail chassis={selected} />
          ) : (
            <p role="alert">This chassis is not in the catalog.</p>
          )}
        </>
      ) : (
        <ChassisBrowser index={index} />
      )}
    </CompendiumLayout>
  );
}
