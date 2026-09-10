import { test, expect } from '@playwright/test';

// Exercise the normal production browser lifecycle, including service workers.
test('missing draft recovers to a stable customizer index @customizer', async ({
  page,
}) => {
  await page.goto('/customizer/1d1f3290-748c-469c-a534-79e9dd09a115/structure');
  await expect(
    page.getByRole('button', { name: 'Load from Library' }),
  ).toBeVisible();
  // The regression appeared after the three-second production route fallback.
  await page.waitForTimeout(4500);
  await expect(page).toHaveURL(/\/customizer$/);
  await expect(page.getByText('Invalid unit ID', { exact: true })).toHaveCount(
    0,
  );
  await expect(
    page.getByRole('button', { name: 'Load from Library' }),
  ).toBeVisible();
});

test('registered draft and edits survive a full-page deep link @customizer', async ({
  page,
  context,
}) => {
  await page.goto('/customizer');
  await page.getByRole('button', { name: 'Load from Library' }).click();
  await page
    .getByRole('dialog')
    .getByRole('combobox')
    .first()
    .selectOption('canonical');
  await page
    .getByPlaceholder('Search by chassis or variant...')
    .fill('Atlas AS7-D');
  await page.getByText('AS7-D', { exact: true }).click();
  await page.getByRole('button', { name: 'Load Unit', exact: true }).click();
  await page.getByRole('dialog').waitFor({ state: 'hidden' });
  await page.getByRole('tab', { name: 'Fluff', exact: true }).click();
  await page
    .getByRole('combobox', { name: 'Combat Role', exact: true })
    .selectOption('Brawler');
  const saved = await page.evaluate(() => {
    const id = location.pathname.split('/')[2];
    return {
      id,
      unit: JSON.parse(localStorage.getItem(`megamek-unit-${id}`)!).state,
      tabs: JSON.parse(localStorage.getItem('megamek-tab-manager')!).state.tabs,
    };
  });
  expect(saved.tabs.some((tab: { id: string }) => tab.id === saved.id)).toBe(
    true,
  );
  expect(saved.unit.role).toBe('Brawler');
  expect(saved.unit.equipment.length).toBeGreaterThan(0);
  const reloaded = await context.newPage();
  await reloaded.goto(`/customizer/${saved.id}/fluff`);
  await expect(
    reloaded.getByRole('combobox', { name: 'Combat Role', exact: true }),
  ).toHaveValue('Brawler');
  await reloaded.waitForTimeout(4500);
  await expect(
    reloaded.getByText('Invalid unit ID', { exact: true }),
  ).toHaveCount(0);
  await expect(
    reloaded.getByRole('combobox', { name: 'Combat Role', exact: true }),
  ).toHaveValue('Brawler');
  expect(
    await reloaded.evaluate(
      (id) =>
        JSON.parse(localStorage.getItem(`megamek-unit-${id}`)!).state.equipment,
      saved.id,
    ),
  ).toEqual(saved.unit.equipment);
  await reloaded.close();
});
