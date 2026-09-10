import { test, expect, type Page } from '@playwright/test';

async function savedAppearance(page: Page) {
  return page.evaluate(
    () => JSON.parse(localStorage.getItem('mekstation-appearance')!).state,
  );
}

async function surface(page: Page) {
  return page
    .locator('body')
    .evaluate((body) =>
      getComputedStyle(body).getPropertyValue('--surface-base').trim(),
    );
}

test('appearance palettes save immediately and survive navigation and reload @appearance', async ({
  page,
}, testInfo) => {
  await page.goto('/settings#appearance');
  await expect(
    page.getByRole('button', { name: 'Midnight blue', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await expect.poll(() => surface(page)).toBe('#122e50');
  const palettes = [
    ['Petrol teal', 'petrol', '#0e353d'],
    ['Field olive', 'field', '#2a381e'],
    ['Classic slate', 'slate', '#1e293b'],
    ['Royal violet', 'violet', '#2c1c47'],
    ['Burgundy', 'burgundy', '#3e1d30'],
    ['Copper', 'copper', '#3f2a1b'],
    ['Neon', 'neon', '#0f172a'],
    ['Tactical', 'tactical', '#0c1220'],
    ['Obsidian', 'minimal', '#161b22'],
    ['Midnight blue', 'default', '#122e50'],
  ];
  for (const [name, id, color] of palettes) {
    await page.getByRole('button', { name, exact: true }).click();
    await expect.poll(() => surface(page)).toBe(color);
    expect(await savedAppearance(page)).toMatchObject({ uiTheme: id });
    await expect(
      page.getByRole('button', { name: 'Save Theme', exact: true }),
    ).toHaveCount(0);
    expect(
      await page.locator('body').evaluate((body) => {
        const styles = getComputedStyle(body);
        return (
          styles.getPropertyValue('--background').trim() ===
          styles.getPropertyValue('--surface-deep').trim()
        );
      }),
    ).toBe(true);
    expect(
      await page
        .locator('body')
        .evaluate((body) =>
          Array.from(body.classList).filter((c) => c.startsWith('theme-')),
        ),
    ).toEqual([`theme-${id}`]);
  }
  await page.getByRole('button', { name: 'Petrol teal', exact: true }).click();
  await page.getByRole('button', { name: 'Violet', exact: true }).click();
  expect(await savedAppearance(page)).toMatchObject({
    uiTheme: 'petrol',
    accentColor: 'violet',
  });
  await page.reload();
  await expect.poll(() => surface(page)).toBe('#0e353d');
  await expect(
    page.getByRole('button', { name: 'Violet', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Field olive', exact: true }).click();
  await expect.poll(() => surface(page)).toBe('#2a381e');
  await page.getByRole('link', { name: 'Dashboard', exact: true }).click();
  await expect.poll(() => surface(page)).toBe('#2a381e');
  expect(await savedAppearance(page)).toMatchObject({
    uiTheme: 'field',
    accentColor: 'violet',
  });
  await page.goto('/settings#appearance');
  await page
    .getByRole('button', { name: 'Midnight blue', exact: true })
    .click();
  await page.reload();
  await expect.poll(() => surface(page)).toBe('#122e50');
  const palettePicker = page
    .getByRole('button', { name: 'Midnight blue', exact: true })
    .locator('xpath=../..');
  await palettePicker.screenshot({
    path: testInfo.outputPath('appearance-palettes.png'),
    animations: 'disabled',
  });
  await page
    .getByRole('button', { name: 'Midnight blue', exact: true })
    .scrollIntoViewIfNeeded();
  await page.screenshot({
    path: testInfo.outputPath('appearance-desktop.png'),
    fullPage: true,
    animations: 'disabled',
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(
    page.getByRole('button', { name: 'Midnight blue', exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  for (const name of ['Amber', 'Cyan', 'Emerald', 'Rose', 'Violet', 'Blue']) {
    const box = await page
      .getByRole('button', { name, exact: true })
      .boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
  await page
    .getByRole('button', { name: 'Midnight blue', exact: true })
    .scrollIntoViewIfNeeded();
  await palettePicker.screenshot({
    path: testInfo.outputPath('appearance-palettes-mobile.png'),
    animations: 'disabled',
  });
  await page.screenshot({
    path: testInfo.outputPath('appearance-mobile.png'),
    fullPage: true,
    animations: 'disabled',
  });
});

test('catalog density and focus outlines fit the annotated viewport @appearance', async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1180, height: 912 });
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
  const categories = page.getByRole('group', {
    name: 'Equipment categories',
    exact: true,
  });
  const energy = categories.getByRole('button', {
    name: 'Energy',
    exact: true,
  });
  await energy.click();
  await energy.focus();
  const bounds = await categories.boundingBox();
  const button = await energy.boundingBox();
  expect(button!.x - bounds!.x).toBeGreaterThanOrEqual(4);
  expect(button!.y - bounds!.y).toBeGreaterThanOrEqual(4);
  expect(
    bounds!.y + bounds!.height - button!.y - button!.height,
  ).toBeGreaterThanOrEqual(4);
  const row = page
    .getByRole('region', { name: 'Equipment catalog' })
    .locator('li')
    .first();
  await expect(row).toBeVisible();
  const rowBox = await row.boundingBox();
  expect(rowBox!.height).toBeLessThanOrEqual(50);
  const footer = page.getByTestId('equipment-pagination');
  const footerBox = await footer.boundingBox();
  expect(footerBox!.height).toBeLessThanOrEqual(54);
  for (const control of [
    row.getByRole('button').first(),
    row.getByRole('button').last(),
    page.getByRole('button', { name: 'Next page', exact: true }),
  ]) {
    expect((await control.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  }
  await page.screenshot({
    path: testInfo.outputPath('catalog-density-focus.png'),
    fullPage: true,
    animations: 'disabled',
  });
  await testInfo.attach('layout-measurements.json', {
    body: JSON.stringify(
      { bounds, button, row: rowBox, footer: footerBox },
      null,
      2,
    ),
    contentType: 'application/json',
  });
});
