import { LoadRequestCoordinator } from '../LoadRequestCoordinator';

it('suppresses only an in-flight duplicate and permits retry after completion', () => {
  const requests = new LoadRequestCoordinator();
  const first = requests.begin('canonical:atlas')!;
  expect(requests.begin('canonical:atlas')).toBeNull();
  requests.finish(first);
  const retry = requests.begin('canonical:atlas')!;
  expect(retry).not.toBe(first);
  expect(requests.isCurrent(retry)).toBe(true);
});

it('keeps the newer source request current when the old request finishes', () => {
  const requests = new LoadRequestCoordinator();
  const old = requests.begin('canonical:atlas')!;
  const next = requests.begin('custom:atlas')!;
  expect(requests.isCurrent(old)).toBe(false);
  requests.finish(old);
  expect(requests.isCurrent(next)).toBe(true);
});

it('invalidates canceled requests even when the same source is requested again', () => {
  const requests = new LoadRequestCoordinator();
  const old = requests.begin('canonical:atlas')!;
  requests.cancel();
  expect(requests.isCurrent(old)).toBe(false);
  const next = requests.begin('canonical:atlas')!;
  requests.finish(old);
  expect(requests.isCurrent(next)).toBe(true);
});
