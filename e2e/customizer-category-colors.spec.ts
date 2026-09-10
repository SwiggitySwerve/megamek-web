import { test, expect, type Locator } from '@playwright/test';

async function paint(locator: Locator) {
  return locator.evaluate((element) => {
    const style = getComputedStyle(element);
    return { background: style.backgroundColor, text: style.color };
  });
}

test('equipment colors survive catalog, grouping, mounting and reload @customizer', async ({
  page,
}, testInfo) => {
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
  await page.getByRole('tab', { name: 'Equipment', exact: true }).click();
  const search = page.getByRole('textbox', {
    name: 'Search equipment',
    exact: true,
  });
  const colors: Record<string, { background: string; text: string }> = {};
  for (const name of ['Small Laser', 'AC/20', 'LRM 20', 'AC/20 Ammo']) {
    await search.fill(name);
    const details = page.getByRole('button', {
      name: `Details for ${name}`,
      exact: true,
    });
    await expect(details).toBeVisible();
    colors[name] = await paint(details.locator('xpath=ancestor::li'));
    expect(colors[name].background).not.toBe('rgba(0, 0, 0, 0)');
    expect(
      await details
        .locator('span')
        .first()
        .evaluate((e) => getComputedStyle(e).color),
    ).toBe(colors[name].text);
  }
  expect(new Set(Object.values(colors).map((c) => c.background)).size).toBe(4);
  expect(colors['Small Laser'].text).toBe('rgb(0, 0, 0)');
  await search.fill('Small Laser');
  await expect(
    page.getByRole('region', { name: 'Equipment catalog' }).locator('li'),
  ).toHaveCount(1);
  await page
    .getByRole('button', { name: 'Add Small Laser', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Add Small Laser', exact: true })
    .click();
  const expand = page.getByTitle('Expand loadout', { exact: true });
  if (await expand.isVisible()) await expand.click();
  const group = page.getByRole('button', {
    name: 'Show 2 instances of Small Laser in Unassigned',
    exact: true,
  });
  await expect(group).toBeVisible();
  expect(await paint(group.locator('..'))).toEqual(colors['Small Laser']);
  await group.click();
  await page.mouse.move(0, 0);
  const item = page
    .getByRole('button', {
      name: 'Select Small Laser in unallocated loadout',
      exact: true,
    })
    .first();
  expect(await paint(item.locator('..'))).toEqual(colors['Small Laser']);
  await page.screenshot({
    path: testInfo.outputPath('equipment-restored.png'),
    fullPage: true,
  });
  await page.getByRole('tab', { name: 'Critical Slots', exact: true }).click();
  await item.click();
  await page
    .getByRole('region', { name: 'Equipment placement' })
    .getByRole('combobox', { name: 'Place selected equipment' })
    .selectOption('Left Arm');
  const mounted = page
    .getByRole('group', { name: 'Left Arm critical slots', exact: true })
    .getByRole('gridcell', { name: 'Slot 7: Small Laser', exact: true });
  await expect(mounted).toBeVisible();
  await page.mouse.move(0, 0);
  await expect.poll(() => paint(mounted)).toEqual(colors['Small Laser']);
  const engine = page
    .getByRole('gridcell', { name: /: .*Engine$|: Engine$/ })
    .first();
  const gyro = page.getByRole('gridcell', { name: /: Standard Gyro$/ }).first();
  await expect(engine).toBeVisible();
  expect((await paint(engine)).background).not.toBe(
    (await paint(gyro)).background,
  );
  await page.reload();
  await expect(mounted).toBeVisible();
  await expect.poll(() => paint(mounted)).toEqual(colors['Small Laser']);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(mounted).toBeVisible();
  await expect.poll(() => paint(mounted)).toEqual(colors['Small Laser']);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: testInfo.outputPath('criticals-restored-mobile.png'),
    fullPage: true,
  });
  await testInfo.attach('category-colors.json', {
    body: JSON.stringify(colors, null, 2),
    contentType: 'application/json',
  });
});
